import { render, screen, fireEvent } from '@testing-library/react';
import InstallChip from './InstallChip';

describe('InstallChip', () => {
  it('renders the chip with the correct accessible label', () => {
    // Arrange
    const onInstall = jest.fn();

    // Act
    render(<InstallChip onClick={onInstall} />);

    // Assert
    expect(
      screen.getByRole('button', { name: /install app/i })
    ).toBeInTheDocument();
  });

  it('calls onClick when the chip is clicked', () => {
    // Arrange
    const onInstall = jest.fn();
    render(<InstallChip onClick={onInstall} />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: /install app/i }));

    // Assert
    expect(onInstall).toHaveBeenCalledTimes(1);
  });

  it('uses the provided data-testid', () => {
    // Arrange
    const onInstall = jest.fn();

    // Act
    render(<InstallChip onClick={onInstall} data-testid="custom-testid" />);

    // Assert
    expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
  });

  it('falls back to the default data-testid when not provided', () => {
    // Arrange
    const onInstall = jest.fn();

    // Act
    render(<InstallChip onClick={onInstall} />);

    // Assert
    expect(screen.getByTestId('install-chip')).toBeInTheDocument();
  });
});
