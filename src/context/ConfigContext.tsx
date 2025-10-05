import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { DebouncedFunc } from 'lodash-es';
import yaml from 'js-yaml';
import debounce from 'lodash.debounce';
import { useLocalStorage } from 'react-use';
import { fetchConfigFromUrl } from '../utils/github';

// Strongly-typed shape for Ergogen settings
export type Settings = {
  debug: boolean;
  autoGen: boolean;
  autoGen3D: boolean;
  kicanvasPreview: boolean;
  jscadPreview: boolean;
};

// Strongly-typed shape for Ergogen results used in the UI
export type DemoOutput = {
  dxf?: string;
  svg?: string;
};
export type OutlineOutput = {
  dxf?: string;
  svg?: string;
};
export type CaseOutput = {
  jscad?: string;
};
export type PcbsOutput = Record<string, string>;

// Backward-compatible results type with known top-level keys and an index signature
export type Results = {
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
 * @property {boolean} jscadPreview - Flag to enable the JSCAD 3D preview.
 * @property {Dispatch<SetStateAction<boolean>>} setJscadPreview - Function to toggle the JSCAD preview.
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
  settings: Settings | undefined;
  setSettings: Dispatch<SetStateAction<Settings | undefined>>;
  experiment: string | null;
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
export const ConfigContext = createContext<ContextProps | null>(null);

/**
 * The key used to store the main configuration in local storage.
 */
export const CONFIG_LOCAL_STORAGE_KEY = 'LOCAL_STORAGE_CONFIG';

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
  const [settings, setSettings] = useLocalStorage<Settings>('ergogen:settings', {
    debug: localStorageOrDefault('ergogen:config:debug', false),
    autoGen: localStorageOrDefault('ergogen:config:autoGen', true),
    autoGen3D: localStorageOrDefault('ergogen:config:autoGen3D', true),
    kicanvasPreview: localStorageOrDefault(
      'ergogen:config:kicanvasPreview',
      true
    ),
    jscadPreview: localStorageOrDefault('ergogen:config:jscadPreview', false),
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(true);
  const [showDownloads, setShowDownloads] = useState<boolean>(true);

  const clearError = useCallback(() => setError(null), []);
  const clearWarning = useCallback(() => setDeprecationWarning(null), []);

  /**
   * Parses a string as either JSON or YAML.
   * @param {string} inputString - The string to parse.
   * @returns {[string, object | null]} A tuple containing the detected type ('json', 'yaml', or 'UNKNOWN') and the parsed object, or null if parsing fails.
   */
  const parseConfig = (
    inputString: string
  ): [string, { [key: string]: unknown[] } | null] => {
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
  };

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
      let results = null;
      let inputConfig: string | object = textInput ?? '';
      const inputInjection: string[][] | undefined = injectionInput;
      const [, parsedConfig] = parseConfig(textInput ?? '');

      setError(null);
      setDeprecationWarning(null);

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
        results = await window.ergogen.process(
          inputConfig,
          true, // Set debug to true or no SVGs are generated
          (m: string) => console.log(m) // logger
        );
      } catch (e: unknown) {
        if (!e) return;

        if (typeof e === 'string') {
          setError(e);
        }
        if (typeof e === 'object' && e !== null) {
          setError(e.toString());
        }
        return;
      }

      setResults(results as Results);
      setResultsVersion((v) => v + 1);
    },
    []
  );

  /**
   * A debounced version of runGeneration for auto-generation.
   */
  const processInput = useCallback(debounce(runGeneration, 300), [
    runGeneration,
  ]);

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
  }, []);

  /**
   * Effect to process the input configuration whenever it or the auto-generation settings change.
   * Also persists the injection input to local storage.
   */
  useEffect(() => {
    localStorage.setItem('ergogen:injection', JSON.stringify(injectionInput));
    if (settings?.autoGen) {
      processInput(configInput, injectionInput, {
        pointsonly: !settings?.autoGen3D,
      });
    }
  }, [configInput, injectionInput, settings, processInput]);

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
      settings,
      setSettings,
      experiment,
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
      settings,
      setSettings,
      experiment,
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
