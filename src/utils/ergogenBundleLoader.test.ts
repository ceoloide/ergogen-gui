import JSZip from 'jszip';
import {
  cleanInjectionName,
  validateZipStructure,
  enforceFileSizeLimit,
  mapToInjectionsArray,
  mapSeparateToInjectionsArray,
  parseZipArchive,
  MAX_ARCHIVE_SIZE_BYTES,
  MAX_TEXT_FILE_SIZE_BYTES,
  ErgogenInjection,
  ErgogenWorkspaceBundle,
} from './ergogenBundleLoader';
import { isFeatureEnabled } from './featureFlags';

// Mock featureFlags
vi.mock('./featureFlags', () => ({
  isFeatureEnabled: jest.fn(),
}));

describe('ergogenBundleLoader', () => {
  beforeEach(() => {
    (isFeatureEnabled as jest.Mock).mockReturnValue(true);
  });

  describe('cleanInjectionName', () => {
    it('should extract footprint name removing footprints/ prefix and .js extension', () => {
      expect(
        cleanInjectionName('footprints/ceoloide/key.js', 'footprints')
      ).toBe('ceoloide/key');
    });

    it('should extract outline name removing outlines/ prefix and .js extension', () => {
      expect(cleanInjectionName('outlines/my_outline.js', 'outlines')).toBe(
        'my_outline'
      );
    });

    it('should extract template name removing templates/ prefix and .js extension', () => {
      expect(cleanInjectionName('templates/custom/case.js', 'templates')).toBe(
        'custom/case'
      );
    });
  });

  describe('validateZipStructure', () => {
    it('should return config.yaml file if present in JSZip', () => {
      const zip = new JSZip();
      zip.file('config.yaml', 'points: {}');
      const file = validateZipStructure(zip);
      expect(file).toBeDefined();
      expect(file?.name).toBe('config.yaml');
    });

    it('should return config.yml file if config.yaml is absent', () => {
      const zip = new JSZip();
      zip.file('config.yml', 'points: {}');
      const file = validateZipStructure(zip);
      expect(file).toBeDefined();
      expect(file?.name).toBe('config.yml');
    });

    it('should perform case-insensitive checks', () => {
      const zip = new JSZip();
      zip.file('CONFIG.YAML', 'points: {}');
      const file = validateZipStructure(zip);
      expect(file).toBeDefined();
      expect(file?.name).toBe('CONFIG.YAML');
    });

    it('should throw an error if no config.yaml or config.yml is found', () => {
      const zip = new JSZip();
      zip.file('footprints/ceoloide/key.js', 'console.log()');
      expect(() => validateZipStructure(zip)).toThrow(
        'The archive is missing a config.yaml file in the root directory.'
      );
    });
  });

  describe('enforceFileSizeLimit', () => {
    it('should not throw error if file sizes are within limits', () => {
      expect(() =>
        enforceFileSizeLimit(MAX_ARCHIVE_SIZE_BYTES - 100, true)
      ).not.toThrow();
      expect(() =>
        enforceFileSizeLimit(MAX_TEXT_FILE_SIZE_BYTES - 100, false)
      ).not.toThrow();
    });

    it('should throw error if zip file size exceeds limit', () => {
      expect(() =>
        enforceFileSizeLimit(MAX_ARCHIVE_SIZE_BYTES + 1, true)
      ).toThrow(/exceeds the maximum size limit of 50MB/);
    });

    it('should throw error if text file size exceeds limit', () => {
      expect(() =>
        enforceFileSizeLimit(MAX_TEXT_FILE_SIZE_BYTES + 1, false)
      ).toThrow(/exceeds the maximum size limit of 10MB/);
    });
  });

  describe('mapToInjectionsArray', () => {
    it('should map injections list to string[][] format', () => {
      const input = [
        { type: 'footprint' as const, name: 'key', content: 'foo' },
        { type: 'outline' as const, name: 'my_outline', content: 'bar' },
      ];
      expect(mapToInjectionsArray(input)).toEqual([
        ['footprint', 'key', 'foo'],
        ['outline', 'my_outline', 'bar'],
      ]);
    });
  });

  describe('mapSeparateToInjectionsArray', () => {
    it('should map separate footprints, outlines, and templates to string[][] format', () => {
      const footprints = [{ name: 'f1', content: 'c1' }];
      const outlines = [{ name: 'o1', content: 'c2' }];
      const templates = [{ name: 't1', content: 'c3' }];
      expect(
        mapSeparateToInjectionsArray(footprints, outlines, templates)
      ).toEqual([
        ['footprint', 'f1', 'c1'],
        ['outline', 'o1', 'c2'],
        ['template', 't1', 'c3'],
      ]);
    });
  });

  describe('parseZipArchive', () => {
    it('should parse valid zip buffer and extract configs and custom footprint injections', async () => {
      const zip = new JSZip();
      zip.file('config.yaml', 'points: {}');
      zip.file('footprints/ceoloide/key.js', 'console.log("fp")');
      zip.file('outlines/my_outline.js', 'console.log("outline")');
      zip.file('templates/my_template.js', 'console.log("template")');

      const arrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });
      const result = await parseZipArchive(arrayBuffer);

      expect(result.config).toBe('points: {}');
      expect(result.injections).toEqual([
        {
          type: 'footprint',
          name: 'ceoloide/key',
          content: 'console.log("fp")',
        },
        {
          type: 'outline',
          name: 'my_outline',
          content: 'console.log("outline")',
        },
        {
          type: 'template',
          name: 'my_template',
          content: 'console.log("template")',
        },
      ]);
    });

    it('should ignore outlines and templates if feature flags are disabled', async () => {
      (isFeatureEnabled as jest.Mock).mockImplementation((feature) => {
        if (feature === 'outlines' || feature === 'templates') return false;
        return true;
      });

      const zip = new JSZip();
      zip.file('config.yaml', 'points: {}');
      zip.file('footprints/ceoloide/key.js', 'console.log("fp")');
      zip.file('outlines/my_outline.js', 'console.log("outline")');
      zip.file('templates/my_template.js', 'console.log("template")');

      const arrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });
      const result = await parseZipArchive(arrayBuffer);

      expect(result.config).toBe('points: {}');
      expect(result.injections).toEqual([
        {
          type: 'footprint',
          name: 'ceoloide/key',
          content: 'console.log("fp")',
        },
      ]);
    });

    it('should throw friendly error if arraybuffer is corrupted or invalid zip', async () => {
      const arrayBuffer = new ArrayBuffer(10);
      await expect(parseZipArchive(arrayBuffer)).rejects.toThrow(
        'The file appears to be corrupted. Please verify the file and try again.'
      );
    });
  });
});
