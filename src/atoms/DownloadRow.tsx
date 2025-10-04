import styled from 'styled-components';
import { DownloadRowButton } from './Buttons';

export interface Preview {
  extension: string;
  key: string;
  content: string;
}

type Props = {
  fileName: string;
  extension: string;
  content: string;
  preview?: Preview;
  setPreview: (preview: Preview) => void;
  previewKey: string;
};

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;

  @media (max-width: 639px) {
    padding-bottom: 0.75rem;
  }
`;

const FileName = styled.div<{ active: boolean; hasPreview: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  cursor: ${(props) => (props.hasPreview ? 'pointer' : 'default')};
  border-bottom: ${(props) =>
    props.active ? '2px solid #28a745' : '2px solid transparent'};
  border-top: 2px solid transparent;
`;

const Buttons = styled.div`
  white-space: nowrap;
  display: flex;
  gap: 10px;
  align-items: center;
`;

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
    URL.revokeObjectURL(element.href);
    document.body.removeChild(element);
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
        <DownloadRowButton onClick={handleDownload}>
          <span className="material-symbols-outlined">download</span>
        </DownloadRowButton>
      </Buttons>
    </Row>
  );
};

export default DownloadRow;
