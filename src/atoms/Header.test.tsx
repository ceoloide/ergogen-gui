import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Header from './Header';
import { ConfigContext, Config } from '../context/ConfigContext';

const mockSetConfig = jest.fn();
const mockSetShowSettings = jest.fn();

const renderWithContext = (showSettings: boolean) => {
  return render(
    <ConfigContext.Provider value={{
      config: {} as Config,
      setConfig: mockSetConfig,
      showSettings: showSettings,
      setShowSettings: mockSetShowSettings,
      error: '',
      setError: jest.fn(),
      loading: false,
      setLoading: jest.fn(),
      autoSync: false,
      setAutoSync: jest.fn(),
      gistId: '',
      setGistId: jest.fn(),
      pendingChanges: false,
      setPendingChanges: jest.fn(),
    }}>
      <Header />
    </ConfigContext.Provider>
  );
};

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with logo and links', () => {
    renderWithContext(false);
    expect(screen.getByText('Ergogen')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });

  it('has correct href for docs and discord links', () => {
    renderWithContext(false);
    expect(screen.getByText('Docs').closest('a')).toHaveAttribute('href', 'https://docs.ergogen.xyz/');
    expect(screen.getByRole('link', { name: /discord/i })).toHaveAttribute('href', 'https://discord.gg/nbKcAZB');
  });

  it('calls setShowSettings when the settings button is clicked', () => {
    renderWithContext(false);
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    expect(mockSetShowSettings).toHaveBeenCalledTimes(1);
    expect(mockSetShowSettings).toHaveBeenCalledWith(true);
  });

  it('shows the correct icon when showSettings is true', () => {
    renderWithContext(true);
    expect(screen.getByText('keyboard_alt')).toBeInTheDocument();
  });

  it('shows the correct icon when showSettings is false', () => {
    renderWithContext(false);
    expect(screen.getByText('settings')).toBeInTheDocument();
  });
});