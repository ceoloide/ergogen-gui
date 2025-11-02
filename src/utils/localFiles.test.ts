import JSZip from 'jszip';
import { loadLocalFile } from './localFiles';

describe('localFiles', () => {
  describe('loadLocalFile', () => {
    it('should load a YAML file', async () => {
      // Arrange
      const yamlContent = 'key: value\n';
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      const file = new File([blob], 'config.yaml', {
        type: 'text/yaml',
      });
      // Mock the text() method since jsdom doesn't support it on File
      file.text = jest.fn().mockResolvedValue(yamlContent);

      // Act
      const result = await loadLocalFile(file);

      // Assert
      expect(result.config).toBe(yamlContent);
      expect(result.footprints).toEqual([]);
    });

    it('should load a JSON file', async () => {
      // Arrange
      const jsonContent = '{"key": "value"}';
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const file = new File([blob], 'config.json', {
        type: 'application/json',
      });
      // Mock the text() method since jsdom doesn't support it on File
      file.text = jest.fn().mockResolvedValue(jsonContent);

      // Act
      const result = await loadLocalFile(file);

      // Assert
      expect(result.config).toBe(jsonContent);
      expect(result.footprints).toEqual([]);
    });

    it('should throw an error for unsupported file types', async () => {
      // Arrange
      const file = new File(['content'], 'file.txt', { type: 'text/plain' });

      // Act & Assert
      await expect(loadLocalFile(file)).rejects.toThrow(
        'Unsupported file type. Please upload a .yaml, .json, .zip, or .ekb file.'
      );
    });

    it('should load a ZIP archive with config.yaml', async () => {
      // Arrange
      const zip = new JSZip();
      zip.file('config.yaml', 'key: value\n');

      const blob = await zip.generateAsync({ type: 'blob' });
      const file = new File([blob], 'archive.zip', {
        type: 'application/zip',
      });

      // Act
      const result = await loadLocalFile(file);

      // Assert
      expect(result.config).toBe('key: value\n');
      expect(result.footprints).toEqual([]);
    });

    it('should load an EKB archive with config.yaml', async () => {
      // Arrange
      const zip = new JSZip();
      zip.file('config.yaml', 'key: value\n');

      const blob = await zip.generateAsync({ type: 'blob' });
      const file = new File([blob], 'archive.ekb', {
        type: 'application/octet-stream',
      });

      // Act
      const result = await loadLocalFile(file);

      // Assert
      expect(result.config).toBe('key: value\n');
      expect(result.footprints).toEqual([]);
    });

    it('should throw an error if ZIP archive does not contain config.yaml', async () => {
      // Arrange
      const zip = new JSZip();
      zip.file('other.yaml', 'key: value\n');

      const blob = await zip.generateAsync({ type: 'blob' });
      const file = new File([blob], 'archive.zip', {
        type: 'application/zip',
      });

      // Act & Assert
      await expect(loadLocalFile(file)).rejects.toThrow(
        'Archive must contain a config.yaml file in the root directory'
      );
    });

    it('should load footprints from ZIP archive', async () => {
      // Arrange
      const zip = new JSZip();
      zip.file('config.yaml', 'key: value\n');
      zip.file('footprints/footprint1.js', 'module.exports = {}');
      zip.file('footprints/footprint2.js', 'module.exports = {}');

      const blob = await zip.generateAsync({ type: 'blob' });
      const file = new File([blob], 'archive.zip', {
        type: 'application/zip',
      });

      // Act
      const result = await loadLocalFile(file);

      // Assert
      expect(result.config).toBe('key: value\n');
      expect(result.footprints).toHaveLength(2);
      expect(result.footprints[0].name).toBe('footprint1');
      expect(result.footprints[0].content).toBe('module.exports = {}');
      expect(result.footprints[1].name).toBe('footprint2');
      expect(result.footprints[1].content).toBe('module.exports = {}');
    });

    it('should load nested footprints from ZIP archive with proper names', async () => {
      // Arrange
      const zip = new JSZip();
      zip.file('config.yaml', 'key: value\n');
      zip.file('footprints/logo_mr_useful.js', 'module.exports = {}');
      zip.file(
        'footprints/ceoloide/utility_text.js',
        'module.exports = { name: "utility_text" }'
      );
      zip.file(
        'footprints/deep/nested/folder/footprint.js',
        'module.exports = {}'
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const file = new File([blob], 'archive.zip', {
        type: 'application/zip',
      });

      // Act
      const result = await loadLocalFile(file);

      // Assert
      expect(result.config).toBe('key: value\n');
      expect(result.footprints).toHaveLength(3);

      const footprintNames = result.footprints.map((fp) => fp.name);
      expect(footprintNames).toContain('logo_mr_useful');
      expect(footprintNames).toContain('ceoloide/utility_text');
      expect(footprintNames).toContain('deep/nested/folder/footprint');

      const utilityTextFootprint = result.footprints.find(
        (fp) => fp.name === 'ceoloide/utility_text'
      );
      expect(utilityTextFootprint?.content).toBe(
        'module.exports = { name: "utility_text" }'
      );
    });

    it('should ignore non-.js files in footprints folder', async () => {
      // Arrange
      const zip = new JSZip();
      zip.file('config.yaml', 'key: value\n');
      zip.file('footprints/footprint1.js', 'module.exports = {}');
      zip.file('footprints/readme.md', '# README');
      zip.file('footprints/data.json', '{}');

      const blob = await zip.generateAsync({ type: 'blob' });
      const file = new File([blob], 'archive.zip', {
        type: 'application/zip',
      });

      // Act
      const result = await loadLocalFile(file);

      // Assert
      expect(result.config).toBe('key: value\n');
      expect(result.footprints).toHaveLength(1);
      expect(result.footprints[0].name).toBe('footprint1');
    });

    it('should handle ZIP archive with no footprints folder', async () => {
      // Arrange
      const zip = new JSZip();
      zip.file('config.yaml', 'key: value\n');
      zip.file('other/file.js', 'module.exports = {}');

      const blob = await zip.generateAsync({ type: 'blob' });
      const file = new File([blob], 'archive.zip', {
        type: 'application/zip',
      });

      // Act
      const result = await loadLocalFile(file);

      // Assert
      expect(result.config).toBe('key: value\n');
      expect(result.footprints).toEqual([]);
    });

    it('should handle .yml extension', async () => {
      // Arrange
      const yamlContent = 'key: value\n';
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      const file = new File([blob], 'config.yml', {
        type: 'text/yaml',
      });
      // Mock the text() method since jsdom doesn't support it on File
      file.text = jest.fn().mockResolvedValue(yamlContent);

      // Act
      const result = await loadLocalFile(file);

      // Assert
      expect(result.config).toBe(yamlContent);
      expect(result.footprints).toEqual([]);
    });
  });
});
