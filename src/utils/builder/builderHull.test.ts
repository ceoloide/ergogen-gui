/**
 * The starter's outlines and the hull the Build view keeps around every key,
 * checked with full runs of the real Ergogen engine.
 */
import * as ergogen from 'ergogen';
import * as makerjs from 'makerjs';
import { computeLayout } from './pointsPreview';
import { applyPatch, PatchOperation } from './yamlPatch';
import { BUILDER_STARTER_CONFIG } from './starterConfig';
import { managedHullPath, syncManagedHull } from './builderHull';
import {
  addColumn,
  addThumbCluster,
  deleteColumn,
  enableMirror,
  StructureEdit,
} from './structureOps';

type Outline = { yaml: makerjs.IModel; svg: string };

type Generated = {
  points: Record<string, unknown>;
  /** Each outline as Ergogen exports it; `yaml` holds its makerjs model. */
  outlines: Record<string, Outline>;
};

const patch = (text: string, operations: PatchOperation[]) => {
  const result = applyPatch(text, operations);
  if (!result.ok) throw new Error(result.reason);
  return result.text;
};

/** What the Build view commits for an edit: the edit, then the hull sync. */
const builderEdit = (text: string, edit: StructureEdit | PatchOperation[]) => {
  const operations = Array.isArray(edit)
    ? edit
    : edit.ok
      ? edit.operations
      : (() => {
          throw new Error(edit.reason);
        })();
  const edited = patch(text, operations);
  return patch(edited, syncManagedHull(edited, computeLayout(edited)));
};

const hullPoints = (text: string) => {
  const match = /\n {6}points:\n((?: {8}- .*\n)*)/.exec(text);
  if (!match) throw new Error('No block list of hull points');
  return match[1]
    .split('\n')
    .filter(Boolean)
    .map((line) => line.slice(10));
};

const generate = async (text: string) =>
  (await ergogen.process(text, { debug: true })) as unknown as Generated;

/** The closed loops of an exported outline, in Ergogen's coordinates. */
const closedChains = (outline: Outline) =>
  (makerjs.model.findChains(outline.yaml) as makerjs.IChain[]).filter(
    (chain) => chain.endless
  );

type Point = [number, number];

const insidePolygon = (polygon: Point[], [x, y]: Point) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

/** Every visible key of `text` lies in the single closed region of `board`. */
const expectBoardAroundKeys = (text: string, board: Outline) => {
  const chains = closedChains(board);
  expect(chains).toHaveLength(1);
  const polygon = makerjs.chain.toKeyPoints(chains[0], 0.5) as Point[];
  const keys = computeLayout(text).keys.filter((k) => !k.skipped);
  for (const k of keys) {
    // The keycap corners, 9 mm from the centre, rotated with the key.
    for (const [dx, dy] of [
      [-9, -9],
      [9, -9],
      [9, 9],
      [-9, 9],
    ]) {
      const angle = (k.r * Math.PI) / 180;
      const corner: Point = [
        k.x + dx * Math.cos(angle) - dy * Math.sin(angle),
        k.y + dx * Math.sin(angle) + dy * Math.cos(angle),
      ];
      expect(insidePolygon(polygon, corner), `${k.name} ${corner}`).toBe(true);
    }
  }
  return keys;
};

