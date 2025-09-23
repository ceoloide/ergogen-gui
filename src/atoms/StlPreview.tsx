import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

type Props = {
  previewContent: string;
};

const StlPreview = ({ previewContent }: Props) => {
  const geom = useMemo(() => new STLLoader().parse(previewContent), [previewContent]);
  const ref = useRef<THREE.Mesh>(null!);

  return (
    <Canvas camera={{ position: [0, 0, 200] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={ref}>
        <primitive object={geom} attach="geometry" />
        <meshStandardMaterial color="orange" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
};

export default StlPreview;
