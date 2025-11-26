import {
  encodeConfig,
  decodeConfig,
  createShareableUri,
  getConfigFromHash,
  ShareableConfig,
  extractUsedFootprints,
  filterUsedFootprints,
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

  describe('extractUsedFootprints', () => {
    it('returns empty set for null or undefined canonical', () => {
      expect(extractUsedFootprints(null).size).toBe(0);
      expect(extractUsedFootprints(undefined).size).toBe(0);
    });

    it('returns empty set for canonical without pcbs section', () => {
      const canonical = { points: {} };
      expect(extractUsedFootprints(canonical).size).toBe(0);
    });

    it('returns empty set for canonical with empty pcbs section', () => {
      const canonical = { pcbs: {} };
      expect(extractUsedFootprints(canonical).size).toBe(0);
    });

    it('extracts footprint names from single PCB', () => {
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              keys: {
                what: 'ceoloide/switch_mx',
              },
              diodes: {
                what: 'ceoloide/diode_tht_sod123',
              },
            },
          },
        },
      };
      const used = extractUsedFootprints(canonical);
      expect(used.size).toBe(2);
      expect(used.has('ceoloide/switch_mx')).toBe(true);
      expect(used.has('ceoloide/diode_tht_sod123')).toBe(true);
    });

    it('extracts footprint names from multiple PCBs', () => {
      const canonical = {
        pcbs: {
          left_pcb: {
            footprints: {
              keys: {
                what: 'ceoloide/switch_mx',
              },
            },
          },
          right_pcb: {
            footprints: {
              keys: {
                what: 'ceoloide/switch_mx',
              },
              mcu: {
                what: 'ceoloide/mcu_nice_nano',
              },
            },
          },
        },
      };
      const used = extractUsedFootprints(canonical);
      expect(used.size).toBe(2); // Duplicates are deduplicated by Set
      expect(used.has('ceoloide/switch_mx')).toBe(true);
      expect(used.has('ceoloide/mcu_nice_nano')).toBe(true);
    });

    it('ignores footprints without what field', () => {
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              keys: {
                what: 'ceoloide/switch_mx',
              },
              invalid: {
                where: true,
              },
            },
          },
        },
      };
      const used = extractUsedFootprints(canonical);
      expect(used.size).toBe(1);
      expect(used.has('ceoloide/switch_mx')).toBe(true);
    });

    it('ignores footprints with empty what field', () => {
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              keys: {
                what: 'ceoloide/switch_mx',
              },
              invalid: {
                what: '',
              },
              invalid2: {
                what: '   ',
              },
            },
          },
        },
      };
      const used = extractUsedFootprints(canonical);
      expect(used.size).toBe(1);
      expect(used.has('ceoloide/switch_mx')).toBe(true);
    });

    it('handles PCBs without footprints section', () => {
      const canonical = {
        pcbs: {
          my_pcb: {
            template: 'kicad8',
          },
        },
      };
      const used = extractUsedFootprints(canonical);
      expect(used.size).toBe(0);
    });
  });

  describe('filterUsedFootprints', () => {
    const testInjections: string[][] = [
      ['footprint', 'ceoloide/switch_mx', 'function switch() {}'],
      ['footprint', 'ceoloide/diode_tht_sod123', 'function diode() {}'],
      ['footprint', 'ceoloide/unused_footprint', 'function unused() {}'],
      ['template', 'my_template', 'function template() {}'],
    ];

    it('returns undefined for undefined injections', () => {
      const canonical = { pcbs: {} };
      expect(filterUsedFootprints(undefined, canonical)).toBeUndefined();
    });

    it('returns undefined for empty injections', () => {
      const canonical = { pcbs: {} };
      expect(filterUsedFootprints([], canonical)).toBeUndefined();
    });

    it('filters out all footprints when canonical has no pcbs', () => {
      const canonical = {};
      const filtered = filterUsedFootprints(testInjections, canonical);
      expect(filtered).toEqual([
        ['template', 'my_template', 'function template() {}'],
      ]);
    });

    it('filters out all footprints when pcbs section is empty', () => {
      const canonical = { pcbs: {} };
      const filtered = filterUsedFootprints(testInjections, canonical);
      expect(filtered).toEqual([
        ['template', 'my_template', 'function template() {}'],
      ]);
    });

    it('keeps only used footprints', () => {
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              keys: {
                what: 'ceoloide/switch_mx',
              },
              diodes: {
                what: 'ceoloide/diode_tht_sod123',
              },
            },
          },
        },
      };
      const filtered = filterUsedFootprints(testInjections, canonical);
      expect(filtered).toEqual([
        ['footprint', 'ceoloide/switch_mx', 'function switch() {}'],
        ['footprint', 'ceoloide/diode_tht_sod123', 'function diode() {}'],
        ['template', 'my_template', 'function template() {}'],
      ]);
    });

    it('keeps all non-footprint injections', () => {
      const injections: string[][] = [
        ['footprint', 'ceoloide/switch_mx', 'function switch() {}'],
        ['template', 'my_template', 'function template() {}'],
        ['other', 'other_injection', 'function other() {}'],
      ];
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              keys: {
                what: 'ceoloide/switch_mx',
              },
            },
          },
        },
      };
      const filtered = filterUsedFootprints(injections, canonical);
      expect(filtered).toEqual([
        ['footprint', 'ceoloide/switch_mx', 'function switch() {}'],
        ['template', 'my_template', 'function template() {}'],
        ['other', 'other_injection', 'function other() {}'],
      ]);
    });

    it('returns undefined when all injections are filtered out', () => {
      const injections: string[][] = [
        ['footprint', 'ceoloide/unused_footprint', 'function unused() {}'],
      ];
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              keys: {
                what: 'ceoloide/switch_mx',
              },
            },
          },
        },
      };
      const filtered = filterUsedFootprints(injections, canonical);
      expect(filtered).toBeUndefined();
    });
  });

  describe('createShareableUri with canonical filtering', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'https://example.com',
          pathname: '/',
        },
        writable: true,
      });
    });

    it('filters footprints when canonical is provided', () => {
      const injections: string[][] = [
        ['footprint', 'ceoloide/switch_mx', 'function switch() {}'],
        ['footprint', 'ceoloide/unused_footprint', 'function unused() {}'],
        ['template', 'my_template', 'function template() {}'],
      ];
      const canonical = {
        pcbs: {
          my_pcb: {
            footprints: {
              keys: {
                what: 'ceoloide/switch_mx',
              },
            },
          },
        },
      };

      const uri = createShareableUri(testConfig, injections, canonical);
      const fragment = uri.split('#')[1];
      const decoded = decodeConfig(fragment);

      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.injections).toEqual([
          ['footprint', 'ceoloide/switch_mx', 'function switch() {}'],
          ['template', 'my_template', 'function template() {}'],
        ]);
      }
    });

    it('includes all injections when canonical is not provided', () => {
      const injections: string[][] = [
        ['footprint', 'ceoloide/switch_mx', 'function switch() {}'],
        ['footprint', 'ceoloide/unused_footprint', 'function unused() {}'],
      ];

      const uri = createShareableUri(testConfig, injections);
      const fragment = uri.split('#')[1];
      const decoded = decodeConfig(fragment);

      expect(decoded.success).toBe(true);
      if (decoded.success) {
        expect(decoded.config.injections).toEqual(injections);
      }
    });
  });
});
