import { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import styled from 'styled-components';

import Ergogen from './Ergogen';
import Welcome from './pages/Welcome';
import KleEditorPage from './pages/KleEditorPage';
import Header from './atoms/Header';
import LoadingBar from './atoms/LoadingBar';
import Banners from './organisms/Banners';
import SideNavigation from './molecules/SideNavigation';
import {
  ConfigContextProvider,
  useConfigContext,
} from './context/ConfigContext';
import { CONFIG_LOCAL_STORAGE_KEY } from './context/constants';
import { getConfigFromHash } from './utils/share';
import ConflictResolutionDialog from './molecules/ConflictResolutionDialog';
import { useInjectionConflictResolution } from './hooks/useInjectionConflictResolution';

// Module-level variable to persist hash result across React StrictMode remounts
// React StrictMode in dev mode intentionally remounts components, which resets refs
let cachedHashResult: ReturnType<typeof getConfigFromHash> | null = null;
let hashHasBeenRead = false;

const App = () => {
  // Synchronously get the initial value to avoid race conditions on first render.

  // Store hash result in a module-level variable so it persists across StrictMode remounts
  // React StrictMode causes components to unmount/remount, which resets refs
  if (!hashHasBeenRead) {
    // Only read hash once, ever (persists across StrictMode remounts)
    cachedHashResult = getConfigFromHash();
    hashHasBeenRead = true;
  }
  const hashResult = cachedHashResult;

  let initialConfig = '';
  const initialInjectionInput: string[][] = [];
  let hashError: string | null = null;

  // Store shared config data for deferred processing with conflict resolution
  // Use a ref to capture synchronously, then state to trigger re-renders
  const pendingSharedConfigRef = useRef<{
    config: string;
    injections?: string[][];
  } | null>(null);

  if (hashResult) {
    if (hashResult.success) {
      // Use shared config from hash fragment
      const sharedConfig = hashResult.config;

      // Store the shared config data to process with conflict resolution after React renders
      if (pendingSharedConfigRef.current === null) {
        pendingSharedConfigRef.current = {
          config: sharedConfig.config,
          injections: sharedConfig.injections,
        };
      }

      // Check if we have injections that might conflict
      const hasInjections =
        sharedConfig.injections && sharedConfig.injections.length > 0;

      if (!hasInjections) {
        // No injections, safe to load config immediately
        initialConfig = sharedConfig.config;
        localStorage.setItem(
          CONFIG_LOCAL_STORAGE_KEY,
          JSON.stringify(initialConfig)
        );
      } else {
        // We have injections. Defer loading the new config until conflicts are resolved.
        // We will fall through to load the *existing* config from local storage for now.
      }

      // Clear the hash fragment after reading it
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    } else {
      // Store error message to display after ConfigContext is available
      hashError = hashResult.message;
      console.error('[App] Failed to load shared configuration from hash', {
        error: hashResult.error,
        message: hashResult.message,
        hashLength: window.location.hash.length,
      });
      // Clear the hash fragment to prevent retrying on navigation
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  }

  // Load from local storage if:
  // 1. No hash result provided
  // 2. Hash result was successful but had injections (deferred loading)
  // 3. Hash result failed (we might want to show empty, but let's stick to original behavior of NOT loading local if hash failed?
  //    Actually, original behavior was: if (hashResult) { ... } else { load local }.
  //    So if hash failed, it did NOT load local. initialConfig remained ''.
  const shouldLoadFromLocalStorage =
    !hashResult ||
    !hashResult.success ||
    (hashResult.success &&
      hashResult.config.injections &&
      hashResult.config.injections.length > 0);

  if (shouldLoadFromLocalStorage) {
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
    // Only overwrite initialConfig if we found something (it might be '' if hash failed)
    // Actually, if shouldLoadFromLocalStorage is true, initialConfig is currently '' (default).
    if (storedConfigValue) {
      initialConfig = JSON.parse(storedConfigValue);
    }
  }

  // The useLocalStorage hook now manages the config state in the App component.
  // This ensures that any component that updates the config will trigger a re-render here,
  // which in turn makes the routing logic reactive.
  const [configInput, setConfigInput] = useLocalStorage<string>(
    CONFIG_LOCAL_STORAGE_KEY,
    initialConfig
  );

  // Convert ref to state so it can be passed as a prop and trigger re-renders
  const [pendingSharedConfig, setPendingSharedConfig] = useState<{
    config: string;
    injections?: string[][];
  } | null>(null);

  // Set state from ref on mount to ensure it's available for AppContent
  // This must run synchronously or the ref value will be lost
  useEffect(() => {
    if (pendingSharedConfigRef.current) {
      setPendingSharedConfig(pendingSharedConfigRef.current);
    }
  }, []); // Only run once on mount

  return (
    // Pass the state and the setter function down to the context provider.
    <ConfigContextProvider
      configInput={configInput}
      setConfigInput={setConfigInput}
      initialInjectionInput={initialInjectionInput}
      hashError={hashError}
    >
      <AppContent pendingSharedConfig={pendingSharedConfig} />
    </ConfigContextProvider>
  );
};

/**
 * Inner component that has access to the config context.
 */
const AppContent = ({
  pendingSharedConfig,
}: {
  pendingSharedConfig?: { config: string; injections?: string[][] } | null;
}) => {
  const configContext = useConfigContext();
  // Get configInput from context to ensure we have the latest value
  const configInput = configContext?.configInput;

  // Track if we've already processed the initial pending shared config
  const hasProcessedInitialSharedConfig = useRef(false);
  // Store pending shared config in a ref so it persists across renders
  // Initialize with the prop value - this captures it on first render
  const pendingSharedConfigRef = useRef(pendingSharedConfig);

  // Update ref if prop changes (though it should only be set on initial mount)
  if (pendingSharedConfig !== pendingSharedConfigRef.current) {
    pendingSharedConfigRef.current = pendingSharedConfig;
  }

  // Use the injection conflict resolution hook
  const {
    currentConflict,
    processInjectionsWithConflictResolution,
    handleConflictResolution,
    handleConflictCancel,
  } = useInjectionConflictResolution({
    setInjectionInput: (injections) =>
      configContext?.setInjectionInput(injections),
    setConfigInput: (config) => configContext?.setConfigInput(config),
    generateNow: async (config, injections, options) => {
      if (configContext) {
        await configContext.generateNow(config, injections, options);
      }
    },
    getCurrentInjections: () => configContext?.injectionInput || [],
    onComplete: async (config, injections) => {
      // Store merged result in localStorage to persist
      localStorage.setItem('ergogen:injection', JSON.stringify(injections));
      // Store config in localStorage
      localStorage.setItem(CONFIG_LOCAL_STORAGE_KEY, JSON.stringify(config));
    },
    setError: (error) => configContext?.setError(error),
  });

  /**
   * Effect to process pending shared config from initial hash fragment load.
   * This processes the config with conflict resolution after React has rendered.
   * Uses the prop directly so it re-runs when pendingSharedConfig is set.
   */
  useEffect(() => {
    // Wait for configContext to be available
    if (!configContext) {
      return;
    }

    // Use the prop directly - it will be set by the parent App component's useEffect
    if (!pendingSharedConfig) {
      return;
    }

    if (hasProcessedInitialSharedConfig.current) {
      return;
    }

    // Mark as processed to prevent re-processing on re-renders
    hasProcessedInitialSharedConfig.current = true;

    // Process the pending shared config with conflict resolution

    if (
      pendingSharedConfig.injections !== undefined &&
      pendingSharedConfig.injections.length > 0
    ) {
      // If we have injections, we defer setting the config until conflicts are resolved.
      // The processInjectionsWithConflictResolution function will handle setting the config
      // once resolution is complete (or if there are no conflicts).
      processInjectionsWithConflictResolution(
        pendingSharedConfig.injections,
        pendingSharedConfig.config
      ).catch((error) => {
        console.error(
          '[App] Error processing injections from initial hash:',
          error
        );
        configContext.setError(
          `Failed to process injections: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      });
    } else {
      // No injections to process, just set config and generate
      // This handles the case where we loaded the config immediately in the parent component
      // but we still need to ensure the context is updated and generation runs.
      configContext.setConfigInput(pendingSharedConfig.config);
      configContext.generateNow(
        pendingSharedConfig.config,
        configContext.injectionInput,
        {
          pointsonly: false,
        }
      );
    }
  }, [
    configContext,
    pendingSharedConfig,
    processInjectionsWithConflictResolution,
  ]); // Re-run when configContext or pendingSharedConfig becomes available

  /**
   * Effect to handle hash fragment changes when navigating to shared configurations.
   * This allows loading shared configs even when already on the Ergogen page.
   * Note: Initial hash loading is now deferred to the effect above for conflict resolution.
   */
  useEffect(() => {
    if (!configContext) {
      return;
    }

    const handleHashChange = () => {
      const hashResult = getConfigFromHash();
      if (!hashResult) {
        return;
      }

      if (hashResult.success) {
        const sharedConfig = hashResult.config;
        // Process injections with conflict resolution
        if (
          sharedConfig.injections !== undefined &&
          sharedConfig.injections.length > 0
        ) {
          // Defer setting config until resolution is complete
          processInjectionsWithConflictResolution(
            sharedConfig.injections,
            sharedConfig.config
          ).catch((error) => {
            console.error('[App] Error processing injections:', error);
            configContext.setError(
              `Failed to process injections: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          });
        } else {
          // No injections, safe to update config immediately
          configContext.setConfigInput(sharedConfig.config);
          // Store config in localStorage
          localStorage.setItem(
            CONFIG_LOCAL_STORAGE_KEY,
            JSON.stringify(sharedConfig.config)
          );

          // No injections to process, just generate
          configContext.generateNow(
            sharedConfig.config,
            configContext.injectionInput,
            {
              pointsonly: false,
            }
          );
        }

        // Clear the hash fragment after loading
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        );
      } else {
        // Show error message
        console.error(
          '[App] Failed to load shared configuration from hash (hashchange)',
          {
            error: hashResult.error,
            message: hashResult.message,
            hashLength: window.location.hash.length,
          }
        );
        configContext.setError(hashResult.message);
        // Clear the hash fragment to prevent retrying
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        );
      }
    };

    // Listen for hash changes (e.g., when user navigates to a shared URL)
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [configContext, processInjectionsWithConflictResolution]);

  return (
    <>
      {currentConflict && (
        <ConflictResolutionDialog
          injectionName={currentConflict.name}
          injectionType={currentConflict.type}
          onResolve={handleConflictResolution}
          onCancel={handleConflictCancel}
          data-testid="conflict-resolution-dialog"
        />
      )}
      <Header />
      <LoadingBar
        visible={configContext?.isGenerating ?? false}
        data-testid="loading-bar"
      />
      <Banners />
      <SideNavigation
        isOpen={configContext?.showSideNav ?? false}
        onClose={() => configContext?.setShowSideNav(false)}
        data-testid="side-navigation"
      />
      <PageWrapper>
        <Routes>
          <Route
            path="/"
            // The routing decision is now based on the reactive `configInput` state.
            element={configInput ? <Ergogen /> : <Navigate to="/new" replace />}
          />
          <Route path="/new" element={<Welcome />} />
          <Route path="/kle-editor" element={<KleEditorPage />} />
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
