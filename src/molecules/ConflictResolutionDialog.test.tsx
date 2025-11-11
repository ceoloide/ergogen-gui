import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConflictResolutionDialog from './ConflictResolutionDialog';

describe('ConflictResolutionDialog', () => {
  const mockOnResolve = jest.fn();
  const mockOnCancel = jest.fn();
  const injectionName = 'test/footprint';
  const injectionType = 'footprint';

  beforeEach(() => {
    mockOnResolve.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders with the correct injection name and type', () => {
    // Arrange & Act
    render(
      <ConflictResolutionDialog
        injectionName={injectionName}
        injectionType={injectionType}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
        data-testid="conflict-dialog"
      />
    );

    // Assert
    expect(screen.getByText('Footprint Conflict')).toBeInTheDocument();
    expect(screen.getByText(injectionName)).toBeInTheDocument();
    expect(
      screen.getByText(/A footprint with the name/, { exact: false })
    ).toBeInTheDocument();
  });

  it('renders with template type correctly', () => {
    // Arrange & Act
    render(
      <ConflictResolutionDialog
        injectionName="my-template"
        injectionType="template"
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
        data-testid="conflict-dialog"
      />
    );

    // Assert
    expect(screen.getByText('Template Conflict')).toBeInTheDocument();
    expect(
      screen.getByText(/A template with the name/, { exact: false })
    ).toBeInTheDocument();
  });

  it('calls onResolve with "skip" when Skip button is clicked', () => {
    // Arrange
    render(
      <ConflictResolutionDialog
        injectionName={injectionName}
        injectionType={injectionType}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
        data-testid="conflict-dialog"
      />
    );

    // Act
    fireEvent.click(screen.getByTestId('conflict-dialog-skip'));

    // Assert
    expect(mockOnResolve).toHaveBeenCalledWith('skip', false);
  });

  it('calls onResolve with "overwrite" when Overwrite button is clicked', () => {
    // Arrange
    render(
      <ConflictResolutionDialog
        injectionName={injectionName}
        injectionType={injectionType}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
        data-testid="conflict-dialog"
      />
    );

    // Act
    fireEvent.click(screen.getByTestId('conflict-dialog-overwrite'));

    // Assert
    expect(mockOnResolve).toHaveBeenCalledWith('overwrite', false);
  });

  it('calls onResolve with "keep-both" when Keep Both button is clicked', () => {
    // Arrange
    render(
      <ConflictResolutionDialog
        injectionName={injectionName}
        injectionType={injectionType}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
        data-testid="conflict-dialog"
      />
    );

    // Act
    fireEvent.click(screen.getByTestId('conflict-dialog-keep-both'));

    // Assert
    expect(mockOnResolve).toHaveBeenCalledWith('keep-both', false);
  });

  it('calls onResolve with applyToAll=true when checkbox is checked', () => {
    // Arrange
    render(
      <ConflictResolutionDialog
        injectionName={injectionName}
        injectionType={injectionType}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
        data-testid="conflict-dialog"
      />
    );

    // Act
    const checkbox = screen.getByTestId('conflict-dialog-apply-to-all');
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByTestId('conflict-dialog-skip'));

    // Assert
    expect(mockOnResolve).toHaveBeenCalledWith('skip', true);
  });

  it('calls onCancel when Cancel button is clicked', () => {
    // Arrange
    render(
      <ConflictResolutionDialog
        injectionName={injectionName}
        injectionType={injectionType}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
        data-testid="conflict-dialog"
      />
    );

    // Act
    fireEvent.click(screen.getByTestId('conflict-dialog-cancel'));

    // Assert
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('has accessible labels for all interactive elements', () => {
    // Arrange
    render(
      <ConflictResolutionDialog
        injectionName={injectionName}
        injectionType={injectionType}
        onResolve={mockOnResolve}
        onCancel={mockOnCancel}
        data-testid="conflict-dialog"
      />
    );

    // Assert
    expect(
      screen.getByLabelText('Apply this choice to all conflicts')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Skip this footprint')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Overwrite existing footprint')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Keep both footprints')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancel loading')).toBeInTheDocument();
  });
});
