import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShareVersionCompatibilityDialog, {
  VersionCompatibilityReport,
} from './ShareVersionCompatibilityDialog';

describe('ShareVersionCompatibilityDialog', () => {
  const mockOnAccept = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnAccept.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders GUI warning correctly', () => {
    const report: VersionCompatibilityReport = {
      isCompatible: false,
      guiWarning: {
        current: '0.8.9',
        shared: '0.9.0',
      },
    };

    render(
      <ShareVersionCompatibilityDialog
        report={report}
        onAccept={mockOnAccept}
        onCancel={mockOnCancel}
        data-testid="compat-dialog"
      />
    );

    expect(
      screen.getByText('Version Compatibility Warning')
    ).toBeInTheDocument();
    expect(screen.getByText('GUI Version Mismatch')).toBeInTheDocument();
    expect(screen.getByTestId('gui-mismatch-badge')).toBeInTheDocument();
    expect(screen.getByTestId('gui-mismatch-badge')).toHaveTextContent(
      'Mismatch'
    );
    expect(screen.getByText(/newer version of the GUI/)).toBeInTheDocument();
    expect(screen.getByText('v0.9.0')).toBeInTheDocument();
    expect(screen.getByText('v0.8.9')).toBeInTheDocument();
  });

  it('renders Ergogen warning correctly', () => {
    const report: VersionCompatibilityReport = {
      isCompatible: false,
      ergogenWarning: {
        current: '4.2.1',
        shared: '4.3.0',
      },
    };

    render(
      <ShareVersionCompatibilityDialog
        report={report}
        onAccept={mockOnAccept}
        onCancel={mockOnCancel}
        data-testid="compat-dialog"
      />
    );

    expect(screen.getByText('Ergogen Version Mismatch')).toBeInTheDocument();
    expect(screen.getByTestId('ergogen-mismatch-badge')).toBeInTheDocument();
    expect(screen.getByTestId('ergogen-mismatch-badge')).toHaveTextContent(
      'Mismatch'
    );
    expect(screen.getByText(/newer version of Ergogen/)).toBeInTheDocument();
    expect(screen.getByText('4.3.0')).toBeInTheDocument();
    expect(screen.getByText('4.2.1')).toBeInTheDocument();
  });

  it('renders Custom Ergogen warning with clickable repo link correctly', () => {
    const report: VersionCompatibilityReport = {
      isCompatible: false,
      customErgogenWarning: {
        shared: 'github:ceoloide/ergogen#v4.3.0',
        url: 'https://github.com/ceoloide/ergogen/tree/v4.3.0',
        label: 'ceoloide/ergogen#v4.3.0',
      },
    };

    render(
      <ShareVersionCompatibilityDialog
        report={report}
        onAccept={mockOnAccept}
        onCancel={mockOnCancel}
        data-testid="compat-dialog"
      />
    );

    expect(screen.getByText('Custom Ergogen Version Used')).toBeInTheDocument();
    expect(screen.getByTestId('custom-version-badge')).toBeInTheDocument();
    expect(screen.getByTestId('custom-version-badge')).toHaveTextContent(
      'Custom'
    );
    expect(screen.getByText(/custom version of Ergogen:/)).toBeInTheDocument();
    expect(
      screen.getByText('github:ceoloide/ergogen#v4.3.0')
    ).toBeInTheDocument();

    const link = screen.getByTestId('compat-dialog-custom-repo-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/ceoloide/ergogen/tree/v4.3.0'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('ceoloide/ergogen#v4.3.0')).toBeInTheDocument();
  });

  it('calls onAccept when Accept and Load button is clicked', () => {
    const report: VersionCompatibilityReport = {
      isCompatible: false,
      guiWarning: {
        current: '0.8.9',
        shared: '0.9.0',
      },
    };

    render(
      <ShareVersionCompatibilityDialog
        report={report}
        onAccept={mockOnAccept}
        onCancel={mockOnCancel}
        data-testid="compat-dialog"
      />
    );

    fireEvent.click(screen.getByTestId('compat-dialog-accept'));
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const report: VersionCompatibilityReport = {
      isCompatible: false,
      guiWarning: {
        current: '0.8.9',
        shared: '0.9.0',
      },
    };

    render(
      <ShareVersionCompatibilityDialog
        report={report}
        onAccept={mockOnAccept}
        onCancel={mockOnCancel}
        data-testid="compat-dialog"
      />
    );

    fireEvent.click(screen.getByTestId('compat-dialog-cancel'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('has accessible labels for interactive buttons', () => {
    const report: VersionCompatibilityReport = {
      isCompatible: false,
      guiWarning: {
        current: '0.8.9',
        shared: '0.9.0',
      },
    };

    render(
      <ShareVersionCompatibilityDialog
        report={report}
        onAccept={mockOnAccept}
        onCancel={mockOnCancel}
        data-testid="compat-dialog"
      />
    );

    expect(
      screen.getByLabelText('Accept and load configuration')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Cancel configuration loading')
    ).toBeInTheDocument();
  });
});
