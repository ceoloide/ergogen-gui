import { saveAs } from 'file-saver';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { parseZipArchive } from '../src/utils/ergogenBundleLoader';
import { createZip, exportConfigsProgressively } from '../src/utils/zip';
import {
  expectedKeys,
  expectedRectangleUnionSize,
  outlineRectangles,
  probePadInjection,
  staggeredThumbsConfig,
  unknownOutlineConfig,
} from './corpus/corpus';
import { generate } from './corpus/inProcessWorker';
import type { WorkerResponse } from '../src/workers/ergogen.worker.types';
import {
  type ArchiveContents,
  dxfLineSegments,
  pcbEdgeCutsSize,
  pcbFootprints,
  readArchive,
  segmentDifferences,
  svgOutlineGeometry,
} from './corpus/inspect';

// Archives are built by the app's real export functions with real JSZip; only
// the browser download and the Worker transport are replaced. Bulk export
// compiles through the app's real worker handler (see inProcessWorker.ts).
vi.mock('file-saver', () => ({ saveAs: vi.fn() }));
vi.mock('../src/workers/workerFactory', async () => {
  const { InProcessErgogenWorker } = await import('./corpus/inProcessWorker');
  return {
    createErgogenWorker: () => new InProcessErgogenWorker(),
    // The corpus has no cases, so export never asks for STL conversion.
    createJscadWorker: () => null,
  };
});

type Results = Parameters<typeof createZip>[0] & {
  outlines: Record<string, { svg: string; dxf: string }>;
  pcbs: { board: string };
};

const [, probePadName, probePadCode] = probePadInjection;
const probePadPath = `footprints/${probePadName}.js`;
const publicOutlineFiles = ['board', 'keycaps'].flatMap((name) => [
  `outputs/outlines/${name}.dxf`,
  `outputs/outlines/${name}.svg`,
]);

/** The archive and file name from the most recent download. */
const lastDownload = async (): Promise<
  ArchiveContents & { filename: string }
> => {
  const [blob, filename] = vi.mocked(saveAs).mock.lastCall as [Blob, string];
  return { ...(await readArchive(blob)), filename };
};

/**
 * Checks generated files in an archive against the hand-written corpus
 * expectations, so an archive cannot pass by echoing wrong engine output.
 */
const expectCorpusOutputs = async (
  archive: ArchiveContents,
  folder: string
) => {
  for (const name of ['board', 'keycaps'] as const) {
    const { size, regions } = outlineRectangles[name];
    const expected = expectedRectangleUnionSize(size);
    const svg = svgOutlineGeometry(
      await archive.text(`${folder}outputs/outlines/${name}.svg`)
    );
    const dxf = dxfLineSegments(
      await archive.text(`${folder}outputs/outlines/${name}.dxf`)
    );
    expect(svg.width, `${name}.svg width`).toBeCloseTo(expected.width, 2);
    expect(svg.height, `${name}.svg height`).toBeCloseTo(expected.height, 2);
    expect(svg.regions, `${name}.svg closed regions`).toBe(regions);
    expect(
      segmentDifferences(dxf, svg.segments),
      `${name}.dxf compared with ${name}.svg`
    ).toEqual({ missing: [], unexpected: [] });
  }

  const pcb = await archive.text(`${folder}outputs/pcbs/board.kicad_pcb`);
  const footprints = pcbFootprints(pcb);
  expect(footprints).toHaveLength(expectedKeys.length * 2);
  footprints
    .filter((footprint) => footprint.library === 'corpus:probe_pad')
    .forEach((footprint, index) => {
      const key = expectedKeys[index];
      expect(footprint.x, `${footprint.reference} x`).toBeCloseTo(key.x, 3);
      expect(footprint.y, `${footprint.reference} y`).toBeCloseTo(-key.y, 3);
      expect(footprint.nets).toEqual([key.zoneColumn]);
    });
  const board = svgOutlineGeometry(
    await archive.text(`${folder}outputs/outlines/board.svg`)
  );
  const edge = pcbEdgeCutsSize(pcb);
  expect(edge.segments, 'Edge.Cuts segments').toBe(board.segments.length);
  expect(edge.width, 'Edge.Cuts width').toBeCloseTo(board.width, 2);
  expect(edge.height, 'Edge.Cuts height').toBeCloseTo(board.height, 2);
};

beforeEach(() => {
  vi.mocked(saveAs).mockClear();
});

