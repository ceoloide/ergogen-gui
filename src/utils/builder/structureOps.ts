/**
 * Structural builder edits (columns, rows, zones, mirroring) expressed as
 * text-preserving patch operations. Each function returns the operations or
 * the reason the edit is not offered for this configuration.
 */
import type { Layout } from './pointsPreview';
import type { PatchOperation } from './yamlPatch';

export type StructureEdit =
  | { ok: true; operations: PatchOperation[]; select?: string }
  | { ok: false; reason: string };

type Plain = Record<string, unknown>;

const asObject = (value: unknown): Plain | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Plain)
    : undefined;

const zoneConfig = (layout: Layout, zone: string) =>
  asObject(asObject(layout.canonicalPoints.zones)?.[zone]);

const uniqueName = (prefix: string, taken: string[]) => {
  for (let index = 1; ; index++) {
    const name = `${prefix}${index}`;
    if (!taken.includes(name)) return name;
  }
};

const keyName = (zone: string, column: string, row: string) =>
  [zone, column, row].filter((part) => part !== 'default').join('_');

export const addColumn = (
  layout: Layout,
  zone: string,
  afterColumn: string
): StructureEdit => {
  const columns = asObject(zoneConfig(layout, zone)?.columns);
  if (!columns || !Object.keys(columns).length) {
    return {
      ok: false,
      reason:
        'This zone has no named columns; add a "columns" map in YAML first.',
    };
  }
  const name = uniqueName('col', Object.keys(columns));
  const firstRow =
    layout.zones.find((candidate) => candidate.name === zone)?.rows[0] ??
    'default';
  return {
    ok: true,
    operations: [
      {
        type: 'set',
        path: ['points', 'zones', zone, 'columns', name],
        value: null,
        after: afterColumn,
      },
    ],
    select: keyName(zone, name, firstRow),
  };
};

export const deleteColumn = (
  layout: Layout,
  zone: string,
  column: string
): StructureEdit => {
  const columns = asObject(zoneConfig(layout, zone)?.columns);
  if (!columns || !(column in columns)) {
    return { ok: false, reason: 'This column is not written in the config.' };
  }
  if (Object.keys(columns).length < 2) {
    return { ok: false, reason: 'A zone needs at least one column.' };
  }
  return {
    ok: true,
    operations: [
      { type: 'delete', path: ['points', 'zones', zone, 'columns', column] },
    ],
  };
};

export const addRow = (layout: Layout, zone: string): StructureEdit => {
  const rows = asObject(zoneConfig(layout, zone)?.rows);
  if (!rows || !Object.keys(rows).length) {
    return {
      ok: false,
      reason:
        'This zone has no zone-wide rows; add a "rows" map in YAML first.',
    };
  }
  const allRows =
    layout.zones.find((candidate) => candidate.name === zone)?.rows ?? [];
  const name = uniqueName('row', allRows);
  const lastRow = Object.keys(rows)[Object.keys(rows).length - 1];
  const firstColumn =
    layout.zones.find((candidate) => candidate.name === zone)?.columns[0] ??
    'default';
  return {
    ok: true,
    operations: [
      {
        type: 'set',
        path: ['points', 'zones', zone, 'rows', name],
        value: null,
        after: lastRow,
      },
    ],
    select: keyName(zone, firstColumn, name),
  };
};

export const deleteRow = (
  layout: Layout,
  zone: string,
  row: string
): StructureEdit => {
  const rows = asObject(zoneConfig(layout, zone)?.rows);
  if (!rows || !(row in rows)) {
    return {
      ok: false,
      reason: 'This row is defined inside a column; remove it in YAML.',
    };
  }
  if (Object.keys(rows).length < 2) {
    return { ok: false, reason: 'A zone needs at least one row.' };
  }
  return {
    ok: true,
    operations: [
      { type: 'delete', path: ['points', 'zones', zone, 'rows', row] },
    ],
  };
};

