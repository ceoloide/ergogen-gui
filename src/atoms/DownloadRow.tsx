import styled from 'styled-components';
import { theme } from '../theme/theme';

/**
 * Interface for a preview object.
 * @interface Preview
 * @property {string} extension - The file extension of the preview content.
 * @property {string} key - A unique key for the preview.
 * @property {string} content - The content of the preview.
 */
export interface Preview {
  extension: string;
  key: string;
  content: string;
}

/**
 * Props for the DownloadRow component.
 * @typedef {object} Props
 * @property {string} fileName - The name of the file to be downloaded.
 * @property {string} extension - The file extension.
 * @property {string} content - The content of the file.
 * @property {Preview} [preview] - An optional preview object. If provided, a preview button is shown.
 * @property {(preview: Preview) => void} setPreview - Function to set the active preview.
 */
type Props = {
  fileName: string;
  extension: string;
  content: string;
  preview?: Preview;
  setPreview: (preview: Preview) => void;
  previewKey: string;
};

/**
 * A styled div for the row layout.
 */
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;

  @media (max-width: 639px) {
    padding-bottom: 0.75rem;
  }
`;

/**
 * A styled div for displaying the file name, with ellipsis for overflow.
 */
const FileName = styled.div<{ active: boolean; hasPreview: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${theme.fontSizes.bodySmall};
  cursor: ${(props) => (props.hasPreview ? 'pointer' : 'default')};
  border-bottom: ${(props) =>
    props.active
      ? `2px solid ${theme.colors.accent}`
      : '2px solid transparent'};
  border-top: 2px solid transparent;
`;

/**
 * A styled div to contain the action buttons.
 */
const Buttons = styled.div`
  white-space: nowrap;
  display: flex;
  gap: 10px;
  align-items: center;
`;

/**
 * A styled anchor tag that looks like a button.
 * Used for preview and download actions.
 */
const StyledLinkButton = styled.a`
    background-color: ${theme.colors.background};
    border: none;
    border-radius: 6px;
    color: ${theme.colors.white};
    display: flex;
    align-items: center;
    padding: 4px 6px;
    text-decoration: none;
    cursor: pointer;
    font-size: ${theme.fontSizes.bodySmall};
    line-height: 16px;
    gap: 6px
    height: 34px;

    .material-symbols-outlined {
        font-size: ${theme.fontSizes.iconMedium} !important;
    }

    &:hover {
        background-color: ${theme.colors.buttonHover};
    }
`;

/**
 * A component that displays a file name and provides buttons for previewing and downloading.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A row with the file name and action buttons.
 */
const DownloadRow = ({
  fileName,
  extension,
  content,
  preview,
  setPreview,
  previewKey,
}: Props) => {
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'octet/stream' });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.${extension}`;
    document.body.appendChild(element);
    element.click();
  };

  const handlePreview = () => {
    if (preview) {
      setPreview(preview);
    }
  };

  return (
    <Row>
      <FileName
        active={previewKey === preview?.key}
        hasPreview={!!preview}
        onClick={handlePreview}
      >
        {fileName}.{extension}
      </FileName>
      <Buttons>
        <StyledLinkButton onClick={handleDownload}>
          <span className="material-symbols-outlined">download</span>
        </StyledLinkButton>
      </Buttons>
    </Row>
  );
};

export default DownloadRow;
