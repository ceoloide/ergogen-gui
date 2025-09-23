import JscadPreview from "../atoms/JscadPreview";
import PcbPreview from "../atoms/PcbPreview";
import StlPreview from "../atoms/StlPreview";
import SvgPreview from "../atoms/SvgPreview";
import TextPreview from "../atoms/TextPreview";

type Props = {
  previewExtension: string,
  previewKey: string,
  previewContent: string,
  width?: number | string,
  height?: number | string,
  className?: string,
  jscadPreview?: boolean
};

const FilePreview = ({ previewExtension, previewContent, previewKey, width = '100%', height = '100%', className, jscadPreview }: Props) => {
  const renderFilePreview = (extension: string) => {
    switch (extension) {
      case 'svg':
        return (
          <SvgPreview svg={previewContent} width={width} height={height} />
        )
      case 'yaml':
        return (
          <TextPreview language="yaml" content={previewContent} />
        )
      case 'txt':
        return (
          <TextPreview language="text" content={previewContent} />
        )
      case 'jscad':
        return (
          jscadPreview ?
            <JscadPreview jscad={previewContent} /> :
            <TextPreview language="javascript" content={previewContent} />
        )
      case 'kicad_pcb':
        return (
          <PcbPreview pcb={previewContent} key={previewKey} />
        )
      case 'stl':
        return (
          <StlPreview previewContent={previewContent} />
        )
      default:
        return "No preview available";
    }
  };

  return (
    <div className={className}>
      {renderFilePreview(previewExtension)}
    </div>
  );
}

export default FilePreview;