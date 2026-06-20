import { render, screen } from '@testing-library/react';

jest.mock('../workers/workerFactory', () => ({
  createErgogenWorker: () => ({ postMessage: jest.fn(), terminate: jest.fn(), onmessage: (_e: any) => {} }),
  createJscadWorker: () => ({ postMessage: jest.fn(), terminate: jest.fn(), onmessage: (_e: any) => {} }),
}));

jest.mock('../atoms/DownloadRow', () => {
  return function MockDownloadRow({ fileName, extension, 'data-testid': dataTestId }: any) {
    return <div data-testid={dataTestId} data-extension={extension}>{fileName}.{extension}</div>;
  };
});

let mockContext: any = null;
jest.mock('../context/ConfigContext', () => ({
  ...jest.requireActual('../context/ConfigContext'),
  useConfigContext: () => mockContext,
}));

import Downloads from './Downloads';

describe('Downloads', () => {
  const mockSetPreview = jest.fn();
  const mockResults = {
    cases: { testCase: { jscad: 'mock jscad code', stl: 'mock stl content' } },
  };

  const createMockContext = (debug: boolean, stlPreview: boolean, results: any = mockResults) => ({
    configInput: '', setConfigInput: jest.fn(), configs: [], activeConfigId: null, addConfig: jest.fn(), deleteConfig: jest.fn(),
    renameConfig: jest.fn(), duplicateConfig: jest.fn(), switchConfig: jest.fn(), injectionInput: undefined, setInjectionInput: jest.fn(),
    processInput: jest.fn(), generateNow: jest.fn(), error: null, setError: jest.fn(), clearError: jest.fn(),
    deprecationWarning: null, clearWarning: jest.fn(), results, resultsVersion: 1, setResultsVersion: jest.fn(),
    showSettings: false, setShowSettings: jest.fn(), showConfig: true, setShowConfig: jest.fn(), showDownloads: true, setShowDownloads: jest.fn(),
    debug, setDebug: jest.fn(), autoGen: false, setAutoGen: jest.fn(), autoGen3D: false, setAutoGen3D: jest.fn(),
    kicanvasPreview: false, setKicanvasPreview: jest.fn(), stlPreview, setStlPreview: jest.fn(), experiment: null,
    isGenerating: false, isJscadConverting: false, setTempConfig: jest.fn()
  });

  describe('JSCAD filtering', () => {
    it('should hide JSCAD files when stlPreview is true and debug is false', () => {
      mockContext = createMockContext(false, true);
      render(<Downloads setPreview={mockSetPreview} previewKey="" data-testid="downloads" />);
      const allElements = screen.queryAllByTestId('downloads-testCase');
      expect(allElements).toHaveLength(1);
      expect(allElements[0]?.getAttribute('data-extension')).toBe('stl');
    });
    it('should show JSCAD files when stlPreview is false and debug is false', () => {
      mockContext = createMockContext(false, false);
      render(<Downloads setPreview={mockSetPreview} previewKey="" data-testid="downloads" />);
      const jscadElement = screen.getByTestId('downloads-testCase');
      expect(jscadElement).toBeInTheDocument();
      expect(jscadElement?.getAttribute('data-extension')).toBe('jscad');
    });
  });
});
