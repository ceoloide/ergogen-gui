import {
  encodeConfigToUri,
  decodeConfigFromUri,
  createShareableUri,
  ShareableConfig,
} from './share';

describe('share utilities', () => {
  describe('encodeConfigToUri and decodeConfigFromUri', () => {
    // Arrange
    const testConfig = `points:
  zones:
    matrix:
      columns:
        pinky:
        ring:
        middle:
        index:
        inner:
      rows:
        bottom:
        home:
        top:`;

    it('should encode and decode a simple config', () => {
      // Act
      const encoded = encodeConfigToUri(testConfig);
      const decoded = decodeConfigFromUri(encoded);

      // Assert
      expect(decoded).not.toBeNull();
      expect(decoded?.config).toBe(testConfig);
      expect(decoded?.version).toBe(1);
    });

    it('should encode and decode config with injections', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'test_footprint', 'module.exports = {}'],
        ['template', 'test_template', 'const template = {};'],
      ];

      // Act
      const encoded = encodeConfigToUri(testConfig, injections);
      const decoded = decodeConfigFromUri(encoded);

      // Assert
      expect(decoded).not.toBeNull();
      expect(decoded?.config).toBe(testConfig);
      expect(decoded?.injections).toEqual(injections);
      expect(decoded?.version).toBe(1);
    });

    it('should handle empty config', () => {
      // Arrange
      const emptyConfig = '';

      // Act
      const encoded = encodeConfigToUri(emptyConfig);
      const decoded = decodeConfigFromUri(encoded);

      // Assert
      expect(decoded).not.toBeNull();
      expect(decoded?.config).toBe(emptyConfig);
    });

    it('should return null for invalid encoded strings', () => {
      // Arrange
      const invalidEncoded = 'this-is-not-valid-encoded-data';

      // Act
      const decoded = decodeConfigFromUri(invalidEncoded);

      // Assert
      expect(decoded).toBeNull();
    });

    it('should return null for empty string', () => {
      // Act
      const decoded = decodeConfigFromUri('');

      // Assert
      expect(decoded).toBeNull();
    });

    it('should handle special characters in config', () => {
      // Arrange
      const configWithSpecialChars = `# Comment with special chars: !@#$%^&*()
points:
  zones:
    "matrix":
      anchor:
        rotate: 5
      columns:
        pinky:
          key.name: "test-key"`;

      // Act
      const encoded = encodeConfigToUri(configWithSpecialChars);
      const decoded = decodeConfigFromUri(encoded);

      // Assert
      expect(decoded).not.toBeNull();
      expect(decoded?.config).toBe(configWithSpecialChars);
    });

    it('should handle large configs efficiently', () => {
      // Arrange
      const largeConfig = `points:
  zones:
${Array(100)
  .fill(0)
  .map(
    (_, i) =>
      `    zone${i}:\n      columns:\n        col1:\n        col2:\n      rows:\n        row1:\n        row2:`
  )
  .join('\n')}`;

      // Act
      const encoded = encodeConfigToUri(largeConfig);
      const decoded = decodeConfigFromUri(encoded);

      // Assert
      expect(decoded).not.toBeNull();
      expect(decoded?.config).toBe(largeConfig);
      // Verify compression is working (encoded should be smaller than original)
      expect(encoded.length).toBeLessThan(largeConfig.length);
    });
  });

  describe('createShareableUri', () => {
    // Arrange
    const testConfig = 'points:\n  zones:\n    matrix:';
    const originalLocation = window.location;

    beforeAll(() => {
      // Mock window.location
      delete (window as { location?: Location }).location;
      window.location = {
        ...originalLocation,
        origin: 'https://ergogen.example.com',
        pathname: '/editor',
      } as Location;
    });

    afterAll(() => {
      // Restore window.location
      window.location = originalLocation;
    });

    it('should create a valid shareable URI', () => {
      // Act
      const uri = createShareableUri(testConfig);

      // Assert
      expect(uri).toContain('https://ergogen.example.com/editor#');
      expect(uri.split('#')[1]).toBeTruthy();
    });

    it('should create a URI that can be decoded back', () => {
      // Act
      const uri = createShareableUri(testConfig);
      const hashFragment = uri.split('#')[1];
      const decoded = decodeConfigFromUri(hashFragment);

      // Assert
      expect(decoded).not.toBeNull();
      expect(decoded?.config).toBe(testConfig);
    });

    it('should include injections in the URI when provided', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'test', 'module.exports = {}'],
      ];

      // Act
      const uri = createShareableUri(testConfig, injections);
      const hashFragment = uri.split('#')[1];
      const decoded = decodeConfigFromUri(hashFragment);

      // Assert
      expect(decoded).not.toBeNull();
      expect(decoded?.injections).toEqual(injections);
    });
  });

  describe('ShareableConfig interface', () => {
    it('should have correct structure for version 1', () => {
      // Arrange
      const config: ShareableConfig = {
        config: 'test config',
        version: 1,
        injections: [['footprint', 'test', 'code']],
      };

      // Assert
      expect(config.config).toBe('test config');
      expect(config.version).toBe(1);
      expect(config.injections).toHaveLength(1);
    });

    it('should allow optional injections field', () => {
      // Arrange
      const config: ShareableConfig = {
        config: 'test config',
        version: 1,
      };

      // Assert
      expect(config.injections).toBeUndefined();
    });
  });
});
