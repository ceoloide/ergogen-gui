import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Mock, MockInstance } from 'vitest';

import App from './App';
import * as analytics from './utils/analytics';
import * as github from './utils/github';
import * as workerFactory from './workers/workerFactory';

// src/setupTests.tsx mocks the router, and the whole app needs real routes.
vi.unmock('react-router-dom');

type FakeWorker = {
  postMessage: Mock<(message: { type: string; requestId?: string }) => void>;
  terminate: Mock<() => void>;
  onmessage: ((event: { data: unknown }) => void) | null;
};

type SavedConfig = { id: string; name: string; config: string };

type Repository = Awaited<ReturnType<typeof github.fetchConfigFromUrl>>;

const boardA: SavedConfig = {
  id: 'a',
  name: 'Board A',
  config: 'units: {a: 1}',
};
const boardB: SavedConfig = {
  id: 'b',
  name: 'Board B',
  config: 'units: {b: 1}',
};

const AUTO_GENERATE_DEBOUNCE_MS = 300;

let ergogenWorkers: FakeWorker[];
let trackEvent: MockInstance<typeof analytics.trackEvent>;

const createFakeWorker = (): FakeWorker => ({
  postMessage: vi.fn(),
  terminate: vi.fn(),
  onmessage: null,
});

const saveConfigs = (version: number, configs: SavedConfig[]) => {
  const savedAt = '2026-01-01T00:00:00.000Z';
  localStorage.setItem(
    'ergogen:multi-config',
    JSON.stringify({
      version,
      activeConfigId: configs[0].id,
      configs: configs.map((config) => ({
        ...config,
        createdAt: savedAt,
        updatedAt: savedAt,
      })),
    })
  );
};

const openApp = (url = '/') => {
  window.history.replaceState({}, '', url);
  render(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>
  );
};

// React runs the effects of an update when act() ends, so the debounce timer
// that those effects start needs a second act() to run out.
const waitPastAutoGeneration = async () => {
  await act(() => vi.advanceTimersByTimeAsync(AUTO_GENERATE_DEBOUNCE_MS));
  await act(() => vi.advanceTimersByTimeAsync(AUTO_GENERATE_DEBOUNCE_MS));
};

const currentErgogenWorker = (): FakeWorker => {
  const worker = ergogenWorkers.at(-1);
  if (!worker) throw new Error('The app created no Ergogen worker');
  return worker;
};

const generateRequestIds = (worker: FakeWorker): string[] =>
  worker.postMessage.mock.calls
    .map(([message]) => message)
    .filter((message) => message.type === 'generate')
    .map((message) => message.requestId ?? '');

const latestRequestId = (): string => {
  const requestId = generateRequestIds(currentErgogenWorker()).at(-1);
  if (!requestId) throw new Error('The Ergogen worker got no request');
  return requestId;
};

const replyFromErgogen = (requestId: string, response: object) =>
  act(async () => {
    currentErgogenWorker().onmessage?.({ data: { requestId, ...response } });
  });

const replyWithOutline = (requestId: string, outline: string) =>
  replyFromErgogen(requestId, {
    type: 'success',
    warnings: [],
    results: {
      demo: { svg: '<svg></svg>', dxf: 'demo dxf' },
      outlines: { [outline]: { svg: '<svg></svg>', dxf: `${outline} dxf` } },
    },
  });

const replyWithError = (requestId: string, error: string) =>
  replyFromErgogen(requestId, { type: 'error', error });

const listedDxfFiles = (): string[] =>
  screen.queryAllByText(/^\w+\.dxf$/).map((file) => file.textContent ?? '');

const previewLoadedEvents = () =>
  trackEvent.mock.calls.filter(([name]) => name === 'preview_loaded');

const selectConfig = (name: string) => {
  fireEvent.click(screen.getByLabelText('Show navigation panel'));
  fireEvent.click(screen.getByText(name));
};

