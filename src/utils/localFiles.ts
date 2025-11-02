import JSZip from 'jszip';

/**
 * Represents a footprint loaded from a local file.
 */
export type LocalFootprint = {
  name: string;
  content: string;
};

/**
 * Represents the result of loading from a local file.
 */
type LocalFileLoadResult = {
  config: string;
  footprints: LocalFootprint[];
};

/**
 * Loads a YAML or JSON file directly as configuration.
 * @param file - The file to load.
 * @returns A promise that resolves with the config content and empty footprints array.
 */
const loadConfigFile = async (file: File): Promise<LocalFileLoadResult> => {
  console.log(`[Local Files] Loading config file: ${file.name}`);
  const content = await file.text();
  return {
    config: content,
    footprints: [],
  };
};

/**
 * Recursively extracts all .js files from a JSZip folder, creating footprints with proper naming.
 * @param folder - The JSZip folder to process.
 * @returns A promise that resolves with an array of footprints.
 */
const extractFootprintsFromFolder = async (
  folder: JSZip
): Promise<LocalFootprint[]> => {
  const footprints: LocalFootprint[] = [];

  for (const [relativePath, zipEntry] of Object.entries(folder.files)) {
    // Skip the footprints/ prefix itself and directories
    if (zipEntry.dir || !relativePath.startsWith('footprints/')) {
      continue;
    }

    // Only process .js files
    if (!relativePath.endsWith('.js')) {
      continue;
    }

    // Remove 'footprints/' prefix and .js extension to get the footprint name
    const pathWithoutPrefix = relativePath.substring('footprints/'.length);
    const name = pathWithoutPrefix.replace(/\.js$/, '');

    const content = await zipEntry.async('text');
    console.log(`[Local Files] Loaded footprint: ${name}`);
    footprints.push({ name, content });
  }

  return footprints;
};

/**
 * Loads a ZIP or EKB archive, extracting config.yaml and footprints.
 * @param file - The ZIP/EKB file to load.
 * @returns A promise that resolves with the config content and footprints.
 * @throws Error if config.yaml is not found in the archive.
 */
const loadArchiveFile = async (file: File): Promise<LocalFileLoadResult> => {
  console.log(`[Local Files] Loading archive file: ${file.name}`);

  const zip = await JSZip.loadAsync(file);

  // Check for config.yaml in the root
  const configFile = zip.file('config.yaml');
  if (!configFile) {
    throw new Error(
      'Archive must contain a config.yaml file in the root directory'
    );
  }

  const config = await configFile.async('text');
  console.log('[Local Files] Found config.yaml in archive');

  // Check for footprints folder
  const footprintsFolder = Object.keys(zip.files).some((path) =>
    path.startsWith('footprints/')
  );

  if (!footprintsFolder) {
    console.log('[Local Files] No footprints folder found in archive');
    return {
      config,
      footprints: [],
    };
  }

  console.log('[Local Files] Found footprints folder, extracting footprints');
  const footprints = await extractFootprintsFromFolder(zip);

  console.log(
    `[Local Files] Loaded ${footprints.length} footprints from archive`
  );
  return {
    config,
    footprints,
  };
};

/**
 * Loads a local file (YAML, JSON, ZIP, or EKB) and extracts configuration and footprints.
 * @param file - The file to load.
 * @returns A promise that resolves with the config content and footprints.
 * @throws Error if the file type is unsupported or if required files are missing.
 */
export const loadLocalFile = async (
  file: File
): Promise<LocalFileLoadResult> => {
  console.log(`[Local Files] Processing file: ${file.name} (${file.type})`);

  const fileName = file.name.toLowerCase();

  // Check file extension
  if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
    return loadConfigFile(file);
  } else if (fileName.endsWith('.json')) {
    return loadConfigFile(file);
  } else if (fileName.endsWith('.zip') || fileName.endsWith('.ekb')) {
    return loadArchiveFile(file);
  } else {
    throw new Error(
      'Unsupported file type. Please upload a .yaml, .json, .zip, or .ekb file.'
    );
  }
};
