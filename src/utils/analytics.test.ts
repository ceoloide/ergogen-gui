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
    // Clean up dynamic script tag and globals if present
    const script = document.getElementById('gtag-script');
    if (script) {
      script.remove();
    }
    delete (window as any).dataLayer;
    delete (window as any)['ga-disable-G-TEST12345'];
    delete (window as any).__ergogenSendUsageMetrics;
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

    it('should keep PWA default (false) when ergogen:settings has browser-default true without explicit toggle', () => {
      // Arrange: browser visit saved default settings (no explicit ergogen:config:sendUsageMetrics toggle)
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: true, autoGen: true })
      );
      const originalStandalone = (window.navigator as any).standalone;
      Object.defineProperty(window.navigator, 'standalone', {
        value: true,
        configurable: true,
      });

      try {
        // Act & Assert: standalone PWA must stay disabled until explicitly opted in
        expect(getSendUsageMetricsEnabled()).toBe(false);

        // Explicit opt-in via toggle key overrides PWA default
        localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
        expect(getSendUsageMetricsEnabled()).toBe(true);
      } finally {
        Object.defineProperty(window.navigator, 'standalone', {
          value: originalStandalone,
          configurable: true,
        });
      }
    });

    it('should fail closed (false) when localStorage access throws SecurityError, unless overridden in session memory', () => {
      // Arrange
      const getItemSpy = vi
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(() => {
          throw new Error('SecurityError: The operation is insecure.');
        });

      try {
        // Act & Assert: fail closed on both web and PWA when storage throws
        expect(() => getSendUsageMetricsEnabled()).not.toThrow();
        expect(getSendUsageMetricsEnabled()).toBe(false);

        // In-memory session toggle override works even without storage
        (window as any).__ergogenSendUsageMetrics = true;
        expect(getSendUsageMetricsEnabled()).toBe(true);

        (window as any).__ergogenSendUsageMetrics = false;
        expect(getSendUsageMetricsEnabled()).toBe(false);
      } finally {
        getItemSpy.mockRestore();
      }
    });
  });

  describe('initAnalytics', () => {
    it('should inject script tag, define gtag, and disable automatic page views and ad signals when enabled', () => {
      // Arrange
      delete (window as any).gtag;
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');

      // Act
      initAnalytics();

      // Assert
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

      const configCall = Array.from(win.dataLayer as IArguments[]).find(
        (entry) => entry[0] === 'config' && entry[1] === 'G-TEST12345'
      );
      expect(configCall).toBeDefined();
      expect(configCall?.[2]).toEqual(
        expect.objectContaining({
          send_page_view: false,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
        })
      );
    });

    it('should not inject script tag when disabled from the start', () => {
      // Arrange
      delete (window as any).gtag;
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'false');

      // Act
      initAnalytics();

      // Assert
      expect(document.getElementById('gtag-script')).toBeNull();
      expect(window.gtag).toBeUndefined();
      expect((window as any)['ga-disable-G-TEST12345']).toBe(true);
    });

    it('should set ga-disable, clear cookies, and preserve dataLayer/gtag hook on mid-session opt-out so re-enabling works without reload', () => {
      // Arrange: initial enabled load
      delete (window as any).gtag;
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      initAnalytics();

      const originalScript = document.getElementById('gtag-script');
      const originalDataLayer = (window as any).dataLayer;
      const originalGtagFn = window.gtag;
      expect(originalScript).toBeInTheDocument();

      document.cookie = '_ga=GA1.2.123456789.1234567890; path=/';
      document.cookie = '_ga_TEST=GS1.1.123456789.1.0.1234567890.0.0.0; path=/';

      // Act 1: opt out mid-session
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'false');
      initAnalytics();

      // Assert 1: disable flag set, cookies purged, original container hook preserved
      expect((window as any)['ga-disable-G-TEST12345']).toBe(true);
      expect(document.cookie).not.toContain('_ga=');
      expect(document.getElementById('gtag-script')).toBe(originalScript);
      expect((window as any).dataLayer).toBe(originalDataLayer);
      expect(window.gtag).toBe(originalGtagFn);

      // Act 2: re-enable mid-session without reload
      const lengthBeforeReEnable = originalDataLayer.length;
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      initAnalytics();

      // Assert 2: ga-disable cleared and config re-issued on the same hooked dataLayer
      expect((window as any)['ga-disable-G-TEST12345']).toBeUndefined();
      expect((window as any).dataLayer).toBe(originalDataLayer);
      expect(originalDataLayer.length).toBeGreaterThan(lengthBeforeReEnable);
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
});
