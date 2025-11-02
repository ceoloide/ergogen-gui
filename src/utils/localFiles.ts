import JSZip from 'jszip';
import { GitHubFootprint } from './github';

/**
 * Result of loading a local file.
 */
export type LocalFileLoadResult = {
  config: string;
  footprints: GitHubFootprint[];
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
 * Extracts footprint name from a file path within the footprints folder.
 * Removes the 'footprints/' prefix and the '.js' extension.
 * @param path - The full path within the zip (e.g., 'footprints/ceoloide/utility_text.js').
 * @returns The footprint name (e.g., 'ceoloide/utility_text').
 */
const extractFootprintName = (path: string): string => {
  // Remove 'footprints/' prefix
  let name = path.replace(/^footprints\//, '');
  // Remove '.js' extension
  name = name.replace(/\.js$/, '');
  return name;
};


/**
 * Loads a zip or ekb archive and extracts config.yaml and footprints.
 * @param file - The zip/ekb file to load.
 * @returns A promise that resolves with the config and footprints.
 * @throws Error if config.yaml is missing from the archive.
 */
const loadZipArchive = async (file: File): Promise<LocalFileLoadResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  // Find config.yaml in the root (check both config.yaml and config.yml)
  let configFile = zip.file('config.yaml') || zip.file('config.yml');
  if (!configFile) {
    // Try case-insensitive search
    configFile = zip.file(/^config\.(yaml|yml)$/i)[0];
  }
  if (!configFile) {
    throw new Error(
      'The archive is missing a config.yaml file in the root directory.'
    );
  }

  const config = await configFile.async('string');

  // Extract footprints from the footprints folder
  const footprints: GitHubFootprint[] = [];
  const footprintsPromises: Promise<void>[] = [];

  zip.forEach((relativePath, file) => {
    // Check if the file is a .js file within the footprints folder
    if (
      relativePath.startsWith('footprints/') &&
      relativePath.endsWith('.js') &&
      !file.dir
    ) {
      const promise = file.async('string').then((content) => {
        const name = extractFootprintName(relativePath);
        footprints.push({ name, content });
      });
      footprintsPromises.push(promise);
    }
  });

  // Wait for all footprint files to be read
  await Promise.all(footprintsPromises);

  return { config, footprints };
};

/**
 * Loads a local file (yaml, json, zip, or ekb) and extracts config and footprints.
 * @param file - The file to load.
 * @returns A promise that resolves with the config and footprints.
 * @throws Error if the file type is not supported or if required files are missing.
 */
export const loadLocalFile = async (
  file: File
): Promise<LocalFileLoadResult> => {
  const fileName = file.name.toLowerCase();
  const extension = fileName.split('.').pop();

  if (extension === 'yaml' || extension === 'yml' || extension === 'json') {
    // Load as text file
    const config = await loadTextFile(file);
    return { config, footprints: [] };
  } else if (extension === 'zip' || extension === 'ekb') {
    // Load as zip archive
    return await loadZipArchive(file);
  } else {
    throw new Error(
      `Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb`
    );
  }
};
