import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { useConfigContext } from '../context/ConfigContext';

// Mock ConfigContext
jest.mock('../context/ConfigContext', () => ({
  useConfigContext: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/' };
jest.mock('react-router-dom', () => ({
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
    renameConfig: jest.fn(),
    duplicateConfig: jest.fn(),
    deleteConfig: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(screen.queryByText('Shared')).not.toBeInTheDocument();
  });

  it('renders Shared badge when configuration is in preview mode', () => {
    (useConfigContext as jest.Mock).mockReturnValue({
      ...mockContextValue,
      activeConfigName: 'Shared Preview',
      isPreview: true,
    });
    renderComponent();
    expect(screen.getByText('Shared')).toBeInTheDocument();
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
});
