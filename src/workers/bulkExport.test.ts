import type { Mock } from 'vitest';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportConfigsProgressively } from './bulkExport';
vi.mock('jszip', () => ({
  default: vi.fn(),
}));
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}));
const mockCreateErgogenWorker = vi.fn<() => Worker | null>(() => null);
const mockCreateJscadWorker = vi.fn<() => Worker | null>(() => null);
vi.mock('./workerFactory', () => ({
  createErgogenWorker: () => mockCreateErgogenWorker(),
  createJscadWorker: () => mockCreateJscadWorker(),
}));

const mockIsFeatureEnabled = vi.fn<(feature: string) => boolean>(() => true);
vi.mock('../utils/featureFlags', () => ({
  isFeatureEnabled: (feature: string) => mockIsFeatureEnabled(feature),
}));

// Mock Blob since it might not be available in the test environment as expected
if (typeof Blob === 'undefined') {
  (global as any).Blob = class MockBlob {
    constructor(public parts: any[]) {}
  };
}

describe('exportConfigsProgressively', () => {
  let mockZip: any;
  let mockFolders: Record<string, any>;

  const createMockFolder = () => {
    const folder: any = {
      file: vi.fn().mockReturnThis(),
      folder: vi.fn(),
    };
    folder.folder.mockImplementation((name: string) => {
      if (!mockFolders[name]) {
        mockFolders[name] = createMockFolder();
      }
      return mockFolders[name];
    });
    return folder;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFolders = {};
    mockZip = {
      file: vi.fn().mockReturnThis(),
      folder: vi.fn().mockImplementation((name: string) => {
        if (!mockFolders[name]) {
          mockFolders[name] = createMockFolder();
        }
        return mockFolders[name];
      }),
      generateAsync: vi
        .fn()
        .mockResolvedValue(new Blob(['mock progressive zip'])),
    };
    (JSZip as unknown as Mock).mockImplementation(() => mockZip);
    mockCreateErgogenWorker.mockReset().mockReturnValue(null);
    mockCreateJscadWorker.mockReset().mockReturnValue(null);
    mockIsFeatureEnabled.mockReset().mockReturnValue(true);
  });

  it('returns failedCount when full-compilation configs fail and write error.txt', async () => {
    // Arrange: createErgogenWorker returns null, causing each config compilation to fail
    const configs = [
      { name: 'Broken One', config: 'invalid: [' },
      { name: 'Broken Two', config: 'invalid: {' },
    ];

    // Act
    const summary = await exportConfigsProgressively(
      configs,
      [],
      false,
      false,
      false, // onlyConfigs = false -> compiles each config
      vi.fn(),
      () => false
    );

    // Assert
    expect(summary).toEqual({ succeededCount: 0, failedCount: 2 });
    expect(mockFolders['Broken One'].file).toHaveBeenCalledWith(
      'error.txt',
      expect.stringContaining('Compilation failed:')
    );
  });

  it('includes configs in root and packages injections in configs-only mode', async () => {
    const configs = [
      { name: 'Ergonomic Board', config: 'points: {}' },
      { name: 'Keyboard/Alpha', config: 'points: { alpha: true }' },
    ];
    const injections = [
      ['footprint', 'deep/foot', 'foot-content'],
      ['outline', 'out-1', 'outline-content'],
      ['template', 'temp-1', 'template-content'],
    ];

    const summary = await exportConfigsProgressively(
      configs,
      injections,
      false,
      false,
      true,
      vi.fn(),
      () => false
    );

    expect(summary).toEqual({ succeededCount: 2, failedCount: 0 });
    expect(mockZip.file).toHaveBeenCalledWith(
      'Ergonomic Board.yaml',
      'points: {}'
    );
    expect(mockZip.file).toHaveBeenCalledWith(
      'Keyboard_Alpha.yaml',
      'points: { alpha: true }'
    );

    expect(mockZip.folder).toHaveBeenCalledWith('footprints');
    expect(mockFolders['footprints'].folder).toHaveBeenCalledWith('deep');
    expect(mockFolders['deep'].file).toHaveBeenCalledWith(
      'foot.js',
      'foot-content'
    );
    expect(mockFolders['outlines'].file).toHaveBeenCalledWith(
      'out-1.js',
      'outline-content'
    );
    expect(mockFolders['templates'].file).toHaveBeenCalledWith(
      'temp-1.js',
      'template-content'
    );
    expect(saveAs).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringMatching(/^ergogen-config-all-\d{4}-\d{2}-\d{2}\.zip$/)
    );
  });

  it('respects stlPreview=false and stlPreview=true in full compilation mode', async () => {
    const ergogenRequests: any[] = [];
    const jscadRequests: any[] = [];

    mockCreateErgogenWorker.mockImplementation(() => {
      const worker: any = {
        onmessage: null,
        onerror: null,
        terminate: vi.fn(),
        postMessage: vi.fn((req: any) => {
          ergogenRequests.push(req);
          queueMicrotask(() => {
            worker.onmessage?.({
              data: {
                type: 'success',
                requestId: req.requestId,
                results: { cases: { left: { jscad: 'jscad-code' } } },
                warnings: [],
              },
            });
          });
        }),
      };
      return worker;
    });

    mockCreateJscadWorker.mockImplementation(() => {
      const worker: any = {
        onmessage: null,
        onerror: null,
        terminate: vi.fn(),
        postMessage: vi.fn((req: any) => {
          jscadRequests.push(req);
          queueMicrotask(() => {
            worker.onmessage?.({
              data: {
                type: 'success',
                results: {
                  cases: { left: { jscad: 'jscad-code', stl: 'stl-data' } },
                },
                configVersion: req.configVersion,
              },
            });
          });
        }),
      };
      return worker;
    });

    const configs = [{ name: 'BoardA', config: 'points: {}' }];

    await exportConfigsProgressively(
      configs,
      undefined,
      false,
      false,
      false,
      vi.fn(),
      () => false
    );

    expect(mockCreateJscadWorker).not.toHaveBeenCalled();
    expect(mockFolders['cases'].file).toHaveBeenCalledWith(
      'left.jscad',
      'jscad-code'
    );
    expect(mockFolders['cases'].file).not.toHaveBeenCalledWith(
      'left.stl',
      expect.anything()
    );

    vi.clearAllMocks();
    mockFolders = {};

    await exportConfigsProgressively(
      configs,
      undefined,
      false,
      true,
      false,
      vi.fn(),
      () => false
    );

    expect(mockCreateJscadWorker).toHaveBeenCalledTimes(1);
    expect(jscadRequests).toHaveLength(1);
    expect(mockFolders['cases'].file).toHaveBeenCalledWith(
      'left.stl',
      'stl-data'
    );
  });

  it('filters worker injections by feature flags while keeping user injections in archive and sends debug option', async () => {
    mockIsFeatureEnabled.mockImplementation((f: string) => f !== 'outlines');
    const ergogenRequests: any[] = [];

    mockCreateErgogenWorker.mockImplementation(() => {
      const worker: any = {
        onmessage: null,
        onerror: null,
        terminate: vi.fn(),
        postMessage: vi.fn((req: any) => {
          ergogenRequests.push(req);
          queueMicrotask(() => {
            worker.onmessage?.({
              data: {
                type: 'success',
                requestId: req.requestId,
                results: {},
                warnings: [],
              },
            });
          });
        }),
      };
      return worker;
    });

    const injections = [
      ['footprint', 'fp1', 'fp-content'],
      ['outline', 'disabled_out', 'outline-content'],
    ];

    await exportConfigsProgressively(
      [{ name: 'FlagBoard', config: 'points: {}' }],
      injections,
      true,
      false,
      false,
      vi.fn(),
      () => false
    );

    expect(ergogenRequests).toHaveLength(1);
    expect(ergogenRequests[0].injectionInput).toEqual([
      ['footprint', 'fp1', 'fp-content'],
    ]);
    expect(ergogenRequests[0].options).toEqual({ debug: true });
    expect(mockFolders['outlines'].file).toHaveBeenCalledWith(
      'disabled_out.js',
      'outline-content'
    );
  });

  it('deduplicates colliding sanitized folder names in full compilation mode', async () => {
    mockCreateErgogenWorker.mockImplementation(() => {
      const worker: any = {
        onmessage: null,
        onerror: null,
        terminate: vi.fn(),
        postMessage: vi.fn((req: any) => {
          queueMicrotask(() => {
            worker.onmessage?.({
              data: {
                type: 'success',
                requestId: req.requestId,
                results: {},
                warnings: [],
              },
            });
          });
        }),
      };
      return worker;
    });

    const summary = await exportConfigsProgressively(
      [
        { name: 'Board/A', config: 'points: { first: {} }' },
        { name: 'Board_A', config: 'points: { second: {} }' },
      ],
      undefined,
      false,
      false,
      false,
      vi.fn(),
      () => false
    );

    expect(summary).toEqual({ succeededCount: 2, failedCount: 0 });
    expect(mockZip.folder).toHaveBeenCalledWith('Board_A');
    expect(mockZip.folder).toHaveBeenCalledWith('Board_A_1');
    expect(mockFolders['Board_A'].file).toHaveBeenCalledWith(
      'config.yaml',
      'points: { first: {} }'
    );
    expect(mockFolders['Board_A_1'].file).toHaveBeenCalledWith(
      'config.yaml',
      'points: { second: {} }'
    );
  });
});
