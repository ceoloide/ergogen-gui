import type { EditorProps } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';

/**
 * Props for the TextPreview component.
 * @typedef {object} Props
 * @property {string} content - The text content to display.
 * @property {string} [language] - The programming language for syntax highlighting.
 * @property {string} [className] - An optional CSS class for the container.
 * @property {string} [height] - The height of the editor.
 * @property {EditorProps['options']} [options] - Optional Monaco Editor options.
 * @property {string} [aria-label] - An optional aria-label for the preview container.
 * @property {string} [data-testid] - An optional data-testid for testing purposes.
 */
type Props = {
  content: string;
  language?: string;
  className?: string;
  height?: string;
  options?: EditorProps['options'];
  'aria-label'?: string;
  'data-testid'?: string;
};

const TextPreview = ({
  content,
  language,
  className,
  height,
  options,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}: Props) => {
  return (
    <div className={className} aria-label={ariaLabel} data-testid={dataTestId}>
      <Editor
        height={height || '80vh'}
        language={language}
        value={content}
        theme={'ergogen-theme'}
        options={options || { readOnly: true }}
      />
    </div>
  );
};

export default TextPreview;
