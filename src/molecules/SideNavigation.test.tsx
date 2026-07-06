import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SideNavigation from './SideNavigation';
import { useConfigContext } from '../context/ConfigContext';

// Mock ConfigContext
jest.mock('../context/ConfigContext', () => ({
  useConfigContext: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  Link: ({ children, to, onClick, ...props }: any) => (
    <a href={to} onClick={onClick} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

describe('SideNavigation', () => {
  const mockConfigs = [
    { id: '1', name: 'Keyboard Alpha', config: 'points: {}' },
    { id: '2', name: 'Ergonomic Board', config: 'points: {}' },
  ];

  const mockContextValue = {
    configs: mockConfigs,
    activeConfigId: '1',
    selectConfig: jest.fn(),
    createNewConfig: jest.fn().mockReturnValue('3'),
    renameConfig: jest.fn(),
    duplicateConfig: jest.fn(),
    deleteConfig: jest.fn(),
    exportAllConfigs: jest.fn(),
    injectionInput: [],
    setInjectionInput: jest.fn(),
    setError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockContextValue.createNewConfig.mockReturnValue('3');
    (useConfigContext as jest.Mock).mockReturnValue(mockContextValue);
    window.confirm = jest.fn().mockReturnValue(true);
  });

  const renderComponent = () => {
    return render(<SideNavigation isOpen={true} onClose={jest.fn()} />);
  };

  it('renders list of configurations and search input', () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText(/search configurations/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Keyboard Alpha')).toBeInTheDocument();
    expect(screen.getByText('Ergonomic Board')).toBeInTheDocument();
  });

  it('filters configurations based on search query with OR logic', () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/search configurations/i);

    // Single term
    fireEvent.change(searchInput, { target: { value: 'Alpha' } });
    expect(screen.getByText('Keyboard Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Ergonomic Board')).not.toBeInTheDocument();

    // Multi-term OR matching
    fireEvent.change(searchInput, { target: { value: 'Alpha Ergonomic' } });
    expect(screen.getByText('Keyboard Alpha')).toBeInTheDocument();
    expect(screen.getByText('Ergonomic Board')).toBeInTheDocument();

    // No match
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });
    expect(screen.queryByText('Keyboard Alpha')).not.toBeInTheDocument();
    expect(screen.queryByText('Ergonomic Board')).not.toBeInTheDocument();
  });

  it('creates a new configuration and navigates when clicking New Config', () => {
    renderComponent();
    const newBtn = screen.getByRole('button', { name: /new config/i });
    fireEvent.click(newBtn);

    expect(mockContextValue.createNewConfig).toHaveBeenCalled();
    expect(mockContextValue.selectConfig).toHaveBeenCalledWith('3');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('triggers bulk export when clicking Export All', () => {
    renderComponent();
    const exportBtn = screen.getByRole('button', { name: /export all/i });
    fireEvent.click(exportBtn);

    expect(mockContextValue.exportAllConfigs).toHaveBeenCalled();
  });

  it('selects configuration when clicking on its name', () => {
    renderComponent();
    const configItem = screen.getByText('Ergonomic Board');
    fireEvent.click(configItem);

    expect(mockContextValue.selectConfig).toHaveBeenCalledWith('2');
  });

  it('shows inline renaming and updates config name', async () => {
    renderComponent();
    const renameBtn = screen.getAllByLabelText(/rename configuration/i)[0];
    fireEvent.click(renameBtn);

    const input = screen.getByDisplayValue('Keyboard Alpha');
    fireEvent.change(input, { target: { value: 'Updated Name' } });

    const saveBtn = screen.getByLabelText(/save name/i);
    fireEvent.click(saveBtn);

    expect(mockContextValue.renameConfig).toHaveBeenCalledWith(
      '1',
      'Updated Name'
    );
  });

  it('duplicates a configuration when clicking duplicate button', () => {
    renderComponent();
    const dupBtn = screen.getAllByLabelText(/duplicate configuration/i)[0];
    fireEvent.click(dupBtn);

    expect(mockContextValue.duplicateConfig).toHaveBeenCalledWith('1');
  });

  it('deletes a configuration with confirmation', () => {
    renderComponent();
    const deleteBtn = screen.getAllByLabelText(/delete configuration/i)[0];
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Keyboard Alpha')
    );
    expect(mockContextValue.deleteConfig).toHaveBeenCalledWith('1');
  });
});
