import { PointsPreviewClient, PreviewResult } from './previewClient';
import type { PointsWorkerRequest } from '../../workers/points.worker.types';
import type { Layout } from './pointsPreview';

class FakeWorker {
  posted: PointsWorkerRequest[] = [];
  terminated = false;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  postMessage(message: PointsWorkerRequest) {
    this.posted.push(message);
  }
  terminate() {
    this.terminated = true;
  }
  answer(index: number, layout: Partial<Layout> = {}) {
    const { id } = this.posted[index];
    this.onmessage?.({
      data: { id, type: 'success', layout: layout as Layout },
    } as MessageEvent);
  }
}

const setup = () => {
  const workers: FakeWorker[] = [];
  const results: PreviewResult[] = [];
  const client = new PointsPreviewClient(
    () => {
      const worker = new FakeWorker();
      workers.push(worker);
      return worker as unknown as Worker;
    },
    (result) => results.push(result)
  );
  return { client, workers, results };
};

describe('PointsPreviewClient', () => {
  it('sends only the latest of the requests made while one runs', () => {
    // Arrange
    const { client, workers, results } = setup();

    // Act
    client.request('a');
    client.request('b');
    client.request('c');
    workers[0].answer(0);
    workers[0].answer(1);

    // Assert
    expect(workers[0].posted.map((message) => message.text)).toEqual([
      'a',
      'c',
    ]);
    expect(results.map((result) => result.text)).toEqual(['c']);
  });

  it('ignores answers to requests it no longer waits for', () => {
    // Arrange
    const { client, workers, results } = setup();
    client.request('a');

    // Act
    workers[0].onmessage?.({
      data: { id: 999, type: 'success', layout: {} },
    } as MessageEvent);

    // Assert
    expect(results).toEqual([]);
  });

  it('reports engine errors and replaces a crashed worker', () => {
    // Arrange
    const { client, workers, results } = setup();
    client.request('bad');

    // Act
    workers[0].onmessage?.({
      data: { id: workers[0].posted[0].id, type: 'error', error: 'boom' },
    } as MessageEvent);
    client.request('crash');
    workers[0].onerror?.({ message: 'died' } as ErrorEvent);
    client.request('again');

    // Assert
    expect(results).toEqual([
      { text: 'bad', error: 'boom' },
      { text: 'crash', error: 'died' },
    ]);
    expect(workers[0].terminated).toBe(true);
    expect(workers[1].posted[0].text).toBe('again');
  });

  it('stops delivering after dispose', () => {
    // Arrange
    const { client, workers, results } = setup();
    client.request('a');

    // Act
    client.dispose();
    workers[0].answer(0);

    // Assert
    expect(results).toEqual([]);
    expect(workers[0].terminated).toBe(true);
  });
});
