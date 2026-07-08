import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ShareDialog from './ShareDialog';
import { createShareableUri } from '../utils/share';
import { createErgogenWorker } from '../workers/workerFactory';

// Mock the share utility
jest.mock('../utils/share', () => ({
  ...jest.requireActual('../utils/share'),
  createShareableUri: jest.fn(),
}));

// Mock the worker factory
jest.mock('../workers/workerFactory', () => ({
  createErgogenWorker: jest.fn(),
}));

describe('ShareDialog', () => {
  const mockClose = jest.fn();
  const mockConfig = 'points:\n  key: 1';
  const mockInjections = [
    ['footprint', 'mx', 'module.exports = {}'],
    ['footprint', 'choc', 'module.exports = {}'],
    ['template', 'kicad8', 'template_content'],
    ['outline', 'my_svg', 'outline_content'],
  ];

  let mockWorker: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (createShareableUri as jest.Mock).mockReturnValue(
      'https://share.link/test'
    );

    mockWorker = {
      postMessage: jest.fn(),
      terminate: jest.fn(),
      onmessage: null,
      onerror: null,
    };
    (createErgogenWorker as jest.Mock).mockReturnValue(mockWorker);
  });

  it('renders Step 1 with Include custom libraries switched ON by default', () => {
    // Arrange & Act
    render(
      <ShareDialog
        config={mockConfig}
        injections={mockInjections}
        onClose={mockClose}
        data-testid="share-dialog"
      />
    );

    // Assert
    expect(screen.getByText('Share Configuration')).toBeInTheDocument();
    const toggle = screen.getByLabelText('Include custom libraries');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toBeChecked();
  });

  it('displays no custom libraries message and proceeds directly when injections array is empty', () => {
    // Arrange & Act
    render(
      <ShareDialog
        config={mockConfig}
        injections={[]}
        onClose={mockClose}
        data-testid="share-dialog"
      />
    );

    // Assert
    expect(screen.getByText(/No custom libraries loaded/i)).toBeInTheDocument();
    expect(createErgogenWorker).not.toHaveBeenCalled();

    // Act - Proceed to Step 2
    const shareBtn = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareBtn);

    // Assert Step 2
    expect(
      screen.getByText('Shareable Configuration Link')
    ).toBeInTheDocument();
    expect(createShareableUri).toHaveBeenCalledWith({
      config: mockConfig,
      injections: undefined,
    });
  });

  it('starts worker analysis when opened with injections and include custom ON', () => {
    // Arrange & Act
    render(
      <ShareDialog
        config={mockConfig}
        injections={mockInjections}
        onClose={mockClose}
        data-testid="share-dialog"
      />
    );

    // Assert
    expect(screen.getByText(/Analyzing configuration/i)).toBeInTheDocument();
    expect(mockWorker.postMessage).toHaveBeenCalled();
  });

  it('populates and filters the checklist based on used footprints from worker canonical output', async () => {
    // Arrange
    render(
      <ShareDialog
        config={mockConfig}
        injections={mockInjections}
        onClose={mockClose}
        data-testid="share-dialog"
      />
    );

    // Act - trigger success message from worker with canonical that includes the used
    // footprint, the template, and an outline injection
    await act(async () => {
      mockWorker.onmessage({
        data: {
          type: 'success',
          results: {
            canonical: {
              pcbs: {
                board: {
                  template: 'kicad8',
                  footprints: {
                    sw1: { what: 'mx' }, // 'mx' is used, 'choc' is not
                  },
                },
              },
              outlines: {
                board: {
                  base: { what: 'my_svg' }, // 'my_svg' outline injection is used
                },
              },
            },
          },
        },
      });
    });

    // Assert
    expect(
      screen.queryByText(/Analyzing configuration/i)
    ).not.toBeInTheDocument();

    // 'mx' footprint should be listed because it is used
    expect(screen.getByLabelText('mx')).toBeInTheDocument();
    expect(screen.getByLabelText('mx')).toBeChecked();

    // 'kicad8' template should be listed because it is used in the pcbs section
    expect(screen.getByLabelText('kicad8')).toBeInTheDocument();
    expect(screen.getByLabelText('kicad8')).toBeChecked();

    // 'my_svg' outline should be listed because it is used in the outlines section
    expect(screen.getByLabelText('my_svg')).toBeInTheDocument();
    expect(screen.getByLabelText('my_svg')).toBeChecked();

    // 'choc' footprint should NOT be listed because it is not used in the PCB
    expect(screen.queryByLabelText('choc')).not.toBeInTheDocument();
  });

  it('allows unchecking libraries and sharing only the checked ones', async () => {
    // Arrange
    render(
      <ShareDialog
        config={mockConfig}
        injections={mockInjections}
        onClose={mockClose}
        data-testid="share-dialog"
      />
    );

    // Act - mock successful worker run
    await act(async () => {
      mockWorker.onmessage({
        data: {
          type: 'success',
          results: {
            canonical: {
              pcbs: {
                board: {
                  template: 'kicad8',
                  footprints: {
                    sw1: { what: 'mx' },
                  },
                },
              },
              outlines: {
                board: { base: { what: 'my_svg' } },
              },
            },
          },
        },
      });
    });

    // Act - uncheck the 'kicad8' template
    const templateCheckbox = screen.getByLabelText('kicad8');
    fireEvent.click(templateCheckbox);
    expect(templateCheckbox).not.toBeChecked();

    // Act - click Share button
    const shareBtn = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareBtn);

    // Assert
    expect(
      screen.getByText('Shareable Configuration Link')
    ).toBeInTheDocument();
    expect(createShareableUri).toHaveBeenCalledWith({
      config: mockConfig,
      injections: [
        ['footprint', 'mx', 'module.exports = {}'],
        ['outline', 'my_svg', 'outline_content'],
      ],
    });
  });

  it('filters templates not used in the canonical pcbs section', async () => {
    // Arrange
    render(
      <ShareDialog
        config={mockConfig}
        injections={mockInjections}
        onClose={mockClose}
        data-testid="share-dialog"
      />
    );

    // Act - worker returns canonical where the pcb uses kicad5 (not kicad8)
    await act(async () => {
      mockWorker.onmessage({
        data: {
          type: 'success',
          results: {
            canonical: {
              pcbs: {
                board: {
                  template: 'kicad5', // 'kicad8' is NOT used
                  footprints: { sw1: { what: 'mx' } },
                },
              },
            },
          },
        },
      });
    });

    // Assert: 'kicad8' template injection should NOT appear
    expect(screen.queryByLabelText('kicad8')).not.toBeInTheDocument();
    // 'mx' footprint should still appear
    expect(screen.getByLabelText('mx')).toBeInTheDocument();
  });

  it('filters outline injections not used in the canonical outlines section', async () => {
    // Arrange
    render(
      <ShareDialog
        config={mockConfig}
        injections={mockInjections}
        onClose={mockClose}
        data-testid="share-dialog"
      />
    );

    // Act - worker returns canonical where no outline uses 'my_svg'
    await act(async () => {
      mockWorker.onmessage({
        data: {
          type: 'success',
          results: {
            canonical: {
              pcbs: {
                board: {
                  template: 'kicad8',
                  footprints: { sw1: { what: 'mx' } },
                },
              },
              outlines: {
                board: { base: { what: 'rectangle' } }, // only built-in, no 'my_svg'
              },
            },
          },
        },
      });
    });

    // Assert: 'my_svg' outline injection should NOT appear
    expect(screen.queryByLabelText('my_svg')).not.toBeInTheDocument();
    // 'mx' and 'kicad8' should still appear
    expect(screen.getByLabelText('mx')).toBeInTheDocument();
    expect(screen.getByLabelText('kicad8')).toBeInTheDocument();
  });

  it('ignores injections when Include custom libraries is toggled OFF', () => {
    // Arrange
    render(
      <ShareDialog
        config={mockConfig}
        injections={mockInjections}
        onClose={mockClose}
        data-testid="share-dialog"
      />
    );

    // Act - Toggle OFF
    const toggle = screen.getByLabelText('Include custom libraries');
    fireEvent.click(toggle);

    // Assert
    expect(toggle).not.toBeChecked();
    expect(
      screen.queryByText(/Analyzing configuration/i)
    ).not.toBeInTheDocument();

    // Act - Click Share button
    const shareBtn = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareBtn);

    // Assert
    expect(createShareableUri).toHaveBeenCalledWith({
      config: mockConfig,
      injections: undefined,
    });
  });

  it('shows error message if worker analysis fails', async () => {
    // Arrange
    render(
      <ShareDialog
        config={mockConfig}
        injections={mockInjections}
        onClose={mockClose}
        data-testid="share-dialog"
      />
    );

    // Act - Trigger worker error
    await act(async () => {
      mockWorker.onmessage({
        data: {
          type: 'error',
          error: 'YamL parsing error',
        },
      });
    });

    // Assert
    expect(screen.getByText(/YamL parsing error/i)).toBeInTheDocument();
  });
});
