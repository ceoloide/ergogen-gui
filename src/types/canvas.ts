/**
 * Types for the interactive canvas-based keyboard layout editor.
 * The internal representation follows Ergogen conventions:
 * - Column-first, rows-second organization
 * - Columns grow bottom to top (positive Y is up)
 * - Positions are in units that can be converted to mm
 */

/**
 * Unit system for the grid and measurements
 * - 'U': Standard key unit (19.05mm) - most common for MX switches
 * - 'u': Alternative key unit (19mm) - simpler calculation
 * - 'mm': Raw millimeters
 */
export type GridUnit = 'U' | 'u' | 'mm';

/**
 * Unit conversion constants (all in mm)
 */
export const UNIT_TO_MM: Record<GridUnit, number> = {
  U: 19.05,
  u: 19,
  mm: 1,
};

/**
 * Convert a value from one unit to mm
 */
export function toMM(value: number, unit: GridUnit): number {
  return value * UNIT_TO_MM[unit];
}

/**
 * A single key in the keyboard layout
 */
export interface CanvasKey {
  /** Unique identifier for the key */
  id: string;
  /** X position in the current unit (center of key) */
  x: number;
  /** Y position in the current unit (center of key) */
  y: number;
  /** Width in units (default 1) */
  width: number;
  /** Height in units (default 1) */
  height: number;
  /** Rotation angle in degrees */
  rotation: number;
  /** Rotation origin X (relative to key center) */
  rotationOriginX: number;
  /** Rotation origin Y (relative to key center) */
  rotationOriginY: number;
  /** Key label for display */
  label: string;
  /** Optional column name for Ergogen export */
  column?: string;
  /** Optional row name for Ergogen export */
  row?: string;
  /** Whether this key is mirrored */
  mirrored?: boolean;
}

/**
 * Create a new key with default values
 */
export function createKey(
  id: string,
  x: number,
  y: number,
  overrides?: Partial<CanvasKey>
): CanvasKey {
  return {
    id,
    x,
    y,
    width: 1,
    height: 1,
    rotation: 0,
    rotationOriginX: 0,
    rotationOriginY: 0,
    label: '',
    ...overrides,
  };
}

/**
 * Tool types available in the canvas editor
 */
export type CanvasTool =
  | 'select'
  | 'add'
  | 'move'
  | 'rotate'
  | 'mirror-vertical'
  | 'mirror-horizontal';

/**
 * Selection state for the canvas
 */
export interface SelectionState {
  /** IDs of selected keys */
  selectedKeys: Set<string>;
  /** Whether we're currently drawing a selection rectangle */
  isSelecting: boolean;
  /** Selection rectangle start point (canvas coordinates) */
  selectionStart: { x: number; y: number } | null;
  /** Selection rectangle end point (canvas coordinates) */
  selectionEnd: { x: number; y: number } | null;
}

/**
 * Grid settings for the canvas
 */
export interface GridSettings {
  /** Whether to show the grid */
  visible: boolean;
  /** Whether to snap to grid */
  snap: boolean;
  /** Grid size in the current unit */
  size: number;
  /** Current unit system */
  unit: GridUnit;
}

/**
 * Default grid settings
 */
export const DEFAULT_GRID_SETTINGS: GridSettings = {
  visible: true,
  snap: true,
  size: 1,
  unit: 'U',
};

/**
 * Point in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Check if a point is inside a key
 */
export function isPointInKey(
  point: Point,
  key: CanvasKey,
  unit: GridUnit
): boolean {
  const keyX = toMM(key.x, unit);
  const keyY = toMM(key.y, unit);
  const halfWidth = (key.width * UNIT_TO_MM[unit]) / 2;
  const halfHeight = (key.height * UNIT_TO_MM[unit]) / 2;

  // Transform point to key's local coordinate system
  const dx = point.x - keyX;
  const dy = point.y - keyY;

  // Rotate point back by key's rotation
  const rad = (-key.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;

  // Check if point is within the key's bounds
  return (
    Math.abs(localX) <= halfWidth + 0.1 && Math.abs(localY) <= halfHeight + 0.1
  );
}

/**
 * Snap a value to the grid
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Generate a unique key ID
 */
export function generateKeyId(): string {
  return `key_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
