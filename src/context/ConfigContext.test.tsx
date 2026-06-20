import React from 'react';
import { render, waitFor, screen, act, fireEvent } from '@testing-library/react';
import { useConfigContext, ConfigContextProvider } from './ConfigContext';

// Mock the worker factory
const mockErgogenWorker = {
  postMessage: jest.fn(),
  terminate: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const mockJscadWorker = {
  postMessage: jest.fn(),
  terminate: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
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

const mockConfig = 'points: {}';

const TestComponent = () => {
  const context = useConfigContext();
  return (
    <div>
      <div data-testid="config-input">{context?.configInput}</div>
      <div data-testid="configs-count">{context?.configs.length}</div>
      <div data-testid="results">{JSON.stringify(context?.results)}</div>
      <button data-testid="set-config" onClick={() => context?.setConfigInput('new content')}>Set Config</button>
      <button data-testid="set-temp" onClick={() => context?.setTempConfig('temp content')}>Set Temp</button>
    </div>
  );
};

describe('ConfigContextProvider', () => {
  let messageHandlers: any = {};

  beforeEach(() => {
    window.history.replaceState({}, 'Test page', '/');
    jest.clearAllMocks();
    localStorage.clear();
    messageHandlers = {};

    mockErgogenWorker.addEventListener.mockImplementation((type, handler) => {
      if (type === 'message') messageHandlers.ergogen = handler;
    });
    mockJscadWorker.addEventListener.mockImplementation((type, handler) => {
      if (type === 'message') messageHandlers.jscad = handler;
    });
  });

  it('should initialize with provided multi-config', () => {
    const initialMultiConfig = {
      version: 1,
      configs: [{ id: '1', name: 'Test', content: mockConfig }],
      activeConfigId: '1',
    };

    render(
      <ConfigContextProvider initialMultiConfig={initialMultiConfig}>
        <TestComponent />
      </ConfigContextProvider>
    );

    expect(screen.getByTestId('config-input').textContent).toBe(mockConfig);
    expect(screen.getByTestId('configs-count').textContent).toBe('1');
  });

  it('should promote temp config to real config on edit', async () => {
    const initialMultiConfig = {
      version: 1,
      configs: [],
      activeConfigId: '',
    };

    render(
      <ConfigContextProvider initialMultiConfig={initialMultiConfig}>
        <TestComponent />
      </ConfigContextProvider>
    );

    // Set temp config
    fireEvent.click(screen.getByTestId('set-temp'));
    expect(screen.getByTestId('config-input').textContent).toBe('temp content');
    expect(screen.getByTestId('configs-count').textContent).toBe('0');

    // Edit it
    fireEvent.click(screen.getByTestId('set-config'));

    // Now it should be a real config
    await waitFor(() => {
      expect(screen.getByTestId('configs-count').textContent).toBe('1');
      expect(screen.getByTestId('config-input').textContent).toBe('new content');
    });
  });

  describe('Worker Interaction', () => {
    it('should update results when worker succeeds', async () => {
      const initialMultiConfig = {
        version: 1,
        configs: [{ id: '1', name: 'Test', content: mockConfig }],
        activeConfigId: '1',
      };

      render(
        <ConfigContextProvider initialMultiConfig={initialMultiConfig}>
          <TestComponent />
        </ConfigContextProvider>
      );

      const ergogenResults = { points: { p1: {} } };

      act(() => {
        if (messageHandlers.ergogen) {
          messageHandlers.ergogen({
            data: { type: 'success', results: ergogenResults, requestId: 'ergogen-generate-1-123' },
          });
        }
      });

      expect(screen.getByTestId('results').textContent).toContain('points');
    });
  });
});
