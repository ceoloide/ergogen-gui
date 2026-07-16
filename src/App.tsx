import { useEffect, useState, useRef, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Ergogen from './Ergogen';
import Welcome from './pages/Welcome';
import CanvasEditor from './pages/CanvasEditor';
import Header from './atoms/Header';
import LoadingBar from './atoms/LoadingBar';
import Banners from './organisms/Banners';
import SideNavigation from './molecules/SideNavigation';
import {
  ConfigContextProvider,
  useConfigContext,
} from './context/ConfigContext';
import { getConfigFromHash } from './utils/share';
import ConflictResolutionDialog from './molecules/ConflictResolutionDialog';
import { useInjectionConflictResolution } from './hooks/useInjectionConflictResolution';
import BulkDownloadDialog from './molecules/BulkDownloadDialog';
import { trackEvent } from './utils/analytics';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import guiPkg from '../package.json';
import ergogenPkg from 'ergogen/package.json';
import {
  parseVersion,
  compareVersions,
  getSemverFromErgogenVersion,
  isCustomErgogenVersion,
  getFullErgogenVersion,
  getErgogenVersionInfo,
} from './utils/version';
import ShareVersionCompatibilityDialog, {
  VersionCompatibilityReport,
} from './molecules/ShareVersionCompatibilityDialog';

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

  const initialInjectionInput: string[][] = [];
  let hashError: string | null = null;

  // Store shared config data for deferred processing with conflict resolution
  // Use a ref to capture synchronously, then state to trigger re-renders
  const pendingSharedConfigRef = useRef<{
    config: string;
    injections?: string[][];
    guiVersion?: string;
    ergogenVersion?: string;
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
          guiVersion: sharedConfig.guiVersion,
          ergogenVersion: sharedConfig.ergogenVersion,
        };
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

  // Convert ref to state so it can be passed as a prop and trigger re-renders
  const [pendingSharedConfig, setPendingSharedConfig] = useState<{
    config: string;
    injections?: string[][];
    guiVersion?: string;
    ergogenVersion?: string;
  } | null>(null);

  // Set state from ref on mount to ensure it's available for AppContent
  // This must run synchronously or the ref value will be lost
  useEffect(() => {
    if (pendingSharedConfigRef.current) {
      setPendingSharedConfig(pendingSharedConfigRef.current);
    }
  }, []); // Only run once on mount

  return (
    <ConfigContextProvider
      initialInjectionInput={initialInjectionInput}
      hashError={hashError}
    >
      <AppContent pendingSharedConfig={pendingSharedConfig} />
    </ConfigContextProvider>
  );
};

/**
 * Top-level service worker registration. Placed here so it runs once when the
 * App component first mounts. The `onUpdate` callback stores a reference to
 * the waiting registration so the Header chip can trigger activation.
 *
 * **Dev testing**: add `?force_update` to the URL to immediately show the
 * update chip without needing a deployed SW update (e.g. `/?force_update`).
 * Clicking the chip will simply reload the page.
 */
export function useServiceWorkerUpdate(): (() => void) | undefined {
  const [waitingRegistration, setWaitingRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  // Development helper: ?force_update in the URL immediately shows the chip.
  const isForceUpdate = new URLSearchParams(window.location.search).has(
    'force_update'
  );

  useEffect(() => {
    serviceWorkerRegistration.register({
      onUpdate: (registration) => {
        setWaitingRegistration(registration);
      },
    });
  }, []);

  if (isForceUpdate) {
    return () => {
      console.log(
        '[SW] Force-update triggered via ?force_update URL parameter.'
      );
      window.location.reload();
    };
  }

  if (!waitingRegistration) return undefined;

  return () => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if ('serviceWorker' in navigator) {
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          window.location.reload();
        }
      });
    }

    // Signal the waiting service worker to skip the waiting phase and activate.
    const worker = waitingRegistration.waiting;
    if (worker) {
      worker.postMessage({ type: 'SKIP_WAITING' });
      // Safety fallback: if controllerchange doesn't trigger a reload within 1 second, reload anyway.
      timeoutId = setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      // Fallback: reload immediately if there is no waiting worker
      window.location.reload();
    }
  };
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Custom hook to manage the PWA installation event.
 * Captures the 'beforeinstallprompt' event and exposes an install trigger.
 * Gated behind the `?force_install` URL query parameter.
 */
