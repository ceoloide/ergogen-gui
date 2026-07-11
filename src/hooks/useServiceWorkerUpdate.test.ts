import { renderHook, act } from '@testing-library/react';
import { useServiceWorkerUpdate } from '../App';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

jest.mock('../serviceWorkerRegistration', () => ({
  register: jest.fn(),
}));

jest.mock('../Ergogen', () => {
  const MockErgogen = () => null;
  MockErgogen.displayName = 'MockErgogen';
  return {
    __esModule: true,
    default: MockErgogen,
  };
});

jest.mock('../pages/Welcome', () => {
  const MockWelcome = () => null;
  MockWelcome.displayName = 'MockWelcome';
  return {
    __esModule: true,
    default: MockWelcome,
  };
});

describe('useServiceWorkerUpdate hook', () => {
  let mockReload: jest.Mock;
  let originalNavigator: any;
  let mockAddEventListener: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window.location
    mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: {
        reload: mockReload,
        search: '',
      },
      writable: true,
    });

    // Mock navigator.serviceWorker
    mockAddEventListener = jest.fn();
    originalNavigator = global.navigator;
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        serviceWorker: {
          addEventListener: mockAddEventListener,
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
  });

  it('should register the service worker on mount', () => {
    renderHook(() => useServiceWorkerUpdate());
    expect(serviceWorkerRegistration.register).toHaveBeenCalledTimes(1);
  });

  it('should return undefined when there is no waiting registration', () => {
    const { result } = renderHook(() => useServiceWorkerUpdate());
    expect(result.current).toBeUndefined();
  });

  it('should return a reload callback when ?force_update is present', () => {
    Object.defineProperty(window, 'location', {
      value: {
        reload: mockReload,
        search: '?force_update',
      },
      writable: true,
    });

    const { result } = renderHook(() => useServiceWorkerUpdate());
    expect(result.current).toBeInstanceOf(Function);

    act(() => {
      result.current?.();
    });

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('should handle update when click is triggered with a waiting registration', () => {
    const mockPostMessage = jest.fn();
    const mockWaitingWorker = {
      postMessage: mockPostMessage,
    };
    const mockRegistration = {
      waiting: mockWaitingWorker,
    } as unknown as ServiceWorkerRegistration;

    let onUpdateCallback: any = null;
    (serviceWorkerRegistration.register as jest.Mock).mockImplementation(
      (config) => {
        onUpdateCallback = config.onUpdate;
      }
    );

    const { result } = renderHook(() => useServiceWorkerUpdate());

    // Trigger onUpdate callback to simulate waiting service worker
    act(() => {
      onUpdateCallback?.(mockRegistration);
    });

    expect(result.current).toBeInstanceOf(Function);

    // Call the update handler
    act(() => {
      result.current?.();
    });

    // Verify controllerchange listener was added
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'controllerchange',
      expect.any(Function)
    );

    // Verify message sent to waiting service worker
    expect(mockPostMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });

    // Retrieve the registered callback and invoke it to test reload trigger
    const registeredCallback = mockAddEventListener.mock.calls[0][1];
    expect(mockReload).not.toHaveBeenCalled();

    act(() => {
      registeredCallback();
    });

    expect(mockReload).toHaveBeenCalledTimes(1);

    // Test refreshing guard by calling it again; should not trigger reload again
    act(() => {
      registeredCallback();
    });
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('should fallback to reload if there is no waiting worker when updated', () => {
    const mockRegistration = {
      waiting: null,
    } as unknown as ServiceWorkerRegistration;

    let onUpdateCallback: any = null;
    (serviceWorkerRegistration.register as jest.Mock).mockImplementation(
      (config) => {
        onUpdateCallback = config.onUpdate;
      }
    );

    const { result } = renderHook(() => useServiceWorkerUpdate());

    act(() => {
      onUpdateCallback?.(mockRegistration);
    });

    expect(result.current).toBeInstanceOf(Function);

    act(() => {
      result.current?.();
    });

    // Should reload immediately as fallback
    expect(mockReload).toHaveBeenCalledTimes(1);
  });
});
