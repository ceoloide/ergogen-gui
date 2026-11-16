/**
 * Sends layout requests to the points worker, latest request wins: while one
 * request runs, newer ones replace each other, and an answer that a newer
 * request has already made stale is dropped instead of shown. Checks of a
 * candidate text (`check`) share the worker but are never dropped.
 */
import type { Layout } from './pointsPreview';
import type {
  PointsWorkerRequest,
  PointsWorkerResponse,
} from '../../workers/points.worker.types';

export type PreviewResult =
  | { text: string; layout: Layout; error?: undefined }
  | { text: string; error: string; layout?: undefined };

export class PointsPreviewClient {
  private worker: Worker | null = null;
  private nextId = 1;
  private inFlight: { id: number; text: string } | null = null;
  private queued: string | null = null;
  private checks = new Map<
    number,
    { text: string; resolve: (result: PreviewResult) => void }
  >();
  private disposed = false;

  constructor(
    private readonly createWorker: () => Worker | null,
    private readonly onResult: (result: PreviewResult) => void
  ) {}

  request(text: string) {
    if (this.disposed) return;
    if (this.inFlight) {
      this.queued = text;
      return;
    }
    this.send(text);
  }

  /** Lays out `text` once and resolves with the engine's answer. */
  check(text: string): Promise<PreviewResult> {
    return new Promise((resolve) => {
      const worker = this.disposed ? null : this.ensureWorker();
      if (!worker) {
        resolve({ text, error: 'Layout preview is not available here.' });
        return;
      }
      const message: PointsWorkerRequest = { id: this.nextId++, text };
      this.checks.set(message.id, { text, resolve });
      worker.postMessage(message);
    });
  }

  dispose() {
    this.disposed = true;
    this.worker?.terminate();
    this.worker = null;
    this.failChecks('The layout preview was closed.');
  }

  private failChecks(error: string) {
    const checks = Array.from(this.checks.values());
    this.checks.clear();
    for (const { text, resolve } of checks) resolve({ text, error });
  }

  private ensureWorker(): Worker | null {
    if (this.worker) return this.worker;
    const worker = this.createWorker();
    if (!worker) return null;
    worker.onmessage = (event: MessageEvent<PointsWorkerResponse>) =>
      this.handleResponse(event.data);
    worker.onerror = (event: ErrorEvent) => {
      event.preventDefault?.();
      const failed = this.inFlight;
      // A crashed worker cannot be trusted with the next request.
      this.worker?.terminate();
      this.worker = null;
      this.inFlight = null;
      this.failChecks(
        event.message || 'The layout preview stopped unexpectedly.'
      );
      if (failed) {
        this.deliverOrContinue({
          text: failed.text,
          error: event.message || 'The layout preview stopped unexpectedly.',
        });
      }
    };
    this.worker = worker;
    return worker;
  }

  private send(text: string) {
    const worker = this.ensureWorker();
    if (!worker) {
      this.onResult({ text, error: 'Layout preview is not available here.' });
      return;
    }
    const message: PointsWorkerRequest = { id: this.nextId++, text };
    this.inFlight = { id: message.id, text };
    worker.postMessage(message);
  }

  private handleResponse(response: PointsWorkerResponse) {
    const check = this.checks.get(response.id);
    if (check) {
      this.checks.delete(response.id);
      check.resolve(
        response.type === 'success'
          ? { text: check.text, layout: response.layout }
          : { text: check.text, error: response.error }
      );
      return;
    }
    if (this.disposed || response.id !== this.inFlight?.id) return;
    const { text } = this.inFlight;
    this.inFlight = null;
    this.deliverOrContinue(
      response.type === 'success'
        ? { text, layout: response.layout }
        : { text, error: response.error }
    );
  }

  private deliverOrContinue(result: PreviewResult) {
    if (this.disposed) return;
    const queued = this.queued;
    this.queued = null;
    if (queued !== null && queued !== result.text) {
      this.send(queued);
      return;
    }
    this.onResult(result);
  }
}
