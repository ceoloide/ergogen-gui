import React, { Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import * as THREE from 'three';

/**
 * Props for the StlPreview component.
 * @interface StlPreviewProps
 * @property {string} stl - The STL content as a string (ASCII or binary format).
 * @property {string} [aria-label] - An optional aria-label for the preview container.
 * @property {string} [data-testid] - An optional data-testid for testing purposes.
 */
interface StlPreviewProps {
  stl: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

/**
 * A styled container for the Canvas to ensure proper sizing.
 */
const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.backgroundLight};
`;

/**
 * Error boundary component for the Canvas
 */
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Canvas error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: theme.colors.text,
          }}
        >
          Error loading 3D preview:{' '}
          {this.state.error?.message || 'Unknown error'}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Debug display component for camera orientation
 */
const DebugDisplay: React.FC = () => {
  const { camera, controls } = useThree();
  const [orientation, setOrientation] = React.useState('');

  React.useEffect(() => {
    const updateOrientation = () => {
      const euler = new THREE.Euler().setFromQuaternion(
        camera.quaternion,
        'YXZ'
      );
      const pitch = THREE.MathUtils.radToDeg(euler.x).toFixed(2);
      const yaw = THREE.MathUtils.radToDeg(euler.y).toFixed(2);
      const roll = THREE.MathUtils.radToDeg(euler.z).toFixed(2);
      setOrientation(`Pitch: ${pitch}, Yaw: ${yaw}, Roll: ${roll}`);
    };

    if (controls) {
      (controls as OrbitControlsImpl).addEventListener(
        'change',
        updateOrientation
      );
      updateOrientation(); // Initial update
    }

    return () => {
      if (controls) {
        (controls as OrbitControlsImpl).removeEventListener(
          'change',
          updateOrientation
        );
      }
    };
  }, [camera, controls]);

  return (
    <Html>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '5px',
          borderRadius: '3px',
        }}
      >
        {orientation}
      </div>
    </Html>
  );
};

/**
 * Component to fit camera to the model
 */
const CameraController: React.FC<{
  geometry: THREE.BufferGeometry | null;
}> = ({ geometry }) => {
  const { camera, size } = useThree();

  React.useEffect(() => {
    if (geometry && geometry.boundingBox) {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      const box = geometry.boundingBox;
      const boxSize = box.getSize(new THREE.Vector3());
      const boxCenter = box.getCenter(new THREE.Vector3());

      const customRotation = new THREE.Euler(
        THREE.MathUtils.degToRad(-23),
        THREE.MathUtils.degToRad(23),
        0,
        'YXZ'
      );
      const cameraDirection = new THREE.Vector3(0, 0, 1)
        .applyEuler(customRotation)
        .normalize();

      // Project box size onto camera's view plane
      const cameraUp = new THREE.Vector3(0, 1, 0).applyEuler(
        perspectiveCamera.rotation
      );
      const cameraRight = new THREE.Vector3(1, 0, 0).applyEuler(
        perspectiveCamera.rotation
      );

      const projectedWidth =
        Math.abs(boxSize.x * cameraRight.x) +
        Math.abs(boxSize.y * cameraRight.y) +
        Math.abs(boxSize.z * cameraRight.z);
      const projectedHeight =
        Math.abs(boxSize.x * cameraUp.x) +
        Math.abs(boxSize.y * cameraUp.y) +
        Math.abs(boxSize.z * cameraUp.z);

      const fovInRadians = THREE.MathUtils.degToRad(perspectiveCamera.fov);
      const aspect = size.width / size.height;

      const distanceForWidth =
        projectedWidth / (2 * Math.tan(fovInRadians / 2) * aspect);
      const distanceForHeight =
        projectedHeight / (2 * Math.tan(fovInRadians / 2));

      const distance = Math.max(distanceForWidth, distanceForHeight) * 1.25;

      const cameraPosition = cameraDirection.multiplyScalar(distance);
      perspectiveCamera.position.copy(cameraPosition);
      perspectiveCamera.lookAt(boxCenter);
      perspectiveCamera.updateProjectionMatrix();

    }
  }, [geometry, camera, size]);

  return null;
};

/**
 * A React component that renders a 3D preview of an STL file.
 * It uses react-three-fiber and drei to provide a fully interactive 3D viewer
 * with rotate, pan, and zoom capabilities.
 *
 * @param {StlPreviewProps} props - The props for the component.
 * @returns {JSX.Element} A Canvas element that will contain the STL model.
 */
/**
 * Scene content with model and camera controller
 */
const SceneContent: React.FC<{ stl: string }> = ({ stl }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = React.useState<THREE.BufferGeometry | null>(
    null
  );
  const [isDebug, setIsDebug] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsDebug(params.has('debug'));
  }, []);

  React.useEffect(() => {
    try {

      // Parse STL data
      const parseStl = (stlString: string) => {
        // Check if string starts with "solid" (ASCII STL)
        const trimmed = stlString.trim();
        const startsWithSolid = trimmed.toLowerCase().startsWith('solid');

        // Additional check: ASCII STL should contain "facet" keyword
        const hasRequiredKeywords =
          startsWithSolid &&
          (stlString.includes('facet') || stlString.includes('FACET'));


        if (hasRequiredKeywords) {
          return parseAsciiStl(stlString);
        } else {
          return parseBinaryStl(stlString);
        }
      };

      const parseAsciiStl = (stlString: string) => {
        const vertices: number[] = [];
        const normals: number[] = [];

        const patternVertex =
          /vertex\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/g;
        const patternNormal =
          /facet normal\s+([\d.eD+-]+)\s+([\d.eD+-]+)\s+([\d.eD+-]+)/g;

        let normalMatch;
        let vertexMatch;

        // Parse normals
        const normalMatches: number[][] = [];
        while ((normalMatch = patternNormal.exec(stlString)) !== null) {
          normalMatches.push([
            parseFloat(normalMatch[1]),
            parseFloat(normalMatch[2]),
            parseFloat(normalMatch[3]),
          ]);
        }

        // Parse vertices
        let normalIndex = 0;
        while ((vertexMatch = patternVertex.exec(stlString)) !== null) {
          vertices.push(
            parseFloat(vertexMatch[1]),
            parseFloat(vertexMatch[2]),
            parseFloat(vertexMatch[3])
          );

          // Assign normal to each vertex (3 vertices per facet)
          if (normalMatches[normalIndex]) {
            normals.push(
              normalMatches[normalIndex][0],
              normalMatches[normalIndex][1],
              normalMatches[normalIndex][2]
            );
          }

          // Move to next normal after 3 vertices
          if ((vertices.length / 3) % 3 === 0) {
            normalIndex++;
          }
        }

        return {
          vertices: new Float32Array(vertices),
          normals: new Float32Array(normals),
        };
      };

      const parseBinaryStl = (stlString: string) => {
        const buffer = new TextEncoder().encode(stlString).buffer;
        const view = new DataView(buffer);

        // Validate minimum size for binary STL (80-byte header + 4-byte triangle count)
        if (buffer.byteLength < 84) {
          throw new Error(
            `Binary STL too small: ${buffer.byteLength} bytes (minimum 84)`
          );
        }

        // Skip 80-byte header and read triangle count
        const numTriangles = view.getUint32(80, true);

        // Calculate expected file size
        const expectedSize = 84 + numTriangles * 50; // header + count + (50 bytes per triangle)


        if (buffer.byteLength < expectedSize) {
          throw new Error(
            `Binary STL size mismatch: got ${buffer.byteLength} bytes, expected ${expectedSize}`
          );
        }

        const vertices: number[] = [];
        const normals: number[] = [];

        let offset = 84;
        for (let i = 0; i < numTriangles; i++) {
          // Normal vector
          const nx = view.getFloat32(offset, true);
          const ny = view.getFloat32(offset + 4, true);
          const nz = view.getFloat32(offset + 8, true);
          offset += 12;

          // Three vertices
          for (let j = 0; j < 3; j++) {
            vertices.push(
              view.getFloat32(offset, true),
              view.getFloat32(offset + 4, true),
              view.getFloat32(offset + 8, true)
            );
            normals.push(nx, ny, nz);
            offset += 12;
          }

          // Skip attribute byte count
          offset += 2;
        }

        return {
          vertices: new Float32Array(vertices),
          normals: new Float32Array(normals),
        };
      };

      const { vertices, normals } = parseStl(stl);

      // Validate parsed data
      if (vertices.length === 0) {
        console.error('No vertices found in STL data');
        return;
      }


      // Create Three.js BufferGeometry
      const newGeometry = new THREE.BufferGeometry();
      newGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(vertices, 3)
      );
      newGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

      // Center the geometry
      newGeometry.computeBoundingBox();
      newGeometry.computeBoundingSphere();

      if (newGeometry.boundingBox) {
        const center = new THREE.Vector3();
        newGeometry.boundingBox.getCenter(center);
        newGeometry.translate(-center.x, -center.y, -center.z);
      }

      setGeometry(newGeometry);
    } catch (error) {
      console.error('Error parsing STL:', error);
    }
  }, [stl]);

  if (!geometry) {
    return null;
  }

  const radius = geometry.boundingSphere?.radius || 10;
  // Dynamically calculate grid size and divisions based on model's bounding sphere
  const gridSize = Math.max(100, Math.ceil(radius / 25) * 50);
  const gridDivisions = gridSize / 5;

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial color={theme.colors.accent} />
      </mesh>
      {isDebug && <DebugDisplay />}
      {isDebug && geometry.boundingSphere && (
        <mesh>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <sphereGeometry args={[geometry.boundingSphere.radius, 32, 32]} />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <meshBasicMaterial color="red" transparent opacity={0.2} wireframe />
        </mesh>
      )}
      {/* eslint-disable-next-line react/no-unknown-property */}
      {isDebug && <gridHelper args={[gridSize, gridDivisions]} />}
      <CameraController geometry={geometry} />
    </>
  );
};

const StlPreview: React.FC<StlPreviewProps> = ({
  stl,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}) => {
  return (
    <CanvasContainer aria-label={ariaLabel} data-testid={dataTestId}>
      <CanvasErrorBoundary>
        <Canvas camera={{ position: [50, 50, 50], fov: 30 }}>
          <Suspense fallback={null}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <ambientLight intensity={1.5} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <directionalLight position={[10, 10, 5]} intensity={1} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <directionalLight position={[-10, -10, -5]} intensity={0.5} />
            <SceneContent stl={stl} />
            <OrbitControls makeDefault enableDamping={false} />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </CanvasContainer>
  );
};

export default StlPreview;
