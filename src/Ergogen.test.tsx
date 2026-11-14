import type { Mock } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Ergogen from './Ergogen';
import { useConfigContext } from './context/ConfigContext';

vi.mock('./context/ConfigContext', () => ({
  useConfigContext: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

vi.mock('react-hotkeys-hook', () => ({
  useHotkeys: vi.fn(),
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
const mockCreateZip = vi.fn();
vi.mock('./utils/zip', () => ({
  createZip: (...args: any[]) => mockCreateZip(...args),
}));

const mockCreateShareableUri = vi.fn().mockReturnValue('https://share.link');
vi.mock('./utils/share', () => ({
  createShareableUri: (...args: any[]) => mockCreateShareableUri(...args),
}));

const mockTrackEvent = vi.fn();
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
    setShowSettings: vi.fn(),
    setShowSideNav: vi.fn(),
    setShowConfig: vi.fn(),
    setShowDownloads: vi.fn(),
    generateNow: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useConfigContext as Mock).mockReturnValue(mockContextValue);
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
    (useConfigContext as Mock).mockReturnValue({
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

describe('Ergogen preview_loaded tracking', () => {
  const baseContext = {
    configs: [],
    activeConfigId: '1',
    activeConfigName: 'My Awesome Board',
    isPreview: false,
    results: null as Record<string, unknown> | null,
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
    setShowSettings: vi.fn(),
    setShowSideNav: vi.fn(),
    setShowConfig: vi.fn(),
    setShowDownloads: vi.fn(),
    generateNow: vi.fn(),
  };

  const countPreviewLoadedCalls = () =>
    mockTrackEvent.mock.calls.filter(([name]) => name === 'preview_loaded')
      .length;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fires preview_loaded once when results first become available', () => {
    // Arrange
    (useConfigContext as Mock).mockReturnValue(baseContext);
    const { rerender } = render(<Ergogen />);

    // Act
    (useConfigContext as Mock).mockReturnValue({
      ...baseContext,
      results: { demo: { svg: '<svg />' } },
    });
    rerender(<Ergogen />);

    // Assert
    expect(countPreviewLoadedCalls()).toBe(1);
    expect(mockTrackEvent).toHaveBeenCalledWith('preview_loaded', {
      preview_type: 'svg',
      preview_key: 'demo.svg',
    });
  });

  it('does not re-fire preview_loaded when results regenerate for the same preview', () => {
    // Arrange
    (useConfigContext as Mock).mockReturnValue({
      ...baseContext,
      results: { demo: { svg: '<svg />' } },
    });
    const { rerender } = render(<Ergogen />);
    expect(countPreviewLoadedCalls()).toBe(1);

    // Act: simulate several auto-generation / STL completion cycles, each
    // producing a new results object for the unchanged preview.
    for (let i = 0; i < 3; i++) {
      (useConfigContext as Mock).mockReturnValue({
        ...baseContext,
        results: { demo: { svg: `<svg data-run="${i}" />` } },
      });
      rerender(<Ergogen />);
    }

    // Assert
    expect(countPreviewLoadedCalls()).toBe(1);
  });

  it('fires preview_loaded again after results are cleared, e.g. when switching configs', () => {
    // Arrange: a config is loaded and its preview has been tracked.
    (useConfigContext as Mock).mockReturnValue({
      ...baseContext,
      results: { demo: { svg: '<svg />' } },
    });
    const { rerender } = render(<Ergogen />);
    expect(countPreviewLoadedCalls()).toBe(1);

    // Act: selecting, creating or duplicating a config clears the results
    // before the new config generates, while Ergogen stays mounted.
    (useConfigContext as Mock).mockReturnValue({
      ...baseContext,
      activeConfigId: '2',
      results: null,
    });
    rerender(<Ergogen />);
    (useConfigContext as Mock).mockReturnValue({
      ...baseContext,
      activeConfigId: '2',
      results: { demo: { svg: '<svg data-config="2" />' } },
    });
    rerender(<Ergogen />);

    // Assert
    expect(countPreviewLoadedCalls()).toBe(2);
  });
});

describe('Ergogen Privacy settings', () => {
  const settingsContext = {
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
    showSettings: true,
    showSideNav: false,
    showConfig: true,
    showDownloads: false,
    sendUsageMetrics: true,
    setSendUsageMetrics: vi.fn(),
    setShowSettings: vi.fn(),
    setShowSideNav: vi.fn(),
    setShowConfig: vi.fn(),
    setShowDownloads: vi.fn(),
    generateNow: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useConfigContext as Mock).mockReturnValue(settingsContext);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('disables Send Usage Metrics and explains why when the build has no tag ID', async () => {
    // Arrange
    vi.stubEnv('VITE_GTAG_ID', '');

    // Act
    render(<Ergogen />);
    const metricsSwitch = screen.getByRole('checkbox', {
      name: 'Send usage metrics',
    });
    // user-event, unlike fireEvent, skips disabled controls as browsers do.
    await userEvent.setup().click(metricsSwitch);

    // Assert
    expect(metricsSwitch).toBeDisabled();
    expect(metricsSwitch).not.toBeChecked();
    expect(settingsContext.setSendUsageMetrics).not.toHaveBeenCalled();
    expect(
      screen.getByText(/built without an analytics tag ID/)
    ).toBeInTheDocument();
  });

  it('keeps Send Usage Metrics usable when the build has a tag ID', () => {
    // Arrange
    vi.stubEnv('VITE_GTAG_ID', 'G-TEST12345');

    // Act
    render(<Ergogen />);
    const metricsSwitch = screen.getByRole('checkbox', {
      name: 'Send usage metrics',
    });
    fireEvent.click(metricsSwitch);

    // Assert
    expect(metricsSwitch).toBeEnabled();
    expect(metricsSwitch).toBeChecked();
    expect(settingsContext.setSendUsageMetrics).toHaveBeenCalledWith(false);
    expect(
      screen.queryByText(/built without an analytics tag ID/)
    ).not.toBeInTheDocument();
  });
});
