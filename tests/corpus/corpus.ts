import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Pinned inputs and hand-written expectations for the semantic regression
 * corpus. Expected values are derived from the fixture by hand (see the
 * comments), never captured from engine output, so a wrong engine or export
 * result cannot also rewrite the expectation.
 */

const corpusDirectory = dirname(fileURLToPath(import.meta.url));

const fixtureText = (name: string): string =>
  readFileSync(join(corpusDirectory, name), 'utf8');

export const staggeredThumbsConfig = fixtureText('staggered-thumbs.yaml');
export const invalidSyntaxConfig = fixtureText('invalid-syntax.yaml');
export const unknownOutlineConfig = fixtureText('unknown-outline.yaml');

/** The custom footprint, in the app's `[type, name, code]` injection shape. */
export const probePadInjection: string[] = [
  'footprint',
  'corpus/probe_pad',
  fixtureText('footprints/corpus/probe_pad.js'),
];

type ExpectedKey = {
  name: string;
  /** Column and row names, as used by the `{{colrow}}` switch net. */
  colrow: string;
  /** Zone and column names, as used by the probe pad net. */
  zoneColumn: string;
  x: number;
  y: number;
  r: number;
};

const degrees = (value: number) => (value * Math.PI) / 180;

function key(
  zone: string,
  column: string,
  row: string,
  x: number,
  y: number,
  r: number
): ExpectedKey {
  return {
    name: `${zone}_${column}_${row}`,
    colrow: `${column}_${row}`,
    zoneColumn: `${zone}_${column}`,
    x,
    y,
    r,
  };
}

// Thumb cluster: anchored 5 mm right and 22 mm below matrix_middle_bottom
// (38, 7) and rotated -15°. The far key sits 22 mm further along that rotated
// row direction and is splayed by another -20°.
const thumbNear = { x: 38 + 5, y: 7 - 22, r: -15 };
const thumbFar = {
  x: thumbNear.x + 22 * Math.cos(degrees(-15)),
  y: thumbNear.y + 22 * Math.sin(degrees(-15)),
  r: -15 - 20,
};

/**
 * Engine order: zones, then columns, then rows. Columns are 19 mm apart
 * (`kx`), rows 19 mm apart (`ky`); ring is staggered 4 mm up from pinky and
 * middle another 3 mm up from ring.
 */
export const expectedKeys: ExpectedKey[] = [
  key('matrix', 'pinky', 'bottom', 0, 0, 0),
  key('matrix', 'pinky', 'top', 0, 19, 0),
  key('matrix', 'ring', 'bottom', 19, 4, 0),
  key('matrix', 'ring', 'top', 19, 23, 0),
  key('matrix', 'middle', 'bottom', 38, 7, 0),
  key('matrix', 'middle', 'top', 38, 26, 0),
  key('thumb', 'near', 'cluster', thumbNear.x, thumbNear.y, thumbNear.r),
  key('thumb', 'far', 'cluster', thumbFar.x, thumbFar.y, thumbFar.r),
];

/** Rectangle sizes per outline, as written in the fixture. */
export const outlineRectangles = {
  keycaps: { size: [18, 17], regions: expectedKeys.length },
  _plate: { size: [14, 14], regions: expectedKeys.length },
  // 23 mm squares at 19 mm pitch overlap, so they merge into one region.
  board: { size: [23, 23], regions: 1 },
} as const;

/**
 * Width and height of the union of one rotated rectangle per expected key,
 * computed from the rectangles' corners.
 */
export const expectedRectangleUnionSize = (
  size: readonly [number, number] | readonly number[]
): { width: number; height: number } => {
  const xs: number[] = [];
  const ys: number[] = [];
  for (const { x, y, r } of expectedKeys) {
    const cos = Math.cos(degrees(r));
    const sin = Math.sin(degrees(r));
    for (const dx of [-size[0] / 2, size[0] / 2]) {
      for (const dy of [-size[1] / 2, size[1] / 2]) {
        xs.push(x + dx * cos - dy * sin);
        ys.push(y + dx * sin + dy * cos);
      }
    }
  }
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
};
