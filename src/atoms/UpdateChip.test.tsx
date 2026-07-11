import { render, screen, fireEvent } from '@testing-library/react';
import UpdateChip from './UpdateChip';

describe('UpdateChip', () => {
  it('renders the chip with the correct accessible label', () => {
    // Arrange
    const onUpdate = jest.fn();

    // Act
    render(<UpdateChip onClick={onUpdate} />);

    // Assert
    expect(
      screen.getByRole('button', { name: /update available/i })
    ).toBeInTheDocument();
  });

  it('calls onClick when the chip is clicked', () => {
    // Arrange
    const onUpdate = jest.fn();
    render(<UpdateChip onClick={onUpdate} />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: /update available/i }));

    // Assert
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it('uses the provided data-testid', () => {
    // Arrange
    const onUpdate = jest.fn();

    // Act
    render(<UpdateChip onClick={onUpdate} data-testid="custom-testid" />);

    // Assert
    expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
  });

  it('falls back to the default data-testid when not provided', () => {
    // Arrange
    const onUpdate = jest.fn();

    // Act
    render(<UpdateChip onClick={onUpdate} />);

    // Assert
    expect(screen.getByTestId('update-chip')).toBeInTheDocument();
  });

  it('changes text to "Updating version..." and disables the button when clicked', () => {
    // Arrange
    const onUpdate = jest.fn();
    render(<UpdateChip onClick={onUpdate} />);
    const chip = screen.getByRole('button', { name: /update available/i });

    // Act
    fireEvent.click(chip);

    // Assert
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Updating version...')).toBeInTheDocument();
    expect(chip).toBeDisabled();
  });
});
