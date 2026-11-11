const mockClientsClaim = vi.fn();
const mockPrecacheAndRoute = vi.fn();
const mockCreateHandlerBoundToURL = vi.fn(() => 'bound-index-handler');
const mockRegisterRoute = vi.fn();

vi.mock('workbox-core', () => ({
  clientsClaim: (...args: unknown[]) => mockClientsClaim(...args),
}));

vi.mock('workbox-precaching', () => ({
  precacheAndRoute: (...args: unknown[]) => mockPrecacheAndRoute(...args),
  createHandlerBoundToURL: (...args: unknown[]) =>
    mockCreateHandlerBoundToURL(...args),
}));

vi.mock('workbox-routing', () => ({
  registerRoute: (...args: unknown[]) => mockRegisterRoute(...args),
}));

vi.mock('workbox-strategies', () => ({
  CacheFirst: class CacheFirst {
    options: unknown;
    constructor(options: unknown) {
      this.options = options;
    }
  },
  StaleWhileRevalidate: class StaleWhileRevalidate {
    options: unknown;
    constructor(options: unknown) {
      this.options = options;
    }
  },
  NetworkFirst: class NetworkFirst {
    options: unknown;
    constructor(options: unknown) {
      this.options = options;
    }
  },
}));

vi.mock('workbox-expiration', () => ({
  ExpirationPlugin: class ExpirationPlugin {
    options: unknown;
    constructor(options: unknown) {
      this.options = options;
    }
  },
}));

vi.mock('workbox-cacheable-response', () => ({
  CacheableResponsePlugin: class CacheableResponsePlugin {
    options: unknown;
    constructor(options: unknown) {
      this.options = options;
    }
  },
}));

describe('Service Worker registration and route wiring', () => {
  const originalSelf = (globalThis as Record<string, unknown>).self;
  const mockSkipWaiting = vi.fn();
  let messageHandlers: Array<(event: { data?: { type?: string } }) => void> =
    [];
  let activateHandlers: Array<
    (event: { waitUntil: (promise: Promise<unknown>) => void }) => void
  > = [];
  const deleteRequest: {
    onsuccess?: () => void;
    onerror?: () => void;
    onblocked?: () => void;
  } = {};
  const mockDeleteDatabase = vi.fn(() => deleteRequest);

  beforeAll(async () => {
    messageHandlers = [];
    activateHandlers = [];
    vi.stubGlobal('indexedDB', { deleteDatabase: mockDeleteDatabase });
    Object.defineProperty(globalThis, 'self', {
      configurable: true,
      writable: true,
      value: {
        __WB_MANIFEST: [{ url: 'index.html', revision: '1' }],
        skipWaiting: mockSkipWaiting,
        addEventListener: vi.fn((type: string, handler: any) => {
          if (type === 'message') {
            messageHandlers.push(handler);
          }
          if (type === 'activate') {
            activateHandlers.push(handler);
          }
        }),
      },
    });

    await import('./service-worker');
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(globalThis, 'self', {
      configurable: true,
      writable: true,
      value: originalSelf,
    });
  });

  it('does not intercept Google Analytics hits or scripts, so nothing is queued for later replay', () => {
    const gaCollectUrl = new URL(
      'https://www.google-analytics.com/g/collect?v=2&tid=G-TEST12345'
    );
    const gtagScriptUrl = new URL(
      'https://www.googletagmanager.com/gtag/js?id=G-TEST12345'
    );

    for (const [matcher] of mockRegisterRoute.mock.calls) {
      expect(
        matcher({ request: { mode: 'cors' } as Request, url: gaCollectUrl })
      ).toBe(false);
      expect(
        matcher({
          request: { mode: 'no-cors' } as Request,
          url: gtagScriptUrl,
        })
      ).toBe(false);
    }
  });

  it('deletes the legacy offline analytics queue on activation and waits for it', async () => {
    // Arrange
    expect(activateHandlers.length).toBe(1);
    let pending: Promise<unknown> | undefined;

    // Act
    activateHandlers[0]({
      waitUntil: (promise) => {
        pending = promise;
      },
    });

    // Assert: activation waits until the database is actually deleted
    expect(mockDeleteDatabase).toHaveBeenCalledWith('workbox-background-sync');
    expect(pending).toBeInstanceOf(Promise);
    let settled = false;
    void pending!.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);
    deleteRequest.onsuccess?.();
    await pending;
    expect(settled).toBe(true);
  });

  it('routes SPA navigations to index.html while skipping internal paths and static files', () => {
    const [spaMatcher] = mockRegisterRoute.mock.calls[0];

    expect(
      spaMatcher({
        request: { mode: 'navigate' } as Request,
        url: new URL('https://ergogen.ceoloide.com/new'),
      })
    ).toBe(true);

    expect(
      spaMatcher({
        request: { mode: 'navigate' } as Request,
        url: new URL('https://ergogen.ceoloide.com/_internal'),
      })
    ).toBe(false);

    expect(
      spaMatcher({
        request: { mode: 'navigate' } as Request,
        url: new URL('https://ergogen.ceoloide.com/manifest.json'),
      })
    ).toBe(false);
  });

  it('calls skipWaiting when receiving SKIP_WAITING message', () => {
    expect(messageHandlers.length).toBe(1);
    messageHandlers[0]({ data: { type: 'SKIP_WAITING' } });
    expect(mockSkipWaiting).toHaveBeenCalledTimes(1);
  });
});
