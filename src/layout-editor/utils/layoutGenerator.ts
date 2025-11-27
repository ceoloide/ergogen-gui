import { EditorZone, EditorKey, KEY_UNIT_MM, DEFAULT_KEY } from '../types';

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
  const zoneKeys = Array.from(allKeys.values()).filter(
    (k) => k.zone === zone.name
  );

  if (zoneKeys.length === 0) return updates;

  // 1. Calculate column transforms
  // Each column has a position (x, y) and rotation relative to the zone origin
  const colTransforms: { x: number; y: number; rotation: number }[] = [];

  // Re-loop with index to handle previous col

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

    const colIndex = zone.columns.findIndex((c) => c.name === key.column);
    const rowIndex = zone.rows.findIndex((r) => r.name === key.row);

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
  const zoneKeys = Array.from(existingKeys.values()).filter(
    (k) => k.zone === zone.name
  );

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
