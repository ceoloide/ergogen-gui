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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useConfigContext as jest.Mock).mockReturnValue(mockContextValue);
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
});
