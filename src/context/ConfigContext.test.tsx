import type { Mock } from 'vitest';
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { act } from 'react';
import { useConfigContext } from './ConfigContext';

// Mock the worker factory to prevent worker creation in tests
const mockErgogenWorker = {
  postMessage: vi.fn(),
  terminate: vi.fn(),
  onmessage: (_e: any) => {},
};

const mockJscadWorker = {
  postMessage: vi.fn(),
  terminate: vi.fn(),
  onmessage: (_e: any) => {},
};

import { isFeatureEnabled } from '../utils/featureFlags';

vi.mock('../utils/featureFlags', () => ({
  isFeatureEnabled: vi.fn(() => true),
}));

vi.mock('../workers/workerFactory', () => ({
  createErgogenWorker: () => mockErgogenWorker,
  createJscadWorker: () => mockJscadWorker,
}));

import {
  trackEvent,
  initAnalytics,
  setSendUsageMetricsEnabled,
} from '../utils/analytics';
vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(),
  initAnalytics: vi.fn(),
  setSendUsageMetricsEnabled: vi.fn(),
  getSendUsageMetricsEnabled: () => true,
  checkIsPWA: () => false,
}));

// Mock ergogen globally
global.window.ergogen = {
  process: vi.fn(),
  inject: vi.fn(),
};

import { ConfigContextProvider } from './ConfigContext';

const mockConfig = 'points: {}';

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const TestComponent = () => {
  const context = useConfigContext();
  return (
    <div>
      <div data-testid="context-results">
        {JSON.stringify(context?.results)}
      </div>
      <div data-testid="context-config">{context?.configInput}</div>
    </div>
  );
};

