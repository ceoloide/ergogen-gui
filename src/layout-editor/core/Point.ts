/**
 * Point class - TypeScript implementation of Ergogen's Point class.
 *
 * This class represents a positioned point in 2D space with rotation,
 * matching the behavior and API of Ergogen's src/point.js
 *
 * A Point has:
 * - x, y: position in millimeters
 * - r: rotation in degrees
 * - meta: object containing all associated metadata
 */

/**
 * Metadata associated with a Point, matching Ergogen's key metadata structure.
 */
export interface PointMeta {
  /** Name of this point (e.g., "matrix_pinky_bottom") */
  name?: string;
  /** Zone this point belongs to */
  zone?: ZoneReference;
  /** Column this point belongs to */
  col?: ColumnReference;
  /** Row name */
  row?: string;
  /** Combined column/row identifier */
  colrow?: string;
  /** Whether this point is mirrored */
  mirrored?: boolean;
  /** Asymmetry setting: 'source', 'clone', or 'both' */
  asym?: 'source' | 'clone' | 'both';
  /** Whether to skip this point in output */
  skip?: boolean;

  // Key-level properties (from Ergogen's key inheritance)
  /** Vertical offset (stagger) in mm */
  stagger?: number;
  /** Horizontal offset (spread) in mm */
  spread?: number;
  /** Column rotation (splay) in degrees */
  splay?: number;
  /** Origin for splay rotation [x, y] in mm */
  origin?: [number, number];
  /** Key-level rotation offset in degrees */
  orient?: number;
  /** Key-level shift [x, y] in mm */
  shift?: [number, number];
  /** Key-level rotation in degrees */
  rotate?: number;
  /** Key width in mm */
  width?: number;
  /** Key height in mm */
  height?: number;
  /** Padding to next key in mm */
  padding?: number;
  /** Autobind distance in mm */
  autobind?: number;
  /** Bind values [top, right, bottom, left] in mm */
  bind?: [number, number, number, number];

  // Additional custom properties
  [key: string]: unknown;
}

/**
 * Reference to a zone configuration.
 */
interface ZoneReference {
  name: string;
  columns?: Record<string, unknown>;
  rows?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Reference to a column configuration.
 */
interface ColumnReference {
  name: string;
  [key: string]: unknown;
}

/**
 * Deep copies a value, handling undefined.
 */
function deepcopy<T>(value: T): T {
  if (value === undefined) return undefined as T;
  return JSON.parse(JSON.stringify(value));
}

/**
 * Rotates a 2D point around an origin.
 * Uses the same convention as makerjs: angle in degrees, counter-clockwise.
 */
function rotatePoint2D(
  point: [number, number],
  angle: number,
  origin: [number, number] = [0, 0]
): [number, number] {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = point[0] - origin[0];
  const dy = point[1] - origin[1];
  return [origin[0] + dx * cos - dy * sin, origin[1] + dx * sin + dy * cos];
}

/**
 * Point class representing a positioned point with rotation.
 * Matches Ergogen's Point API for consistency.
 */
export class Point {
  /** X position in mm */
  x: number;
  /** Y position in mm */
  y: number;
  /** Rotation in degrees */
  r: number;
  /** Metadata associated with this point */
  meta: PointMeta;

  /**
   * Creates a new Point.
   *
   * @param x - X position or [x, y] array
   * @param y - Y position (ignored if x is array)
   * @param r - Rotation in degrees
   * @param meta - Metadata object
   */
  constructor(
    x: number | [number, number] = 0,
    y: number = 0,
    r: number = 0,
    meta: PointMeta = {}
  ) {
    if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
      this.r = 0;
      this.meta = {};
    } else {
      this.x = x;
      this.y = y;
      this.r = r;
      this.meta = meta;
    }
  }

  /**
   * Gets the position as [x, y] array.
   */
  get p(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * Sets the position from [x, y] array.
   */
  set p(val: [number, number]) {
    [this.x, this.y] = val;
  }

  /**
   * Shifts this point by the given offset.
   *
   * @param s - Shift amount [x, y]
   * @param relative - If true, shift is relative to current rotation
   * @param resist - If true, ignore mirroring for shift direction
   * @returns This point for chaining
   */
  shift(
    s: [number, number],
    relative: boolean = true,
    resist: boolean = false
  ): this {
    const shiftX = !resist && this.meta.mirrored ? -s[0] : s[0];
    let shifted: [number, number] = [shiftX, s[1]];

    if (relative) {
      shifted = rotatePoint2D(shifted, this.r);
    }

    this.x += shifted[0];
    this.y += shifted[1];
    return this;
  }

  /**
   * Rotates this point around an origin.
   *
   * @param angle - Rotation angle in degrees
   * @param origin - Origin point [x, y] for rotation
   * @param resist - If true, ignore mirroring for rotation direction
   * @returns This point for chaining
   */
  rotate(
    angle: number,
    origin: [number, number] | false = [0, 0],
    resist: boolean = false
  ): this {
    const effectiveAngle = !resist && this.meta.mirrored ? -angle : angle;

    if (origin !== false) {
      this.p = rotatePoint2D(this.p, effectiveAngle, origin);
    }

    this.r += effectiveAngle;
    return this;
  }

  /**
   * Mirrors this point across a vertical axis.
   *
   * @param x - X coordinate of the mirror axis
   * @returns This point for chaining
   */
  mirror(x: number): this {
    this.x = 2 * x - this.x;
    this.r = -this.r;
    return this;
  }

  /**
   * Creates a deep clone of this point.
   */
  clone(): Point {
    return new Point(this.x, this.y, this.r, deepcopy(this.meta));
  }

  /**
   * Calculates the angle from this point to another.
   *
   * @param other - Target point
   * @returns Angle in degrees
   */
  angle(other: Point): number {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return -Math.atan2(dx, dy) * (180 / Math.PI);
  }

  /**
   * Checks if this point equals another.
   *
   * @param other - Point to compare
   * @returns True if equal
   */
  equals(other: Point): boolean {
    return (
      this.x === other.x &&
      this.y === other.y &&
      this.r === other.r &&
      JSON.stringify(this.meta) === JSON.stringify(other.meta)
    );
  }

  /**
   * Returns a rectangle positioned at this point.
   * The rectangle is centered on the point.
   *
   * @param size - Size of the rectangle (width and height)
   * @returns Array of corner points [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
   */
  rect(size: number = 14): [number, number][] {
    const halfSize = size / 2;
    // Corners relative to center, before rotation
    const corners: [number, number][] = [
      [-halfSize, -halfSize],
      [halfSize, -halfSize],
      [halfSize, halfSize],
      [-halfSize, halfSize],
    ];

    // Rotate and translate each corner
    return corners.map((corner) => {
      const rotated = rotatePoint2D(corner, this.r, [0, 0]);
      return [rotated[0] + this.x, rotated[1] + this.y];
    });
  }
}
