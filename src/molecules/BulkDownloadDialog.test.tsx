import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BulkDownloadDialog from './BulkDownloadDialog';
import { exportConfigsProgressively } from '../utils/zip';

jest.mock('../utils/zip', () => ({
  exportConfigsProgressively: jest.fn(),
}));

describe('BulkDownloadDialog', () => {
  const mockOnClose = jest.fn();
  const mockConfigs = [
    { id: '1', name: 'Keyboard Alpha', config: 'points: {}' },
    { id: '2', name: 'Ergonomic Board', config: 'points: { ergonomic: true }' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <BulkDownloadDialog
        isOpen={false}
        configs={mockConfigs}
        injections={[]}
        debug={false}
        stlPreview={false}
        onClose={mockOnClose}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog elements when isOpen is true', () => {
    render(
      <BulkDownloadDialog
        isOpen={true}
        configs={mockConfigs}
        injections={[]}
        debug={false}
        stlPreview={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Download Configurations')).toBeInTheDocument();
    expect(screen.getByLabelText('Keyboard Alpha')).toBeInTheDocument();
    expect(screen.getByLabelText('Ergonomic Board')).toBeInTheDocument();
    expect(screen.getByText('Only download configs')).toBeInTheDocument();
  });

  it('toggles select all and deselect all configurations', () => {
    render(
      <BulkDownloadDialog
        isOpen={true}
        configs={mockConfigs}
        injections={[]}
        debug={false}
        stlPreview={false}
        onClose={mockOnClose}
      />
    );

    const check1 = screen.getByLabelText('Keyboard Alpha') as HTMLInputElement;
    const check2 = screen.getByLabelText('Ergonomic Board') as HTMLInputElement;

    // Both should be default checked
    expect(check1.checked).toBe(true);
    expect(check2.checked).toBe(true);

    // Click Deselect All
    fireEvent.click(screen.getByText('Deselect All'));
    expect(check1.checked).toBe(false);
    expect(check2.checked).toBe(false);

    // Click Select All
    fireEvent.click(screen.getByText('Select All'));
    expect(check1.checked).toBe(true);
    expect(check2.checked).toBe(true);
  });

  it('shows warning when "Only download configs" switch is turned off', () => {
    render(
      <BulkDownloadDialog
        isOpen={true}
        configs={mockConfigs}
        injections={[]}
        debug={false}
        stlPreview={false}
        onClose={mockOnClose}
      />
    );

    // Warning should not be visible by default
    expect(
      screen.queryByText(/Warning: Exporting generated outputs/)
    ).not.toBeInTheDocument();

    // Toggle switch
    const toggleInput = screen.getByLabelText('', {
      selector: 'input[type="checkbox"]#only-configs-switch',
    });
    fireEvent.click(toggleInput);

    // Warning should now be visible
    expect(
      screen.getByText(/Warning: Exporting generated outputs/)
    ).toBeInTheDocument();
  });

  it('triggers progressive export process on click proceed', async () => {
    (exportConfigsProgressively as jest.Mock).mockResolvedValue(undefined);

    render(
      <BulkDownloadDialog
        isOpen={true}
        configs={mockConfigs}
        injections={[]}
        debug={false}
        stlPreview={false}
        onClose={mockOnClose}
      />
    );

    const downloadBtn = screen.getByRole('button', { name: /Download \(2\)/i });

    await act(async () => {
      fireEvent.click(downloadBtn);
    });

    expect(exportConfigsProgressively).toHaveBeenCalledWith(
      mockConfigs,
      [],
      false,
      false,
      true, // onlyConfigs
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('shows progress bar and ratio during generation', async () => {
    let progressCallback: any = null;
    (exportConfigsProgressively as jest.Mock).mockImplementation(
      (configs, injections, debug, stlPreview, onlyConfigs, onProgress) => {
        progressCallback = onProgress;
        return new Promise(() => {}); // never resolves to keep it in generating state
      }
    );

    render(
      <BulkDownloadDialog
        isOpen={true}
        configs={mockConfigs}
        injections={[]}
        debug={false}
        stlPreview={false}
        onClose={mockOnClose}
      />
    );

    const downloadBtn = screen.getByRole('button', { name: /Download \(2\)/i });
    fireEvent.click(downloadBtn);

    expect(screen.getByText('Preparing...')).toBeInTheDocument();

    // Trigger progress update
    act(() => {
      progressCallback(1, 2, 'Keyboard Alpha');
    });

    expect(screen.getByText('Generating Keyboard Alpha')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });
});
