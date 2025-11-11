import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLocalStorage } from 'react-use';
import styled from 'styled-components';

import Ergogen from './Ergogen';
import Welcome from './pages/Welcome';
import Header from './atoms/Header';
import LoadingBar from './atoms/LoadingBar';
import Banners from './organisms/Banners';
import SideNavigation from './molecules/SideNavigation';
import ConfigContextProvider, {
  useConfigContext,
} from './context/ConfigContext';
import { CONFIG_LOCAL_STORAGE_KEY } from './context/constants';
import { getConfigFromHash } from './utils/share';
import {
  mergeInjectionArrays,
  checkForInjectionConflict,
  mergeInjectionArraysWithResolution,
  ConflictResolution,
} from './utils/injections';
import ConflictResolutionDialog from './molecules/ConflictResolutionDialog';

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
      // Handle injections: merge shared injections with existing ones
      // If undefined, keep existing injections (not present in shared config)
      if (sharedConfig.injections !== undefined) {
        // Get existing injections from localStorage
        const existingInjectionsJson =
          localStorage.getItem('ergogen:injection');
        const existingInjections: string[][] | undefined =
          existingInjectionsJson
            ? JSON.parse(existingInjectionsJson)
            : undefined;
        // Merge: shared injections overwrite existing ones with same type+name, but keep others
        initialInjectionInput = mergeInjectionArrays(
          sharedConfig.injections,
          existingInjections
        );
        // Store merged result in localStorage so useLocalStorage picks it up
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

  // Conflict resolution state for shared config hash fragment loading
  const [pendingInjections, setPendingInjections] = useState<
    string[][] | null
  >(null);
  const [pendingConfig, setPendingConfig] = useState<string | null>(null);
  const [currentConflict, setCurrentConflict] = useState<{
    type: string;
    name: string;
  } | null>(null);
  const [pendingInjectionsAtConflict, setPendingInjectionsAtConflict] =
    useState<string[][] | null>(null);

  /**
   * Processes injections with conflict resolution, showing dialog when conflicts are found.
   */
  const processInjectionsWithConflictResolution = useCallback(
    async (
      newInjections: string[][],
      config: string,
      resolution: ConflictResolution | null = null,
      currentInjections?: string[][]
    ): Promise<void> => {
      if (!configContext) return;

      const injectionsToUse = currentInjections || configContext.injectionInput || [];

      if (newInjections.length === 0) {
        // No injections to process, just load the config
        configContext.setInjectionInput(injectionsToUse);
        configContext.setConfigInput(config);
        await configContext.generateNow(config, injectionsToUse, {
          pointsonly: false,
        });
        return;
      }

      const currentInjection = newInjections[0];
      const remainingInjections = newInjections.slice(1);

      // Validate injection format
      if (
        !Array.isArray(currentInjection) ||
        currentInjection.length !== 3 ||
        typeof currentInjection[0] !== 'string' ||
        typeof currentInjection[1] !== 'string' ||
        typeof currentInjection[2] !== 'string'
      ) {
        console.warn('[App] Skipping invalid injection format:', currentInjection);
        // Continue with remaining injections
        if (remainingInjections.length > 0) {
          await processInjectionsWithConflictResolution(
            remainingInjections,
            config,
            resolution,
            injectionsToUse
          );
        } else {
          configContext.setInjectionInput(injectionsToUse);
          configContext.setConfigInput(config);
          await configContext.generateNow(config, injectionsToUse, {
            pointsonly: false,
          });
        }
        return;
      }

      const [type, name] = currentInjection;

      // Check for conflict using the current injections state
      const conflictCheck = checkForInjectionConflict(
        type,
        name,
        injectionsToUse
      );

      if (conflictCheck.hasConflict && !resolution) {
        // Show dialog and pause processing
        setCurrentConflict({ type, name });
        setPendingInjections(newInjections);
        setPendingConfig(config);
        setPendingInjectionsAtConflict(injectionsToUse);
        return;
      }

      // Determine resolution to use
      const resolutionToUse = resolution || 'skip';

      // Merge this injection with the current injections state
      const mergedInjections = mergeInjectionArraysWithResolution(
        [currentInjection],
        injectionsToUse,
        resolutionToUse
      );

      // Process remaining injections with the updated injections
      if (remainingInjections.length > 0) {
        await processInjectionsWithConflictResolution(
          remainingInjections,
          config,
          resolution,
          mergedInjections
        );
      } else {
        // All injections processed, update context and load the config
        configContext.setInjectionInput(mergedInjections);
        configContext.setConfigInput(config);
        await configContext.generateNow(config, mergedInjections, {
          pointsonly: false,
        });
      }
    },
    [configContext]
  );

  /**
   * Handles conflict resolution from the dialog.
   */
  const handleConflictResolution = useCallback(
    async (
      action: ConflictResolution,
      applyToAllConflicts: boolean
    ): Promise<void> => {
      if (!configContext || !pendingInjections || !pendingConfig) return;

      setCurrentConflict(null);

      // Process the current injection with the chosen action
      const currentInjection = pendingInjections[0];
      const remainingInjections = pendingInjections.slice(1);

      // Merge with current injections state
      const mergedInjections = mergeInjectionArraysWithResolution(
        [currentInjection],
        pendingInjectionsAtConflict || configContext.injectionInput || [],
        action
      );

      // Resume processing remaining injections with the updated injections
      if (remainingInjections.length > 0) {
        await processInjectionsWithConflictResolution(
          remainingInjections,
          pendingConfig,
          applyToAllConflicts ? action : null,
          mergedInjections
        );
      } else {
        // All injections processed, update context and load the config
        configContext.setInjectionInput(mergedInjections);
        configContext.setConfigInput(pendingConfig);
        await configContext.generateNow(pendingConfig, mergedInjections, {
          pointsonly: false,
        });

        // Store merged result in localStorage to persist
        localStorage.setItem(
          'ergogen:injection',
          JSON.stringify(mergedInjections)
        );
        // Store config in localStorage
        localStorage.setItem(
          CONFIG_LOCAL_STORAGE_KEY,
          JSON.stringify(pendingConfig)
        );

        // Clean up state only after all injections are processed
        setPendingInjections(null);
        setPendingConfig(null);
        setPendingInjectionsAtConflict(null);
      }
    },
    [
      configContext,
      pendingInjections,
      pendingConfig,
      pendingInjectionsAtConflict,
      processInjectionsWithConflictResolution,
    ]
  );

  /**
   * Handles cancellation of conflict resolution.
   */
  const handleConflictCancel = useCallback(() => {
    if (!configContext) return;
    setCurrentConflict(null);
    setPendingInjections(null);
    setPendingConfig(null);
    setPendingInjectionsAtConflict(null);
    configContext.setError('Loading cancelled by user');
  }, [configContext]);

  /**
   * Effect to handle hash fragment changes when navigating to shared configurations.
   * This allows loading shared configs even when already on the Ergogen page.
   * Note: Initial hash loading is handled synchronously in App.tsx before render,
   * so this only handles subsequent hash changes (e.g., navigating to a shared URL).
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
        // Update config
        configContext.setConfigInput(sharedConfig.config);
        // Store config in localStorage
        localStorage.setItem(
          CONFIG_LOCAL_STORAGE_KEY,
          JSON.stringify(sharedConfig.config)
        );

        // Process injections with conflict resolution
        if (sharedConfig.injections !== undefined) {
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
          // No injections to process, just generate
          configContext.generateNow(sharedConfig.config, configContext.injectionInput, {
            pointsonly: false,
          });
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
          onResolve={handleConflictResolution}
          onCancel={handleConflictCancel}
          data-testid="conflict-dialog"
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
