import React, { useRef, useEffect } from 'react';

type Props = {
  jscad: string,
  width?: number | string,
  height?: number | string,
};

const JscadPreview = ({ jscad, width = '100%', height = '100%' }: Props) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const processorRef = useRef<any>(null);

  useEffect(() => {
    if (viewerRef.current) {
      // Initialize OpenJSCAD Processor
      processorRef.current = new (window as any).OpenJsCad.Processor(viewerRef.current, {
        drawLines: false,
        drawFaces: true,
        plate: {
          draw: false
        },
        axis: {
          draw: false
        }
      });
    }

    return () => {
      // Cleanup
      if (processorRef.current) {
        processorRef.current.clear();
      }
    };
  }, []);

  useEffect(() => {
    if (processorRef.current && jscad) {
      processorRef.current.setJsCad(jscad);
    }
  }, [jscad]);

  return (
    <div ref={viewerRef} style={{ width, height, border: '1px solid #ccc' }} />
  );
};

export default JscadPreview;
