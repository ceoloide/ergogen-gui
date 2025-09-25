import { StlViewer } from "react-stl-viewer";

type Props = {
  stl: string,
};

const StlPreview = ({ stl }: Props) => {
  return (
    <StlViewer
      style={{
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
      url={stl}
      orbitControls
    />
  )
};

export default StlPreview;