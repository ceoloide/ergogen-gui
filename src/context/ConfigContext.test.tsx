import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { act } from 'react-dom/test-utils';
import { useConfigContext } from './ConfigContext';

// Mock the worker factory to prevent worker creation in tests
const mockErgogenWorker = {
  postMessage: jest.fn(),
  terminate: jest.fn(),
  onmessage: (_e: any) => {},
};

const mockJscadWorker = {
  postMessage: jest.fn(),
  terminate: jest.fn(),
  onmessage: (_e: any) => {},
};

jest.mock('../workers/workerFactory', () => ({
  createErgogenWorker: () => mockErgogenWorker,
  createJscadWorker: () => mockJscadWorker,
}));

// Mock ergogen globally
global.window.ergogen = {
  process: jest.fn(),
  inject: jest.fn(),
};

import ConfigContextProvider from './ConfigContext';

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
    <div data-testid="context-results">{JSON.stringify(context?.results)}</div>
  );
};

describe('ConfigContextProvider', () => {
  beforeEach(() => {
    // Clear the URL for each test
    window.history.replaceState({}, 'Test page', '/');
    mockErgogenWorker.postMessage.mockClear();
    mockJscadWorker.postMessage.mockClear();
    localStorage.clear();
  });

  it('should fetch config from github url parameter and update the config', async () => {
    const fetchSpy = jest
      .spyOn(window, 'fetch')
      .mockImplementation(() =>
        Promise.resolve(new Response(mockConfig, { status: 200 }))
      );

    // Set the URL for the test
    window.history.pushState(
      {},
      'Test page',
      '/?github=https://github.com/ceoloide/corney-island/blob/main/ergogen/config.yaml'
    );

    const setConfigInputMock = jest.fn();

    render(
      <ConfigContextProvider configInput="" setConfigInput={setConfigInputMock}>
        <div></div>
      </ConfigContextProvider>
    );

    await waitFor(() => {
      expect(setConfigInputMock).toHaveBeenCalledWith(mockConfig);
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/ceoloide/corney-island/HEAD/main/ergogen/config.yaml'
    );

    fetchSpy.mockRestore();
  });

  it('should fetch config from github url parameter without protocol and update the config', async () => {
    const fetchSpy = jest
      .spyOn(window, 'fetch')
      .mockImplementation(() =>
        Promise.resolve(new Response(mockConfig, { status: 200 }))
      );

    // Set the URL for the test
    window.history.pushState(
      {},
      'Test page',
      '/?github=github.com/ceoloide/corney-island/blob/main/ergogen/config.yaml'
    );

    const setConfigInputMock = jest.fn();

    render(
      <ConfigContextProvider configInput="" setConfigInput={setConfigInputMock}>
        <div></div>
      </ConfigContextProvider>
    );

    await waitFor(() => {
      expect(setConfigInputMock).toHaveBeenCalledWith(mockConfig);
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/ceoloide/corney-island/HEAD/main/ergogen/config.yaml'
    );

    fetchSpy.mockRestore();
  });

  describe('STL Conversion', () => {
    it('should batch convert JSCAD to STL when stlPreview is true', async () => {
      localStorage.setItem('ergogen:config:stlPreview', 'true');
      const setConfigInputMock = jest.fn();
      const { getByTestId } = render(
        <ConfigContextProvider
          configInput={mockConfig}
          setConfigInput={setConfigInputMock}
        >
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
      const setConfigInputMock = jest.fn();
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

      const { getByTestId } = render(
        <ConfigContextProvider
          configInput={mockConfig}
          setConfigInput={setConfigInputMock}
        >
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
});
