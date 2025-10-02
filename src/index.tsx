import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import styled from "styled-components";
import './index.css';
import App from './App';
import { loader } from '@monaco-editor/react';
import { registerErgogenLanguage } from './utils/ergogen-language';

/**
 * The main container for the entire application.
 * It sets up the basic flex layout, text color, and font for the app.
 */
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #FFFFFF;
  height: 100%;
  width: 100%;
  font-family: 'Roboto', sans-serif;
`;

// This is the main entry point for the React application.
// It sets up the root container and renders the main App component,
// wrapping it with the router.
const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

loader.init().then((monaco) => {
  registerErgogenLanguage(monaco);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AppContainer>
          <App />
        </AppContainer>
      </BrowserRouter>
    </React.StrictMode>
  );
});