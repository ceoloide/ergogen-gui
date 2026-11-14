import * as ergogen from 'ergogen';
import { beforeAll, describe, expect, it } from 'vitest';
import type { WorkerResponse } from '../src/workers/ergogen.worker.types';
import {
  expectedKeys,
  expectedRectangleUnionSize,
  invalidSyntaxConfig,
  outlineRectangles,
  probePadInjection,
  staggeredThumbsConfig,
  unknownOutlineConfig,
} from './corpus/corpus';
import { generate } from './corpus/inProcessWorker';
import {
  dxfLineSegments,
  pcbDeclaredNets,
  pcbEdgeCutsSize,
  pcbFootprints,
  segmentDifferences,
  svgOutlineGeometry,
  withoutPcbGenerationDate,
} from './corpus/inspect';

// A small semantic fixture exercises the same prepared engine as the browser,
// including a vendor footprint that the unmodified dependency does not expose.
const twoKeys = {
  points: {
    zones: { matrix: { columns: { one: {}, two: {} }, rows: { row: {} } } },
  },
  outlines: { keys: [{ what: 'rectangle', where: true, size: [18, 18] }] },
  pcbs: {
    board: {
      template: 'kicad8',
      footprints: {
        keys: {
          what: 'ceoloide/switch_mx',
          where: true,
          params: { from: '{{colrow}}', to: 'GND' },
        },
      },
    },
  },
};
let output: {
  points: Record<string, { x: number; y: number }>;
  outlines: { keys: { svg: string } };
  pcbs: { board: string };
};

beforeAll(async () => {
  // Act: run the real engine, with no worker or engine mock.
  output = await ergogen.process(twoKeys, { svg: true, debug: true });
}, 20000);

