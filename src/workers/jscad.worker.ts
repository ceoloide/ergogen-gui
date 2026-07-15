/// <reference lib="webworker" />

import { JscadWorkerRequest, JscadWorkerResponse } from './jscad.worker.types';
import { Results } from '../types/results';

// @ts-expect-error: Loading openjscad.js UMD module statically
import '../../public/dependencies/openjscad.js';

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

try {
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
    const originalResults: Results | undefined = results;
    if (!originalResults || !originalResults.cases) {
      throw new Error('No results or cases provided to process.');
    }

    // Clone shallowly to avoid mutating caller's object directly
    const updatedResults: Results = { ...originalResults };
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
        console.log('[JSCAD Worker] Converting case:', name, 'format stlb');
        const result = convertFn({ source: jscad, format: 'stlb' });
        console.log(
          '[JSCAD Worker] Convert result:',
          result
            ? { mimeType: result.mimeType, dataLength: result.data?.length }
            : null
        );

        let stlContent: ArrayBuffer | null = null;
        if (result?.data && Array.isArray(result.data)) {
          // Calculate total byte length
          let totalLength = 0;
          const buffers = result.data.map((part: unknown, index: number) => {
            console.log(
              `[JSCAD Worker] Part ${index}:`,
              part,
              'type:',
              typeof part,
              'isView:',
              ArrayBuffer.isView(part),
              'isBuffer:',
              part instanceof ArrayBuffer
            );
            if (part instanceof ArrayBuffer) {
              totalLength += part.byteLength;
              return new Uint8Array(part);
            } else if (part && typeof part === 'object' && 'buffer' in part) {
              const view = part as any;
              totalLength += view.byteLength;
              return new Uint8Array(
                view.buffer,
                view.byteOffset,
                view.byteLength
              );
            } else if (typeof part === 'string') {
              const buf = new TextEncoder().encode(part);
              totalLength += buf.byteLength;
              return buf;
            }
            return new Uint8Array(0);
          });

          // Concatenate all parts
          const concatenated = new Uint8Array(totalLength);
          let offset = 0;
          for (const buf of buffers) {
            concatenated.set(buf, offset);
            offset += buf.byteLength;
          }
          stlContent = concatenated.buffer;
        }

        if (!stlContent || stlContent.byteLength === 0) {
          console.warn(`Generated STL content is empty for case: ${name}`);
          continue;
        }

        updatedResults.cases[name] = {
          jscad: updatedResults.cases[name]?.jscad ?? '',
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
