import { loadLocalFile } from './localFiles';
import JSZip from 'jszip';

// Helper to flush promises
const flushPromises = () =>
  new Promise((resolve) => {
    // Use setTimeout as fallback if setImmediate is not available
    if (typeof setImmediate !== 'undefined') {
      setImmediate(resolve);
    } else {
      setTimeout(resolve, 0);
    }
  });

// Mock FileReader that reads file content asynchronously
const createMockFileReader = (fileContent: string, shouldError = false) => {
  return class MockFileReader {
    result: string | null = null;
    onload: ((event: { target: MockFileReader }) => void) | null = null;
    onerror: (() => void) | null = null;

    readAsText(_file: File) {
      // Simulate async reading
      const schedule =
        typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
      schedule(() => {
        if (shouldError) {
          if (this.onerror) {
            this.onerror();
          }
        } else {
          if (this.onload) {
            this.result = fileContent;
            this.onload({ target: this });
          }
        }
      }, 0);
    }
  };
};

// Helper to create a mock File object
const createMockFile = (
  name: string,
  content: string | ArrayBuffer,
  type: string = 'text/plain'
): File => {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

// Helper to create a mock zip file
const createMockZipFile = async (
  name: string,
  files: Record<string, string>
): Promise<File> => {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }
  const arrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });
  const blob = new Blob([arrayBuffer], { type: 'application/zip' });
  const file = new File([blob], name, { type: 'application/zip' });
  // Ensure arrayBuffer method exists (it should on real File objects)
  if (!file.arrayBuffer) {
    // Polyfill for test environment - store the arrayBuffer and return it
    (file as any).__arrayBuffer = arrayBuffer;
    file.arrayBuffer = async () => {
      return (file as any).__arrayBuffer;
    };
  }
  return file;
};

