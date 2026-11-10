const mockClientsClaim = vi.fn();
const mockPrecacheAndRoute = vi.fn();
const mockCreateHandlerBoundToURL = vi.fn(() => 'bound-index-handler');
const mockRegisterRoute = vi.fn();
const mockInitializeGoogleAnalytics = vi.fn();

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

vi.mock('workbox-google-analytics', () => ({
  initialize: (...args: unknown[]) => mockInitializeGoogleAnalytics(...args),
}));

describe('Service Worker registration and route wiring', () => {
  const originalSelf = (globalThis as Record<string, unknown>).self;
  const mockSkipWaiting = vi.fn();
  let messageHandlers: Array<(event: { data?: { type?: string } }) => void> =
    [];

  beforeAll(async () => {
    messageHandlers = [];
    Object.defineProperty(globalThis, 'self', {
      configurable: true,
      writable: true,
      value: {
        __WB_MANIFEST: [{ url: 'index.html', revision: '1' }],
        skipWaiting: mockSkipWaiting,
        addEventListener: vi.fn(
          (
            type: string,
            handler: (event: { data?: { type?: string } }) => void
          ) => {
            if (type === 'message') {
              messageHandlers.push(handler);
            }
          }
        ),
      },
    });

    await import('./service-worker');
  });

  afterAll(() => {
    Object.defineProperty(globalThis, 'self', {
      configurable: true,
      writable: true,
      value: originalSelf,
    });
  });

  it('initializes Workbox Google Analytics without registering a dead duplicate script route', () => {
    // Assert Workbox GA initialization ran
    expect(mockInitializeGoogleAnalytics).toHaveBeenCalledTimes(1);

    // Assert none of the custom registerRoute matchers intercept GTM/GA scripts or /g/collect
    const gaCollectUrl = new URL(
      'https://www.google-analytics.com/g/collect?v=2&tid=G-TEST12345'
    );
    const gtagScriptUrl = new URL(
      'https://www.googletagmanager.com/gtag/js?id=G-TEST12345'
    );

    for (const [matcher] of mockRegisterRoute.mock.calls) {
      expect(
        matcher({
          request: { mode: 'cors' } as Request,
          url: gaCollectUrl,
        })
      ).toBe(false);
      expect(
        matcher({
          request: { mode: 'no-cors' } as Request,
          url: gtagScriptUrl,
        })
      ).toBe(false);
    }
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
