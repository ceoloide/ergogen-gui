/**
 * Type definitions for messages between the Ergogen worker and main thread.
 */

export type WorkerRequest = {
  type: 'generate';
  inputConfig: string | object;
  injectionInput?: string[][];
  /** Unique id to correlate requests and responses */
  requestId: string;
  options: {
    debug: boolean;
  };
};

export type WorkerResponse =
  | {
      type: 'success';
      results: unknown;
      warnings: string[];
      /** Echo of the originating request id */
      requestId: string;
    }
  | {
      type: 'error';
      error: string;
      /** Echo of the originating request id */
      requestId: string;
    };
