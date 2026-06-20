import JSZip from "jszip";
import { saveAs } from "file-saver";
import { createZipFolder } from "../utils/zip";
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
import { v4 as uuidv4 } from 'uuid';
import {
  createErgogenWorker,
  createJscadWorker,
} from '../workers/workerFactory';
import { trackEvent } from '../utils/analytics';
import ConflictResolutionDialog from '../molecules/ConflictResolutionDialog';
import { useInjectionConflictResolution } from '../hooks/useInjectionConflictResolution';
import { useConfigLoader } from '../hooks/useConfigLoader';
import { MultiConfigStorage, Configuration } from './types';
import { MULTI_CONFIG_STORAGE_KEY, MULTI_CONFIG_VERSION } from './constants';
import { getNextDefaultName } from '../utils/naming';
import type { WorkerResponse as ErgogenWorkerResponse } from '../workers/ergogen.worker.types';
import type {
  JscadWorkerResponse,
} from '../workers/jscad.worker.types';

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

type ContextProps = {
  configInput: string | undefined;
  setConfigInput: (content: string) => void;
  configs: Configuration[];
  activeConfigId: string | null;
  addConfig: (name: string, content: string) => string;
  deleteConfig: (id: string) => void;
  renameConfig: (id: string, name: string) => void;
  duplicateConfig: (id: string) => void;
  switchConfig: (id: string) => void;
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
  exportAll: () => Promise<void>;
  isExporting: boolean;
  saveActiveConfig: () => void;
  setTempConfig: (content: string) => void;
};

type ProcessOptions = {
  pointsonly?: boolean;
};

const ConfigContext = createContext<ContextProps | null>(null);

type Props = {
  initialMultiConfig?: MultiConfigStorage | null;
  initialInjectionInput?: string[][];
  hashError?: string | null;
  children: React.ReactNode[] | React.ReactNode;
};

