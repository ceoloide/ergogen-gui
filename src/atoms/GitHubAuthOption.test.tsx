import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GitHubAuthOption from './GitHubAuthOption';
import { vi } from 'vitest';

describe('GitHubAuthOption', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders "GitHub Connection" title and description', () => {
    render(<GitHubAuthOption />);
    expect(screen.getByText('GitHub Connection')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Connect your GitHub account to enable higher API rate limits/i
      )
    ).toBeInTheDocument();
  });

  it('renders Authenticate button when not authenticated', () => {
    render(<GitHubAuthOption />);
    expect(
      screen.getByTestId('github-authenticate-button')
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('github-sign-out-button')
    ).not.toBeInTheDocument();
  });

  it('renders Connected state and Sign Out button when token is present', () => {
    localStorage.setItem('ergogen:github_token', 'mock_token');
    localStorage.setItem('ergogen:github_username', 'mock_user');
    render(<GitHubAuthOption />);

    expect(screen.getByTestId('github-connected-status')).toHaveTextContent(
      'Connected as: mock_user'
    );
    expect(screen.getByTestId('github-sign-out-button')).toBeInTheDocument();
    expect(
      screen.queryByTestId('github-authenticate-button')
    ).not.toBeInTheDocument();
  });

  it('clears localStorage and updates state on Sign Out click', () => {
    localStorage.setItem('ergogen:github_token', 'mock_token');
    localStorage.setItem('ergogen:github_username', 'mock_user');
    render(<GitHubAuthOption />);

    const signOutBtn = screen.getByTestId('github-sign-out-button');
    fireEvent.click(signOutBtn);

    expect(localStorage.getItem('ergogen:github_token')).toBeNull();
    expect(localStorage.getItem('ergogen:github_username')).toBeNull();
    expect(
      screen.getByTestId('github-authenticate-button')
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('github-sign-out-button')
    ).not.toBeInTheDocument();
  });

  it('initiates device flow and enters polling on Authenticate click', async () => {
    // Step 1 mock response: return user code and verification URI
    const mockDeviceFlowResponse = {
      device_code: 'mock_device_code',
      user_code: '1234-5678',
      verification_uri: 'https://github.com/login/device',
      expires_in: 900,
      interval: 1,
    };

    const fetchMock = global.fetch as any;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDeviceFlowResponse,
    });

    render(<GitHubAuthOption />);

    const authBtn = screen.getByTestId('github-authenticate-button');
    fireEvent.click(authBtn);

    // Verify button goes into loading state
    expect(screen.getByText('Connecting...')).toBeInTheDocument();

    // Verify that instructions and code display appear
    await waitFor(() => {
      expect(
        screen.getByTestId('github-auth-flow-container')
      ).toBeInTheDocument();
    });
    expect(screen.getByTestId('github-user-code')).toHaveTextContent(
      '1234-5678'
    );
    expect(screen.getByTestId('github-verify-button')).toHaveAttribute(
      'href',
      'https://github.com/login/device'
    );
  });

  it('cancels authentication flow when Cancel button is clicked', async () => {
    const mockDeviceFlowResponse = {
      device_code: 'mock_device_code',
      user_code: '1234-5678',
      verification_uri: 'https://github.com/login/device',
      expires_in: 900,
      interval: 1,
    };

    const fetchMock = global.fetch as any;
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDeviceFlowResponse,
    });

    render(<GitHubAuthOption />);

    const authBtn = screen.getByTestId('github-authenticate-button');
    fireEvent.click(authBtn);

    await waitFor(() => {
      expect(
        screen.getByTestId('github-auth-flow-container')
      ).toBeInTheDocument();
    });

    const cancelBtn = screen.getByTestId('github-cancel-button');
    fireEvent.click(cancelBtn);

    expect(
      screen.queryByTestId('github-auth-flow-container')
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId('github-authenticate-button')
    ).toBeInTheDocument();
  });
});
