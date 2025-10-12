import JSZip from 'jszip';
import { saveAs } from 'file-saver';

type DemoOutput = {
  dxf?: string;
  svg?: string;
};

type OutlineOutput = {
  dxf?: string;
  svg?: string;
};

type CaseOutput = {
  jscad?: string;
  stl?: string;
};

type PcbsOutput = Record<string, string>;

type Results = {
  canonical?: unknown;
  points?: unknown;
  units?: unknown;
  demo?: DemoOutput;
  outlines?: Record<string, OutlineOutput>;
  cases?: Record<string, CaseOutput>;
  pcbs?: PcbsOutput;
  [key: string]: unknown;
};

export const createZip = async (
  results: Results,
  config: string,
  injections: string[][] | undefined,
  debug: boolean,
  stlPreview: boolean
) => {
  const zip = new JSZip();

  // Root folder
  if (results.demo?.svg) {
    zip.file('demo.svg', results.demo.svg);
  }
  zip.file('config.yaml', config);

  // Outlines folder
  if (results.outlines) {
    const outlinesFolder = zip.folder('outlines');
    if (outlinesFolder) {
      for (const [name, outline] of Object.entries(results.outlines)) {
        if (debug || !name.startsWith('_')) {
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

  // PCBs folder
  if (results.pcbs) {
    const pcbsFolder = zip.folder('pcbs');
    if (pcbsFolder) {
      for (const [name, pcb] of Object.entries(results.pcbs)) {
        pcbsFolder.file(name, pcb);
      }
    }
  }

  // Cases folder
  if (results.cases) {
    const casesFolder = zip.folder('cases');
    if (casesFolder) {
      for (const [name, caseData] of Object.entries(results.cases)) {
        if (caseData.jscad) {
          casesFolder.file(`${name}.jscad`, caseData.jscad);
        }
        if (stlPreview && caseData.stl) {
          casesFolder.file(`${name}.stl`, caseData.stl);
        }
      }
    }
  }

  // Debug folder
  if (debug) {
    const debugFolder = zip.folder('debug');
    if (debugFolder) {
      debugFolder.file('raw.txt', config);
      for (const [key, value] of Object.entries(results)) {
        if (['canonical', 'points', 'units'].includes(key)) {
          debugFolder.file(`${key}.yaml`, JSON.stringify(value, null, 2));
        }
      }
    }
  }

  // Footprints folder
  if (injections && injections.length > 0) {
    const footprintsFolder = zip.folder('footprints');
    if (footprintsFolder) {
      for (const injection of injections) {
        const [, name, content] = injection;
        const pathParts = name.split('/');
        const fileName = pathParts.pop();
        let currentFolder = footprintsFolder;
        for (const part of pathParts) {
          currentFolder = currentFolder.folder(part) || currentFolder;
        }
        if (fileName) {
          currentFolder.file(`${fileName}.js`, content);
        }
      }
    }
  }

  // Generate the zip file
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  // Trigger download
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .split('T')[0];
  const filename = `ergogen-${timestamp}.zip`;
  saveAs(blob, filename);
};
