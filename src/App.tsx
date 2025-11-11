import React, { useEffect, useState, useCallback, useRef } from 'react';
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
    console.log('[App] Reading hash fragment (first time)', {
      hash: window.location.hash,
      hashLength: window.location.hash.length,
      fullUrl: window.location.href,
    });
    cachedHashResult = getConfigFromHash();
    hashHasBeenRead = true;
    console.log('[App] Hash result:', {
      hasResult: !!cachedHashResult,
      success: cachedHashResult?.success,
      hasConfig: !!cachedHashResult?.config,
      hasInjections: cachedHashResult?.config?.injections !== undefined,
      injectionCount: cachedHashResult?.config?.injections?.length || 0,
      error: cachedHashResult?.error,
      message: cachedHashResult?.message,
    });
  } else {
    console.log('[App] Using cached hash result from module variable (subsequent render/remount)');
  }
  const hashResult = cachedHashResult;

  let initialConfig = '';
  let initialInjectionInput: string[][] = [];
  let hashError: string | null = null;

  // Store shared config data for deferred processing with conflict resolution
  // Use a ref to capture synchronously, then state to trigger re-renders
  const pendingSharedConfigRef = React.useRef<{
    config: string;
    injections?: string[][];
  } | null>(null);

  if (hashResult) {
    if (hashResult.success) {
      // Use shared config from hash fragment - this takes priority over localStorage
      const sharedConfig = hashResult.config;
      initialConfig = sharedConfig.config;
      // Store the shared config data to process with conflict resolution after React renders
      // Store in ref synchronously, but only set once (persist across re-renders)
      if (pendingSharedConfigRef.current === null) {
        pendingSharedConfigRef.current = {
          config: sharedConfig.config,
          injections: sharedConfig.injections,
        };
        console.log('[App] Set pendingSharedConfigRef.current synchronously', {
          hasInjections: pendingSharedConfigRef.current.injections !== undefined,
          injectionCount: pendingSharedConfigRef.current.injections?.length || 0,
          refValue: pendingSharedConfigRef.current,
        });
      } else {
        console.log('[App] pendingSharedConfigRef already set, skipping');
      }
      // Temporarily store config in localStorage so useLocalStorage picks it up
      // Injections will be processed with conflict resolution after React renders
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

  // Convert ref to state so it can be passed as a prop and trigger re-renders
  const [pendingSharedConfig, setPendingSharedConfig] = React.useState<{
    config: string;
    injections?: string[][];
  } | null>(null);

  // Set state from ref on mount to ensure it's available for AppContent
  // This must run synchronously or the ref value will be lost
  React.useEffect(() => {
    console.log('[App] useEffect to set pendingSharedConfig state', {
      refValue: pendingSharedConfigRef.current,
      hasRef: !!pendingSharedConfigRef.current,
    });
    if (pendingSharedConfigRef.current) {
      console.log('[App] Setting pendingSharedConfig state from ref', {
        hasInjections: pendingSharedConfigRef.current.injections !== undefined,
        injectionCount: pendingSharedConfigRef.current.injections?.length || 0,
      });
      setPendingSharedConfig(pendingSharedConfigRef.current);
    } else {
      console.log('[App] Ref is null, nothing to set');
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
    console.log('[App] Updated pendingSharedConfigRef', {
      hasConfig: !!pendingSharedConfig,
      hasInjections: pendingSharedConfig?.injections !== undefined,
      injectionCount: pendingSharedConfig?.injections?.length || 0,
    });
  }

  // Debug: Log on every render to see what's happening
  useEffect(() => {
    console.log('[App] AppContent render', {
      hasConfigContext: !!configContext,
      hasPendingSharedConfig: !!pendingSharedConfig,
      hasPendingSharedConfigRef: !!pendingSharedConfigRef.current,
      hasProcessed: hasProcessedInitialSharedConfig.current,
      pendingSharedConfigValue: pendingSharedConfig ? JSON.stringify(pendingSharedConfig).substring(0, 100) : 'null',
    });
  });

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
   * Effect to process pending shared config from initial hash fragment load.
   * This processes the config with conflict resolution after React has rendered.
   * Uses the prop directly so it re-runs when pendingSharedConfig is set.
   */
  useEffect(() => {
    console.log('[App] Effect to process pending shared config', {
      hasConfigContext: !!configContext,
      hasPendingSharedConfig: !!pendingSharedConfig,
      hasPendingSharedConfigRef: !!pendingSharedConfigRef.current,
      hasProcessed: hasProcessedInitialSharedConfig.current,
    });

    // Wait for configContext to be available
    if (!configContext) {
      console.log('[App] Effect: configContext not available yet');
      return;
    }

    // Use the prop directly - it will be set by the parent App component's useEffect
    if (!pendingSharedConfig) {
      console.log('[App] Effect: No pending shared config to process');
      return;
    }
    
    if (hasProcessedInitialSharedConfig.current) {
      console.log('[App] Effect: Already processed, skipping');
      return;
    }

    // Mark as processed to prevent re-processing on re-renders
    hasProcessedInitialSharedConfig.current = true;

    console.log('[App] Processing pending shared config with conflict resolution', {
      hasInjections: pendingSharedConfig.injections !== undefined,
      injectionCount: pendingSharedConfig.injections?.length || 0,
    });

    // Process the pending shared config with conflict resolution
    // Update config (already set in localStorage, but ensure context is updated)
    configContext.setConfigInput(pendingSharedConfig.config);

    // Process injections with conflict resolution
    if (pendingSharedConfig.injections !== undefined && pendingSharedConfig.injections.length > 0) {
      console.log('[App] Starting conflict resolution for', pendingSharedConfig.injections.length, 'injections');
      processInjectionsWithConflictResolution(
        pendingSharedConfig.injections,
        pendingSharedConfig.config
      ).catch((error) => {
        console.error('[App] Error processing injections from initial hash:', error);
        configContext.setError(
          `Failed to process injections: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      });
    } else {
      console.log('[App] No injections to process, generating config');
      // No injections to process, just generate
      configContext.generateNow(pendingSharedConfig.config, configContext.injectionInput, {
        pointsonly: false,
      });
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
          injectionType={currentConflict.type}
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
