/**
 * Layout Generator - Calculates key positions using Ergogen's positioning logic.
 *
 * This module implements Ergogen's point generation algorithm to ensure
 * consistency between the visual editor and Ergogen's output.
 *
 * Key concepts from Ergogen:
 * - Points accumulate transforms: spread moves along X, stagger along Y
 * - Splay rotates around an origin point (cumulative)
 * - Padding determines vertical spacing between rows
 * - Zone anchors position the entire zone
 */

import { EditorZone, EditorKey, DEFAULT_KEY, ERGOGEN_DEFAULTS } from '../types';
import { Point } from '../core';

/**
 * Rotation accumulator used for splay calculations.
 * Matches Ergogen's rotation tracking structure.
 */
interface Rotation {
  angle: number;
  origin: [number, number];
}

/**
 * Pushes a rotation to the accumulator.
 * Used for cumulative splay calculations.
 */
function pushRotation(
  rotations: Rotation[],
  angle: number,
  origin: [number, number]
): void {
  if (angle !== 0) {
    rotations.push({ angle, origin });
  }
}

/**
 * Applies all accumulated rotations to a point.
 */
function applyRotations(point: Point, rotations: Rotation[]): void {
  for (const r of rotations) {
    point.rotate(r.angle, r.origin);
  }
}

/**
 * Recalculates key positions for a zone using Ergogen's positioning logic.
 *
 * This implements the same algorithm as Ergogen's render_zone function:
 * 1. Start at zone anchor position
 * 2. For each column:
 *    - Apply spread (horizontal offset from previous column)
 *    - Apply stagger (vertical offset)
 *    - Apply splay (rotation around origin)
 * 3. For each row in column:
 *    - Copy column anchor
 *    - Apply key-level transforms (orient, shift, rotate)
 *    - Move to next row position (padding)
 *
 * @param zone - The zone configuration
 * @param allKeys - Map of all keys in the layout
 * @returns Map of key IDs to their updated properties
 */
export function recalculateZone(
  zone: EditorZone,
  allKeys: Map<string, EditorKey>
): Map<string, Partial<EditorKey>> {
  const updates = new Map<string, Partial<EditorKey>>();

  // Filter keys belonging to this zone
  const zoneKeys = Array.from(allKeys.values()).filter(
    (k) => k.zone === zone.name
  );

  if (zoneKeys.length === 0) {
    return updates;
  }

  // Initialize zone anchor
  const zoneAnchor = new Point(
    zone.anchor.shift[0],
    zone.anchor.shift[1],
    zone.anchor.rotate
  );

  // Rotation accumulator for cumulative splay
  const rotations: Rotation[] = [];

  let isFirstColumn = true;

  // Process each column
  for (const column of zone.columns) {
    // Get column key configuration
    const colKey = column.key;
    const spread = colKey.spread ?? ERGOGEN_DEFAULTS.spread;
    const stagger = colKey.stagger ?? ERGOGEN_DEFAULTS.stagger;
    const splay = colKey.splay ?? ERGOGEN_DEFAULTS.splay;
    const origin = colKey.origin ?? [0, 0];

    // Apply spread (skip for first column)
    if (!isFirstColumn) {
      zoneAnchor.x += spread;
    }

    // Apply stagger
    zoneAnchor.y += stagger;

    // Save column anchor position
    const colAnchor = zoneAnchor.clone();

    // Apply splay rotation (cumulative)
    if (splay !== 0) {
      // Splay origin is relative to current column position
      const splayOrigin: [number, number] = [
        colAnchor.x + origin[0],
        colAnchor.y + origin[1],
      ];
      pushRotation(rotations, splay, splayOrigin);
    }

    // Create running anchor for key positioning
    let runningAnchor = colAnchor.clone();

    // Apply all accumulated rotations
    applyRotations(runningAnchor, rotations);

    // Get default padding for this column
    const defaultPadding = ERGOGEN_DEFAULTS.padding;

    // Process each row in this column
    for (const row of zone.rows) {
      // Find the key at this column/row position
      const key = zoneKeys.find(
        (k) => k.column === column.name && k.row === row.name
      );

      if (!key) {
        // No key at this position, but still advance running anchor
        runningAnchor.shift([0, defaultPadding]);
        continue;
      }

      // Get row-level overrides from column config
      const rowOverrides = column.rows[row.name] || {};

      // Get key-level overrides
      const keyOrient = (rowOverrides.orient as number) ?? 0;
      const keyShift = (rowOverrides.shift as [number, number]) ?? [0, 0];
      const keyRotate = (rowOverrides.rotate as number) ?? 0;
      const keyPadding = (rowOverrides.padding as number) ?? defaultPadding;

      // Copy running anchor for this key
      const keyPoint = runningAnchor.clone();

      // Apply key-level transforms (matching Ergogen's order)
      keyPoint.r += keyOrient;
      keyPoint.shift(keyShift);
      keyPoint.r += keyRotate;

      // Save key point (running anchor continues from here)
      runningAnchor = keyPoint.clone();

      // Apply zone-level rotation if present
      if (zone.rotate !== 0) {
        // Rotate around zone origin
        keyPoint.rotate(zone.rotate, [
          zone.anchor.shift[0],
          zone.anchor.shift[1],
        ]);
      }

      // Store the update
      updates.set(key.id, {
        x: keyPoint.x,
        y: keyPoint.y,
        rotation: keyPoint.r,
      });

      // Advance running anchor for next row
      runningAnchor.shift([0, keyPadding]);
    }

    isFirstColumn = false;
  }

  return updates;
}

