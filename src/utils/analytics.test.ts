import type { Mock } from 'vitest';
import {
  trackEvent,
  initAnalytics,
  getSendUsageMetricsEnabled,
  setSendUsageMetricsEnabled,
  checkIsPWA,
  trackError,
  setupGlobalErrorTracking,
  removeGlobalErrorTracking,
  isLiveTelemetryBlocked,
  classifyFileType,
} from './analytics';
import guiPkg from '../../package.json';
import ergogenPkg from 'ergogen/package.json';

describe('Analytics Utility', () => {
  const originalGtag = window.gtag;

  beforeEach(() => {
    // Reset window.gtag before each test
    window.gtag = vi.fn();
    // Reset environment variable before each test
    vi.stubEnv('VITE_ERGOGEN_VERSION', '');
    vi.stubEnv('VITE_GTAG_ID', 'G-TEST12345');
    // Drop any in-memory consent from earlier tests (a successful write
    // clears it), then clear localStorage
    setSendUsageMetricsEnabled(true);
    localStorage.clear();
    // Clean up dynamic script tag and globals if present
    const script = document.getElementById('gtag-script');
    if (script) {
      script.remove();
    }
    delete (window as any).dataLayer;
    delete (window as any)['ga-disable-G-TEST12345'];
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
    const setStandalone = (value: boolean | undefined) => {
      Object.defineProperty(window.navigator, 'standalone', {
        value,
        configurable: true,
      });
    };

    afterEach(() => {
      setStandalone(undefined);
    });

    it('should default to true on web and false in standalone PWA mode', () => {
      expect(getSendUsageMetricsEnabled()).toBe(true);

      setStandalone(true);
      expect(getSendUsageMetricsEnabled()).toBe(false);
    });

    it('should honor an opt-out stored in ergogen:settings', () => {
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: false, debug: true })
      );
      expect(getSendUsageMetricsEnabled()).toBe(false);
    });

    it('should honor an opt-out stored in the legacy key', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'false');
      expect(getSendUsageMetricsEnabled()).toBe(false);
    });

    it('should not let a stale legacy true override a later ergogen:settings opt-out', () => {
      // Arrange: builds before 211ff8a wrote the legacy key on every mount,
      // then the user opted out through the consolidated settings object.
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: false })
      );

      // Act & Assert
      expect(getSendUsageMetricsEnabled()).toBe(false);
    });

    it('should not treat automatically saved true values as a PWA opt-in', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: true })
      );
      setStandalone(true);

      expect(getSendUsageMetricsEnabled()).toBe(false);
    });

    it('should let an explicit toggle override older opt-outs and the PWA default', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'false');
      localStorage.setItem(
        'ergogen:settings',
        JSON.stringify({ sendUsageMetrics: false })
      );
      setStandalone(true);

      setSendUsageMetricsEnabled(true);

      expect(localStorage.getItem('ergogen:consent:sendUsageMetrics')).toBe(
        'true'
      );
      expect(getSendUsageMetricsEnabled()).toBe(true);

      setSendUsageMetricsEnabled(false);
      expect(getSendUsageMetricsEnabled()).toBe(false);
    });

    it('should fail closed when localStorage reads throw', () => {
      const getItemSpy = vi
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(() => {
          throw new Error('SecurityError: The operation is insecure.');
        });

      try {
        expect(() => getSendUsageMetricsEnabled()).not.toThrow();
        expect(getSendUsageMetricsEnabled()).toBe(false);
      } finally {
        getItemSpy.mockRestore();
      }
    });

    it('should keep a toggle in memory while storage writes fail, and drop it once a write succeeds', () => {
      // Arrange: storage writes fail when the user opts in
      const setItemSpy = vi
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => {
          throw new Error('QuotaExceededError');
        });
      try {
        setSendUsageMetricsEnabled(true);
        expect(getSendUsageMetricsEnabled()).toBe(true);
        setSendUsageMetricsEnabled(false);
        expect(getSendUsageMetricsEnabled()).toBe(false);
        setSendUsageMetricsEnabled(true);
        expect(getSendUsageMetricsEnabled()).toBe(true);
      } finally {
        setItemSpy.mockRestore();
      }

      // Act: storage recovers and the user opts out
      setSendUsageMetricsEnabled(false);

      // Assert: the earlier in-memory opt-in no longer wins
      expect(getSendUsageMetricsEnabled()).toBe(false);
      expect(localStorage.getItem('ergogen:consent:sendUsageMetrics')).toBe(
        'false'
      );
    });

    it('should follow storage changes from other tabs once no write has failed', () => {
      setSendUsageMetricsEnabled(true);

      localStorage.setItem('ergogen:consent:sendUsageMetrics', 'false');

      expect(getSendUsageMetricsEnabled()).toBe(false);
    });
  });

  describe('initAnalytics', () => {
    it('should inject script tag, define gtag, and disable automatic page views and ad signals when enabled', () => {
      // Arrange
      delete (window as any).gtag;
      setSendUsageMetricsEnabled(true);

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

    it('should set a cleaned page_location globally instead of pinning it in the config call', () => {
      // Arrange
      delete (window as any).gtag;
      setSendUsageMetricsEnabled(true);
      window.history.pushState({}, '', '/landing?github=secret/repo#config');

      try {
        // Act
        initAnalytics();

        // Assert
        const entries = Array.from((window as any).dataLayer as IArguments[]);
        const setIndex = entries.findIndex(
          (entry) =>
            entry[0] === 'set' &&
            entry[1]?.page_location === `${window.location.origin}/landing`
        );
        const configIndex = entries.findIndex((entry) => entry[0] === 'config');
        expect(setIndex).toBeGreaterThanOrEqual(0);
        expect(setIndex).toBeLessThan(configIndex);
        expect(entries[configIndex][2]).not.toHaveProperty('page_location');
      } finally {
        window.history.pushState({}, '', '/');
      }
    });

    it('should not inject script tag when disabled from the start', () => {
      // Arrange
      delete (window as any).gtag;
      setSendUsageMetricsEnabled(false);

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
      setSendUsageMetricsEnabled(true);
      initAnalytics();

      const originalScript = document.getElementById('gtag-script');
      const originalDataLayer = (window as any).dataLayer;
      const originalGtagFn = window.gtag;
      expect(originalScript).toBeInTheDocument();

      document.cookie = '_ga=GA1.2.123456789.1234567890; path=/';
      document.cookie = '_ga_TEST=GS1.1.123456789.1.0.1234567890.0.0.0; path=/';

      // Act 1: opt out mid-session
      setSendUsageMetricsEnabled(false);
      initAnalytics();

      // Assert 1: disable flag set, cookies purged, original container hook preserved
      expect((window as any)['ga-disable-G-TEST12345']).toBe(true);
      expect(document.cookie).not.toContain('_ga=');
      expect(document.getElementById('gtag-script')).toBe(originalScript);
      expect((window as any).dataLayer).toBe(originalDataLayer);
      expect(window.gtag).toBe(originalGtagFn);

      // Act 2: re-enable mid-session without reload
      const lengthBeforeReEnable = originalDataLayer.length;
      setSendUsageMetricsEnabled(true);
      initAnalytics();

      // Assert 2: ga-disable cleared and config re-issued on the same hooked dataLayer
      expect((window as any)['ga-disable-G-TEST12345']).toBeUndefined();
      expect((window as any).dataLayer).toBe(originalDataLayer);
      expect(originalDataLayer.length).toBeGreaterThan(lengthBeforeReEnable);
    });
  });

  describe('trackEvent', () => {
    it('should attach the current cleaned page_location to every event and refresh it for automatic events', () => {
      // Arrange: land on one page, then navigate client-side
      setSendUsageMetricsEnabled(true);
      window.history.pushState({}, '', '/?github=secret/repo');
      window.history.pushState({}, '', '/new?github=secret/repo#hash');

      try {
        // Act
        trackEvent('keyboard_generated');

        // Assert
        const expectedLocation = `${window.location.origin}/new`;
        const calls = (window.gtag as Mock).mock.calls;
        expect(calls[0]).toEqual(['set', { page_location: expectedLocation }]);
        expect(calls[1][0]).toBe('event');
        expect(calls[1][2]).toEqual(
          expect.objectContaining({ page_location: expectedLocation })
        );
      } finally {
        window.history.pushState({}, '', '/');
      }
    });

    it('should call window.gtag with GUI, Ergogen versions, and is_pwa when enabled and gtag is defined', () => {
      setSendUsageMetricsEnabled(true);
      const eventName = 'test_event';
      const eventParams = { param1: 'value1', param2: 123 };

      trackEvent(eventName, eventParams);

      expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
        gui_version: guiPkg.version,
        ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
        is_pwa: false,
        page_location: `${window.location.origin}/`,
        param1: 'value1',
        param2: 123,
      });
    });

    it('should call window.gtag with versions and is_pwa when eventParams is not provided', () => {
      setSendUsageMetricsEnabled(true);
      const eventName = 'test_event';

      trackEvent(eventName);

      expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
        gui_version: guiPkg.version,
        ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
        is_pwa: false,
        page_location: `${window.location.origin}/`,
      });
    });

    it('should not send the constant event_category parameter', () => {
      setSendUsageMetricsEnabled(true);

      trackEvent('test_event');

      expect((window.gtag as Mock).mock.calls[1][2]).not.toHaveProperty(
        'event_category'
      );
    });

    it('should reflect custom Ergogen versions from environment variables', () => {
      setSendUsageMetricsEnabled(true);
      vi.stubEnv('VITE_ERGOGEN_VERSION', 'github:ceoloide/ergogen#v4.3.0');
      const eventName = 'test_event';

      trackEvent(eventName);

      expect(window.gtag).toHaveBeenCalledWith('event', eventName, {
        gui_version: guiPkg.version,
        ergogen_version: 'github:ceoloide/ergogen#v4.3.0',
        is_pwa: false,
        page_location: `${window.location.origin}/`,
      });
    });

    it('should set is_pwa to true when running in standalone mode', () => {
      setSendUsageMetricsEnabled(true);
      const originalStandalone = (window.navigator as any).standalone;
      Object.defineProperty(window.navigator, 'standalone', {
        value: true,
        configurable: true,
      });

      trackEvent('test_event');

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
        gui_version: guiPkg.version,
        ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
        is_pwa: true,
        page_location: `${window.location.origin}/`,
      });

      Object.defineProperty(window.navigator, 'standalone', {
        value: originalStandalone,
        configurable: true,
      });
    });

    it('should not call window.gtag when analytics is disabled', () => {
      setSendUsageMetricsEnabled(false);
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      trackEvent('test_event');

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should not throw or call anything when window.gtag is undefined', () => {
      setSendUsageMetricsEnabled(true);
      (window as any).gtag = undefined;

      expect(() => trackEvent('test_event')).not.toThrow();
    });
  });

  describe('classifyFileType', () => {
    it('should map supported extensions case-insensitively', () => {
      expect(classifyFileType('corne.yaml')).toBe('yaml');
      expect(classifyFileType('CORNE.YML')).toBe('yml');
      expect(classifyFileType('board.json')).toBe('json');
      expect(classifyFileType('archive.zip')).toBe('zip');
      expect(classifyFileType('layout.ekb')).toBe('ekb');
    });

    it('should never return free text from the filename', () => {
      expect(classifyFileType('john.smith')).toBe('other');
      expect(classifyFileType('corne v2.final draft')).toBe('other');
      expect(classifyFileType('README')).toBe('other');
    });
  });

  describe('error text scrubbing', () => {
    it('should replace quoted user values and drop extra lines from error_message', () => {
      setSendUsageMetricsEnabled(true);

      trackEvent('generation_failed', {
        error_message:
          'Unexpected key "secret_zone" within field \'points.zones.my_board\'!\n 1 | meta:\n 2 |   author: Jane Doe',
      });

      expect((window.gtag as Mock).mock.calls[1][2].error_message).toBe(
        'Unexpected key "*" within field \'*\'!'
      );
    });

    it('should cap error_message at the GA4 limit of 100 characters', () => {
      setSendUsageMetricsEnabled(true);

      trackEvent('generation_failed', { error_message: 'x'.repeat(300) });

      expect((window.gtag as Mock).mock.calls[1][2].error_message).toHaveLength(
        100
      );
    });

    it('should scrub exception descriptions and keep only stack frames', () => {
      setSendUsageMetricsEnabled(true);
      const err = new Error(
        'Cannot read properties of undefined (reading `name`)'
      );
      err.stack = [
        'TypeError: Cannot read properties of undefined (reading `name`)',
        '    at analyze (https://ergogen.ceoloide.com/assets/index-abc.js:1:200)',
        '    at run (https://ergogen.ceoloide.com/assets/index-abc.js:1:300)',
      ].join('\n');

      trackError(err, false, 'unhandled_error');

      const params = (window.gtag as Mock).mock.calls[1][2];
      expect(params.description).toBe(
        '[unhandled_error] Cannot read properties of undefined (reading `*`)'
      );
      expect(params.error_stack).not.toContain('reading');
      expect(params.error_stack.startsWith('at analyze')).toBe(true);
      expect(params.error_stack.length).toBeLessThanOrEqual(100);
    });
  });

  describe('trackError', () => {
    it('should call window.gtag with exception event and string message', () => {
      setSendUsageMetricsEnabled(true);
      trackError('test error message', true, 'test_context');

      expect(window.gtag).toHaveBeenCalledWith('event', 'exception', {
        gui_version: guiPkg.version,
        ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
        is_pwa: false,
        page_location: `${window.location.origin}/`,
        description: '[test_context] test error message',
        fatal: true,
        error_stack: undefined,
      });
    });

    it('should extract error message and stack from Error object', () => {
      setSendUsageMetricsEnabled(true);
      const err = new Error('nested failure');
      trackError(err, false);

      expect(window.gtag).toHaveBeenCalledWith('event', 'exception', {
        gui_version: guiPkg.version,
        ergogen_version: `github:ergogen/ergogen#v${ergogenPkg.version}`,
        is_pwa: false,
        page_location: `${window.location.origin}/`,
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
      setSendUsageMetricsEnabled(true);
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
