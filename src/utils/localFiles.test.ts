import JSZip from 'jszip';
import { loadFromLocalFile, LocalFileLoadResult } from './localFiles';

describe('localFiles', () => {
  describe('loadFromLocalFile', () => {
    describe('YAML files', () => {
      it('should load a YAML file with no footprints', async () => {
        // Arrange
        const yamlContent = 'units:\n  some_unit: 10';
        const file = new File([yamlContent], 'config.yaml', {
          type: 'text/yaml',
        });

        // Act
        const result: LocalFileLoadResult = await loadFromLocalFile(file);

        // Assert
        expect(result.config).toBe(yamlContent);
        expect(result.footprints).toEqual([]);
      });

      it('should load a .yml file', async () => {
        // Arrange
        const yamlContent = 'units:\n  some_unit: 10';
        const file = new File([yamlContent], 'config.yml', {
          type: 'text/yaml',
        });

        // Act
        const result: LocalFileLoadResult = await loadFromLocalFile(file);

        // Assert
        expect(result.config).toBe(yamlContent);
        expect(result.footprints).toEqual([]);
      });
    });

    describe('JSON files', () => {
      it('should load a JSON file with no footprints', async () => {
        // Arrange
        const jsonContent = '{"units": {"some_unit": 10}}';
        const file = new File([jsonContent], 'config.json', {
          type: 'application/json',
        });

        // Act
        const result: LocalFileLoadResult = await loadFromLocalFile(file);

        // Assert
        expect(result.config).toBe(jsonContent);
        expect(result.footprints).toEqual([]);
      });
    });

    describe('ZIP archives', () => {
      it('should load a ZIP with config.yaml and no footprints', async () => {
        // Arrange
        const yamlContent = 'units:\n  some_unit: 10';
        const zip = new JSZip();
        zip.file('config.yaml', yamlContent);
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const file = new File([zipBlob], 'archive.zip', {
          type: 'application/zip',
        });

        // Act
        const result: LocalFileLoadResult = await loadFromLocalFile(file);

        // Assert
        expect(result.config).toBe(yamlContent);
        expect(result.footprints).toEqual([]);
      });

      it('should load a ZIP with config.yaml and footprints', async () => {
        // Arrange
        const yamlContent = 'units:\n  some_unit: 10';
        const footprintContent1 = 'module.exports = () => {}';
        const footprintContent2 = 'module.exports = () => { return "test"; }';
        const zip = new JSZip();
        zip.file('config.yaml', yamlContent);
        zip.file('footprints/logo_mr_useful.js', footprintContent1);
        zip.file('footprints/ceoloide/utility_text.js', footprintContent2);
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const file = new File([zipBlob], 'archive.zip', {
          type: 'application/zip',
        });

        // Act
        const result: LocalFileLoadResult = await loadFromLocalFile(file);

        // Assert
        expect(result.config).toBe(yamlContent);
        expect(result.footprints).toHaveLength(2);
        expect(result.footprints).toContainEqual({
          name: 'logo_mr_useful',
          content: footprintContent1,
        });
        expect(result.footprints).toContainEqual({
          name: 'ceoloide/utility_text',
          content: footprintContent2,
        });
      });

      it('should throw an error if config.yaml is missing', async () => {
        // Arrange
        const zip = new JSZip();
        zip.file('other.yaml', 'some content');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const file = new File([zipBlob], 'archive.zip', {
          type: 'application/zip',
        });

        // Act & Assert
        await expect(loadFromLocalFile(file)).rejects.toThrow(
          'Archive must contain a config.yaml file in the root directory'
        );
      });

      it('should handle nested footprint directories', async () => {
        // Arrange
        const yamlContent = 'units:\n  some_unit: 10';
        const footprintContent = 'module.exports = () => {}';
        const zip = new JSZip();
        zip.file('config.yaml', yamlContent);
        zip.file('footprints/vendor/category/footprint.js', footprintContent);
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const file = new File([zipBlob], 'archive.zip', {
          type: 'application/zip',
        });

        // Act
        const result: LocalFileLoadResult = await loadFromLocalFile(file);

        // Assert
        expect(result.config).toBe(yamlContent);
        expect(result.footprints).toHaveLength(1);
        expect(result.footprints[0]).toEqual({
          name: 'vendor/category/footprint',
          content: footprintContent,
        });
      });

      it('should ignore non-JS files in footprints folder', async () => {
        // Arrange
        const yamlContent = 'units:\n  some_unit: 10';
        const footprintContent = 'module.exports = () => {}';
        const zip = new JSZip();
        zip.file('config.yaml', yamlContent);
        zip.file('footprints/valid.js', footprintContent);
        zip.file('footprints/readme.md', 'This is a readme');
        zip.file('footprints/data.json', '{"key": "value"}');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const file = new File([zipBlob], 'archive.zip', {
          type: 'application/zip',
        });

        // Act
        const result: LocalFileLoadResult = await loadFromLocalFile(file);

        // Assert
        expect(result.footprints).toHaveLength(1);
        expect(result.footprints[0]).toEqual({
          name: 'valid',
          content: footprintContent,
        });
      });
    });

    describe('EKB archives', () => {
      it('should load an EKB with config.yaml and footprints', async () => {
        // Arrange
        const yamlContent = 'units:\n  some_unit: 10';
        const footprintContent = 'module.exports = () => {}';
        const zip = new JSZip();
        zip.file('config.yaml', yamlContent);
        zip.file('footprints/test.js', footprintContent);
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const file = new File([zipBlob], 'project.ekb', {
          type: 'application/x-ekb',
        });

        // Act
        const result: LocalFileLoadResult = await loadFromLocalFile(file);

        // Assert
        expect(result.config).toBe(yamlContent);
        expect(result.footprints).toHaveLength(1);
        expect(result.footprints[0]).toEqual({
          name: 'test',
          content: footprintContent,
        });
      });

      it('should throw an error if config.yaml is missing from EKB', async () => {
        // Arrange
        const zip = new JSZip();
        zip.file('other.yaml', 'some content');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const file = new File([zipBlob], 'project.ekb', {
          type: 'application/x-ekb',
        });

        // Act & Assert
        await expect(loadFromLocalFile(file)).rejects.toThrow(
          'Archive must contain a config.yaml file in the root directory'
        );
      });
    });

    describe('Unsupported files', () => {
      it('should throw an error for unsupported file types', async () => {
        // Arrange
        const file = new File(['content'], 'file.txt', { type: 'text/plain' });

        // Act & Assert
        await expect(loadFromLocalFile(file)).rejects.toThrow(
          'Unsupported file type. Please upload a .yaml, .json, .zip, or .ekb file.'
        );
      });

      it('should throw an error for files with no extension', async () => {
        // Arrange
        const file = new File(['content'], 'configfile', {
          type: 'application/octet-stream',
        });

        // Act & Assert
        await expect(loadFromLocalFile(file)).rejects.toThrow(
          'Unsupported file type. Please upload a .yaml, .json, .zip, or .ekb file.'
        );
      });
    });
  });
});
