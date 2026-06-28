import {
  isMacOS,
  isWindows,
  isLinux,
  getPlatform,
  getModifierKey,
  isMobile,
} from './platform';

describe('platform utilities', () => {
  const originalNavigator = { ...window.navigator };

  beforeEach(() => {
    // Reset navigator before each test
    Object.defineProperty(window, 'navigator', {
      value: { ...originalNavigator },
      configurable: true,
    });
  });

  afterAll(() => {
    // Restore original navigator after all tests
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
  });

  const mockNavigator = (userAgent: string, userAgentData?: any) => {
    Object.defineProperty(window, 'navigator', {
      value: {
        userAgent,
        userAgentData,
      },
      configurable: true,
    });
  };

  describe('isMacOS', () => {
    it('should return true for MacOS using userAgentData', () => {
      mockNavigator('Mozilla/5.0...', { platform: 'macOS' });
      expect(isMacOS()).toBe(true);
    });

    it('should return true for MacOS using userAgent fallback', () => {
      mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...', undefined);
      expect(isMacOS()).toBe(true);
    });

    it('should return true for iOS devices', () => {
      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...', undefined);
      expect(isMacOS()).toBe(true);
    });

    it('should return false for Windows', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64)...', { platform: 'Windows' });
      expect(isMacOS()).toBe(false);
    });
  });

  describe('isWindows', () => {
    it('should return true for Windows using userAgentData', () => {
      mockNavigator('Mozilla/5.0...', { platform: 'Windows' });
      expect(isWindows()).toBe(true);
    });

    it('should return true for Windows using userAgent fallback', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64)...', undefined);
      expect(isWindows()).toBe(true);
    });

    it('should return false for MacOS', () => {
      mockNavigator('Mozilla/5.0...', { platform: 'macOS' });
      expect(isWindows()).toBe(false);
    });
  });

  describe('isLinux', () => {
    it('should return true for Linux using userAgentData', () => {
      mockNavigator('Mozilla/5.0...', { platform: 'Linux' });
      expect(isLinux()).toBe(true);
    });

    it('should return true for Linux using userAgent fallback', () => {
      mockNavigator('Mozilla/5.0 (X11; Linux x86_64)...', undefined);
      expect(isLinux()).toBe(true);
    });

    it('should return false for Windows', () => {
      mockNavigator('Mozilla/5.0...', { platform: 'Windows' });
      expect(isLinux()).toBe(false);
    });
  });

  describe('getPlatform', () => {
    it('should return "mac" for MacOS', () => {
      mockNavigator('Mozilla/5.0...', { platform: 'macOS' });
      expect(getPlatform()).toBe('mac');
    });

    it('should return "windows" for Windows', () => {
      mockNavigator('Mozilla/5.0...', { platform: 'Windows' });
      expect(getPlatform()).toBe('windows');
    });

    it('should return "linux" for Linux', () => {
      mockNavigator('Mozilla/5.0...', { platform: 'Linux' });
      expect(getPlatform()).toBe('linux');
    });

    it('should return "other" for unknown platforms', () => {
      mockNavigator('Mozilla/5.0...', { platform: 'Unknown' });
      expect(getPlatform()).toBe('other');
    });
  });

  describe('getModifierKey', () => {
    it('should return "⌘" for MacOS', () => {
      mockNavigator('Mozilla/5.0...', { platform: 'macOS' });
      expect(getModifierKey()).toBe('⌘');
    });

    it('should return "Ctrl" for non-MacOS', () => {
      mockNavigator('Mozilla/5.0...', { platform: 'Windows' });
      expect(getModifierKey()).toBe('Ctrl');
    });
  });

  describe('isMobile', () => {
    it('should return true for Android', () => {
      mockNavigator('Mozilla/5.0 (Linux; Android 10; SM-G973F)...', undefined);
      expect(isMobile()).toBe(true);
    });

    it('should return true for iPhone', () => {
      mockNavigator('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...', undefined);
      expect(isMobile()).toBe(true);
    });

    it('should return false for Desktop Chrome', () => {
      mockNavigator('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', { platform: 'Windows' });
      expect(isMobile()).toBe(false);
    });
  });
});
