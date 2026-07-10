import {
  encodeConfig,
  decodeConfig,
  createShareableUri,
  getConfigFromHash,
  ShareableConfig,
  filterInjectionsForSharing,
  extractUsedInjectionsFromCanonical,
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

    it('decodes config with custom version values', () => {
      const customGui = '1.2.3';
      const customErgogen = 'github:myfork/ergogen#v4.5.6';
      const encoded = encodeConfig(
        testConfig,
        undefined,
        customGui,
        customErgogen
      );
      const decoded = decodeConfig(encoded);
      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.guiVersion).toBe(customGui);
        expect(decoded.config.ergogenVersion).toBe(customErgogen);
      }
    });

    it('uses fallback values for guiVersion and ergogenVersion when they are missing in payload', () => {
      // Create a payload that has config but lacks guiVersion and ergogenVersion
      const legacyPayload = JSON.stringify({
        config: testConfig,
      });
      const encoded = compressToEncodedURIComponent(legacyPayload);
      const decoded = decodeConfig(encoded);
      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.guiVersion).toBe('0.9.0');
        expect(decoded.config.ergogenVersion).toBe(
          'github:ergogen/ergogen#v4.2.1'
        );
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
      // Act
      const uri = createShareableUri({ config: testConfig });

      // Assert
      expect(uri).toMatch(/^https:\/\/example.com\/#/);
      const fragment = uri.split('#')[1];
      expect(fragment).toBeTruthy();
    });

    it('creates URI with config and injections', () => {
      // Act
      const uri = createShareableUri({
        config: testConfig,
        injections: testInjections,
      });

      // Assert
      expect(uri).toMatch(/^https:\/\/example.com\/#/);
      const fragment = uri.split('#')[1];
      expect(fragment).toBeTruthy();
    });

    it('filters injections when canonical is provided', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'used/switch', 'function switch() {}'],
        ['footprint', 'unused/diode', 'function diode() {}'],
        ['template', 'my_template', 'template content'],
        ['template', 'unused_template', 'old content'],
      ];
      const canonical = {
        pcbs: {
          my_pcb: {
            template: 'my_template',
            footprints: {
              switch1: { what: 'used/switch' },
            },
          },
        },
      };

      // Act
      const uri = createShareableUri({
        config: testConfig,
        injections,
        canonical,
      });

      // Assert - only the used footprint and used template are included
      const fragment = uri.split('#')[1];
      const decoded = decodeConfig(fragment);
      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.injections).toEqual([
          ['footprint', 'used/switch', 'function switch() {}'],
          ['template', 'my_template', 'template content'],
        ]);
      }
    });

    it('includes all injections when canonical is not provided', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'footprint1', 'function fp1() {}'],
        ['footprint', 'footprint2', 'function fp2() {}'],
      ];

      // Act
      const uri = createShareableUri({
        config: testConfig,
        injections,
      });

      // Assert - all injections should be included
      const fragment = uri.split('#')[1];
      const decoded = decodeConfig(fragment);
      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.injections).toEqual(injections);
      }
    });

    it('excludes injections when all footprints are filtered out', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'unused/footprint', 'function fp() {}'],
      ];
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              switch1: { what: 'different/footprint' },
            },
          },
        },
      };

      // Act
      const uri = createShareableUri({
        config: testConfig,
        injections,
        canonical,
      });

      // Assert - no injections should be in the result
      const fragment = uri.split('#')[1];
      const decoded = decodeConfig(fragment);
      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.injections).toBeUndefined();
      }
    });

    it('handles canonical with no pcbs section (all injections filtered out)', () => {
      // Arrange: no pcbs section means no footprint, template, or outline usage is detected
      const injections: string[][] = [
        ['footprint', 'some/footprint', 'function fp() {}'],
        ['template', 'my_template', 'template content'],
      ];
      const canonical = {
        points: {},
        outlines: {},
      };

      // Act
      const uri = createShareableUri({
        config: testConfig,
        injections,
        canonical,
      });

      // Assert - no injections are used so none should be included
      const fragment = uri.split('#')[1];
      const decoded = decodeConfig(fragment);
      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.injections).toBeUndefined();
      }
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

  describe('filterInjectionsForSharing', () => {
    // Helper to build a UsedInjections object with empty sets for unused types
    const usedWith = ({
      footprints = new Set<string>(),
      templates = new Set<string>(),
      outlines = new Set<string>(),
    } = {}) => ({ footprints, templates, outlines });

    it('filters footprint injections to only include used ones', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'ceoloide/switch_choc_v1_v2', 'function switch() {}'],
        ['footprint', 'ceoloide/diode_tht_sod123', 'function diode() {}'],
        ['footprint', 'unused/footprint', 'function unused() {}'],
      ];
      const used = usedWith({
        footprints: new Set([
          'ceoloide/switch_choc_v1_v2',
          'ceoloide/diode_tht_sod123',
        ]),
      });

      // Act
      const filtered = filterInjectionsForSharing(injections, used);

      // Assert
      expect(filtered).toEqual([
        ['footprint', 'ceoloide/switch_choc_v1_v2', 'function switch() {}'],
        ['footprint', 'ceoloide/diode_tht_sod123', 'function diode() {}'],
      ]);
    });

    it('filters template injections to only include used ones', () => {
      // Arrange
      const injections: string[][] = [
        ['template', 'kicad8', 'template content'],
        ['template', 'kicad5', 'old template'],
      ];
      const used = usedWith({ templates: new Set(['kicad8']) });

      // Act
      const filtered = filterInjectionsForSharing(injections, used);

      // Assert
      expect(filtered).toEqual([['template', 'kicad8', 'template content']]);
    });

    it('filters outline injections to only include used ones', () => {
      // Arrange
      const injections: string[][] = [
        ['outline', 'my_shape', 'outline content'],
        ['outline', 'other_shape', 'other content'],
      ];
      const used = usedWith({ outlines: new Set(['my_shape']) });

      // Act
      const filtered = filterInjectionsForSharing(injections, used);

      // Assert
      expect(filtered).toEqual([['outline', 'my_shape', 'outline content']]);
    });

    it('filters all three injection types independently', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'used/fp', 'function fp() {}'],
        ['footprint', 'unused/fp', 'function fp2() {}'],
        ['template', 'kicad8', 'template content'],
        ['template', 'kicad5', 'old template'],
        ['outline', 'my_shape', 'outline content'],
        ['outline', 'other_shape', 'other content'],
      ];
      const used = usedWith({
        footprints: new Set(['used/fp']),
        templates: new Set(['kicad8']),
        outlines: new Set(['my_shape']),
      });

      // Act
      const filtered = filterInjectionsForSharing(injections, used);

      // Assert
      expect(filtered).toEqual([
        ['footprint', 'used/fp', 'function fp() {}'],
        ['template', 'kicad8', 'template content'],
        ['outline', 'my_shape', 'outline content'],
      ]);
    });

    it('returns empty array when no injections are provided', () => {
      // Arrange
      const used = usedWith({ footprints: new Set(['some/footprint']) });

      // Act
      const filtered = filterInjectionsForSharing(undefined, used);

      // Assert
      expect(filtered).toEqual([]);
    });

    it('returns empty array when injections is empty', () => {
      // Arrange
      const injections: string[][] = [];
      const used = usedWith({ footprints: new Set(['some/footprint']) });

      // Act
      const filtered = filterInjectionsForSharing(injections, used);

      // Assert
      expect(filtered).toEqual([]);
    });

    it('handles footprints with nested names (slashes)', () => {
      // Arrange
      const injections: string[][] = [
        ['footprint', 'ceoloide/utility/text', 'function text() {}'],
        ['footprint', 'ceoloide/switch_choc_v1_v2', 'function switch() {}'],
      ];
      const used = usedWith({
        footprints: new Set(['ceoloide/utility/text']),
      });

      // Act
      const filtered = filterInjectionsForSharing(injections, used);

      // Assert
      expect(filtered).toEqual([
        ['footprint', 'ceoloide/utility/text', 'function text() {}'],
      ]);
    });
  });

  describe('extractUsedInjectionsFromCanonical', () => {
    it('extracts footprints, templates, and outlines from a full canonical', () => {
      // Arrange
      const canonical = {
        pcbs: {
          board: {
            template: 'kicad8',
            footprints: {
              sw1: { what: 'mx' },
            },
            outlines: {
              main: { outline: 'board_outline' },
            },
          },
        },
        outlines: {
          board_outline: {
            base: { what: 'my_custom_svg' },
            cutout: { what: 'rectangle' },
          },
        },
      };

      // Act
      const result = extractUsedInjectionsFromCanonical(canonical);

      // Assert
      expect(result.footprints).toEqual(new Set(['mx']));
      expect(result.templates).toEqual(new Set(['kicad8']));
      expect(result.outlines).toEqual(new Set(['my_custom_svg', 'rectangle']));
    });

    it('extracts footprint names from multiple PCBs', () => {
      // Arrange
      const canonical = {
        pcbs: {
          pcb_left: { footprints: { switch: { what: 'custom/my_switch' } } },
          pcb_right: {
            footprints: { mcu: { what: 'ceoloide/mcu_nice_nano' } },
          },
        },
      };

      // Act
      const result = extractUsedInjectionsFromCanonical(canonical);

      // Assert
      expect(result.footprints).toEqual(
        new Set(['custom/my_switch', 'ceoloide/mcu_nice_nano'])
      );
    });

    it('extracts templates from pcbs section', () => {
      // Arrange
      const canonical = {
        pcbs: {
          left: { template: 'kicad5' },
          right: { template: 'kicad8' },
        },
      };

      // Act
      const result = extractUsedInjectionsFromCanonical(canonical);

      // Assert
      expect(result.templates).toEqual(new Set(['kicad5', 'kicad8']));
    });

    it('extracts outline what values from outlines section (object-style ops)', () => {
      // Arrange: canonical outlines with object-keyed operations (the normal canonical form)
      const canonical = {
        outlines: {
          board: {
            base: { what: 'my_custom_shape' },
            hole: { what: 'circle' },
          },
          top_plate: {
            main: { what: 'another_custom' },
          },
        },
      };

      // Act
      const result = extractUsedInjectionsFromCanonical(canonical);

      // Assert: includes both custom and built-in what values
      expect(result.outlines).toEqual(
        new Set(['my_custom_shape', 'circle', 'another_custom'])
      );
    });

    it('extracts outline what values from outlines section (array-style ops)', () => {
      // Arrange: canonical outlines where the value is an array (after unnest)
      const canonical = {
        outlines: {
          board: [{ what: 'my_custom_shape' }, { what: 'rectangle' }],
        },
      };

      // Act
      const result = extractUsedInjectionsFromCanonical(canonical);

      // Assert
      expect(result.outlines).toEqual(
        new Set(['my_custom_shape', 'rectangle'])
      );
    });

    it('omits outline operations without an explicit what field', () => {
      // Arrange: part without explicit what — ergogen defaults to 'outline' at runtime,
      // but the canonical preserves the original YAML (no what field means undefined here)
      const canonical = {
        outlines: {
          board: {
            base: { what: 'rectangle' },
            derived: {
              /* no what field — uses ergogen default at runtime */
            },
          },
        },
      };

      // Act
      const result = extractUsedInjectionsFromCanonical(canonical);

      // Assert: only 'rectangle' is extracted; missing what is skipped
      expect(result.outlines).toEqual(new Set(['rectangle']));
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
      const result = extractUsedInjectionsFromCanonical(canonical);

      // Assert
      expect(result.footprints).toEqual(new Set(['valid/footprint']));
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
      const result = extractUsedInjectionsFromCanonical(canonical);

      // Assert
      expect(result.footprints).toEqual(new Set(['valid/footprint']));
    });

    it('returns empty sets for null canonical', () => {
      // Act
      const result = extractUsedInjectionsFromCanonical(null);

      // Assert
      expect(result.footprints).toEqual(new Set());
      expect(result.templates).toEqual(new Set());
      expect(result.outlines).toEqual(new Set());
    });

    it('returns empty sets when pcbs and outlines sections are absent', () => {
      // Arrange
      const canonical = { points: {}, units: {} };

      // Act
      const result = extractUsedInjectionsFromCanonical(canonical);

      // Assert
      expect(result.footprints).toEqual(new Set());
      expect(result.templates).toEqual(new Set());
      expect(result.outlines).toEqual(new Set());
    });

    it('deduplicates across multiple pcbs and outlines', () => {
      // Arrange
      const canonical = {
        pcbs: {
          left: { template: 'kicad8', footprints: { sw1: { what: 'mx' } } },
          right: { template: 'kicad8', footprints: { sw2: { what: 'mx' } } },
        },
        outlines: {
          board: {
            a: { what: 'my_shape' },
            b: { what: 'my_shape' },
          },
        },
      };

      // Act
      const result = extractUsedInjectionsFromCanonical(canonical);

      // Assert: each name appears only once despite multiple references
      expect(result.footprints).toEqual(new Set(['mx']));
      expect(result.templates).toEqual(new Set(['kicad8']));
      expect(result.outlines).toEqual(new Set(['my_shape']));
    });
  });
});
