/**
 * Factory function for creating the Ergogen worker.
 * This is separated to make it easier to mock in tests.
 */

export const createErgogenWorker = (): Worker | null => {
  // Only create worker in browser environment
  if (typeof window === 'undefined' || !('Worker' in window)) {
    return null;
  }

  try {
    // Use the new URL syntax to let Webpack bundle the worker
    return new Worker(new URL('./ergogen.worker.ts', import.meta.url));
  } catch (e) {
    console.error('Failed to create worker:', e);
    return null;
  }
};

/**
 * Factory function for creating the JSCAD worker.
 * This is separated to make it easier to mock in tests.
 */

export const createJscadWorker = (): Worker | null => {
  // Only create worker in browser environment
  if (typeof window === 'undefined' || !('Worker' in window)) {
    return null;
  }

  try {
    // Use the new URL syntax to let Webpack bundle the worker
    return new Worker(new URL('./jscad.worker.ts', import.meta.url));
  } catch (e) {
    console.error('Failed to create JSCAD worker:', e);
    return null;
  }
};
