import yaml from 'js-yaml';

/**
 * Type definition for Ergogen results used in archive generation
 */
type Results = {
  canonical?: unknown;
  points?: unknown;
  units?: unknown;
  demo?: {
    dxf?: string;
    svg?: string;
  };
  outlines?: Record<
    string,
    {
      dxf?: string;
      svg?: string;
    }
  >;
  cases?: Record<
    string,
    {
      jscad?: string;
      stl?: string;
    }
  >;
  pcbs?: Record<string, string>;
  [key: string]: unknown;
};

/**
 * Generates a zip archive containing all generated Ergogen outputs.
 *
 * @param configInput - The current YAML configuration string
 * @param injectionInput - Array of injections [type, name, content]
 * @param results - The Ergogen generation results
 * @param debug - Whether debug mode is enabled
 * @param stlPreview - Whether STL preview is enabled
 */
export async function generateArchive(
  configInput: string | undefined,
  injectionInput: string[][] | undefined,
  results: Results | null,
  debug: boolean,
  stlPreview: boolean
): Promise<void> {
  if (!configInput || !results) {
    return;
  }

  const zip = new JSZip();

  // Add config.yaml to root
  zip.file('config.yaml', configInput);

  // Add demo.svg to root
  if (results.demo?.svg) {
    zip.file('demo.svg', results.demo.svg);
  }

  // Add outlines folder
  if (results.outlines) {
    const outlinesFolder = zip.folder('outlines');
    if (outlinesFolder) {
      for (const [name, outline] of Object.entries(results.outlines)) {
        // Skip outlines starting with _ unless debug is enabled
        if (!debug && name.startsWith('_')) {
          continue;
        }

        if (outline.dxf) {
          outlinesFolder.file(`${name}.dxf`, outline.dxf);
        }
        if (outline.svg) {
          outlinesFolder.file(`${name}.svg`, outline.svg);
        }
      }
    }
  }

  // Add pcbs folder
  if (results.pcbs) {
    const pcbsFolder = zip.folder('pcbs');
    if (pcbsFolder) {
      for (const [name, pcb] of Object.entries(results.pcbs)) {
        pcbsFolder.file(`${name}.kicad_pcb`, pcb);
      }
    }
  }

  // Add cases folder
  if (results.cases) {
    const casesFolder = zip.folder('cases');
    if (casesFolder) {
      for (const [name, caseObj] of Object.entries(results.cases)) {
        if (caseObj.jscad) {
          casesFolder.file(`${name}.jscad`, caseObj.jscad);
        }
        // Only add STL if stlPreview is true and the STL is available
        if (stlPreview && caseObj.stl) {
          casesFolder.file(`${name}.stl`, caseObj.stl);
        }
      }
    }
  }

  // Add debug folder if debug is enabled
  if (debug) {
    const debugFolder = zip.folder('debug');
    if (debugFolder) {
      // Add canonical.yaml
      if (results.canonical) {
        debugFolder.file('canonical.yaml', yaml.dump(results.canonical));
      }
      // Add points.yaml
      if (results.points) {
        debugFolder.file('points.yaml', yaml.dump(results.points));
      }
      // Add units.yaml
      if (results.units) {
        debugFolder.file('units.yaml', yaml.dump(results.units));
      }
      // Add raw.txt (the original config)
      debugFolder.file('raw.txt', configInput);
    }
  }

  // Add footprints folder if injections are defined
  if (
    injectionInput &&
    Array.isArray(injectionInput) &&
    injectionInput.length > 0
  ) {
    const footprintsFolder = zip.folder('footprints');
    if (footprintsFolder) {
      for (const injection of injectionInput) {
        if (injection.length === 3 && injection[0] === 'footprint') {
          const name = injection[1];
          const content = injection[2];

          // Handle nested folder structure based on '/' in name
          if (name.includes('/')) {
            const parts = name.split('/');
            const fileName = parts[parts.length - 1];
            const folderPath = parts.slice(0, -1);

            // Create nested folders
            let currentFolder: JSZipFolder = footprintsFolder;
            for (const folderName of folderPath) {
              const nestedFolder = currentFolder.folder(folderName);
              if (nestedFolder) {
                currentFolder = nestedFolder;
              }
            }

            currentFolder.file(`${fileName}.js`, content);
          } else {
            // No nested folders, add directly to footprints
            footprintsFolder.file(`${name}.js`, content);
          }
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
}
