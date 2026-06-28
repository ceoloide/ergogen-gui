import { render, screen } from '@testing-library/react';
import StlPreview from './StlPreview';

// Mock react-three-fiber and drei
jest.mock('@react-three/fiber', () => {
  const THREE = jest.requireActual('three');
  return {
    Canvas: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-canvas">{children}</div>
    ),
    useThree: () => ({
      camera: new THREE.PerspectiveCamera(),
      size: { width: 100, height: 100 },
      controls: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    }),
  };
});

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="mock-orbit-controls" />,
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-html">{children}</div>
  ),
}));

describe('StlPreview', () => {
  // Arrange
  const mockStl = `solid test
  facet normal 0 0 1
    outer loop
      vertex 0 0 0
      vertex 1 0 0
      vertex 0 1 0
    endloop
  endfacet
endsolid test`;

  it('renders the STL preview container', () => {
    // Act
    render(<StlPreview stl={mockStl} data-testid="stl-preview-test" />);

    // Assert
    expect(screen.getByTestId('stl-preview-test')).toBeInTheDocument();
  });

  it('renders with correct aria-label', () => {
    // Act
    render(
      <StlPreview
        stl={mockStl}
        aria-label="Test STL preview"
        data-testid="stl-preview-test"
      />
    );

    // Assert
    const container = screen.getByTestId('stl-preview-test');
    expect(container).toHaveAttribute('aria-label', 'Test STL preview');
  });

  it('renders the Canvas component', () => {
    // Act
    render(<StlPreview stl={mockStl} />);

    // Assert
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
  });
  it('renders a binary STL', () => {
    // Generate a simple binary STL: 1 triangle
    const numTriangles = 1;
    const buffer = new ArrayBuffer(84 + numTriangles * 50);
    const view = new DataView(buffer);

    // 80 bytes header (zeros)
    // 4 bytes triangle count
    view.setUint32(80, numTriangles, true);

    // Triangle data (50 bytes)
    let offset = 84;
    // Normal (0,0,1)
    view.setFloat32(offset, 0, true);
    view.setFloat32(offset + 4, 0, true);
    view.setFloat32(offset + 8, 1, true);
    offset += 12;

    // Vertex 1 (0,0,0)
    view.setFloat32(offset, 0, true);
    view.setFloat32(offset + 4, 0, true);
    view.setFloat32(offset + 8, 0, true);
    offset += 12;

    // Vertex 2 (1,0,0)
    view.setFloat32(offset, 1, true);
    view.setFloat32(offset + 4, 0, true);
    view.setFloat32(offset + 8, 0, true);
    offset += 12;

    // Vertex 3 (0,1,0)
    view.setFloat32(offset, 0, true);
    view.setFloat32(offset + 4, 1, true);
    view.setFloat32(offset + 8, 0, true);
    offset += 12;

    // Attribute byte count (0)
    view.setUint16(offset, 0, true);

    // Convert to string using TextDecoder (mirroring app logic)
    const binaryStlString = new TextDecoder().decode(new Uint8Array(buffer));

    // Act
    render(<StlPreview stl={binaryStlString} data-testid="stl-preview-binary" />);

    // Assert
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('stl-preview-binary')).toBeInTheDocument();
  });
});