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
import { fetchConfigFromUrl } from '../utils/github';
import {
  createErgogenWorker,
  createJscadWorker,
} from '../workers/workerFactory';
import type { WorkerResponse } from '../workers/ergogen.worker.types';
import type { JscadWorkerResponse } from '../workers/jscad.worker.types';

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
 * @typedef {object} Props
 * @property {string | undefined} configInput - The current YAML/JSON configuration string.
 * @property {Dispatch<SetStateAction<string | undefined>>} setConfigInput - Function to update the config input.
 * @property {string[][]} [initialInjectionInput] - The initial array of code injections.
 * @property {React.ReactNode[] | React.ReactNode} children - The child components to be wrapped by the provider.
 */
type Props = {
  configInput: string | undefined;
  setConfigInput: Dispatch<SetStateAction<string | undefined>>;
  initialInjectionInput?: string[][];
  children: React.ReactNode[] | React.ReactNode;
};

/**
 * Defines the shape of the data and functions provided by the ConfigContext.
 * @typedef {object} ContextProps
 * @property {string | undefined} configInput - The current YAML/JSON configuration string.
 * @property {Dispatch<SetStateAction<string | undefined>>} setConfigInput - Function to update the config input.
 * @property {string[][] | undefined} injectionInput - The current array of code injections.
 * @property {Dispatch<SetStateAction<string[][] | undefined>>} setInjectionInput - Function to update the injections.
 * @property {DebouncedFunc<...>} processInput - Debounced function to process the configuration.
 * @property {(textInput: string | undefined, injectionInput: string[][] | undefined, options?: ProcessOptions) => Promise<void>} generateNow - Immediate function to process the configuration.
 * @property {string | null} error - Any error message from the Ergogen process.
 * @property {Dispatch<SetStateAction<string | null>>} setError - Function to set an error message.
 * @property {() => void} clearError - Function to clear the current error message.
 * @property {string | null} deprecationWarning - Any deprecation warnings from the process.
 * @property {() => void} clearWarning - Function to clear the current deprecation warning.
 * @property {Results | null} results - The results from the Ergogen process.
 * @property {number} resultsVersion - A version number that increments with each new result.
 * @property {Dispatch<SetStateAction<number>>} setResultsVersion - Function to update the results version.
 * @property {boolean} showSettings - Flag to control the visibility of the settings panel.
 * @property {Dispatch<SetStateAction<boolean>>} setShowSettings - Function to toggle the settings panel.
 * @property {boolean} showConfig - Flag to control the visibility of the configuration editor.
 * @property {Dispatch<SetStateAction<boolean>>} setShowConfig - Function to toggle the config editor.
 * @property {boolean} showDownloads - Flag to control the visibility of the downloads panel.
 * @property {Dispatch<SetStateAction<boolean>>} setShowDownloads - Function to toggle the downloads panel.
 * @property {boolean} debug - Flag to enable debug mode.
 * @property {Dispatch<SetStateAction<boolean>>} setDebug - Function to set debug mode.
 * @property {boolean} autoGen - Flag to enable automatic regeneration of previews.
 * @property {Dispatch<SetStateAction<boolean>>} setAutoGen - Function to toggle auto-generation.
 * @property {boolean} autoGen3D - Flag to enable automatic regeneration of 3D previews.
 * @property {Dispatch<SetStateAction<boolean>>} setAutoGen3D - Function to toggle 3D auto-generation.
 * @property {boolean} kicanvasPreview - Flag to enable the KiCanvas preview for PCBs.
 * @property {Dispatch<SetStateAction<boolean>>} setKicanvasPreview - Function to toggle the KiCanvas preview.
 * @property {boolean} stlPreview - Flag to enable the STL 3D preview and conversion.
 * @property {Dispatch<SetStateAction<boolean>>} setStlPreview - Function to toggle the STL preview.
 * @property {string | null} experiment - The value of any 'exp' query parameter.
 */
