import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigContextProvider, {
  useConfigContext,
  Settings,
} from './ConfigContext';

const mockConfig = 'points: {}';

describe('ConfigContextProvider', () => {
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

describe('ConfigContextProvider settings management', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure isolation
    window.localStorage.clear();
    // Reset window location
    window.history.pushState({}, 'Test page', '/');
  });

  // A simple consumer component to interact with the context
  const SettingsTestConsumer = () => {
    const context = useConfigContext();
    if (!context || !context.settings) {
      return <div>Loading...</div>;
    }

    const { settings, setSettings } = context;

    return (
      <div>
        <p data-testid="debug-value">{String(settings.debug)}</p>
        <p data-testid="autogen-value">{String(settings.autoGen)}</p>
        <button
          onClick={() =>
            setSettings((s) => ({ ...s!, debug: !s?.debug }))
          }
        >
          Toggle Debug
        </button>
      </div>
    );
  };

  it('should initialize with default settings if none are in localStorage', () => {
    const setConfigInputMock = jest.fn();
    render(
      <ConfigContextProvider configInput="" setConfigInput={setConfigInputMock}>
        <SettingsTestConsumer />
      </ConfigContextProvider>
    );

    expect(screen.getByTestId('debug-value')).toHaveTextContent('false');
    expect(screen.getByTestId('autogen-value')).toHaveTextContent('true');
  });

  it('should load settings from localStorage if they exist', () => {
    const storedSettings: Settings = {
      debug: true,
      autoGen: false,
      autoGen3D: false,
      kicanvasPreview: false,
      jscadPreview: true,
    };
    localStorage.setItem('ergogen:settings', JSON.stringify(storedSettings));

    const setConfigInputMock = jest.fn();
    render(
      <ConfigContextProvider configInput="" setConfigInput={setConfigInputMock}>
        <SettingsTestConsumer />
      </ConfigContextProvider>
    );

    expect(screen.getByTestId('debug-value')).toHaveTextContent('true');
    expect(screen.getByTestId('autogen-value')).toHaveTextContent('false');
  });

  it('should update settings and persist to localStorage when setSettings is called', async () => {
    const setConfigInputMock = jest.fn();
    render(
      <ConfigContextProvider configInput="" setConfigInput={setConfigInputMock}>
        <SettingsTestConsumer />
      </ConfigContextProvider>
    );

    // Initial state
    expect(screen.getByTestId('debug-value')).toHaveTextContent('false');

    // Update state by clicking the button
    await act(async () => {
      await userEvent.click(screen.getByText('Toggle Debug'));
    });

    // Check if UI updated
    await waitFor(() => {
      expect(screen.getByTestId('debug-value')).toHaveTextContent('true');
    });

    // Check if localStorage was updated
    const storedSettings = JSON.parse(
      localStorage.getItem('ergogen:settings') || '{}'
    );
    expect(storedSettings.debug).toBe(true);
  });
});
