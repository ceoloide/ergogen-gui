import yaml from 'js-yaml';
import { Preview } from '../types/preview';
import { Results } from '../types/results';
import { findResult } from './object';

/**
 * Resolve the preview payload for the selected output key and extension
 * without mutating caller state, falling back to `demo.svg` if missing.
 */
export const resolvePreview = (
  results: Results | null | undefined,
  previewKey: string,
  previewExtension: string,
  configText = ''
): Preview => {
  let key = previewKey;
  let extension = previewExtension;
  let result: unknown = null;

  if (results) {
    result = findResult(key, results);
    if (result === undefined && key !== 'demo.svg') {
      key = 'demo.svg';
      extension = 'svg';
      result = findResult(key, results);
    }
  }

  let content: Preview['content'] = '';
  switch (extension) {
    case 'svg':
    case 'kicad_pcb':
      content = typeof result === 'string' ? result : '';
      break;
    case 'stl':
      content =
        typeof result === 'string' ||
        result instanceof ArrayBuffer ||
        ArrayBuffer.isView(result)
          ? (result as string | ArrayBuffer | Uint8Array)
          : '';
      break;
    case 'jscad':
      content =
        typeof (result as Record<string, unknown>)?.jscad === 'string'
          ? ((result as Record<string, unknown>).jscad as string)
          : '';
      break;
    case 'yaml':
      content = yaml.dump(result);
      break;
    case 'txt':
      content = configText;
      break;
    default:
      content = '';
  }

  return { key, extension, content };
};
