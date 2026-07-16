import { render, screen } from '@testing-library/react';

// Mock the worker factory to prevent worker creation in tests
vi.mock('../workers/workerFactory', () => ({
  createErgogenWorker: () => ({
    postMessage: jest.fn(),
    terminate: jest.fn(),
    onmessage: (_e: any) => {},
  }),
  createJscadWorker: () => ({
    postMessage: jest.fn(),
    terminate: jest.fn(),
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
  const mockSetPreview = jest.fn();
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
    setConfigInput: jest.fn(),
    injectionInput: undefined,
    setInjectionInput: jest.fn(),
    processInput: jest.fn(),
    generateNow: jest.fn(),
    error: null,
    setError: jest.fn(),
    clearError: jest.fn(),
    deprecationWarning: null,
    clearWarning: jest.fn(),
    results,
    resultsVersion: 1,
    setResultsVersion: jest.fn(),
    showSettings: false,
    setShowSettings: jest.fn(),
    showConfig: true,
    setShowConfig: jest.fn(),
    showDownloads: true,
    setShowDownloads: jest.fn(),
    debug,
    setDebug: jest.fn(),
    autoGen: false,
    setAutoGen: jest.fn(),
    autoGen3D: false,
    setAutoGen3D: jest.fn(),
    kicanvasPreview: false,
    setKicanvasPreview: jest.fn(),
    stlPreview,
    setStlPreview: jest.fn(),
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
      mockContext = createMockContext(false, false, null);

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
