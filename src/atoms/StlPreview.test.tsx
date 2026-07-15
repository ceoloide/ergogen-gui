import { render, screen } from '@testing-library/react';
import StlPreview from './StlPreview';

// Mock react-three-fiber and drei
vi.mock('@react-three/fiber', async () => {
  const THREE = await vi.importActual<typeof import('three')>('three');
  return {
    Canvas: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-canvas">{children}</div>
    ),
    useThree: () => ({
      camera: new THREE.PerspectiveCamera(),
      size: { width: 100, height: 100 },
      controls: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    }),
  };
});

vi.mock('@react-three/drei', () => ({
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

  it('renders a binary STL preview', () => {
    // Generate an ASCII-safe 1-triangle binary STL buffer (all byte values < 128)
    const buffer = new ArrayBuffer(84 + 50);
    const view = new DataView(buffer);
    for (let i = 0; i < 80; i++) {
      view.setUint8(i, 0x41);
    }
    view.setUint32(80, 1, true); // 1 triangle

    // Normal vector (0.0, 0.5, 0.0) -> IEEE 754: 0.5 is 0x3f000000. All bytes < 128
    view.setFloat32(84, 0.0, true);
    view.setFloat32(88, 0.5, true);
    view.setFloat32(92, 0.0, true);

    // Vertices: 3 vertices, each (0.5, 0.0, 0.5)
    for (let j = 0; j < 9; j++) {
      view.setFloat32(96 + j * 4, 0.5, true);
    }
    view.setUint16(132, 0, true); // attribute count

    const stlString = new TextDecoder('utf-8').decode(new Uint8Array(buffer));

    // Act
    render(<StlPreview stl={stlString} data-testid="stl-binary-preview" />);

    // Assert
    expect(screen.getByTestId('stl-binary-preview')).toBeInTheDocument();
  });

  it('renders a binary STL preview using ArrayBuffer directly', () => {
    // Generate a 1-triangle binary STL buffer
    const buffer = new ArrayBuffer(84 + 50);
    const view = new DataView(buffer);
    for (let i = 0; i < 80; i++) {
      view.setUint8(i, 0x41);
    }
    view.setUint32(80, 1, true); // 1 triangle

    // Normal vector
    view.setFloat32(84, 0.0, true);
    view.setFloat32(88, 0.5, true);
    view.setFloat32(92, 0.0, true);

    // Vertices
    for (let j = 0; j < 9; j++) {
      view.setFloat32(96 + j * 4, 0.5, true);
    }
    view.setUint16(132, 0, true); // attribute count

    // Act
    render(<StlPreview stl={buffer} data-testid="stl-arraybuffer-preview" />);

    // Assert
    expect(screen.getByTestId('stl-arraybuffer-preview')).toBeInTheDocument();
  });

  it('renders a binary STL preview using Uint8Array directly', () => {
    // Generate a 1-triangle binary STL buffer
    const buffer = new ArrayBuffer(84 + 50);
    const view = new DataView(buffer);
    for (let i = 0; i < 80; i++) {
      view.setUint8(i, 0x41);
    }
    view.setUint32(80, 1, true); // 1 triangle

    // Normal vector
    view.setFloat32(84, 0.0, true);
    view.setFloat32(88, 0.5, true);
    view.setFloat32(92, 0.0, true);

    // Vertices
    for (let j = 0; j < 9; j++) {
      view.setFloat32(96 + j * 4, 0.5, true);
    }
    view.setUint16(132, 0, true); // attribute count

    const uint8Array = new Uint8Array(buffer);

    // Act
    render(
      <StlPreview stl={uint8Array} data-testid="stl-uint8array-preview" />
    );

    // Assert
    expect(screen.getByTestId('stl-uint8array-preview')).toBeInTheDocument();
  });
});
