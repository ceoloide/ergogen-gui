/**
 * Where builder edits go in an Ergogen configuration, and where the current
 * value of a key parameter comes from.
 *
 * Ergogen builds each key from five levels, later ones winning: `points.key`,
 * the zone's `key`, the column's `key`, the zone-wide row and the column's own
 * row. A builder "scope" names one of those levels.
 */
import type { Layout, LayoutKey } from './pointsPreview';

export type Scope = 'all' | 'zone' | 'column' | 'row' | 'key';

export const SCOPES: { id: Scope; label: string }[] = [
  { id: 'all', label: 'All keys' },
  { id: 'zone', label: 'Zone' },
  { id: 'column', label: 'Column' },
  { id: 'row', label: 'Row' },
  { id: 'key', label: 'This key' },
];

export type NumericProperty =
  | 'stagger'
  | 'spread'
  | 'splay'
  | 'padding'
  | 'width'
  | 'height'
  | 'rotate';

type Property = NumericProperty | 'skip';

export const PROPERTY_LABELS: Record<Property, string> = {
  stagger: 'Stagger',
  spread: 'Spread',
  splay: 'Splay',
  padding: 'Padding',
  width: 'Width',
  height: 'Height',
  rotate: 'Rotate',
  skip: 'Skip',
};

export const PROPERTY_UNITS: Record<Property, string> = {
  stagger: 'mm',
  spread: 'mm',
  splay: '°',
  padding: 'mm',
  width: 'mm',
  height: 'mm',
  rotate: '°',
  skip: '',
};

/**
 * The engine reads these from the first key of each column only, so they are
 * only meaningful for a whole column or more.
 */
export const COLUMN_PROPERTIES: NumericProperty[] = [
  'stagger',
  'spread',
  'splay',
];
export const KEY_PROPERTIES: NumericProperty[] = [
  'width',
  'height',
  'padding',
  'rotate',
];

const PRIORITY: Record<Scope | 'default', number> = {
  default: 0,
  all: 1,
  zone: 2,
  column: 3,
  row: 4,
  key: 5,
};

type KeyAddress = Pick<LayoutKey, 'zone' | 'column' | 'row'>;

type Plain = Record<string, unknown>;

const child = (value: unknown, key: string): unknown =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Plain)[key]
    : undefined;

const zoneConfig = (layout: Layout, zone: string) =>
  child(child(layout.canonicalPoints, 'zones'), zone);

/** The configuration path that holds `property` at `scope` for `key`. */
export const scopePath = (
  scope: Scope,
  key: KeyAddress,
  property: Property
): string[] => {
  const zone = ['points', 'zones', key.zone];
  switch (scope) {
    case 'all':
      return ['points', 'key', property];
    case 'zone':
      return [...zone, 'key', property];
    case 'column':
      return [...zone, 'columns', key.column, 'key', property];
    case 'row':
      return [...zone, 'rows', key.row, property];
    case 'key':
      return [...zone, 'columns', key.column, 'rows', key.row, property];
  }
};

/** Values written at each level, in the canonical (preprocessed) config. */
const levelValues = (layout: Layout, key: KeyAddress, property: Property) => {
  const zone = zoneConfig(layout, key.zone);
  const column = child(child(zone, 'columns'), key.column);
  return {
    all: child(child(layout.canonicalPoints, 'key'), property),
    zone: child(child(zone, 'key'), property),
    column: child(child(column, 'key'), property),
    row: child(child(child(zone, 'rows'), key.row), property),
    key: child(child(child(column, 'rows'), key.row), property),
  } satisfies Record<Scope, unknown>;
};

type Provenance = {
  scope: Scope | 'default';
  /** The value as written (after preprocessing), e.g. `cy/4` or `5`. */
  raw: unknown;
};

/** The level whose value the engine used for `property` of `key`. */
export const provenance = (
  layout: Layout,
  key: KeyAddress,
  property: Property
): Provenance => {
  const values = levelValues(layout, key, property);
  for (const scope of ['key', 'row', 'column', 'zone', 'all'] as Scope[]) {
    const value = values[scope];
    if (value !== undefined && value !== null) return { scope, raw: value };
  }
  return { scope: 'default', raw: undefined };
};

/** The value written at exactly `scope`, if any. */
export const valueAtScope = (
  layout: Layout,
  key: KeyAddress,
  property: Property,
  scope: Scope
): unknown => {
  const value = levelValues(layout, key, property)[scope];
  return value === null ? undefined : value;
};

