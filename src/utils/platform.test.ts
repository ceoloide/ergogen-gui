import { isMacOS, isWindows, isLinux, getPlatform, getModifierKey, isMobile } from './platform';

describe('platform utilities', () => {
  const originalNavigator = { ...global.navigator };

  beforeEach(() => {
    // Reset navigator before each test
    Object.defineProperty(global, 'navigator', {
      value: { ...originalNavigator },
      configurable: true,
      writable: true,
    });
  });

  afterAll(() => {
    // Restore original navigator
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
  });

  describe('isMacOS', () => {
    it('returns true when userAgentData platform is macOS', () => {
      Object.defineProperty(global.navigator, 'userAgentData', {
        value: { platform: 'macOS' },
        configurable: true,
      });
      expect(isMacOS()).toBe(true);
    });

    it('returns true when userAgent contains Mac', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        configurable: true,
      });
      expect(isMacOS()).toBe(true);
    });

    it('returns false for other platforms', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });
      expect(isMacOS()).toBe(false);
    });
  });

  describe('isWindows', () => {
    it('returns true when userAgentData platform is Windows', () => {
      Object.defineProperty(global.navigator, 'userAgentData', {
        value: { platform: 'Win32' },
        configurable: true,
      });
      expect(isWindows()).toBe(true);
    });

    it('returns true when userAgent contains Win', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });
      expect(isWindows()).toBe(true);
    });

    it('returns false for other platforms', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        configurable: true,
      });
      expect(isWindows()).toBe(false);
    });
  });

  describe('isLinux', () => {
    it('returns true when userAgentData platform is Linux', () => {
      Object.defineProperty(global.navigator, 'userAgentData', {
        value: { platform: 'Linux x86_64' },
        configurable: true,
      });
      expect(isLinux()).toBe(true);
    });

    it('returns true when userAgent contains Linux', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (X11; Linux x86_64)',
        configurable: true,
      });
      expect(isLinux()).toBe(true);
    });

    it('returns false for other platforms', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });
      expect(isLinux()).toBe(false);
    });
  });

  describe('getPlatform', () => {
    it('returns "mac" for macOS', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        configurable: true,
      });
      expect(getPlatform()).toBe('mac');
    });

    it('returns "windows" for Windows', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });
      expect(getPlatform()).toBe('windows');
    });

    it('returns "linux" for Linux', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (X11; Linux x86_64)',
        configurable: true,
      });
      expect(getPlatform()).toBe('linux');
    });

    it('returns "other" for unknown platform', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Unknown Browser',
        configurable: true,
      });
      expect(getPlatform()).toBe('other');
    });
  });

  describe('getModifierKey', () => {
    it('returns "⌘" for macOS', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        configurable: true,
      });
      expect(getModifierKey()).toBe('⌘');
    });

    it('returns "Ctrl" for other platforms', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });
      expect(getModifierKey()).toBe('Ctrl');
    });
  });

  describe('isMobile', () => {
    it('returns true for Android user agent', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10; SM-G973F)',
        configurable: true,
      });
      expect(isMobile()).toBe(true);
    });

    it('returns true for iPhone user agent', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      expect(isMobile()).toBe(true);
    });

    it('returns false for desktop user agent', () => {
      Object.defineProperty(global.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });
      expect(isMobile()).toBe(false);
    });
  });
});
