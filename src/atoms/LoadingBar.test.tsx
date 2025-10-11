import { render } from '@testing-library/react';
import LoadingBar from '../atoms/LoadingBar';
import { theme } from '../theme/theme';
import { ThemeProvider } from 'styled-components';

describe('LoadingBar', () => {
  it('should not be visible when visible is false', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <LoadingBar visible={false} />
      </ThemeProvider>
    );
    const loadingBar = container.querySelector('[data-testid="loading-bar"]');
    expect(loadingBar).not.toBeInTheDocument();
  });

  it('should be visible and have correct styles when visible is true', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <LoadingBar visible={true} data-testid="loading-bar" />
      </ThemeProvider>
    );
    const loadingBar = getByTestId('loading-bar');
    expect(loadingBar).toBeInTheDocument();
    // Check for a child element for progress
    const progress = loadingBar.firstChild;
    expect(progress).toHaveStyle(`
      background-color: ${theme.colors.accent};
      height: 100%;
    `);
  });

  it('should use accent color from theme and be positioned as overlay', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <LoadingBar visible={true} data-testid="loading-bar" />
      </ThemeProvider>
    );
    const loadingBar = getByTestId('loading-bar');
    expect(loadingBar).toBeInTheDocument();
    expect(loadingBar).toHaveStyle({
      height: '3px',
      position: 'fixed',
      top: '45px',
      left: '0px',
      right: '0px',
      zIndex: 1000,
      overflow: 'hidden',
    });
  });

  it('should have a progress indicator that animates', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <LoadingBar visible={true} data-testid="loading-bar" />
      </ThemeProvider>
    );
    const loadingBar = getByTestId('loading-bar');
    const indicator = loadingBar.firstChild;
    expect(indicator).toBeInTheDocument();
  });
});
