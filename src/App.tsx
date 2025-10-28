import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import styled from 'styled-components';

import Ergogen from './Ergogen';
import Welcome from './pages/Welcome';
import Header from './atoms/Header';
import LoadingBar from './atoms/LoadingBar';
import Banners from './organisms/Banners';
import ConfigContextProvider, {
  useConfigContext,
} from './context/ConfigContext';
import { CONFIG_LOCAL_STORAGE_KEY } from './context/constants';

const App = () => {
  // Synchronously get the initial value to avoid race conditions on first render.

  // Since we changed the local storage key for the Ergogen config, we need to always check for the legacy key first and migrate it if it exists.
  // This migration code can be removed in a future release once we are confident most users have migrated.
  const legacyStoredConfigValue = localStorage.getItem('LOCAL_STORAGE_CONFIG');
  const legacyInitialConfig = legacyStoredConfigValue
    ? JSON.parse(legacyStoredConfigValue)
    : '';
  if (legacyInitialConfig) {
    // The user has a legacy configuration we need to import once, overriding the current initialConfig and then removing the legacy local storage key and value.
    localStorage.removeItem('LOCAL_STORAGE_CONFIG');
    localStorage.setItem(
      CONFIG_LOCAL_STORAGE_KEY,
      JSON.stringify(legacyInitialConfig)
    );
    if (window.gtag) {
      window.gtag('event', 'legacy_config_migrated', {
        event_category: 'config',
      });
    }
  }

  const storedConfigValue = localStorage.getItem(CONFIG_LOCAL_STORAGE_KEY);
  const initialConfig = storedConfigValue ? JSON.parse(storedConfigValue) : '';

  // The useLocalStorage hook now manages the config state in the App component.
  // This ensures that any component that updates the config will trigger a re-render here,
  // which in turn makes the routing logic reactive.
  const [configInput, setConfigInput] = useLocalStorage<string>(
    CONFIG_LOCAL_STORAGE_KEY,
    initialConfig
  );

  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  return (
    // Pass the state and the setter function down to the context provider.
    <ConfigContextProvider
      configInput={configInput}
      setConfigInput={setConfigInput}
      initialInjectionInput={[]}
    >
      <AppContent />
    </ConfigContextProvider>
  );
};

/**
 * Inner component that has access to the config context.
 */
const AppContent = () => {
  const configContext = useConfigContext();
  // Get configInput from context to ensure we have the latest value
  const configInput = configContext?.configInput;

  return (
    <>
      <Header />
      <LoadingBar
        visible={configContext?.isGenerating ?? false}
        data-testid="loading-bar"
      />
      <Banners />
      <PageWrapper>
        <Routes>
          <Route
            path="/"
            // The routing decision is now based on the reactive `configInput` state.
            element={configInput ? <Ergogen /> : <Navigate to="/new" replace />}
          />
          <Route path="/new" element={<Welcome />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageWrapper>
    </>
  );
};

const PageWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export default App;
