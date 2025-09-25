import React, { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import { DebouncedFunc } from "lodash-es";
import yaml from "js-yaml";
import debounce from "lodash.debounce";
import { useLocalStorage } from 'react-use';
import { fetchConfigFromUrl } from '../utils/github';

type Props = {
  initialInput: string,
  initialInjectionInput?: string[][],
  children: React.ReactNode[] | React.ReactNode,
};

type Results = { [key: string]: any | Results };

type ContextProps = {
  configInput: string | undefined,
  setConfigInput: Dispatch<SetStateAction<string | undefined>>,
  injectionInput: string[][] | undefined,
  setInjectionInput: Dispatch<SetStateAction<string[][] | undefined>>,
  processInput: DebouncedFunc<(textInput: string | undefined, injectionInput: string[][] | undefined, options?: ProcessOptions) => Promise<void>>,
  error: string | null,
  setError: Dispatch<SetStateAction<string | null>>,
  deprecationWarning: string | null,
  results: Results | null,
  resultsVersion: number,
  setResultsVersion: Dispatch<SetStateAction<number>>,
  showSettings: boolean,
  setShowSettings: Dispatch<SetStateAction<boolean>>,
  showConfig: boolean,
  setShowConfig: Dispatch<SetStateAction<boolean>>,
  debug: boolean,
  setDebug: Dispatch<SetStateAction<boolean>>,
  autoGen: boolean,
  setAutoGen: Dispatch<SetStateAction<boolean>>,
  autoGen3D: boolean,
  setAutoGen3D: Dispatch<SetStateAction<boolean>>,
  kicanvasPreview: boolean,
  setKicanvasPreview: Dispatch<SetStateAction<boolean>>,
  jscadPreview: boolean,
  setJscadPreview: Dispatch<SetStateAction<boolean>>,
  generateStl: boolean,
  setGenerateStl: Dispatch<SetStateAction<boolean>>,
  experiment: string | null
};

type ProcessOptions = {
  pointsonly: boolean
};

export const ConfigContext = createContext<ContextProps | null>(null);
export const CONFIG_LOCAL_STORAGE_KEY = 'LOCAL_STORAGE_CONFIG'

const localStorageOrDefault = (key: string, defaultValue: any) => {
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    return JSON.parse(storedValue);
  } else {
    return defaultValue;
  }
}

