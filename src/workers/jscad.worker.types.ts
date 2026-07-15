/**
 * Type definitions for messages between the JSCAD worker and main thread.
 *
 * The worker processes JSCAD to STL conversions in batches to avoid race conditions
 * and ensure results are applied in the correct order using config version tracking.
 */

import { Results } from '../types/results';

/**
 * Request sent to JSCAD worker to convert JSCAD cases to STL format.
 * The full `results` object is provided so the worker can update it in-place and return it.
 */
export type JscadWorkerRequest = {
  type: 'batch_jscad_to_stl';
  /** Full results object that may contain `cases` with JSCAD strings */
  results: Results;
  /** Config version to track which generation this batch belongs to */
  configVersion: number;
};

/**
 * Response from JSCAD worker after processing a batch conversion.
 */
export type JscadWorkerResponse = {
  type: 'success' | 'error';
  /** On success, contains the entire results object with updated cases */
  results?: Results;
  /** On error, contains the error message */
  error?: string;
  /** Echo of the config version from the request */
  configVersion: number;
};
