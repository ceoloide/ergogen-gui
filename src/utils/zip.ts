import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Results } from '../types/results';

const sanitizeName = (name: string): string =>
  name.replace(/[/\\?%*:|"<>]/g, '_') || 'Untitled';

export const getUniqueName = (
  usedNames: Set<string>,
  rawName: string
): string => {
  const baseName = sanitizeName(rawName);
  let finalName = baseName;
  let counter = 1;
  while (usedNames.has(finalName)) {
    finalName = `${baseName}_${counter}`;
    counter++;
  }
  usedNames.add(finalName);
  return finalName;
};

export const writeInjections = (
  parentFolder: JSZip,
  injections: string[][]
) => {
  const folderCache = new Map<string, JSZip>();
  for (const injection of injections) {
    const [type, name, content] = injection;
    let innerFolderName = 'footprints';
    if (type === 'outline') {
      innerFolderName = 'outlines';
    } else if (type === 'template') {
      innerFolderName = 'templates';
    }

    const targetFolder = parentFolder.folder(innerFolderName);
    if (targetFolder) {
      const pathParts = name.split('/');
      const fileName = pathParts.pop();
      let currentFolder = targetFolder;
      let currentKey = innerFolderName;
      for (const part of pathParts) {
        const nextKey = `${currentKey}/${part}`;
        let nextFolder = folderCache.get(nextKey);
        if (!nextFolder) {
          nextFolder = currentFolder.folder(part) || currentFolder;
          folderCache.set(nextKey, nextFolder);
        }
        currentFolder = nextFolder;
        currentKey = nextKey;
      }
      if (fileName) {
        currentFolder.file(`${fileName}.js`, content);
      }
    }
  }
};

export const addResultsToZip = (
  outputsFolder: JSZip,
  configText: string,
  results: Results,
  debug: boolean,
  includeStl: boolean
) => {
  if (results.demo?.svg) {
    outputsFolder.file('demo.svg', results.demo.svg);
  }

  if (results.outlines) {
    let outlinesFolder: JSZip | null = null;
    for (const [name, outline] of Object.entries(results.outlines)) {
      if (debug || !name.startsWith('_')) {
        if (outline.dxf || outline.svg) {
          if (!outlinesFolder) {
            outlinesFolder = outputsFolder.folder('outlines');
          }
          if (outlinesFolder) {
            if (outline.dxf) {
              outlinesFolder.file(`${name}.dxf`, outline.dxf);
            }
            if (outline.svg) {
              outlinesFolder.file(`${name}.svg`, outline.svg);
            }
          }
        }
      }
    }
  }

  if (results.pcbs && Object.keys(results.pcbs).length > 0) {
    const pcbsFolder = outputsFolder.folder('pcbs');
    if (pcbsFolder) {
      for (const [name, pcb] of Object.entries(results.pcbs)) {
        const fileName = name.endsWith('.kicad_pcb')
          ? name
          : `${name}.kicad_pcb`;
        pcbsFolder.file(fileName, pcb);
      }
    }
  }

  if (results.cases) {
    let casesFolder: JSZip | null = null;
    for (const [name, caseData] of Object.entries(results.cases)) {
      const hasJscad = !!caseData.jscad;
      const hasStl = includeStl && !!caseData.stl;
      if (hasJscad || hasStl) {
        if (!casesFolder) {
          casesFolder = outputsFolder.folder('cases');
        }
        if (casesFolder) {
          if (caseData.jscad) {
            casesFolder.file(`${name}.jscad`, caseData.jscad);
          }
          if (hasStl && caseData.stl) {
            casesFolder.file(`${name}.stl`, caseData.stl);
          }
        }
      }
    }
  }

  if (debug) {
    const debugFolder = outputsFolder.folder('debug');
    if (debugFolder) {
      debugFolder.file('raw.txt', configText);
      for (const [key, value] of Object.entries(results)) {
        if (['canonical', 'points', 'units'].includes(key)) {
          debugFolder.file(`${key}.yaml`, JSON.stringify(value, null, 2));
        }
      }
    }
  }
};

export const generateAndSaveZip = async (
  zip: JSZip,
  filenamePrefix: string
) => {
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .split('T')[0];
  saveAs(blob, `${filenamePrefix}-${timestamp}.zip`);
};

export const createZip = async (
  results: Results,
  config: string,
  injections: string[][] | undefined,
  debug: boolean,
  stlPreview: boolean
) => {
  const zip = new JSZip();
  zip.file('config.yaml', config);

  const outputsFolder = zip.folder('outputs');
  if (outputsFolder) {
    addResultsToZip(outputsFolder, config, results, debug, stlPreview);
  }

  if (injections && injections.length > 0) {
    writeInjections(zip, injections);
  }

  await generateAndSaveZip(zip, 'ergogen');
};
