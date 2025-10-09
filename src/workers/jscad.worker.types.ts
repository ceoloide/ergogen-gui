/**
 * Type definitions for messages between the JSCAD worker and main thread.
 */

export type JscadWorkerRequest = {
  type: 'convert';
  jscadScript: string;
  caseName: string;
  /** Unique id to correlate requests and responses */
  requestId: string;
  /** Config version to ensure we only process current version */
  configVersion: number;
};

export type JscadWorkerResponse =
  | {
      type: 'success';
      stl: string | null;
      caseName: string;
      /** Echo of the originating request id */
      requestId: string;
      /** Config version this response is for */
      configVersion: number;
    }
  | {
      type: 'error';
      error: string;
      caseName: string;
      /** Echo of the originating request id */
      requestId: string;
      /** Config version this response is for */
      configVersion: number;
    };