const mockInitialConfig = (config: string) => {
  localStorage.setItem(
    'ergogen:multi-config',
    JSON.stringify({
      version: 2,
      activeConfigId: 'test-active-id',
      configs: [
        {
          id: 'test-active-id',
          name: 'Test Config',
          config: config,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })
  );
};

describe('ConfigContextProvider', () => {
  beforeEach(() => {
    // Clear the URL for each test
    window.history.replaceState({}, 'Test page', '/');
    mockErgogenWorker.postMessage.mockClear();
    mockJscadWorker.postMessage.mockClear();
    (isFeatureEnabled as Mock).mockReturnValue(true);
    localStorage.clear();
  });

  it('should fetch config from github url parameter and update the config', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch').mockImplementation((url) => {
      if (
        url ===
        'https://raw.githubusercontent.com/ceoloide/corney-island/main/ergogen/config.yaml'
      ) {
        return Promise.resolve(new Response(mockConfig, { status: 200 }));
      }
      if (
        typeof url === 'string' &&
        url.includes('api.github.com/repos') &&
        url.includes('footprints')
      ) {
        return Promise.resolve(new Response('[]', { status: 404 }));
      }
      return Promise.resolve(new Response('', { status: 404 }));
    });

    // Set the URL for the test
    window.history.pushState(
      {},
      'Test page',
      '/?github=https://github.com/ceoloide/corney-island/blob/main/ergogen/config.yaml'
    );

    const { getByTestId } = render(
      <ConfigContextProvider>
        <TestComponent />
      </ConfigContextProvider>
    );

    await waitFor(() => {
      expect(getByTestId('context-config').textContent).toBe(mockConfig);
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/ceoloide/corney-island/main/ergogen/config.yaml'
    );

    fetchSpy.mockRestore();
  });

  it('should fetch config from github url parameter without protocol and update the config', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch').mockImplementation((url) => {
      if (
        url ===
        'https://raw.githubusercontent.com/ceoloide/corney-island/main/ergogen/config.yaml'
      ) {
        return Promise.resolve(new Response(mockConfig, { status: 200 }));
      }
      if (
        typeof url === 'string' &&
        url.includes('api.github.com/repos') &&
        url.includes('footprints')
      ) {
        return Promise.resolve(new Response('[]', { status: 404 }));
      }
      return Promise.resolve(new Response('', { status: 404 }));
    });

    // Set the URL for the test
    window.history.pushState(
      {},
      'Test page',
      '/?github=github.com/ceoloide/corney-island/blob/main/ergogen/config.yaml'
    );

    const { getByTestId } = render(
      <ConfigContextProvider>
        <TestComponent />
      </ConfigContextProvider>
    );

    await waitFor(() => {
      expect(getByTestId('context-config').textContent).toBe(mockConfig);
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/ceoloide/corney-island/main/ergogen/config.yaml'
    );

    fetchSpy.mockRestore();
  });

  it('should load footprints from github url parameter and merge them', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch').mockImplementation((url) => {
      if (
        url ===
        'https://raw.githubusercontent.com/ceoloide/test-repo/main/config.yaml'
      ) {
        return Promise.resolve(new Response(mockConfig, { status: 200 }));
      }
      if (
        typeof url === 'string' &&
        url.includes('api.github.com/repos') &&
        url.includes('footprints')
      ) {
        // Return a footprint
        return Promise.resolve(
          new Response(
            JSON.stringify([
              {
                type: 'file',
                name: 'test_footprint.js',
                path: 'footprints/test_footprint.js',
                download_url:
                  'https://raw.githubusercontent.com/ceoloide/test-repo/main/footprints/test_footprint.js',
              },
            ]),
            { status: 200 }
          )
        );
      }
      if (
        url ===
        'https://raw.githubusercontent.com/ceoloide/test-repo/main/footprints/test_footprint.js'
      ) {
        return Promise.resolve(
          new Response('module.exports = {}', { status: 200 })
        );
      }
      if (typeof url === 'string' && url.includes('.gitmodules')) {
        return Promise.resolve(new Response('', { status: 404 }));
      }
      return Promise.resolve(new Response('', { status: 404 }));
    });

    // Set the URL for the test
    window.history.pushState({}, 'Test page', '/?github=ceoloide/test-repo');

    const { getByTestId } = render(
      <ConfigContextProvider>
        <TestComponent />
      </ConfigContextProvider>
    );

    // Wait for config to be set
    await waitFor(() => {
      expect(getByTestId('context-config').textContent).toBe(mockConfig);
    });

    // Verify that the footprint was loaded by checking localStorage
    await waitFor(() => {
      const injections = localStorage.getItem('ergogen:injection');
      expect(injections).toBeTruthy();
      const parsed = JSON.parse(injections as string);
      expect(parsed).toEqual([
        ['footprint', 'test_footprint', 'module.exports = {}'],
      ]);
    });

    fetchSpy.mockRestore();
  });

  describe('STL Conversion', () => {
    it('should batch convert JSCAD to STL when stlPreview is true', async () => {
      localStorage.setItem('ergogen:config:stlPreview', 'true');
      mockInitialConfig(mockConfig);
      const { getByTestId } = render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // 1. Simulate Ergogen worker returning results with a JSCAD case
      const ergogenResults = {
        cases: {
          left: { jscad: 'mock_jscad_code' },
        },
      };

      act(() => {
        mockErgogenWorker.onmessage({
          data: { type: 'success', results: ergogenResults },
        } as MessageEvent);
      });

      // 2. Verify that the JSCAD worker was called with batch request containing full results
      await waitFor(() => {
        expect(mockJscadWorker.postMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'batch_jscad_to_stl',
            results: expect.objectContaining({
              cases: expect.objectContaining({
                left: { jscad: 'mock_jscad_code', stl: undefined },
              }),
            }),
            configVersion: 1,
          })
        );
      });

      // 3. Simulate JSCAD worker returning the batch converted STL
      const stlContent = 'solid mock_stl';
      act(() => {
        mockJscadWorker.onmessage({
          data: {
            type: 'success',
            results: {
              cases: {
                left: {
                  jscad: 'mock_jscad_code',
                  stl: stlContent,
                },
              },
            },
            configVersion: 1,
          },
        } as MessageEvent);
      });

      // 4. Verify that the results were updated with the new STL
      await waitFor(() => {
        const results = JSON.parse(
          getByTestId('context-results').textContent || '{}'
        );
        expect(results.cases.left.stl).toBe(stlContent);
      });
    });

    it('should discard stale STL results from old config versions', async () => {
      localStorage.setItem('ergogen:config:stlPreview', 'true');
      const TestComponentWithTrigger = () => {
        const ctx = useConfigContext();
        return (
          <>
            <div data-testid="context-results">
              {JSON.stringify(ctx?.results)}
            </div>
            <button
              data-testid="trigger-generate"
              onClick={() =>
                ctx?.generateNow(mockConfig, undefined, { pointsonly: false })
              }
            >
              Generate
            </button>
          </>
        );
      };

      mockInitialConfig(mockConfig);
      const { getByTestId } = render(
        <ConfigContextProvider>
          <TestComponentWithTrigger />
        </ConfigContextProvider>
      );

      // 1. Trigger first generation (will set version to 2 since initial load is version 1)
      act(() => {
        getByTestId('trigger-generate').click();
      });

      // 2. Simulate first Ergogen worker response
      const ergogenResults1 = {
        cases: {
          left: { jscad: 'mock_jscad_code_v1' },
        },
      };

      act(() => {
        mockErgogenWorker.onmessage({
          data: { type: 'success', results: ergogenResults1 },
        } as MessageEvent);
      });

      // 3. Verify JSCAD worker was called with version 2
      await waitFor(() => {
        expect(mockJscadWorker.postMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            configVersion: 2,
          })
        );
      });

      // 4. Trigger second generation (will set version to 3)
      act(() => {
        getByTestId('trigger-generate').click();
      });

      // 5. Simulate second Ergogen worker response
      const ergogenResults2 = {
        cases: {
          left: { jscad: 'mock_jscad_code_v2' },
        },
      };

      act(() => {
        mockErgogenWorker.onmessage({
          data: { type: 'success', results: ergogenResults2 },
        } as MessageEvent);
      });

      // 6. Simulate JSCAD worker returning stale results from version 2
      const staleStlContent = 'solid stale_stl';
      act(() => {
        mockJscadWorker.onmessage({
          data: {
            type: 'success',
            results: {
              cases: {
                left: {
                  jscad: 'mock_jscad_code_v1',
                  stl: staleStlContent,
                },
              },
            },
            configVersion: 2, // Old version
          },
        } as MessageEvent);
      });

      // 7. Verify that stale results were NOT applied
      await waitFor(() => {
        const results = JSON.parse(
          getByTestId('context-results').textContent || '{}'
        );
        // STL should still be undefined because stale result was discarded
        expect(results.cases.left.stl).toBeUndefined();
        // But JSCAD should be from version 3
        expect(results.cases.left.jscad).toBe('mock_jscad_code_v2');
      });

      // 8. Now simulate fresh results from version 3
      const freshStlContent = 'solid fresh_stl';
      act(() => {
        mockJscadWorker.onmessage({
          data: {
            type: 'success',
            results: {
              cases: {
                left: {
                  jscad: 'mock_jscad_code_v2',
                  stl: freshStlContent,
                },
              },
            },
            configVersion: 3, // Current version
          },
        } as MessageEvent);
      });

      // 9. Verify that fresh results WERE applied
      await waitFor(() => {
        const results = JSON.parse(
          getByTestId('context-results').textContent || '{}'
        );
        expect(results.cases.left.stl).toBe(freshStlContent);
      });
    });
  });

  describe('Settings Panel Interaction', () => {
    beforeEach(() => {
      mockErgogenWorker.postMessage.mockClear();
      mockErgogenWorker.terminate.mockClear();
      mockJscadWorker.postMessage.mockClear();
      localStorage.clear();
    });

    it('should inhibit auto-generation when showSettings is true', async () => {
      const TestSettingsComponent = () => {
        const ctx = useConfigContext();
        return (
          <>
            <button
              data-testid="toggle-settings"
              onClick={() => ctx?.setShowSettings((prev) => !prev)}
            >
              Toggle Settings
            </button>
            <button
              data-testid="change-injections"
              onClick={() =>
                ctx?.setInjectionInput([['footprint', 'fp1', 'code']])
              }
            >
              Change Injections
            </button>
          </>
        );
      };

      mockInitialConfig('points: {}');
      const { getByTestId } = render(
        <ConfigContextProvider>
          <TestSettingsComponent />
        </ConfigContextProvider>
      );

      // Verify initial mount triggers generation
      expect(mockErgogenWorker.postMessage).toHaveBeenCalled();

      // Open settings
      act(() => {
        getByTestId('toggle-settings').click();
      });

      // Change injections while settings are open
      mockErgogenWorker.postMessage.mockClear();
      act(() => {
        getByTestId('change-injections').click();
      });

      // Auto-generation should be inhibited (postMessage should NOT be called)
      expect(mockErgogenWorker.postMessage).not.toHaveBeenCalled();
    });

    it('should terminate the old worker, create a new one, and trigger generation when showSettings transitions from true to false', async () => {
      const TestSettingsComponent = () => {
        const ctx = useConfigContext();
        return (
          <button
            data-testid="toggle-settings"
            onClick={() => ctx?.setShowSettings((prev) => !prev)}
          >
            Toggle Settings
          </button>
        );
      };

      mockInitialConfig('points: {}');
      const { getByTestId } = render(
        <ConfigContextProvider>
          <TestSettingsComponent />
        </ConfigContextProvider>
      );

      // Open settings panel
      act(() => {
        getByTestId('toggle-settings').click();
      });

      mockErgogenWorker.postMessage.mockClear();
      mockErgogenWorker.terminate.mockClear();

      // Close settings panel
      act(() => {
        getByTestId('toggle-settings').click();
      });

      // Old worker should be terminated
      expect(mockErgogenWorker.terminate).toHaveBeenCalledTimes(1);

      // Fresh generation should be kicked off
      expect(mockErgogenWorker.postMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe('multi-configuration management actions', () => {
    it('should switch between configurations and update values correctly without cross-contamination', () => {
      let contextValue: any = null;

      const TestComponent = () => {
        contextValue = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // Initially, there should be 0 configs on clean storage
      expect(contextValue.configs.length).toBe(0);

      // Create Config B
      let idB: string = '';
      act(() => {
        idB = contextValue.createNewConfig('points: {B: {}}', 'Config B');
      });

      // Create Config C
      let idC: string = '';
      act(() => {
        idC = contextValue.createNewConfig('points: {C: {}}', 'Config C');
      });

      // Verify they are added
      expect(contextValue.configs.find((c: any) => c.id === idB)?.config).toBe(
        'points: {B: {}}'
      );
      expect(contextValue.configs.find((c: any) => c.id === idC)?.config).toBe(
        'points: {C: {}}'
      );

      // Verify metadata fields exist and match ISO 8601 UTC format
      const configB = contextValue.configs.find((c: any) => c.id === idB);
      expect(configB.createdAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
      expect(configB.updatedAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );

      // Switch to B
      act(() => {
        contextValue.selectConfig(idB);
      });
      expect(contextValue.activeConfigId).toBe(idB);
      expect(contextValue.configInput).toBe('points: {B: {}}');

      // Update B's config
      act(() => {
        contextValue.setConfigInput('points: {B: {updated: true}}');
      });
      expect(contextValue.configs.find((c: any) => c.id === idB)?.config).toBe(
        'points: {B: {updated: true}}'
      );

      // Switch to C
      act(() => {
        contextValue.selectConfig(idC);
      });
      expect(contextValue.activeConfigId).toBe(idC);
      expect(contextValue.configInput).toBe('points: {C: {}}');

      // Verify B's config remains updated and was not overwritten by C's config
      expect(contextValue.configs.find((c: any) => c.id === idB)?.config).toBe(
        'points: {B: {updated: true}}'
      );
      expect(contextValue.configs.find((c: any) => c.id === idC)?.config).toBe(
        'points: {C: {}}'
      );

      // Verify that renaming to the same name does not update updatedAt timestamp
      const configBeforeRename = contextValue.configs.find(
        (c: any) => c.id === idB
      );
      const originalUpdatedAt = configBeforeRename.updatedAt;

      // Wait a moment so Date milliseconds would have advanced
      act(() => {
        contextValue.renameConfig(idB, 'Config B');
      });

      const configAfterRename = contextValue.configs.find(
        (c: any) => c.id === idB
      );
      expect(configAfterRename.updatedAt).toBe(originalUpdatedAt);
    });

    it('should not allow renaming a configuration to an existing name and should set error', () => {
      let contextValue: any = null;

      const TestComponent = () => {
        contextValue = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      let _id1: string = '';
      let id2: string = '';
      act(() => {
        _id1 = contextValue.createNewConfig('points: {}', 'Keyboard Alpha');
        id2 = contextValue.createNewConfig('points: {}', 'Keyboard Beta');
      });

      expect(contextValue.error).toBeNull();

      // Try renaming Beta to Alpha (should fail and set error)
      let renameResult = false;
      act(() => {
        renameResult = contextValue.renameConfig(id2, 'Keyboard Alpha');
      });

      expect(renameResult).toBe(false);
      expect(contextValue.error).toBe(
        'A configuration named "Keyboard Alpha" already exists.'
      );
      expect(contextValue.configs.find((c: any) => c.id === id2)?.name).toBe(
        'Keyboard Beta'
      );

      // Clear error
      act(() => {
        contextValue.setError(null);
      });
      expect(contextValue.error).toBeNull();

      // Try renaming Beta to Gamma (should succeed)
      act(() => {
        renameResult = contextValue.renameConfig(id2, 'Keyboard Gamma');
      });

      expect(renameResult).toBe(true);
      expect(contextValue.error).toBeNull();
      expect(contextValue.configs.find((c: any) => c.id === id2)?.name).toBe(
        'Keyboard Gamma'
      );
    });

    it('should convert a preview configuration into a saved configuration when savePreviewConfig is called', () => {
      let contextValue: any = null;

      const TestComponent = () => {
        contextValue = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // Verify initially empty
      expect(contextValue.configs.length).toBe(0);
      expect(contextValue.isPreview).toBe(false);

      // Load preview config
      act(() => {
        contextValue.loadPreview('points: {A: {}}');
      });

      expect(contextValue.isPreview).toBe(true);
      expect(contextValue.configInput).toBe('points: {A: {}}');
      expect(contextValue.configs.length).toBe(0);

      // Trigger savePreviewConfig
      act(() => {
        contextValue.savePreviewConfig();
      });

      // Verify it is converted
      expect(contextValue.isPreview).toBe(false);
      expect(contextValue.configs.length).toBe(1);
      expect(contextValue.configs[0].name).toBe('Shared Config 1');
      expect(contextValue.configs[0].config).toBe('points: {A: {}}');
      expect(contextValue.activeConfigId).toBe(contextValue.configs[0].id);
    });

    it('should backup deleted configurations in ergogen:deleted-config and prune them correctly', () => {
      let contextValue: any = null;

      const TestComponent = () => {
        contextValue = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // Create a configuration to delete
      let idToDelete: string = '';
      act(() => {
        idToDelete = contextValue.createNewConfig(
          'points: {D: {}}',
          'To Be Deleted'
        );
      });

      // Confirm deleted storage is empty first
      expect(localStorage.getItem('ergogen:deleted-config')).toBeNull();

      // Delete the configuration
      act(() => {
        contextValue.deleteConfig(idToDelete);
      });

      // Verify it is backed up in local storage
      const backupRaw = localStorage.getItem('ergogen:deleted-config');
      expect(backupRaw).not.toBeNull();
      const backupData = JSON.parse(backupRaw!);
      expect(backupData.version).toBe(1);
      expect(backupData.configs.length).toBe(1);
      expect(backupData.configs[0].name).toBe('To Be Deleted');
      expect(backupData.configs[0].config).toBe('points: {D: {}}');
      expect(backupData.configs[0].deletedAt).toBeDefined();

      // Test pruning 1: prune configs older than 90 days
      const ninetyFiveDaysAgo = new Date(
        Date.now() - 95 * 24 * 60 * 60 * 1000
      ).toISOString();
      const oldConfig = {
        id: 'old-id',
        name: 'Old Config',
        config: 'points: {}',
        createdAt: ninetyFiveDaysAgo,
        updatedAt: ninetyFiveDaysAgo,
        deletedAt: ninetyFiveDaysAgo,
      };

      const freshDeletedData = {
        version: 1,
        configs: [
          backupData.configs[0], // fresh config
          oldConfig, // 95 days old config
        ],
      };
      localStorage.setItem(
        'ergogen:deleted-config',
        JSON.stringify(freshDeletedData)
      );

      // Trigger pruning
      act(() => {
        contextValue.pruneDeletedConfigs();
      });

      // Verify the old config is pruned, leaving only the fresh one
      const backupAfterPruningRaw1 = localStorage.getItem(
        'ergogen:deleted-config'
      );
      const backupAfterPruningData1 = JSON.parse(backupAfterPruningRaw1!);
      expect(backupAfterPruningData1.configs.length).toBe(1);
      expect(backupAfterPruningData1.configs[0].id).toBe(idToDelete);

      // Test pruning 2: limit to 100 configs, removing the oldest by modified date (updatedAt) first
      const largeConfigsList: any[] = [];
      // Let's create 105 configs
      for (let i = 0; i < 105; i++) {
        // Increment updatedAt date by i hours to establish a clear chronological order
        const date = new Date(
          Date.now() - (105 - i) * 60 * 60 * 1000
        ).toISOString();
        largeConfigsList.push({
          id: `id-${i}`,
          name: `Config ${i}`,
          config: 'points: {}',
          createdAt: date,
          updatedAt: date,
          deletedAt: new Date().toISOString(), // deletedAt is fresh so they won't be pruned by the 90 days filter
        });
      }

      localStorage.setItem(
        'ergogen:deleted-config',
        JSON.stringify({ version: 1, configs: largeConfigsList })
      );

      // Trigger pruning
      act(() => {
        contextValue.pruneDeletedConfigs();
      });

      // Verify only 100 configs remain, and the 5 oldest ones (indices 0 to 4) were deleted
      const backupAfterPruningRaw2 = localStorage.getItem(
        'ergogen:deleted-config'
      );
      const backupAfterPruningData2 = JSON.parse(backupAfterPruningRaw2!);
      expect(backupAfterPruningData2.configs.length).toBe(100);

      // The oldest remaining should be index 5, meaning `Config 5`
      expect(backupAfterPruningData2.configs[0].name).toBe('Config 5');
      // The newest remaining should be `Config 104`
      expect(backupAfterPruningData2.configs[99].name).toBe('Config 104');
    });

    it('should upgrade version 1 to version 2 on load and trigger background generation for configurations missing preview SVG', async () => {
      // Setup version 1 container in localStorage with a configuration that lacks previewSvg
      const initialConfigs = [
        {
          id: 'cfg-v1-1',
          name: 'V1 Config',
          config: 'points: {A: {}}',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      const containerV1 = {
        version: 1,
        activeConfigId: 'cfg-v1-1',
        configs: initialConfigs,
      };
      localStorage.setItem('ergogen:multi-config', JSON.stringify(containerV1));

      const TestComponent = () => {
        useConfigContext();
        return null;
      };

      mockErgogenWorker.postMessage.mockClear();

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // Verify it updates key in local storage to version 2
      const storedRaw = localStorage.getItem('ergogen:multi-config');
      expect(storedRaw).not.toBeNull();
      const parsed = JSON.parse(storedRaw!);
      expect(parsed.version).toBe(2);

      // Verify that background-preview generation was triggered
      expect(mockErgogenWorker.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'generate',
          inputConfig: 'points: {A: {}}',
          requestId: 'background-preview-cfg-v1-1',
        })
      );
    });

    it('should process background generation worker success message and update previewSvg in local storage without triggering STL conversion', () => {
      const TestComponent = () => {
        useConfigContext();
        return null;
      };

      // Pre-populate multi-config
      const initialConfigs = [
        {
          id: 'cfg-bg-1',
          name: 'BG Config',
          config: 'points: {A: {}}',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      const containerV2 = {
        version: 2,
        activeConfigId: 'cfg-bg-1',
        configs: initialConfigs,
      };
      localStorage.setItem('ergogen:multi-config', JSON.stringify(containerV2));

      mockJscadWorker.postMessage.mockClear();

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // Simulate worker success callback for background preview
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            requestId: 'background-preview-cfg-bg-1',
            results: {
              demo: {
                svg: '<svg><path stroke="#000" /></svg>',
              },
            },
            warnings: [],
          },
        } as MessageEvent);
      });

      // Verify that previewSvg was formatted and stored
      const stored = JSON.parse(localStorage.getItem('ergogen:multi-config')!);
      expect(stored.configs[0].previewSvg).toContain(
        'style="background-color: rgb(51,51,51);"'
      );
      expect(stored.configs[0].previewSvg).toContain('stroke="#AAA"');

      // Verify that JSCAD/STL converter was NOT called
      expect(mockJscadWorker.postMessage).not.toHaveBeenCalled();
    });

    it('should save formatted previewSvg to the active configuration when user-initiated generation completes successfully', () => {
      const TestComponent = () => {
        useConfigContext();
        return null;
      };

      // Pre-populate multi-config with active config
      const initialConfigs = [
        {
          id: 'cfg-user-1',
          name: 'User Config',
          config: 'points: {A: {}}',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      const containerV2 = {
        version: 2,
        activeConfigId: 'cfg-user-1',
        configs: initialConfigs,
      };
      localStorage.setItem('ergogen:multi-config', JSON.stringify(containerV2));

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // Simulate worker success callback for normal generation
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            requestId: 'ergogen-generate-12345',
            results: {
              demo: {
                svg: '<svg><path stroke="#000" /></svg>',
              },
            },
            warnings: [],
          },
        } as MessageEvent);
      });

      // Verify that previewSvg was formatted and stored for user config
      const stored = JSON.parse(localStorage.getItem('ergogen:multi-config')!);
      expect(stored.configs[0].previewSvg).toContain(
        'style="background-color: rgb(51,51,51);"'
      );
      expect(stored.configs[0].previewSvg).toContain('stroke="#AAA"');
    });
  });

  describe('realtime config input functions', () => {
    it('should retrieve and update the realtime config input value', () => {
      let capturedContext: any = null;
      const TestComponent = () => {
        capturedContext = useConfigContext();
        return null;
      };

      mockInitialConfig('points: {}');
      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      expect(capturedContext.getRealtimeConfigInput()).toBe('points: {}');

      act(() => {
        capturedContext.updateRealtimeConfigInput('points: { modified: true }');
      });

      // It should update the realtime value ref
      expect(capturedContext.getRealtimeConfigInput()).toBe(
        'points: { modified: true }'
      );

      // But configInput state should remain the old value (no re-render update to state yet)
      expect(capturedContext.configInput).toBe('points: {}');
    });
  });

  describe('generation injection filtering based on feature flags', () => {
    it('should filter out outlines and templates from the worker payload when feature flags are disabled', async () => {
      let capturedContext: any = null;
      const TestComponent = () => {
        capturedContext = useConfigContext();
        return null;
      };

      // Disable outlines and templates
      (isFeatureEnabled as Mock).mockImplementation((feature) => {
        if (feature === 'outlines' || feature === 'templates') return false;
        return true;
      });

      mockInitialConfig('points: {}');
      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // Trigger a generation run with all types of injections
      mockErgogenWorker.postMessage.mockClear();
      const testInjections = [
        ['footprint', 'mfootprint', 'fcontent'],
        ['outline', 'moutline', 'ocontent'],
        ['template', 'mtemplate', 'tcontent'],
      ];

      await act(async () => {
        await capturedContext.generateNow('points: {}', testInjections);
      });

      // It should trigger postMessage, but only with footprint injection
      expect(mockErgogenWorker.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'generate',
          injectionInput: [['footprint', 'mfootprint', 'fcontent']],
        })
      );
    });
  });

  describe('GA4 Keyboard Generation Tracking & Debouncing', () => {
    const getKeyboardGeneratedCalls = () => {
      return (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'keyboard_generated'
      );
    };

    beforeEach(() => {
      vi.useFakeTimers();
      (trackEvent as Mock).mockClear();
      mockInitialConfig('points: {}');
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce tracking by 5 seconds and only send the latest event', async () => {
      const TestComponent = () => {
        useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // Trigger first success response (will calculate config_id A)
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: {
              canonical: { meta: { name: 'Sweep', author: 'david' } },
              points: {
                p1: { x: 10, y: 20, r: 0, meta: { zone: { name: 'matrix' } } },
              },
            },
          },
        } as MessageEvent);
      });

      // Advance time slightly (e.g., 2 seconds) - event should not be tracked yet
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(getKeyboardGeneratedCalls().length).toBe(0);

      // Trigger second success response before debounce expires (different coordinates, config_id B)
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: {
              canonical: { meta: { name: 'Sweep', author: 'david' } },
              points: {
                p1: { x: 15, y: 25, r: 0, meta: { zone: { name: 'matrix' } } },
              },
            },
          },
        } as MessageEvent);
      });

      // Advance time by 4 seconds - still shouldn't fire because timer reset
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(getKeyboardGeneratedCalls().length).toBe(0);

      // Advance time by 1 more second to reach 5 seconds of total delay for B
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // It should have tracked B, with previous_config_id of undefined (root), without raw config_name/config_author
      expect(getKeyboardGeneratedCalls().length).toBe(1);
      const trackedPayload = getKeyboardGeneratedCalls()[0][1];
      expect(trackedPayload).toEqual(
        expect.objectContaining({
          config_id: expect.stringMatching(/^[a-f0-9]{12}$/),
          previous_config_id: undefined,
        })
      );
      expect('config_name' in trackedPayload).toBe(false);
      expect('config_author' in trackedPayload).toBe(false);
    });

    it('should correctly chain lineages across multiple distinct generations', async () => {
      const TestComponent = () => {
        useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // 1. First compile (config A)
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: {
              canonical: { meta: { name: 'Sweep', author: 'david' } },
              points: {
                p1: { x: 10, y: 20, r: 0, meta: { zone: { name: 'matrix' } } },
              },
            },
          },
        } as MessageEvent);
      });

      // Let debounce run and complete
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(getKeyboardGeneratedCalls().length).toBe(1);
      const firstPayload = getKeyboardGeneratedCalls()[0][1];
      const firstConfigId = firstPayload.config_id;
      expect(firstPayload.previous_config_id).toBeUndefined();

      // 2. Second compile (config B)
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: {
              canonical: { meta: { name: 'Sweep', author: 'david' } },
              points: {
                p1: { x: 20, y: 30, r: 0, meta: { zone: { name: 'matrix' } } },
              },
            },
          },
        } as MessageEvent);
      });

      // Let debounce run
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(getKeyboardGeneratedCalls().length).toBe(2);
      const secondPayload = getKeyboardGeneratedCalls()[1][1];
      expect(secondPayload.previous_config_id).toBe(firstConfigId);
    });

    it('should ignore duplicate compilation results with identical layout geometries', async () => {
      const TestComponent = () => {
        useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // 1. First compile
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: {
              canonical: { meta: { name: 'Sweep', author: 'david' } },
              points: {
                p1: { x: 10, y: 20, r: 0, meta: { zone: { name: 'matrix' } } },
              },
            },
          },
        } as MessageEvent);
      });

      // Let debounce run
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(getKeyboardGeneratedCalls().length).toBe(1);

      // 2. Second compile with identical values
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: {
              canonical: { meta: { name: 'Sweep', author: 'david' } },
              points: {
                p1: { x: 10, y: 20, r: 0, meta: { zone: { name: 'matrix' } } },
              },
            },
          },
        } as MessageEvent);
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      // Should still be called only once!
      expect(getKeyboardGeneratedCalls().length).toBe(1);
    });

    it('should reset lineage when a config lifecycle action (like selectConfig) is triggered', async () => {
      let capturedContext: any = null;
      const TestComponent = () => {
        capturedContext = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // 1. First compile
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: {
              canonical: { meta: { name: 'Sweep', author: 'david' } },
              points: {
                p1: { x: 10, y: 20, r: 0, meta: { zone: { name: 'matrix' } } },
              },
            },
          },
        } as MessageEvent);
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(getKeyboardGeneratedCalls().length).toBe(1);

      // Trigger config select to load/switch configs
      act(() => {
        capturedContext.selectConfig(null);
      });

      // 2. Second compile (different coordinates, should have previous_config_id = undefined)
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: {
              canonical: { meta: { name: 'Corne', author: 'foobar' } },
              points: {
                p1: { x: 30, y: 40, r: 0, meta: { zone: { name: 'matrix' } } },
              },
            },
          },
        } as MessageEvent);
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(getKeyboardGeneratedCalls().length).toBe(2);
      const secondPayload = getKeyboardGeneratedCalls()[1][1];
      expect(secondPayload.previous_config_id).toBeUndefined();
    });

    it('should flush pending events immediately on unmount', () => {
      const { unmount } = render(
        <ConfigContextProvider>
          <div />
        </ConfigContextProvider>
      );

      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: {
              canonical: { meta: { name: 'Sweep', author: 'david' } },
              points: {
                p1: { x: 10, y: 20, r: 0, meta: { zone: { name: 'matrix' } } },
              },
            },
          },
        } as MessageEvent);
      });

      expect(getKeyboardGeneratedCalls().length).toBe(0);

      // Unmount the component -> should flush immediately
      unmount();

      expect(getKeyboardGeneratedCalls().length).toBe(1);
    });
  });

  describe('Settings Lifecycle Tracking', () => {
    beforeEach(() => {
      (trackEvent as Mock).mockClear();
      localStorage.clear();
    });

    it('should fire settings_loaded strictly on initial mount and not on subsequent setting changes', () => {
      let capturedContext: any = null;
      const TestComponent = () => {
        capturedContext = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      const settingsLoadedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'settings_loaded'
      );
      const settingChangedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'setting_changed'
      );

      expect(settingsLoadedCalls.length).toBe(1);
      // Always true for any event that reaches GA, so it is not sent
      expect(settingsLoadedCalls[0][1]).not.toHaveProperty('sendUsageMetrics');
      expect(settingChangedCalls.length).toBe(0);

      // Now toggle a setting
      act(() => {
        capturedContext.setDebug(true);
      });

      const updatedSettingsLoadedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'settings_loaded'
      );
      const updatedSettingChangedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'setting_changed'
      );

      expect(updatedSettingsLoadedCalls.length).toBe(1); // STILL 1!
      expect(updatedSettingChangedCalls.length).toBe(1);
      expect(updatedSettingChangedCalls[0][1]).toEqual(
        expect.objectContaining({
          setting_name: 'debug',
          setting_value: true,
          debug: true,
        })
      );
    });

    it('should not initialize analytics while rendering, leaving bootstrap to the entry point', () => {
      // Arrange
      (initAnalytics as Mock).mockClear();
      let initCallsDuringRender = -1;
      const RenderProbe = () => {
        initCallsDuringRender = (initAnalytics as Mock).mock.calls.length;
        return null;
      };

      // Act
      render(
        <ConfigContextProvider>
          <RenderProbe />
        </ConfigContextProvider>
      );

      // Assert: no render-time side effects; the consent effect runs after commit
      expect(initCallsDuringRender).toBe(0);
      expect(initAnalytics).toHaveBeenCalled();
    });

    it('should record an explicit sendUsageMetrics toggle through the analytics consent API', () => {
      // Arrange
      (setSendUsageMetricsEnabled as Mock).mockClear();
      let capturedContext: any = null;
      const TestComponent = () => {
        capturedContext = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );
      expect(capturedContext.sendUsageMetrics).toBe(true);

      // Act
      act(() => {
        capturedContext.setSendUsageMetrics(false);
      });

      // Assert
      expect(setSendUsageMetricsEnabled).toHaveBeenCalledWith(false);
      expect(capturedContext.sendUsageMetrics).toBe(false);
    });

    it('should preserve prior settings changes across sequential setting updates without stale useLocalStorage clobbering', () => {
      // Arrange
      let capturedContext: any = null;
      const TestComponent = () => {
        capturedContext = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      // Act: toggle debug ON, then toggle sendUsageMetrics OFF and back ON
      act(() => {
        capturedContext.setDebug(true);
      });
      expect(capturedContext.debug).toBe(true);

      act(() => {
        capturedContext.setSendUsageMetrics(false);
      });
      (trackEvent as Mock).mockClear();

      act(() => {
        capturedContext.setSendUsageMetrics(true);
      });

      // Assert: debug remains true and setting_changed reports sendUsageMetrics=true
      expect(capturedContext.debug).toBe(true);
      expect(capturedContext.sendUsageMetrics).toBe(true);
      expect(trackEvent).toHaveBeenCalledWith(
        'setting_changed',
        expect.objectContaining({
          setting_name: 'sendUsageMetrics',
          setting_value: true,
          debug: true,
        })
      );
    });
  });

  describe('Compilation Telemetry Debouncing (generation_completed & generation_failed)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      (trackEvent as Mock).mockClear();
      mockInitialConfig('points: {}');
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce generation_completed by 5 seconds during auto-generation', () => {
      render(
        <ConfigContextProvider>
          <div />
        </ConfigContextProvider>
      );

      // Rapid compilation completions
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: { points: { p1: { x: 0, y: 0 } } },
          },
        } as MessageEvent);
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      let completedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_completed'
      );
      expect(completedCalls.length).toBe(0);

      // Another completion before debounce finishes
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: { points: { p1: { x: 10, y: 10 } } },
          },
        } as MessageEvent);
      });

      act(() => {
        vi.advanceTimersByTime(4000);
      });
      completedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_completed'
      );
      expect(completedCalls.length).toBe(0);

      // Reach 5 seconds
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      completedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_completed'
      );
      expect(completedCalls.length).toBe(1);
    });

    it('should debounce generation_failed by 5 seconds during auto-generation', () => {
      render(
        <ConfigContextProvider>
          <div />
        </ConfigContextProvider>
      );

      // First error
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'error',
            error: 'SyntaxError at line 1',
          },
        } as MessageEvent);
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      let failedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_failed'
      );
      expect(failedCalls.length).toBe(0);

      // Second error
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'error',
            error: 'SyntaxError at line 2',
          },
        } as MessageEvent);
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      failedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_failed'
      );
      expect(failedCalls.length).toBe(1);
      expect(failedCalls[0][1]).toEqual(
        expect.objectContaining({
          error_message: 'SyntaxError at line 2',
          trigger: 'auto',
        })
      );
    });

    it('should send, not drop, a pending generation event when switching configs', () => {
      // Arrange: an auto-build finishes, then the user switches config within 5s
      let capturedContext: any = null;
      const TestComponent = () => {
        capturedContext = useConfigContext();
        return null;
      };
      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: { points: { p1: { x: 0, y: 0 } } },
          },
        } as MessageEvent);
      });
      const countCompleted = () =>
        (trackEvent as Mock).mock.calls.filter(
          (call) => call[0] === 'generation_completed'
        ).length;
      expect(countCompleted()).toBe(0);

      // Act
      act(() => {
        capturedContext.createNewConfig('points: {}', 'Another board');
      });

      // Assert: the compilation really happened, so it is reported once
      expect(countCompleted()).toBe(1);
      act(() => {
        vi.advanceTimersByTime(10000);
      });
      expect(countCompleted()).toBe(1);
    });

    it('should cancel pending generation_failed when generation succeeds', () => {
      render(
        <ConfigContextProvider>
          <div />
        </ConfigContextProvider>
      );

      // Error occurs
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'error',
            error: 'Incomplete YAML while typing',
          },
        } as MessageEvent);
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // User fixes error and generation succeeds
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: { points: { p1: { x: 0, y: 0 } } },
          },
        } as MessageEvent);
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      const failedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_failed'
      );
      const completedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_completed'
      );

      expect(failedCalls.length).toBe(0);
      expect(completedCalls.length).toBe(1);
    });

    it('should fire immediately when autoGen is false', () => {
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ autoGen: false })
      );

      render(
        <ConfigContextProvider>
          <div />
        </ConfigContextProvider>
      );

      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: { points: { p1: { x: 0, y: 0 } } },
          },
        } as MessageEvent);
      });

      // Fired immediately without waiting for timers
      const completedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_completed'
      );
      expect(completedCalls.length).toBe(1);
    });

    it('should honor mid-session autoGen toggles immediately without stale closures', () => {
      // Arrange: start with autoGen = false
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ autoGen: false })
      );
      let capturedContext: any = null;
      const TestComponent = () => {
        capturedContext = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );
      (trackEvent as Mock).mockClear();

      // Act 1: turn autoGen ON mid-session and trigger 3 quick successes
      act(() => {
        capturedContext.setAutoGen(true);
      });
      act(() => {
        for (let i = 0; i < 3; i++) {
          mockErgogenWorker.onmessage({
            data: {
              type: 'success',
              results: { points: { p1: { x: i, y: i } } },
            },
          } as MessageEvent);
        }
      });

      // Assert 1: 0 emitted before 5s debounce expires, then 1 after timer fires
      let completedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_completed'
      );
      expect(completedCalls.length).toBe(0);

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      completedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_completed'
      );
      expect(completedCalls.length).toBe(1);

      // Act 2: turn autoGen OFF mid-session and trigger 1 manual generation
      (trackEvent as Mock).mockClear();
      act(() => {
        capturedContext.setAutoGen(false);
      });
      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            results: { points: { p1: { x: 99, y: 99 } } },
          },
        } as MessageEvent);
      });

      // Assert 2: fires immediately without waiting for debounce timer
      completedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_completed'
      );
      expect(completedCalls.length).toBe(1);
    });

    it('should bypass debounce for explicit manual generateNow requests even when autoGen is true', async () => {
      // Arrange
      let capturedContext: any = null;
      const TestComponent = () => {
        capturedContext = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );
      (trackEvent as Mock).mockClear();
      mockErgogenWorker.postMessage.mockClear();

      // Act: trigger manual generateNow and echo worker requestId
      await act(async () => {
        await capturedContext.generateNow('points: {}', [], {
          pointsonly: false,
          isManual: true,
        });
      });

      const postedMessage =
        mockErgogenWorker.postMessage.mock.calls.at(-1)?.[0];
      expect(postedMessage?.requestId).toMatch(/^ergogen-manual-/);

      act(() => {
        mockErgogenWorker.onmessage({
          data: {
            type: 'success',
            requestId: postedMessage.requestId,
            results: { points: { p1: { x: 1, y: 2 } } },
          },
        } as MessageEvent);
      });

      // Assert: fires immediately even though autoGen is true
      const completedCalls = (trackEvent as Mock).mock.calls.filter(
        (call) => call[0] === 'generation_completed'
      );
      expect(completedCalls.length).toBe(1);
      expect(completedCalls[0][1]).toEqual(
        expect.objectContaining({ trigger: 'manual' })
      );
    });
  });

  describe('KiCad 5 deprecation warning detection', () => {
    it('should set deprecationWarning when a PCB uses kicad5 template and ceoloide footprint', async () => {
      let capturedContext: any = null;
      const TestComponent = () => {
        capturedContext = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      const kicad5Config = `
pcbs:
  my_pcb:
    template: kicad5
    footprints:
      f1:
        what: ceoloide/key
`;

      await act(async () => {
        await capturedContext.generateNow(kicad5Config, undefined);
      });

      expect(capturedContext.deprecationWarning).toContain(
        'KiCad 5 is deprecated'
      );
    });

    it('should NOT set deprecationWarning when a PCB uses kicad8 template and ceoloide footprint', async () => {
      let capturedContext: any = null;
      const TestComponent = () => {
        capturedContext = useConfigContext();
        return null;
      };

      render(
        <ConfigContextProvider>
          <TestComponent />
        </ConfigContextProvider>
      );

      const kicad8Config = `
pcbs:
  my_pcb:
    template: kicad8
    footprints:
      f1:
        what: ceoloide/key
`;

      await act(async () => {
        await capturedContext.generateNow(kicad8Config, undefined);
      });

      expect(capturedContext.deprecationWarning).toBeNull();
    });
  });
});
