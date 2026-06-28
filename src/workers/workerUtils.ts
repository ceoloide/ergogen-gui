/**
 * Utility functions for workers to make them easier to test.
 */

/**
 * Checks if Web Workers are supported in the current environment.
 */
export const isWorkerSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Worker' in window;
};

/**
 * Handles errors during worker creation.
 */
export const handleWorkerError = (e: any, message: string): null => {
  console.error(message, e);
  return null;
};
