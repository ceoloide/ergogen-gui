import React from 'react';
import { render, waitFor } from '@testing-library/react';

// Mock the worker factory to prevent worker creation in tests
jest.mock('../workers/workerFactory', () => ({
  createErgogenWorker: () => null,
  createJscadWorker: () => null,
}));

// Mock ergogen globally
global.window.ergogen = {
  process: jest.fn(),
  inject: jest.fn(),
};

import ConfigContextProvider from './ConfigContext';

const mockConfig = 'points: {}';

describe('ConfigContextProvider', () => {
  beforeEach(() => {
    // Clear the URL for each test
    window.history.replaceState({}, 'Test page', '/');
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
      'https://raw.githubusercontent.com/ceoloide/corney-island/main/ergogen/config.yaml'
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
      'https://raw.githubusercontent.com/ceoloide/corney-island/main/ergogen/config.yaml'
    );

    fetchSpy.mockRestore();
  });
});
