/**
 * Core types for the Ergogen Layout Editor
 *
 * These types align with Ergogen's internal data structures to ensure
 * consistency between the visual editor and Ergogen's output.
 *
 * Key principles:
 * - Point class matches Ergogen's src/point.js
 * - Key metadata follows Ergogen's inheritance model
 * - Zone/Column/Row structures mirror Ergogen's config format
 */

// Import core types
import { EditorPoint, UNIT_U, ERGOGEN_DEFAULTS, type KeyConfig } from './core';

// Re-export ERGOGEN_DEFAULTS for use by other modules
export { ERGOGEN_DEFAULTS };

/**
 * Represents a single key in the layout editor.
 *
 * This interface provides a flat view of key properties for easier
 * manipulation in the editor, while the underlying EditorPoint
 * maintains Ergogen compatibility.
 *
 * Position (x, y) and rotation are in Ergogen's coordinate system (mm, degrees).
 */
export interface EditorKey {
  /** Unique identifier for the key */
  id: string;
  /** X position in mm */
  x: number;
  /** Y position in mm */
  y: number;
  /** Width in mm (default: 18mm = u-1) */
  width: number;
  /** Height in mm (default: 18mm = u-1) */
  height: number;
  /** Rotation angle in degrees */
  rotation: number;
  /** Origin for rotation [x, y] relative to key center in mm */
  rotationOrigin: [number, number];
  /** Name/label for the key (e.g., "matrix_pinky_bottom") */
  name: string;
  /** Column name (for ergogen zone structure) */
  column: string;
  /** Row name (for ergogen zone structure) */
  row: string;
  /** Zone this key belongs to */
  zone: string;
  /** Key color for visual distinction in editor */
  color: string;
  /** Whether this key is mirrored */
  mirrored: boolean;
  /** Original key ID if this is a mirrored copy */
  mirrorOf?: string;

  // Ergogen-specific key properties (matching KeyConfig)
  /** Stagger (vertical offset) applied to this key's column */
  stagger: number;
  /** Spread (horizontal offset) from previous column */
  spread: number;
  /** Splay (rotation) applied to this key's column */
  splay: number;
  /** Padding (vertical spacing) to next key in column */
  padding: number;
  /** Whether to skip this key in output */
  skip: boolean;
  /** Asymmetry setting for mirroring */
  asym: 'source' | 'clone' | 'both';
  /** Additional ergogen-specific properties */
  meta: Record<string, unknown>;
}

/**
 * Represents a column in an ergogen zone.
 *
 * Columns define the horizontal structure of a zone.
 * Key properties at the column level are inherited by all keys in that column.
 */
export interface EditorColumn {
  /** Column name (e.g., 'pinky', 'ring', 'middle') */
  name: string;
  /** Key configuration for this column (inherited by all rows) */
  key: {
    /** Horizontal spread from previous column (in mm) - default: 19mm */
    spread: number;
    /** Vertical stagger offset (in mm) - default: 0 */
    stagger: number;
    /** Splay angle in degrees (cumulative rotation) - default: 0 */
    splay: number;
    /** Origin point for splay rotation [x, y] in mm - default: [0, 0] */
    origin: [number, number];
  };
  /** Row-specific overrides within this column */
  rows: Record<string, Partial<KeyConfig>>;
}

/**
 * Represents a row in an ergogen zone.
 *
 * Rows define the vertical structure of a zone.
 * Key properties at the row level are inherited by all keys in that row.
 */
export interface EditorRow {
  /** Row name (e.g., 'bottom', 'home', 'top') */
  name: string;
  /** Key configuration for this row */
  key: Partial<KeyConfig>;
}

/**
 * Represents a zone in the ergogen configuration.
 *
 * Zones are collections of keys organized in columns and rows.
 * The zone structure mirrors Ergogen's zone configuration.
 */
export interface EditorZone {
  /** Zone name (e.g., 'matrix', 'thumbfan') */
  name: string;
  /** Anchor settings for the zone (position and orientation) */
  anchor: {
    /** Reference point name (e.g., 'matrix_inner_bottom') */
    ref?: string;
    /** Position shift [x, y] in mm */
    shift: [number, number];
    /** Rotation at anchor point in degrees */
    rotate: number;
  };
  /** Zone-level key defaults (inherited by all columns/rows) */
  key: Partial<KeyConfig>;
  /** Columns in this zone (ordered) */
  columns: EditorColumn[];
  /** Rows in this zone (ordered) */
  rows: EditorRow[];
  /** Zone-level rotation applied after keys are positioned */
  rotate: number;
  /** Zone-level mirroring configuration */
  mirror?: {
    /** Reference point for mirror axis */
    ref?: string;
    /** Distance from reference to mirror axis */
    distance: number;
  };
}

/**
 * Mirror configuration for the keyboard layout.
 */
interface EditorMirror {
  /** Whether mirroring is enabled */
  enabled: boolean;
  /** Reference point for mirror axis */
  ref: string;
  /** Distance from reference point to mirror axis (in mm) */
  distance: number;
}

/**
 * Complete layout state for the editor.
 */
export interface EditorLayout {
  /** All keys in the layout */
  keys: Map<string, EditorKey>;
  /** All zones in the layout */
  zones: Map<string, EditorZone>;
  /** Mirror configuration */
  mirror: EditorMirror;
  /** Global rotation applied to all points */
  globalRotation: number;
  /** Ergogen meta settings */
  meta: {
    engine: string;
    author?: string;
    version?: string;
    name?: string;
    [key: string]: unknown;
  };
}

/**
 * Canvas interaction modes.
 */
export type EditorMode = 'select' | 'pan' | 'add-key' | 'rotate' | 'move';

/**
 * Editor viewport state.
 */
