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
import { DebouncedFunc } from 'lodash-es';
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
} from '../utils/analytics';
import {
  analyzeConfiguration,
  KeyboardAnalyticsPayload,
} from '../utils/configAnalyzer';
import ConflictResolutionDialog from '../molecules/ConflictResolutionDialog';
import { useInjectionConflictResolution } from '../hooks/useInjectionConflictResolution';
import { useConfigLoader } from '../hooks/useConfigLoader';
import type { WorkerResponse as ErgogenWorkerResponse } from '../workers/ergogen.worker.types';
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
import { exportAllConfigs, downloadAllConfigs } from '../utils/zip';
import {
  filterInjectionsByFeatureFlags,
  checkForDeprecationWarnings,
  preparePreviewConfig,
} from '../utils/generationHelpers';

interface SavedConfig {
  id: string;
  name: string;
  config: string;
  createdAt: string;
  updatedAt: string;
  previewSvg?: string;
}

interface MultiConfigContainer {
  version: number;
  activeConfigId: string | null;
  configs: SavedConfig[];
}

import { Results } from '../types/results';

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
  exportAllConfigs: () => Promise<void>;
  downloadAllConfigs: () => Promise<void>;
  loadPreview: (config: string) => void;
  savePreviewConfig: () => void;
  pruneDeletedConfigs: () => void;
  injectionInput: string[][] | undefined;
  setInjectionInput: Dispatch<SetStateAction<string[][] | undefined>>;
  processInput: DebouncedFunc<
    (
      textInput: string | undefined,
      injectionInput: string[][] | undefined,
      options?: ProcessOptions
    ) => Promise<void>
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
};

/**
 * Options for the `processInput` function.
 */
