import PcbPreview from '../atoms/PcbPreview';
import StlPreview from '../atoms/StlPreview';
import SvgPreview from '../atoms/SvgPreview';
import TextPreview from '../atoms/TextPreview';

/**
 * Props for the FilePreview component.
 * @typedef {object} Props
 * @property {string} previewExtension - The file extension of the content to be previewed (e.g., 'svg', 'yaml').
 * @property {string} previewKey - A unique key for the preview component, essential for re-rendering.
 * @property {string} previewContent - The actual content of the file to be displayed.
 * @property {number | string} [width='100%'] - The width of the preview area.
 * @property {number | string} [height='100%'] - The height of the preview area.
 * @property {string} [className] - An optional CSS class for the container div.
 * @property {string} [data-testid] - An optional data-testid for testing purposes.
 */
type Props = {
  previewExtension: string;
  previewKey: string;
  previewContent: string | ArrayBuffer | Uint8Array;
  width?: number | string;
  height?: number | string;
  className?: string;
  'data-testid'?: string;
  'aria-label'?: string;
};

/**
 * A component that dynamically renders a preview for different file types.
 * It selects the appropriate preview component based on the file extension.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A container with the rendered file preview.
 */
const FilePreview = ({
  previewExtension,
  previewContent,
  previewKey,
  width = '100%',
  height = '100%',
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
}: Props) => {
  /**
   * Renders the correct preview component based on the file extension.
   * @param {string} extension - The file extension.
   * @returns {JSX.Element | string} The appropriate preview component or a "no preview" message.
   */
  const renderFilePreview = (extension: string) => {
    switch (extension) {
      case 'svg':
        return (
          <SvgPreview
            svg={previewContent}
            width={width}
            height={height}
            aria-label={ariaLabel || `SVG preview for ${previewKey}`}
            data-testid={dataTestId && `${dataTestId}-svg`}
          />
        );
      case 'yaml':
        return (
          <TextPreview
            language="yaml"
            content={previewContent}
            aria-label={ariaLabel || `YAML preview for ${previewKey}`}
            data-testid={dataTestId && `${dataTestId}-yaml`}
          />
        );
      case 'txt':
        return (
          <TextPreview
            language="text"
            content={previewContent}
            aria-label={ariaLabel || `Text preview for ${previewKey}`}
            data-testid={dataTestId && `${dataTestId}-txt`}
          />
        );
      case 'jscad':
        return (
          <TextPreview
            language="javascript"
            content={previewContent}
            aria-label={ariaLabel || `JSCAD code preview for ${previewKey}`}
            data-testid={dataTestId && `${dataTestId}-jscad-text`}
          />
        );
      case 'kicad_pcb':
        return (
          <PcbPreview
            pcb={previewContent}
            key={previewKey}
            aria-label={ariaLabel || `PCB preview for ${previewKey}`}
            data-testid={dataTestId && `${dataTestId}-pcb`}
          />
        );
      case 'stl':
        return (
          <StlPreview
            stl={previewContent}
            aria-label={ariaLabel || `STL preview for ${previewKey}`}
            data-testid={dataTestId && `${dataTestId}-stl`}
          />
        );
      default:
        return 'No preview available';
    }
  };

  return (
    <div className={className} data-testid={dataTestId} aria-label={ariaLabel}>
      {renderFilePreview(previewExtension)}
    </div>
  );
};

export default FilePreview;
