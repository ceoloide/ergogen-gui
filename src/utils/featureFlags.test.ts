const mockState = vi.hoisted(() => ({ version: '4.2.1' }));
vi.mock('ergogen/package.json', () => ({
  get version() {
    return mockState.version;
  },
  get default() {
    return mockState;
  },
}));

import { isFeatureEnabled } from './featureFlags';
import { parseVersion, compareVersions } from './version';

describe('featureFlags utilities', () => {
  describe('parseVersion', () => {
    it('should parse standard semver strings', () => {
      expect(parseVersion('4.3.0')).toEqual([4, 3, 0]);
      expect(parseVersion('v4.2.1')).toEqual([4, 2, 1]);
      expect(parseVersion('12.0.4')).toEqual([12, 0, 4]);
    });

    it('should return null for non-standard semver strings', () => {
      expect(parseVersion('develop')).toBeNull();
      expect(parseVersion('abcdefg')).toBeNull();
      expect(parseVersion('custom-tag-v1')).toBeNull();
    });
  });

  describe('compareVersions', () => {
    it('should return true if v1 is greater than or equal to v2', () => {
      expect(compareVersions([4, 3, 0], [4, 2, 1])).toBe(true);
      expect(compareVersions([4, 3, 0], [4, 3, 0])).toBe(true);
      expect(compareVersions([5, 0, 0], [4, 3, 0])).toBe(true);
    });

    it('should return false if v1 is less than v2', () => {
      expect(compareVersions([4, 2, 1], [4, 3, 0])).toBe(false);
      expect(compareVersions([3, 9, 9], [4, 0, 0])).toBe(false);
    });
  });

  describe('isFeatureEnabled', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_FEATURE_TEMPLATES', '');
      vi.stubEnv('VITE_FEATURE_OUTLINES', '');
      vi.stubEnv('VITE_ERGOGEN_VERSION', '');
      mockState.version = '4.2.1';

      // Mock window location search
      delete (window as any).location;
      window.location = {
        search: '',
      } as any;
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should prioritize URL query overrides if present', () => {
      window.location.search = '?ff_templates=true';
      vi.stubEnv('VITE_FEATURE_TEMPLATES', 'false');
      vi.stubEnv('VITE_ERGOGEN_VERSION', '4.2.1'); // would normally disable it

      expect(isFeatureEnabled('templates')).toBe(true);

      window.location.search = '?ff_templates=false';
      vi.stubEnv('VITE_FEATURE_TEMPLATES', 'true');
      vi.stubEnv('VITE_ERGOGEN_VERSION', '4.3.0'); // would normally enable it

      expect(isFeatureEnabled('templates')).toBe(false);
    });

    it('should fall back to environment variable if no query override', () => {
      window.location.search = '';
      vi.stubEnv('VITE_FEATURE_TEMPLATES', 'true');
      vi.stubEnv('VITE_ERGOGEN_VERSION', '4.2.1'); // would normally disable it

      expect(isFeatureEnabled('templates')).toBe(true);

      vi.stubEnv('VITE_FEATURE_TEMPLATES', 'false');
      vi.stubEnv('VITE_ERGOGEN_VERSION', '4.3.0'); // would normally enable it

      expect(isFeatureEnabled('templates')).toBe(false);
    });

    it('should check Ergogen version if no overrides exist', () => {
      window.location.search = '';

      // Under minimum version (4.2.1 < 4.3.0)
      vi.stubEnv('VITE_ERGOGEN_VERSION', 'ergogen@4.2.1');
      expect(isFeatureEnabled('templates')).toBe(false);
      expect(isFeatureEnabled('outlines')).toBe(false);

      // At minimum version
      vi.stubEnv('VITE_ERGOGEN_VERSION', 'ergogen@4.3.0');
      expect(isFeatureEnabled('templates')).toBe(true);
      expect(isFeatureEnabled('outlines')).toBe(true);

      // Higher version
      vi.stubEnv('VITE_ERGOGEN_VERSION', 'ergogen@4.4.0');
      expect(isFeatureEnabled('templates')).toBe(true);
      expect(isFeatureEnabled('outlines')).toBe(true);
    });

    it('should defer to package.json version for custom developer branches (non-semver)', () => {
      window.location.search = '';

      // Defer to package version when version in package.json is < 4.3.0
      mockState.version = '4.2.1';
      vi.stubEnv('VITE_ERGOGEN_VERSION', 'github:ceoloide/ergogen#develop');
      expect(isFeatureEnabled('templates')).toBe(false);
      expect(isFeatureEnabled('outlines')).toBe(false);

      // Defer to package version when version in package.json is >= 4.3.0
      mockState.version = '4.3.0';
      vi.stubEnv('VITE_ERGOGEN_VERSION', 'github:ceoloide/ergogen#develop');
      expect(isFeatureEnabled('templates')).toBe(true);
      expect(isFeatureEnabled('outlines')).toBe(true);
    });

    it('should check tag version for custom repo releases', () => {
      window.location.search = '';

      // Custom release with tag < 4.3.0
      vi.stubEnv('VITE_ERGOGEN_VERSION', 'github:ceoloide/ergogen#v4.2.1');
      expect(isFeatureEnabled('templates')).toBe(false);

      // Custom release with tag >= 4.3.0
      vi.stubEnv('VITE_ERGOGEN_VERSION', 'github:ceoloide/ergogen#v4.3.0');
      expect(isFeatureEnabled('templates')).toBe(true);
    });
  });
});
