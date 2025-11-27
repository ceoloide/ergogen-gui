import { EditorZone, EditorKey, EditorColumn, EditorRow, KEY_UNIT_MM, DEFAULT_KEY } from '../types';

/**
 * Converts degrees to radians
 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Rotates a point around an origin
 */
function rotatePoint(
  x: number,
  y: number,
  angle: number,
  originX: number,
  originY: number
): { x: number; y: number } {
  const rad = toRad(angle);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = x - originX;
  const dy = y - originY;
  return {
    x: originX + dx * cos - dy * sin,
    y: originY + dx * sin + dy * cos,
  };
}

/**
 * Recalculates key positions for a zone based on its columns and rows.
 * Returns a map of key IDs to their new partial properties (x, y, rotation).
 */
export function recalculateZone(
  zone: EditorZone,
  allKeys: Map<string, EditorKey>
): Map<string, Partial<EditorKey>> {
  const updates = new Map<string, Partial<EditorKey>>();
  const zoneKeys = Array.from(allKeys.values()).filter((k) => k.zone === zone.name);

  if (zoneKeys.length === 0) return updates;

  // 1. Calculate column transforms
  // Each column has a position (x, y) and rotation relative to the zone origin
  const colTransforms: { x: number; y: number; rotation: number }[] = [];

  let currentX = 0;
  let currentY = 0;
  let currentRot = 0;

  zone.columns.forEach((col) => {
    // Apply splay (rotation)
    // Splay origin is relative to the current column's position
    // But typically in ergogen, splay rotates the *current* column relative to the *previous* one
    // The splay origin is usually [0,0] (center of key) or specified

    // For simplicity, we'll accumulate rotation first, then move
    // This mimics a simple "turtle graphics" approach often used in ergogen

    // Apply spread (x offset) from previous column
    // Note: The first column usually starts at 0,0 (relative to zone anchor)
    // Subsequent columns are offset by 'spread'

    // Actually, let's follow a standard approach:
    // Col 0 is at 0,0, rot 0 (unless modified)
    // Col i is at Col i-1 + spread/rotate

    // Adjust for splay
    if (col.splay !== 0) {
      currentRot += col.splay;
      // If splay has an origin, we might need to adjust x/y, but for now let's just rotate direction
    }

    // Calculate position for this column
    // The 'spread' is the distance from the previous column center to this column center
    // If this is the first column, it's at 0,0 (relative to zone start)
    // If not, we move 'spread' units in the current direction

    // Wait, the first column shouldn't have spread applied *before* it.
    // Spread is usually "distance to next" or "distance from previous".
    // In ergogen, it's often "width" or "shift".
    // Let's assume standard grid:
    // Col 0: 0,0
    // Col 1: Col 0 + spread

    // But we are iterating.
    // Let's store the transform for THIS column.

    // If it's the first column, we start at 0,0
    // But wait, the loop structure:
    // We need to calculate the transform for col[i] based on col[i-1]

    // Let's rebuild the array of transforms
  });

  // Re-loop with index to handle previous col
  for (let i = 0; i < zone.columns.length; i++) {
    const col = zone.columns[i];

    if (i === 0) {
      // First column starts at 0,0, 0 rot
      // But it might have its own properties?
      // Usually spread/splay applies to the relationship with the *next* or *previous*
      // Let's assume standard: Col 0 is anchor.
      // But wait, if we edit Col 0 properties, does it move?
      // Usually spread is "width of this column" or "distance to next".
      // Let's assume "spread" on Col i is distance from Col i-1.
      // So Col 0 spread is ignored? Or is it offset from anchor?
      // In ergogen, `spread` defaults to 19.05 (1u).
      // If we have multiple columns, they are spaced by spread.

      // Let's assume:
      // x, y, rot start at 0
      // For i > 0:
      //   Move by prevCol.spread in x direction (rotated)
      //   Rotate by col.splay
      //   Move by col.stagger in y direction (rotated)

      // Let's try this logic:
      // Cursor starts at 0,0, 0 deg
      // For each col:
      //   Save cursor as col origin
      //   Move cursor for NEXT col:
      //     x += col.spread
      //     y += col.stagger
      //     rot += col.splay

      // This means Col 0 is at 0,0.
      // Col 1 is at (Col 0 spread, Col 0 stagger) rotated by Col 0 splay?
      // Actually, stagger is usually vertical offset of the *current* column relative to neighbors.
      // Spread is horizontal spacing.

      // Let's use a simpler model compatible with the UI:
      // x = sum(previous spreads)
      // y = current stagger
      // rot = sum(previous splays)

      // But splay affects the direction of spread.
    }
  }

  // Let's restart the loop with a cumulative transform approach
  let x = 0;
  let y = 0;
  let rot = 0; // degrees

  for (let i = 0; i < zone.columns.length; i++) {
    const col = zone.columns[i];

    // Apply stagger (vertical offset for THIS column)
    // Stagger is usually relative to the "baseline" (y=0)
    // So the column center is at (currentX, currentY + stagger)
    // But we need to account for rotation.

    // Let's assume the "spine" of the zone is calculated first, then stagger is applied.

    // Position of the "spine" point for this column
    const spineX = x;
    const spineY = y;
    const spineRot = rot;

    // Apply splay for THIS column (rotation relative to previous)
    // Usually splay is "rotate this column by X".
    // So we add to cumulative rotation.
    rot += col.splay;

    // Calculate the actual column position (applying stagger)
    // Stagger moves along the Y axis of the current rotation
    const stagger = col.stagger * KEY_UNIT_MM; // mm

    // Calculate position in mm
    // We are at spineX, spineY. We rotate by rot. Then we move (0, stagger).
    // Actually, stagger is usually just Y offset.

    // Let's calculate the column's center in world space (mm)
    // We start at [spineX, spineY] which is on the "baseline"
    // We apply the cumulative rotation `rot`
    // Then we apply the stagger offset (0, stagger) in the local rotated space

    const colPos = rotatePoint(0, stagger, 0, 0, 0); // Just (0, stagger)
    // Rotate this offset by the cumulative rotation
    const rotatedOffset = rotatePoint(colPos.x, colPos.y, rot, 0, 0);

    const finalColX = spineX + rotatedOffset.x;
    const finalColY = spineY + rotatedOffset.y;

    colTransforms.push({
      x: finalColX,
      y: finalColY,
      rotation: rot,
    });

    // Prepare for next column
    // Move by spread along the X axis of the CURRENT rotation
    const spread = col.spread; // mm (default 19.05)

    // Move (spread, 0) in local space, rotated by rot
    const spreadOffset = rotatePoint(spread, 0, rot, 0, 0);

    x += spreadOffset.x;
    y += spreadOffset.y;
  }

  // 2. Iterate keys and apply transforms
  zoneKeys.forEach((key) => {
    // Find column and row index
    // We rely on naming convention or metadata?
    // The key object has `column` and `row` properties which are names (e.g. "col1", "row1")

    const colIndex = zone.columns.findIndex(c => c.name === key.column);
    const rowIndex = zone.rows.findIndex(r => r.name === key.row);

    if (colIndex === -1 || rowIndex === -1) return;

    const colTransform = colTransforms[colIndex];

    // Calculate row offset
    // Rows are usually just stacked vertically (negative Y)
    // Row 0 is at 0. Row 1 is at -1u (or +1u depending on direction).
    // Standard keyboard: rows go DOWN.
    // In our editor, Y goes UP (positive).
    // So "lower" rows (physically) have lower Y values.
    // If row 0 is "top", row 1 is "below".
    // Let's assume standard spacing of 19.05mm between rows.
    // We need to know the visual order.
    // Let's assume row index 0 is the "main" row (or top?), and others are offset.
    // Actually, usually rows are defined from top to bottom or bottom to top.
    // Let's assume simple 1u spacing for now: y = -rowIndex * 19.05
    // But we should check if rows have their own props (padding/spread?).
    // The `EditorRow` type has `ergogenProps`, but no explicit spacing.
    // We'll assume standard 1u spacing.

    const rowOffset = -rowIndex * KEY_UNIT_MM;

    // Apply row offset in the column's local rotation
    const keyOffset = rotatePoint(0, rowOffset, colTransform.rotation, 0, 0);

    let keyX = colTransform.x + keyOffset.x;
    let keyY = colTransform.y + keyOffset.y;
    let keyRot = colTransform.rotation;

    // 3. Apply Zone Anchor & Rotation
    // The calculated positions are relative to the zone origin (0,0).
    // We need to apply the zone's anchor shift and rotation.

    // Apply zone rotation
    const zoneRotated = rotatePoint(keyX, keyY, zone.rotate, 0, 0);
    keyX = zoneRotated.x;
    keyY = zoneRotated.y;
    keyRot += zone.rotate;

    // Apply anchor shift
    keyX += zone.anchor.shiftX;
    keyY += zone.anchor.shiftY;

    // Convert back to editor units (1u = 19.05mm)
    // The editor stores x/y in units, not mm.
    // But our calculations used mm (KEY_UNIT_MM).
    // So we divide by KEY_UNIT_MM.

    const finalX = keyX / KEY_UNIT_MM;
    const finalY = keyY / KEY_UNIT_MM;

    updates.set(key.id, {
      x: finalX,
      y: finalY,
      rotation: keyRot,
    });
  });

  return updates;
}

/**
 * Generates missing keys for a zone based on its columns and rows.
 * Returns an array of new keys that need to be added.
 */
export function generateMissingKeys(
  zone: EditorZone,
  existingKeys: Map<string, EditorKey>,
  idGenerator: () => string
): EditorKey[] {
  const newKeys: EditorKey[] = [];
  const zoneKeys = Array.from(existingKeys.values()).filter((k) => k.zone === zone.name);

  // Iterate through all expected positions
  zone.columns.forEach((col) => {
    zone.rows.forEach((row) => {
      // Check if a key exists for this col/row combination
      const exists = zoneKeys.some(
        (k) => k.column === col.name && k.row === row.name
      );

      if (!exists) {
        const id = idGenerator();
        const newKey: EditorKey = {
          ...DEFAULT_KEY,
          id,
          zone: zone.name,
          column: col.name,
          row: row.name,
          name: `${zone.name}_${col.name}_${row.name}`,
        };
        newKeys.push(newKey);
      }
    });
  });

  return newKeys;
}
