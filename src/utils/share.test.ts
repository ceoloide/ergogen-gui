import {
  encodeConfig,
  decodeConfig,
  createShareableUri,
  getConfigFromHash,
  ShareableConfig,
  extractUsedFootprintsFromCanonical,
  filterInjectionsForSharing,
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

  describe('extractUsedFootprintsFromCanonical', () => {
    it('extracts footprint names from pcbs section', () => {
      // Arrange
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              switch1: { what: 'ceoloide/switch_choc_v1_v2' },
              diode1: { what: 'ceoloide/diode_tht_sod123' },
            },
          },
        },
      };

      // Act
      const usedFootprints = extractUsedFootprintsFromCanonical(canonical);

      // Assert
      expect(usedFootprints).toEqual(
        new Set(['ceoloide/switch_choc_v1_v2', 'ceoloide/diode_tht_sod123'])
      );
    });

    it('extracts footprints from multiple PCBs', () => {
      // Arrange
      const canonical = {
        pcbs: {
          pcb_left: {
            footprints: {
              switch: { what: 'custom/my_switch' },
            },
          },
          pcb_right: {
            footprints: {
              mcu: { what: 'ceoloide/mcu_nice_nano' },
            },
          },
        },
      };

      // Act
      const usedFootprints = extractUsedFootprintsFromCanonical(canonical);

      // Assert
      expect(usedFootprints).toEqual(
        new Set(['custom/my_switch', 'ceoloide/mcu_nice_nano'])
      );
    });

    it('deduplicates footprint names used in multiple places', () => {
      // Arrange
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              switch1: { what: 'ceoloide/switch_choc_v1_v2' },
              switch2: { what: 'ceoloide/switch_choc_v1_v2' },
              switch3: { what: 'ceoloide/switch_choc_v1_v2' },
            },
          },
        },
      };

      // Act
      const usedFootprints = extractUsedFootprintsFromCanonical(canonical);

      // Assert
      expect(usedFootprints).toEqual(new Set(['ceoloide/switch_choc_v1_v2']));
    });

    it('returns empty set when canonical is null', () => {
      // Act
      const usedFootprints = extractUsedFootprintsFromCanonical(null);

      // Assert
      expect(usedFootprints).toEqual(new Set());
    });

    it('returns empty set when canonical is undefined', () => {
      // Act
      const usedFootprints = extractUsedFootprintsFromCanonical(undefined);

      // Assert
      expect(usedFootprints).toEqual(new Set());
    });

    it('returns empty set when canonical has no pcbs section', () => {
      // Arrange
      const canonical = {
        points: {},
        outlines: {},
      };

      // Act
      const usedFootprints = extractUsedFootprintsFromCanonical(canonical);

      // Assert
      expect(usedFootprints).toEqual(new Set());
    });

    it('returns empty set when pcbs has no footprints', () => {
      // Arrange
      const canonical = {
        pcbs: {
          my_pcb: {
            outlines: {},
          },
        },
      };

      // Act
      const usedFootprints = extractUsedFootprintsFromCanonical(canonical);

      // Assert
      expect(usedFootprints).toEqual(new Set());
    });

    it('skips footprints without what property', () => {
      // Arrange
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              valid: { what: 'valid/footprint' },
              invalid: { other: 'property' },
            },
          },
        },
      };

      // Act
      const usedFootprints = extractUsedFootprintsFromCanonical(canonical);

      // Assert
      expect(usedFootprints).toEqual(new Set(['valid/footprint']));
    });

    it('skips footprints with non-string what property', () => {
      // Arrange
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              valid: { what: 'valid/footprint' },
              number_what: { what: 123 },
              null_what: { what: null },
            },
          },
        },
      };

      // Act
      const usedFootprints = extractUsedFootprintsFromCanonical(canonical);

      // Assert
      expect(usedFootprints).toEqual(new Set(['valid/footprint']));
    });
  });

  describe('filterInjectionsForSharing', () => {
    it('filters footprint injections to only include used ones', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'ceoloide/switch_choc_v1_v2', 'function switch() {}'],
        ['footprint', 'ceoloide/diode_tht_sod123', 'function diode() {}'],
        ['footprint', 'unused/footprint', 'function unused() {}'],
      ];
      const usedFootprints = new Set([
        'ceoloide/switch_choc_v1_v2',
        'ceoloide/diode_tht_sod123',
      ]);

      // Act
      const filtered = filterInjectionsForSharing(injections, usedFootprints);

      // Assert
      expect(filtered).toEqual([
        ['footprint', 'ceoloide/switch_choc_v1_v2', 'function switch() {}'],
        ['footprint', 'ceoloide/diode_tht_sod123', 'function diode() {}'],
      ]);
    });

    it('keeps non-footprint injections (templates) unchanged', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'used/footprint', 'function fp() {}'],
        ['footprint', 'unused/footprint', 'function unused() {}'],
        ['template', 'my_template', 'template content'],
      ];
      const usedFootprints = new Set(['used/footprint']);

      // Act
      const filtered = filterInjectionsForSharing(injections, usedFootprints);

      // Assert
      expect(filtered).toEqual([
        ['footprint', 'used/footprint', 'function fp() {}'],
        ['template', 'my_template', 'template content'],
      ]);
    });

    it('returns empty array when no injections are provided', () => {
      // Arrange
      const usedFootprints = new Set(['some/footprint']);

      // Act
      const filtered = filterInjectionsForSharing(undefined, usedFootprints);

      // Assert
      expect(filtered).toEqual([]);
    });

    it('returns empty array when injections is empty', () => {
      // Arrange
      const injections: string[][] = [];
      const usedFootprints = new Set(['some/footprint']);

      // Act
      const filtered = filterInjectionsForSharing(injections, usedFootprints);

      // Assert
      expect(filtered).toEqual([]);
    });

    it('returns all non-footprint injections when no footprints are used', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'unused/footprint1', 'function fp1() {}'],
        ['footprint', 'unused/footprint2', 'function fp2() {}'],
        ['template', 'my_template', 'template content'],
      ];
      const usedFootprints = new Set<string>();

      // Act
      const filtered = filterInjectionsForSharing(injections, usedFootprints);

      // Assert
      expect(filtered).toEqual([
        ['template', 'my_template', 'template content'],
      ]);
    });

    it('handles footprints with nested names (slashes)', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'ceoloide/utility/text', 'function text() {}'],
        ['footprint', 'ceoloide/switch_choc_v1_v2', 'function switch() {}'],
      ];
      const usedFootprints = new Set(['ceoloide/utility/text']);

      // Act
      const filtered = filterInjectionsForSharing(injections, usedFootprints);

      // Assert
      expect(filtered).toEqual([
        ['footprint', 'ceoloide/utility/text', 'function text() {}'],
      ]);
    });
  });
});
