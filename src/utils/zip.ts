import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import yaml from 'js-yaml';
import {
  createErgogenWorker,
  createJscadWorker,
} from '../workers/workerFactory';

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
  stl?: string | ArrayBuffer | Uint8Array;
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

const writeInjections = (parentFolder: JSZip, injections: string[][]) => {
  const folderCache = new Map<string, JSZip>();
  for (const injection of injections) {
    const [type, name, content] = injection;
    let innerFolderName = 'footprints';
    if (type === 'outline') {
      innerFolderName = 'outlines';
    } else if (type === 'template') {
      innerFolderName = 'templates';
    }

    const targetFolder = parentFolder.folder(innerFolderName);
    if (targetFolder) {
      const pathParts = name.split('/');
      const fileName = pathParts.pop();
      let currentFolder = targetFolder;
      let currentKey = innerFolderName;
      for (const part of pathParts) {
        const nextKey = `${currentKey}/${part}`;
        let nextFolder = folderCache.get(nextKey);
        if (!nextFolder) {
          nextFolder = currentFolder.folder(part) || currentFolder;
          folderCache.set(nextKey, nextFolder);
        }
        currentFolder = nextFolder;
        currentKey = nextKey;
      }
      if (fileName) {
        currentFolder.file(`${fileName}.js`, content);
      }
    }
  }
};

export const createZip = async (
  results: Results,
  config: string,
  injections: string[][] | undefined,
  debug: boolean,
  stlPreview: boolean
) => {
  const zip = new JSZip();

  // Root folder
  if (results.demo?.svg) {
    zip.file('demo.svg', results.demo.svg);
  }
  zip.file('config.yaml', config);

  // Outlines folder
  if (results.outlines) {
    let outlinesFolder: JSZip | null = null;
    for (const [name, outline] of Object.entries(results.outlines)) {
      if (debug || !name.startsWith('_')) {
        if (outline.dxf || outline.svg) {
          if (!outlinesFolder) {
            outlinesFolder = zip.folder('outlines');
          }
          if (outlinesFolder) {
            if (outline.dxf) {
              outlinesFolder.file(`${name}.dxf`, outline.dxf);
            }
            if (outline.svg) {
              outlinesFolder.file(`${name}.svg`, outline.svg);
            }
          }
        }
      }
    }
  }

  // PCBs folder
  if (results.pcbs && Object.keys(results.pcbs).length > 0) {
    const pcbsFolder = zip.folder('pcbs');
    if (pcbsFolder) {
      for (const [name, pcb] of Object.entries(results.pcbs)) {
        const fileName = name.endsWith('.kicad_pcb')
          ? name
          : `${name}.kicad_pcb`;
        pcbsFolder.file(fileName, pcb);
      }
    }
  }

  // Cases folder
  if (results.cases) {
    let casesFolder: JSZip | null = null;
    for (const [name, caseData] of Object.entries(results.cases)) {
      const hasJscad = !!caseData.jscad;
      const hasStl = stlPreview && !!caseData.stl;
      if (hasJscad || hasStl) {
        if (!casesFolder) {
          casesFolder = zip.folder('cases');
        }
        if (casesFolder) {
          if (caseData.jscad) {
            casesFolder.file(`${name}.jscad`, caseData.jscad);
          }
          if (stlPreview && caseData.stl) {
            casesFolder.file(`${name}.stl`, caseData.stl);
          }
        }
      }
    }
  }

  // Debug folder
  if (debug) {
    const debugFolder = zip.folder('debug');
    if (debugFolder) {
      debugFolder.file('raw.txt', config);
      for (const [key, value] of Object.entries(results)) {
        if (['canonical', 'points', 'units'].includes(key)) {
          debugFolder.file(`${key}.yaml`, JSON.stringify(value, null, 2));
        }
      }
    }
  }

  // Save injections into their respective folders based on type
  if (injections && injections.length > 0) {
    writeInjections(zip, injections);
  }

  // Generate the zip file
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  // Trigger download
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .split('T')[0];
  const filename = `ergogen-${timestamp}.zip`;
  saveAs(blob, filename);
};

const compileConfig = (
  config: string,
  injections: string[][] | undefined
): Promise<Results> => {
  return new Promise((resolve, reject) => {
    const worker = createErgogenWorker();
    if (!worker) {
      reject(new Error('Failed to create Ergogen worker'));
      return;
    }

    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error('Compilation timed out'));
    }, 15000);

    worker.onmessage = (event) => {
      const response = event.data;
      if (response.type === 'error') {
        clearTimeout(timeout);
        reject(new Error(response.error));
        worker.terminate();
      } else if (response.type === 'success') {
        clearTimeout(timeout);
        resolve(response.results as Results);
        worker.terminate();
      }
    };
    worker.onerror = (error) => {
      clearTimeout(timeout);
      reject(error);
      worker.terminate();
    };

    let parsedConfig;
    try {
      parsedConfig = JSON.parse(config);
    } catch {
      try {
        parsedConfig = yaml.load(config);
      } catch {
        parsedConfig = config;
      }
    }

    worker.postMessage({
      type: 'generate',
      inputConfig: parsedConfig,
      injectionInput: injections,
      requestId: `export-compile-${Date.now()}`,
      options: {
        debug: true,
        svg: true,
      },
    });
  });
};

