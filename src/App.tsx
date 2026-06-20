import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

import Ergogen from './Ergogen';
import Welcome from './pages/Welcome';
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
import { migrateLegacyConfig } from './utils/migration';

let cachedHashResult: ReturnType<typeof getConfigFromHash> | null = null;
let hashHasBeenRead = false;

const App = () => {
  if (!hashHasBeenRead) {
    cachedHashResult = getConfigFromHash();
    hashHasBeenRead = true;
  }
  const hashResult = cachedHashResult;

  const initialMultiConfig = useMemo(() => migrateLegacyConfig(), []);
  const [hashError] = useState<string | null>(
    hashResult?.success === false ? hashResult.message : null
  );

  const [pendingSharedConfig] = useState<{
    config: string;
    injections?: string[][];
  } | null>(
    hashResult?.success ? {
      config: hashResult.config.config,
      injections: hashResult.config.injections,
    } : null
  );

  useEffect(() => {
    if (hashResult) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [hashResult]);

  return (
    <ConfigContextProvider
      initialMultiConfig={initialMultiConfig}
      hashError={hashError}
    >
      <AppContent pendingSharedConfig={pendingSharedConfig} />
    </ConfigContextProvider>
  );
};

const AppContent = ({
  pendingSharedConfig,
}: {
  pendingSharedConfig: { config: string; injections?: string[][] } | null;
}) => {
  const configContext = useConfigContext();
  const configInput = configContext?.configInput;

  const hasProcessedInitialSharedConfig = useRef(false);

  const {
    currentConflict,
    processInjectionsWithConflictResolution,
    handleConflictResolution,
    handleConflictCancel,
  } = useInjectionConflictResolution({
    setInjectionInput: (injections) => configContext?.setInjectionInput(injections),
    setConfigInput: (config) => configContext?.setConfigInput(config),
    generateNow: async (config, injections, options) => {
      if (configContext) {
        await configContext.generateNow(config, injections, options);
      }
    },
    getCurrentInjections: () => configContext?.injectionInput || [],
    onComplete: async (_config, injections) => {
      localStorage.setItem('ergogen:injection', JSON.stringify(injections));
    },
    setError: (error) => configContext?.setError(error),
  });

  const handleSharedConfig = useCallback(async (sharedConfig: { config: string; injections?: string[][] }) => {
    if (!configContext) return;

    if (sharedConfig.config !== configContext.configInput) {
      configContext.setTempConfig(sharedConfig.config);
    }

    if (sharedConfig.injections && sharedConfig.injections.length > 0) {
      await processInjectionsWithConflictResolution(
        sharedConfig.injections,
        sharedConfig.config
      );
    } else {
      configContext.generateNow(sharedConfig.config, configContext.injectionInput, {
        pointsonly: false,
      });
    }
  }, [configContext, processInjectionsWithConflictResolution]);

  useEffect(() => {
    if (configContext && pendingSharedConfig && !hasProcessedInitialSharedConfig.current) {
      hasProcessedInitialSharedConfig.current = true;
      handleSharedConfig(pendingSharedConfig);
    }
  }, [configContext, pendingSharedConfig, handleSharedConfig]);

  useEffect(() => {
    if (!configContext) return;

    const handleHashChange = () => {
      const hashResult = getConfigFromHash();
      if (!hashResult) return;

      if (hashResult.success) {
        handleSharedConfig(hashResult.config);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } else {
        configContext.setError(hashResult.message);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [configContext, handleSharedConfig]);

  return (
    <>
      {currentConflict && (
        <ConflictResolutionDialog
          injectionName={currentConflict.name}
          injectionType={currentConflict.type}
          onResolve={handleConflictResolution}
          onCancel={handleConflictCancel}
        />
      )}
      <Header />
      <LoadingBar
        visible={configContext?.isGenerating ?? false}
      />
      <Banners />
      <SideNavigation
        isOpen={configContext?.showSideNav ?? false}
        onClose={() => configContext?.setShowSideNav(false)}
      />
      <PageWrapper>
        <Routes>
          <Route
            path="/"
            element={configContext && (configContext.activeConfigId || configContext.configInput || configContext.configs.length > 0) ? <Ergogen /> : <Navigate to="/new" replace />}
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
