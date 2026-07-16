import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Ergogen from './Ergogen';
import { useConfigContext } from './context/ConfigContext';

vi.mock('./context/ConfigContext', () => ({
  useConfigContext: jest.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

vi.mock('react-hotkeys-hook', () => ({
  useHotkeys: jest.fn(),
}));

// Mock sub-components
vi.mock('./molecules/ConfigEditor', () => {
  const MockConfigEditor = () => <div data-testid="mock-config-editor" />;
  MockConfigEditor.displayName = 'MockConfigEditor';
  return { default: MockConfigEditor };
});
vi.mock('./molecules/InjectionEditor', () => {
  const MockInjectionEditor = () => <div data-testid="mock-injection-editor" />;
  MockInjectionEditor.displayName = 'MockInjectionEditor';
  return { default: MockInjectionEditor };
});
vi.mock('./molecules/Downloads', () => {
  const MockDownloads = () => <div data-testid="mock-downloads" />;
  MockDownloads.displayName = 'MockDownloads';
  return { default: MockDownloads };
});
vi.mock('./molecules/Injections', () => {
  const MockInjections = () => <div data-testid="mock-injections" />;
  MockInjections.displayName = 'MockInjections';
  return { default: MockInjections };
});
vi.mock('./molecules/FilePreview', () => {
  const MockFilePreview = () => <div data-testid="mock-file-preview" />;
  MockFilePreview.displayName = 'MockFilePreview';
  return { default: MockFilePreview };
});
vi.mock('./molecules/ResizablePanel', () => {
  const MockResizablePanel = ({ children }: any) => <div>{children}</div>;
  MockResizablePanel.displayName = 'MockResizablePanel';
  return { default: MockResizablePanel };
});

// Mock zip, share, and analytics utils
const mockCreateZip = jest.fn();
vi.mock('./utils/zip', () => ({
  createZip: (...args: any[]) => mockCreateZip(...args),
}));

const mockCreateShareableUri = jest.fn().mockReturnValue('https://share.link');
vi.mock('./utils/share', () => ({
  createShareableUri: (...args: any[]) => mockCreateShareableUri(...args),
}));

const mockTrackEvent = jest.fn();
vi.mock('./utils/analytics', () => ({
  trackEvent: (...args: any[]) => mockTrackEvent(...args),
}));

describe('Ergogen Subheader Buttons', () => {
  const mockContextValue = {
    configs: [],
    activeConfigId: '1',
    activeConfigName: 'My Awesome Board',
    isPreview: false,
    results: null,
    configInput: 'points: {}',
    injectionInput: [],
    debug: false,
    stlPreview: false,
    isGenerating: false,
    isJscadConverting: false,
    showSettings: false,
    showSideNav: false,
    showConfig: true,
    showDownloads: false,
    setShowSettings: jest.fn(),
    setShowSideNav: jest.fn(),
    setShowConfig: jest.fn(),
    setShowDownloads: jest.fn(),
    generateNow: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useConfigContext as jest.Mock).mockReturnValue(mockContextValue);
  });

  it('renders mobile share button and triggers share logic on click when showConfig is true', () => {
    render(<Ergogen />);
    const shareBtn = screen.getByTestId('mobile-share-button');
    expect(shareBtn).toBeInTheDocument();

    fireEvent.click(shareBtn);
    expect(screen.getByText('Share Configuration')).toBeInTheDocument();

    const innerShareBtn = screen.getByRole('button', { name: 'Share' });
    fireEvent.click(innerShareBtn);

    expect(mockCreateShareableUri).toHaveBeenCalledWith({
      config: 'points: {}',
      injections: undefined,
    });
    expect(
      screen.getByText('Shareable Configuration Link')
    ).toBeInTheDocument();
  });

  it('renders mobile archive button and triggers download archive logic on click when showConfig is false', () => {
    (useConfigContext as jest.Mock).mockReturnValue({
      ...mockContextValue,
      showConfig: false,
      results: { canonical: 'canonical_yaml' },
    });
    render(<Ergogen />);
    const archiveBtn = screen.getByTestId('mobile-download-outputs-button');
    expect(archiveBtn).toBeInTheDocument();

    fireEvent.click(archiveBtn);
    expect(mockCreateZip).toHaveBeenCalledWith(
      { canonical: 'canonical_yaml' },
      'points: {}',
      [],
      false,
      false
    );
  });
});