export interface EditorViewport {
  /** Zoom level (1 = 100%) */
  zoom: number;
  /** Pan offset X */
  panX: number;
  /** Pan offset Y */
  panY: number;
}

/**
 * Selection state for the editor.
 */
export interface EditorSelection {
  /** Selected key IDs */
  keys: Set<string>;
  /** Selected zone name (for zone-level operations) */
  zone: string | null;
}

/**
 * History entry for undo/redo.
 */
export interface HistoryEntry {
  /** Snapshot of the layout */
  layout: EditorLayout;
  /** Description of the action */
  description: string;
}

/**
 * Complete editor state.
 */
export interface EditorState {
  /** The current layout */
  layout: EditorLayout;
  /** Current editor mode */
  mode: EditorMode;
  /** Current viewport */
  viewport: EditorViewport;
  /** Current selection */
  selection: EditorSelection;
  /** Undo history */
  history: HistoryEntry[];
  /** Current history index */
  historyIndex: number;
  /** Whether there are unsaved changes */
  isDirty: boolean;
  /** Grid settings */
  grid: {
    /** Whether grid is visible */
    visible: boolean;
    /** Grid cell size in mm */
    size: number;
    /** Whether to snap to grid */
    snap: boolean;
  };
}

/**
 * Default values for creating new keys.
 * Uses Ergogen's default values from src/units.js
 */
export const DEFAULT_KEY: Omit<EditorKey, 'id'> = {
  x: 0,
  y: 0,
  width: ERGOGEN_DEFAULTS.width,
  height: ERGOGEN_DEFAULTS.height,
  rotation: 0,
  rotationOrigin: [0, 0],
  name: '',
  column: '',
  row: '',
  zone: '',
  color: '#cccccc',
  mirrored: false,
  stagger: ERGOGEN_DEFAULTS.stagger,
  spread: ERGOGEN_DEFAULTS.spread,
  splay: ERGOGEN_DEFAULTS.splay,
  padding: ERGOGEN_DEFAULTS.padding,
  skip: false,
  asym: 'both',
  meta: {},
};

/**
 * Default values for creating new columns.
 * Uses Ergogen's default values.
 */
export const DEFAULT_COLUMN: Omit<EditorColumn, 'name'> = {
  key: {
    spread: ERGOGEN_DEFAULTS.spread,
    stagger: ERGOGEN_DEFAULTS.stagger,
    splay: ERGOGEN_DEFAULTS.splay,
    origin: [0, 0],
  },
  rows: {},
};

/**
 * Default values for creating new rows.
 */
export const DEFAULT_ROW: Omit<EditorRow, 'name'> = {
  key: {},
};

/**
 * Default values for creating new zones.
 */
export const DEFAULT_ZONE: Omit<EditorZone, 'name'> = {
  anchor: {
    shift: [0, 0],
    rotate: 0,
  },
  key: {},
  columns: [],
  rows: [],
  rotate: 0,
};

/**
 * Standard key unit in millimeters (1U = 19.05mm).
 * This is Ergogen's 'U' unit for precise MX switch spacing.
 */
export const KEY_UNIT_MM = UNIT_U;

/**
 * Pixels per millimeter for canvas rendering.
 * This determines the visual scale of the editor.
 */
const PIXELS_PER_MM = 3;

/**
 * Pixels per unit (U) for canvas rendering.
 * Calculated from KEY_UNIT_MM * PIXELS_PER_MM.
 */
export const PIXELS_PER_UNIT = KEY_UNIT_MM * PIXELS_PER_MM;

/**
 * Converts an EditorKey to an EditorPoint.
 * This is useful when you need to use Point methods (shift, rotate, etc.)
 */
function _keyToPoint(key: EditorKey): EditorPoint {
  return new EditorPoint(key.x, key.y, key.rotation, {
    id: key.id,
    name: key.name,
    zone: { name: key.zone },
    col: { name: key.column },
    row: key.row,
    colrow: `${key.column}_${key.row}`,
    mirrored: key.mirrored,
    width: key.width,
    height: key.height,
    stagger: key.stagger,
    spread: key.spread,
    splay: key.splay,
    origin: key.rotationOrigin,
    padding: key.padding,
    skip: key.skip,
    asym: key.asym,
    color: key.color,
    mirrorOf: key.mirrorOf,
    ...key.meta,
  });
}

/**
 * Converts an EditorPoint to an EditorKey.
 * This extracts the flat properties from Point's metadata.
 */
function _pointToKey(point: EditorPoint): EditorKey {
  const meta = point.meta;
  const {
    id,
    name,
    zone,
    col,
    row,
    mirrored,
    width,
    height,
    stagger,
    spread,
    splay,
    origin,
    padding,
    skip,
    asym,
    color,
    mirrorOf,
    ...rest
  } = meta;

  return {
    id: id || '',
    x: point.x,
    y: point.y,
    rotation: point.r,
    rotationOrigin: (origin as [number, number]) || [0, 0],
    width: width ?? ERGOGEN_DEFAULTS.width,
    height: height ?? ERGOGEN_DEFAULTS.height,
    name: name || '',
    column: (col as { name: string })?.name || '',
    row: (row as string) || '',
    zone: (zone as { name: string })?.name || '',
    color: (color as string) || '#cccccc',
    mirrored: mirrored || false,
    mirrorOf: mirrorOf as string | undefined,
    stagger: stagger ?? ERGOGEN_DEFAULTS.stagger,
    spread: spread ?? ERGOGEN_DEFAULTS.spread,
    splay: splay ?? ERGOGEN_DEFAULTS.splay,
    padding: padding ?? ERGOGEN_DEFAULTS.padding,
    skip: skip || false,
    asym: (asym as 'source' | 'clone' | 'both') || 'both',
    meta: rest,
  };
}
