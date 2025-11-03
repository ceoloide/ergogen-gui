import {
  encodeConfig,
  decodeConfig,
  createShareableUri,
  getConfigFromHash,
  ShareableConfig,
} from './share';
import { compressToEncodedURIComponent } from 'lz-string';

describe('share utilities', () => {
  const testConfig = 'points:\n  - [0, 0]';
  const testInjections: string[][] = [
    ['footprint', 'test/footprint', 'function test() {}'],
  ];

  describe('encodeConfig', () => {
    it('encodes config without injections', () => {
      const encoded = encodeConfig(testConfig);
      expect(encoded).toBeTruthy();
      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThan(0);
    });

    it('encodes config with injections', () => {
      const encoded = encodeConfig(testConfig, testInjections);
      expect(encoded).toBeTruthy();
      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThan(0);
    });
  });

  describe('decodeConfig', () => {
    it('decodes config without injections', () => {
      const encoded = encodeConfig(testConfig);
      const decoded = decodeConfig(encoded);
      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.config).toBe(testConfig);
        expect(decoded.config.injections).toBeUndefined();
      }
    });

    it('decodes config with injections', () => {
      const encoded = encodeConfig(testConfig, testInjections);
      const decoded = decodeConfig(encoded);
      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.config).toBe(testConfig);
        expect(decoded.config.injections).toEqual(testInjections);
      }
    });

    it('returns decode error for invalid encoded string', () => {
      const decoded = decodeConfig('invalid-encoded-string');
      expect(decoded.success).toBe(false);
      if (!decoded.success) {
        expect(decoded.error).toBe('DECODE_ERROR');
        expect(decoded.message).toBeTruthy();
      }
    });

    it('returns decode error for empty string', () => {
      const decoded = decodeConfig('');
      expect(decoded.success).toBe(false);
      if (!decoded.success) {
        expect(decoded.error).toBe('DECODE_ERROR');
        expect(decoded.message).toBeTruthy();
      }
    });

    it('returns validation error for invalid object structure', () => {
      // Create a valid encoded string but with invalid structure
      const invalidObject = JSON.stringify({ notConfig: 'test' });
      const encoded = compressToEncodedURIComponent(invalidObject);
      const decoded = decodeConfig(encoded);
      expect(decoded.success).toBe(false);
      if (!decoded.success) {
        expect(decoded.error).toBe('VALIDATION_ERROR');
        expect(decoded.message).toBeTruthy();
      }
    });

    it('returns validation error for invalid injections structure', () => {
      // Create a config with invalid injections
      const invalidConfig = JSON.stringify({
        config: testConfig,
        injections: 'not-an-array',
      });
      const encoded = compressToEncodedURIComponent(invalidConfig);
      const decoded = decodeConfig(encoded);
      expect(decoded.success).toBe(false);
      if (!decoded.success) {
        expect(decoded.error).toBe('VALIDATION_ERROR');
        expect(decoded.message).toBeTruthy();
      }
    });
  });

  describe('createShareableUri', () => {
    beforeEach(() => {
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'https://example.com',
          pathname: '/',
        },
        writable: true,
      });
    });

    it('creates URI with config only', () => {
      const uri = createShareableUri(testConfig);
      expect(uri).toMatch(/^https:\/\/example.com\/#/);
      const fragment = uri.split('#')[1];
      expect(fragment).toBeTruthy();
    });

    it('creates URI with config and injections', () => {
      const uri = createShareableUri(testConfig, testInjections);
      expect(uri).toMatch(/^https:\/\/example.com\/#/);
      const fragment = uri.split('#')[1];
      expect(fragment).toBeTruthy();
    });
  });

  describe('getConfigFromHash', () => {
    beforeEach(() => {
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          hash: '',
        },
        writable: true,
      });
    });

    it('returns null when no hash fragment exists', () => {
      window.location.hash = '';
      const config = getConfigFromHash();
      expect(config).toBeNull();
    });

    it('decodes config from hash fragment', () => {
      const encoded = encodeConfig(testConfig);
      window.location.hash = `#${encoded}`;
      const decoded = getConfigFromHash();
      expect(decoded).not.toBeNull();
      if (decoded) {
        expect(decoded.success).toBe(true);
        if (decoded.success) {
          expect(decoded.config.config).toBe(testConfig);
        }
      }
    });

    it('decodes config with injections from hash fragment', () => {
      const encoded = encodeConfig(testConfig, testInjections);
      window.location.hash = `#${encoded}`;
      const decoded = getConfigFromHash();
      expect(decoded).not.toBeNull();
      if (decoded) {
        expect(decoded.success).toBe(true);
        if (decoded.success) {
          expect(decoded.config.config).toBe(testConfig);
          expect(decoded.config.injections).toEqual(testInjections);
        }
      }
    });

    it('returns decode error for invalid hash fragment', () => {
      window.location.hash = '#invalid';
      const decoded = getConfigFromHash();
      expect(decoded).not.toBeNull();
      if (decoded) {
        expect(decoded.success).toBe(false);
        if (!decoded.success) {
          expect(decoded.error).toBe('DECODE_ERROR');
          expect(decoded.message).toBeTruthy();
        }
      }
    });
  });

  describe('round-trip encoding', () => {
    it('maintains config integrity through encode/decode cycle', () => {
      const original: ShareableConfig = {
        config: testConfig,
        injections: testInjections,
      };

      const encoded = encodeConfig(original.config, original.injections);
      const decoded = decodeConfig(encoded);

      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.config).toBe(original.config);
        expect(decoded.config.injections).toEqual(original.injections);
      }
    });

    it('handles large configurations', () => {
      const largeConfig = 'points:\n' + Array(100).fill('[0, 0]').join('\n');
      const encoded = encodeConfig(largeConfig);
      const decoded = decodeConfig(encoded);
      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.config).toBe(largeConfig);
      }
    });
  });
});
