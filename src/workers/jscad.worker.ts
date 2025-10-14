/// <reference lib="webworker" />

/* eslint-env worker */
/* global self */

import {
  JscadWorkerRequest,
  JscadWorkerResponse,
  ResultsLike,
} from './jscad.worker.types';

console.log('<-> JSCAD worker module starting...');

type ConvertOptions = {
  source: string;
  format?: string;
  parameters?: Record<string, unknown>;
  options?: Record<string, unknown>;
};

type ConvertResult = {
  data: unknown[];
  mimeType: string;
};

type ConvertFunction = (options: ConvertOptions) => ConvertResult;

type ArrayBufferViewLike = {
  buffer: ArrayBuffer;
  byteOffset: number;
  byteLength: number;
};

interface JscadConvertModule {
  convert: ConvertFunction;
}

interface JscadWorkerGlobal extends DedicatedWorkerGlobalScope {
  JscadConvert?: JscadConvertModule;
}

const workerScope = self as unknown as JscadWorkerGlobal;

let convertFn: ConvertFunction | null = null;
let initializationError: Error | null = null;
const utf8Decoder =
  typeof TextDecoder === 'undefined' ? null : new TextDecoder();

function getBasePath() {
  // Use PUBLIC_URL if available
  if (typeof process !== 'undefined' && process.env.PUBLIC_URL) {
    return process.env.PUBLIC_URL;
  }
  // Extract base path from worker location
  if (typeof self !== 'undefined' && (self as any).location) {
    const { origin, pathname } = (self as any).location;
    // Remove "/static/..." if present
    const staticIndex = pathname.indexOf('/static/');
    const base = staticIndex > 0 ? pathname.substring(0, staticIndex) : '';
    return `${origin}${base}`;
  }
  return '';
}

const basePath = getBasePath();
const openjscadPath = `${basePath}/dependencies/openjscad.js`;

try {
  importScripts(openjscadPath);
  const module = workerScope.JscadConvert;
  if (!module || typeof module.convert !== 'function') {
    throw new Error('openjscad.js did not expose a convert function.');
  }
  convertFn = module.convert;
  console.log('<-> OpenJSCAD convert API loaded in worker');
} catch (error) {
  initializationError =
    error instanceof Error ? error : new Error(String(error));
  console.error(
    '>>> Failed to load OpenJSCAD convert API:',
    initializationError
  );
}

/**
 * Error handler for uncaught errors in the worker.
 */
self.onerror = (error) => {
  console.error('>>> Uncaught error in JSCAD worker:', error);
  const errorMessage =
    error instanceof ErrorEvent ? error.message : String(error);
  self.postMessage({
    type: 'error',
    error: `JSCAD worker error: ${errorMessage}`,
  });
  return true; // Prevent default error handling
};

/**
 * Main worker message handler.
 */
self.onmessage = async (event: MessageEvent<JscadWorkerRequest>) => {
  const { type, results, configVersion } = event.data || {};

  if (initializationError) {
    const response: JscadWorkerResponse = {
      type: 'error',
      error: `JSCAD library initialization failed: ${initializationError.message}`,
      configVersion,
    };
    self.postMessage(response);
    return;
  }

  if (!convertFn) {
    const response: JscadWorkerResponse = {
      type: 'error',
      error: 'JSCAD convert function is unavailable.',
      configVersion,
    };
    self.postMessage(response);
    return;
  }

  if (type !== 'batch_jscad_to_stl') {
    const response: JscadWorkerResponse = {
      type: 'error',
      error: `Unknown message type: ${type}`,
      configVersion,
    };
    self.postMessage(response);
    return;
  }

  try {
    const originalResults: ResultsLike | undefined = results;
    if (!originalResults || !originalResults.cases) {
      throw new Error('No results or cases provided to process.');
    }

    // Clone shallowly to avoid mutating caller's object directly
    const updatedResults: ResultsLike = { ...originalResults };
    updatedResults.cases = { ...originalResults.cases };

    const entries = Object.entries(updatedResults.cases);
    if (entries.length === 0) {
      throw new Error('No JSCAD cases to process.');
    }

    // Process each case sequentially
    for (const [name, caseObj] of entries) {
      const jscad = caseObj?.jscad as string | undefined;
      if (!jscad || jscad.trim() === '') {
        // Keep existing entry as-is
        continue;
      }

      try {
        // Convert JSCAD to STL
        const result = convertFn({ source: jscad, format: 'stla' });

        const firstPart = result?.data?.[0];
        let stlContent: string | null = null;

        if (typeof firstPart === 'string') {
          stlContent = firstPart;
        } else if (firstPart instanceof ArrayBuffer && utf8Decoder) {
          stlContent = utf8Decoder.decode(new Uint8Array(firstPart));
        } else if (ArrayBuffer.isView(firstPart) && utf8Decoder) {
          const view = firstPart as ArrayBufferViewLike;
          const array = new Uint8Array(
            view.buffer,
            view.byteOffset,
            view.byteLength
          );
          stlContent = utf8Decoder.decode(array);
        }

        if (!stlContent) {
          console.warn(
            `Generated STL content is empty or unsupported type for case: ${name}`
          );
          continue;
        }

        // Rename default STL header from "solid csg.js" to the specific case name for clarity
        stlContent = stlContent.replace(/^solid csg\.js\b/, `solid ${name}`);

        if (!stlContent || stlContent.trim() === '') {
          console.warn(`Generated STL content is empty for case: ${name}`);
          continue;
        }

        updatedResults.cases[name] = {
          ...(updatedResults.cases[name] as any),
          stl: stlContent,
        };
      } catch (caseError: unknown) {
        const errorMessage =
          caseError instanceof Error ? caseError.message : String(caseError);
        console.error(`Failed to convert case ${name}: ${errorMessage}`);
        // Continue with other cases even if one fails
      }
    }

    const response: JscadWorkerResponse = {
      type: 'success',
      results: updatedResults,
      configVersion,
    };
    self.postMessage(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const response: JscadWorkerResponse = {
      type: 'error',
      error: `JSCAD to STL batch conversion failed: ${errorMessage}`,
      configVersion,
    };
    self.postMessage(response);
  }
};

// Export empty object to satisfy TypeScript's module requirement
export {};
