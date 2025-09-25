import { StlViewer } from "react-stl-viewer";

type Props = {
  stl: string,
};

const StlPreview = ({ stl }: Props) => {
  const blob = new Blob([stl], { type: 'application/sla' });
  const url = URL.createObjectURL(blob);
  return (
    <StlViewer
      style={{
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
      url={url}
      orbitControls
    />
  )
};

export default StlPreview;