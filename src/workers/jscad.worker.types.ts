/**
 * Type definitions for messages between the JSCAD worker and main thread.
 *
 * The worker processes JSCAD to STL conversions in batches to avoid race conditions
 * and ensure results are applied in the correct order using config version tracking.
 */

/**
 * Minimal structural types to describe the results payload shared with the worker.
 * We only care about the shape of `cases`; all other keys are passed through.
 */
type JscadCase = { jscad?: string; stl?: string | ArrayBuffer | Uint8Array };
type JscadCases = Record<string, JscadCase>;
export type ResultsLike = { cases?: JscadCases; [key: string]: unknown };

/**
 * Request sent to JSCAD worker to convert JSCAD cases to STL format.
 * The full `results` object is provided so the worker can update it in-place and return it.
 */
export type JscadWorkerRequest = {
  type: 'batch_jscad_to_stl';
  /** Full results object that may contain `cases` with JSCAD strings */
  results: ResultsLike;
  /** Config version to track which generation this batch belongs to */
  configVersion: number;
};

/**
 * Response from JSCAD worker after processing a batch conversion.
 */
export type JscadWorkerResponse = {
  type: 'success' | 'error';
  /** On success, contains the entire results object with updated cases */
  results?: ResultsLike;
  /** On error, contains the error message */
  error?: string;
  /** Echo of the config version from the request */
  configVersion: number;
};
