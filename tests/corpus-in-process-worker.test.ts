import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { WorkerRequest } from '../src/workers/ergogen.worker.types';

// The worker module is replaced by one whose handler misbehaves on purpose.
// Each case registers it again and loads a fresh adapter, so the adapter
// imports the module anew.
const worker = {
  importError: undefined as Error | undefined,
  handler: (() => undefined) as (event: MessageEvent) => unknown,
};
const workerModule = () => {
  self.onmessage = (event) => worker.handler(event);
  self.onerror = () => true;
  console.log('worker module starting');
  if (worker.importError) throw worker.importError;
  return {};
};

const request: WorkerRequest = {
  type: 'generate',
  inputConfig: {},
  injectionInput: [],
  requestId: 'adapter',
  options: { debug: false },
};

const loadAdapter = () => import('./corpus/inProcessWorker');

/** Posts one request and settles with whichever callback fires first. */
const postAndWait = async (): Promise<ErrorEvent> => {
  const { InProcessErgogenWorker } = await loadAdapter();
  const inProcess = new InProcessErgogenWorker();
  return new Promise<ErrorEvent>((resolve, reject) => {
    inProcess.onerror = resolve;
    inProcess.onmessage = (event) =>
      reject(new Error(`Unexpected reply ${JSON.stringify(event.data)}`));
    inProcess.postMessage(request);
  });
};

beforeEach(() => {
  vi.resetModules();
  vi.doMock('../src/workers/ergogen.worker', workerModule);
  worker.importError = undefined;
  worker.handler = () => undefined;
});

describe('in-process Ergogen worker adapter', () => {
  it('reports a handler that throws as a worker error at once', async () => {
    // Arrange
    worker.handler = () => {
      throw new Error('handler exploded');
    };
    // Act
    const error = await postAndWait();
    // Assert
    expect(error).toBeInstanceOf(ErrorEvent);
    expect(error.message).toBe('handler exploded');
  }, 1000);

  it('reports a handler that never replies as a worker error at once', async () => {
    // Act
    const error = await postAndWait();
    // Assert
    expect(error.message).toBe('Expected one worker reply, got 0');
  }, 1000);

  it('stays silent after terminate', async () => {
    // Arrange
    worker.handler = () => {
      throw new Error('handler exploded');
    };
    const { InProcessErgogenWorker, generate } = await loadAdapter();
    const inProcess = new InProcessErgogenWorker();
    inProcess.onerror = vi.fn();
    inProcess.onmessage = vi.fn();
    // Act
    inProcess.postMessage(request);
    inProcess.terminate();
    // Requests run in order, so this settles after the terminated one.
    await expect(generate('{}')).rejects.toThrow('handler exploded');
    // Assert
    expect(inProcess.onerror).not.toHaveBeenCalled();
    expect(inProcess.onmessage).not.toHaveBeenCalled();
  }, 1000);

  it('restores globals when the worker module fails to import, then retries', async () => {
    // Arrange
    const onmessage = self.onmessage;
    const onerror = self.onerror;
    const log = console.log;
    const importError = new Error('import failed');
    worker.importError = importError;
    const { generate } = await loadAdapter();
    // Act: Vitest wraps errors thrown while evaluating a mocked module.
    await expect(generate('{}')).rejects.toHaveProperty('cause', importError);
    // Assert
    expect(self.onmessage).toBe(onmessage);
    expect(self.onerror).toBe(onerror);
    expect(console.log).toBe(log);
    // Act: the next request imports the module again.
    worker.importError = undefined;
    worker.handler = (event: MessageEvent<WorkerRequest>) =>
      self.postMessage({
        type: 'error',
        error: 'retried',
        requestId: event.data.requestId,
      });
    // Assert
    await expect(generate('{}')).resolves.toMatchObject({
      type: 'error',
      error: 'retried',
    });
  }, 1000);
});
