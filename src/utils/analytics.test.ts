import {
  trackEvent,
  initAnalytics,
  getSendUsageMetricsEnabled,
  checkIsPWA,
  trackError,
  setupGlobalErrorTracking,
  removeGlobalErrorTracking,
  isLiveTelemetryBlocked,
} from './analytics';
import guiPkg from '../../package.json';
import ergogenPkg from 'ergogen/package.json';

describe('Analytics Utility', () => {
  const originalGtag = window.gtag;

  beforeEach(() => {
    // Reset window.gtag before each test
    window.gtag = jest.fn();
    // Reset environment variable before each test
    vi.stubEnv('VITE_ERGOGEN_VERSION', '');
    vi.stubEnv('VITE_GTAG_ID', 'G-TEST12345');
    // Clear localStorage
    localStorage.clear();
    // Clean up dynamic script tag if present
    const script = document.getElementById('gtag-script');
    if (script) {
      script.remove();
    }
    removeGlobalErrorTracking();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  afterAll(() => {
    // Restore original globals and environment variables
    window.gtag = originalGtag;
    localStorage.clear();
  });

  describe('checkIsPWA', () => {
    it('should return false by default in test environment', () => {
      expect(checkIsPWA()).toBe(false);
    });

    it('should return true if standalone property is set on navigator', () => {
      const originalStandalone = (window.navigator as any).standalone;
      Object.defineProperty(window.navigator, 'standalone', {
        value: true,
        configurable: true,
      });

      expect(checkIsPWA()).toBe(true);

      Object.defineProperty(window.navigator, 'standalone', {
        value: originalStandalone,
        configurable: true,
      });
    });
  });

  describe('getSendUsageMetricsEnabled', () => {
    it('should default to true on web (not PWA mode)', () => {
      expect(getSendUsageMetricsEnabled()).toBe(true);
    });

    it('should read sendUsageMetrics from ergogen:settings JSON when present', () => {
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: false, debug: true })
      );
      expect(getSendUsageMetricsEnabled()).toBe(false);

      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: true, debug: false })
      );
      expect(getSendUsageMetricsEnabled()).toBe(true);
    });

    it('should fallback to legacy ergogen:config:sendUsageMetrics if ergogen:settings is corrupted', () => {
      localStorage.setItem('ergogen:settings', 'invalid-json');
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'false');
      expect(getSendUsageMetricsEnabled()).toBe(false);

      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      expect(getSendUsageMetricsEnabled()).toBe(true);
    });

    it('should return false if legacy localStorage has it set to false', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'false');
      expect(getSendUsageMetricsEnabled()).toBe(false);
    });

    it('should return true if legacy localStorage has it set to true', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      expect(getSendUsageMetricsEnabled()).toBe(true);
    });

    it('should default to false in PWA mode if not configured', () => {
      const originalStandalone = (window.navigator as any).standalone;
      Object.defineProperty(window.navigator, 'standalone', {
        value: true,
        configurable: true,
      });

      expect(getSendUsageMetricsEnabled()).toBe(false);

      Object.defineProperty(window.navigator, 'standalone', {
        value: originalStandalone,
        configurable: true,
      });
    });

    it('should fall back cleanly to !checkIsPWA() when localStorage access throws SecurityError', () => {
      const getItemSpy = vi
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(() => {
          throw new Error('SecurityError: The operation is insecure.');
        });

      // In web mode, should return true without throwing
      expect(() => getSendUsageMetricsEnabled()).not.toThrow();
      expect(getSendUsageMetricsEnabled()).toBe(true);

      // In PWA mode, should return false without throwing
      const originalStandalone = (window.navigator as any).standalone;
      Object.defineProperty(window.navigator, 'standalone', {
        value: true,
        configurable: true,
      });

      expect(() => getSendUsageMetricsEnabled()).not.toThrow();
      expect(getSendUsageMetricsEnabled()).toBe(false);

      Object.defineProperty(window.navigator, 'standalone', {
        value: originalStandalone,
        configurable: true,
      });

      getItemSpy.mockRestore();
    });
  });

  describe('initAnalytics', () => {
    it('should inject script tag, define gtag, and pass send_page_view: false when enabled', () => {
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: true })
      );
      initAnalytics();

      const script = document.getElementById(
        'gtag-script'
      ) as HTMLScriptElement;
      expect(script).toBeInTheDocument();
      expect(script.src).toContain(
        'https://www.googletagmanager.com/gtag/js?id=G-TEST12345'
      );
      expect(window.gtag).toBeDefined();

      const win = window as any;
      expect(win.dataLayer).toBeDefined();
      expect(win['ga-disable-G-TEST12345']).toBeUndefined();
    });

    it('should clean up script tag, delete globals, set ga-disable, and clear cookies when disabled', () => {
      // Setup: first load it
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: true })
      );
      initAnalytics();
      expect(document.getElementById('gtag-script')).toBeInTheDocument();

      // Set cookie to simulate GA cookie
      document.cookie = '_ga=GA1.2.123456789.1234567890; path=/';
      document.cookie = '_ga_TEST=GS1.1.123456789.1.0.1234567890.0.0.0; path=/';

      // Change setting to false and re-initialize
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: false })
      );
      initAnalytics();

      expect(document.getElementById('gtag-script')).toBeNull();
      expect(window.gtag).toBeUndefined();
      expect((window as any).dataLayer).toBeUndefined();
      expect((window as any)['ga-disable-G-TEST12345']).toBe(true);
      expect(document.cookie).not.toContain('_ga=');
    });

    it('should clear ga-disable flag when re-enabled', () => {
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: false })
      );
      initAnalytics();
      expect((window as any)['ga-disable-G-TEST12345']).toBe(true);

      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: true })
      );
      initAnalytics();
      expect((window as any)['ga-disable-G-TEST12345']).toBeUndefined();
    });
  });

  describe('trackEvent', () => {
    it('should call window.gtag with GUI, Ergogen versions, and is_pwa when enabled and gtag is defined', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      const eventName = 'test_event';
      const eventParams = { param1: 'value1', param2: 123 };

      trackEvent(eventName, eventParams);

      expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
        event_category: 'user_action',
        gui_version: guiPkg.version,
        ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
        is_pwa: false,
        param1: 'value1',
        param2: 123,
      });
    });

    it('should call window.gtag with default category, versions, and is_pwa when eventParams is not provided', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      const eventName = 'test_event';

      trackEvent(eventName);

      expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
        event_category: 'user_action',
        gui_version: guiPkg.version,
        ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
        is_pwa: false,
      });
    });

    it('should allow overriding event_category', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      const eventName = 'test_event';
      const eventParams = { event_category: 'custom_category' };

      trackEvent(eventName, eventParams);

      expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
        event_category: 'custom_category',
        gui_version: guiPkg.version,
        ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
        is_pwa: false,
      });
    });

    it('should reflect custom Ergogen versions from environment variables', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      vi.stubEnv('VITE_ERGOGEN_VERSION', 'github:ceoloide/ergogen#v4.3.0');
      const eventName = 'test_event';

      trackEvent(eventName);

      expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
        event_category: 'user_action',
        gui_version: guiPkg.version,
        ergogen_version: 'github:ceoloide/ergogen#v4.3.0',
        is_pwa: false,
      });
    });

    it('should set is_pwa to true when running in standalone mode', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      const originalStandalone = (window.navigator as any).standalone;
      Object.defineProperty(window.navigator, 'standalone', {
        value: true,
        configurable: true,
      });

      trackEvent('test_event');

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
        event_category: 'user_action',
        gui_version: guiPkg.version,
        ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
        is_pwa: true,
      });

      Object.defineProperty(window.navigator, 'standalone', {
        value: originalStandalone,
        configurable: true,
      });
    });

    it('should not call window.gtag when analytics is disabled', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'false');
      const mockGtag = jest.fn();
      window.gtag = mockGtag;

      trackEvent('test_event');

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should not throw or call anything when window.gtag is undefined', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      (window as any).gtag = undefined;

      expect(() => trackEvent('test_event')).not.toThrow();
    });
  });

  describe('trackError', () => {
    it('should call window.gtag with exception event and string message', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      trackError('test error message', true, 'test_context');

      expect(window.gtag).toHaveBeenCalledWith('event', 'exception', {
        event_category: 'user_action',
        gui_version: guiPkg.version,
        ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
        is_pwa: false,
        description: '[test_context] test error message',
        fatal: true,
        error_stack: undefined,
      });
    });

    it('should extract error message and stack from Error object', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      const err = new Error('nested failure');
      trackError(err, false);

      expect(window.gtag).toHaveBeenCalledWith('event', 'exception', {
        event_category: 'user_action',
        gui_version: guiPkg.version,
        ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
        is_pwa: false,
        description: 'nested failure',
        fatal: false,
        error_stack: expect.any(String),
      });
    });
  });

  describe('global error listeners', () => {
    let mockAddListener: any;
    let mockRemoveListener: any;
    let listeners: Record<string, (...args: any[]) => void>;

    beforeEach(() => {
      listeners = {};
      mockAddListener = vi
        .spyOn(window, 'addEventListener')
        .mockImplementation((event, callback) => {
          listeners[event] = callback as (...args: any[]) => void;
        });
      mockRemoveListener = vi
        .spyOn(window, 'removeEventListener')
        .mockImplementation((event) => {
          delete listeners[event];
        });
    });

    afterEach(() => {
      mockAddListener.mockRestore();
      mockRemoveListener.mockRestore();
      removeGlobalErrorTracking();
    });

    it('should register and deregister global error handlers', () => {
      setupGlobalErrorTracking();
      expect(window.addEventListener).toHaveBeenCalledWith(
        'error',
        expect.any(Function)
      );
      expect(window.addEventListener).toHaveBeenCalledWith(
        'unhandledrejection',
        expect.any(Function)
      );

      removeGlobalErrorTracking();
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'error',
        expect.any(Function)
      );
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'unhandledrejection',
        expect.any(Function)
      );
    });

    it('should track global errors and unhandled rejections', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      setupGlobalErrorTracking();

      // Trigger error event
      if (listeners['error']) {
        listeners['error']({
          error: new Error('unhandled crash'),
          message: 'unhandled crash',
        });
      }

      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'exception',
        expect.objectContaining({
          description: '[unhandled_error] unhandled crash',
          fatal: false,
        })
      );

      // Trigger promise rejection event
      if (listeners['unhandledrejection']) {
        listeners['unhandledrejection']({
          reason: new Error('promise failure'),
        });
      }

      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'exception',
        expect.objectContaining({
          description: '[unhandled_rejection] promise failure',
          fatal: false,
        })
      );
    });
  });

  describe('isLiveTelemetryBlocked', () => {
    it('should not block test environment or G-TEST ids', () => {
      expect(isLiveTelemetryBlocked('G-TEST12345')).toBe(false);
    });

    it('should allow override with VITE_FORCE_ANALYTICS or window.__FORCE_ANALYTICS__', () => {
      vi.stubEnv('VITE_FORCE_ANALYTICS', 'true');
      expect(isLiveTelemetryBlocked('G-REAL12345')).toBe(false);
      vi.unstubAllEnvs();

      (window as any).__FORCE_ANALYTICS__ = true;
      expect(isLiveTelemetryBlocked('G-REAL12345')).toBe(false);
      delete (window as any).__FORCE_ANALYTICS__;
    });

    it('should block localhost or 127.0.0.1 when not in test mode or forced', () => {
      // Mock import.meta.env.MODE temporarily to production
      vi.stubEnv('MODE', 'production');
      vi.stubEnv('DEV', false);

      const originalLocation = window.location;
      delete (window as any).location;
      (window as any).location = { hostname: 'localhost' };

      expect(isLiveTelemetryBlocked('G-46F2L343EK')).toBe(true);

      (window as any).location = { hostname: '127.0.0.1' };
      expect(isLiveTelemetryBlocked('G-46F2L343EK')).toBe(true);

      (window as any).location = { hostname: 'ergogen.xyz' };
      expect(isLiveTelemetryBlocked('G-46F2L343EK')).toBe(false);

      (window as any).location = originalLocation;
    });
  });

  describe('Service Worker Google Analytics / GTM Route Matching', () => {
    const scriptRouteMatcher = ({ url }: { url: URL }) =>
      (url.hostname === 'www.googletagmanager.com' ||
        url.hostname === 'www.google-analytics.com') &&
      (url.pathname.endsWith('.js') || url.pathname.endsWith('/js'));

    it('should match Google Tag Manager gtag/js script', () => {
      const url = new URL(
        'https://www.googletagmanager.com/gtag/js?id=G-12345&l=dataLayer'
      );
      expect(scriptRouteMatcher({ url })).toBe(true);
    });

    it('should match standard .js files from google-analytics and googletagmanager', () => {
      expect(
        scriptRouteMatcher({
          url: new URL('https://www.google-analytics.com/analytics.js'),
        })
      ).toBe(true);
      expect(
        scriptRouteMatcher({
          url: new URL('https://www.googletagmanager.com/gtm.js?id=GTM-123'),
        })
      ).toBe(true);
    });

    it('should NOT match measurement protocol collect endpoints so they are handled by Workbox background sync', () => {
      expect(
        scriptRouteMatcher({
          url: new URL(
            'https://www.google-analytics.com/g/collect?v=2&tid=G-12345'
          ),
        })
      ).toBe(false);
      expect(
        scriptRouteMatcher({
          url: new URL('https://www.google-analytics.com/collect?v=1'),
        })
      ).toBe(false);
      expect(
        scriptRouteMatcher({
          url: new URL('https://www.google-analytics.com/r/collect?v=2'),
        })
      ).toBe(false);
      expect(
        scriptRouteMatcher({
          url: new URL('https://www.google-analytics.com/mp/collect?v=2'),
        })
      ).toBe(false);
    });

    it('should NOT match scripts from third-party domains', () => {
      expect(
        scriptRouteMatcher({
          url: new URL('https://example.com/gtag/js'),
        })
      ).toBe(false);
    });
  });
});