/**
 * The value `key` would get from the levels broader (of lower priority) than
 * `scope`, that is, what removing the value at `scope` would fall back to,
 * ignoring narrower levels.
 */
export const inheritedValue = (
  layout: Layout,
  key: KeyAddress,
  property: Property,
  scope: Scope
): unknown => {
  const values = levelValues(layout, key, property);
  for (const level of ['key', 'row', 'column', 'zone', 'all'] as Scope[]) {
    if (PRIORITY[level] >= PRIORITY[scope]) continue;
    const value = values[level];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
};

/** True when a higher-priority level hides a value written at `scope`. */
export const isOverridden = (
  layout: Layout,
  key: KeyAddress,
  property: Property,
  scope: Scope
) => PRIORITY[provenance(layout, key, property).scope] > PRIORITY[scope];

/**
 * Scopes where writing `property` is meaningful and safe, with a reason for
 * each one that is not.
 */
export const scopeAvailability = (
  layout: Layout,
  key: KeyAddress,
  property: Property
): Record<Scope, string | null> => {
  const columnOnly = (COLUMN_PROPERTIES as Property[]).includes(property);
  const zoneRows = child(zoneConfig(layout, key.zone), 'rows');
  const hasZoneRows =
    zoneRows !== null &&
    typeof zoneRows === 'object' &&
    Object.keys(zoneRows as Plain).length > 0;
  // Writing a zone-wide row that only one column defines would add that row
  // to every column of the zone. Without zone-wide rows, a key's row is the
  // implicit "default" one, and writing it would also add a "default" key to
  // the columns that list their own rows.
  const columns = child(zoneConfig(layout, key.zone), 'columns');
  const someColumnHasRows = Object.values(
    columns && typeof columns === 'object' ? (columns as Plain) : {}
  ).some((column) => {
    const rows = child(column, 'rows');
    return (
      rows !== null &&
      typeof rows === 'object' &&
      Object.keys(rows as Plain).length > 0
    );
  });
  let rowReason: string | null = null;
  if (hasZoneRows) {
    if (!Object.prototype.hasOwnProperty.call(zoneRows, key.row)) {
      rowReason = 'This row is defined inside one column only.';
    }
  } else if (key.row !== 'default') {
    rowReason = 'This row is defined inside one column only.';
  } else if (someColumnHasRows) {
    rowReason =
      'Other columns of this zone list their own rows, so a zone-wide row would add keys to them.';
  }
  return {
    all: null,
    zone: null,
    column: null,
    row: columnOnly
      ? 'Ergogen reads this from the first key of each column.'
      : rowReason,
    key: columnOnly
      ? 'Ergogen reads this from the first key of each column.'
      : null,
  };
};

/** Keys an edit at `scope` reaches, for highlighting. */
export const keysInScope = (
  layout: Layout,
  selected: LayoutKey,
  scope: Scope
): Set<string> => {
  const names = layout.keys
    .filter((key) => {
      if (key.mirrored) return false;
      switch (scope) {
        case 'all':
          return true;
        case 'zone':
          return key.zone === selected.zone;
        case 'column':
          return key.zone === selected.zone && key.column === selected.column;
        case 'row':
          return key.zone === selected.zone && key.row === selected.row;
        case 'key':
          return key.name === selected.name;
      }
    })
    .map((key) => key.name);
  return new Set(names);
};

/**
 * Parses a field: plain numbers become numbers, anything else is kept as an
 * Ergogen math expression (such as `u/4` or `-cy`) for the engine to check.
 */
export const parseFieldValue = (input: string): number | string | null => {
  const trimmed = input.trim();
  if (trimmed === '') return null;
  const number = Number(trimmed);
  return Number.isFinite(number) && /^[-+]?(\d+\.?\d*|\.\d+)$/.test(trimmed)
    ? number
    : trimmed;
};

export const formatNumber = (value: number, digits = 2) => {
  if (!Number.isFinite(value)) return String(value);
  const rounded = Number(value.toFixed(digits));
  return String(Object.is(rounded, -0) ? 0 : rounded);
};

/** The source key a mirrored key stands for, or the key itself. */
export const sourceKey = (layout: Layout, key: LayoutKey): LayoutKey =>
  (key.mirrored &&
    layout.keys.find(
      (candidate) => !candidate.mirrored && candidate.name === key.source
    )) ||
  key;

/** The keys of one column in layout order, bottom row first. */
export const columnKeys = (layout: Layout, zone: string, column: string) =>
  layout.keys.filter(
    (key) => !key.mirrored && key.zone === zone && key.column === column
  );

const isScalar = (value: unknown) =>
  typeof value === 'number' || typeof value === 'string';

/**
 * The `points.zones.<zone>.anchor` written in the config, when the builder
 * can show and edit it: a map of a point name `ref`, a `shift` and a
 * `rotate` written as numbers or expressions.
 */
export const zoneAnchor = (
  layout: Layout,
  zone: string
): { anchor: Plain | null; reason: string | null } => {
  const anchor = child(zoneConfig(layout, zone), 'anchor');
  if (anchor === undefined || anchor === null) {
    return { anchor: null, reason: null };
  }
  if (Array.isArray(anchor)) {
    return {
      anchor: null,
      reason: 'This zone uses a list of anchors; edit it in YAML.',
    };
  }
  if (typeof anchor !== 'object') {
    return {
      anchor: null,
      reason: `This zone is anchored to ${String(anchor)}; edit the anchor in YAML.`,
    };
  }
  const fields = anchor as Plain;
  const shift = fields.shift;
  const editable =
    Object.keys(fields).every((field) =>
      ['ref', 'shift', 'rotate'].includes(field)
    ) &&
    (fields.ref === undefined || typeof fields.ref === 'string') &&
    (fields.rotate === undefined || isScalar(fields.rotate)) &&
    (shift === undefined ||
      isScalar(shift) ||
      (Array.isArray(shift) && shift.length <= 2 && shift.every(isScalar)));
  if (!editable) {
    return {
      anchor: null,
      reason:
        'This zone anchor uses fields the builder cannot show (such as aggregate, orient or a structured reference); edit it in YAML.',
    };
  }
  return { anchor: fields, reason: null };
};

/** The raw `[x, y]` of an anchor shift, defaulting to zeros. */
export const anchorShift = (anchor: Plain | null): [unknown, unknown] => {
  const shift = anchor?.shift;
  if (Array.isArray(shift)) return [shift[0] ?? 0, shift[1] ?? 0];
  if (typeof shift === 'number' || typeof shift === 'string') {
    return [shift, shift];
  }
  return [0, 0];
};

/** Rotates `[x, y]` by `degrees` counterclockwise (Ergogen's y points up). */
export const rotateVector = (
  degrees: number,
  [x, y]: [number, number]
): [number, number] => {
  const radians = (degrees * Math.PI) / 180;
  return [
    x * Math.cos(radians) - y * Math.sin(radians),
    x * Math.sin(radians) + y * Math.cos(radians),
  ];
};

type ColumnFrame =
  | {
      ok: true;
      /** The column's first key, whose values the engine uses. */
      first: LayoutKey;
      /**
       * The direction stagger (y) and spread (x) move this column in: the
       * zone anchor's rotation and the splay of earlier columns, but not the
       * column's own splay or its first key's orient and rotate.
       */
      axisAngle: number;
      /** The point the column's own splay turns it around. */
      pivot: [number, number];
    }
  | { ok: false; reason: string };

/**
 * How Ergogen places a column, recovered from its first key: the engine
 * moves the column anchor by stagger and spread before it applies any
 * rotation, adds the column's splay around `origin`, then orients, shifts and
 * rotates the first key.
 */
export const columnFrame = (
  layout: Layout,
  zone: string,
  column: string
): ColumnFrame => {
  const first = columnKeys(layout, zone, column)[0];
  if (!first) return { ok: false, reason: 'This column has no keys.' };
  if (first.adjusted) {
    return {
      ok: false,
      reason: `The first key of column ${column} uses adjust, so a handle could not follow it; use the fields instead.`,
    };
  }
  const { splay, orient, rotate, shift, origin } = first.params;
  const columnAngle = first.r - orient - rotate;
  const [shiftX, shiftY] = rotateVector(first.r - rotate, shift);
  const [originX, originY] = rotateVector(columnAngle, origin);
  return {
    ok: true,
    first,
    axisAngle: columnAngle - splay,
    pivot: [first.x - shiftX + originX, first.y - shiftY + originY],
  };
};
