import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { loader } from '@monaco-editor/react';
import App from './App';
import { defineErgogenTheme } from './utils/monaco';
import { theme } from './theme/theme';

/**
 * The main container for the entire application.
 * It sets up the basic flex layout, text color, and font for the app.
 */
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  height: 100%;
  width: 100%;
  font-family: 'Roboto', sans-serif;
`;

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
    width: 100%;
    display: flex;
  }

  body {
    margin: 0;
    font-family: ${theme.fonts.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${theme.colors.text};
  }

  code {
    font-family: ${theme.fonts.code};
  }

  @media (max-width: 639px) {
    .show-config > .gutter,
    .show-config > div:last-of-type {
      display: none;
    }

    .show-config > div:first-of-type {
      width: 100% !important;
      padding-right: 0 !important;
    }

    .show-outputs > .gutter,
    .show-outputs > div:first-of-type {
      display: none;
    }

    .show-outputs > div:last-of-type {
      width: 100% !important;
      padding-left: 0 !important;
    }
  }
`;

loader.init().then((monaco) => {
  defineErgogenTheme(monaco);

  // This is the main entry point for the React application.
  // It sets up the root container and renders the main App component,
  // wrapping it with the router.
  const container = document.getElementById('root');
  const root = createRoot(container!); // createRoot(container!) if you use TypeScript
  root.render(
    <React.StrictMode>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <AppContainer>
          <GlobalStyle />
          <App />
        </AppContainer>
      </BrowserRouter>
    </React.StrictMode>
  );
});
