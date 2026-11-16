/**
 * Computes only the key layout of a configuration with Ergogen's own modules.
 *
 * It runs the same steps as `ergogen.process` up to the points stage (input
 * interpretation, the four preprocessing passes, units and points), so every
 * position, rotation and size comes from the engine. Outlines, cases and PCBs
 * are skipped: they take most of a full generation and the builder does not
 * draw them. The result is plain data, small enough to post from a worker.
 */
import * as io from 'ergogen/src/io';
import * as prepare from 'ergogen/src/prepare';
import * as unitsLib from 'ergogen/src/units';
import * as pointsLib from 'ergogen/src/points';

/** Effective values of one key, as the engine evaluated them. */
export type KeyParameters = {
  stagger: number;
  spread: number;
  splay: number;
  padding: number;
  width: number;
  height: number;
  rotate: number;
  orient: number;
  shift: [number, number];
  origin: [number, number];
};

export type LayoutKey = {
  name: string;
  x: number;
  y: number;
  r: number;
  width: number;
  height: number;
  zone: string;
  column: string;
  row: string;
  mirrored: boolean;
  /** Present for mirrored keys: the name of the key they mirror. */
  source?: string;
  /** True for keys that `skip: true` removes from the real output. */
  skipped: boolean;
  params: KeyParameters;
};

export type LayoutZone = {
  name: string;
  columns: string[];
  rows: string[];
};

export type Layout = {
  keys: LayoutKey[];
  zones: LayoutZone[];
  units: Record<string, number>;
  /** The `points` section after Ergogen's preprocessing. */
  canonicalPoints: Record<string, unknown>;
  format: string;
};

type EnginePoint = {
  x: number;
  y: number;
  r: number;
  meta: Record<string, unknown> & {
    name: string;
    width: number;
    height: number;
    mirrored?: boolean;
    row: string;
    zone: { name: string };
    col: { name: string };
  };
};

const SKIP_LEVELS = (points: Record<string, unknown>) => {
  const holders: Array<Record<string, unknown> | undefined> = [];
  const asObject = (value: unknown) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : undefined;
  holders.push(asObject(points.key));
  const zones = asObject(points.zones) ?? {};
  for (const zone of Object.values(zones)) {
    const zoneObject = asObject(zone);
    if (!zoneObject) continue;
    holders.push(asObject(zoneObject.key));
    for (const row of Object.values(asObject(zoneObject.rows) ?? {})) {
      holders.push(asObject(row));
    }
    for (const column of Object.values(asObject(zoneObject.columns) ?? {})) {
      const columnObject = asObject(column);
      if (!columnObject) continue;
      holders.push(asObject(columnObject.key));
      for (const row of Object.values(asObject(columnObject.rows) ?? {})) {
        holders.push(asObject(row));
      }
    }
  }
  return holders.filter(
    (holder): holder is Record<string, unknown> => holder !== undefined
  );
};

const deepcopy = <T>(value: T): T =>
  value === undefined ? value : JSON.parse(JSON.stringify(value));

const pair = (value: unknown): [number, number] =>
  Array.isArray(value) ? [Number(value[0]), Number(value[1])] : [0, 0];

const toKey = (point: EnginePoint, skipped: boolean): LayoutKey => {
  const meta = point.meta;
  const mirrored = meta.mirrored === true;
  return {
    name: meta.name,
    x: point.x,
    y: point.y,
    r: point.r,
    width: meta.width,
    height: meta.height,
    zone: meta.zone.name,
    column: meta.col.name,
    row: meta.row,
    mirrored,
    source: mirrored ? meta.name.replace(/^mirror_/, '') : undefined,
    skipped,
    params: {
      stagger: Number(meta.stagger),
      spread: Number(meta.spread),
      splay: Number(meta.splay),
      padding: Number(meta.padding),
      width: Number(meta.width),
      height: Number(meta.height),
      rotate: Number(meta.rotate),
      orient: Number(meta.orient),
      shift: pair(meta.shift),
      origin: pair(meta.origin),
    },
  };
};

/**
 * Lays out the keys of `raw` (YAML, JSON or KLE text). Throws the engine's own
 * error when the configuration is invalid.
 */
export const computeLayout = (raw: string): Layout => {
  const [interpreted, format] = io.interpret(raw, () => {});
  let config = prepare.unnest(interpreted);
  config = prepare.inherit(config);
  config = prepare.parameterize(config);
  config = prepare.concat(config);
  if (!config.points) {
    throw new Error('Input does not contain a points clause!');
  }
  const canonicalPoints = deepcopy(config.points) as Record<string, unknown>;
  const units = unitsLib.parse(config) as Record<string, number>;
  const points = pointsLib.parse(deepcopy(config.points), units) as Record<
    string,
    EnginePoint
  >;
  if (!Object.keys(points).length) {
    throw new Error('Input does not contain any points!');
  }

  const keys = Object.values(points).map((point) => toKey(point, false));

  // Skipped keys are laid out like any other and only dropped at the end, so
  // the same engine pass without their `skip` flags shows where they sit.
  const revealConfig = deepcopy(config.points) as Record<string, unknown>;
  const holders = SKIP_LEVELS(revealConfig).filter(
    (holder) => 'skip' in holder
  );
  if (holders.length) {
    for (const holder of holders) delete holder.skip;
    try {
      const revealed = pointsLib.parse(revealConfig, units) as Record<
        string,
        EnginePoint
      >;
      for (const [name, point] of Object.entries(revealed)) {
        if (!(name in points)) keys.push(toKey(point, true));
      }
    } catch {
      // The real layout above is still correct; only the hints are missing.
    }
  }

  return {
    keys,
    zones: listZones(canonicalPoints, keys),
    units,
    canonicalPoints,
    format,
  };
};

const objectKeys = (value: unknown) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.keys(value)
    : [];

/**
 * Zones, columns and rows in the order the engine lays them out, read from
 * the preprocessed configuration (an absent list means Ergogen's `default`).
 */
const listZones = (
  canonicalPoints: Record<string, unknown>,
  keys: LayoutKey[]
): LayoutZone[] => {
  const zones = (canonicalPoints.zones ?? {}) as Record<
    string,
    Record<string, unknown> | null
  >;
  return Object.entries(zones)
    .map(([name, zone]) => {
      const columnsConfig = (zone?.columns ?? {}) as Record<
        string,
        Record<string, unknown> | null
      >;
      const columns = Object.keys(columnsConfig);
      const rows = objectKeys(zone?.rows);
      for (const column of Object.values(columnsConfig)) {
        for (const row of objectKeys(column?.rows)) {
          if (!rows.includes(row)) rows.push(row);
        }
      }
      return {
        name,
        columns: columns.length ? columns : ['default'],
        rows: rows.length ? rows : ['default'],
      };
    })
    .filter((zone) => keys.some((key) => key.zone === zone.name));
};