const compileJscadToStl = (results: Results): Promise<Results> => {
  return new Promise<Results>((resolve) => {
    const jscadWorker = createJscadWorker();
    if (!jscadWorker) {
      resolve(results);
      return;
    }

    const timeout = setTimeout(() => {
      jscadWorker.terminate();
      resolve(results);
    }, 15000);

    jscadWorker.onmessage = (event) => {
      const response = event.data;
      if (response.type === 'success' && response.results) {
        clearTimeout(timeout);
        resolve(response.results as Results);
      } else {
        clearTimeout(timeout);
        resolve(results);
      }
      jscadWorker.terminate();
    };
    jscadWorker.onerror = () => {
      clearTimeout(timeout);
      resolve(results);
      jscadWorker.terminate();
    };
    jscadWorker.postMessage({
      type: 'batch_jscad_to_stl',
      results: results,
      configVersion: 0,
    });
  });
};

export const exportAllConfigs = async (
  configs: { name: string; config: string }[],
  injections: string[][] | undefined,
  debug: boolean,
  stlPreview: boolean
) => {
  const zip = new JSZip();

  for (const configRecord of configs) {
    const folderName =
      configRecord.name.replace(/[/\\?%*:|"<>]/g, '_') || 'Untitled';
    const configFolder = zip.folder(folderName);
    if (!configFolder) continue;

    try {
      const results = await compileConfig(configRecord.config, injections);
      let finalResults = results;
      if (
        stlPreview &&
        results.cases &&
        Object.keys(results.cases).length > 0
      ) {
        finalResults = await compileJscadToStl(results);
      }

      if (finalResults.demo?.svg) {
        configFolder.file('demo.svg', finalResults.demo.svg);
      }
      configFolder.file('config.yaml', configRecord.config);

      if (finalResults.outlines) {
        let outlinesFolder: JSZip | null = null;
        for (const [name, outline] of Object.entries(finalResults.outlines)) {
          if (debug || !name.startsWith('_')) {
            if (outline.dxf || outline.svg) {
              if (!outlinesFolder) {
                outlinesFolder = configFolder.folder('outlines');
              }
              if (outlinesFolder) {
                if (outline.dxf)
                  outlinesFolder.file(`${name}.dxf`, outline.dxf);
                if (outline.svg)
                  outlinesFolder.file(`${name}.svg`, outline.svg);
              }
            }
          }
        }
      }

      if (finalResults.pcbs && Object.keys(finalResults.pcbs).length > 0) {
        const pcbsFolder = configFolder.folder('pcbs');
        if (pcbsFolder) {
          for (const [name, pcb] of Object.entries(finalResults.pcbs)) {
            const fileName = name.endsWith('.kicad_pcb')
              ? name
              : `${name}.kicad_pcb`;
            pcbsFolder.file(fileName, pcb);
          }
        }
      }

      if (finalResults.cases) {
        let casesFolder: JSZip | null = null;
        for (const [name, caseData] of Object.entries(finalResults.cases)) {
          const hasJscad = !!caseData.jscad;
          const hasStl = stlPreview && !!caseData.stl;
          if (hasJscad || hasStl) {
            if (!casesFolder) {
              casesFolder = configFolder.folder('cases');
            }
            if (casesFolder) {
              if (caseData.jscad)
                casesFolder.file(`${name}.jscad`, caseData.jscad);
              if (stlPreview && caseData.stl)
                casesFolder.file(`${name}.stl`, caseData.stl);
            }
          }
        }
      }

      if (debug) {
        const debugFolder = configFolder.folder('debug');
        if (debugFolder) {
          debugFolder.file('raw.txt', configRecord.config);
          for (const [key, value] of Object.entries(finalResults)) {
            if (['canonical', 'points', 'units'].includes(key)) {
              debugFolder.file(`${key}.yaml`, JSON.stringify(value, null, 2));
            }
          }
        }
      }

      if (injections && injections.length > 0) {
        writeInjections(configFolder, injections);
      }
    } catch (e) {
      console.error(`Failed to compile config ${configRecord.name}:`, e);
      configFolder.file('config.yaml', configRecord.config);
      configFolder.file(
        'error.txt',
        `Compilation failed: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .split('T')[0];
  const filename = `ergogen-export-all-${timestamp}.zip`;
  saveAs(blob, filename);
};

export const downloadAllConfigs = async (
  configs: { name: string; config: string }[],
  injections: string[][] | undefined
) => {
  const zip = new JSZip();
  const usedNames = new Set<string>();

  // Add YAML configs to the root
  for (const configRecord of configs) {
    const baseName =
      configRecord.name.replace(/[/\\?%*:|"<>]/g, '_') || 'Untitled';
    let finalName = baseName;
    let counter = 1;
    while (usedNames.has(finalName)) {
      finalName = `${baseName}_${counter}`;
      counter++;
    }
    usedNames.add(finalName);
    zip.file(`${finalName}.yaml`, configRecord.config);
  }

  // Add injections folders in the zip root
  if (injections && injections.length > 0) {
    writeInjections(zip, injections);
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .split('T')[0];
  const filename = `ergogen-config-all-${timestamp}.zip`;
  saveAs(blob, filename);
};

export const exportConfigsProgressively = async (
  configs: { name: string; config: string }[],
  injections: string[][] | undefined,
  debug: boolean,
  _stlPreview: boolean,
  onlyConfigs: boolean,
  onProgress: (current: number, total: number, name: string) => void,
  isAborted: () => boolean
) => {
  const zip = new JSZip();
  const usedNames = new Set<string>();

  if (onlyConfigs) {
    // 1. Configs only mode
    for (let i = 0; i < configs.length; i++) {
      if (isAborted()) return;
      const configRecord = configs[i];
      onProgress(i, configs.length, configRecord.name);

      const baseName =
        configRecord.name.replace(/[/\\?%*:|"<>]/g, '_') || 'Untitled';
      let finalName = baseName;
      let counter = 1;
      while (usedNames.has(finalName)) {
        finalName = `${baseName}_${counter}`;
        counter++;
      }
      usedNames.add(finalName);
      zip.file(`${finalName}.yaml`, configRecord.config);
    }

    // Add injections folders in the zip root
    if (injections && injections.length > 0) {
      if (isAborted()) return;
      writeInjections(zip, injections);
    }

    if (isAborted()) return;
    onProgress(configs.length, configs.length, 'Creating ZIP...');

    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .split('T')[0];
    const filename = `ergogen-config-all-${timestamp}.zip`;
    saveAs(blob, filename);
  } else {
    // 2. Full compilation mode (like export all but progressive and abortable)
    const activeWorkerRef = { current: null as Worker | null };

    const compileConfigAbortable = (
      config: string,
      injections: string[][] | undefined
    ): Promise<Results> => {
      return new Promise((resolve, reject) => {
        if (isAborted()) {
          reject(new Error('Aborted'));
          return;
        }
        const worker = createErgogenWorker();
        if (!worker) {
          reject(new Error('Failed to create Ergogen worker'));
          return;
        }
        activeWorkerRef.current = worker;

        const timeout = setTimeout(() => {
          worker.terminate();
          if (activeWorkerRef.current === worker)
            activeWorkerRef.current = null;
          reject(new Error('Compilation timed out'));
        }, 30000);

        worker.onmessage = (event) => {
          const response = event.data;
          if (response.type === 'error') {
            clearTimeout(timeout);
            worker.terminate();
            if (activeWorkerRef.current === worker)
              activeWorkerRef.current = null;
            reject(new Error(response.error));
          } else if (response.type === 'success') {
            clearTimeout(timeout);
            worker.terminate();
            if (activeWorkerRef.current === worker)
              activeWorkerRef.current = null;
            resolve(response.results as Results);
          }
        };

        worker.onerror = (error) => {
          clearTimeout(timeout);
          worker.terminate();
          if (activeWorkerRef.current === worker)
            activeWorkerRef.current = null;
          reject(error);
        };

        let parsedConfig;
        try {
          parsedConfig = JSON.parse(config);
        } catch {
          try {
            parsedConfig = yaml.load(config);
          } catch {
            parsedConfig = config;
          }
        }

        worker.postMessage({
          type: 'generate',
          inputConfig: parsedConfig,
          injectionInput: injections,
          requestId: `export-compile-${Date.now()}`,
        });
      });
    };

    const compileJscadToStlAbortable = (results: Results): Promise<Results> => {
      return new Promise((resolve) => {
        if (
          isAborted() ||
          !results.cases ||
          Object.keys(results.cases).length === 0
        ) {
          resolve(results);
          return;
        }
        const jscadWorker = createJscadWorker();
        if (!jscadWorker) {
          resolve(results);
          return;
        }
        activeWorkerRef.current = jscadWorker;

        const timeout = setTimeout(() => {
          jscadWorker.terminate();
          if (activeWorkerRef.current === jscadWorker)
            activeWorkerRef.current = null;
          resolve(results);
        }, 30000);

        jscadWorker.onmessage = (event) => {
          const response = event.data;
          if (response.type === 'success') {
            clearTimeout(timeout);
            jscadWorker.terminate();
            if (activeWorkerRef.current === jscadWorker)
              activeWorkerRef.current = null;
            resolve(response.results as Results);
          } else if (response.type === 'error') {
            clearTimeout(timeout);
            jscadWorker.terminate();
            if (activeWorkerRef.current === jscadWorker)
              activeWorkerRef.current = null;
            resolve(results);
          }
        };
        jscadWorker.onerror = () => {
          clearTimeout(timeout);
          jscadWorker.terminate();
          if (activeWorkerRef.current === jscadWorker)
            activeWorkerRef.current = null;
          resolve(results);
        };
        jscadWorker.postMessage({
          type: 'batch_jscad_to_stl',
          results: results,
          configVersion: 0,
        });
      });
    };

    try {
      for (let i = 0; i < configs.length; i++) {
        if (isAborted()) {
          if (activeWorkerRef.current) activeWorkerRef.current.terminate();
          return;
        }
        const configRecord = configs[i];
        onProgress(i, configs.length, configRecord.name);

        const folderName =
          configRecord.name.replace(/[/\\?%*:|"<>]/g, '_') || 'Untitled';
        const configFolder = zip.folder(folderName);
        if (!configFolder) continue;

        try {
          const results = await compileConfigAbortable(
            configRecord.config,
            injections
          );
          let finalResults = results;
          if (results.cases && Object.keys(results.cases).length > 0) {
            finalResults = await compileJscadToStlAbortable(results);
          }

          if (isAborted()) {
            if (activeWorkerRef.current) activeWorkerRef.current.terminate();
            return;
          }

          if (finalResults.demo?.svg) {
            configFolder.file('demo.svg', finalResults.demo.svg);
          }
          configFolder.file('config.yaml', configRecord.config);

          if (finalResults.outlines) {
            let outlinesFolder: JSZip | null = null;
            for (const [name, outline] of Object.entries(
              finalResults.outlines
            )) {
              if (debug || !name.startsWith('_')) {
                if (outline.dxf || outline.svg) {
                  if (!outlinesFolder) {
                    outlinesFolder = configFolder.folder('outlines');
                  }
                  if (outlinesFolder) {
                    if (outline.dxf)
                      outlinesFolder.file(`${name}.dxf`, outline.dxf);
                    if (outline.svg)
                      outlinesFolder.file(`${name}.svg`, outline.svg);
                  }
                }
              }
            }
          }

          if (finalResults.pcbs && Object.keys(finalResults.pcbs).length > 0) {
            const pcbsFolder = configFolder.folder('pcbs');
            if (pcbsFolder) {
              for (const [name, pcb] of Object.entries(finalResults.pcbs)) {
                const fileName = name.endsWith('.kicad_pcb')
                  ? name
                  : `${name}.kicad_pcb`;
                pcbsFolder.file(fileName, pcb);
              }
            }
          }

          if (finalResults.cases) {
            let casesFolder: JSZip | null = null;
            for (const [name, caseData] of Object.entries(finalResults.cases)) {
              const hasJscad = !!caseData.jscad;
              const hasStl = !!caseData.stl;
              if (hasJscad || hasStl) {
                if (!casesFolder) {
                  casesFolder = configFolder.folder('cases');
                }
                if (casesFolder) {
                  if (caseData.jscad)
                    casesFolder.file(`${name}.jscad`, caseData.jscad);
                  if (caseData.stl)
                    casesFolder.file(`${name}.stl`, caseData.stl);
                }
              }
            }
          }

          if (debug) {
            const debugFolder = configFolder.folder('debug');
            if (debugFolder) {
              debugFolder.file('raw.txt', configRecord.config);
              for (const [key, value] of Object.entries(finalResults)) {
                if (['canonical', 'points', 'units'].includes(key)) {
                  debugFolder.file(
                    `${key}.yaml`,
                    JSON.stringify(value, null, 2)
                  );
                }
              }
            }
          }

          if (injections && injections.length > 0) {
            writeInjections(configFolder, injections);
          }
        } catch (e) {
          console.error(`Failed to compile config ${configRecord.name}:`, e);
          configFolder.file('config.yaml', configRecord.config);
          configFolder.file(
            'error.txt',
            `Compilation failed: ${e instanceof Error ? e.message : String(e)}`
          );
        }
      }

      if (isAborted()) {
        if (activeWorkerRef.current) activeWorkerRef.current.terminate();
        return;
      }
      onProgress(configs.length, configs.length, 'Creating ZIP...');

      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .split('T')[0];
      const filename = `ergogen-export-all-${timestamp}.zip`;
      saveAs(blob, filename);
    } finally {
      if (activeWorkerRef.current) {
        activeWorkerRef.current.terminate();
      }
    }
  }
};
