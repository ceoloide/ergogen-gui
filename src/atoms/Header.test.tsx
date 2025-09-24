import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Header from './Header';
import { ConfigContext } from '../context/ConfigContext';

const mockSetConfig = jest.fn();
const mockSetShowSettings = jest.fn();

const renderWithContext = (showSettings: boolean) => {
  return render(
    <ConfigContext.Provider value={{
      configInput: '',
      setConfigInput: jest.fn(),
      injectionInput: [],
      setInjectionInput: jest.fn(),
      processInput: Object.assign(jest.fn(), { cancel: jest.fn(), flush: jest.fn() }),
      error: null,
      setError: jest.fn(),
      deprecationWarning: null,
      results: null,
      resultsVersion: 0,
      setResultsVersion: jest.fn(),
      showSettings: showSettings,
      setShowSettings: mockSetShowSettings,
      showConfig: true,
      setShowConfig: jest.fn(),
      debug: false,
      setDebug: jest.fn(),
      autoGen: true,
      setAutoGen: jest.fn(),
      autoGen3D: true,
      setAutoGen3D: jest.fn(),
      kicanvasPreview: true,
      setKicanvasPreview: jest.fn(),
      jscadPreview: false,
      setJscadPreview: jest.fn(),
      experiment: null,
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