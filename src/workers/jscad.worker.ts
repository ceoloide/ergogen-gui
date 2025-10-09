/* eslint-env worker */
/* global self, importScripts */

import { JscadWorkerRequest } from './jscad.worker.types';

console.log('<-> JSCAD worker module starting...');

// Initialize myjscad object before loading the library
// This matches the initialization in the main HTML file
// @ts-expect-error - defining global myjscad object
self.myjscad = {};

// Import the openjscad library
// This will populate the myjscad global object
try {
  // @ts-expect-error - importScripts is available in web workers
  importScripts('/dependencies/openjscad.js');
  console.log('<-> OpenJSCAD library loaded in worker');
} catch (error) {
  console.error('>>> Failed to load OpenJSCAD library:', error);
}

// Global interface for the myjscad library
interface MyJscad {
  setup: () => void;
  compile: (code: string) => Promise<string>;
  generateOutput: (
    format: string,
    geometry: unknown
  ) => {
    asBuffer: () => {
      toString: () => string;
    };
  };
}

declare const myjscad: MyJscad;

/**
 * Error handler for uncaught errors in the worker.
 */
self.onerror = (error) => {
  console.error('>>> Uncaught error in JSCAD worker:', error);
  const errorMessage =
    error instanceof ErrorEvent ? error.message : String(error);
  self.postMessage({
    type: 'error',
    error: `Worker initialization or execution error: ${errorMessage}`,
    caseName: 'unknown',
    requestId: 'unknown',
    configVersion: -1,
  });
  return true; // Prevent default error handling
};

/**
 * Converts a JSCAD script to STL format.
 * This function uses the global myjscad library (from openjscad.js)
 * to compile the JSCAD script and generate STL output.
 *
 * @param jscadScript - The JSCAD script as a string
 * @returns A promise that resolves to the STL content as a string, or null if conversion fails
 */
const convertJscadToStl = async (
  jscadScript: string
): Promise<string | null> => {
  try {
    if (typeof myjscad === 'undefined') {
      console.error('myjscad library is not loaded in worker');
      return null;
    }

    if (!jscadScript || jscadScript.trim() === '') {
      console.error('JSCAD script is empty');
      return null;
    }

    // Initialize the processor
    myjscad.setup();

    // Compile the JSCAD script
    await myjscad.compile(jscadScript);

    // Generate STL output (ASCII format)
    // Format 'stla' is ASCII STL
    const output = myjscad.generateOutput('stla', null);

    // Extract the string from the wrapped result
    const stlContent = output.asBuffer().toString();

    if (!stlContent || stlContent.trim() === '') {
      console.error('Generated STL content is empty');
      return null;
    }

    return stlContent;
  } catch (error) {
    console.error('Error converting JSCAD to STL:', error);
    return null;
  }
};

/**
 * Main worker message handler.
 */
self.onmessage = async (event: MessageEvent<JscadWorkerRequest>) => {
  const { type, jscadScript, caseName, requestId, configVersion } =
    event.data || {};

  console.log(
    `<<< JSCAD worker received a message: type=${type}, caseName=${caseName}, requestId=${requestId}`
  );

  if (type !== 'convert') {
    console.log('>>> Unknown message type:', type);
    self.postMessage({
      type: 'error',
      error: `Unknown message type: ${type}`,
      caseName: caseName || 'unknown',
      requestId: requestId || 'unknown',
      configVersion: configVersion || -1,
    });
    return;
  }

  try {
    console.log(`<-> Converting JSCAD to STL for case: ${caseName}`);
    const stl = await convertJscadToStl(jscadScript);
    console.log(
      `>>> JSCAD conversion ${stl ? 'succeeded' : 'failed'} for case: ${caseName}`
    );

    // Post success message with STL result
    self.postMessage({
      type: 'success',
      stl,
      caseName,
      requestId,
      configVersion,
    });
  } catch (error: unknown) {
    console.error('>>> JSCAD worker encountered an error: ', error);
    const errorMessage =
      error instanceof ErrorEvent ? error.message : String(error);
    self.postMessage({
      type: 'error',
      error: errorMessage,
      caseName,
      requestId,
      configVersion,
    });
  }
};

export {};
