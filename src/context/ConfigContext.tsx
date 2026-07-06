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
import { trackEvent } from '../utils/analytics';
import ConflictResolutionDialog from '../molecules/ConflictResolutionDialog';
import { useInjectionConflictResolution } from '../hooks/useInjectionConflictResolution';
import { useConfigLoader } from '../hooks/useConfigLoader';
import type { WorkerResponse as ErgogenWorkerResponse } from '../workers/ergogen.worker.types';
import type {
  JscadWorkerRequest,
  JscadWorkerResponse,
  ResultsLike,
} from '../workers/jscad.worker.types';

import {
  CONFIG_LOCAL_STORAGE_KEY,
  MULTI_CONFIG_STORAGE_KEY,
  LEGACY_STORAGE_CONFIG_KEY,
} from './constants';
import { exportAllConfigs } from '../utils/zip';

interface SavedConfig {
  id: string;
  name: string;
  config: string;
}

interface MultiConfigContainer {
  version: number;
  activeConfigId: string | null;
  configs: SavedConfig[];
}

// Strongly-typed shape for Ergogen results used in the UI
type DemoOutput = {
  dxf?: string;
  svg?: string;
};
type OutlineOutput = {
  dxf?: string;
  svg?: string;
};
type CaseOutput = {
  jscad?: string;
  stl?: string;
};
type PcbsOutput = Record<string, string>;

// Backward-compatible results type with known top-level keys and an index signature
type Results = {
  canonical?: unknown;
  points?: unknown;
  units?: unknown;
  demo?: DemoOutput;
  outlines?: Record<string, OutlineOutput>;
  cases?: Record<string, CaseOutput>;
  pcbs?: PcbsOutput;
  [key: string]: unknown;
};

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
  configInput?: string | undefined;
  setConfigInput?: Dispatch<SetStateAction<string | undefined>>;
  initialInjectionInput?: string[][];
  hashError?: string | null;
  children: React.ReactNode[] | React.ReactNode;
};

/**
 * Defines the shape of the data and functions provided by the ConfigContext.
 */
type ContextProps = {
  configInput: string | undefined;
  setConfigInput: Dispatch<SetStateAction<string | undefined>>;
  configs: SavedConfig[];
  activeConfigId: string | null;
  activeConfigName: string;
  isPreview: boolean;
  selectConfig: (id: string) => void;
  createNewConfig: (content: string, name?: string) => string;
  renameConfig: (id: string, newName: string) => void;
  duplicateConfig: (id: string) => void;
  deleteConfig: (id: string) => void;
  exportAllConfigs: () => Promise<void>;
  loadPreview: (config: string) => void;
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
  experiment: string | null;
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

/**
 * Retrieves a value from local storage, or returns a default value if not found.
 * @param {string} key - The local storage key.
 * @param {any} defaultValue - The default value to return if the key is not found.
 * @returns {any} The parsed value from local storage or the default value.
 */
const localStorageOrDefault = (key: string, defaultValue: unknown) => {
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    return JSON.parse(storedValue);
  } else {
    return defaultValue;
  }
};

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

const loadMultiConfigFromStorage = (): MultiConfigContainer => {
  if (typeof window === 'undefined') {
    return { version: 1, activeConfigId: null, configs: [] };
  }
  const stored = localStorage.getItem(MULTI_CONFIG_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.version === 'number') {
        return parsed as MultiConfigContainer;
      }
    } catch (e) {
      console.error('Failed to parse multi-config storage:', e);
    }
  }
  return {
    version: 1,
    activeConfigId: null,
    configs: [],
  };
};

