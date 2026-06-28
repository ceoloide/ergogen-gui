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
 * Helper to send a response back to the main thread.
 */
const sendResponse = (response: JscadWorkerResponse) => {
  self.postMessage(response);
};

/**
 * Decodes the raw JSCAD output into an STL string.
 * Supports string, ArrayBuffer, and ArrayBufferView.
 */
function decodeStlContent(data: unknown): string | null {
  if (typeof data === 'string') {
    return data;
  }

  if (!utf8Decoder) {
    return null;
  }

  if (data instanceof ArrayBuffer) {
    return utf8Decoder.decode(new Uint8Array(data));
  }

  if (ArrayBuffer.isView(data)) {
    const view = data as ArrayBufferViewLike;
    const array = new Uint8Array(
      view.buffer,
      view.byteOffset,
      view.byteLength
    );
    return utf8Decoder.decode(array);
  }

  return null;
}

/**
 * Processes a single JSCAD case: converts source to STL and post-processes it.
 */
function processJscadCase(name: string, jscad: string): string | null {
  if (!convertFn) {
    throw new Error('JSCAD convert function is unavailable.');
  }

  const result = convertFn({ source: jscad, format: 'stla' });
  const firstPart = result?.data?.[0];
  let stlContent = decodeStlContent(firstPart);

  if (!stlContent) {
    console.warn(
      `Generated STL content is empty or unsupported type for case: ${name}`
    );
    return null;
  }

  // Rename default STL header from "solid csg.js" to the specific case name for clarity
  stlContent = stlContent.replace(/^solid csg\.js\b/, `solid ${name}`);

  if (!stlContent || stlContent.trim() === '') {
    console.warn(`Generated STL content is empty for case: ${name}`);
    return null;
  }

  return stlContent;
}

/**
 * Orchestrates batch conversion of multiple JSCAD cases.
 */
function performBatchConversion(
  results: ResultsLike,
  configVersion: number
): void {
  // Clone shallowly to avoid mutating caller's object directly
  const updatedResults: ResultsLike = { ...results };
  if (results.cases) {
    updatedResults.cases = { ...results.cases };
  } else {
    throw new Error('No cases provided to process.');
  }

  const entries = Object.entries(updatedResults.cases);
  if (entries.length === 0) {
    throw new Error('No JSCAD cases to process.');
  }

  // Process each case sequentially
  for (const [name, caseObj] of entries) {
    const jscad = caseObj?.jscad as string | undefined;
    if (!jscad || jscad.trim() === '') {
      continue;
    }

    try {
      const stl = processJscadCase(name, jscad);
      if (stl) {
        updatedResults.cases[name] = {
          ...(updatedResults.cases[name] as any),
          stl,
        };
      }
    } catch (caseError: unknown) {
      const errorMessage =
        caseError instanceof Error ? caseError.message : String(caseError);
      console.error(`Failed to convert case ${name}: ${errorMessage}`);
      // Continue with other cases even if one fails
    }
  }

  sendResponse({
    type: 'success',
    results: updatedResults,
    configVersion,
  });
}

/**
 * Main worker message handler.
 */
self.onmessage = async (event: MessageEvent<JscadWorkerRequest>) => {
  const { type, results, configVersion } = event.data || {};

  if (initializationError) {
    sendResponse({
      type: 'error',
      error: `JSCAD library initialization failed: ${initializationError.message}`,
      configVersion,
    });
    return;
  }

  if (!convertFn) {
    sendResponse({
      type: 'error',
      error: 'JSCAD convert function is unavailable.',
      configVersion,
    });
    return;
  }

  if (type !== 'batch_jscad_to_stl') {
    sendResponse({
      type: 'error',
      error: `Unknown message type: ${type}`,
      configVersion,
    });
    return;
  }

  try {
    if (!results || !results.cases) {
      throw new Error('No results or cases provided to process.');
    }
    performBatchConversion(results, configVersion);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendResponse({
      type: 'error',
      error: `JSCAD to STL batch conversion failed: ${errorMessage}`,
      configVersion,
    });
  }
};

// Export empty object to satisfy TypeScript's module requirement
export {};
