import JSZip from 'jszip';

import { loadLocalConfigFile } from './localFileLoader';

const createTextFile = (content: string, name: string) => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(content);
  const buffer = encoded.buffer.slice(
    encoded.byteOffset,
    encoded.byteOffset + encoded.byteLength
  );

  return {
    name,
    text: async () => content,
    arrayBuffer: async () => buffer,
  } as unknown as File;
};

const createBinaryFile = (bytes: Uint8Array, name: string) => {
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  );
  return {
    name,
    arrayBuffer: async () => buffer,
  } as unknown as File;
};

describe('loadLocalConfigFile', () => {
  it('loads plain YAML files', async () => {
    const yamlContent = 'points: {}\n';
    const file = createTextFile(yamlContent, 'test.yaml');

    const result = await loadLocalConfigFile(file);

    expect(result.config).toBe(yamlContent);
    expect(result.footprints).toEqual([]);
  });

  it('loads plain JSON files', async () => {
    const jsonContent = '{"points": {}}';
    const file = createTextFile(jsonContent, 'test.json');

    const result = await loadLocalConfigFile(file);

    expect(result.config).toBe(jsonContent);
    expect(result.footprints).toEqual([]);
  });

  it('loads config and footprints from zip archives', async () => {
    const zip = new JSZip();
    zip.file('config.yaml', 'points: {}\n');
    zip.file('footprints/logo.js', 'module.exports = {}');
    zip.file(
      'footprints/ceoloide/utility_text.js',
      'module.exports = { util: true };'
    );

    const archive = await zip.generateAsync({ type: 'uint8array' });
    const file = createBinaryFile(archive, 'bundle.zip');

    const result = await loadLocalConfigFile(file);

    expect(result.config).toBe('points: {}\n');
    expect(result.footprints).toHaveLength(2);
    expect(result.footprints).toEqual(
      expect.arrayContaining([
        { name: 'logo', content: 'module.exports = {}' },
        {
          name: 'ceoloide/utility_text',
          content: 'module.exports = { util: true };',
        },
      ])
    );
  });

  it('supports .ekb archives', async () => {
    const zip = new JSZip();
    zip.file('config.yaml', 'points: {}\n');

    const archive = await zip.generateAsync({ type: 'uint8array' });
    const file = createBinaryFile(archive, 'bundle.ekb');

    const result = await loadLocalConfigFile(file);

    expect(result.config).toBe('points: {}\n');
    expect(result.footprints).toEqual([]);
  });

  it('throws when archive is missing config.yaml at root', async () => {
    const zip = new JSZip();
    zip.file('footprints/logo.js', 'module.exports = {}');

    const archive = await zip.generateAsync({ type: 'uint8array' });
    const file = createBinaryFile(archive, 'bundle.zip');

    await expect(loadLocalConfigFile(file)).rejects.toThrow(
      /missing required config.yaml/i
    );
  });

  it('throws for unsupported file types', async () => {
    const file = createTextFile('test', 'notes.txt');

    await expect(loadLocalConfigFile(file)).rejects.toThrow(
      /unsupported file type/i
    );
  });
});
