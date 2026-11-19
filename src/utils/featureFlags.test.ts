import { isFeatureEnabled } from './featureFlags';
import { installedEngineVersion } from './engineRequirements';
import { parseVersion, compareVersions } from './version';

// src/setupTests.tsx makes installedEngineVersion a mock that returns the
// canonical version; these tests set the version they need.
const engineVersion = vi.mocked(installedEngineVersion);

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
      engineVersion.mockReturnValue('4.2.1');

      // Mock window location search
      delete (window as any).location;
      window.location = {
        search: '',
      } as any;
    });

    afterEach(() => {
      vi.unstubAllEnvs();
      engineVersion.mockRestore();
    });

    it('should prioritize URL query overrides if present', () => {
      window.location.search = '?ff_templates=true';
      vi.stubEnv('VITE_FEATURE_TEMPLATES', 'false');
      engineVersion.mockReturnValue('4.2.1'); // would normally disable it

      expect(isFeatureEnabled('templates')).toBe(true);

      window.location.search = '?ff_templates=false';
      vi.stubEnv('VITE_FEATURE_TEMPLATES', 'true');
      engineVersion.mockReturnValue('4.3.0'); // would normally enable it

      expect(isFeatureEnabled('templates')).toBe(false);
    });

    it('should fall back to environment variable if no query override', () => {
      window.location.search = '';
      vi.stubEnv('VITE_FEATURE_TEMPLATES', 'true');
      engineVersion.mockReturnValue('4.2.1'); // would normally disable it

      expect(isFeatureEnabled('templates')).toBe(true);

      vi.stubEnv('VITE_FEATURE_TEMPLATES', 'false');
      engineVersion.mockReturnValue('4.3.0'); // would normally enable it

      expect(isFeatureEnabled('templates')).toBe(false);
    });

    it('should check the engine version if no overrides exist', () => {
      window.location.search = '';

      // Under minimum version (4.2.1 < 4.3.0)
      engineVersion.mockReturnValue('4.2.1');
      expect(isFeatureEnabled('templates')).toBe(false);
      expect(isFeatureEnabled('outlines')).toBe(false);

      // At minimum version
      engineVersion.mockReturnValue('4.3.0');
      expect(isFeatureEnabled('templates')).toBe(true);
      expect(isFeatureEnabled('outlines')).toBe(true);

      // Higher version
      engineVersion.mockReturnValue('4.4.0');
      expect(isFeatureEnabled('templates')).toBe(true);
      expect(isFeatureEnabled('outlines')).toBe(true);
    });

    it('should follow the engine rule and refuse another major version', () => {
      window.location.search = '';

      // The engine itself refuses a 4.x requirement on 5.0.0.
      engineVersion.mockReturnValue('5.0.0');
      expect(isFeatureEnabled('templates')).toBe(false);
      expect(isFeatureEnabled('outlines')).toBe(false);
    });

    it('should enable features on the canonical engine by default', () => {
      // Arrange: the version setupTests fixes for GUI tests.
      engineVersion.mockRestore();
      window.location.search = '';

      // Act / Assert
      expect(isFeatureEnabled('templates')).toBe(true);
      expect(isFeatureEnabled('outlines')).toBe(true);
    });
  });
});
