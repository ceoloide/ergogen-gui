/**
 * Core types for the Ergogen Layout Editor
 * These types represent the visual representation of a keyboard layout
 * that can be converted to/from Ergogen YAML configuration.
 */

/**
 * Represents a single key in the layout editor.
 * Keys are the atomic units of the visual editor.
 */
export interface EditorKey {
  /** Unique identifier for the key */
  id: string;
  /** X position in editor units (1 unit = 19.05mm, standard key pitch) */
  x: number;
  /** Y position in editor units */
  y: number;
  /** Width in editor units (default: 1) */
  width: number;
  /** Height in editor units (default: 1) */
  height: number;
  /** Rotation angle in degrees */
  rotation: number;
  /** X coordinate of rotation origin (relative to key center) */
  rotationOriginX: number;
  /** Y coordinate of rotation origin (relative to key center) */
  rotationOriginY: number;
  /** Name/label for the key (used in ergogen output) */
  name: string;
  /** Column name (for ergogen zone structure) */
  column: string;
  /** Row name (for ergogen zone structure) */
  row: string;
  /** Zone this key belongs to */
  zone: string;
  /** Key color for visual distinction */
  color: string;
  /** Whether this key is mirrored */
  mirrored: boolean;
  /** Original key ID if this is a mirrored copy */
  mirrorOf?: string;
  /** Additional ergogen-specific properties */
  ergogenProps: Record<string, unknown>;
}

/**
 * Represents a column in an ergogen zone.
 * Columns contain multiple keys (one per row).
 */
export interface EditorColumn {
  /** Column name (e.g., 'pinky', 'ring', 'middle') */
  name: string;
  /** Horizontal spread between this column and the previous (in mm) */
  spread: number;
  /** Stagger offset from the default row position (in mm) */
  stagger: number;
  /** Splay angle in degrees (rotation relative to previous column) */
  splay: number;
  /** Origin point for splay rotation [x, y] in mm */
  splayOrigin: [number, number];
  /** Additional column-specific ergogen properties */
  ergogenProps: Record<string, unknown>;
}

/**
 * Represents a row in an ergogen zone.
 */
export interface EditorRow {
  /** Row name (e.g., 'bottom', 'home', 'top') */
  name: string;
  /** Additional row-specific ergogen properties */
  ergogenProps: Record<string, unknown>;
}

/**
 * Represents a zone in the ergogen configuration.
 * Zones are collections of keys organized in columns and rows.
 */
export interface EditorZone {
  /** Zone name (e.g., 'matrix', 'thumbfan') */
  name: string;
  /** Anchor settings for the zone */
  anchor: {
    /** Reference point (e.g., 'matrix_inner_bottom') */
    ref?: string;
    /** X shift from anchor reference */
    shiftX: number;
    /** Y shift from anchor reference */
    shiftY: number;
    /** Rotation at anchor point */
    rotate: number;
  };
  /** Columns in this zone */
  columns: EditorColumn[];
  /** Rows in this zone */
  rows: EditorRow[];
  /** Keys in this zone */
  keys: string[]; // Array of key IDs
  /** Zone-level rotation */
  rotate: number;
  /** Additional zone-specific ergogen properties */
  ergogenProps: Record<string, unknown>;
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
 */
export const DEFAULT_KEY: Omit<EditorKey, 'id'> = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
  rotation: 0,
  rotationOriginX: 0,
  rotationOriginY: 0,
  name: '',
  column: '',
  row: '',
  zone: '',
  color: '#cccccc',
  mirrored: false,
  ergogenProps: {},
};

/**
 * Default values for creating new columns.
 */
export const DEFAULT_COLUMN: Omit<EditorColumn, 'name'> = {
  spread: 19.05, // Standard key pitch
  stagger: 0,
  splay: 0,
  splayOrigin: [0, 0],
  ergogenProps: {},
};

/**
 * Default values for creating new rows.
 */
export const DEFAULT_ROW: Omit<EditorRow, 'name'> = {
  ergogenProps: {},
};

/**
 * Default values for creating new zones.
 */
export const DEFAULT_ZONE: Omit<EditorZone, 'name'> = {
  anchor: {
    shiftX: 0,
    shiftY: 0,
    rotate: 0,
  },
  columns: [],
  rows: [],
  keys: [],
  rotate: 0,
  ergogenProps: {},
};

/**
 * Standard key unit in millimeters (1U = 19.05mm)
 */
export const KEY_UNIT_MM = 19.05;

/**
 * Pixels per unit for canvas rendering
 */
export const PIXELS_PER_UNIT = 54;
