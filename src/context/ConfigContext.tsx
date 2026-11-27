import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import yaml from 'js-yaml';
import debounce from 'lodash.debounce';
import { useLocalStorage } from 'react-use';
import {
  createErgogenWorker,
  createJscadWorker,
} from '../workers/workerFactory';
import {
  trackEvent,
  initAnalytics,
  getSendUsageMetricsEnabled,
  setSendUsageMetricsEnabled,
  trackError,
} from '../utils/analytics';
import {
  analyzeConfiguration,
  KeyboardAnalyticsPayload,
} from '../utils/configAnalyzer';
import { useInjectionConflictResolution } from '../hooks/useInjectionConflictResolution';
import { useConfigLoader } from '../hooks/useConfigLoader';
import type { WorkerResponse as ErgogenWorkerResponse } from '../workers/ergogen.worker.types';
import {
  beginGeneration,
  buildRequestKey,
  classifyErgogenResponse,
  createGenerationSession,
  failActiveGeneration,
  invalidateSession,
  isActiveJscadVersion,
  shouldSkipRequest,
} from '../utils/generationSession';
import type {
  JscadWorkerRequest,
  JscadWorkerResponse,
} from '../workers/jscad.worker.types';

import {
  CONFIG_LOCAL_STORAGE_KEY,
  MULTI_CONFIG_STORAGE_KEY,
  LEGACY_STORAGE_CONFIG_KEY,
  ANALYTICS_DEBOUNCE_DELAY,
} from './constants';
import {
  filterInjectionsByFeatureFlags,
  getSkippedInjectionsWarning,
  checkForDeprecationWarnings,
  preparePreviewConfig,
} from '../utils/generationHelpers';
import type { ConflictResolutionStrategy } from '../utils/injections';
import {
  migrateConfigStorage,
  type MultiConfigContainer,
  type SavedConfig,
  type StoredConfigs,
} from '../utils/configStorage';

import { Results } from '../types/results';

type GenerationEventName = 'generation_completed' | 'generation_failed';

type GenerationEventPayload = Record<
  string,
  string | number | boolean | undefined
>;

interface AppSettings {
  debug: boolean;
  autoGen: boolean;
  autoGen3D: boolean;
  kicanvasPreview: boolean;
  stlPreview: boolean;
  sendUsageMetrics: boolean;
}

const getLegacySetting = (key: string, defaultValue: boolean): boolean => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const getDefaultSettings = (): AppSettings => ({
  debug: getLegacySetting('ergogen:config:debug', false),
  autoGen: getLegacySetting('ergogen:config:autoGen', true),
  autoGen3D: getLegacySetting('ergogen:config:autoGen3D', true),
  kicanvasPreview: getLegacySetting('ergogen:config:kicanvasPreview', true),
  stlPreview: getLegacySetting('ergogen:config:stlPreview', true),
  sendUsageMetrics: getSendUsageMetricsEnabled(),
});

declare global {
  interface Window {
    ergogen: {
      process: (
        config: unknown,
        debug: boolean,
        logger: (m: string) => void
      ) => unknown;
      inject: (type: string, name: string, value: unknown) => void;
    };
  }
}

/**
 * Props for the ConfigContextProvider component.
 */
type Props = {
  initialInjectionInput?: string[][];
  hashError?: string | null;
  children: React.ReactNode[] | React.ReactNode;
};

/**
 * Defines the shape of the data and functions provided by the ConfigContext.
 */
type ContextProps = {
  configInput: string | undefined;
  getRealtimeConfigInput: () => string | undefined;
  updateRealtimeConfigInput: (val: string | undefined) => void;
  setConfigInput: Dispatch<SetStateAction<string | undefined>>;
  configs: SavedConfig[];
  activeConfigId: string | null;
  activeConfigName: string;
  isPreview: boolean;
  selectConfig: (id: string | null) => void;
  createNewConfig: (content: string, name?: string) => string;
  renameConfig: (id: string, newName: string) => boolean;
  duplicateConfig: (id: string) => void;
  deleteConfig: (id: string) => void;
  loadPreview: (config: string) => void;
  savePreviewConfig: () => void;
  pruneDeletedConfigs: () => void;
  injectionInput: string[][] | undefined;
  setInjectionInput: Dispatch<SetStateAction<string[][] | undefined>>;
  processInput: ReturnType<
    typeof debounce<
      (
        textInput: string | undefined,
        injectionInput: string[][] | undefined,
        options?: ProcessOptions
      ) => Promise<void>
    >
  >;
  generateNow: (
    textInput: string | undefined,
    injectionInput: string[][] | undefined,
    options?: ProcessOptions
  ) => Promise<void>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  clearError: () => void;
  deprecationWarning: string | null;
  clearWarning: () => void;
  skippedWarning: string | null;
  clearSkippedWarning: () => void;
  info: string | null;
  setInfo: Dispatch<SetStateAction<string | null>>;
  clearInfo: () => void;
  results: Results | null;
  resultsVersion: number;
  setResultsVersion: Dispatch<SetStateAction<number>>;
  showSettings: boolean;
  setShowSettings: Dispatch<SetStateAction<boolean>>;
  isBulkDownloadOpen: boolean;
  setIsBulkDownloadOpen: Dispatch<SetStateAction<boolean>>;
  showSideNav: boolean;
  setShowSideNav: Dispatch<SetStateAction<boolean>>;
  showConfig: boolean;
  setShowConfig: Dispatch<SetStateAction<boolean>>;
  showDownloads: boolean;
  setShowDownloads: Dispatch<SetStateAction<boolean>>;
  debug: boolean;
  setDebug: Dispatch<SetStateAction<boolean>>;
  autoGen: boolean;
  setAutoGen: Dispatch<SetStateAction<boolean>>;
  autoGen3D: boolean;
  setAutoGen3D: Dispatch<SetStateAction<boolean>>;
  kicanvasPreview: boolean;
  setKicanvasPreview: Dispatch<SetStateAction<boolean>>;
  stlPreview: boolean;
  setStlPreview: Dispatch<SetStateAction<boolean>>;
  sendUsageMetrics: boolean;
  setSendUsageMetrics: Dispatch<SetStateAction<boolean>>;
  isGenerating: boolean;
  setIsGenerating: Dispatch<SetStateAction<boolean>>;
  isJscadConverting: boolean;
  /** An injection from a repository named in the URL that has the name of a saved one. */
  currentConflict: { name: string; type: string } | null;
  handleConflictResolution: (
    action: ConflictResolutionStrategy,
    applyToAllConflicts: boolean
  ) => Promise<void>;
  handleConflictCancel: () => void;
};

/**
 * Options for the `processInput` function.
 */