describe('localFiles utilities', () => {
  let originalFileReader: typeof FileReader;

  beforeEach(() => {
    // Store original FileReader
    originalFileReader = global.FileReader;
  });

  afterEach(() => {
    // Restore original FileReader
    global.FileReader = originalFileReader;
  });

  describe('loadLocalFile', () => {
    describe('text files (yaml, json)', () => {
      it('loads a YAML file successfully', async () => {
        // Arrange
        const fileContent = 'points:\n  - [0, 0]';
        const file = createMockFile('config.yaml', fileContent, 'text/yaml');
        global.FileReader = jest.fn(
          () => new (createMockFileReader(fileContent))()
        ) as any;

        // Act
        const resultPromise = loadLocalFile(file);
        await flushPromises();
        const result = await resultPromise;

        // Assert
        expect(result.config).toBe(fileContent);
        expect(result.footprints).toHaveLength(0);
      });

      it('loads a YML file successfully', async () => {
        // Arrange
        const fileContent = 'points:\n  - [0, 0]';
        const file = createMockFile('config.yml', fileContent, 'text/yaml');
        global.FileReader = jest.fn(
          () => new (createMockFileReader(fileContent))()
        ) as any;

        // Act
        const resultPromise = loadLocalFile(file);
        await flushPromises();
        const result = await resultPromise;

        // Assert
        expect(result.config).toBe(fileContent);
        expect(result.footprints).toHaveLength(0);
      });

      it('loads a JSON file successfully', async () => {
        // Arrange
        const fileContent = '{"points": [[0, 0]]}';
        const file = createMockFile(
          'config.json',
          fileContent,
          'application/json'
        );
        global.FileReader = jest.fn(
          () => new (createMockFileReader(fileContent))()
        ) as any;

        // Act
        const resultPromise = loadLocalFile(file);
        await flushPromises();
        const result = await resultPromise;

        // Assert
        expect(result.config).toBe(fileContent);
        expect(result.footprints).toHaveLength(0);
      });

      it('handles FileReader errors', async () => {
        // Arrange
        const file = createMockFile('config.yaml', 'content', 'text/yaml');
        global.FileReader = jest.fn(
          () => new (createMockFileReader('', true))()
        ) as any;

        // Act & Assert
        const resultPromise = loadLocalFile(file);
        await flushPromises();
        await expect(resultPromise).rejects.toThrow('Failed to read file');
      });
    });

    describe('zip archives', () => {
      it('loads a zip file with config.yaml and footprints', async () => {
        // Arrange
        const configContent = 'points:\n  - [0, 0]';
        const footprintContent = 'module.exports = {};';
        const zipFile = await createMockZipFile('test.zip', {
          'config.yaml': configContent,
          'footprints/logo_mr_useful.js': footprintContent,
        });

        // Act
        const result = await loadLocalFile(zipFile);

        // Assert
        expect(result.config).toBe(configContent);
        expect(result.footprints).toHaveLength(1);
        expect(result.footprints[0].name).toBe('logo_mr_useful');
        expect(result.footprints[0].content).toBe(footprintContent);
      });

      it('loads an ekb file (which is a zip)', async () => {
        // Arrange
        const configContent = 'points:\n  - [0, 0]';
        const zipFile = await createMockZipFile('test.ekb', {
          'config.yaml': configContent,
        });

        // Act
        const result = await loadLocalFile(zipFile);

        // Assert
        expect(result.config).toBe(configContent);
        expect(result.footprints).toHaveLength(0);
      });

      it('extracts footprints with nested paths correctly', async () => {
        // Arrange
        const zipFile = await createMockZipFile('test.zip', {
          'config.yaml': 'points: {}',
          'footprints/ceoloide/utility_text.js': 'module.exports = {};',
          'footprints/ceoloide/logo.js': 'module.exports = {};',
          'footprints/simple.js': 'module.exports = {};',
        });

        // Act
        const result = await loadLocalFile(zipFile);

        // Assert
        expect(result.footprints).toHaveLength(3);
        const footprintNames = result.footprints.map((f) => f.name).sort();
        expect(footprintNames).toEqual([
          'ceoloide/logo',
          'ceoloide/utility_text',
          'simple',
        ]);
      });

      it('removes .js extension from footprint names', async () => {
        // Arrange
        const zipFile = await createMockZipFile('test.zip', {
          'config.yaml': 'points: {}',
          'footprints/test_footprint.js': 'content',
        });

        // Act
        const result = await loadLocalFile(zipFile);

        // Assert
        expect(result.footprints[0].name).toBe('test_footprint');
        expect(result.footprints[0].name).not.toContain('.js');
      });

      it('removes footprints/ prefix from footprint names', async () => {
        // Arrange
        const zipFile = await createMockZipFile('test.zip', {
          'config.yaml': 'points: {}',
          'footprints/my_footprint.js': 'content',
        });

        // Act
        const result = await loadLocalFile(zipFile);

        // Assert
        expect(result.footprints[0].name).toBe('my_footprint');
        expect(result.footprints[0].name).not.toContain('footprints/');
      });

      it('handles config.yml in addition to config.yaml', async () => {
        // Arrange
        const configContent = 'points:\n  - [0, 0]';
        const zipFile = await createMockZipFile('test.zip', {
          'config.yml': configContent,
        });

        // Act
        const result = await loadLocalFile(zipFile);

        // Assert
        expect(result.config).toBe(configContent);
      });

      it('throws error when config.yaml is missing from zip', async () => {
        // Arrange
        const zipFile = await createMockZipFile('test.zip', {
          'other_file.yaml': 'content',
        });

        // Act & Assert
        await expect(loadLocalFile(zipFile)).rejects.toThrow(
          'The archive is missing a config.yaml file in the root directory.'
        );
      });

      it('ignores non-js files in footprints folder', async () => {
        // Arrange
        const zipFile = await createMockZipFile('test.zip', {
          'config.yaml': 'points: {}',
          'footprints/readme.txt': 'readme content',
          'footprints/data.json': '{"key": "value"}',
          'footprints/valid.js': 'module.exports = {};',
        });

        // Act
        const result = await loadLocalFile(zipFile);

        // Assert
        expect(result.footprints).toHaveLength(1);
        expect(result.footprints[0].name).toBe('valid');
      });

      it('ignores files outside footprints folder', async () => {
        // Arrange
        const zipFile = await createMockZipFile('test.zip', {
          'config.yaml': 'points: {}',
          'other_folder/some_file.js': 'content',
          'footprints/valid.js': 'module.exports = {};',
        });

        // Act
        const result = await loadLocalFile(zipFile);

        // Assert
        expect(result.footprints).toHaveLength(1);
        expect(result.footprints[0].name).toBe('valid');
      });

      it('handles empty footprints folder', async () => {
        // Arrange
        const zipFile = await createMockZipFile('test.zip', {
          'config.yaml': 'points: {}',
        });

        // Act
        const result = await loadLocalFile(zipFile);

        // Assert
        expect(result.config).toBe('points: {}');
        expect(result.footprints).toHaveLength(0);
      });

      it('handles folder entries in footprints (ignores directories)', async () => {
        // Arrange
        const zip = new JSZip();
        zip.file('config.yaml', 'points: {}');
        const footprintsFolder = zip.folder('footprints');
        if (footprintsFolder) {
          footprintsFolder.file('file.js', 'content');
          const subfolder = footprintsFolder.folder('subfolder');
          if (subfolder) {
            subfolder.file('nested.js', 'nested content');
          }
        }
        const arrayBuffer = await zip.generateAsync({ type: 'arraybuffer' });
        const blob = new Blob([arrayBuffer], { type: 'application/zip' });
        const zipFile = new File([blob], 'test.zip', {
          type: 'application/zip',
        });
        // Ensure arrayBuffer method exists
        if (!zipFile.arrayBuffer) {
          (zipFile as any).__arrayBuffer = arrayBuffer;
          zipFile.arrayBuffer = async () => {
            return (zipFile as any).__arrayBuffer;
          };
        }

        // Act
        const result = await loadLocalFile(zipFile);

        // Assert
        expect(result.footprints).toHaveLength(2);
        const names = result.footprints.map((f) => f.name).sort();
        expect(names).toEqual(['file', 'subfolder/nested']);
      });
    });

    describe('unsupported file types', () => {
      it('throws error for unsupported file extension', async () => {
        // Arrange
        const file = createMockFile('config.txt', 'content', 'text/plain');

        // Act & Assert
        await expect(loadLocalFile(file)).rejects.toThrow(
          'Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb'
        );
      });

      it('throws error for file with no extension', async () => {
        // Arrange
        const file = createMockFile('config', 'content', 'text/plain');

        // Act & Assert
        await expect(loadLocalFile(file)).rejects.toThrow(
          'Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb'
        );
      });
    });

    describe('case sensitivity', () => {
      it('handles uppercase file extensions', async () => {
        // Arrange
        const fileContent = 'points: {}';
        const file = createMockFile('config.YAML', fileContent, 'text/yaml');
        global.FileReader = jest.fn(
          () => new (createMockFileReader(fileContent))()
        ) as any;

        // Act
        const resultPromise = loadLocalFile(file);
        await flushPromises();
        const result = await resultPromise;

        // Assert
        expect(result.config).toBe(fileContent);
      });

      it('handles mixed case file extensions', async () => {
        // Arrange
        const fileContent = 'points: {}';
        const file = createMockFile('config.YaMl', fileContent, 'text/yaml');
        global.FileReader = jest.fn(
          () => new (createMockFileReader(fileContent))()
        ) as any;

        // Act
        const resultPromise = loadLocalFile(file);
        await flushPromises();
        const result = await resultPromise;

        // Assert
        expect(result.config).toBe(fileContent);
      });
    });
  });
});
