import JSZip from 'jszip';

/**
 * Represents a footprint loaded from a local file.
 */
export type LocalFootprint = {
  name: string;
  content: string;
};

/**
 * Represents the result of loading a local file.
 */
export type LocalFileLoadResult = {
  config: string;
  footprints: LocalFootprint[];
};

/**
 * Reads a file as text.
 * @param file - The file to read.
 * @returns A promise that resolves with the file content as text.
 */
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

/**
 * Reads a file as an ArrayBuffer.
 * @param file - The file to read.
 * @returns A promise that resolves with the file content as ArrayBuffer.
 */
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as ArrayBuffer);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Loads footprints from a footprints folder in a zip archive.
 * @param zip - The JSZip instance containing the archive.
 * @param basePath - The base path for the footprints folder (e.g., 'footprints').
 * @returns A promise that resolves with an array of footprints.
 */
const loadFootprintsFromZip = async (
  zip: JSZip,
  basePath: string
): Promise<LocalFootprint[]> => {
  const footprints: LocalFootprint[] = [];
  const footprintsPath = basePath ? `${basePath}/` : 'footprints/';

  // Iterate through all files in the zip
  for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
    // Check if the file is in the footprints folder and is a .js file
    if (
      relativePath.startsWith(footprintsPath) &&
      relativePath.endsWith('.js') &&
      !zipEntry.dir
    ) {
      // Extract the content
      const content = await zipEntry.async('text');

      // Calculate the footprint name from the relative path
      // Remove the footprints/ prefix and the .js extension
      const nameWithExtension = relativePath.substring(footprintsPath.length);
      const name = nameWithExtension.replace(/\.js$/, '');

      console.log(`[LocalFile] Loaded footprint: ${name}`);
      footprints.push({ name, content });
    }
  }

  return footprints;
};

/**
 * Loads a configuration and footprints from a ZIP or EKB archive.
 * @param file - The archive file to load.
 * @returns A promise that resolves with the config and footprints.
 * @throws Error if config.yaml is not found in the archive.
 */
const loadFromArchive = async (file: File): Promise<LocalFileLoadResult> => {
  console.log(`[LocalFile] Loading archive: ${file.name}`);

  // Read the file as ArrayBuffer
  const arrayBuffer = await readFileAsArrayBuffer(file);

  // Load the zip file
  const zip = await JSZip.loadAsync(arrayBuffer);

  // Look for config.yaml in the root
  const configFile = zip.file('config.yaml');
  if (!configFile) {
    throw new Error(
      'Archive must contain a config.yaml file in the root directory'
    );
  }

  // Extract the config
  const config = await configFile.async('text');
  console.log('[LocalFile] Config loaded from archive');

  // Load footprints if the footprints folder exists
  const footprints = await loadFootprintsFromZip(zip, 'footprints');
  console.log(
    `[LocalFile] Loaded ${footprints.length} footprints from archive`
  );

  return { config, footprints };
};

/**
 * Loads a configuration file from a YAML or JSON file.
 * @param file - The file to load.
 * @returns A promise that resolves with the config (no footprints).
 */
const loadFromConfigFile = async (file: File): Promise<LocalFileLoadResult> => {
  console.log(`[LocalFile] Loading config file: ${file.name}`);
  const config = await readFileAsText(file);
  console.log('[LocalFile] Config loaded from file');
  return { config, footprints: [] };
};

/**
 * Loads a configuration and footprints from a local file.
 * Supports YAML, JSON, ZIP, and EKB files.
 * @param file - The file to load.
 * @returns A promise that resolves with the config and footprints.
 * @throws Error if the file type is not supported or if validation fails.
 */
export const loadFromLocalFile = async (
  file: File
): Promise<LocalFileLoadResult> => {
  const fileName = file.name.toLowerCase();

  // Check file extension
  if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
    return loadFromConfigFile(file);
  } else if (fileName.endsWith('.json')) {
    return loadFromConfigFile(file);
  } else if (fileName.endsWith('.zip') || fileName.endsWith('.ekb')) {
    return loadFromArchive(file);
  } else {
    throw new Error(
      'Unsupported file type. Please upload a .yaml, .json, .zip, or .ekb file.'
    );
  }
};
