import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { useConfigContext } from '../context/ConfigContext';

// Mock ConfigContext
vi.mock('../context/ConfigContext', () => ({
  useConfigContext: jest.fn(),
}));

const mockCreateZip = jest.fn();
vi.mock('../utils/zip', () => ({
  createZip: (...args: any[]) => mockCreateZip(...args),
}));

const mockCreateShareableUri = jest.fn().mockReturnValue('https://share.link');
vi.mock('../utils/share', () => ({
  createShareableUri: (...args: any[]) => mockCreateShareableUri(...args),
}));

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/' };
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, onClick, ...props }: any) => (
    <a href={to} onClick={onClick} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

describe('Header', () => {
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
    setShowSettings: jest.fn(),
    setShowSideNav: jest.fn(),
    renameConfig: jest.fn().mockReturnValue(true),
    duplicateConfig: jest.fn(),
    deleteConfig: jest.fn(),
    savePreviewConfig: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockContextValue.renameConfig.mockReturnValue(true);
    (useConfigContext as jest.Mock).mockReturnValue(mockContextValue);
    window.confirm = jest.fn().mockReturnValue(true);
  });

  const renderComponent = () => {
    return render(<Header />);
  };

  it('renders active configuration name', () => {
    renderComponent();
    expect(screen.getByTestId('header-active-config-name')).toBeInTheDocument();
    expect(screen.getByText('My Awesome Board')).toBeInTheDocument();
    expect(screen.queryByTestId('header-shared-icon')).not.toBeInTheDocument();
  });

  it('renders Shared icon when configuration is in preview mode', () => {
    (useConfigContext as jest.Mock).mockReturnValue({
      ...mockContextValue,
      activeConfigName: 'Shared Config',
      isPreview: true,
    });
    renderComponent();
    expect(screen.getByTestId('header-shared-icon')).toBeInTheDocument();
  });

  it('triggers side nav toggle', () => {
    renderComponent();
    const toggleBtn = screen.getByTestId('side-nav-toggle-button');
    fireEvent.click(toggleBtn);
    expect(mockContextValue.setShowSideNav).toHaveBeenCalledWith(true);
  });

  it('triggers inline renaming in the header', () => {
    renderComponent();
    const textNode = screen.getByText('My Awesome Board');
    fireEvent.click(textNode);

    const inputNode = screen.getByTestId('header-config-name-input');
    fireEvent.change(inputNode, { target: { value: 'New Header Name' } });
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter' });

    expect(mockContextValue.renameConfig).toHaveBeenCalledWith(
      '1',
      'New Header Name'
    );
  });

  it('submits inline rename using the confirm check button', () => {
    renderComponent();
    const textNode = screen.getByText('My Awesome Board');
    fireEvent.click(textNode);

    const inputNode = screen.getByTestId('header-config-name-input');
    fireEvent.change(inputNode, { target: { value: 'Checked Rename' } });

    const confirmBtn = screen.getByTestId('header-confirm-rename-btn');
    fireEvent.click(confirmBtn);

    expect(mockContextValue.renameConfig).toHaveBeenCalledWith(
      '1',
      'Checked Rename'
    );
    expect(
      screen.queryByTestId('header-config-name-input')
    ).not.toBeInTheDocument();
  });

  it('cancels inline rename using the cancel close button', () => {
    renderComponent();
    const textNode = screen.getByText('My Awesome Board');
    fireEvent.click(textNode);

    const cancelBtn = screen.getByTestId('header-cancel-rename-btn');
    fireEvent.click(cancelBtn);

    expect(mockContextValue.renameConfig).not.toHaveBeenCalled();
    expect(
      screen.queryByTestId('header-config-name-input')
    ).not.toBeInTheDocument();
  });

  it('triggers duplicate config from the header', () => {
    renderComponent();
    const dupBtn = screen.getByTestId('header-duplicate-btn');
    fireEvent.click(dupBtn);
    expect(mockContextValue.duplicateConfig).toHaveBeenCalledWith('1');
  });

  it('triggers delete config from the header with confirmation', () => {
    renderComponent();
    const deleteBtn = screen.getByTestId('header-delete-btn');
    fireEvent.click(deleteBtn);
    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('My Awesome Board')
    );
    expect(mockContextValue.deleteConfig).toHaveBeenCalledWith('1');
  });

  it('triggers savePreviewConfig when clicking the save button in preview mode', () => {
    (useConfigContext as jest.Mock).mockReturnValue({
      ...mockContextValue,
      activeConfigName: 'Shared Config',
      isPreview: true,
    });
    renderComponent();

    const saveBtn = screen.getByTestId('header-save-preview-btn');
    fireEvent.click(saveBtn);

    expect(mockContextValue.savePreviewConfig).toHaveBeenCalled();
  });

  it('triggers download archive on click', () => {
    (useConfigContext as jest.Mock).mockReturnValue({
      ...mockContextValue,
      results: { canonical: 'canonical_yaml' },
      configInput: 'points: {}',
    });
    renderComponent();
    const downloadOutputsBtn = screen.getByTestId(
      'header-download-outputs-button'
    );
    fireEvent.click(downloadOutputsBtn);
    expect(mockCreateZip).toHaveBeenCalledWith(
      { canonical: 'canonical_yaml' },
      'points: {}',
      [],
      false,
      false
    );
  });

  it('triggers share dialog on click', () => {
    renderComponent();
    const shareBtn = screen.getByTestId('header-share-button');
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
});
