import { parseZipArchive, enforceFileSizeLimit } from './ergogenBundleLoader';

/**
 * Result of loading a local file.
 */
type LocalFileLoadResult = {
  config: string;
  footprints: { name: string; content: string }[];
  outlines: { name: string; content: string }[];
  templates: { name: string; content: string }[];
};

/**
 * Loads a YAML or JSON file and returns its content.
 * @param file - The file to read.
 * @returns A promise that resolves with the file content.
 */
const loadTextFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Loads a local file (yaml, json, zip, or ekb) and extracts config and footprints/outlines/templates.
 * @param file - The file to load.
 * @returns A promise that resolves with the config and injections.
 * @throws Error if the file type is not supported or if required files are missing.
 */
export const loadLocalFile = async (
  file: File
): Promise<LocalFileLoadResult> => {
  const fileName = file.name.toLowerCase();
  const extension = fileName.split('.').pop();
  const isArchive = extension === 'zip' || extension === 'ekb';

  // Enforce size limits
  enforceFileSizeLimit(file.size, isArchive);

  if (extension === 'yaml' || extension === 'yml' || extension === 'json') {
    // Load as text file
    const config = await loadTextFile(file);
    return { config, footprints: [], outlines: [], templates: [] };
  } else if (isArchive) {
    // Load as zip archive
    const arrayBuffer = await file.arrayBuffer();
    const result = await parseZipArchive(arrayBuffer);

    const footprints = result.injections
      .filter((i) => i.type === 'footprint')
      .map((i) => ({ name: i.name, content: i.content }));

    const outlines = result.injections
      .filter((i) => i.type === 'outline')
      .map((i) => ({ name: i.name, content: i.content }));

    const templates = result.injections
      .filter((i) => i.type === 'template')
      .map((i) => ({ name: i.name, content: i.content }));

    return { config: result.config, footprints, outlines, templates };
  } else {
    throw new Error(
      `Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb`
    );
  }
};
