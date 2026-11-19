import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import Button from './Button';
import GithubIcon from './GithubIcon';

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  gap: 1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
`;

const OptionLabel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: left;
`;

const OptionTitle = styled.span`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semiBold};
`;

const OptionDescription = styled.span`
  color: ${theme.colors.textDarker};
  font-size: ${theme.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`;

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.colors.successDark || 'hsl(120, 50%, 35%)'};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semiBold};
  margin-top: 0.5rem;
`;

const ErrorText = styled.span`
  color: ${theme.colors.error || '#ff6d6d'};
  font-size: ${theme.fontSizes.sm};
  margin-top: 0.25rem;
`;

const AuthFlowContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  padding: 1rem;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const CodeDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background-color: ${theme.colors.background};
  border: 1px dashed ${theme.colors.border};
  border-radius: 4px;
  font-family: ${theme.fonts.code};
  font-size: 1.25rem;
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text};
  letter-spacing: 0.05em;
`;

const CodeLabel = styled.span`
  font-size: 0.7rem;
  color: ${theme.colors.textDarker};
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  font-family: ${theme.fonts.body};
  letter-spacing: 0.1em;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SignOutButton = styled(Button)`
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.text};

  &:hover {
    background-color: ${theme.colors.buttonHover};
    border-color: ${theme.colors.border};
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.textDarker};

  &:hover {
    background-color: ${theme.colors.buttonHover};
    color: ${theme.colors.text};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  width: 100%;
`;

const GitHubAuthOption = (): JSX.Element => {
  const [token, setToken] = useState<string | null>(() =>
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('ergogen:github_token')
      : null
  );
  const [username, setUsername] = useState<string | null>(() =>
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('ergogen:github_username')
      : null
  );
  const [loading, setLoading] = useState(false);
  const [, setDeviceCode] = useState<string | null>(null);
  const [userCode, setUserCode] = useState<string | null>(null);
  const [verificationUri, setVerificationUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | number | null>(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const cancelAuth = () => {
    setDeviceCode(null);
    setUserCode(null);
    setVerificationUri(null);
    setLoading(false);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const handleSignOut = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('ergogen:github_token');
      localStorage.removeItem('ergogen:github_username');
    }
    setToken(null);
    setUsername(null);
    setError(null);
  };

  const startPolling = (
    code: string,
    intervalSeconds: number,
    clientId: string
  ) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    let currentInterval = intervalSeconds || 5;
    const tokenUrl =
      'https://api.allorigins.win/raw?url=' +
      encodeURIComponent('https://github.com/login/oauth/access_token');

    const poll = async () => {
      try {
        const res = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            device_code: code,
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          }),
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();

        if (data.error) {
          if (data.error === 'authorization_pending') {
            return;
          } else if (data.error === 'slow_down') {
            currentInterval += 5;
            resetInterval();
            return;
          } else {
            setError(
              data.error_description || `Authentication failed: ${data.error}`
            );
            cancelAuth();
            return;
          }
        }

        if (data.access_token) {
          const accessToken = data.access_token;
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('ergogen:github_token', accessToken);
          }
          setToken(accessToken);

          try {
            const userRes = await fetch('https://api.github.com/user', {
              headers: {
                Authorization: `token ${accessToken}`,
                Accept: 'application/json',
              },
            });
            if (userRes.ok) {
              const userData = await userRes.json();
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('ergogen:github_username', userData.login);
              }
              setUsername(userData.login);
            } else {
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem(
                  'ergogen:github_username',
                  'Authorized User'
                );
              }
              setUsername('Authorized User');
            }
          } catch (_e) {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(
                'ergogen:github_username',
                'Authorized User'
              );
            }
            setUsername('Authorized User');
          }

          setDeviceCode(null);
          setUserCode(null);
          setVerificationUri(null);
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        }
      } catch (err) {
        console.error('Error polling for token:', err);
      }
    };

    const resetInterval = () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      pollIntervalRef.current = setInterval(poll, currentInterval * 1000);
    };

    pollIntervalRef.current = setInterval(poll, currentInterval * 1000);
  };

  const handleAuthenticate = async () => {
    setLoading(true);
    setError(null);
    try {
      const clientId =
        (import.meta.env && import.meta.env.VITE_GITHUB_CLIENT_ID) ||
        'Iv23li8uJbQsh9t5wR8M';
      const proxyUrl =
        'https://api.allorigins.win/raw?url=' +
        encodeURIComponent('https://github.com/login/device/code');

      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ client_id: clientId }),
      });

      if (!res.ok) {
        throw new Error(
          `Failed to initialize authentication: ${res.statusText}`
        );
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error_description || data.error);
      }

      setDeviceCode(data.device_code);
      setUserCode(data.user_code);
      setVerificationUri(data.verification_uri);
      setLoading(false);

      startPolling(data.device_code, data.interval, clientId);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || 'An error occurred during authentication.');
      setLoading(false);
    }
  };

  return (
    <OptionContainer>
      <HeaderRow>
        <OptionLabel>
          <OptionTitle>GitHub Connection</OptionTitle>
          <OptionDescription>
            Connect your GitHub account to enable higher API rate limits when
            pulling keyboard configurations from repositories, and to enable
            remote configuration syncing in the future.
          </OptionDescription>
          {token && username && (
            <ConnectionStatus data-testid="github-connected-status">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}
              >
                check_circle
              </span>
              <span>Connected as: {username}</span>
            </ConnectionStatus>
          )}
          {error && (
            <ErrorText data-testid="github-auth-error">{error}</ErrorText>
          )}
        </OptionLabel>
        {!userCode && (
          <ButtonWrapper>
            {token ? (
              <SignOutButton
                size="sm"
                onClick={handleSignOut}
                data-testid="github-sign-out-button"
              >
                Sign Out
              </SignOutButton>
            ) : (
              <Button
                size="sm"
                onClick={handleAuthenticate}
                disabled={loading}
                data-testid="github-authenticate-button"
              >
                <ButtonContent>
                  <GithubIcon />
                  <span>{loading ? 'Connecting...' : 'Authenticate'}</span>
                </ButtonContent>
              </Button>
            )}
          </ButtonWrapper>
        )}
      </HeaderRow>

      {userCode && verificationUri && (
        <AuthFlowContainer data-testid="github-auth-flow-container">
          <OptionDescription style={{ margin: 0 }}>
            To complete authentication, click the verification button below and
            enter this code:
          </OptionDescription>
          <CodeDisplay>
            <CodeLabel>Verification Code</CodeLabel>
            <span data-testid="github-user-code">{userCode}</span>
          </CodeDisplay>
          <ActionButtons>
            <CancelButton
              size="sm"
              onClick={cancelAuth}
              data-testid="github-cancel-button"
            >
              Cancel
            </CancelButton>
            <Button
              size="sm"
              as="a"
              href={verificationUri}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="github-verify-button"
              style={{ textDecoration: 'none' }}
            >
              Verify on GitHub
            </Button>
          </ActionButtons>
        </AuthFlowContainer>
      )}
    </OptionContainer>
  );
};

export default GitHubAuthOption;
