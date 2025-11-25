import { Editor, OnMount } from '@monaco-editor/react';
import React, { useCallback, useEffect, useRef } from 'react';
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
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Provide safe defaults when context is null to avoid conditional hooks
  const defaults = {
    configInput: undefined as string | undefined,
    setConfigInput: ((
      _val: string | undefined
    ) => {}) as unknown as React.Dispatch<
      React.SetStateAction<string | undefined>
    >,
    injectionInput: undefined as string[][] | undefined,
    generateNow: (async () => {}) as (
      textInput: string | undefined,
      injectionInput: string[][] | undefined,
      options?: { pointsonly: boolean }
    ) => Promise<void>,
  };

  const { configInput, setConfigInput, injectionInput, generateNow } =
    configContext ?? defaults;

  /**
   * Handles changes in the editor's content.
   * Updates the global configuration state if the input is valid.
   * @param {string | undefined} textInput - The new text content from the editor.
   */
  const handleChange = useCallback(
    async (textInput: string | undefined) => {
      if (!textInput) return null;

      setConfigInput(textInput);
    },
    [setConfigInput]
  );

  useEffect(() => {
    handleChange(configInput);
  }, [configInput, handleChange]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.addAction({
      id: 'generate-config',
      label: 'Generate',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        const currentConfig = editor.getValue();
        // Also update the context state so the UI is in sync
        setConfigInput(currentConfig);
        generateNow(currentConfig, injectionInput, { pointsonly: false });
      },
    });

    // Handle window and container resize to update Monaco Editor layout
    const updateLayout = () => {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        editor.layout();
      });
    };

    // Listen to window resize events
    window.addEventListener('resize', updateLayout);

    // Use ResizeObserver to detect container size changes
    const container = containerRef.current;
    let resizeObserver: ResizeObserver | null = null;

    if (container && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateLayout();
      });
      resizeObserver.observe(container);
    }

    // Store cleanup function in ref for cleanup on unmount
    cleanupRef.current = () => {
      window.removeEventListener('resize', updateLayout);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  };

  // Cleanup resize listeners when component unmounts
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  if (!configContext) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      data-testid={dataTestId}
      aria-label={ariaLabel}
    >
      <Editor
        height="100%"
        defaultLanguage="yaml"
        language="yaml"
        onChange={handleChange}
        onMount={handleEditorDidMount}
        value={configInput}
        theme={'ergogen-theme'}
        defaultValue={configInput}
        options={options || undefined}
      />
    </div>
  );
};

export default ConfigEditor;