const saveMultiConfigToStorage = (
  configs: SavedConfig[],
  activeConfigId: string | null
) => {
  if (typeof window === 'undefined') return;
  const container: MultiConfigContainer = {
    version: 1,
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
      };
      initialData.configs.push(legacyConfig);
      initialData.activeConfigId = newId;
      saveMultiConfigToStorage(initialData.configs, newId);
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
  configInput,
  setConfigInput: setConfigInputProp,
  initialInjectionInput,
  hashError,
  children,
}: Props) => {
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
      if (configInput !== undefined) {
        return configInput;
      }
      if (multiConfig.activeConfigId) {
        const active = multiConfig.configs.find(
          (c) => c.id === multiConfig.activeConfigId
        );
        return active ? active.config : '';
      }
      return '';
    }
  );

  // Sync configInput prop if it changes from outside
  useEffect(() => {
    if (configInput !== undefined) {
      setConfigInputState(configInput);
    }
  }, [configInput]);

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
  const [debug, setDebug] = useState<boolean>(
    localStorageOrDefault('ergogen:config:debug', false)
  );
  const [autoGen, setAutoGen] = useState<boolean>(
    localStorageOrDefault('ergogen:config:autoGen', true)
  );
  const [autoGen3D, setAutoGen3D] = useState<boolean>(
    localStorageOrDefault('ergogen:config:autoGen3D', true)
  );
  const [kicanvasPreview, setKicanvasPreview] = useState<boolean>(
    localStorageOrDefault('ergogen:config:kicanvasPreview', true)
  );
  const [stlPreview, setStlPreview] = useState<boolean>(
    localStorageOrDefault('ergogen:config:stlPreview', true)
  );
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSideNav, setShowSideNav] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(true);
  const [showDownloads, setShowDownloads] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Worker refs
  const ergogenWorkerRef = useRef<Worker | null>(null);
  const jscadWorkerRef = useRef<Worker | null>(null);

  // Config version tracking
  const currentConfigVersion = useRef<number>(0);
  const [isJscadConverting, setIsJscadConverting] = useState<boolean>(false);
  const isInitialMountRef = useRef<boolean>(true);

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

      if (response.type === 'error') {
        console.error('--- Ergogen worker error:', response.error);
        setError(response.error);
        setIsGenerating(false);
        setIsJscadConverting(false);
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
                results: newResults as ResultsLike,
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
      }
      if (jscadWorkerRef.current) {
        jscadWorkerRef.current.terminate();
        jscadWorkerRef.current = null;
      }
    };
  }, [handleErgogenWorkerMessage, handleJscadWorkerMessage]);

  /**
   * Effect to save user settings to local storage whenever they change.
   */
  useEffect(() => {
    localStorage.setItem('ergogen:config:debug', JSON.stringify(debug));
    localStorage.setItem('ergogen:config:autoGen', JSON.stringify(autoGen));
    localStorage.setItem('ergogen:config:autoGen3D', JSON.stringify(autoGen3D));
    localStorage.setItem(
      'ergogen:config:kicanvasPreview',
      JSON.stringify(kicanvasPreview)
    );
    localStorage.setItem(
      'ergogen:config:stlPreview',
      JSON.stringify(stlPreview)
    );
  }, [debug, autoGen, autoGen3D, kicanvasPreview, stlPreview]);

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
      });
    }
  }, [debug, autoGen, autoGen3D, kicanvasPreview, stlPreview]);

  /**
   * Parses a string as either JSON or YAML.
   */
  const parseConfig = useCallback(
    (inputString: string): [string, { [key: string]: unknown[] } | null] => {
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
      if (!textInput) {
        return;
      }
      let inputConfig: string | object = textInput ?? '';
      const inputInjection: string[][] | undefined = injectionInput;
      const [, parsedConfig] = parseConfig(textInput ?? '');

      setError(null);
      setDeprecationWarning(null);
      setIsGenerating(true);
      currentConfigVersion.current += 1;

      if (parsedConfig && parsedConfig.pcbs) {
        let warningFound = false;
        for (const pcbKey in parsedConfig.pcbs) {
          // eslint-disable-next-line
          const pcb = (parsedConfig.pcbs as Record<string, any>)[pcbKey];
          if (!pcb.template || pcb.template === 'kicad5') {
            const footprints = pcb.footprints;
            if (footprints) {
              for (const fpKey in footprints) {
                const footprint = footprints[fpKey];
                if (
                  footprint &&
                  typeof footprint.what === 'string' &&
                  footprint.what.startsWith('ceoloide')
                ) {
                  setDeprecationWarning(
                    'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.'
                  );
                  warningFound = true;
                  break;
                }
              }
            }
          }
          if (warningFound) {
            break;
          }
        }
      }

      if (parsedConfig?.points && options?.pointsonly) {
        inputConfig = {
          ...parsedConfig,
          pcbs: undefined,
          cases: undefined,
        };
      }

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
        if (!e) return;

        if (typeof e === 'string') {
          setError(e);
        }
        if (typeof e === 'object' && e !== null) {
          setError(e.toString());
        }
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
      if (setConfigInputProp) {
        setConfigInputProp(newVal);
      }

      if (isPreviewRef.current) {
        if (newVal !== previewConfigRef.current) {
          const nextSharedNum = getNextIndexForPattern(
            configsRef.current,
            /^Shared\s+(\d+)$/
          );
          const name = `Shared ${nextSharedNum}`;
          const newId = generateUUID();
          const newConfig: SavedConfig = {
            id: newId,
            name,
            config: newVal || '',
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
            c.id === currentActiveId ? { ...c, config: newVal || '' } : c
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
          const newConfig: SavedConfig = {
            id: newId,
            name,
            config: newVal || '',
          };
          const updatedConfigs = [...configsRef.current, newConfig];
          setConfigs(updatedConfigs);
          setActiveConfigId(newId);
          saveMultiConfigToStorage(updatedConfigs, newId);
        }
      }
    },
    [setConfigInputProp]
  );

  const selectConfig = useCallback((id: string) => {
    const found = configsRef.current.find((c) => c.id === id);
    if (found) {
      setActiveConfigId(id);
      setIsPreview(false);
      setPreviewConfig(null);
      setConfigInputState(found.config);
      saveMultiConfigToStorage(configsRef.current, id);
    }
  }, []);

  const createNewConfig = useCallback((content: string, name?: string) => {
    const nextUntitledNum = getNextIndexForPattern(
      configsRef.current,
      /^Untitled\s+(\d+)$/
    );
    const configName = name || `Untitled ${nextUntitledNum}`;
    const newId = generateUUID();
    const newConfig: SavedConfig = {
      id: newId,
      name: configName,
      config: content,
    };
    const updatedConfigs = [...configsRef.current, newConfig];
    setConfigs(updatedConfigs);
    setActiveConfigId(newId);
    setIsPreview(false);
    setPreviewConfig(null);
    setConfigInputState(content);
    saveMultiConfigToStorage(updatedConfigs, newId);
    return newId;
  }, []);

  const renameConfig = useCallback((id: string, newName: string) => {
    const updatedConfigs = configsRef.current.map((c) =>
      c.id === id ? { ...c, name: newName } : c
    );
    setConfigs(updatedConfigs);
    saveMultiConfigToStorage(updatedConfigs, activeConfigIdRef.current);
  }, []);

  const duplicateConfig = useCallback((id: string) => {
    const found = configsRef.current.find((c) => c.id === id);
    if (found) {
      const newId = generateUUID();
      const newConfig: SavedConfig = {
        id: newId,
        name: `${found.name} (Copy)`,
        config: found.config,
      };
      const updatedConfigs = [...configsRef.current, newConfig];
      setConfigs(updatedConfigs);
      setActiveConfigId(newId);
      setIsPreview(false);
      setPreviewConfig(null);
      setConfigInputState(found.config);
      saveMultiConfigToStorage(updatedConfigs, newId);
    }
  }, []);

  const deleteConfig = useCallback((id: string) => {
    const currentActiveId = activeConfigIdRef.current;
    const remainingConfigs = configsRef.current.filter((c) => c.id !== id);
    setConfigs(remainingConfigs);

    const isDeletingActive = currentActiveId === id;
    const isLastConfig = configsRef.current.length <= 1;

    if (isLastConfig || isDeletingActive) {
      setActiveConfigId(null);
      setConfigInputState('');
      saveMultiConfigToStorage(remainingConfigs, null);
    } else {
      saveMultiConfigToStorage(remainingConfigs, currentActiveId);
    }
  }, []);

  const loadPreview = useCallback((config: string) => {
    setIsPreview(true);
    setPreviewConfig(config);
    setConfigInputState(config);
  }, []);

  const handleExportAllConfigs = useCallback(async () => {
    await exportAllConfigs(
      configsRef.current,
      injectionInput,
      debug,
      stlPreview
    );
  }, [injectionInput, debug, stlPreview]);

  const activeConfigName = useMemo(() => {
    if (isPreview) {
      return 'Shared Preview';
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
        console.log('Ergogen worker terminated.');
      }

      console.log('Initializing fresh Ergogen worker...');
      ergogenWorkerRef.current = createErgogenWorker();
      if (ergogenWorkerRef.current) {
        ergogenWorkerRef.current.onmessage = handleErgogenWorkerMessage;
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

  const experiment = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('exp');
  }, []);

  const contextValue = useMemo(
    () => ({
      configInput: configInputState,
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
      loadPreview,
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
      experiment,
      isGenerating,
      setIsGenerating,
      isJscadConverting,
    }),
    [
      configInputState,
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
      loadPreview,
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
      experiment,
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
