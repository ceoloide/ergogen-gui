/**
 * Utility to export canvas keyboard layout to Ergogen YAML format.
 *
 * Ergogen conventions:
 * - Column-first, rows-second organization
 * - Columns grow bottom to top (positive Y is up)
 * - Positions are relative to the anchor or previous key
 */

import { CanvasKey, GridUnit, toMM, UNIT_TO_MM } from '../types/canvas';
import YAML from 'js-yaml';

/**
 * Ergogen point definition
 */
interface ErgogenPoint {
  spread?: number;
  stagger?: number;
  splay?: number;
  width?: number;
  height?: number;
}

/**
 * Ergogen row definition
 */
interface ErgogenRow {
  [rowName: string]: ErgogenPoint;
}

/**
 * Ergogen column definition
 */
interface ErgogenColumn {
  rows?: ErgogenRow;
  key?: ErgogenPoint;
  spread?: number;
  stagger?: number;
  splay?: number;
}

/**
 * Ergogen zone definition
 */
interface ErgogenZone {
  anchor?: {
    ref?: string;
    shift?: [number, number];
    rotate?: number;
  };
  columns?: {
    [columnName: string]: ErgogenColumn;
  };
  rows?: {
    [rowName: string]: ErgogenPoint;
  };
  key?: ErgogenPoint;
}

/**
 * Ergogen config structure
 */
interface ErgogenConfig {
  units?: Record<string, number | string>;
  points?: {
    zones?: {
      [zoneName: string]: ErgogenZone;
    };
  };
}

/**
 * Group keys by their column assignment
 */
function groupKeysByColumn(
  keys: CanvasKey[]
): Map<string, { keys: CanvasKey[]; rows: Map<string, CanvasKey> }> {
  const columns = new Map<
    string,
    { keys: CanvasKey[]; rows: Map<string, CanvasKey> }
  >();

  for (const key of keys) {
    const columnName = key.column || `col_${key.id}`;
    const rowName = key.row || `row_${key.id}`;

    if (!columns.has(columnName)) {
      columns.set(columnName, { keys: [], rows: new Map() });
    }

    const column = columns.get(columnName)!;
    column.keys.push(key);
    column.rows.set(rowName, key);
  }

  return columns;
}

/**
 * Auto-assign columns and rows based on key positions
 * Groups keys that are vertically aligned into the same column
 * Orders rows within a column from bottom to top (Ergogen convention)
 */
function autoAssignColumnsAndRows(keys: CanvasKey[], _unit: GridUnit): void {
  if (keys.length === 0) return;

  // Sort keys by X position, then by Y position (bottom to top)
  const sortedKeys = [...keys].sort((a, b) => {
    const xDiff = a.x - b.x;
    if (Math.abs(xDiff) < 0.1) {
      // Keys are in the same column, sort by Y (bottom to top)
      return a.y - b.y;
    }
    return xDiff;
  });

  // Group keys into columns based on X position tolerance
  const columnTolerance = 0.25; // Quarter of a unit
  let currentColumn = 0;
  let lastX = sortedKeys[0]?.x ?? 0;
  const columnGroups: CanvasKey[][] = [[]];

  for (const key of sortedKeys) {
    if (Math.abs(key.x - lastX) > columnTolerance) {
      currentColumn++;
      columnGroups.push([]);
      lastX = key.x;
    }
    columnGroups[currentColumn].push(key);
  }

  // Assign column and row names
  const columnNames = [
    'pinky',
    'ring',
    'middle',
    'index',
    'inner',
    'thumb',
    'extra1',
    'extra2',
    'extra3',
    'extra4',
  ];
  const rowNames = ['bottom', 'home', 'top', 'num', 'extra'];

  columnGroups.forEach((group, colIndex) => {
    const colName =
      colIndex < columnNames.length ? columnNames[colIndex] : `col${colIndex}`;

    // Sort rows within column from bottom to top
    group.sort((a, b) => a.y - b.y);

    group.forEach((key, rowIndex) => {
      if (!key.column) {
        key.column = colName;
      }
      if (!key.row) {
        key.row =
          rowIndex < rowNames.length ? rowNames[rowIndex] : `row${rowIndex}`;
      }
    });
  });
}

/**
 * Calculate the spread (horizontal distance) between two keys
 */
function calculateSpread(
  fromKey: CanvasKey | null,
  toKey: CanvasKey,
  unit: GridUnit
): number {
  if (!fromKey) return 0;
  return toMM(toKey.x - fromKey.x, unit);
}

/**
 * Calculate the stagger (vertical offset) between two keys
 */