type ProcessOptions = {
  pointsonly: boolean;
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

const loadMultiConfigFromStorage = (): MultiConfigContainer => {
  if (typeof window === 'undefined') {
    return { version: 2, activeConfigId: null, configs: [] };
  }
  const stored = localStorage.getItem(MULTI_CONFIG_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.version === 'number') {
        const now = new Date().toISOString();
        const migratedConfigs = (parsed.configs || []).map(
          (cfg: Partial<SavedConfig>) => ({
            ...cfg,
            createdAt: cfg.createdAt || now,
            updatedAt: cfg.updatedAt || now,
          })
        );
        return {
          ...parsed,
          configs: migratedConfigs,
        };
      }
    } catch (e) {
      console.error('Failed to parse multi-config storage:', e);
    }
  }
  return {
    version: 2,
    activeConfigId: null,
    configs: [],
  };
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
  const initialData = loadMultiConfigFromStorage();
  if (typeof window === 'undefined') return initialData;

  const legacyConfigValue1 = localStorage.getItem(LEGACY_STORAGE_CONFIG_KEY);
  const legacyConfigValue2 = localStorage.getItem(CONFIG_LOCAL_STORAGE_KEY);

  let legacyText = '';
  if (legacyConfigValue1) {
    try {
      legacyText = JSON.parse(legacyConfigValue1);
    } catch {
      legacyText = legacyConfigValue1;
    }
  } else if (legacyConfigValue2) {
    try {
      legacyText = JSON.parse(legacyConfigValue2);
    } catch {
      legacyText = legacyConfigValue2;
    }
  }

  if (legacyText && legacyText.trim() !== '') {
    const hasLegacyConfig = initialData.configs.some(
      (c) => c.name === 'Legacy Config'
    );
    if (!hasLegacyConfig) {
      const newId = generateUUID();
      const legacyConfig: SavedConfig = {
        id: newId,
        name: 'Legacy Config',
        config: legacyText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      initialData.configs.push(legacyConfig);
      initialData.activeConfigId = newId;
      saveMultiConfigToStorage(initialData.configs, newId, 2);
    }
    localStorage.removeItem(LEGACY_STORAGE_CONFIG_KEY);
    localStorage.removeItem(CONFIG_LOCAL_STORAGE_KEY);
  }

  return initialData;
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

  const flushPendingAnalytics = useCallback(() => {
    if (pendingAnalyticsRef.current) {
      const { timeoutId, payload, configId } = pendingAnalyticsRef.current;
      clearTimeout(timeoutId);
      trackEvent('keyboard_generated', payload);
      lastTrackedConfigIdRef.current = configId;
      pendingAnalyticsRef.current = null;
    }
  }, []);

  const resetLineage = useCallback(() => {
    lastTrackedConfigIdRef.current = undefined;
    if (pendingAnalyticsRef.current) {
      clearTimeout(pendingAnalyticsRef.current.timeoutId);
      pendingAnalyticsRef.current = null;
    }
  }, []);

  const [injectionInput, setInjectionInput] = useLocalStorage<string[][]>(
    'ergogen:injection',
    initialInjectionInput
  );
  const [error, setError] = useState<string | null>(null);
  const [deprecationWarning, setDeprecationWarning] = useState<string | null>(
    null
  );
  const [results, setResults] = useState<Results | null>(null);
  const [resultsVersion, setResultsVersion] = useState<number>(0);
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    'ergogen:settings',
    getDefaultSettings()
  );

  const debug = settings?.debug ?? false;
  const autoGen = settings?.autoGen ?? true;
  const autoGen3D = settings?.autoGen3D ?? true;
  const kicanvasPreview = settings?.kicanvasPreview ?? true;
  const stlPreview = settings?.stlPreview ?? true;
  const sendUsageMetrics = settings?.sendUsageMetrics ?? true;

  const setDebug = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      setSettings((prev) => {
        const current = prev || getDefaultSettings();
        const val =
          typeof valueOrFunc === 'function'
            ? valueOrFunc(current.debug)
            : valueOrFunc;
        return { ...current, debug: val };
      });
    },
    [setSettings]
  );

  const setAutoGen = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      setSettings((prev) => {
        const current = prev || getDefaultSettings();
        const val =
          typeof valueOrFunc === 'function'
            ? valueOrFunc(current.autoGen)
            : valueOrFunc;
        return { ...current, autoGen: val };
      });
    },
    [setSettings]
  );

  const setAutoGen3D = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      setSettings((prev) => {
        const current = prev || getDefaultSettings();
        const val =
          typeof valueOrFunc === 'function'
            ? valueOrFunc(current.autoGen3D)
            : valueOrFunc;
        return { ...current, autoGen3D: val };
      });
    },
    [setSettings]
  );

  const setKicanvasPreview = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      setSettings((prev) => {
        const current = prev || getDefaultSettings();
        const val =
          typeof valueOrFunc === 'function'
            ? valueOrFunc(current.kicanvasPreview)
            : valueOrFunc;
        return { ...current, kicanvasPreview: val };
      });
    },
    [setSettings]
  );

  const setStlPreview = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      setSettings((prev) => {
        const current = prev || getDefaultSettings();
        const val =
          typeof valueOrFunc === 'function'
            ? valueOrFunc(current.stlPreview)
            : valueOrFunc;
        return { ...current, stlPreview: val };
      });
    },
    [setSettings]
  );

  const setSendUsageMetrics = useCallback(
    (valueOrFunc: SetStateAction<boolean>) => {
      setSettings((prev) => {
        const current = prev || getDefaultSettings();
        const val =
          typeof valueOrFunc === 'function'
            ? valueOrFunc(current.sendUsageMetrics)
            : valueOrFunc;
        return { ...current, sendUsageMetrics: val };
      });
    },
    [setSettings]
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

  // Config version tracking
  const currentConfigVersion = useRef<number>(0);
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

  /**
   * Handler for messages received from the Ergogen worker.
   * Processes success, error, and warning responses from the worker.
   */
  const handleErgogenWorkerMessage = useCallback(
    (event: MessageEvent<ErgogenWorkerResponse>) => {
      const response = event.data;

      // Handle background preview generation requests
      if (
        response.requestId &&
        response.requestId.startsWith('background-preview-')
      ) {
        const configId = response.requestId.substring(
          'background-preview-'.length
        );
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

      if (response.type === 'error') {
        console.error('--- Ergogen worker error:', response.error);
        setError(response.error);
        setIsGenerating(false);
        setIsJscadConverting(false);
        trackEvent('generation_failed', {
          error_message: response.error || 'Unknown worker error',
          stored_configs_count: configsRef.current.length,
        });
        return;
      }

      if (response.type === 'success') {
        // Handle warnings
        if (response.warnings && response.warnings.length > 0) {
          setDeprecationWarning(
            (prev) => (prev ? prev + '\n' : '') + response.warnings.join('\n')
          );
        }

        // Set results and trigger STL conversion if needed
        if (response.results) {
          const newResults = response.results as Results;

          const duration = generationStartTimeRef.current
            ? performance.now() - generationStartTimeRef.current
            : 0;
          trackEvent('generation_completed', {
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
          });

          // Perform configuration analysis and track GA4 event (debounced)
          try {
            const canonicalText = yaml.dump(newResults.canonical || {});
            const pointsText = yaml.dump(newResults.points || {});
            const payload: KeyboardAnalyticsPayload = analyzeConfiguration(
              canonicalText,
              pointsText,
              Math.round(duration),
              lastTrackedConfigIdRef.current
            );

            // Avoid sending redundant tracking events when the config hasn't changed geometrically
            if (payload.config_id !== lastTrackedConfigIdRef.current) {
              // Clear any existing pending tracking timer
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

          // Store preview or demo SVG in the active configuration
          const svgContent =
            newResults.outlines?.preview?.svg || newResults.demo?.svg;
          const formattedSvg = formatPreviewSvg(svgContent);
          const currentActiveId = activeConfigIdRef.current;
          if (formattedSvg && currentActiveId) {
            setConfigs((prevConfigs) => {
              const updated = prevConfigs.map((c) =>
                c.id === currentActiveId
                  ? { ...c, previewSvg: formattedSvg }
                  : c
              );
              saveMultiConfigToStorage(updated, currentActiveId, 2);
              return updated;
            });
          }

          let willConvertStl = false;

          if (
            stlPreview &&
            newResults.cases &&
            Object.keys(newResults.cases).length > 0
          ) {
            // Mark STL as pending for all cases that have JSCAD
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
                configVersion: currentConfigVersion.current,
              };
              jscadWorkerRef.current.postMessage(request);
            }
          }

          setResults(newResults);
          setResultsVersion((v) => v + 1);

          // Only clear isGenerating if we're not waiting for STL conversion
          if (!willConvertStl) {
            setIsGenerating(false);
          }
        } else {
          setIsGenerating(false);
        }
      } else {
        setIsGenerating(false);
      }
    },
    [stlPreview]
  );

  /**
   * Handler for messages received from the JSCAD worker.
   */
  const handleJscadWorkerMessage = useCallback(
    (event: MessageEvent<JscadWorkerResponse>) => {
      const response = event.data;

      if (response.configVersion !== currentConfigVersion.current) {
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

  /**
   * Effect to initialize and terminate workers.
   */
  useEffect(() => {
    if (!ergogenWorkerRef.current) {
      ergogenWorkerRef.current = createErgogenWorker();
      if (ergogenWorkerRef.current) {
        ergogenWorkerRef.current.onmessage = handleErgogenWorkerMessage;
        setWorkerReady(true);
      } else {
        console.warn('Failed to initialize Ergogen worker.');
      }
    }

    if (!jscadWorkerRef.current) {
      jscadWorkerRef.current = createJscadWorker();
      if (jscadWorkerRef.current) {
        jscadWorkerRef.current.onmessage = handleJscadWorkerMessage;
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
  }, [handleErgogenWorkerMessage, handleJscadWorkerMessage]);

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

  /**
   * Effect to track settings loaded and changes.
   */
  useEffect(() => {
    trackEvent('settings_loaded', {
      debug,
      autoGen,
      autoGen3D,
      kicanvasPreview,
      stlPreview,
      sendUsageMetrics,
    });

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
    } else {
      trackEvent('setting_changed', {
        debug,
        autoGen,
        autoGen3D,
        kicanvasPreview,
        stlPreview,
        sendUsageMetrics,
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
      const [, parsedConfig] = parseConfig(targetInput);

      setError(null);
      setDeprecationWarning(null);
      setIsGenerating(true);
      generationStartTimeRef.current = performance.now();
      currentConfigVersion.current += 1;

      const warning = checkForDeprecationWarnings(parsedConfig);
      if (warning) {
        setDeprecationWarning(warning);
      }

      const inputConfig =
        preparePreviewConfig(parsedConfig, options.pointsonly) || targetInput;

      try {
        if (ergogenWorkerRef.current) {
          ergogenWorkerRef.current.postMessage({
            type: 'generate',
            inputConfig,
            injectionInput: inputInjection,
            requestId: `ergogen-generate-${currentConfigVersion.current}-${Date.now()}`,
            options: {
              debug: debug,
              svg: true,
            },
          });
        } else {
          console.error('Worker not available for processing request.');
        }
      } catch (e: unknown) {
        setIsGenerating(false);
        const errMsg = typeof e === 'string' ? e : String(e);
        setError(errMsg);
        trackEvent('generation_failed', {
          error_message: errMsg,
          stored_configs_count: configsRef.current.length,
        });
        return;
      }
    },
    [parseConfig, setError, setDeprecationWarning, setIsGenerating, debug]
  );

  /**
   * A debounced version of runGeneration for auto-generation.
   */
  const processInput = useMemo(
    () => debounce(runGeneration, 300),
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
    [resetLineage]
  );

  const createNewConfig = useCallback(
    (content: string, name?: string) => {
      resetLineage();
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
    [resetLineage]
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
    [resetLineage]
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
      const isLastConfig = configsRef.current.length <= 1;

      if (isLastConfig || isDeletingActive) {
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
    [resetLineage]
  );

  const loadPreview = useCallback(
    (config: string) => {
      resetLineage();
      setIsPreview(true);
      setPreviewConfig(config);
      setConfigInputState(config);
    },
    [resetLineage]
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

  const handleExportAllConfigs = useCallback(async () => {
    await exportAllConfigs(
      configsRef.current,
      injectionInput,
      debug,
      stlPreview
    );
  }, [injectionInput, debug, stlPreview]);

  const handleDownloadAllConfigs = useCallback(async () => {
    await downloadAllConfigs(configsRef.current, injectionInput);
  }, [injectionInput]);

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
      generateNow(configInputState, injectionInput, { pointsonly: false });
    }
    // eslint-disable-next-line
  }, [isConfigLoading]);

  // Track previous showSettings value
  const prevShowSettingsRef = useRef<boolean>(showSettings);

  /**
   * Effect to handle transition of showSettings from true to false (settings closed).
   */
  useEffect(() => {
    if (prevShowSettingsRef.current && !showSettings) {
      console.log(
        'Settings panel closed. Restarting Ergogen worker to clear stale custom libraries...'
      );

      if (ergogenWorkerRef.current) {
        ergogenWorkerRef.current.terminate();
        ergogenWorkerRef.current = null;
        setWorkerReady(false);
        console.log('Ergogen worker terminated.');
      }

      console.log('Initializing fresh Ergogen worker...');
      ergogenWorkerRef.current = createErgogenWorker();
      if (ergogenWorkerRef.current) {
        ergogenWorkerRef.current.onmessage = handleErgogenWorkerMessage;
        setWorkerReady(true);
        console.log('Ergogen worker initialized.');
      } else {
        console.warn('Failed to initialize Ergogen worker.');
      }

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
    handleErgogenWorkerMessage,
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
        if (!cfg.previewSvg) {
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
      exportAllConfigs: handleExportAllConfigs,
      downloadAllConfigs: handleDownloadAllConfigs,
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
      handleExportAllConfigs,
      handleDownloadAllConfigs,
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
    ]
  );

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
      {currentConflict && (
        <ConflictResolutionDialog
          injectionName={currentConflict.name}
          injectionType={currentConflict.type}
          onResolve={handleConflictResolution}
          onCancel={handleConflictCancel}
          data-testid="conflict-resolution-dialog"
        />
      )}
    </ConfigContext.Provider>
  );
};

export { ConfigContextProvider };

/**
 * A custom hook to easily consume the ConfigContext.
 * @returns {ContextProps | null} The context value, or null if used outside a provider.
 */
export const useConfigContext = () => useContext(ConfigContext);
