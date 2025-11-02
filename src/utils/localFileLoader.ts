import JSZip from 'jszip';

import { GitHubFootprint } from './github';

type LocalConfigLoadResult = {
  config: string;
  footprints: GitHubFootprint[];
};

const TEXT_EXTENSIONS = ['.yaml', '.yml', '.json'];
const ARCHIVE_EXTENSIONS = ['.zip', '.ekb'];

const getExtension = (filename: string) => {
  const lower = filename.toLowerCase();
  const lastDot = lower.lastIndexOf('.');
  return lastDot === -1 ? '' : lower.substring(lastDot);
};

const assertFileName = (file: File | (Blob & { name?: string })) => {
  if (!('name' in file) || !file.name) {
    throw new Error('Provided file must include a name.');
  }
};

const loadArchive = async (
  file: File | (Blob & { name: string })
): Promise<LocalConfigLoadResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const configFile = zip.file('config.yaml') ?? zip.file('./config.yaml');
  if (!configFile) {
    throw new Error('Archive is missing required config.yaml at the root.');
  }

  const config = await configFile.async('string');

  const footprintEntries = Object.entries(zip.files)
    .filter(([path, entry]) => {
      if (entry.dir) return false;
      if (!path.startsWith('footprints/')) return false;
      return path.toLowerCase().endsWith('.js');
    })
    .map(([path]) => path)
    .sort();

  const footprints: GitHubFootprint[] = await Promise.all(
    footprintEntries.map(async (path) => {
      const entry = zip.file(path);
      if (!entry) {
        throw new Error(`Failed to read archive entry: ${path}`);
      }

      const relativePath = path.substring('footprints/'.length);
      const name = relativePath.replace(/\.js$/i, '');
      const content = await entry.async('string');

      return { name, content };
    })
  );

  return { config, footprints };
};

const loadTextFile = async (
  file: File | (Blob & { name: string })
): Promise<LocalConfigLoadResult> => {
  const config = await file.text();
  return { config, footprints: [] };
};

export const loadLocalConfigFile = async (
  file: File | (Blob & { name: string })
): Promise<LocalConfigLoadResult> => {
  assertFileName(file);

  const extension = getExtension(file.name);

  if (TEXT_EXTENSIONS.includes(extension)) {
    return loadTextFile(file);
  }

  if (ARCHIVE_EXTENSIONS.includes(extension)) {
    return loadArchive(file);
  }

  throw new Error(
    'Unsupported file type. Please choose a .yaml, .json, .zip, or .ekb file.'
  );
};
