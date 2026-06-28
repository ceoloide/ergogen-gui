/* eslint-env worker */
/* global self */

import * as ergogen from 'ergogen';
import { WorkerRequest } from './ergogen.worker.types';

console.log('<-> Ergogen worker module starting...');

/**
 * Error handler for uncaught errors in the worker.
 */
self.onerror = (error) => {
  console.error('>>> Uncaught error in Ergogen worker:', error);
  const errorMessage =
    error instanceof ErrorEvent ? error.message : String(error);
  self.postMessage({
    type: 'error',
    error: `Ergogen worker initialization or execution error: ${errorMessage}`,
  });
  return true; // Prevent default error handling
};

/**
 * Handles code injections if provided.
 * @returns true if injections were successful or not provided, false if an error occurred.
 */
const applyInjections = (
  injectionInput: string[][] | undefined,
  requestId: string | undefined
): boolean => {
  if (!injectionInput || !Array.isArray(injectionInput)) {
    return true;
  }

  for (const injection of injectionInput) {
    if (Array.isArray(injection) && injection.length === 3) {
      const [inj_type, inj_name, inj_text] = injection;
      const module_prefix = 'const module = {};\n\n';
      const module_suffix = '\n\nreturn module.exports;';
      try {
        const inj_value = new Function(
          'require',
          module_prefix + inj_text + module_suffix
        )();
        ergogen.inject(inj_type, inj_name, inj_value);
      } catch (injectionError: unknown) {
        self.postMessage({
          type: 'error',
          error: (injectionError as Error).message || String(injectionError),
          requestId,
        });
        return false;
      }
    }
  }
  return true;
};

/**
 * Processes the Ergogen generation request.
 */
const processGeneration = async (request: WorkerRequest) => {
  const { inputConfig, injectionInput, requestId } = request;
  const warnings: string[] = [];

  try {
    // Handle code injections if provided
    if (!applyInjections(injectionInput, requestId)) {
      return;
    }

    // Run Ergogen generation
    console.log('<-> Running Ergogen in worker');
    const results = await ergogen.process(
      inputConfig,
      { debug: true, svg: true }, // Debug option enabled to ensure `demo.dxf` is generated
      (m: string) => console.log(m) // logger
    );
    console.log('>>> Ergogen finished in worker');

    // Post success message with results and warnings
    self.postMessage({
      type: 'success',
      results,
      warnings,
      requestId,
    });
  } catch (error: unknown) {
    console.error('>>> Ergogen encountered an error: ', error);
    const errorMessage =
      error instanceof ErrorEvent ? error.message : String(error);
    self.postMessage({
      type: 'error',
      error: errorMessage,
      requestId,
    });
  }
};

/**
 * Main worker message handler.
 */
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { type, requestId } = event.data || {};

  console.log(
    `<<< Ergogen worker received a message: ${JSON.stringify(event.data)}`
  );

  if (type !== 'generate') {
    console.log('>>> Unknown message type:', type);
    self.postMessage({
      type: 'error',
      error: `Unknown message type: ${type}`,
      requestId,
    });
    return;
  }

  await processGeneration(event.data);
};

export {};
