import React, { useRef, useEffect, useState } from 'react';

type Props = {
  jscad: string,
  width?: number | string,
  height?: number | string,
};

const JscadPreview = ({ jscad, width = '100%', height = '100%' }: Props) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const processorRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = () => {
      if ((window as any).OpenJsCad && viewerRef.current) {
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
        setIsInitialized(true);
      }
    };

    const intervalId = setInterval(() => {
      if ((window as any).OpenJsCad) {
        clearInterval(intervalId);
        initialize();
      }
    }, 100);

    return () => {
      // Cleanup
      clearInterval(intervalId);
      if (processorRef.current) {
        processorRef.current.clear();
      }
    };
  }, []);

  useEffect(() => {
    if (isInitialized && processorRef.current && jscad) {
      processorRef.current.setJsCad(jscad);
    }
  }, [jscad, isInitialized]);

  return (
    <div ref={viewerRef} style={{ width, height, border: '1px solid #ccc' }}>
      {!isInitialized && <div>Loading JSCAD Preview...</div>}
    </div>
  );
};

export default JscadPreview;
