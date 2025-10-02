import {Editor, useMonaco} from "@monaco-editor/react";
import React, {useEffect} from "react";
import {useConfigContext} from "../context/ConfigContext";
import {registerErgogenLanguage} from "../utils/ergogen-language";

/**
 * Defines the options for the Monaco Editor instance.
 * @typedef {object} EditorOptions
 * @property {boolean} [readOnly] - If true, the editor will be in read-only mode.
 */
type EditorOptions = {
  readOnly?: boolean,
}

/**
 * Props for the ConfigEditor component.
 * @typedef {object} Props
 * @property {string} [className] - An optional CSS class name for the component's container.
 * @property {EditorOptions} [options] - Optional settings for the Monaco Editor.
 * @property {string} [data-testid] - An optional data-testid attribute for testing purposes.
 */
type Props = {
  className?: string,
  options?: EditorOptions,
  "data-testid"?: string
};

/**
 * A component that provides a YAML editor for configuring Ergogen settings.
 * It uses the Monaco Editor for a rich editing experience and integrates with the ConfigContext
 * to manage the configuration state.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A container with the Monaco Editor instance.
 */
const ConfigEditor = ({className, options, "data-testid": dataTestId}: Props) => {
    const configContext = useConfigContext();
    const monaco = useMonaco();

    // @ts-ignore
    const {configInput, setConfigInput} = configContext;

    // Register the custom Ergogen language for syntax highlighting
    useEffect(() => {
        registerErgogenLanguage(monaco);
    }, [monaco]);

    /**
     * Handles changes in the editor's content.
     * Updates the global configuration state if the input is valid.
     * @param {string | undefined} textInput - The new text content from the editor.
     */
    const handleChange = async (textInput: string | undefined) => {
        if(!textInput) return null;

        setConfigInput(textInput);
    }

    useEffect(() => {
        handleChange(configInput);
    }, [configInput]);

    return (
        <div className={className} data-testid={dataTestId}>
            <Editor
                height="100%"
                defaultLanguage="ergogen"
                language="ergogen"
                onChange={handleChange}
                value={configInput}
                theme={"ergogen-theme"}
                defaultValue={configInput}
                options={options || undefined}
            />
        </div>
    );
}

export default ConfigEditor;