type ProcessOptions = {
  pointsonly: boolean;
  isManual?: boolean;
  /** Skips the request if it repeats the one behind the current results. */
  skipIfCurrent?: boolean;
};

/**
 * The main React context for managing Ergogen configuration and results.
 */
const ConfigContext = createContext<ContextProps | null>(null);

const generateUUID = () => {
  if (
    typeof window !== 'undefined' &&
    window.crypto &&
    window.crypto.randomUUID
  ) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getNextIndexForPattern = (
  configsList: SavedConfig[],
  pattern: RegExp
) => {
  let maxVal = 0;
  for (const c of configsList) {
    const match = c.name.match(pattern);
    if (match) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val) && val > maxVal) {
        maxVal = val;
      }
    }
  }
  return maxVal + 1;
};

interface DeletedConfig extends SavedConfig {
  deletedAt: string;
}

const STORAGE_KEY_DELETED = 'ergogen:deleted-config';

const saveToDeletedStorage = (config: SavedConfig) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED);
    const data: { version: number; configs: DeletedConfig[] } = {
      version: 1,
      configs: [],
    };
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.configs)) {
        data.configs = parsed.configs;
        if (parsed.version !== undefined) {
          data.version = parsed.version;
        }
      }
    }
    const deletedRecord: DeletedConfig = {
      ...config,
      deletedAt: new Date().toISOString(),
    };
    data.configs.push(deletedRecord);
    localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save deleted config to storage:', err);
  }
};

const pruneDeletedConfigs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.configs)) return;

    let configs: DeletedConfig[] = parsed.configs;
    const now = Date.now();
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

    // 1. Remove if older than 90 days (by deletedAt date)
    configs = configs.filter((c) => {
      const deletedTime = new Date(c.deletedAt).getTime();
      return now - deletedTime <= ninetyDaysMs;
    });

    // 2. If more than 100 configs, delete the oldest ones (by last modified date / updatedAt) until 100 remain
    if (configs.length > 100) {
      // Sort by updatedAt ascending (oldest first)
      configs.sort((a, b) => {
        const timeA = new Date(a.updatedAt).getTime();
        const timeB = new Date(b.updatedAt).getTime();
        return timeA - timeB;
      });
      // slice the last 100 (which are the newest)
      configs = configs.slice(configs.length - 100);
    }

    const data = {
      version: parsed.version || 1,
      configs,
    };
    localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to prune deleted configs:', err);
  }
};

