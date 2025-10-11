import { render, waitFor, act } from '@testing-library/react';
import React from 'react';
import ConfigContextProvider, { useConfigContext } from './ConfigContext';

// Mock workerFactory
jest.mock('../workers/workerFactory', () => ({
  createErgogenWorker: jest.fn(),
  createJscadWorker: jest.fn(),
}));

import {
  createErgogenWorker,
  createJscadWorker,
} from '../workers/workerFactory';

// Custom hook for testing context
const useCustomHook = () => {
  const context = useConfigContext();
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }
  return context;
};

// Test component to consume the context
const TestComponent = ({
  onRender,
}: {
  onRender: (context: any) => void;
}) => {
  const context = useCustomHook();
  React.useEffect(() => {
    onRender(context);
  }, [context, onRender]);

  return (
    <div data-testid="context-results">
      {JSON.stringify(context.results)}
    </div>
  );
};

describe('ConfigContextProvider', () => {
  let mockErgogenWorker: { onmessage: any; postMessage: jest.Mock; terminate: jest.Mock };
  let mockJscadWorker: { onmessage: any; postMessage: jest.Mock; terminate: jest.Mock };

  beforeEach(() => {
    // Reset mocks before each test
    mockErgogenWorker = {
      onmessage: null,
      postMessage: jest.fn(),
      terminate: jest.fn(),
    };
    mockJscadWorker = {
      onmessage: null,
      postMessage: jest.fn(),
      terminate: jest.fn(),
    };
    (createErgogenWorker as jest.Mock).mockReturnValue(mockErgogenWorker);
    (createJscadWorker as jest.Mock).mockReturnValue(mockJscadWorker);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize workers and process initial config', async () => {
    const initialConfig = 'points: {}';
    const setConfigInput = jest.fn();

    act(() => {
      render(
        <ConfigContextProvider
          configInput={initialConfig}
          setConfigInput={setConfigInput}
        >
          <div />
        </ConfigContextProvider>
      );
    });

    await waitFor(() => {
      expect(createErgogenWorker).toHaveBeenCalledTimes(1);
      expect(createJscadWorker).toHaveBeenCalledTimes(1);
      expect(mockErgogenWorker.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'generate' })
      );
    });
  });

  it('should handle Ergogen worker success and update results', async () => {
    const setConfigInput = jest.fn();
    const newResults = { demo: { svg: '<svg>...</svg>' } };
    let capturedContext: any;

    act(() => {
      render(
        <ConfigContextProvider configInput="points: {}" setConfigInput={setConfigInput}>
          <TestComponent onRender={(c) => (capturedContext = c)} />
        </ConfigContextProvider>
      );
    });

    act(() => {
      mockErgogenWorker.onmessage({
        data: { type: 'success', results: newResults },
      } as MessageEvent);
    });

    await waitFor(() => {
      expect(capturedContext.results).toEqual(newResults);
    });
  });

  it('should handle Ergogen worker error and set error state', async () => {
    const setConfigInput = jest.fn();
    const errorMessage = 'Ergogen processing failed';
    let capturedContext: any;

    act(() => {
      render(
        <ConfigContextProvider configInput="points: {}" setConfigInput={setConfigInput}>
          <TestComponent onRender={(c) => (capturedContext = c)} />
        </ConfigContextProvider>
      );
    });

    act(() => {
      mockErgogenWorker.onmessage({
        data: { type: 'error', error: errorMessage },
      } as MessageEvent);
    });

    await waitFor(() => {
      expect(capturedContext.error).toBe(errorMessage);
    });
  });

  describe('STL Conversion', () => {
    it('should queue and convert JSCAD to STL when stlPreview is true', async () => {
      const setConfigInput = jest.fn();
      const ergogenResults = {
        cases: {
          left: { jscad: 'mock_jscad_code' },
        },
      };
      let capturedContext: any;

      // 1. Render the provider
      render(
        <ConfigContextProvider
          configInput="points: {}"
          setConfigInput={setConfigInput}
        >
          <TestComponent onRender={(c) => (capturedContext = c)} />
        </ConfigContextProvider>
      );

      // Enable stlPreview
      act(() => {
        capturedContext.setStlPreview(true);
      });

      // Trigger the Ergogen worker to produce results with JSCAD
      act(() => {
        mockErgogenWorker.onmessage({
          data: { type: 'success', results: ergogenResults },
        } as MessageEvent);
      });

      // 2. Verify that the JSCAD worker was called
      await waitFor(() => {
        expect(mockJscadWorker.postMessage).toHaveBeenCalledWith({
          type: 'jscad_to_stl',
          jscadScripts: [{ name: 'left', script: 'mock_jscad_code' }],
          configVersion: 1,
        });
      });

      // 3. Simulate a successful response from the JSCAD worker
      act(() => {
        mockJscadWorker.onmessage({
          data: {
            type: 'success',
            results: [{ name: 'left', stl: 'mock_stl_code' }],
            configVersion: 1,
          },
        } as MessageEvent);
      });

      // 4. Verify that the results are updated with the STL content
      await waitFor(() => {
        expect(capturedContext.results?.cases?.left.stl).toBe('mock_stl_code');
      });
    });
  });
});
