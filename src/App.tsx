import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { getConfigFromHash } from './utils/share';

const App = () => {
  // Synchronously get the initial value to avoid race conditions on first render.

  // Check for shared config in hash fragment first (highest priority)
  // This must happen before localStorage initialization
  const hashResult = getConfigFromHash();
  let initialConfig = '';
  let initialInjectionInput: string[][] = [];
  let hashError: string | null = null;

  if (hashResult) {
    if (hashResult.success) {
      // Use shared config from hash fragment - this takes priority over localStorage
      const sharedConfig = hashResult.config;
      initialConfig = sharedConfig.config;
      // Handle injections: if present (even if empty array), overwrite existing ones
      // If undefined, keep existing injections (not present in shared config)
      if (sharedConfig.injections !== undefined) {
        initialInjectionInput = sharedConfig.injections;
        // Store in localStorage so useLocalStorage picks it up and overwrites existing injections
        // This ensures injections from shared config take precedence (like GitHub loading)
        localStorage.setItem(
          'ergogen:injection',
          JSON.stringify(initialInjectionInput)
        );
      }
      // Temporarily store in localStorage so useLocalStorage picks it up
      // This ensures the config persists if user navigates away and comes back
      localStorage.setItem(
        CONFIG_LOCAL_STORAGE_KEY,
        JSON.stringify(initialConfig)
      );
      // Clear the hash fragment after reading it
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    } else {
      // Store error message to display after ConfigContext is available
      hashError = hashResult.message;
      // Clear the hash fragment to prevent retrying on navigation
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  } else {
    // Since we changed the local storage key for the Ergogen config, we need to always check for the legacy key first and migrate it if it exists.
    // This migration code can be removed in a future release once we are confident most users have migrated.
    const legacyStoredConfigValue = localStorage.getItem(
      'LOCAL_STORAGE_CONFIG'
    );
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
    initialConfig = storedConfigValue ? JSON.parse(storedConfigValue) : '';
  }

  // The useLocalStorage hook now manages the config state in the App component.
  // This ensures that any component that updates the config will trigger a re-render here,
  // which in turn makes the routing logic reactive.
  const [configInput, setConfigInput] = useLocalStorage<string>(
    CONFIG_LOCAL_STORAGE_KEY,
    initialConfig
  );

  return (
    // Pass the state and the setter function down to the context provider.
    <ConfigContextProvider
      configInput={configInput}
      setConfigInput={setConfigInput}
      initialInjectionInput={initialInjectionInput}
      hashError={hashError}
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