const ConfigContextProvider = ({
  initialMultiConfig,
  initialInjectionInput,
  hashError,
  children,
}: Props) => {
  const [multiConfig, setMultiConfig] = useLocalStorage<MultiConfigStorage>(
    MULTI_CONFIG_STORAGE_KEY,
    initialMultiConfig || {
      version: MULTI_CONFIG_VERSION,
      configs: [],
      activeConfigId: '',
    }
  );

  const [tempConfig, _setTempConfig] = useState<string | null>(null);

  const configs = useMemo(() => multiConfig?.configs || [], [multiConfig]);
  const activeConfigId = multiConfig?.activeConfigId || null;

  const activeConfig = useMemo(() => {
    if (tempConfig !== null) return { id: 'temp', name: 'Shared', content: tempConfig };
    return configs.find((c) => c.id === activeConfigId) || null;
  }, [configs, activeConfigId, tempConfig]);

  const configInput = activeConfig?.content || '';

  const setTempConfig = useCallback((content: string) => {
    _setTempConfig(content);
    setMultiConfig(prev => prev ? { ...prev, activeConfigId: '' } : prev);
  }, [setMultiConfig]);

  const addConfig = useCallback(
    (name: string, content: string) => {
      const id = uuidv4();
      setMultiConfig((prev) => {
        const newConfigs = [...(prev?.configs || []), { id, name, content }];
        return { version: MULTI_CONFIG_VERSION, configs: newConfigs, activeConfigId: id };
      });
      _setTempConfig(null);
      isPromotingRef.current = false;
      return id;
    },
    [setMultiConfig]
  );

  const setConfigInput = useCallback(
    (content: string) => {
      if (tempConfig !== null) {
        if (isPromotingRef.current) return;
        isPromotingRef.current = true;
        const name = getNextDefaultName('Shared', configs.map(c => c.name));
        addConfig(name, content);
        return;
      }
      if (!activeConfigId) return;
      setMultiConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          configs: prev.configs.map((c) =>
            c.id === activeConfigId ? { ...c, content } : c
          ),
        };
      });
    },
    [activeConfigId, tempConfig, configs, addConfig, setMultiConfig]
  );

  const switchConfig = useCallback(
    (id: string) => {
      _setTempConfig(null);
      isPromotingRef.current = false;
      isPromotingRef.current = false;
      setMultiConfig((prev) => (prev ? { ...prev, activeConfigId: id } : prev));
    },
    [setMultiConfig]
  );

  const deleteConfig = useCallback(
    (id: string) => {
      setMultiConfig((prev) => {
        if (!prev) return prev;
        const newConfigs = prev.configs.filter((c) => c.id !== id);
        let newActiveId = prev.activeConfigId;
        if (newActiveId === id) {
          newActiveId = newConfigs.length > 0 ? newConfigs[0].id : '';
        }
        return { ...prev, configs: newConfigs, activeConfigId: newActiveId };
      });
    },
    [setMultiConfig]
  );

  const renameConfig = useCallback(
    (id: string, name: string) => {
      setMultiConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          configs: prev.configs.map((c) => (c.id === id ? { ...c, name } : c)),
        };
      });
    },
    [setMultiConfig]
  );

  const duplicateConfig = useCallback(
    (id: string) => {
      const configToDup = configs.find((c) => c.id === id);
      if (!configToDup) return;
      const newId = uuidv4();
      setMultiConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          configs: [...prev.configs, { ...configToDup, id: newId, name: `${configToDup.name} (Copy)` }],
          activeConfigId: newId,
        };
      });
    },
    [configs, setMultiConfig]
  );

  const [injectionInput, setInjectionInput] = useLocalStorage<string[][]>('ergogen:injection', initialInjectionInput || []);
  const [error, setError] = useState<string | null>(hashError || null);
  const clearError = useCallback(() => setError(null), []);
  const [deprecationWarning, setDeprecationWarning] = useState<string | null>(null);
  const clearWarning = useCallback(() => setDeprecationWarning(null), []);
  const [results, setResults] = useState<Results | null>(null);
  const [resultsVersion, setResultsVersion] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showSideNav, setShowSideNav] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [showDownloads, setShowDownloads] = useState(false);

  const [debugRaw, setDebug] = useLocalStorage<boolean>('ergogen:debug', false);
  const debug = !!debugRaw;
  const [autoGenRaw, setAutoGen] = useLocalStorage<boolean>('ergogen:autogen', true);
  const autoGen = !!autoGenRaw;
  const [autoGen3DRaw, setAutoGen3D] = useLocalStorage<boolean>('ergogen:autogen3d', false);
  const autoGen3D = !!autoGen3DRaw;
  const [kicanvasPreviewRaw, setKicanvasPreview] = useLocalStorage<boolean>('ergogen:kicanvas', true);
  const kicanvasPreview = !!kicanvasPreviewRaw;
  const [stlPreviewRaw, setStlPreview] = useLocalStorage<boolean>('ergogen:stl', true);
  const stlPreview = !!stlPreviewRaw;

    const [isExporting, setIsExporting] = useState(false);

  const saveActiveConfig = useCallback(() => {
    if (tempConfig !== null) {
      const name = getNextDefaultName('Shared', configs.map(c => c.name));
      addConfig(name, tempConfig);
    }
  }, [tempConfig, configs, addConfig]);

    const parseConfig = useCallback((inputString: string): [string, any] => {
    let type = 'UNKNOWN', parsed = null;
    try { parsed = JSON.parse(inputString); type = 'json'; } catch (_e) {}
    try { parsed = yaml.load(inputString); type = 'yaml'; } catch (_e) {}
    return [type, parsed];
  }, []);

