import yaml from 'js-yaml';
import type {
  WorkerRequest,
  WorkerResponse,
} from '../../src/workers/ergogen.worker.types';

/**
 * Runs the app's real Ergogen worker module (src/workers/ergogen.worker.ts) in
 * the Vitest process. Vitest has no Web Worker runtime, so only the transport
 * is replaced: each request goes to the worker's own `onmessage` handler, which
 * evaluates injections with the app's evaluator and calls the prepared engine,
 * and the handler's single `postMessage` reply is returned. Requests run one at
 * a time because the handler replies through the global `self.postMessage`.
 *
 * The worker module is imported once per test file, so every request and every
 * `InProcessErgogenWorker` in a file share one engine, whereas bulk export in
 * the browser starts a fresh worker per config. Footprints injected by one
 * request stay registered for later ones; a test that must prove its own
 * injections are passed uses a footprint name no other request injects.
 */
type WorkerHandler = (event: MessageEvent<WorkerRequest>) => unknown;

let handlerPromise: Promise<WorkerHandler> | undefined;

const loadWorkerHandler = (): Promise<WorkerHandler> => {
  handlerPromise ??= (async () => {
    // The module installs global handlers on import; keep only its message
    // handler and restore the globals, even if the import fails, so other
    // tests see a clean window.
    const previousOnMessage = self.onmessage;
    const previousOnError = self.onerror;
    const originalLog = console.log;
    console.log = () => undefined;
    try {
      await import('../../src/workers/ergogen.worker');
      return self.onmessage as unknown as WorkerHandler;
    } finally {
      console.log = originalLog;
      self.onmessage = previousOnMessage;
      self.onerror = previousOnError;
    }
  })().catch((error: unknown) => {
    // Let the next request try the import again.
    handlerPromise = undefined;
    throw error;
  });
  return handlerPromise;
};

let queue: Promise<unknown> = Promise.resolve();

const runWorkerRequest = (request: WorkerRequest): Promise<WorkerResponse> => {
  const run = async (): Promise<WorkerResponse> => {
    const handler = await loadWorkerHandler();
    const replies: WorkerResponse[] = [];
    const originalPostMessage = self.postMessage;
    const originalLog = console.log;
    const originalError = console.error;
    self.postMessage = ((message: WorkerResponse) => {
      replies.push(message);
    }) as typeof self.postMessage;
    // The worker logs every request in full; failures still come back as
    // replies, so silencing its console loses no information.
    console.log = () => undefined;
    console.error = () => undefined;
    try {
      await handler({ data: request } as MessageEvent<WorkerRequest>);
    } finally {
      self.postMessage = originalPostMessage;
      console.log = originalLog;
      console.error = originalError;
    }
    if (replies.length !== 1) {
      throw new Error(`Expected one worker reply, got ${replies.length}`);
    }
    return replies[0];
  };
  const result = queue.then(run);
  queue = result.catch(() => undefined);
  return result;
};

// Like ConfigContext `runGeneration`, parse YAML on the main thread and post
// the raw text instead when parsing fails, so the engine reports the error.
const parseLikeTheApp = (configText: string): string | object => {
  try {
    return (yaml.load(configText) as object | undefined) ?? configText;
  } catch {
    return configText;
  }
};

/** Generates a configuration the way the editor does. */
export const generate = (
  configText: string,
  injectionInput: string[][] = []
): Promise<WorkerResponse> =>
  runWorkerRequest({
    type: 'generate',
    inputConfig: parseLikeTheApp(configText),
    injectionInput,
    requestId: 'corpus',
    options: { debug: false },
  });

/**
 * The `Worker` surface that src/utils/zip.ts uses, backed by
 * `runWorkerRequest`. Return it from a mocked `createErgogenWorker`.
 */
export class InProcessErgogenWorker {
  onmessage: ((event: MessageEvent<WorkerResponse>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  private terminated = false;

  postMessage(request: WorkerRequest): void {
    runWorkerRequest(request).then(
      (response) => {
        if (!this.terminated) {
          this.onmessage?.({ data: response } as MessageEvent<WorkerResponse>);
        }
      },
      // A handler that throws or does not reply reaches the caller as a
      // worker error event at once, instead of waiting for its timeout.
      (error: unknown) => {
        if (!this.terminated) {
          this.onerror?.(
            new ErrorEvent('error', {
              error,
              message: error instanceof Error ? error.message : String(error),
            })
          );
        }
      }
    );
  }

  terminate(): void {
    this.terminated = true;
  }
}
