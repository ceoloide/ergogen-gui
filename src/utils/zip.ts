import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import yaml from 'js-yaml';
import { Results } from '../types/results';
import { filterInjectionsByFeatureFlags } from './generationHelpers';
import { WorkerRequest } from '../workers/ergogen.worker.types';
import {
  createErgogenWorker,
  createJscadWorker,
} from '../workers/workerFactory';

const WORKER_TIMEOUT_MS = 30000;

const sanitizeName = (name: string): string =>
  name.replace(/[/\\?%*:|"<>]/g, '_') || 'Untitled';

const getUniqueName = (usedNames: Set<string>, rawName: string): string => {
  const baseName = sanitizeName(rawName);
  let finalName = baseName;
  let counter = 1;
  while (usedNames.has(finalName)) {
    finalName = `${baseName}_${counter}`;
    counter++;
  }
  usedNames.add(finalName);
  return finalName;
};

const parseConfigForWorker = (config: string): string | object => {
  try {
    const parsed = JSON.parse(config);
    if (parsed && typeof parsed === 'object') {
      return parsed as object;
    }
  } catch {
    try {
      const parsed = yaml.load(config);
      if (parsed && typeof parsed === 'object') {
        return parsed as object;
      }
    } catch {
      return config;
    }
  }
  return config;
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

const addResultsToZip = (
  outputsFolder: JSZip,
  configText: string,
  results: Results,
  debug: boolean,
  includeStl: boolean
) => {
  if (results.demo?.svg) {
    outputsFolder.file('demo.svg', results.demo.svg);
  }

  if (results.outlines) {
    let outlinesFolder: JSZip | null = null;
    for (const [name, outline] of Object.entries(results.outlines)) {
      if (debug || !name.startsWith('_')) {
        if (outline.dxf || outline.svg) {
          if (!outlinesFolder) {
            outlinesFolder = outputsFolder.folder('outlines');
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

  if (results.pcbs && Object.keys(results.pcbs).length > 0) {
    const pcbsFolder = outputsFolder.folder('pcbs');
    if (pcbsFolder) {
      for (const [name, pcb] of Object.entries(results.pcbs)) {
        const fileName = name.endsWith('.kicad_pcb')
          ? name
          : `${name}.kicad_pcb`;
        pcbsFolder.file(fileName, pcb);
      }
    }
  }

  if (results.cases) {
    let casesFolder: JSZip | null = null;
    for (const [name, caseData] of Object.entries(results.cases)) {
      const hasJscad = !!caseData.jscad;
      const hasStl = includeStl && !!caseData.stl;
      if (hasJscad || hasStl) {
        if (!casesFolder) {
          casesFolder = outputsFolder.folder('cases');
        }
        if (casesFolder) {
          if (caseData.jscad) {
            casesFolder.file(`${name}.jscad`, caseData.jscad);
          }
          if (hasStl && caseData.stl) {
            casesFolder.file(`${name}.stl`, caseData.stl);
          }
        }
      }
    }
  }

  if (debug) {
    const debugFolder = outputsFolder.folder('debug');
    if (debugFolder) {
      debugFolder.file('raw.txt', configText);
      for (const [key, value] of Object.entries(results)) {
        if (['canonical', 'points', 'units'].includes(key)) {
          debugFolder.file(`${key}.yaml`, JSON.stringify(value, null, 2));
        }
      }
    }
  }
};

const generateAndSaveZip = async (zip: JSZip, filenamePrefix: string) => {
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .split('T')[0];
  saveAs(blob, `${filenamePrefix}-${timestamp}.zip`);
};

const compileConfigAbortable = (
  config: string,
  injections: string[][] | undefined,
  debug: boolean,
  activeWorkers: Set<Worker>,
  isAborted: () => boolean
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
    activeWorkers.add(worker);

    const cleanup = () => {
      clearTimeout(timeout);
      worker.terminate();
      activeWorkers.delete(worker);
    };

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Compilation timed out'));
    }, WORKER_TIMEOUT_MS);

    worker.onmessage = (event) => {
      const response = event.data;
      if (response.type === 'error') {
        cleanup();
        reject(new Error(response.error));
      } else if (response.type === 'success') {
        cleanup();
        resolve(response.results as Results);
      }
    };

    worker.onerror = (error) => {
      cleanup();
      reject(error);
    };

    const request: WorkerRequest = {
      type: 'generate',
      inputConfig: parseConfigForWorker(config),
      injectionInput: injections,
      requestId: `export-compile-${Date.now()}`,
      options: {
        debug,
      },
    };
    worker.postMessage(request);
  });
};

const compileJscadToStlAbortable = (
  results: Results,
  activeWorkers: Set<Worker>,
  isAborted: () => boolean
): Promise<Results> => {
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
    activeWorkers.add(jscadWorker);

    const cleanup = () => {
      clearTimeout(timeout);
      jscadWorker.terminate();
      activeWorkers.delete(jscadWorker);
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve(results);
    }, WORKER_TIMEOUT_MS);

    jscadWorker.onmessage = (event) => {
      const response = event.data;
      if (response.type === 'success') {
        cleanup();
        resolve(response.results as Results);
      } else if (response.type === 'error') {
        cleanup();
        resolve(results);
      }
    };
    jscadWorker.onerror = () => {
      cleanup();
      resolve(results);
    };
    jscadWorker.postMessage({
      type: 'batch_jscad_to_stl',
      results: results,
      configVersion: 0,
    });
  });
};

export const createZip = async (
  results: Results,
  config: string,
  injections: string[][] | undefined,
  debug: boolean,
  stlPreview: boolean
) => {
  const zip = new JSZip();
  zip.file('config.yaml', config);

  const outputsFolder = zip.folder('outputs');
  if (outputsFolder) {
    addResultsToZip(outputsFolder, config, results, debug, stlPreview);
  }

  if (injections && injections.length > 0) {
    writeInjections(zip, injections);
  }

  await generateAndSaveZip(zip, 'ergogen');
};

interface ProgressiveExportSummary {
  succeededCount: number;
  failedCount: number;
}

export const exportConfigsProgressively = async (
  configs: { name: string; config: string }[],
  injections: string[][] | undefined,
  debug: boolean,
  stlPreview: boolean,
  onlyConfigs: boolean,
  onProgress: (current: number, total: number, name: string) => void,
  isAborted: () => boolean
): Promise<ProgressiveExportSummary | undefined> => {
  const zip = new JSZip();
  const usedNames = new Set<string>();

  if (onlyConfigs) {
    for (let i = 0; i < configs.length; i++) {
      if (isAborted()) return;
      const configRecord = configs[i];
      onProgress(i, configs.length, configRecord.name);

      const finalName = getUniqueName(usedNames, configRecord.name);
      zip.file(`${finalName}.yaml`, configRecord.config);
    }

    if (injections && injections.length > 0) {
      if (isAborted()) return;
      writeInjections(zip, injections);
    }

    if (isAborted()) return;
    onProgress(configs.length, configs.length, 'Creating ZIP...');

    await generateAndSaveZip(zip, 'ergogen-config-all');
    return { succeededCount: configs.length, failedCount: 0 };
  }

  const filteredInjections = filterInjectionsByFeatureFlags(injections);
  const tasks = configs.map((configRecord) => ({
    configRecord,
    folderName: getUniqueName(usedNames, configRecord.name),
  }));

  const activeWorkers = new Set<Worker>();
  const activeConfigs = new Set<string>();
  let completedCount = 0;
  let succeededCount = 0;
  let failedCount = 0;
  const concurrencyLimit = Math.min(4, navigator.hardwareConcurrency || 2);

  const processTask = async ({
    configRecord,
    folderName,
  }: (typeof tasks)[number]) => {
    if (isAborted()) return;
    activeConfigs.add(configRecord.name);
    onProgress(
      completedCount,
      configs.length,
      Array.from(activeConfigs).join(', ')
    );

    const configFolder = zip.folder(folderName);
    if (!configFolder) {
      activeConfigs.delete(configRecord.name);
      completedCount++;
      onProgress(
        completedCount,
        configs.length,
        Array.from(activeConfigs).join(', ')
      );
      return;
    }

    try {
      const results = await compileConfigAbortable(
        configRecord.config,
        filteredInjections,
        debug,
        activeWorkers,
        isAborted
      );
      let finalResults = results;
      if (
        stlPreview &&
        results.cases &&
        Object.keys(results.cases).length > 0
      ) {
        finalResults = await compileJscadToStlAbortable(
          results,
          activeWorkers,
          isAborted
        );
      }

      if (isAborted()) return;

      configFolder.file('config.yaml', configRecord.config);

      const outputsFolder = configFolder.folder('outputs');
      if (outputsFolder) {
        addResultsToZip(
          outputsFolder,
          configRecord.config,
          finalResults,
          debug,
          stlPreview
        );
      }

      if (injections && injections.length > 0) {
        writeInjections(configFolder, injections);
      }
      succeededCount++;
    } catch (e) {
      failedCount++;
      console.error(`Failed to compile config ${configRecord.name}:`, e);
      configFolder.file('config.yaml', configRecord.config);
      configFolder.file(
        'error.txt',
        `Compilation failed: ${e instanceof Error ? e.message : String(e)}`
      );
    } finally {
      activeConfigs.delete(configRecord.name);
      completedCount++;
      onProgress(
        completedCount,
        configs.length,
        Array.from(activeConfigs).join(', ')
      );
    }
  };

  try {
    const queue = [...tasks];
    const promises: Promise<void>[] = [];

    const next = async (): Promise<void> => {
      if (isAborted() || queue.length === 0) return;
      const task = queue.shift()!;
      await processTask(task);
      await next();
    };

    for (let i = 0; i < Math.min(concurrencyLimit, queue.length); i++) {
      promises.push(next());
    }

    await Promise.all(promises);

    if (isAborted()) {
      activeWorkers.forEach((w) => w.terminate());
      activeWorkers.clear();
      return;
    }

    onProgress(configs.length, configs.length, 'Creating ZIP...');
    await generateAndSaveZip(zip, 'ergogen-export-all');
    return { succeededCount, failedCount };
  } finally {
    activeWorkers.forEach((w) => w.terminate());
    activeWorkers.clear();
  }
};
