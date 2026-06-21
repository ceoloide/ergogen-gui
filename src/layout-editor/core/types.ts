/**
 * Core types aligned with Ergogen's internal data structures.
 *
 * These types mirror Ergogen's configuration and runtime structures
 * to ensure consistency between the visual editor and Ergogen output.
 */

import { Point, PointMeta } from './Point';

/**
 * Standard key unit in millimeters (1U = 19.05mm for MX switches).
 * This is Ergogen's default 'U' unit.
 */
export const UNIT_U = 19.05;

/**
 * Ergogen default values matching src/units.js
 */
export const ERGOGEN_DEFAULTS = {
  U: UNIT_U,
  u: 19,
  cx: 18,
  cy: 17,
  stagger: 0,
  spread: 19, // u
  splay: 0,
  height: 18, // u-1 = 18
  width: 18, // u-1 = 18
  padding: 19, // u
  autobind: 10,
} as const;

/**
 * Key configuration matching Ergogen's key-level settings.
 * These properties can be inherited from zone -> column -> row -> key.
 */
export interface KeyConfig {
  /** Vertical offset (stagger) - inheritable */
  stagger?: number;
  /** Horizontal offset between columns (spread) - inheritable */
  spread?: number;
  /** Column rotation in degrees (splay) - inheritable */
  splay?: number;
  /** Origin for splay rotation [x, y] in mm - inheritable */
  origin?: [number, number];
  /** Key-level pre-rotation (orient) - inheritable */
  orient?: number;
  /** Key-level position adjustment [x, y] - inheritable */
  shift?: [number, number];
  /** Key-level post-rotation (rotate) - inheritable */
  rotate?: number;
  /** Key width in mm - inheritable */
  width?: number;
  /** Key height in mm - inheritable */
  height?: number;
  /** Distance to next key in column (padding) - inheritable */
  padding?: number;
  /** Whether to skip this key in output */
  skip?: boolean;
  /** Asymmetry setting for mirroring */
  asym?: 'source' | 'clone' | 'both';
  /** Auto-binding distance */
  autobind?: number;
  /** Manual bind values [top, right, bottom, left] */
  bind?: number | [number, number] | [number, number, number, number];
  /** Any additional custom properties */
  [key: string]: unknown;
}

/**
 * Extended Point metadata for editor use.
 * Combines Ergogen's PointMeta with editor-specific properties.
 */
interface EditorPointMeta extends PointMeta {
  /** Unique ID for React key purposes */
  id: string;
  /** Display color in the editor */
  color?: string;
  /** Whether this is a mirror of another point */
  mirrorOf?: string;
  /** Selection state in editor */
  selected?: boolean;
}

/**
 * Editor-specific Point class with additional functionality.
 */
export class EditorPoint extends Point {
  /**
   * Typed metadata for editor use.
   * Override of Point.meta with EditorPointMeta type.
   */
  override meta: EditorPointMeta;

  constructor(
    x: number | [number, number] = 0,
    y: number = 0,
    r: number = 0,
    meta: EditorPointMeta = { id: '' }
  ) {
    super(x, y, r, meta);
    this.meta = meta;
  }

  /**
   * Creates a deep clone with editor metadata.
   */
  override clone(): EditorPoint {
    const cloned = super.clone();
    return new EditorPoint(
      cloned.x,
      cloned.y,
      cloned.r,
      cloned.meta as EditorPointMeta
    );
  }

  /**
   * Gets the display width for this point.
   */
  get width(): number {
    return this.meta.width ?? ERGOGEN_DEFAULTS.width;
  }

  /**
   * Gets the display height for this point.
   */
  get height(): number {
    return this.meta.height ?? ERGOGEN_DEFAULTS.height;
  }

  /**
   * Gets the unique identifier.
   */
  get id(): string {
    return this.meta.id;
  }

  /**
   * Gets the display name.
   */
  get name(): string {
    return this.meta.name ?? '';
  }
}
