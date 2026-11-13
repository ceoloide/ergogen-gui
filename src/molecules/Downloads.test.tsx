import { render, screen } from '@testing-library/react';

// Mock the worker factory to prevent worker creation in tests
vi.mock('../workers/workerFactory', () => ({
  createErgogenWorker: () => ({
    postMessage: vi.fn(),
    terminate: vi.fn(),
    onmessage: (_e: any) => {},
  }),
  createJscadWorker: () => ({
    postMessage: vi.fn(),
    terminate: vi.fn(),
    onmessage: (_e: any) => {},
  }),
}));

// Mock the DownloadRow component
vi.mock('../atoms/DownloadRow', () => {
  return {
    default: function MockDownloadRow({
      fileName,
      extension,
      'data-testid': dataTestId,
    }: {
      fileName: string;
      extension: string;
      'data-testid'?: string;
    }) {
      return (
        <div data-testid={dataTestId} data-extension={extension}>
          {fileName}.{extension}
        </div>
      );
    },
  };
});

// Mock useConfigContext
const mockState = vi.hoisted(() => ({ mockContext: null as any }));
vi.mock('../context/ConfigContext', async () => {
  const original = await vi.importActual<
    typeof import('../context/ConfigContext')
  >('../context/ConfigContext');
  return {
    ...original,
    useConfigContext: () => mockState.mockContext,
  };
});

import Downloads from './Downloads';

describe('Downloads', () => {
  const mockSetPreview = vi.fn();
  const mockResults = {
    demo: undefined,
    canonical: {},
    points: {},
    units: {},
    outlines: {},
    cases: {
      testCase: {
        jscad: 'mock jscad code',
        stl: 'mock stl content',
      },
    },
    pcbs: {},
  };

  const createMockContext = (
    debug: boolean,
    stlPreview: boolean,
    results: any = mockResults
  ) => ({
    configInput: '',
    setConfigInput: vi.fn(),
    injectionInput: undefined,
    setInjectionInput: vi.fn(),
    processInput: vi.fn(),
    generateNow: vi.fn(),
    error: null,
    setError: vi.fn(),
    clearError: vi.fn(),
    deprecationWarning: null,
    clearWarning: vi.fn(),
    results,
    resultsVersion: 1,
    setResultsVersion: vi.fn(),
    showSettings: false,
    setShowSettings: vi.fn(),
    showConfig: true,
    setShowConfig: vi.fn(),
    showDownloads: true,
    setShowDownloads: vi.fn(),
    debug,
    setDebug: vi.fn(),
    autoGen: false,
    setAutoGen: vi.fn(),
    autoGen3D: false,
    setAutoGen3D: vi.fn(),
    kicanvasPreview: false,
    setKicanvasPreview: vi.fn(),
    stlPreview,
    setStlPreview: vi.fn(),
    isGenerating: false,
  });

  describe('JSCAD filtering based on stlPreview and debug', () => {
    beforeEach(() => {
      mockSetPreview.mockClear();
    });

    it('should hide JSCAD files when stlPreview is true and debug is false', () => {
      // Arrange
      mockState.mockContext = createMockContext(false, true);

      // Act
      render(
        <Downloads
          setPreview={mockSetPreview}
          previewKey=""
          data-testid="downloads"
        />
      );

      // Assert
      const allElements = screen.queryAllByTestId('downloads-testCase');

      // Only STL should be present, JSCAD should be filtered out
      expect(allElements).toHaveLength(1);
      expect(allElements[0]?.getAttribute('data-extension')).toBe('stl');
    });

    it('should show JSCAD files when stlPreview is false and debug is false', () => {
      // Arrange
      mockState.mockContext = createMockContext(false, false);

      // Act
      render(
        <Downloads
          setPreview={mockSetPreview}
          previewKey=""
          data-testid="downloads"
        />
      );

      // Assert
      const jscadElement = screen.getByTestId('downloads-testCase');

      // JSCAD should be present
      expect(jscadElement).toBeInTheDocument();
      expect(jscadElement?.getAttribute('data-extension')).toBe('jscad');

      // STL should not be present (stlPreview is false)
      const allElements = screen.queryAllByTestId('downloads-testCase');
      expect(allElements).toHaveLength(1);
    });

    it('should show JSCAD files when stlPreview is true and debug is true', () => {
      // Arrange
      mockState.mockContext = createMockContext(true, true);

      // Act
      render(
        <Downloads
          setPreview={mockSetPreview}
          previewKey=""
          data-testid="downloads"
        />
      );

      // Assert
      const allElements = screen.getAllByTestId('downloads-testCase');

      // Both JSCAD and STL should be present
      expect(allElements).toHaveLength(2);
      expect(allElements[0]?.getAttribute('data-extension')).toBe('jscad');
      expect(allElements[1]?.getAttribute('data-extension')).toBe('stl');
    });

    it('should show JSCAD files when stlPreview is false and debug is true', () => {
      // Arrange
      mockState.mockContext = createMockContext(true, false);

      // Act
      render(
        <Downloads
          setPreview={mockSetPreview}
          previewKey=""
          data-testid="downloads"
        />
      );

      // Assert
      const jscadElement = screen.getByTestId('downloads-testCase');

      // JSCAD should be present
      expect(jscadElement).toBeInTheDocument();
      expect(jscadElement?.getAttribute('data-extension')).toBe('jscad');

      // STL should not be present (stlPreview is false)
      const allElements = screen.queryAllByTestId('downloads-testCase');
      expect(allElements).toHaveLength(1);
    });
    it('should render No outputs placeholder when results is null/empty', () => {
      // Arrange
      mockState.mockContext = createMockContext(false, false, null);

      // Act
      render(
        <Downloads
          setPreview={mockSetPreview}
          previewKey=""
          data-testid="downloads"
        />
      );

      // Assert
      expect(screen.getByText('No outputs')).toBeInTheDocument();
    });
  });
});
