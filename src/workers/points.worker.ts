/**
 * Lays out keys for the Build view with Ergogen's points stage only. It is a
 * separate, quiet worker so that builder previews never queue behind (or show
 * up in the logs of) full generations in the Ergogen worker.
 */
import { computeLayout } from '../utils/builder/pointsPreview';
import type {
  PointsWorkerRequest,
  PointsWorkerResponse,
} from './points.worker.types';

self.onmessage = (event: MessageEvent<PointsWorkerRequest>) => {
  const { id, text } = event.data;
  let response: PointsWorkerResponse;
  try {
    response = { id, type: 'success', layout: computeLayout(text) };
  } catch (error: unknown) {
    response = {
      id,
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    };
  }
  self.postMessage(response);
};

export {};
