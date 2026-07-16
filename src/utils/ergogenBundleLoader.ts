import JSZip from 'jszip';
import { isFeatureEnabled } from './featureFlags';

interface ErgogenInjection {
  type: 'footprint' | 'outline' | 'template';
  name: string;
  content: string;
}

interface ErgogenWorkspaceBundle {
  config: string;
  injections: ErgogenInjection[];
  configPath?: string;
  rateLimitWarning?: string;
}

// Configurable constants
export const MAX_ARCHIVE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const MAX_TEXT_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Extracts injection name from relative file path.
 * e.g., footprints/ceoloide/key.js -> ceoloide/key
 */
export const cleanInjectionName = (
  path: string,
  type: 'footprints' | 'outlines' | 'templates'
): string => {
  const prefix = `${type}/`;
  let name = path;
  if (name.startsWith(prefix)) {
    name = name.substring(prefix.length);
  }
  name = name.replace(/\.js$/, '');
  return name;
};

/**
 * Validates zip structural contents and retrieves config file object.
 */
export const validateZipStructure = (zip: JSZip): JSZip.JSZipObject => {
  let configFile = zip.file('config.yaml') || zip.file('config.yml');
  if (!configFile) {
    // Try case-insensitive lookup
    const matches = zip.file(/^config\.(yaml|yml)$/i);
    if (matches && matches.length > 0) {
      configFile = matches[0];
    }
  }
  if (!configFile) {
    throw new Error(
      'The archive is missing a config.yaml file in the root directory.'
    );
  }
  return configFile;
};

/**
 * Enforces file size constraints.
 */
export const enforceFileSizeLimit = (
  fileSize: number,
  isArchive: boolean
): void => {
  if (isArchive && fileSize > MAX_ARCHIVE_SIZE_BYTES) {
    throw new Error(
      `File exceeds the maximum size limit of 50MB for archives (current size: ${(fileSize / (1024 * 1024)).toFixed(1)}MB).`
    );
  }
  if (!isArchive && fileSize > MAX_TEXT_FILE_SIZE_BYTES) {
    throw new Error(
      `File exceeds the maximum size limit of 10MB for text files (current size: ${(fileSize / (1024 * 1024)).toFixed(1)}MB).`
    );
  }
};

export const mapToInjectionsArray = (
  injections: ErgogenInjection[]
): string[][] => {
  return injections.map((inj) => [inj.type, inj.name, inj.content]);
};

/**
 * Transforms separated footprint/outline/template array lists into the raw context injections format string[][].
 */
export const mapSeparateToInjectionsArray = (
  footprints: { name: string; content: string }[],
  outlines: { name: string; content: string }[],
  templates: { name: string; content: string }[]
): string[][] => {
  const injections: string[][] = [];
  footprints.forEach((f) => injections.push(['footprint', f.name, f.content]));
  outlines.forEach((o) => injections.push(['outline', o.name, o.content]));
  templates.forEach((t) => injections.push(['template', t.name, t.content]));
  return injections;
};

/**
 * Unpacks and parses a JSZip archive into an ErgogenWorkspaceBundle.
 */
export const parseZipArchive = async (
  arrayBuffer: ArrayBuffer
): Promise<ErgogenWorkspaceBundle> => {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(arrayBuffer);
  } catch (_err) {
    throw new Error(
      'The file appears to be corrupted. Please verify the file and try again.'
    );
  }

  const configFile = validateZipStructure(zip);
  const config = await configFile.async('string');

  const injections: ErgogenInjection[] = [];
  const promises: Promise<void>[] = [];

  zip.forEach((relativePath, file) => {
    if (file.dir || !relativePath.endsWith('.js')) return;

    if (relativePath.startsWith('footprints/')) {
      const promise = file.async('string').then((content) => {
        const name = cleanInjectionName(relativePath, 'footprints');
        injections.push({ type: 'footprint', name, content });
      });
      promises.push(promise);
    } else if (
      relativePath.startsWith('outlines/') &&
      isFeatureEnabled('outlines')
    ) {
      const promise = file.async('string').then((content) => {
        const name = cleanInjectionName(relativePath, 'outlines');
        injections.push({ type: 'outline', name, content });
      });
      promises.push(promise);
    } else if (
      relativePath.startsWith('templates/') &&
      isFeatureEnabled('templates')
    ) {
      const promise = file.async('string').then((content) => {
        const name = cleanInjectionName(relativePath, 'templates');
        injections.push({ type: 'template', name, content });
      });
      promises.push(promise);
    }
  });

  await Promise.all(promises);

  return {
    config,
    injections,
  };
};
