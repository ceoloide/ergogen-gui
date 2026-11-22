import { resolvePreview } from './preview';
import { Results } from '../types/results';

describe('resolvePreview', () => {
  it('resolves svg and kicad_pcb strings directly', () => {
    const results: Results = {
      demo: { svg: '<svg>demo</svg>' },
      pcbs: { board: '(kicad_pcb)' },
    };

    expect(resolvePreview(results, 'demo.svg', 'svg')).toEqual({
      key: 'demo.svg',
      extension: 'svg',
      content: '<svg>demo</svg>',
    });
    expect(resolvePreview(results, 'pcbs.board', 'kicad_pcb')).toEqual({
      key: 'pcbs.board',
      extension: 'kicad_pcb',
      content: '(kicad_pcb)',
    });
  });

  it('resolves stl string and binary buffers, jscad code, yaml objects, and txt config', () => {
    const stlBytes = new Uint8Array([1, 2, 3]);
    const stlBuffer = new ArrayBuffer(4);
    const results: Results = {
      points: { p1: { x: 1, y: 2 } },
      cases: {
        left: { jscad: 'function main() {}', stl: stlBytes },
        right: { stl: stlBuffer },
      },
    };

    expect(resolvePreview(results, 'cases.left.stl', 'stl').content).toBe(
      stlBytes
    );
    expect(resolvePreview(results, 'cases.right.stl', 'stl').content).toBe(
      stlBuffer
    );
    expect(resolvePreview(results, 'cases.left', 'jscad').content).toBe(
      'function main() {}'
    );
    expect(resolvePreview(results, 'points', 'yaml').content).toContain('p1:');
    expect(
      resolvePreview(results, 'config.txt', 'txt', 'points: { latest: {} }')
    ).toEqual({
      key: 'demo.svg',
      extension: 'svg',
      content: '',
    });
  });

  it('keeps txt extension when results are null and uses provided config text', () => {
    expect(resolvePreview(null, 'config.txt', 'txt', 'realtime yaml')).toEqual({
      key: 'config.txt',
      extension: 'txt',
      content: 'realtime yaml',
    });
  });

  it('falls back to demo.svg cleanly without mutating an external state object', () => {
    const state = {
      key: 'outlines.removed_plate.svg',
      extension: 'svg',
      content: '',
    };
    const results: Results = {
      demo: { svg: '<svg>fallback</svg>' },
    };

    const resolved = resolvePreview(results, state.key, state.extension);

    expect(resolved).toEqual({
      key: 'demo.svg',
      extension: 'svg',
      content: '<svg>fallback</svg>',
    });
    expect(state).toEqual({
      key: 'outlines.removed_plate.svg',
      extension: 'svg',
      content: '',
    });
  });
});
