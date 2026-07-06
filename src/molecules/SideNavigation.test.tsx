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
    {
      id: '1',
      name: 'Keyboard Alpha',
      config: 'points: {}',
      createdAt: '2026-07-06T01:00:00.000Z',
      updatedAt: '2026-07-06T02:00:00.000Z',
    },
    {
      id: '2',
      name: 'Ergonomic Board',
      config: 'points: {}',
      createdAt: '2026-07-06T01:00:00.000Z',
      updatedAt: '2026-07-06T01:00:00.000Z',
    },
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
    downloadAllConfigs: jest.fn(),
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

  it('navigates to /new when clicking New button', () => {
    renderComponent();
    const newBtn = screen.getByRole('button', { name: /^new$/i });
    fireEvent.click(newBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/new');
  });

  it('triggers bulk download when clicking Download All', () => {
    renderComponent();
    const downloadBtn = screen.getByRole('button', { name: /download all/i });
    fireEvent.click(downloadBtn);

    expect(mockContextValue.downloadAllConfigs).toHaveBeenCalled();
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

  it('sorts configurations by updatedAt desc, then createdAt desc, then name asc', () => {
    const customConfigs = [
      {
        id: '1',
        name: 'Config C',
        config: 'points: {}',
        createdAt: '2026-07-06T00:00:00.000Z',
        updatedAt: '2026-07-06T00:00:00.000Z',
      },
      {
        id: '2',
        name: 'Config A',
        config: 'points: {}',
        createdAt: '2026-07-06T02:00:00.000Z',
        updatedAt: '2026-07-06T02:00:00.000Z',
      },
      {
        id: '3',
        name: 'Config B',
        config: 'points: {}',
        createdAt: '2026-07-06T01:00:00.000Z',
        updatedAt: '2026-07-06T02:00:00.000Z',
      },
    ];

    (useConfigContext as jest.Mock).mockReturnValue({
      ...mockContextValue,
      configs: customConfigs,
    });

    renderComponent();

    const configItems = screen
      .getAllByTestId(/config-item-/)
      .map((el) => el.textContent || '');

    expect(configItems[0]).toContain('Config A');
    expect(configItems[1]).toContain('Config B');
    expect(configItems[2]).toContain('Config C');
  });

  it('cancels active renaming when the side navigation is closed', () => {
    const { rerender } = render(
      <SideNavigation isOpen={true} onClose={jest.fn()} />
    );

    // Start renaming
    const renameBtn = screen.getAllByLabelText(/rename configuration/i)[0];
    fireEvent.click(renameBtn);

    expect(screen.getByLabelText('Rename input')).toBeInTheDocument();

    // Close side navigation
    rerender(<SideNavigation isOpen={false} onClose={jest.fn()} />);

    // Re-open side navigation
    rerender(<SideNavigation isOpen={true} onClose={jest.fn()} />);

    // Renaming input should be gone, showing original static name
    expect(screen.queryByLabelText('Rename input')).not.toBeInTheDocument();
    expect(screen.getByText('Keyboard Alpha')).toBeInTheDocument();
  });
});
