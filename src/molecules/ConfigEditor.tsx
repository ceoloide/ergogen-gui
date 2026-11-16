import { Editor, OnMount } from '@monaco-editor/react';
import React, { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import { useConfigContext } from '../context/ConfigContext';

/**
 * Defines the options for the Monaco Editor instance.
 * @typedef {object} EditorOptions
 * @property {boolean} [readOnly] - If true, the editor will be in read-only mode.
 */
type EditorOptions = {
  readOnly?: boolean;
};

/**
 * Props for the ConfigEditor component.
 * @typedef {object} Props
 * @property {string} [className] - An optional CSS class name for the component's container.
 * @property {EditorOptions} [options] - Optional settings for the Monaco Editor.
 * @property {string} [data-testid] - An optional data-testid attribute for testing purposes.
 */
type Props = {
  className?: string;
  options?: EditorOptions;
  'data-testid'?: string;
  'aria-label'?: string;
};

type EditorInstance = Parameters<OnMount>[0];

/**
 * Replaces only the part of the editor's text that differs from `next`, as
 * one undoable edit, so the cursor and the scroll position follow the text
 * around them instead of jumping.
 */
const replaceChangedText = (editor: EditorInstance, next: string) => {
  const model = editor.getModel();
  if (!model) return;
  const current = model.getValue();
  let start = 0;
  const limit = Math.min(current.length, next.length);
  while (start < limit && current[start] === next[start]) start++;
  let end = 0;
  while (
    end < limit - start &&
    current[current.length - 1 - end] === next[next.length - 1 - end]
  ) {
    end++;
  }
  const from = model.getPositionAt(start);
  const to = model.getPositionAt(current.length - end);
  model.pushEditOperations(
    editor.getSelections() ?? [],
    [
      {
        range: {
          startLineNumber: from.lineNumber,
          startColumn: from.column,
          endLineNumber: to.lineNumber,
          endColumn: to.column,
        },
        text: next.slice(start, next.length - end),
      },
    ],
    () => null
  );
  if (model.getValue() !== next) model.setValue(next);
};

/**
 * A component that provides a YAML editor for configuring Ergogen settings.
 * It uses the Monaco Editor for a rich editing experience and integrates with the ConfigContext
 * to manage the configuration state.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A container with the Monaco Editor instance.
 */
const ConfigEditor = ({
  className,
  options,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
}: Props) => {
  const configContext = useConfigContext();
  const editorRef = useRef<EditorInstance | null>(null);

  // Provide safe defaults when context is null to avoid conditional hooks
  const defaults = {
    configInput: undefined as string | undefined,
    setConfigInput: ((
      _val: string | undefined
    ) => {}) as unknown as React.Dispatch<
      React.SetStateAction<string | undefined>
    >,
    updateRealtimeConfigInput: (_val: string | undefined) => {},
    injectionInput: undefined as string[][] | undefined,
    generateNow: (async () => {}) as (
      textInput: string | undefined,
      injectionInput: string[][] | undefined,
      options?: { pointsonly: boolean }
    ) => Promise<void>,
    activeConfigId: null as string | null,
  };

  const {
    configInput,
    updateRealtimeConfigInput,
    setConfigInput,
    injectionInput,
    generateNow,
    activeConfigId,
  } = configContext ?? defaults;

  // The last text this editor saved to the context. When `configInput`
  // comes back as that text, it is the echo of typing here; any other value
  // was written elsewhere (the Build view, undo there, loading a file).
  const savedByEditorRef = useRef<string | null>(null);
  // True while the editor shows a change from outside, whose change events
  // must not save that text back as if it had been typed here.
  const syncingRef = useRef(false);

  // Create a debounced setConfigInput to avoid updating context on every keystroke
  const debouncedSetConfigInput = useRef(
    debounce((val: string) => {
      savedByEditorRef.current = val;
      setConfigInput(val);
    }, 500)
  ).current;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetConfigInput.cancel();
    };
  }, [debouncedSetConfigInput]);

  // Sync editor value with context configInput (only when changed from outside)
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || configInput === undefined) return;
    if (configInput === savedByEditorRef.current) {
      // The echo of typing here, which may already be behind the editor.
      savedByEditorRef.current = null;
      return;
    }
    if (configInput === editor.getValue()) return;
    // A change from outside wins over typing that has not been saved yet:
    // whoever wrote it started from the latest text (the realtime value), and
    // the pending save would otherwise overwrite it. It also applies while
    // the editor has focus.
    debouncedSetConfigInput.cancel();
    savedByEditorRef.current = null;
    syncingRef.current = true;
    try {
      replaceChangedText(editor, configInput);
    } finally {
      syncingRef.current = false;
    }
  }, [configInput, debouncedSetConfigInput]);

  /**
   * Handles changes in the editor's content.
   * Updates the global configuration state if the input is valid.
   * @param {string | undefined} textInput - The new text content from the editor.
   */
  const handleChange = useCallback(
    (textInput: string | undefined) => {
      if (textInput === undefined) return;

      // Sync the realtime value ref immediately (without triggering re-renders)
      updateRealtimeConfigInput(textInput);

      // Showing a change from outside: the context already holds it.
      if (syncingRef.current) return;

      // Debounce the state/localStorage update
      debouncedSetConfigInput(textInput);
    },
    [debouncedSetConfigInput, updateRealtimeConfigInput]
  );

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Flush/save changes immediately on blur to ensure download/generate buttons have the latest value
    editor.onDidBlurEditorText(() => {
      debouncedSetConfigInput.flush();
    });

    editor.addAction({
      id: 'generate-config',
      label: 'Generate',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        const currentConfig = editor.getValue();
        // Cancel pending debounces and apply immediately
        debouncedSetConfigInput.cancel();
        updateRealtimeConfigInput(currentConfig);
        savedByEditorRef.current = currentConfig;
        setConfigInput(currentConfig);
        generateNow(currentConfig, injectionInput, {
          pointsonly: false,
          isManual: true,
        });
      },
    });
  };

  if (!configContext) return null;

  return (
    <div className={className} data-testid={dataTestId} aria-label={ariaLabel}>
      <Editor
        key={activeConfigId || 'preview'}
        height="100%"
        defaultLanguage="yaml"
        language="yaml"
        onChange={handleChange}
        onMount={handleEditorDidMount}
        defaultValue={configInput}
        theme={'ergogen-theme'}
        options={options || undefined}
      />
    </div>
  );
};

export default ConfigEditor;