describe('prepared engine semantic corpus', () => {
  it('preserves key count and pitch', () => {
    // Assert
    expect(Object.keys(output.points)).toEqual([
      'matrix_one_row',
      'matrix_two_row',
    ]);
    expect(
      output.points.matrix_two_row.x - output.points.matrix_one_row.x
    ).toBe(19);
    expect(output.points.matrix_one_row.y).toBe(output.points.matrix_two_row.y);
  });

  it('preserves outline dimensions without a volatile SVG snapshot', () => {
    // Assert
    expect(output.outlines.keys.svg).toContain('viewBox="0 0 37 18"');
  });

  it('compiles the pinned vendor footprint into a KiCad 8 PCB', () => {
    // Assert
    expect(output.pcbs.board).toContain('(version 20240108)');
    expect(output.pcbs.board.match(/\(footprint /g)).toHaveLength(2);
    expect(output.pcbs.board).toContain('GND');
  });

  it('rejects an unknown footprint rather than emitting a partial PCB', async () => {
    // Arrange
    const invalid = structuredClone(twoKeys);
    invalid.pcbs.board.footprints.keys.what = 'missing/footprint';
    // Act / Assert
    await expect(ergogen.process(invalid, { svg: true })).rejects.toThrow();
  });

  it('compiles the infused-kim diode and rejects the typo name', async () => {
    // Arrange
    const config = structuredClone(twoKeys);
    config.pcbs.board.template = 'kicad5';
    config.pcbs.board.footprints.keys.what = 'infused-kim/diode';

    // Act
    const current = await ergogen.process(config);
    config.pcbs.board.footprints.keys.what = 'infused-kimo/isde';

    // Assert
    expect(current.pcbs.board.match(/\(module /g)).toHaveLength(2);
    expect(current.pcbs.board).toContain('GND');
    await expect(ergogen.process(config)).rejects.toThrow(
      'Field "pcbs.board.footprints.keys.what" should be one of'
    );
  });
});

type CorpusResults = {
  points: Record<string, { x: number; y: number; r: number }>;
  outlines: Record<string, { svg: string; dxf: string }>;
  pcbs: { board: string };
};

const successfulResults = (response: WorkerResponse): CorpusResults => {
  if (response.type !== 'success') {
    throw new Error(`Generation failed: ${response.error}`);
  }
  return response.results as CorpusResults;
};

describe('staggered thumb corpus through the app worker', () => {
  let response: WorkerResponse;
  // A failed generation fails every case with the engine's message, rather
  // than failing the hook and reporting the cases as skipped.
  const results = () => successfulResults(response);

  beforeAll(async () => {
    // Act: the real worker handler, injection evaluator and prepared engine.
    response = await generate(staggeredThumbsConfig, [probePadInjection]);
  }, 20000);

  it('places every key at its hand-derived position', () => {
    // Assert
    expect(Object.keys(results().points)).toEqual(
      expectedKeys.map((key) => key.name)
    );
    for (const key of expectedKeys) {
      const point = results().points[key.name];
      expect(point.x, `${key.name} x`).toBeCloseTo(key.x, 3);
      expect(point.y, `${key.name} y`).toBeCloseTo(key.y, 3);
      expect(point.r, `${key.name} rotation`).toBeCloseTo(key.r, 3);
    }
  });

  it.each(Object.entries(outlineRectangles))(
    'draws outline %s as the union of rotated key rectangles',
    (name, { size, regions }) => {
      // Arrange
      const expected = expectedRectangleUnionSize(size);
      // Act
      const geometry = svgOutlineGeometry(results().outlines[name].svg);
      // Assert
      expect(geometry.width, `${name} width`).toBeCloseTo(expected.width, 2);
      expect(geometry.height, `${name} height`).toBeCloseTo(expected.height, 2);
      expect(geometry.regions, `${name} closed regions`).toBe(regions);
      expect(geometry.otherPaths, `${name} non-line paths`).toBe(0);
    }
  );

  it('fails the region count when one keycap outline is left open', () => {
    // Arrange: drop the closing side of the first keycap rectangle.
    const svg = results().outlines.keycaps.svg;
    const opened = svg.replace(/ L [-\d.]+ [-\d.]+ Z/, '');
    expect(opened).not.toBe(svg);
    const expected = expectedRectangleUnionSize(outlineRectangles.keycaps.size);
    // Act
    const geometry = svgOutlineGeometry(opened);
    // Assert: the size still matches, so only the region count notices.
    expect(geometry.width).toBeCloseTo(expected.width, 2);
    expect(geometry.height).toBeCloseTo(expected.height, 2);
    expect(geometry.regions).toBe(outlineRectangles.keycaps.regions - 1);
  });

  it.each(Object.keys(outlineRectangles))(
    'writes the same %s geometry to DXF and SVG',
    (name) => {
      // Act
      const svg = svgOutlineGeometry(results().outlines[name].svg);
      const dxf = dxfLineSegments(results().outlines[name].dxf);
      // Assert
      expect(
        segmentDifferences(dxf, svg.segments),
        `${name} DXF segments compared with SVG`
      ).toEqual({ missing: [], unexpected: [] });
    }
  );

  it('places one switch and one custom probe pad on every key', () => {
    // Act
    const footprints = pcbFootprints(results().pcbs.board);
    // Assert: KiCad y points down, Ergogen y points up.
    for (const [library, designator] of [
      ['ceoloide:switch_mx', 'S'],
      ['corpus:probe_pad', 'P'],
    ]) {
      const placed = footprints.filter((fp) => fp.library === library);
      expect(placed.map((fp) => fp.reference)).toEqual(
        expectedKeys.map((_, index) => `${designator}${index + 1}`)
      );
      placed.forEach((footprint, index) => {
        const key = expectedKeys[index];
        const label = `${footprint.reference} on ${key.name}`;
        expect(footprint.x, `${label} x`).toBeCloseTo(key.x, 3);
        expect(footprint.y, `${label} y`).toBeCloseTo(-key.y, 3);
        expect(footprint.rotation, `${label} rotation`).toBeCloseTo(key.r, 3);
      });
    }
    expect(footprints).toHaveLength(expectedKeys.length * 2);
  });

  it('connects each footprint to its declared parametric nets', () => {
    // Act
    const footprints = pcbFootprints(results().pcbs.board);
    const declared = pcbDeclaredNets(results().pcbs.board);
    // Assert
    const switches = footprints.filter(
      (fp) => fp.library === 'ceoloide:switch_mx'
    );
    const probes = footprints.filter((fp) => fp.library === 'corpus:probe_pad');
    expect(switches.map((fp) => fp.nets)).toEqual(
      expectedKeys.map((key) => [key.colrow, 'GND'].sort())
    );
    expect(probes.map((fp) => fp.nets)).toEqual(
      expectedKeys.map((key) => [key.zoneColumn])
    );
    for (const net of footprints.flatMap((fp) => fp.nets)) {
      expect(declared, `net ${net} is declared`).toContain(net);
    }
  });

  it('cuts the PCB edge to the board outline', () => {
    // Act
    const edge = pcbEdgeCutsSize(results().pcbs.board);
    const board = svgOutlineGeometry(results().outlines.board.svg);
    // Assert
    expect(edge.segments).toBe(board.segments.length);
    expect(edge.width).toBeCloseTo(board.width, 2);
    expect(edge.height).toBeCloseTo(board.height, 2);
  });

  it('repeats identical output apart from the documented PCB date', async () => {
    // Act
    const again = successfulResults(
      await generate(staggeredThumbsConfig, [probePadInjection])
    );
    // Assert
    expect(again.points).toEqual(results().points);
    expect(again.outlines).toEqual(results().outlines);
    expect(results().pcbs.board).toMatch(/\(date "\d{4}-\d{2}-\d{2}"\)/);
    expect(withoutPcbGenerationDate(again.pcbs.board)).toBe(
      withoutPcbGenerationDate(results().pcbs.board)
    );
  });
});

describe('invalid corpus inputs through the app worker', () => {
  it.each([
    [
      'invalid YAML syntax',
      invalidSyntaxConfig,
      [],
      'Input is not valid YAML, JSON, or JS Code!',
    ],
    [
      'a reference to a missing outline',
      unknownOutlineConfig,
      [],
      'Field "outlines.board.0.name" does not name an existing outline!',
    ],
    [
      'a custom footprint that throws while loading',
      staggeredThumbsConfig,
      [['footprint', 'corpus/broken', "throw new Error('broken footprint');"]],
      'broken footprint',
    ],
  ])(
    'reports %s instead of returning output',
    async (_, config, injections, message) => {
      // Act
      const response = await generate(config, injections as string[][]);
      // Assert
      expect(response).toEqual({
        type: 'error',
        error: expect.stringContaining(message),
        requestId: 'corpus',
      });
    }
  );
});
