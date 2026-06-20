import { Editor, OnMount } from '@monaco-editor/react';
import React, { useCallback } from 'react';
import { useConfigContext } from '../context/ConfigContext';

type EditorOptions = {
  readOnly?: boolean;
};

type Props = {
  className?: string;
  options?: EditorOptions;
  'data-testid'?: string;
  'aria-label'?: string;
};

const ConfigEditor = ({
  className,
  options,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
}: Props) => {
  const configContext = useConfigContext();

  const handleChange = useCallback(
    (textInput: string | undefined) => {
      if (textInput !== undefined && configContext) {
        configContext.setConfigInput(textInput);
      }
    },
    [configContext]
  );

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editor.addAction({
      id: 'generate-config',
      label: 'Generate',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        const currentConfig = editor.getValue();
        if (configContext) {
          configContext.setConfigInput(currentConfig);
          configContext.generateNow(currentConfig, configContext.injectionInput, { pointsonly: false });
        }
      },
    });
  };

  if (!configContext) return null;

  return (
    <div className={className} data-testid={dataTestId} aria-label={ariaLabel}>
      <Editor
        height="100%"
        defaultLanguage="yaml"
        language="yaml"
        onChange={handleChange}
        onMount={handleEditorDidMount}
        value={configContext.configInput}
        theme={'ergogen-theme'}
        options={options || undefined}
      />
    </div>
  );
};

export default ConfigEditor;
