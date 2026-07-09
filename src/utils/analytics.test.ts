import {
  trackEvent,
  initAnalytics,
  getAnalyticsEnabled,
  checkIsPWA,
} from './analytics';
import guiPkg from '../../package.json';
import ergogenPkg from 'ergogen/package.json';

describe('Analytics Utility', () => {
  const originalGtag = window.gtag;
  const originalEnv = process.env.REACT_APP_ERGOGEN_VERSION;
  const originalGtagId = process.env.REACT_APP_GTAG_ID;

  beforeEach(() => {
    // Reset window.gtag before each test
    window.gtag = jest.fn();
    // Reset environment variable before each test
    process.env.REACT_APP_ERGOGEN_VERSION = originalEnv;
    process.env.REACT_APP_GTAG_ID = 'G-TEST12345';
    // Clear localStorage
    localStorage.clear();
    // Clean up dynamic script tag if present
    const script = document.getElementById('gtag-script');
    if (script) {
      script.remove();
    }
  });

  afterAll(() => {
    // Restore original globals and environment variables
    window.gtag = originalGtag;
    process.env.REACT_APP_ERGOGEN_VERSION = originalEnv;
    process.env.REACT_APP_GTAG_ID = originalGtagId;
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

  describe('getAnalyticsEnabled', () => {
    it('should default to true on web (not PWA mode)', () => {
      expect(getAnalyticsEnabled()).toBe(true);
    });

    it('should return false if localStorage has it set to false', () => {
      localStorage.setItem('ergogen:config:enableAnalytics', 'false');
      expect(getAnalyticsEnabled()).toBe(false);
    });

    it('should return true if localStorage has it set to true', () => {
      localStorage.setItem('ergogen:config:enableAnalytics', 'true');
      expect(getAnalyticsEnabled()).toBe(true);
    });
  });

  describe('initAnalytics', () => {
    it('should inject script tag and define gtag when enabled', () => {
      localStorage.setItem('ergogen:config:enableAnalytics', 'true');
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
      localStorage.setItem('ergogen:config:enableAnalytics', 'true');
      initAnalytics();
      expect(document.getElementById('gtag-script')).toBeInTheDocument();

      // Change setting to false and re-initialize
      localStorage.setItem('ergogen:config:enableAnalytics', 'false');
      initAnalytics();

      expect(document.getElementById('gtag-script')).toBeNull();
      expect(window.gtag).toBeUndefined();
    });
  });

  describe('trackEvent', () => {
    it('should call window.gtag with GUI, Ergogen versions, and is_pwa when enabled and gtag is defined', () => {
      localStorage.setItem('ergogen:config:enableAnalytics', 'true');
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
      localStorage.setItem('ergogen:config:enableAnalytics', 'true');
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
      localStorage.setItem('ergogen:config:enableAnalytics', 'true');
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
      localStorage.setItem('ergogen:config:enableAnalytics', 'true');
      process.env.REACT_APP_ERGOGEN_VERSION = 'github:ceoloide/ergogen#v4.3.0';
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
      localStorage.setItem('ergogen:config:enableAnalytics', 'true');
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
      localStorage.setItem('ergogen:config:enableAnalytics', 'false');
      const mockGtag = jest.fn();
      window.gtag = mockGtag;

      trackEvent('test_event');

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should not throw or call anything when window.gtag is undefined', () => {
      localStorage.setItem('ergogen:config:enableAnalytics', 'true');
      (window as any).gtag = undefined;

      expect(() => trackEvent('test_event')).not.toThrow();
    });
  });
});