// Each test renders the whole app, which takes seconds on a busy machine.
describe('generation lifecycle', { timeout: 20000 }, () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    ergogenWorkers = [];
    vi.spyOn(workerFactory, 'createErgogenWorker').mockImplementation(() => {
      const worker = createFakeWorker();
      ergogenWorkers.push(worker);
      return worker as unknown as Worker;
    });
    vi.spyOn(workerFactory, 'createJscadWorker').mockImplementation(
      () => createFakeWorker() as unknown as Worker
    );
    trackEvent = vi.spyOn(analytics, 'trackEvent').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('generates the active configuration once when it loads storage that an older version saved', async () => {
    saveConfigs(1, [boardA]);

    openApp();
    await waitPastAutoGeneration();

    expect(generateRequestIds(currentErgogenWorker())).toEqual([
      expect.stringMatching(/^ergogen-generate-/),
    ]);
  });

  it('skips an auto-generation identical to the request a repository link started', async () => {
    // A load that repeats itself stops at its second fetch instead of looping.
    let answerFetch: (repository: Repository) => void = () => {};
    const fetchConfigFromUrl = vi
      .spyOn(github, 'fetchConfigFromUrl')
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            answerFetch = resolve;
          })
      );

    openApp('/?github=owner/repo');
    await act(async () =>
      answerFetch({
        config: boardA.config,
        footprints: [],
        outlines: [],
        templates: [],
        configPath: 'config.yaml',
      })
    );
    await waitPastAutoGeneration();

    expect(generateRequestIds(currentErgogenWorker())).toEqual([
      expect.stringMatching(/^ergogen-generate-/),
    ]);
    expect(fetchConfigFromUrl).toHaveBeenCalledTimes(1);
  });

  it('resets the outputs when another configuration is selected, even if it fails to compile', async () => {
    saveConfigs(2, [boardA, boardB]);
    openApp();
    await replyWithOutline(latestRequestId(), 'plate_a');
    expect(listedDxfFiles()).toEqual(['demo.dxf', 'plate_a.dxf']);

    selectConfig(boardB.name);
    await waitPastAutoGeneration();
    await replyWithError(latestRequestId(), 'Board B does not compile');

    expect(listedDxfFiles()).toEqual([]);
    expect(screen.getByText('No outputs')).toBeInTheDocument();
  });

  it('discards a response to a request older than the current one', async () => {
    saveConfigs(2, [boardA, boardB]);
    openApp();
    const boardARequest = latestRequestId();

    selectConfig(boardB.name);
    await waitPastAutoGeneration();
    await replyWithOutline(latestRequestId(), 'plate_b');
    await replyWithOutline(boardARequest, 'plate_a');

    expect(listedDxfFiles()).toEqual(['demo.dxf', 'plate_b.dxf']);
  });

  it('recreates the Ergogen worker once when the settings close, not when a setting changes', async () => {
    saveConfigs(2, [boardA]);
    openApp();
    await replyWithOutline(latestRequestId(), 'plate_a');
    const workerBeforeSettings = currentErgogenWorker();

    fireEvent.click(screen.getByLabelText('Show settings panel'));
    fireEvent.click(screen.getByLabelText('Enable STL preview (experimental)'));
    fireEvent.click(screen.getByLabelText('Hide settings panel'));
    await waitPastAutoGeneration();

    expect(workerFactory.createErgogenWorker).toHaveBeenCalledTimes(2);
    expect(workerFactory.createJscadWorker).toHaveBeenCalledTimes(1);
    expect(workerBeforeSettings.terminate).toHaveBeenCalledTimes(1);
    expect(generateRequestIds(currentErgogenWorker())).toEqual([
      expect.stringMatching(/^ergogen-generate-/),
    ]);
    await replyWithOutline(latestRequestId(), 'plate_a');
    expect(listedDxfFiles()).toEqual(['demo.dxf', 'plate_a.dxf']);
  });

  it('tracks preview_loaded once per loaded configuration, not per generation', async () => {
    saveConfigs(2, [boardA, boardB]);
    openApp();
    await replyWithOutline(latestRequestId(), 'plate_a');

    fireEvent.click(screen.getByText('Generate'));
    await replyWithOutline(latestRequestId(), 'plate_a');

    selectConfig(boardB.name);
    await waitPastAutoGeneration();
    await replyWithOutline(latestRequestId(), 'plate_b');

    const demoPreview = { preview_type: 'svg', preview_key: 'demo.svg' };
    expect(previewLoadedEvents()).toEqual([
      ['preview_loaded', demoPreview],
      ['preview_loaded', demoPreview],
    ]);
  });
});