function usePwaInstallPrompt(): (() => void) | undefined {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  // Check if ?force_install is present in the URL query string
  const isForceInstall = new URLSearchParams(window.location.search).has(
    'force_install'
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      console.log('[PWA] beforeinstallprompt event fired and captured.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Show the chip ONLY if the ?force_install query parameter is provided
  if (!isForceInstall) return undefined;

  return () => {
    if (deferredPrompt) {
      // Show the install prompt
      void deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      void deferredPrompt.userChoice.then(
        (choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] User accepted the install prompt');
          } else {
            console.log('[PWA] User dismissed the install prompt');
          }
          // Clear the saved prompt since it can only be used once
          setDeferredPrompt(null);
        }
      );
    } else {
      console.log(
        '[PWA] Install prompt triggered (deferredPrompt is not available on this device/browser)'
      );
      alert(
        'PWA installation is not supported by this browser or is restricted on this device. If you are on iOS/iPadOS, please open this site in Safari and select "Add to Home Screen" from the Share menu.'
      );
    }
  };
}

/**
 * Inner component that has access to the config context.
 */
const AppContent = ({
  pendingSharedConfig,
}: {
  pendingSharedConfig?: {
    config: string;
    injections?: string[][];
    guiVersion?: string;
    ergogenVersion?: string;
  } | null;
}) => {
  const configContext = useConfigContext();
  // Get configInput from context to ensure we have the latest value
  const configInput = configContext?.configInput;
  const location = useLocation();
  const onUpdate = useServiceWorkerUpdate();
  const onInstall = usePwaInstallPrompt();

  // Store configs count in a ref to safely read it in useEffect without lint dependencies
  const configsCountRef = useRef(0);
  configsCountRef.current = configContext?.configs?.length || 0;

  useEffect(() => {
    trackEvent('page_view', {
      page_path: location.pathname + location.search,
      stored_configs_count: configsCountRef.current,
    });
  }, [location.pathname, location.search]);

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
    setConfigInput: (config) => configContext?.loadPreview(config),
    generateNow: async (config, injections, options) => {
      if (configContext) {
        await configContext.generateNow(config, injections, options);
      }
    },
    getCurrentInjections: () => configContext?.injectionInput || [],
    onComplete: async (config, injections) => {
      // Store merged result in localStorage to persist
      localStorage.setItem('ergogen:injection', JSON.stringify(injections));
      configContext?.loadPreview(config);
    },
    setError: (error) => configContext?.setError(error),
  });

  const [sharedConfigToConfirm, setSharedConfigToConfirm] = useState<{
    config: string;
    injections?: string[][];
    report: VersionCompatibilityReport;
  } | null>(null);

  const checkVersionCompatibility = (
    sharedGui?: string,
    sharedErgogen?: string
  ): VersionCompatibilityReport => {
    const currentGui = guiPkg.version;
    const currentErgogen = getFullErgogenVersion(
      process.env.REACT_APP_ERGOGEN_VERSION
    );

    let isCompatible = true;
    let guiWarning: VersionCompatibilityReport['guiWarning'];
    let ergogenWarning: VersionCompatibilityReport['ergogenWarning'];
    let customErgogenWarning: VersionCompatibilityReport['customErgogenWarning'];

    // 1. Check GUI version
    if (sharedGui) {
      const parsedCurrent = parseVersion(currentGui);
      const parsedShared = parseVersion(sharedGui);
      if (
        parsedCurrent &&
        parsedShared &&
        !compareVersions(parsedCurrent, parsedShared)
      ) {
        isCompatible = false;
        guiWarning = { current: currentGui, shared: sharedGui };
      }
    }

    // 2. Check Ergogen version
    if (sharedErgogen) {
      // Check if it's custom
      if (
        isCustomErgogenVersion(sharedErgogen) &&
        sharedErgogen !== currentErgogen
      ) {
        isCompatible = false;
        const versionInfo = getErgogenVersionInfo(sharedErgogen);
        customErgogenWarning = {
          shared: sharedErgogen,
          url: versionInfo.url,
          label: versionInfo.label,
        };
      }

      // Check if current is older
      const currentSemver =
        getSemverFromErgogenVersion(currentErgogen) || ergogenPkg.version;
      const sharedSemver = getSemverFromErgogenVersion(sharedErgogen);
      if (currentSemver && sharedSemver) {
        const parsedCurrent = parseVersion(currentSemver);
        const parsedShared = parseVersion(sharedSemver);
        if (
          parsedCurrent &&
          parsedShared &&
          !compareVersions(parsedCurrent, parsedShared)
        ) {
          isCompatible = false;
          ergogenWarning = { current: currentSemver, shared: sharedSemver };
        }
      }
    }

    return {
      isCompatible,
      guiWarning,
      ergogenWarning,
      customErgogenWarning,
    };
  };

  const loadSharedConfig = useCallback(
    (config: string, injections?: string[][]) => {
      if (!configContext) return;

      if (injections !== undefined && injections.length > 0) {
        processInjectionsWithConflictResolution(injections, config).catch(
          (error) => {
            console.error('[App] Error processing injections:', error);
            configContext.setError(
              `Failed to process injections: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        );
      } else {
        configContext.loadPreview(config);
        configContext.generateNow(config, configContext.injectionInput, {
          pointsonly: false,
        });
      }
    },
    [configContext, processInjectionsWithConflictResolution]
  );

  const handleAcceptShare = () => {
    if (sharedConfigToConfirm) {
      loadSharedConfig(
        sharedConfigToConfirm.config,
        sharedConfigToConfirm.injections
      );
      setSharedConfigToConfirm(null);
    }
  };

  const handleCancelShare = () => {
    setSharedConfigToConfirm(null);
  };

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

    // Perform version check!
    const report = checkVersionCompatibility(
      pendingSharedConfig.guiVersion,
      pendingSharedConfig.ergogenVersion
    );

    if (!report.isCompatible) {
      setSharedConfigToConfirm({
        config: pendingSharedConfig.config,
        injections: pendingSharedConfig.injections,
        report,
      });
    } else {
      loadSharedConfig(
        pendingSharedConfig.config,
        pendingSharedConfig.injections
      );
    }
  }, [configContext, pendingSharedConfig, loadSharedConfig]);

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

        // Perform version check!
        const report = checkVersionCompatibility(
          sharedConfig.guiVersion,
          sharedConfig.ergogenVersion
        );

        if (!report.isCompatible) {
          setSharedConfigToConfirm({
            config: sharedConfig.config,
            injections: sharedConfig.injections,
            report,
          });
        } else {
          loadSharedConfig(sharedConfig.config, sharedConfig.injections);
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
  }, [configContext, loadSharedConfig]);

  return (
    <>
      {sharedConfigToConfirm && (
        <ShareVersionCompatibilityDialog
          report={sharedConfigToConfirm.report}
          onAccept={handleAcceptShare}
          onCancel={handleCancelShare}
          data-testid="share-compatibility-dialog"
        />
      )}
      {currentConflict && (
        <ConflictResolutionDialog
          injectionName={currentConflict.name}
          injectionType={currentConflict.type}
          onResolve={handleConflictResolution}
          onCancel={handleConflictCancel}
          data-testid="conflict-resolution-dialog"
        />
      )}
      {configContext?.isBulkDownloadOpen && (
        <BulkDownloadDialog
          isOpen={configContext.isBulkDownloadOpen}
          configs={configContext.configs}
          injections={configContext.injectionInput}
          debug={configContext.debug}
          stlPreview={configContext.stlPreview}
          onClose={() => configContext.setIsBulkDownloadOpen(false)}
          data-testid="bulk-download-dialog"
        />
      )}
      <Header onUpdate={onUpdate} onInstall={onInstall} />
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
          <Route path="/canvas" element={<CanvasEditor />} />
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