function calculateStagger(
  fromKey: CanvasKey | null,
  toKey: CanvasKey,
  unit: GridUnit
): number {
  if (!fromKey) return 0;
  return toMM(toKey.y - fromKey.y, unit);
}

/**
 * Export options
 */
interface ExportOptions {
  /** Zone name for the keyboard */
  zoneName?: string;
  /** Whether to auto-assign column and row names */
  autoAssign?: boolean;
  /** The grid unit used in the editor */
  unit?: GridUnit;
  /** Whether to include key size if non-standard */
  includeSize?: boolean;
}

/**
 * Export keyboard layout to Ergogen YAML format
 */
export function exportToErgogenYaml(
  keys: CanvasKey[],
  options: ExportOptions = {}
): string {
  const {
    zoneName = 'matrix',
    autoAssign = true,
    unit = 'U',
    includeSize = true,
  } = options;

  if (keys.length === 0) {
    return YAML.dump({
      points: {
        zones: {
          [zoneName]: {
            columns: {},
          },
        },
      },
    });
  }

  // Create a working copy
  const workingKeys = keys.map((k) => ({ ...k }));

  // Auto-assign columns and rows if needed
  if (autoAssign) {
    autoAssignColumnsAndRows(workingKeys, unit);
  }

  // Group keys by column
  const columns = groupKeysByColumn(workingKeys);

  // Find the anchor key (leftmost, bottommost key)
  const anchorKey = workingKeys.reduce((anchor, key) => {
    if (key.x < anchor.x || (key.x === anchor.x && key.y < anchor.y)) {
      return key;
    }
    return anchor;
  }, workingKeys[0]);

  // Build the Ergogen config
  const config: ErgogenConfig = {
    points: {
      zones: {
        [zoneName]: {
          anchor: {
            shift: [toMM(anchorKey.x, unit), toMM(anchorKey.y, unit)],
          },
          columns: {},
        },
      },
    },
  };

  const zone = config.points!.zones![zoneName];

  // Process each column
  let prevColumnKey: CanvasKey | null = null;
  const sortedColumns = Array.from(columns.entries()).sort(
    ([, a], [, b]) =>
      Math.min(...a.keys.map((k) => k.x)) - Math.min(...b.keys.map((k) => k.x))
  );

  for (const [columnName, columnData] of sortedColumns) {
    const column: ErgogenColumn = {};
    const rows: ErgogenRow = {};

    // Sort keys in column from bottom to top
    const sortedKeys = columnData.keys.sort((a, b) => a.y - b.y);

    // Calculate column spread from previous column
    const firstKeyInColumn = sortedKeys[0];
    if (prevColumnKey) {
      const spread = calculateSpread(prevColumnKey, firstKeyInColumn, unit);
      if (Math.abs(spread - UNIT_TO_MM[unit]) > 0.01) {
        column.spread = spread;
      }
    }

    // Calculate column stagger
    if (prevColumnKey && sortedKeys.length > 0) {
      const stagger = calculateStagger(prevColumnKey, firstKeyInColumn, unit);
      if (Math.abs(stagger) > 0.01) {
        column.stagger = stagger;
      }
    }

    // Process rows within the column
    let prevRowKey: CanvasKey | null = null;
    for (const key of sortedKeys) {
      const rowName = key.row || `row_${key.id}`;
      const rowDef: ErgogenPoint = {};

      // Calculate row padding (vertical spacing from previous row)
      if (prevRowKey) {
        const padding = calculateStagger(prevRowKey, key, unit);
        if (Math.abs(padding - UNIT_TO_MM[unit]) > 0.01) {
          rowDef.stagger = padding - UNIT_TO_MM[unit];
        }
      }

      // Include rotation as splay
      if (Math.abs(key.rotation) > 0.01) {
        rowDef.splay = key.rotation;
      }

      // Include non-standard key sizes
      if (includeSize) {
        if (Math.abs(key.width - 1) > 0.01) {
          rowDef.width = key.width * UNIT_TO_MM[unit];
        }
        if (Math.abs(key.height - 1) > 0.01) {
          rowDef.height = key.height * UNIT_TO_MM[unit];
        }
      }

      // Only add row if it has properties
      if (Object.keys(rowDef).length > 0) {
        rows[rowName] = rowDef;
      } else {
        // Add an empty row definition to maintain structure
        rows[rowName] = {};
      }

      prevRowKey = key;
    }

    // Add rows to column if any
    if (Object.keys(rows).length > 0) {
      column.rows = rows;
    }

    zone.columns![columnName] = column;
    prevColumnKey = sortedKeys[sortedKeys.length - 1] || firstKeyInColumn;
  }

  return YAML.dump(config, {
    indent: 2,
    noRefs: true,
    lineWidth: -1,
    quotingType: '"',
  });
}