const bounds = (layout: Layout) => {
  const keys = layout.keys.filter((key) => !key.mirrored);
  return {
    minX: Math.min(...keys.map((key) => key.x)),
    maxX: Math.max(...keys.map((key) => key.x)),
    minY: Math.min(...keys.map((key) => key.y)),
  };
};

const round = (value: number) => Math.round(value * 2) / 2;

export const addZone = (layout: Layout): StructureEdit => {
  const name = uniqueName(
    'zone',
    layout.zones.map((zone) => zone.name)
  );
  const { maxX, minY } = bounds(layout);
  return {
    ok: true,
    operations: [
      {
        type: 'set',
        path: ['points', 'zones', name],
        value: {
          anchor: { shift: [round(maxX + 40), round(minY)] },
          columns: { left: null, right: null },
          rows: { bottom: null, top: null },
        },
      },
    ],
    select: `${name}_left_bottom`,
  };
};

/**
 * A three-key thumb fan below the last column of `zone`, anchored to that
 * column's bottom key so it follows the matrix when the matrix moves.
 */
export const addThumbCluster = (
  layout: Layout,
  zone: string
): StructureEdit => {
  const zoneLayout = layout.zones.find((candidate) => candidate.name === zone);
  if (!zoneLayout) return { ok: false, reason: 'Select a key first.' };
  const column = zoneLayout.columns[zoneLayout.columns.length - 1];
  const anchorKey = layout.keys.find(
    (key) =>
      !key.mirrored &&
      !key.skipped &&
      key.zone === zone &&
      key.column === column &&
      key.row === zoneLayout.rows[0]
  );
  if (!anchorKey) {
    return {
      ok: false,
      reason: 'The last column has no bottom key to anchor to.',
    };
  }
  const name = layout.zones.some((candidate) => candidate.name === 'thumb')
    ? uniqueName(
        'thumb',
        layout.zones.map((candidate) => candidate.name)
      )
    : 'thumb';
  return {
    ok: true,
    operations: [
      {
        type: 'set',
        path: ['points', 'zones', name],
        value: {
          anchor: { ref: anchorKey.name, shift: [-19, -24] },
          columns: {
            near: null,
            home: { key: { splay: -15, origin: [-9.5, -9.5] } },
            far: { key: { splay: -15, origin: [-9.5, -9.5] } },
          },
          rows: { cluster: null },
        },
      },
    ],
    select: `${name}_near_cluster`,
  };
};

export const deleteZone = (layout: Layout, zone: string): StructureEdit => {
  if (layout.zones.length < 2) {
    return { ok: false, reason: 'The layout needs at least one zone.' };
  }
  return {
    ok: true,
    operations: [{ type: 'delete', path: ['points', 'zones', zone] }],
  };
};

type MirrorState =
  | { kind: 'off' }
  | { kind: 'reference'; ref: unknown; distance: unknown }
  | { kind: 'custom' };

export const mirrorState = (layout: Layout): MirrorState => {
  const mirror = layout.canonicalPoints.mirror;
  if (mirror === undefined || mirror === null) return { kind: 'off' };
  const object = asObject(mirror);
  if (
    object &&
    Object.keys(object).every((key) =>
      ['ref', 'distance', 'shift'].includes(key)
    )
  ) {
    return {
      kind: 'reference',
      ref: object.ref,
      distance: object.distance ?? 0,
    };
  }
  return { kind: 'custom' };
};

/** Mirrors the whole board around an axis just right of the rightmost key. */
export const enableMirror = (layout: Layout): StructureEdit => {
  const keys = layout.keys.filter((key) => !key.mirrored && !key.skipped);
  if (!keys.length)
    return { ok: false, reason: 'There are no keys to mirror.' };
  const rightmost = keys.reduce((best, key) => (key.x > best.x ? key : best));
  return {
    ok: true,
    operations: [
      {
        type: 'set',
        path: ['points', 'mirror'],
        value: { ref: rightmost.name, distance: 40 },
      },
    ],
  };
};

export const disableMirror = (): StructureEdit => ({
  ok: true,
  operations: [{ type: 'delete', path: ['points', 'mirror'] }],
});