type ContextProps = {
  configInput: string | undefined;
  setConfigInput: Dispatch<SetStateAction<string | undefined>>;
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
};

/**
 * Options for the `processInput` function.
 * @typedef {object} ProcessOptions
 * @property {boolean} pointsonly - If true, only the points will be processed, skipping PCBs and cases.
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
  setConfigInput,
  initialInjectionInput,
  children,
}: Props) => {
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
    localStorageOrDefault('ergogen:config:stlPreview', false)
  );
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(true);
  const [showDownloads, setShowDownloads] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Worker refs to hold the worker instances
  const workerRef = useRef<Worker | null>(null);
  const jscadWorkerRef = useRef<Worker | null>(null);

  // Config version tracking to prevent race conditions
  const configVersionRef = useRef<number>(0);

  // Queue for pending JSCAD to STL conversions
  const pendingConversionsRef = useRef<
    Array<{ caseName: string; jscadScript: string }>
  >([]);

  // Track if a conversion is currently in progress
  const isConvertingRef = useRef<boolean>(false);

  useEffect(() => {
    console.log('--- ConfigContextProvider mounted ---');
    return () => {
      console.log('--- ConfigContextProvider unmounted ---');
    };
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const clearWarning = useCallback(() => setDeprecationWarning(null), []);

  /**
   * Processes the next pending JSCAD to STL conversion from the queue.
   * This ensures sequential processing to avoid race conditions.
   */
  const processNextConversion = useCallback(() => {
    // If already converting or no pending conversions, return
    if (isConvertingRef.current || pendingConversionsRef.current.length === 0) {
      return;
    }

    const conversion = pendingConversionsRef.current.shift();
    if (!conversion || !jscadWorkerRef.current) {
      return;
    }

    isConvertingRef.current = true;
    const currentVersion = configVersionRef.current;

    console.log(
      `>>> Sending JSCAD conversion request for case: ${conversion.caseName}, version: ${currentVersion}`
    );

    jscadWorkerRef.current.postMessage({
      type: 'convert',
      jscadScript: conversion.jscadScript,
      caseName: conversion.caseName,
      requestId: `jscad-convert-${conversion.caseName}-${currentVersion}-${Date.now()}`,
      configVersion: currentVersion,
    });
  }, []);

  /**
   * Handler for messages received from the JSCAD worker.
   * Processes success and error responses from the worker.
   */
  const handleJscadWorkerMessage = useCallback(
    (event: MessageEvent<JscadWorkerResponse>) => {
      const response = event.data;
      console.log(
        `<<< Received message from JSCAD worker: ${response.type}, case: ${response.caseName}`
      );

      isConvertingRef.current = false;

      // Check if this response is for the current config version
      if (response.configVersion !== configVersionRef.current) {
        console.log(
          `--- Ignoring JSCAD response for old config version ${response.configVersion} (current: ${configVersionRef.current})`
        );
        // Process next conversion even though we're discarding this one
        processNextConversion();
        return;
      }

      if (response.type === 'error') {
        console.error(
          `--- JSCAD worker error for case ${response.caseName}:`,
          response.error
        );
        // Continue with next conversion even if this one failed
        processNextConversion();
        return;
      }

      if (response.type === 'success') {
        console.log(
          `--- JSCAD worker success for case ${response.caseName}, STL ${response.stl ? 'generated' : 'is null'}`
        );

        // Update results with the new STL for this specific case
        setResults((prevResults) => {
          if (!prevResults?.cases) return prevResults;

          return {
            ...prevResults,
            cases: {
              ...prevResults.cases,
              [response.caseName]: {
                ...prevResults.cases[response.caseName],
                stl: response.stl ?? undefined,
              },
            },
          };
        });

        // Increment version to trigger re-render
        setResultsVersion((v) => v + 1);

        // Process next conversion in the queue
        processNextConversion();
      }
    },
    [processNextConversion]
  );

  /**
   * Handler for messages received from the Ergogen worker.
   * Processes success, error, and warning responses from the worker.
   */
  const handleWorkerMessage = (event: MessageEvent<WorkerResponse>) => {
    const response = event.data;
    console.log('<<< Received message from worker:', response.type);

    if (response.type === 'error') {
      // Handle error response
      console.error('--- Worker error:', response.error);
      setError(response.error);
    } else if (response.type === 'success') {
      // Handle success response
      console.log('--- Worker success, processing results and warnings...');

      // Check for warnings and display them
      if (response.warnings && response.warnings.length > 0) {
        console.log(
          `--- Worker returned ${response.warnings.length} warning(s)`
        );
        // Combine with any existing deprecation warnings
        const existingWarning = deprecationWarning;
        if (existingWarning) {
          setDeprecationWarning(
            `${existingWarning}\n${response.warnings.join('\n')}`
          );
        } else {
          setDeprecationWarning(response.warnings.join('\n'));
        }
      }

      // Process and set the Ergogen results
      if (response.results) {
        console.log('Setting Ergogen results from worker');

        // Increment config version for new results
        configVersionRef.current += 1;
        const currentVersion = configVersionRef.current;
        console.log(`--- New config version: ${currentVersion}`);

        // Clear any pending conversions from previous config versions
        pendingConversionsRef.current = [];
        isConvertingRef.current = false;

        // Add pending STL placeholders to the results if STL preview is enabled
        if (stlPreview && (response.results as Results).cases) {
          const casesWithStl: Record<string, CaseOutput> = {};
          for (const [name, caseObj] of Object.entries(
            (response.results as Results).cases as Record<string, CaseOutput>
          )) {
            casesWithStl[name] = {
              ...caseObj,
              stl: undefined, // Mark as pending
            };
          }
          (response.results as Results).cases = casesWithStl;

          // Queue JSCAD to STL conversions
          for (const [caseName, caseObj] of Object.entries(casesWithStl)) {
            if (caseObj.jscad) {
              console.log(`--- Queuing JSCAD conversion for case: ${caseName}`);
              pendingConversionsRef.current.push({
                caseName,
                jscadScript: caseObj.jscad,
              });
            }
          }
        }

        setResults(response.results as Results);
        setResultsVersion((v) => v + 1);

        // Start processing conversions
        if (stlPreview && pendingConversionsRef.current.length > 0) {
          console.log(
            `--- Starting JSCAD conversion queue (${pendingConversionsRef.current.length} items)`
          );
          processNextConversion();
        }
      }

      // Stop loading state
      setIsGenerating(false);
    }
  };

  /**
   * Effect to initialize the workers early in the component lifecycle.
   * This prevents race conditions by ensuring the workers are ready before any generation requests.
   */
  useEffect(() => {
    // Initialize Ergogen worker if not already created
    if (!workerRef.current) {
      console.log('Initializing Ergogen worker...');
      workerRef.current = createErgogenWorker();

      if (workerRef.current) {
        workerRef.current.onmessage = handleWorkerMessage;
        console.log('Ergogen worker initialized successfully');
      } else {
        console.warn('Failed to initialize Ergogen worker');
      }
    }

    // Initialize JSCAD worker if not already created
    if (!jscadWorkerRef.current) {
      console.log('Initializing JSCAD worker...');
      jscadWorkerRef.current = createJscadWorker();

      if (jscadWorkerRef.current) {
        jscadWorkerRef.current.onmessage = handleJscadWorkerMessage;
        console.log('JSCAD worker initialized successfully');
      } else {
        console.warn('Failed to initialize JSCAD worker');
      }
    }

    // Cleanup function to terminate the workers when component unmounts
    return () => {
      if (workerRef.current) {
        console.log('Terminating Ergogen worker...');
        workerRef.current.terminate();
        workerRef.current = null;
        console.log('Ergogen worker terminated');
      }
      if (jscadWorkerRef.current) {
        console.log('Terminating JSCAD worker...');
        jscadWorkerRef.current.terminate();
        jscadWorkerRef.current = null;
        console.log('JSCAD worker terminated');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleJscadWorkerMessage]); // handleWorkerMessage is defined inline and doesn't need to be a dependency

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
   * Parses a string as either JSON or YAML.
   * @param {string} inputString - The string to parse.
   * @returns {[string, object | null]} A tuple containing the detected type ('json', 'yaml', or 'UNKNOWN') and the parsed object, or null if parsing fails.
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

      // Check for deprecated KiCad 5 footprints in the config and warn the user
      if (parsedConfig && parsedConfig.pcbs) {
        const pcbs = Object.values(parsedConfig.pcbs) as Record<
          string,
          unknown
        >[];
        let warningFound = false;
        for (const pcb of pcbs) {
          if (!pcb.template || pcb.template === 'kicad5') {
            if (pcb.footprints) {
              const footprints = Object.values(
                pcb.footprints as Record<string, unknown>
              ) as Record<string, unknown>[];
              for (const footprint of footprints) {
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

      // When running this as part of onChange we remove `pcbs` and `cases` properties to generate
      // a simplified preview.
      // If there is no 'points' key we send the input to Ergogen as-is, it could be KLE or invalid.
      if (parsedConfig?.points && options?.pointsonly) {
        inputConfig = {
          ...parsedConfig,
          pcbs: undefined,
          cases: undefined,
        };
      }

      try {
        // Handle code injections if provided
        if (inputInjection !== undefined && Array.isArray(inputInjection)) {
          for (let i = 0; i < inputInjection.length; i++) {
            const injection = inputInjection[i];
            if (Array.isArray(injection) && injection.length === 3) {
              const inj_type = injection[0];
              const inj_name = injection[1];
              const inj_text = injection[2];
              const module_prefix = 'const module = {};\n\n';
              const module_suffix = '\n\nreturn module.exports;';
              const inj_value = new Function(
                'require',
                module_prefix + inj_text + module_suffix
              )();
              window.ergogen.inject(inj_type, inj_name, inj_value);
            }
          }
        }

        // Run the Ergogen process
        if (workerRef.current) {
          console.log('>>> Sending Ergogen process requestt...');
          workerRef.current.postMessage({
            type: 'generate',
            inputConfig,
            injectionInput: inputInjection,
            requestId: `ergogen-generate-${resultsVersion}-${Date.now()}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      parseConfig,
      setError,
      setDeprecationWarning,
      setIsGenerating,
      stlPreview,
      processNextConversion,
      resultsVersion,
    ]
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

  /**
   * Effect to process the input configuration on the initial load.
   */
  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const githubUrl = queryParameters.get('github');
    if (githubUrl) {
      fetchConfigFromUrl(githubUrl)
        .then((data) => {
          setConfigInput(data);
          generateNow(data, injectionInput, { pointsonly: false });
        })
        .catch((e) => {
          setError(`Failed to fetch config from GitHub: ${e.message}`);
        });
    } else if (configInput) {
      generateNow(configInput, injectionInput, { pointsonly: false });
    }
    // eslint-disable-next-line
  }, []);

  /**
   * Effect to process the input configuration whenever it or the auto-generation settings change.
   * Also persists the injection input to local storage.
   */
  useEffect(() => {
    localStorage.setItem('ergogen:injection', JSON.stringify(injectionInput));
    if (autoGen) {
      processInput(configInput, injectionInput, { pointsonly: !autoGen3D });
    }
  }, [configInput, injectionInput, autoGen, autoGen3D, processInput]);

  const experiment = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('exp');
  }, []);

  const contextValue = useMemo(
    () => ({
      configInput,
      setConfigInput,
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
    }),
    [
      configInput,
      setConfigInput,
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
    ]
  );

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContextProvider;

/**
 * A custom hook to easily consume the ConfigContext.
 * @returns {ContextProps | null} The context value, or null if used outside a provider.
 */
export const useConfigContext = () => useContext(ConfigContext);