const formatPreviewSvg = (svgContent: unknown): string | undefined => {
  if (!svgContent) return undefined;

  let content: string = '';
  if (typeof svgContent === 'string') {
    content = svgContent;
  } else if (Array.isArray(svgContent)) {
    content = svgContent.join('');
  } else {
    return undefined;
  }

  content = content
    .replace(/width="[^"]+"/, 'width="284px"')
    .replace(/height="[^"]+"/, 'height="134px"');
  content = content.replace(
    /<svg/,
    '<svg style="background-color: rgb(51,51,51);"'
  );
  content = content.replaceAll(/stroke="#000"/g, 'stroke="#AAA"');
  content = content.replaceAll(/stroke:#000/g, 'stroke:#AAA');
  return content;
};

const saveMultiConfigToStorage = (
  configs: SavedConfig[],
  activeConfigId: string | null,
  version: number = 2
) => {
  if (typeof window === 'undefined') return;
  const container: MultiConfigContainer = {
    version,
    activeConfigId,
    configs,
  };
  localStorage.setItem(MULTI_CONFIG_STORAGE_KEY, JSON.stringify(container));
};

const migrateLegacyConfig = (): MultiConfigContainer => {
  if (typeof window === 'undefined') {
    return { version: 2, activeConfigId: null, configs: [] };
  }
  const stored: StoredConfigs = {
    multiConfig: localStorage.getItem(MULTI_CONFIG_STORAGE_KEY),
    legacyConfig: localStorage.getItem(LEGACY_STORAGE_CONFIG_KEY),
    singleConfig: localStorage.getItem(CONFIG_LOCAL_STORAGE_KEY),
  };
  const migration = migrateConfigStorage(
    stored,
    new Date().toISOString(),
    generateUUID()
  );
  if (migration.readError) {
    console.error('Failed to parse multi-config storage:', migration.readError);
  }
  const keys = [
    [MULTI_CONFIG_STORAGE_KEY, 'multiConfig'],
    [LEGACY_STORAGE_CONFIG_KEY, 'legacyConfig'],
    [CONFIG_LOCAL_STORAGE_KEY, 'singleConfig'],
  ] as const;
  for (const [key, field] of keys) {
    const text = migration.stored[field];
    if (text === stored[field]) continue;
    if (text === null) localStorage.removeItem(key);
    else localStorage.setItem(key, text);
  }
  return migration.container;
};

/**
 * The provider component for the ConfigContext.
 * It manages all state related to configuration, injections, settings, and results.
 * It also handles fetching initial config from URL parameters and persisting settings to local storage.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} The context provider wrapping the children.
 */
const ConfigContextProvider = ({
  initialInjectionInput,
  hashError,
  children,
}: Props) => {
  const [hadLegacyConfig] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const legacy1 = localStorage.getItem(LEGACY_STORAGE_CONFIG_KEY);
    const legacy2 = localStorage.getItem(CONFIG_LOCAL_STORAGE_KEY);
    return !!(legacy1 || legacy2);
  });

  const [loadedVersion] = useState<number>(() => {
    if (typeof window === 'undefined') return 2;
    const stored = localStorage.getItem(MULTI_CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.version === 'number') {
          return parsed.version;
        }
      } catch (err) {
        console.warn('Failed to parse loaded version:', err);
      }
    }
    return 1;
  });

  const [multiConfig] = useState<MultiConfigContainer>(() => {
    return migrateLegacyConfig();
  });

  const [configs, setConfigs] = useState<SavedConfig[]>(
    () => multiConfig.configs
  );
  const [activeConfigId, setActiveConfigId] = useState<string | null>(
    () => multiConfig.activeConfigId
  );
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [previewConfig, setPreviewConfig] = useState<string | null>(null);

  const [configInputState, setConfigInputState] = useState<string | undefined>(
    () => {
      if (multiConfig.activeConfigId) {
        const active = multiConfig.configs.find(
          (c) => c.id === multiConfig.activeConfigId
        );
        return active ? active.config : '';
      }
      return '';
    }
  );

  const configsRef = useRef<SavedConfig[]>(configs);
  const activeConfigIdRef = useRef<string | null>(activeConfigId);
  const isPreviewRef = useRef<boolean>(isPreview);
  const previewConfigRef = useRef<string | null>(previewConfig);
  const configInputRef = useRef<string | undefined>(configInputState);

  useEffect(() => {
    configsRef.current = configs;
  }, [configs]);
  useEffect(() => {
    activeConfigIdRef.current = activeConfigId;
  }, [activeConfigId]);
  useEffect(() => {
    isPreviewRef.current = isPreview;
  }, [isPreview]);
  useEffect(() => {
    previewConfigRef.current = previewConfig;
  }, [previewConfig]);
  useEffect(() => {
    configInputRef.current = configInputState;
  }, [configInputState]);

  const realtimeConfigInputRef = useRef<string | undefined>(configInputState);

  useEffect(() => {
    realtimeConfigInputRef.current = configInputState;
  }, [configInputState]);

  const updateRealtimeConfigInput = useCallback((val: string | undefined) => {
    realtimeConfigInputRef.current = val;
  }, []);

  const getRealtimeConfigInput = useCallback(() => {
    return realtimeConfigInputRef.current;
  }, []);

  const lastTrackedConfigIdRef = useRef<string | undefined>(undefined);
  const pendingAnalyticsRef = useRef<{
    timeoutId: NodeJS.Timeout;
    payload: KeyboardAnalyticsPayload;
    configId: string;
  } | null>(null);

  /**
   * The latest generation outcome waiting out the debounce. A newer outcome
   * replaces it, so a transient syntax error is dropped once compilation
   * succeeds again. Keyboard lineage below uses its own, separate debounce.
   */
  const pendingGenerationEventRef = useRef<{
    name: GenerationEventName;
    payload: GenerationEventPayload;
    timeoutId: NodeJS.Timeout;
  } | null>(null);

  const cancelPendingGenerationEvent = useCallback(() => {
    if (pendingGenerationEventRef.current) {
      clearTimeout(pendingGenerationEventRef.current.timeoutId);
      pendingGenerationEventRef.current = null;
    }
  }, []);

  /**
   * Sends a pending generation outcome right away. A compilation that already
   * happened is always reported, even when the user moves on within the
   * debounce window.
   */
  const flushPendingGenerationEvent = useCallback(() => {
    const pendingGeneration = pendingGenerationEventRef.current;
    if (pendingGeneration) {
      cancelPendingGenerationEvent();
      trackEvent(pendingGeneration.name, pendingGeneration.payload);
    }
  }, [cancelPendingGenerationEvent]);

  const flushPendingAnalytics = useCallback(() => {
    flushPendingGenerationEvent();
    if (pendingAnalyticsRef.current) {
      const { timeoutId, payload, configId } = pendingAnalyticsRef.current;
      clearTimeout(timeoutId);
      trackEvent('keyboard_generated', payload);
      lastTrackedConfigIdRef.current = configId;
      pendingAnalyticsRef.current = null;
    }
  }, [flushPendingGenerationEvent]);

  /**
   * Starts a new lineage when the user switches, creates, duplicates or
   * deletes a config, or opens a preview. A pending keyboard_generated event
   * belongs to the old lineage and is dropped. A pending generation outcome
   * describes a compilation that already ran, so it is sent instead.
   */
  const resetLineage = useCallback(() => {
    lastTrackedConfigIdRef.current = undefined;
    flushPendingGenerationEvent();
    if (pendingAnalyticsRef.current) {
      clearTimeout(pendingAnalyticsRef.current.timeoutId);
      pendingAnalyticsRef.current = null;
    }
  }, [flushPendingGenerationEvent]);

  const [injectionInput, setInjectionInput] = useLocalStorage<string[][]>(
    'ergogen:injection',
    initialInjectionInput
  );
  const [error, setError] = useState<string | null>(null);
  const [deprecationWarning, setDeprecationWarning] = useState<string | null>(
    null
  );
  const [skippedWarning, setSkippedWarning] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [resultsVersion, setResultsVersion] = useState<number>(0);
  const generationSessionRef = useRef(createGenerationSession());
  const clearResults = useCallback(() => {
    invalidateSession(generationSessionRef.current);
    setResults(null);
    setIsGenerating(false);
    setIsJscadConverting(false);
  }, []);
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    'ergogen:settings',
    getDefaultSettings()
  );

  const debug = settings?.debug ?? false;
  const autoGen = settings?.autoGen ?? true;
  const autoGen3D = settings?.autoGen3D ?? true;
  const kicanvasPreview = settings?.kicanvasPreview ?? true;
  const stlPreview = settings?.stlPreview ?? true;
  const stlPreviewRef = useRef<boolean>(stlPreview);
  stlPreviewRef.current = stlPreview;

  // Consent is resolved by the analytics module (explicit toggle, older
  // opt-outs, then the web/PWA default). Analytics itself is bootstrapped in
  // src/index.tsx before React renders; the effect below applies changes.
  const [sendUsageMetrics, setSendUsageMetricsState] = useState<boolean>(
    getSendUsageMetricsEnabled
  );

  const settingsRef = useRef<AppSettings | undefined>(settings);
  settingsRef.current = settings;

  const autoGenRef = useRef<boolean>(autoGen);
  autoGenRef.current = autoGen;

  const sendUsageMetricsRef = useRef<boolean>(sendUsageMetrics);
  sendUsageMetricsRef.current = sendUsageMetrics;

  const updateSettings = useCallback(
    (updater: (current: AppSettings) => AppSettings) => {
      const current = settingsRef.current || getDefaultSettings();
      const next = updater(current);
      settingsRef.current = next;
      setSettings(next);
    },
    [setSettings]
  );

  const setDebug = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      updateSettings((current) => {
        const val =
          typeof valueOrFunc === 'function'
            ? valueOrFunc(current.debug)
            : valueOrFunc;
        return { ...current, debug: val };
      });
    },
    [updateSettings]
  );

  const setAutoGen = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      updateSettings((current) => {
        const val =
          typeof valueOrFunc === 'function'
            ? valueOrFunc(current.autoGen)
            : valueOrFunc;
        return { ...current, autoGen: val };
      });
    },
    [updateSettings]
  );

  const setAutoGen3D = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      updateSettings((current) => {
        const val =
          typeof valueOrFunc === 'function'
            ? valueOrFunc(current.autoGen3D)
            : valueOrFunc;
        return { ...current, autoGen3D: val };
      });
    },
    [updateSettings]
  );

  const setKicanvasPreview = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      updateSettings((current) => {
        const val =
          typeof valueOrFunc === 'function'
            ? valueOrFunc(current.kicanvasPreview)
            : valueOrFunc;
        return { ...current, kicanvasPreview: val };
      });
    },
    [updateSettings]
  );

  const setStlPreview = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      updateSettings((current) => {
        const val =
          typeof valueOrFunc === 'function'
            ? valueOrFunc(current.stlPreview)
            : valueOrFunc;
        return { ...current, stlPreview: val };
      });
    },
    [updateSettings]
  );

  /**
   * Reports a generation outcome. Explicit (manual) generations and runs with
   * auto-generate off are sent immediately. Auto-generation outcomes wait for
   * edits to settle, and each new outcome replaces the pending one.
   */
  const queueGenerationEvent = useCallback(
    (
      name: GenerationEventName,
      payload: GenerationEventPayload,
      immediate: boolean
    ) => {
      cancelPendingGenerationEvent();
      if (immediate || !autoGenRef.current) {
        trackEvent(name, payload);
        return;
      }
      const timeoutId = setTimeout(() => {
        pendingGenerationEventRef.current = null;
        trackEvent(name, payload);
      }, ANALYTICS_DEBOUNCE_DELAY);
      pendingGenerationEventRef.current = { name, payload, timeoutId };
    },
    [cancelPendingGenerationEvent]
  );

  const setSendUsageMetrics = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      const val =
        typeof valueOrFunc === 'function'
          ? valueOrFunc(sendUsageMetricsRef.current)
          : valueOrFunc;
      sendUsageMetricsRef.current = val;
      setSendUsageMetricsEnabled(val);
      setSendUsageMetricsState(val);
      updateSettings((current) => ({ ...current, sendUsageMetrics: val }));
    },
    [updateSettings]
  );

  useEffect(() => {
    initAnalytics();
  }, [sendUsageMetrics]);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isBulkDownloadOpen, setIsBulkDownloadOpen] = useState<boolean>(false);
  const [showSideNav, setShowSideNav] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(true);
  const [showDownloads, setShowDownloads] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [workerReady, setWorkerReady] = useState<boolean>(false);

  // Worker refs
  const ergogenWorkerRef = useRef<Worker | null>(null);
  const jscadWorkerRef = useRef<Worker | null>(null);

  const [isJscadConverting, setIsJscadConverting] = useState<boolean>(false);
  const isInitialMountRef = useRef<boolean>(true);
  const generationStartTimeRef = useRef<number | null>(null);

  // Effect to prune deleted configs on load
  useEffect(() => {
    pruneDeletedConfigs();
  }, []);

  /**
   * Effect to set error from hash fragment decoding if present.
   * This handles errors from initial page load with invalid shared configurations.
   */
  useEffect(() => {
    if (hashError) {
      setError(hashError);
    }
  }, [hashError]); // setError is stable from useState, doesn't need to be in deps

  const clearError = useCallback(() => setError(null), []);
  const clearWarning = useCallback(() => setDeprecationWarning(null), []);
  const clearSkippedWarning = useCallback(() => setSkippedWarning(null), []);
  const clearInfo = useCallback(() => setInfo(null), []);

  /**
   * Handler for messages received from the Ergogen worker.
   * Processes success, error, and warning responses from the worker.
   */
  const handleErgogenWorkerMessage = useCallback(
    (event: MessageEvent<ErgogenWorkerResponse>) => {
      const response = event.data;
      const classification = classifyErgogenResponse(
        generationSessionRef.current,
        response
      );

      if (classification.kind === 'background-preview') {
        const configId = classification.configId;
        if (response.type === 'success' && response.results) {
          const resultsObj = response.results as Results;
          const svgContent =
            resultsObj.outlines?.preview?.svg || resultsObj.demo?.svg;
          const formattedSvg = formatPreviewSvg(svgContent);
          if (formattedSvg) {
            setConfigs((prevConfigs) => {
              const updated = prevConfigs.map((c) =>
                c.id === configId ? { ...c, previewSvg: formattedSvg } : c
              );
              saveMultiConfigToStorage(updated, activeConfigIdRef.current, 2);
              return updated;
            });
          }
        } else if (response.type === 'error') {
          console.warn(
            `Background generation failed for config ${configId}:`,
            response.error
          );
        }
        return;
      }

      if (classification.kind === 'stale') {
        return;
      }

      if (classification.kind === 'active-error') {
        const errorMsg =
          response.type === 'error'
            ? response.error || 'Unknown worker error'
            : 'Unknown worker error';
        console.error('--- Ergogen worker error:', errorMsg);
        setError(errorMsg);
        setIsGenerating(false);
        setIsJscadConverting(false);
        queueGenerationEvent(
          'generation_failed',
          {
            error_message: errorMsg,
            stored_configs_count: configsRef.current.length,
            trigger: classification.isManual ? 'manual' : 'auto',
          },
          classification.isManual
        );
        return;
      }

      if (classification.kind === 'active-success') {
        if (
          response.type === 'success' &&
          response.warnings &&
          response.warnings.length > 0
        ) {
          setDeprecationWarning(
            (prev) => (prev ? prev + '\n' : '') + response.warnings.join('\n')
          );
        }

        if (response.type === 'success' && response.results) {
          const newResults = response.results as Results;

          const duration = generationStartTimeRef.current
            ? performance.now() - generationStartTimeRef.current
            : 0;
          queueGenerationEvent(
            'generation_completed',
            {
              duration_ms: Math.round(duration),
              points_count: newResults.points
                ? Object.keys(newResults.points).length
                : 0,
              pcbs_count: newResults.pcbs
                ? Object.keys(newResults.pcbs).length
                : 0,
              cases_count: newResults.cases
                ? Object.keys(newResults.cases).length
                : 0,
              has_outlines: !!newResults.outlines,
              stored_configs_count: configsRef.current.length,
              trigger: classification.isManual ? 'manual' : 'auto',
            },
            classification.isManual
          );

          try {
            const canonicalText = yaml.dump(newResults.canonical || {});
            const pointsText = yaml.dump(newResults.points || {});
            const payload: KeyboardAnalyticsPayload = analyzeConfiguration(
              canonicalText,
              pointsText,
              Math.round(duration),
              lastTrackedConfigIdRef.current
            );

            if (payload.config_id !== lastTrackedConfigIdRef.current) {
              if (pendingAnalyticsRef.current) {
                clearTimeout(pendingAnalyticsRef.current.timeoutId);
              }

              const timeoutId = setTimeout(() => {
                trackEvent('keyboard_generated', payload);
                lastTrackedConfigIdRef.current = payload.config_id;
                pendingAnalyticsRef.current = null;
              }, ANALYTICS_DEBOUNCE_DELAY);

              pendingAnalyticsRef.current = {
                timeoutId,
                payload,
                configId: payload.config_id,
              };
            }
          } catch (err) {
            console.error(
              'Failed to generate keyboard configuration analytics:',
              err
            );
          }

          const svgContent =
            newResults.outlines?.preview?.svg || newResults.demo?.svg;
          const formattedSvg = formatPreviewSvg(svgContent);
          const targetConfigId = classification.targetConfigId;
          if (formattedSvg && targetConfigId) {
            setConfigs((prevConfigs) => {
              const updated = prevConfigs.map((c) =>
                c.id === targetConfigId ? { ...c, previewSvg: formattedSvg } : c
              );
              saveMultiConfigToStorage(updated, activeConfigIdRef.current, 2);
              return updated;
            });
          }

          let willConvertStl = false;

          if (
            stlPreviewRef.current &&
            newResults.cases &&
            Object.keys(newResults.cases).length > 0
          ) {
            for (const name of Object.keys(newResults.cases)) {
              const caseObj = newResults.cases[name];
              if (caseObj?.jscad) {
                newResults.cases[name].stl = undefined;
              }
            }

            if (jscadWorkerRef.current) {
              willConvertStl = true;
              setIsJscadConverting(true);
              const request: JscadWorkerRequest = {
                type: 'batch_jscad_to_stl',
                results: newResults,
                configVersion: classification.version,
              };
              jscadWorkerRef.current.postMessage(request);
            }
          }

          setResults(newResults);
          setResultsVersion((v) => v + 1);

          if (!willConvertStl) {
            setIsGenerating(false);
          }
        } else {
          setIsGenerating(false);
        }
      } else {
        setIsGenerating(false);
        setIsJscadConverting(false);
      }
    },
    [queueGenerationEvent]
  );

  const handleErgogenWorkerMessageRef = useRef(handleErgogenWorkerMessage);
  handleErgogenWorkerMessageRef.current = handleErgogenWorkerMessage;

  /**
   * Handler for messages received from the JSCAD worker.
   */
  const handleJscadWorkerMessage = useCallback(
    (event: MessageEvent<JscadWorkerResponse>) => {
      const response = event.data;

      if (
        !isActiveJscadVersion(
          generationSessionRef.current,
          response.configVersion
        )
      ) {
        return;
      }

      if (response.type === 'error') {
        console.error('--- JSCAD worker error:', response.error);
        setIsJscadConverting(false);
        setIsGenerating(false);
      } else if (response.type === 'success' && response.results) {
        setResults(response.results as Results);
        setResultsVersion((v) => v + 1);
        setIsJscadConverting(false);
        setIsGenerating(false);
      }
    },
    []
  );

  const handleJscadWorkerMessageRef = useRef(handleJscadWorkerMessage);
  handleJscadWorkerMessageRef.current = handleJscadWorkerMessage;

  const startErgogenWorker = useCallback(() => {
    if (ergogenWorkerRef.current) {
      ergogenWorkerRef.current.terminate();
      ergogenWorkerRef.current = null;
      setWorkerReady(false);
    }

    const worker = createErgogenWorker();
    if (worker) {
      worker.onmessage = (event) =>
        handleErgogenWorkerMessageRef.current(event);
      // The worker's own onerror handles errors once its script has started,
      // so this fires only when the script failed to load or start. Such a
      // worker never answers, so drop it and let runGeneration start another.
      worker.onerror = (e) => {
        worker.terminate();
        if (ergogenWorkerRef.current === worker) {
          ergogenWorkerRef.current = null;
          setWorkerReady(false);
        }
        const errorMessage = e.message || 'Ergogen worker error';
        failActiveGeneration(generationSessionRef.current);
        setError(errorMessage);
        setIsGenerating(false);
        setIsJscadConverting(false);
        trackError(
          e.message || 'Worker crash',
          false,
          'ergogen_worker',
          'GENERATION_WORKER_FAILED'
        );
      };
      ergogenWorkerRef.current = worker;
      setWorkerReady(true);
    } else {
      setWorkerReady(false);
      console.warn('Failed to initialize Ergogen worker.');
    }
    return worker;
  }, []);

  /**
   * Effect to initialize and terminate workers.
   */
  useEffect(() => {
    if (!ergogenWorkerRef.current) {
      startErgogenWorker();
    }

    if (!jscadWorkerRef.current) {
      const jscadWorker = createJscadWorker();
      if (jscadWorker) {
        jscadWorker.onmessage = (event) =>
          handleJscadWorkerMessageRef.current(event);
        jscadWorker.onerror = (e) => {
          setIsJscadConverting(false);
          setIsGenerating(false);
          trackError(
            e.message || 'Worker crash',
            false,
            'jscad_worker',
            'STL_WORKER_FAILED'
          );
        };
        jscadWorkerRef.current = jscadWorker;
      } else {
        console.warn('Failed to initialize JSCAD worker.');
      }
    }

    return () => {
      if (ergogenWorkerRef.current) {
        ergogenWorkerRef.current.terminate();
        ergogenWorkerRef.current = null;
        setWorkerReady(false);
      }
      if (jscadWorkerRef.current) {
        jscadWorkerRef.current.terminate();
        jscadWorkerRef.current = null;
      }
    };
  }, [startErgogenWorker]);

  // Flush pending analytics on unmount and visibility change to hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushPendingAnalytics();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', flushPendingAnalytics);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', flushPendingAnalytics);
      flushPendingAnalytics();
    };
  }, [flushPendingAnalytics]);

  const prevSettingsRef = useRef<AppSettings>({
    debug,
    autoGen,
    autoGen3D,
    kicanvasPreview,
    stlPreview,
    sendUsageMetrics,
  });

  /**
   * Effect to track settings loaded and changes.
   */
  useEffect(() => {
    const currentSettings: AppSettings = {
      debug,
      autoGen,
      autoGen3D,
      kicanvasPreview,
      stlPreview,
      sendUsageMetrics,
    };

    // sendUsageMetrics is always true on any event that reaches GA, so it
    // is not sent as a parameter (setting_name still records the toggle).
    const { sendUsageMetrics: _alwaysTrue, ...reportedSettings } =
      currentSettings;

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevSettingsRef.current = currentSettings;
      trackEvent('settings_loaded', { ...reportedSettings });
    } else {
      const prev = prevSettingsRef.current;
      const changedEntry = (
        Object.keys(currentSettings) as Array<keyof AppSettings>
      ).find((key) => currentSettings[key] !== prev[key]);
      prevSettingsRef.current = currentSettings;

      trackEvent('setting_changed', {
        ...(changedEntry
          ? {
              setting_name: changedEntry,
              setting_value: currentSettings[changedEntry],
            }
          : {}),
        ...reportedSettings,
      });
    }
  }, [
    debug,
    autoGen,
    autoGen3D,
    kicanvasPreview,
    stlPreview,
    sendUsageMetrics,
  ]);

  /**
   * Parses a string as either JSON or YAML.
   */
  const parseConfig = useCallback(
    (inputString: string): [string, Record<string, unknown> | null] => {
      let type = 'UNKNOWN';
      let parsedConfig = null;

      try {
        parsedConfig = JSON.parse(inputString);
        type = 'json';
      } catch (_e: unknown) {
        // Input is not valid JSON
      }

      try {
        parsedConfig = yaml.load(inputString);
        type = 'yaml';
      } catch (_e: unknown) {
        // Input is not valid YAML
      }

      return [type, parsedConfig];
    },
    []
  );

  /**
   * The core function that runs the Ergogen generation process.
   */
  const runGeneration = useCallback(
    async (
      textInput: string | undefined,
      injectionInput: string[][] | undefined,
      options: ProcessOptions = { pointsonly: true }
    ) => {
      const targetInput =
        textInput === undefined || textInput === configInputRef.current
          ? (realtimeConfigInputRef.current ?? configInputRef.current)
          : textInput;

      if (!targetInput) {
        return;
      }
      const inputInjection = filterInjectionsByFeatureFlags(injectionInput);
      const requestKey = buildRequestKey(
        targetInput,
        inputInjection,
        Boolean(options.pointsonly),
        debug
      );
      if (
        shouldSkipRequest(
          generationSessionRef.current,
          requestKey,
          options.skipIfCurrent
        )
      ) {
        return;
      }
      const [, parsedConfig] = parseConfig(targetInput);

      setError(null);
      setDeprecationWarning(null);
      setSkippedWarning(null);
      setIsGenerating(true);
      generationStartTimeRef.current = performance.now();

      const warning = checkForDeprecationWarnings(parsedConfig);
      if (warning) {
        setDeprecationWarning(warning);
      }

      const skippedWarningMsg = getSkippedInjectionsWarning(injectionInput);
      if (skippedWarningMsg) {
        setSkippedWarning(skippedWarningMsg);
      }

      const inputConfig =
        preparePreviewConfig(parsedConfig, options.pointsonly) || targetInput;

      try {
        const worker = ergogenWorkerRef.current ?? startErgogenWorker();
        if (!worker) {
          console.error('Worker not available for processing request.');
          failActiveGeneration(generationSessionRef.current);
          setIsGenerating(false);
          setIsJscadConverting(false);
          setError('Worker not available for processing request.');
          return;
        }

        const active = beginGeneration(generationSessionRef.current, {
          requestKey,
          targetConfigId: activeConfigIdRef.current,
          isManual: Boolean(options.isManual),
        });
        worker.postMessage({
          type: 'generate',
          inputConfig,
          injectionInput: inputInjection,
          requestId: active.requestId,
          options: {
            debug: debug,
            svg: true,
          },
        });
      } catch (e: unknown) {
        failActiveGeneration(generationSessionRef.current);
        setIsGenerating(false);
        setIsJscadConverting(false);
        const errMsg = typeof e === 'string' ? e : String(e);
        setError(errMsg);
        queueGenerationEvent(
          'generation_failed',
          {
            error_message: errMsg,
            stored_configs_count: configsRef.current.length,
            trigger: options.isManual ? 'manual' : 'auto',
          },
          Boolean(options.isManual)
        );
        return;
      }
    },
    [
      parseConfig,
      setError,
      setDeprecationWarning,
      setSkippedWarning,
      setIsGenerating,
      debug,
      queueGenerationEvent,
      startErgogenWorker,
    ]
  );

  /**
   * A debounced version of runGeneration for auto-generation. It does not
   * repeat the request behind the current results. It does not replace a
   * worker that failed to load, so that error stays until Generate does.
   */
  const processInput = useMemo(
    () =>
      debounce(
        (
          textInput: string | undefined,
          injectionInput: string[][] | undefined,
          options: ProcessOptions = { pointsonly: true }
        ) => {
          if (!ergogenWorkerRef.current) {
            return;
          }
          return runGeneration(textInput, injectionInput, {
            ...options,
            skipIfCurrent: true,
          });
        },
        300
      ),
    [runGeneration]
  );

  /**
   * An immediate version for the "Generate" button that cancels any pending auto-generations.
   */
  const generateNow = useCallback(
    async (
      textInput: string | undefined,
      injectionInput: string[][] | undefined,
      options: ProcessOptions = { pointsonly: true }
    ) => {
      processInput.cancel();
      await runGeneration(textInput, injectionInput, options);
    },
    [processInput, runGeneration]
  );

  const setConfigInput = useCallback(
    (valueOrFunc: SetStateAction<string | undefined>) => {
      const prevVal = configInputRef.current;
      const newVal =
        typeof valueOrFunc === 'function'
          ? (valueOrFunc as (prev: string | undefined) => string | undefined)(
              prevVal
            )
          : valueOrFunc;

      if (newVal === prevVal) return;

      setConfigInputState(newVal);

      if (isPreviewRef.current) {
        if (newVal !== previewConfigRef.current) {
          const nextSharedNum = getNextIndexForPattern(
            configsRef.current,
            /^Shared\s+Config\s+(\d+)$/
          );
          const name = `Shared Config ${nextSharedNum}`;
          const newId = generateUUID();
          const now = new Date().toISOString();
          const newConfig: SavedConfig = {
            id: newId,
            name,
            config: newVal || '',
            createdAt: now,
            updatedAt: now,
          };

          const updatedConfigs = [...configsRef.current, newConfig];
          setConfigs(updatedConfigs);
          setActiveConfigId(newId);
          setIsPreview(false);
          setPreviewConfig(null);
          saveMultiConfigToStorage(updatedConfigs, newId);
        }
      } else {
        const currentActiveId = activeConfigIdRef.current;
        if (currentActiveId) {
          const updatedConfigs = configsRef.current.map((c) =>
            c.id === currentActiveId
              ? {
                  ...c,
                  config: newVal || '',
                  updatedAt: new Date().toISOString(),
                }
              : c
          );
          setConfigs(updatedConfigs);
          saveMultiConfigToStorage(updatedConfigs, currentActiveId);
        } else {
          const nextUntitledNum = getNextIndexForPattern(
            configsRef.current,
            /^Untitled\s+(\d+)$/
          );
          const name = `Untitled ${nextUntitledNum}`;
          const newId = generateUUID();
          const now = new Date().toISOString();
          const newConfig: SavedConfig = {
            id: newId,
            name,
            config: newVal || '',
            createdAt: now,
            updatedAt: now,
          };
          const updatedConfigs = [...configsRef.current, newConfig];
          setConfigs(updatedConfigs);
          setActiveConfigId(newId);
          saveMultiConfigToStorage(updatedConfigs, newId);
        }
      }
    },
    []
  );

  const selectConfig = useCallback(
    (id: string | null) => {
      resetLineage();
      clearResults();
      if (id === null) {
        setActiveConfigId(null);
        activeConfigIdRef.current = null;
        setIsPreview(false);
        setPreviewConfig(null);
        setConfigInputState('');
        configInputRef.current = '';
        saveMultiConfigToStorage(configsRef.current, null);
      } else {
        const found = configsRef.current.find((c) => c.id === id);
        if (found) {
          setActiveConfigId(id);
          activeConfigIdRef.current = id;
          setIsPreview(false);
          setPreviewConfig(null);
          setConfigInputState(found.config);
          configInputRef.current = found.config;
          saveMultiConfigToStorage(configsRef.current, id);
          trackEvent('config_selected', {
            stored_configs_count: configsRef.current.length,
          });
        }
      }
    },
    [resetLineage, clearResults]
  );

  const createNewConfig = useCallback(
    (content: string, name?: string) => {
      resetLineage();
      clearResults();
      const nextUntitledNum = getNextIndexForPattern(
        configsRef.current,
        /^Untitled\s+(\d+)$/
      );
      const configName = name || `Untitled ${nextUntitledNum}`;
      const newId = generateUUID();
      const now = new Date().toISOString();
      const newConfig: SavedConfig = {
        id: newId,
        name: configName,
        config: content,
        createdAt: now,
        updatedAt: now,
      };
      const updatedConfigs = [...configsRef.current, newConfig];
      setConfigs(updatedConfigs);
      setActiveConfigId(newId);
      setIsPreview(false);
      setPreviewConfig(null);
      setConfigInputState(content);

      trackEvent('config_created', {
        stored_configs_count: updatedConfigs.length,
      });

      // Synchronously update the refs to avoid race conditions with consecutive calls
      configsRef.current = updatedConfigs;
      activeConfigIdRef.current = newId;
      configInputRef.current = content;

      saveMultiConfigToStorage(updatedConfigs, newId);
      return newId;
    },
    [resetLineage, clearResults]
  );

  const renameConfig = useCallback(
    (id: string, newName: string) => {
      const trimmed = newName.trim();
      if (!trimmed) {
        setError('Configuration name cannot be empty');
        return false;
      }
      const existing = configsRef.current.find((c) => c.id === id);
      if (!existing) return false;
      if (existing.name === trimmed) return true;

      const isDuplicate = configsRef.current.some(
        (c) =>
          c.id !== id && c.name.trim().toLowerCase() === trimmed.toLowerCase()
      );
      if (isDuplicate) {
        setError(`A configuration named "${trimmed}" already exists.`);
        return false;
      }

      const updatedConfigs = configsRef.current.map((c) =>
        c.id === id
          ? { ...c, name: trimmed, updatedAt: new Date().toISOString() }
          : c
      );
      setConfigs(updatedConfigs);
      configsRef.current = updatedConfigs;
      saveMultiConfigToStorage(updatedConfigs, activeConfigIdRef.current);
      trackEvent('config_renamed', {
        stored_configs_count: updatedConfigs.length,
      });
      return true;
    },
    [setError]
  );

  const duplicateConfig = useCallback(
    (id: string) => {
      resetLineage();
      clearResults();
      const found = configsRef.current.find((c) => c.id === id);
      if (found) {
        const newId = generateUUID();
        const now = new Date().toISOString();
        const newConfig: SavedConfig = {
          id: newId,
          name: `${found.name} (Copy)`,
          config: found.config,
          createdAt: now,
          updatedAt: now,
        };
        const updatedConfigs = [...configsRef.current, newConfig];
        setConfigs(updatedConfigs);
        setActiveConfigId(newId);
        setIsPreview(false);
        setPreviewConfig(null);
        setConfigInputState(found.config);

        // Synchronously update the refs to avoid race conditions
        configsRef.current = updatedConfigs;
        activeConfigIdRef.current = newId;
        configInputRef.current = found.config;

        saveMultiConfigToStorage(updatedConfigs, newId);
        trackEvent('config_duplicated', {
          stored_configs_count: updatedConfigs.length,
        });
      }
    },
    [resetLineage, clearResults]
  );

  const deleteConfig = useCallback(
    (id: string) => {
      resetLineage();
      const currentActiveId = activeConfigIdRef.current;
      const deletedConfigObj = configsRef.current.find((c) => c.id === id);

      const remainingConfigs = configsRef.current.filter((c) => c.id !== id);
      setConfigs(remainingConfigs);
      configsRef.current = remainingConfigs;

      const isDeletingActive = currentActiveId === id;
      const isLastConfig = remainingConfigs.length === 0;

      if (isLastConfig || isDeletingActive) {
        clearResults();
        setActiveConfigId(null);
        activeConfigIdRef.current = null;
        setConfigInputState('');
        configInputRef.current = '';
        saveMultiConfigToStorage(remainingConfigs, null);
      } else {
        saveMultiConfigToStorage(remainingConfigs, currentActiveId);
      }

      if (deletedConfigObj) {
        saveToDeletedStorage(deletedConfigObj);
      }

      trackEvent('config_deleted', {
        stored_configs_count: remainingConfigs.length,
      });
    },
    [resetLineage, clearResults]
  );

  const loadPreview = useCallback(
    (config: string) => {
      resetLineage();
      clearResults();
      setIsPreview(true);
      setPreviewConfig(config);
      setConfigInputState(config);
    },
    [resetLineage, clearResults]
  );

  const savePreviewConfig = useCallback(() => {
    if (!isPreviewRef.current) return;
    const nextSharedNum = getNextIndexForPattern(
      configsRef.current,
      /^Shared\s+Config\s+(\d+)$/
    );
    const name = `Shared Config ${nextSharedNum}`;
    const newId = generateUUID();
    const now = new Date().toISOString();
    const newConfig: SavedConfig = {
      id: newId,
      name,
      config: configInputRef.current || '',
      createdAt: now,
      updatedAt: now,
    };

    const updatedConfigs = [...configsRef.current, newConfig];
    setConfigs(updatedConfigs);
    configsRef.current = updatedConfigs;
    setActiveConfigId(newId);
    activeConfigIdRef.current = newId;
    setIsPreview(false);
    setPreviewConfig(null);
    saveMultiConfigToStorage(updatedConfigs, newId);
  }, []);

  const handlePruneDeletedConfigs = useCallback(() => {
    pruneDeletedConfigs();
  }, []);

  const activeConfigName = useMemo(() => {
    if (isPreview) {
      return 'Shared Config';
    }
    if (activeConfigId) {
      const active = configs.find((c) => c.id === activeConfigId);
      return active ? active.name : '';
    }
    return '';
  }, [isPreview, activeConfigId, configs]);

  // Memoize callbacks for the conflict resolution hook to prevent unnecessary re-renders
  const conflictResolutionCallbacks = useMemo(
    () => ({
      setInjectionInput,
      setConfigInput,
      generateNow,
      getCurrentInjections: () => injectionInput || [],
      setError,
    }),
    [injectionInput, generateNow, setInjectionInput, setConfigInput, setError]
  );

  // Use the injection conflict resolution hook
  const {
    currentConflict,
    processInjectionsWithConflictResolution,
    handleConflictResolution,
    handleConflictCancel,
  } = useInjectionConflictResolution(conflictResolutionCallbacks);

  // Use the config loader hook
  const { isLoading: isConfigLoading } = useConfigLoader({
    processInjectionsWithConflictResolution,
    setError,
  });

  // The configuration the load-time generation below is for. Its results set
  // that configuration's preview, so the background preview pass skips it.
  const loadGenerationConfigIdRef = useRef<string | null>(null);

  /**
   * Effect to process the input configuration on the initial load.
   */
  useEffect(() => {
    if (hashError) {
      return;
    }

    if (isConfigLoading) {
      return;
    }

    const queryParameters = new URLSearchParams(window.location.search);
    const githubUrl = queryParameters.get('github');

    if (!githubUrl && configInputState) {
      loadGenerationConfigIdRef.current = activeConfigIdRef.current;
      generateNow(configInputState, injectionInput, { pointsonly: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfigLoading]);

  // Track previous showSettings value
  const prevShowSettingsRef = useRef<boolean>(showSettings);

  /**
   * Effect to handle transition of showSettings from true to false (settings closed).
   */
  useEffect(() => {
    if (prevShowSettingsRef.current && !showSettings) {
      invalidateSession(generationSessionRef.current);
      setIsGenerating(false);
      setIsJscadConverting(false);
      startErgogenWorker();

      if (configInputState) {
        generateNow(configInputState, injectionInput, {
          pointsonly: !autoGen3D,
        });
      }
    }
    prevShowSettingsRef.current = showSettings;
  }, [
    showSettings,
    configInputState,
    injectionInput,
    autoGen3D,
    generateNow,
    startErgogenWorker,
  ]);

  /**
   * Effect to process the input configuration whenever it or the auto-generation settings change.
   */
  useEffect(() => {
    localStorage.setItem('ergogen:injection', JSON.stringify(injectionInput));
    if (autoGen && !showSettings) {
      processInput(configInputState, injectionInput, {
        pointsonly: !autoGen3D,
      });
    }
  }, [
    configInputState,
    injectionInput,
    autoGen,
    autoGen3D,
    showSettings,
    processInput,
  ]);

  // Trigger background preview generation on mount if loadedVersion is 1 or hadLegacyConfig is true
  useEffect(() => {
    if (!workerReady) return;

    if (loadedVersion === 1 || hadLegacyConfig) {
      console.log(
        'Version 1 or legacy configuration detected on load. Triggering background preview generation for all configs missing a preview SVG...'
      );

      // Save directly as version 2 to prevent triggering this again next time
      saveMultiConfigToStorage(
        configsRef.current,
        activeConfigIdRef.current,
        2
      );

      // Loop through all configurations that don't have a previewSvg and generate them
      configsRef.current.forEach((cfg) => {
        if (!cfg.previewSvg && cfg.id !== loadGenerationConfigIdRef.current) {
          console.log(
            `Triggering background preview generation for: ${cfg.name}`
          );
          ergogenWorkerRef.current?.postMessage({
            type: 'generate',
            inputConfig: cfg.config,
            requestId: `background-preview-${cfg.id}`,
            options: {
              debug: true,
              svg: true,
            },
          });
        }
      });
    }
  }, [workerReady, loadedVersion, hadLegacyConfig]);

  const contextValue = useMemo(
    () => ({
      configInput: configInputState,
      getRealtimeConfigInput,
      updateRealtimeConfigInput,
      setConfigInput,
      configs,
      activeConfigId,
      activeConfigName,
      isPreview,
      selectConfig,
      createNewConfig,
      renameConfig,
      duplicateConfig,
      deleteConfig,
      loadPreview,
      savePreviewConfig,
      pruneDeletedConfigs: handlePruneDeletedConfigs,
      injectionInput,
      setInjectionInput,
      processInput,
      generateNow,
      error,
      setError,
      clearError,
      deprecationWarning,
      clearWarning,
      skippedWarning,
      clearSkippedWarning,
      info,
      setInfo,
      clearInfo,
      results,
      resultsVersion,
      setResultsVersion,
      showSettings,
      setShowSettings,
      isBulkDownloadOpen,
      setIsBulkDownloadOpen,
      showSideNav,
      setShowSideNav,
      showConfig,
      setShowConfig,
      showDownloads,
      setShowDownloads,
      debug,
      setDebug,
      autoGen,
      setAutoGen,
      autoGen3D,
      setAutoGen3D,
      kicanvasPreview,
      setKicanvasPreview,
      stlPreview,
      setStlPreview,
      sendUsageMetrics,
      setSendUsageMetrics,
      isGenerating,
      setIsGenerating,
      isJscadConverting,
      currentConflict,
      handleConflictResolution,
      handleConflictCancel,
    }),
    [
      configInputState,
      getRealtimeConfigInput,
      updateRealtimeConfigInput,
      setConfigInput,
      configs,
      activeConfigId,
      activeConfigName,
      isPreview,
      selectConfig,
      createNewConfig,
      renameConfig,
      duplicateConfig,
      deleteConfig,
      isBulkDownloadOpen,
      loadPreview,
      savePreviewConfig,
      handlePruneDeletedConfigs,
      injectionInput,
      setInjectionInput,
      processInput,
      generateNow,
      error,
      setError,
      clearError,
      deprecationWarning,
      clearWarning,
      skippedWarning,
      clearSkippedWarning,
      info,
      setInfo,
      clearInfo,
      results,
      resultsVersion,
      setResultsVersion,
      showSettings,
      setShowSettings,
      showSideNav,
      setShowSideNav,
      showConfig,
      setShowConfig,
      showDownloads,
      setShowDownloads,
      debug,
      setDebug,
      autoGen,
      setAutoGen,
      autoGen3D,
      setAutoGen3D,
      kicanvasPreview,
      setKicanvasPreview,
      stlPreview,
      setStlPreview,
      sendUsageMetrics,
      setSendUsageMetrics,
      isGenerating,
      setIsGenerating,
      isJscadConverting,
      currentConflict,
      handleConflictResolution,
      handleConflictCancel,
    ]
  );

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export { ConfigContextProvider };

/**
 * A custom hook to easily consume the ConfigContext.
 * @returns {ContextProps | null} The context value, or null if used outside a provider.
 */
export const useConfigContext = () => useContext(ConfigContext);
