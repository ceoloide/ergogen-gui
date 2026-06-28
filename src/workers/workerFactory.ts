import { isWorkerSupported, handleWorkerError } from './workerUtils';

/**
 * Factory function for creating the Ergogen worker.
 * This is separated to make it easier to mock in tests.
 */
export const createErgogenWorker = (): Worker | null => {
  // Only create worker in browser environment
  if (!isWorkerSupported()) {
    return null;
  }

  try {
    // Use the new URL syntax to let Webpack bundle the worker
    return new Worker(new URL('./ergogen.worker.ts', import.meta.url));
  } catch (e) {
    return handleWorkerError(e, 'Failed to create worker:');
  }
};

/**
 * Factory function for creating the JSCAD to STL worker.
 */
export const createJscadWorker = (): Worker | null => {
  // Only create worker in browser environment
  if (!isWorkerSupported()) {
    return null;
  }

  try {
    // Use the new URL syntax to let Webpack bundle the worker
    return new Worker(new URL('./jscad.worker.ts', import.meta.url));
  } catch (e) {
    return handleWorkerError(e, 'Failed to create JSCAD worker:');
  }
};