describe('the builder starter outlines', () => {
  it('draws keycaps, a board hull around them and a preview of both', async () => {
    // Act
    const result = await generate(BUILDER_STARTER_CONFIG);

    // Assert
    expect(Object.keys(result.outlines)).toEqual(['keys', 'board', 'preview']);
    expect(closedChains(result.outlines.keys)).toHaveLength(15);
    const keys = expectBoardAroundKeys(
      BUILDER_STARTER_CONFIG,
      result.outlines.board
    );
    expect(hullPoints(BUILDER_STARTER_CONFIG)).toEqual(keys.map((k) => k.name));
    // Stacked, not merged: the board and every keycap stay separate loops.
    expect(closedChains(result.outlines.preview)).toHaveLength(16);
  });

  it('hands only the starter hull to the builder', () => {
    // Arrange
    const unmarked = BUILDER_STARTER_CONFIG.replace(
      / {2}# The Build view[^]*?hull: board\.hull\n/,
      ''
    );

    // Act
    const starter = managedHullPath(BUILDER_STARTER_CONFIG);
    const withoutMarker = syncManagedHull(
      unmarked,
      computeLayout(
        builderEdit(unmarked, [
          { type: 'set', path: ['points', 'key', 'skip'], value: true },
        ])
      )
    );

    // Assert
    expect(unmarked).not.toContain('builder:');
    expect(starter).toEqual(['outlines', 'board', 'hull', 'points']);
    expect(withoutMarker).toEqual([]);
    expect(managedHullPath('meta:\n  builder:\n    hull: board.hull\n')).toBe(
      null
    );
    expect(
      syncManagedHull(
        BUILDER_STARTER_CONFIG,
        computeLayout(BUILDER_STARTER_CONFIG)
      )
    ).toEqual([]);
  });
});

describe('the builder-owned hull after structure edits', () => {
  it('takes in a new column, a thumb cluster and the mirrored half', async () => {
    // Arrange
    const layout = computeLayout(BUILDER_STARTER_CONFIG);

    // Act
    const withColumn = builderEdit(
      BUILDER_STARTER_CONFIG,
      addColumn(layout, 'matrix', 'index')
    );
    const withThumb = builderEdit(
      withColumn,
      addThumbCluster(computeLayout(withColumn), 'matrix')
    );
    const mirrored = builderEdit(
      withThumb,
      enableMirror(computeLayout(withThumb))
    );
    const result = await generate(mirrored);

    // Assert
    const points = hullPoints(mirrored);
    expect(points).toHaveLength(42);
    expect(points).toContain('matrix_col1_top');
    expect(points).toContain('thumb_far_cluster');
    expect(points).toContain('mirror_thumb_far_cluster');
    expect([...points].sort()).toEqual(Object.keys(result.points).sort());
    expect(expectBoardAroundKeys(mirrored, result.outlines.board)).toHaveLength(
      42
    );
    expect(closedChains(result.outlines.preview)).toHaveLength(43);
  });

  it('drops deleted and skipped keys and brings skipped keys back', async () => {
    // Arrange
    const layout = computeLayout(BUILDER_STARTER_CONFIG);
    const skipTop = {
      type: 'set' as const,
      path: ['points', 'zones', 'matrix', 'rows', 'top', 'skip'],
      value: true,
    };
    const skipAll = {
      type: 'set' as const,
      path: ['points', 'key', 'skip'],
      value: true,
    };

    // Act
    const withoutPinky = builderEdit(
      BUILDER_STARTER_CONFIG,
      deleteColumn(layout, 'matrix', 'pinky')
    );
    const withoutTop = builderEdit(withoutPinky, [skipTop]);
    const allSkipped = builderEdit(withoutTop, [skipAll]);
    const restored = builderEdit(allSkipped, [
      { type: 'delete', path: skipAll.path },
    ]);
    const result = await generate(withoutTop);

    // Assert
    expect(hullPoints(withoutPinky)).not.toContain('matrix_pinky_home');
    expect(hullPoints(withoutPinky)).toHaveLength(12);
    expect(hullPoints(withoutTop)).toEqual([
      'matrix_ring_bottom',
      'matrix_ring_home',
      'matrix_middle_bottom',
      'matrix_middle_home',
      'matrix_index_bottom',
      'matrix_index_home',
      'matrix_inner_bottom',
      'matrix_inner_home',
    ]);
    expectBoardAroundKeys(withoutTop, result.outlines.board);
    // With every key skipped there is nothing to enclose; the builder still
    // lays the keys out, and showing them again restores the list.
    expect(allSkipped).toContain('      points: []\n');
    expect(computeLayout(allSkipped).keys).toHaveLength(12);
    expect(hullPoints(restored)).toEqual(hullPoints(withoutTop));
  });
});
