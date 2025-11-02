/**
 * Represents a footprint loaded from local files.
 * This matches the GitHubFootprint type for consistency.
 */
export type LocalFootprint = {
  name: string;
  content: string;
};

/**
 * Represents the result of loading from local files, including config and footprints.
 */
export type LocalLoadResult = {
  config: string;
  footprints: LocalFootprint[];
  configPath: string;
};

/**
 * Recursively reads all .js files from a directory handle.
 * @param directoryHandle - The FileSystemDirectoryHandle to read from.
 * @param basePath - The base path for constructing footprint names.
 * @returns A promise that resolves with the list of footprints.
 */
const readFootprintsFromDirectory = async (
  directoryHandle: FileSystemDirectoryHandle,
  basePath: string = ''
): Promise<LocalFootprint[]> => {
  const footprints: LocalFootprint[] = [];

  try {
    for await (const [name, entry] of directoryHandle.entries()) {
      if (entry.kind === 'file' && name.endsWith('.js')) {
        const file = await entry.getFile();
        const content = await file.text();
        const fileName = name.replace(/\.js$/, '');
        const footprintName = basePath ? `${basePath}/${fileName}` : fileName;
        console.log(`[Local Files] Loaded footprint: ${footprintName}`);
        footprints.push({ name: footprintName, content });
      } else if (entry.kind === 'directory') {
        const subPath = basePath ? `${basePath}/${name}` : name;
        const subFootprints = await readFootprintsFromDirectory(
          entry,
          subPath
        );
        footprints.push(...subFootprints);
      }
    }
  } catch (error) {
    console.warn('[Local Files] Error reading directory:', error);
  }

  return footprints;
};

/**
 * Finds and reads a config.yaml file from a directory handle.
 * Checks root and ergogen/ subdirectory.
 * @param directoryHandle - The FileSystemDirectoryHandle to search in.
 * @returns A promise that resolves with the config content and path, or null if not found.
 */
const findConfigFile = async (
  directoryHandle: FileSystemDirectoryHandle
): Promise<{ config: string; configPath: string } | null> => {
  // Try root directory first
  try {
    const configFileHandle = await directoryHandle.getFileHandle('config.yaml');
    const configFile = await configFileHandle.getFile();
    const config = await configFile.text();
    console.log('[Local Files] Config found in root directory');
    return { config, configPath: '' };
  } catch (error) {
    // Config.yaml not in root, try ergogen/ subdirectory
  }

  // Try ergogen/ subdirectory
  try {
    const ergogenDirHandle = await directoryHandle.getDirectoryHandle(
      'ergogen'
    );
    const configFileHandle = await ergogenDirHandle.getFileHandle('config.yaml');
    const configFile = await configFileHandle.getFile();
    const config = await configFile.text();
    console.log('[Local Files] Config found in ergogen/ directory');
    return { config, configPath: 'ergogen' };
  } catch (error) {
    // Config.yaml not found in ergogen/ either
  }

  return null;
};

/**
 * Loads config.yaml and footprints from a local directory using the File System Access API.
 * @param directoryHandle - The FileSystemDirectoryHandle to load from.
 * @returns A promise that resolves with the config, footprints, and config path.
 * @throws {Error} Throws an error if config.yaml cannot be found.
 */
export const loadConfigFromDirectory = async (
  directoryHandle: FileSystemDirectoryHandle
): Promise<LocalLoadResult> => {
  console.log('[Local Files] Starting load from directory');

  // Find config.yaml
  const configResult = await findConfigFile(directoryHandle);
  if (!configResult) {
    throw new Error('config.yaml not found in root or ergogen/ directory');
  }

  const { config, configPath } = configResult;

  // Try to load footprints from footprints folder
  let footprints: LocalFootprint[] = [];
  try {
    const footprintsPath = configPath
      ? `${configPath}/footprints`
      : 'footprints';
    
    // Navigate to the footprints directory
    let currentHandle = directoryHandle;
    const pathParts = footprintsPath.split('/').filter(Boolean);
    
    for (const part of pathParts) {
      currentHandle = await currentHandle.getDirectoryHandle(part);
    }

    footprints = await readFootprintsFromDirectory(currentHandle, '');
    console.log(`[Local Files] Loaded ${footprints.length} footprints`);
  } catch (error) {
    // Footprints folder doesn't exist, that's okay
    console.log('[Local Files] No footprints folder found, skipping');
  }

  return {
    config,
    footprints,
    configPath,
  };
};

/**
 * Checks if the File System Access API is supported in the current browser.
 * @returns True if the API is supported, false otherwise.
 */
export const isFileSystemAccessSupported = (): boolean => {
  return (
    'showDirectoryPicker' in window &&
    typeof window.showDirectoryPicker === 'function'
  );
};

/**
 * Opens a directory picker dialog and loads config.yaml and footprints from the selected directory.
 * Falls back to traditional file input if File System Access API is not supported.
 * @returns A promise that resolves with the config, footprints, and config path, or null if cancelled.
 * @throws {Error} Throws an error if loading fails.
 */
export const loadConfigFromLocalFolder = async (): Promise<LocalLoadResult | null> => {
  if (!isFileSystemAccessSupported()) {
    throw new Error(
      'File System Access API is not supported in this browser. Please use a modern browser like Chrome, Edge, or Opera.'
    );
  }

  try {
    const directoryHandle = await window.showDirectoryPicker({
      mode: 'read',
    });
    return await loadConfigFromDirectory(directoryHandle);
  } catch (error) {
    // User cancelled the picker
    if (
      error instanceof DOMException &&
      error.name === 'AbortError'
    ) {
      return null;
    }
    throw error;
  }
};