const ConfigContextProvider = ({ initialInput, initialInjectionInput, children }: Props) => {
  const [configInput, setConfigInput] = useLocalStorage<string>(CONFIG_LOCAL_STORAGE_KEY, initialInput);
  const [injectionInput, setInjectionInput] = useLocalStorage<string[][]>("ergogen:injection", initialInjectionInput);
  const [error, setError] = useState<string | null>(null);
  const [deprecationWarning, setDeprecationWarning] = useState<string | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [resultsVersion, setResultsVersion] = useState<number>(0);
  const [debug, setDebug] = useState<boolean>(localStorageOrDefault("ergogen:config:debug", false));
  const [autoGen, setAutoGen] = useState<boolean>(localStorageOrDefault("ergogen:config:autoGen", true));
  const [autoGen3D, setAutoGen3D] = useState<boolean>(localStorageOrDefault("ergogen:config:autoGen3D", true));
  const [kicanvasPreview, setKicanvasPreview] = useState<boolean>(localStorageOrDefault("ergogen:config:kicanvasPreview", true));
  const [jscadPreview, setJscadPreview] = useState<boolean>(localStorageOrDefault("ergogen:config:jscadPreview", false));
  const [generateStl, setGenerateStl] = useState<boolean>(localStorageOrDefault("ergogen:config:generateStl", false));
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(true);
  
  // Save config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ergogen:config:debug', JSON.stringify(debug));
    localStorage.setItem('ergogen:config:autoGen', JSON.stringify(autoGen));
    localStorage.setItem('ergogen:config:autoGen3D', JSON.stringify(autoGen3D));
    localStorage.setItem('ergogen:config:kicanvasPreview', JSON.stringify(kicanvasPreview));
    localStorage.setItem('ergogen:config:jscadPreview', JSON.stringify(jscadPreview));
    localStorage.setItem('ergogen:config:generateStl', JSON.stringify(generateStl));
  }, [debug, autoGen, autoGen3D, kicanvasPreview, jscadPreview, generateStl]);

  const parseConfig = (inputString: string): [string, { [key: string]: any[] }] => {
    let type = 'UNKNOWN';
    let parsedConfig = null;

    try {
      parsedConfig = JSON.parse(inputString);
      type = 'json';
    } catch (e: unknown) {
      // Input is not valid JSON
    }

    try {
      parsedConfig = yaml.load(inputString);
      type = 'yaml';
    } catch (e: unknown) {
      // Input is not valid YAML
    }

    return [type, parsedConfig]
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const processInput = useCallback(
    debounce(async (textInput: string | undefined, injectionInput: string[][] | undefined, options: ProcessOptions = { pointsonly: true }) => {
      let results = null;
      let inputConfig: string | {} = textInput ?? '';
      let inputInjection: [][] | {} = injectionInput ?? '';
      const [, parsedConfig] = parseConfig(textInput ?? '');

      setError(null);
      setDeprecationWarning(null);

      if (parsedConfig && parsedConfig.pcbs) {
        const pcbs = Object.values(parsedConfig.pcbs) as any[];
        let warningFound = false;
        for (const pcb of pcbs) {
          if (!pcb.template || pcb.template === 'kicad5') {
            if (pcb.footprints) {
              const footprints = Object.values(pcb.footprints) as any[];
              for (const footprint of footprints) {
                if (footprint && typeof footprint.what === 'string' && footprint.what.startsWith('ceoloide')) {
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
          ['pcbs']: undefined,
          ['cases']: undefined,
        };
      }

      try {
        if (inputInjection !== undefined && Array.isArray(inputInjection)) {
          for (let i = 0; i < inputInjection.length; i++) {
            let injection = inputInjection[i];
            if (Array.isArray(injection) && injection.length === 3) {
              const inj_type = injection[0];
              const inj_name = injection[1];
              const inj_text = injection[2];
              const module_prefix = 'const module = {};\n\n'
              const module_suffix = '\n\nreturn module.exports;'
              const inj_value = new Function("require", module_prefix + inj_text + module_suffix)();
              (window as any).ergogen.inject(inj_type, inj_name, inj_value);
            }
          }
        }
        results = await (window as any).ergogen.process(
          inputConfig,
          true, // Set debug to true or no SVGs are generated
          (m: string) => console.log(m) // logger
        );
      } catch (e: unknown) {
        if (!e) return;

        if (typeof e === "string") {
          setError(e);
        }
        if (typeof e === "object") {
          // @ts-ignore
          setError(e.toString());
        }
        return;
      }

      if (generateStl && results?.cases) {
        const sampleStl = await fetch('https://raw.githubusercontent.com/ceoloide/Ugo-ESP32/master/hardware/Ugo-ESP32%20(TinyPICO)/Enclosure/Top%20Enclosure%20(Symbols).stl').then(res => res.text());
        for (const caseName in results.cases) {
          results.cases[caseName].stl = sampleStl;
        }
      }

      setResults(results);
      setResultsVersion(v => v + 1)

    }, 300),
    [(window as any).ergogen, generateStl]
  );

  useEffect(() => {
    localStorage.setItem('ergogen:injection', JSON.stringify(injectionInput));
    if (autoGen) {
      processInput(configInput, injectionInput, { pointsonly: !autoGen3D });
    }
  }, [processInput, configInput, injectionInput, autoGen, autoGen3D]);

  const queryParameters = new URLSearchParams(window.location.search);
  const experiment = queryParameters.get("exp");

  useEffect(() => {
    const githubUrl = queryParameters.get("github");
    if (githubUrl) {
      fetchConfigFromUrl(githubUrl)
        .then((data) => {
          setConfigInput(data);
        })
        .catch((e) => {
          setError(`Failed to fetch config from GitHub: ${e.message}`);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return (
    <ConfigContext.Provider
      value={{
        configInput,
        setConfigInput,
        injectionInput,
        setInjectionInput,
        processInput,
        error,
        setError,
        deprecationWarning,
        results,
        resultsVersion,
        setResultsVersion,
        showSettings,
        setShowSettings,
        showConfig,
        setShowConfig,
        debug,
        setDebug,
        autoGen,
        setAutoGen,
        autoGen3D,
        setAutoGen3D,
        kicanvasPreview,
        setKicanvasPreview,
        jscadPreview,
        setJscadPreview,
        generateStl,
        setGenerateStl,
        experiment,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContextProvider;

export const useConfigContext = () => useContext(ConfigContext);