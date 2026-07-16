import {
  trackEvent,
  initAnalytics,
  getSendUsageMetricsEnabled,
  checkIsPWA,
  trackError,
  setupGlobalErrorTracking,
  removeGlobalErrorTracking,
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

    it('should return false if localStorage has it set to false', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'false');
      expect(getSendUsageMetricsEnabled()).toBe(false);
    });

    it('should return true if localStorage has it set to true', () => {
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
  });

  describe('initAnalytics', () => {
    it('should inject script tag and define gtag when enabled', () => {
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      initAnalytics();

      const script = document.getElementById(
        'gtag-script'
      ) as HTMLScriptElement;
      expect(script).toBeInTheDocument();
      expect(script.src).toContain(
        'https://www.googletagmanager.com/gtag/js?id=G-TEST12345'
      );
      expect(window.gtag).toBeDefined();
    });

    it('should clean up script tag and delete globals when disabled', () => {
      // Setup: first load it
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'true');
      initAnalytics();
      expect(document.getElementById('gtag-script')).toBeInTheDocument();

      // Change setting to false and re-initialize
      localStorage.setItem('ergogen:config:sendUsageMetrics', 'false');
      initAnalytics();

      expect(document.getElementById('gtag-script')).toBeNull();
      expect(window.gtag).toBeUndefined();
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
});
