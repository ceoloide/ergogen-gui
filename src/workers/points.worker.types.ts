/**
 * Messages between the builder's points preview worker and the main thread.
 */
import type { Layout } from '../utils/builder/pointsPreview';

export type PointsWorkerRequest = {
  /** Increasing id; the client only uses the answer to its latest request. */
  id: number;
  text: string;
};

export type PointsWorkerResponse =
  | { id: number; type: 'success'; layout: Layout }
  | { id: number; type: 'error'; error: string };