/**
 * Generates missing keys for a zone based on its column and row configuration.
 *
 * Creates a key for each column/row combination that doesn't already exist.
 *
 * @param zone - The zone configuration
 * @param existingKeys - Map of existing keys
 * @param idGenerator - Function to generate unique IDs
 * @returns Array of new keys to add
 */
export function generateMissingKeys(
  zone: EditorZone,
  existingKeys: Map<string, EditorKey>,
  idGenerator: () => string
): EditorKey[] {
  const newKeys: EditorKey[] = [];

  // Get existing keys for this zone
  const zoneKeys = Array.from(existingKeys.values()).filter(
    (k) => k.zone === zone.name
  );

  // Iterate through all expected column/row combinations
  for (const column of zone.columns) {
    for (const row of zone.rows) {
      // Check if a key exists at this position
      const exists = zoneKeys.some(
        (k) => k.column === column.name && k.row === row.name
      );

      if (!exists) {
        const id = idGenerator();
        const newKey: EditorKey = {
          ...DEFAULT_KEY,
          id,
          zone: zone.name,
          column: column.name,
          row: row.name,
          name: `${zone.name}_${column.name}_${row.name}`,
          // Inherit column-level settings
          spread: column.key.spread,
          stagger: column.key.stagger,
          splay: column.key.splay,
          rotationOrigin: column.key.origin,
        };
        newKeys.push(newKey);
      }
    }
  }

  return newKeys;
}

/**
 * Renders all points for a zone, matching Ergogen's render_zone function.
 *
 * This is a more complete implementation that returns Point objects
 * with full metadata, similar to Ergogen's output.
 *
 * @param zone - The zone configuration
 * @param globalKey - Global key defaults (from points.key)
 * @returns Map of point names to Point instances
 */
export function renderZonePoints(
  zone: EditorZone,
  globalKey: Partial<EditorKey> = {}
): Map<string, Point> {
  const points = new Map<string, Point>();

  // Resolve zone-level key defaults (zone.key extends global.key)
  const zoneKey = { ...globalKey, ...zone.key };

  // Initialize zone anchor
  const zoneAnchor = new Point(
    zone.anchor.shift[0],
    zone.anchor.shift[1],
    zone.anchor.rotate
  );

  // Rotation accumulator
  const rotations: Rotation[] = [];

  let isFirstColumn = true;

  for (const column of zone.columns) {
    // Resolve column key (column.key extends zone.key)
    const colKey = { ...zoneKey, ...column.key };

    const spread = (colKey.spread as number) ?? ERGOGEN_DEFAULTS.spread;
    const stagger = (colKey.stagger as number) ?? ERGOGEN_DEFAULTS.stagger;
    const splay = (colKey.splay as number) ?? ERGOGEN_DEFAULTS.splay;
    const origin = (colKey.origin as [number, number]) ?? [0, 0];

    // Apply spread
    if (!isFirstColumn) {
      zoneAnchor.x += spread;
    }

    // Apply stagger
    zoneAnchor.y += stagger;

    const colAnchor = zoneAnchor.clone();

    // Apply splay
    if (splay !== 0) {
      const splayOrigin: [number, number] = [
        colAnchor.x + origin[0],
        colAnchor.y + origin[1],
      ];
      pushRotation(rotations, splay, splayOrigin);
    }

    let runningAnchor = colAnchor.clone();
    applyRotations(runningAnchor, rotations);

    for (const row of zone.rows) {
      // Resolve row key (row extends column)
      const rowOverrides = column.rows[row.name] || {};
      const rowKey = { ...colKey, ...row.key, ...rowOverrides };

      const orient = (rowKey.orient as number) ?? 0;
      const shift = (rowKey.shift as [number, number]) ?? [0, 0];
      const rotate = (rowKey.rotate as number) ?? 0;
      const padding = (rowKey.padding as number) ?? ERGOGEN_DEFAULTS.padding;
      const width = (rowKey.width as number) ?? ERGOGEN_DEFAULTS.width;
      const height = (rowKey.height as number) ?? ERGOGEN_DEFAULTS.height;
      const skip = (rowKey.skip as boolean) ?? false;
      const asym = (rowKey.asym as 'source' | 'clone' | 'both') ?? 'both';

      // Calculate key point
      const keyPoint = runningAnchor.clone();

      keyPoint.r += orient;
      keyPoint.shift(shift);
      keyPoint.r += rotate;

      runningAnchor = keyPoint.clone();

      // Apply zone rotation
      if (zone.rotate !== 0) {
        keyPoint.rotate(zone.rotate, [
          zone.anchor.shift[0],
          zone.anchor.shift[1],
        ]);
      }

      // Set metadata
      const keyName = `${zone.name}_${column.name}_${row.name}`;
      keyPoint.meta = {
        name: keyName,
        zone: { name: zone.name },
        col: { name: column.name },
        row: row.name,
        colrow: `${column.name}_${row.name}`,
        width,
        height,
        stagger,
        spread,
        splay,
        origin,
        orient,
        shift,
        rotate,
        padding,
        skip,
        asym,
        id: (rowKey.id as string) || undefined,
      };

      if (!skip) {
        points.set(keyName, keyPoint);
      }

      // Advance for next row
      runningAnchor.shift([0, padding]);
    }

    isFirstColumn = false;
  }

  return points;
}
