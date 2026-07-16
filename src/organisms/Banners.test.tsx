import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Banners from './Banners';
import { useConfigContext } from '../context/ConfigContext';

vi.mock('../context/ConfigContext', () => ({
  useConfigContext: vi.fn(),
}));

describe('Banners', () => {
  const mockClearError = vi.fn();
  const mockClearWarning = vi.fn();
  const mockClearSkippedWarning = vi.fn();
  const mockClearInfo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when there are no warnings or errors', () => {
    (useConfigContext as any).mockReturnValue({
      error: null,
      deprecationWarning: null,
      skippedWarning: null,
      info: null,
      clearError: mockClearError,
      clearWarning: mockClearWarning,
      clearSkippedWarning: mockClearSkippedWarning,
      clearInfo: mockClearInfo,
    });

    render(<Banners />);
    expect(screen.queryByTestId('info-banner')).not.toBeInTheDocument();
    expect(screen.queryByTestId('warning-banner')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('skipped-injections-banner')
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-banner')).not.toBeInTheDocument();
  });

  it('renders info banner when info is present and clears it on click', () => {
    (useConfigContext as any).mockReturnValue({
      error: null,
      deprecationWarning: null,
      skippedWarning: null,
      info: 'Info message',
      clearError: mockClearError,
      clearWarning: mockClearWarning,
      clearSkippedWarning: mockClearSkippedWarning,
      clearInfo: mockClearInfo,
    });

    render(<Banners />);
    expect(screen.getByTestId('info-banner')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-info-banner'));
    expect(mockClearInfo).toHaveBeenCalledTimes(1);
  });

  it('renders deprecation warning banner when present and clears it on click', () => {
    (useConfigContext as any).mockReturnValue({
      error: null,
      deprecationWarning: 'Deprecation warning',
      skippedWarning: null,
      info: null,
      clearError: mockClearError,
      clearWarning: mockClearWarning,
      clearSkippedWarning: mockClearSkippedWarning,
      clearInfo: mockClearInfo,
    });

    render(<Banners />);
    expect(screen.getByTestId('warning-banner')).toBeInTheDocument();
    expect(screen.getByText('Deprecation warning')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-warning-banner'));
    expect(mockClearWarning).toHaveBeenCalledTimes(1);
  });

  it('renders skipped warning banner when present and clears it on click', () => {
    (useConfigContext as any).mockReturnValue({
      error: null,
      deprecationWarning: null,
      skippedWarning: 'Skipped injections warning',
      info: null,
      clearError: mockClearError,
      clearWarning: mockClearWarning,
      clearSkippedWarning: mockClearSkippedWarning,
      clearInfo: mockClearInfo,
    });

    render(<Banners />);
    expect(screen.getByTestId('skipped-injections-banner')).toBeInTheDocument();
    expect(screen.getByText('Skipped injections warning')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-skipped-banner'));
    expect(mockClearSkippedWarning).toHaveBeenCalledTimes(1);
  });

  it('renders error banner when present and clears it on click', () => {
    (useConfigContext as any).mockReturnValue({
      error: 'Error message',
      deprecationWarning: null,
      skippedWarning: null,
      info: null,
      clearError: mockClearError,
      clearWarning: mockClearWarning,
      clearSkippedWarning: mockClearSkippedWarning,
      clearInfo: mockClearInfo,
    });

    render(<Banners />);
    expect(screen.getByTestId('error-banner')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-error-banner'));
    expect(mockClearError).toHaveBeenCalledTimes(1);
  });
});