const exportAll = useCallback(async () => {
    if (configs.length === 0 && tempConfig === null) return;
    setIsExporting(true);
    const mainZip = new JSZip();

    const exportOne = async (name: string, content: string, zip: JSZip) => {
      const folder = zip.folder(name);
      if (!folder) return;

      return new Promise<void>((resolve) => {
        const requestId = `export-${uuidv4()}`;
        const timeout = setTimeout(() => {
          folder.file('config.yaml', content);
          folder.file('ERROR.txt', 'Export timed out or failed to generate outputs');
          resolve();
        }, 10000);

        const handler = async (e: MessageEvent<ErgogenWorkerResponse>) => {
          const data = e.data;
          if (data.requestId === requestId) {
            clearTimeout(timeout);
            ergogenWorkerRef.current?.removeEventListener('message', handler);
            if (data.type === 'success') {
              await createZipFolder(folder, data.results as Results, content, injectionInput, debug, stlPreview);
            } else {
              folder.file('config.yaml', content);
              folder.file('ERROR.txt', data.error || 'Unknown error');
            }
            resolve();
          }
        };

        ergogenWorkerRef.current?.addEventListener('message', handler);
        const [, parsed] = parseConfig(content);
        let inputConfig: any = content;
        if (parsed?.points) {
           // We don't want pointsonly for export
        }
        ergogenWorkerRef.current?.postMessage({
          type: 'generate',
          inputConfig,
          injectionInput,
          requestId,
          options: { debug, svg: true },
        });
      });
    };

    for (const config of configs) {
      await exportOne(config.name, config.content, mainZip);
    }
    if (tempConfig !== null) {
      await exportOne('Shared (Unsaved)', tempConfig, mainZip);
    }

    const blob = await mainZip.generateAsync({ type: 'blob' });
    saveAs(blob, `ergogen-all-configs-${new Date().toISOString().split('T')[0]}.zip`);
    setIsExporting(false);
  }, [configs, tempConfig, injectionInput, debug, stlPreview, parseConfig]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isJscadConverting, setIsJscadConverting] = useState(false);

  const ergogenWorkerRef = useRef<Worker | null>(null);
  const jscadWorkerRef = useRef<Worker | null>(null);
  const currentConfigVersion = useRef(0);
  const isInitialMountRef = useRef(true);
  const isPromotingRef = useRef(false);

  useEffect(() => {
    ergogenWorkerRef.current = createErgogenWorker();
    jscadWorkerRef.current = createJscadWorker();

    const handleErgogenMessage = (e: MessageEvent<ErgogenWorkerResponse>) => {
      const data = e.data;
      if (data.type === 'success') {
        const requestId = data.requestId;
        const requestVersion = parseInt(requestId?.split('-')[2] || '0');
        if (requestVersion >= currentConfigVersion.current) {
          setResults(data.results as Results);
          setResultsVersion((v) => v + 1);
          setIsGenerating(false);
        }
      } else if (data.type === 'error') {
        setError(data.error || 'Unknown Ergogen error');
        setIsGenerating(false);
      }
    };

    const handleJscadMessage = (e: MessageEvent<JscadWorkerResponse>) => {
      const data = e.data;
      if (data.type === 'success' && data.results) {
        if (data.configVersion >= currentConfigVersion.current) {
          setResults(data.results as Results);
          setIsJscadConverting(false);
        }
      }
    };

    ergogenWorkerRef.current?.addEventListener('message', handleErgogenMessage);
    jscadWorkerRef.current?.addEventListener('message', handleJscadMessage);
    return () => {
      ergogenWorkerRef.current?.terminate();
      jscadWorkerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (stlPreview && results?.cases && !isGenerating && !isJscadConverting) {
      if (Object.values(results.cases).some(c => c.jscad && !c.stl)) {
        setIsJscadConverting(true);
        jscadWorkerRef.current?.postMessage({
          type: 'batch_jscad_to_stl',
          results,
          configVersion: currentConfigVersion.current,
        });
      }
    }
  }, [results, stlPreview, isGenerating, isJscadConverting]);

  useEffect(() => {
    if (isInitialMountRef.current) {
      trackEvent('settings_loaded', { debug, autoGen, autoGen3D, kicanvasPreview, stlPreview });
      isInitialMountRef.current = false;
    } else {
      trackEvent('setting_changed', { debug, autoGen, autoGen3D, kicanvasPreview, stlPreview });
    }
  }, [debug, autoGen, autoGen3D, kicanvasPreview, stlPreview]);



  const runGeneration = useCallback(
    async (textInput: string | undefined, injectionInput: string[][] | undefined, options: ProcessOptions = { pointsonly: true }) => {
      if (!textInput) return;
      let inputConfig: any = textInput;
      const [, parsedConfig] = parseConfig(textInput);
      setError(null); setDeprecationWarning(null); setIsGenerating(true);
      currentConfigVersion.current += 1;
      if (parsedConfig?.points && options?.pointsonly) {
        inputConfig = { ...parsedConfig, pcbs: undefined, cases: undefined };
      }
      ergogenWorkerRef.current?.postMessage({
        type: 'generate',
        inputConfig,
        injectionInput,
        requestId: `ergogen-generate-${currentConfigVersion.current}-${Date.now()}`,
        options: { debug, svg: true },
      });
    },
    [parseConfig, debug]
  );

  const processInput = useMemo(() => debounce(runGeneration, 300), [runGeneration]);

  const generateNow = useCallback(
    async (textInput: string | undefined, injectionInput: string[][] | undefined, options: ProcessOptions = { pointsonly: true }) => {
      processInput.cancel();
      await runGeneration(textInput, injectionInput, options);
    },
    [processInput, runGeneration]
  );

  const {
    currentConflict,
    processInjectionsWithConflictResolution,
    handleConflictResolution,
    handleConflictCancel,
  } = useInjectionConflictResolution({
    setInjectionInput, setConfigInput, generateNow,
    getCurrentInjections: () => injectionInput || [],
    setError,
  });

  const { isLoading: isConfigLoading } = useConfigLoader({ processInjectionsWithConflictResolution, setError });

  useEffect(() => {
    if (!hashError && !isConfigLoading && configInput) {
      generateNow(configInput, injectionInput, { pointsonly: false });
    }
  }, [isConfigLoading]);

  useEffect(() => {
    localStorage.setItem('ergogen:injection', JSON.stringify(injectionInput));
    if (autoGen && configInput) {
      processInput(configInput, injectionInput, { pointsonly: !autoGen3D });
    }
  }, [configInput, injectionInput, autoGen, autoGen3D, processInput]);

    const contextValue = useMemo(() => ({
    configInput, setConfigInput, configs, activeConfigId, addConfig, deleteConfig, renameConfig, duplicateConfig, switchConfig,
    injectionInput, setInjectionInput, processInput, generateNow, error, setError, clearError, deprecationWarning, clearWarning,
    results, resultsVersion, setResultsVersion, showSettings, setShowSettings, showSideNav, setShowSideNav, showConfig, setShowConfig,
    showDownloads, setShowDownloads,
    debug, setDebug: (val: any) => setDebug(val),
    autoGen, setAutoGen: (val: any) => setAutoGen(val),
    autoGen3D, setAutoGen3D: (val: any) => setAutoGen3D(val),
    kicanvasPreview, setKicanvasPreview: (val: any) => setKicanvasPreview(val),
    stlPreview, setStlPreview: (val: any) => setStlPreview(val),
    isGenerating, setIsGenerating, isJscadConverting, exportAll, isExporting, saveActiveConfig, setTempConfig,
    experiment: new URLSearchParams(window.location.search).get('exp')
  }), [
    configInput, setConfigInput, configs, activeConfigId, addConfig, deleteConfig, renameConfig, duplicateConfig, switchConfig,
    injectionInput, setInjectionInput, processInput, generateNow, error, setError, clearError, deprecationWarning, clearWarning,
    results, resultsVersion, setResultsVersion, showSettings, setShowSettings, showSideNav, setShowSideNav, showConfig, setShowConfig,
    showDownloads, setShowDownloads, debug, setDebug, autoGen, setAutoGen, autoGen3D, setAutoGen3D, kicanvasPreview, setKicanvasPreview,
    stlPreview, setStlPreview, isGenerating, setIsGenerating, isJscadConverting, exportAll, isExporting, saveActiveConfig, setTempConfig
  ]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveActiveConfig();
      }
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'n') {
        e.preventDefault();
        window.location.href = '/new';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveActiveConfig]);

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
      {currentConflict && (
        <ConflictResolutionDialog
          injectionName={currentConflict.name}
          injectionType={currentConflict.type}
          onResolve={handleConflictResolution}
          onCancel={handleConflictCancel}
        />
      )}
    </ConfigContext.Provider>
  );
};

export { ConfigContextProvider };
export const useConfigContext = () => useContext(ConfigContext);
