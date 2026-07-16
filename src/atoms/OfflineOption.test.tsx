import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OfflineOption from './OfflineOption';

describe('OfflineOption', () => {
  const mockOnInstall = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Offline App" title', () => {
    render(
      <OfflineOption
        isAvailable={true}
        isInstalled={false}
        isInstalling={false}
        onInstall={mockOnInstall}
      />
    );
    expect(screen.getByText('Offline App')).toBeInTheDocument();
  });

  it('renders installation instructions when PWA is available to install', () => {
    render(
      <OfflineOption
        isAvailable={true}
        isInstalled={false}
        isInstalling={false}
        onInstall={mockOnInstall}
      />
    );
    expect(
      screen.getByText(
        'Install the app locally to access it offline without network connectivity.'
      )
    ).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /install app/i });
    expect(button).toBeEnabled();
  });

  it('calls onInstall when install button is clicked', () => {
    render(
      <OfflineOption
        isAvailable={true}
        isInstalled={false}
        isInstalling={false}
        onInstall={mockOnInstall}
      />
    );
    const button = screen.getByRole('button', { name: /install app/i });
    fireEvent.click(button);
    expect(mockOnInstall).toHaveBeenCalledTimes(1);
  });

  it('shows "Installing..." and is disabled when installation is in progress', () => {
    render(
      <OfflineOption
        isAvailable={true}
        isInstalled={false}
        isInstalling={true}
        onInstall={mockOnInstall}
      />
    );
    const button = screen.getByRole('button', { name: /installing\.\.\./i });
    expect(button).toBeDisabled();
  });

  it('shows "Installed" and is disabled when already installed', () => {
    render(
      <OfflineOption
        isAvailable={true}
        isInstalled={true}
        isInstalling={false}
        onInstall={mockOnInstall}
      />
    );
    expect(
      screen.getByText('The application is installed and available offline.')
    ).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /installed/i });
    expect(button).toBeDisabled();
  });

  it('shows warning text and "Unavailable" button when installation is unsupported', () => {
    render(
      <OfflineOption
        isAvailable={false}
        isInstalled={false}
        isInstalling={false}
        onInstall={mockOnInstall}
      />
    );
    expect(
      screen.getByText(
        'PWA installation is not supported by your browser or environment.'
      )
    ).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /unavailable/i });
    expect(button).toBeDisabled();
  });
});