describe('single-configuration archive (createZip)', () => {
  let response: WorkerResponse;
  // A failed generation fails every case with the engine's message, rather
  // than failing the hook and reporting the cases as skipped.
  const results = (): Results => {
    if (response.type !== 'success') {
      throw new Error(`Generation failed: ${response.error}`);
    }
    return response.results as Results;
  };

  beforeAll(async () => {
    response = await generate(staggeredThumbsConfig, [probePadInjection]);
  }, 20000);

  it('packages the config, its injections and public outputs by name', async () => {
    // Act
    await createZip(
      results(),
      staggeredThumbsConfig,
      [probePadInjection],
      false,
      false
    );
    const archive = await lastDownload();
    // Assert: only the date in the file name varies.
    expect(archive.filename).toMatch(/^ergogen-\d{4}-\d{2}-\d{2}\.zip$/);
    expect(archive.paths).toEqual(
      [
        'config.yaml',
        probePadPath,
        'outputs/demo.svg',
        ...publicOutlineFiles,
        'outputs/pcbs/board.kicad_pcb',
      ].sort()
    );
    expect(await archive.text('config.yaml')).toBe(staggeredThumbsConfig);
    expect(await archive.text(probePadPath)).toBe(probePadCode);
    await expectCorpusOutputs(archive, '');
  });

  it('reloads as the same config and injections, never as outputs', async () => {
    // Arrange
    await createZip(
      results(),
      staggeredThumbsConfig,
      [probePadInjection],
      true,
      false
    );
    const archive = await lastDownload();
    // Act: the loader behind "Open ZIP or .ekb".
    const reloaded = await parseZipArchive(archive.buffer);
    // Assert
    expect(reloaded).toEqual({
      config: staggeredThumbsConfig,
      injections: [
        { type: 'footprint', name: probePadName, content: probePadCode },
      ],
    });
  });

  it('adds private outlines and debug data only in debug mode', async () => {
    // Act
    await createZip(
      results(),
      staggeredThumbsConfig,
      [probePadInjection],
      true,
      false
    );
    const archive = await lastDownload();
    // Assert
    expect(archive.paths).toEqual(
      expect.arrayContaining([
        'outputs/outlines/_plate.dxf',
        'outputs/outlines/_plate.svg',
        'outputs/debug/raw.txt',
        'outputs/debug/canonical.yaml',
        'outputs/debug/points.yaml',
        'outputs/debug/units.yaml',
      ])
    );
    expect(await archive.text('outputs/debug/raw.txt')).toBe(
      staggeredThumbsConfig
    );
    const points = JSON.parse(await archive.text('outputs/debug/points.yaml'));
    expect(Object.keys(points)).toEqual(expectedKeys.map((key) => key.name));
    for (const key of expectedKeys) {
      expect(points[key.name].x, `${key.name} x`).toBeCloseTo(key.x, 3);
      expect(points[key.name].y, `${key.name} y`).toBeCloseTo(key.y, 3);
    }
    const plate = svgOutlineGeometry(
      await archive.text('outputs/outlines/_plate.svg')
    );
    expect(plate.regions).toBe(outlineRectangles._plate.regions);
  });
});

describe('bulk archives (exportConfigsProgressively)', () => {
  const configs = [
    { name: 'Staggered thumbs', config: staggeredThumbsConfig },
    { name: 'Missing outline', config: unknownOutlineConfig },
  ];

  const exportAll = (onlyConfigs: boolean) =>
    exportConfigsProgressively(
      configs,
      [probePadInjection],
      false,
      false,
      onlyConfigs,
      () => undefined,
      () => false
    );

  it('saves editable inputs without generated files when only configs are chosen', async () => {
    // Act
    const summary = await exportAll(true);
    const archive = await lastDownload();
    // Assert
    expect(summary).toEqual({ succeededCount: 2, failedCount: 0 });
    expect(archive.filename).toMatch(
      /^ergogen-config-all-\d{4}-\d{2}-\d{2}\.zip$/
    );
    expect(archive.paths).toEqual(
      ['Missing outline.yaml', 'Staggered thumbs.yaml', probePadPath].sort()
    );
    expect(await archive.text('Staggered thumbs.yaml')).toBe(
      staggeredThumbsConfig
    );
    expect(await archive.text('Missing outline.yaml')).toBe(
      unknownOutlineConfig
    );
    expect(await archive.text(probePadPath)).toBe(probePadCode);
  });

  it('compiles each config into its own folder and records failures', async () => {
    // Arrange
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    // Act
    const summary = await exportAll(false);
    const archive = await lastDownload();
    consoleError.mockRestore();
    // Assert
    expect(summary).toEqual({ succeededCount: 1, failedCount: 1 });
    expect(archive.filename).toMatch(
      /^ergogen-export-all-\d{4}-\d{2}-\d{2}\.zip$/
    );
    const valid = 'Staggered thumbs/';
    expect(archive.paths).toEqual(
      [
        'Missing outline/config.yaml',
        'Missing outline/error.txt',
        `${valid}config.yaml`,
        `${valid}${probePadPath}`,
        `${valid}outputs/demo.svg`,
        ...publicOutlineFiles.map((path) => `${valid}${path}`),
        `${valid}outputs/pcbs/board.kicad_pcb`,
      ].sort()
    );
    expect(await archive.text(`${valid}config.yaml`)).toBe(
      staggeredThumbsConfig
    );
    expect(await archive.text('Missing outline/config.yaml')).toBe(
      unknownOutlineConfig
    );
    expect(await archive.text('Missing outline/error.txt')).toBe(
      'Compilation failed: Error: Field "outlines.board.0.name" does not name an existing outline!'
    );
    await expectCorpusOutputs(archive, valid);
  });
});
