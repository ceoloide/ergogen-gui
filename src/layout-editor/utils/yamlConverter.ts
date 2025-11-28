/**
 * YAML Converter - Utilities for converting between visual layout and ergogen YAML configuration.
 */
import yaml from 'js-yaml';
import {
  EditorLayout,
  EditorKey,
  EditorZone,
  EditorColumn,
  EditorRow,
  DEFAULT_KEY,
  DEFAULT_ZONE,
  DEFAULT_COLUMN,
  DEFAULT_ROW,
  KEY_UNIT_MM,
} from '../types';
import { generateId } from '../LayoutEditorContext';

/**
 * Converts a visual layout to ergogen YAML configuration.
 */
export function layoutToYaml(layout: EditorLayout): string {
  const config: Record<string, unknown> = {};

  // Add meta section
  config.meta = {
    engine: layout.meta.engine,
  };

  if (layout.meta.version) {
    (config.meta as Record<string, unknown>).version = layout.meta.version;
  }
  if (layout.meta.author) {
    (config.meta as Record<string, unknown>).author = layout.meta.author;
  }
  if (layout.meta.name) {
    (config.meta as Record<string, unknown>).name = layout.meta.name;
  }

  // Add any other meta fields
  Object.entries(layout.meta).forEach(([key, value]) => {
    if (
      key !== 'engine' &&
      key !== 'version' &&
      key !== 'author' &&
      key !== 'name'
    ) {
      (config.meta as Record<string, unknown>)[key] = value;
    }
  });

  // Build points section
  const points: Record<string, unknown> = {};
  const zones: Record<string, unknown> = {};

  // Group keys by zone
  const keysByZone = new Map<string, EditorKey[]>();
  layout.keys.forEach((key) => {
    const zoneName = key.zone || 'matrix';
    if (!keysByZone.has(zoneName)) {
      keysByZone.set(zoneName, []);
    }
    keysByZone.get(zoneName)!.push(key);
  });

  // Process each zone
  layout.zones.forEach((zone, zoneName) => {
    const zoneConfig: Record<string, unknown> = {};

    // Add anchor if defined
    if (
      zone.anchor.ref ||
      zone.anchor.shiftX ||
      zone.anchor.shiftY ||
      zone.anchor.rotate
    ) {
      const anchor: Record<string, unknown> = {};
      if (zone.anchor.ref) {
        anchor.ref = zone.anchor.ref;
      }
      if (zone.anchor.shiftX || zone.anchor.shiftY) {
        anchor.shift = [zone.anchor.shiftX, zone.anchor.shiftY];
      }
      if (zone.anchor.rotate) {
        anchor.rotate = zone.anchor.rotate;
      }
      zoneConfig.anchor = anchor;
    }

    // Build columns
    if (zone.columns.length > 0) {
      const columns: Record<string, unknown> = {};
      zone.columns.forEach((col, index) => {
        const colConfig: Record<string, unknown> = {};

        // Only add non-default values
        if (col.stagger !== 0) {
          colConfig['key.stagger'] = col.stagger;
        }
        if (col.splay !== 0) {
          colConfig['key.splay'] = col.splay;
          if (col.splayOrigin[0] !== 0 || col.splayOrigin[1] !== 0) {
            colConfig['key.origin'] = col.splayOrigin;
          }
        }
        if (col.spread !== KEY_UNIT_MM && index > 0) {
          colConfig['key.spread'] = col.spread;
        }

        // Add any additional ergogen props
        Object.entries(col.ergogenProps).forEach(([key, value]) => {
          colConfig[key] = value;
        });

        // If column has no config, still add it (ergogen requires column presence)
        columns[col.name] = Object.keys(colConfig).length > 0 ? colConfig : {};
      });
      zoneConfig.columns = columns;
    }

    // Build rows
    if (zone.rows.length > 0) {
      const rows: Record<string, unknown> = {};
      zone.rows.forEach((row) => {
        const rowConfig: Record<string, unknown> = {};

        // Add any additional ergogen props
        Object.entries(row.ergogenProps).forEach(([key, value]) => {
          rowConfig[key] = value;
        });

        rows[row.name] = Object.keys(rowConfig).length > 0 ? rowConfig : {};
      });
      zoneConfig.rows = rows;
    }

    // Add zone rotation if defined
    if (zone.rotate !== 0) {
      // Note: zone-level rotate goes at the points level, not inside zone
    }

    // Add any additional zone ergogen props
    Object.entries(zone.ergogenProps).forEach(([key, value]) => {
      zoneConfig[key] = value;
    });

    zones[zoneName] = zoneConfig;
  });

  // If there are keys without zones, create a default matrix zone
  const keysWithoutZone = keysByZone.get('') || [];
  if (keysWithoutZone.length > 0 && !layout.zones.has('matrix')) {
    // Group keys by their column and row
    const columnMap = new Map<string, EditorKey[]>();
    keysWithoutZone.forEach((key) => {
      const colName = key.column || `col${Math.floor(key.x)}`;
      if (!columnMap.has(colName)) {
        columnMap.set(colName, []);
      }
      columnMap.get(colName)!.push(key);
    });

    // Infer columns from key positions
    const columns: Record<string, unknown> = {};
    let prevX = 0;
    Array.from(columnMap.entries())
      .sort((a, b) => {
        const aMinX = Math.min(...a[1].map((k) => k.x));
        const bMinX = Math.min(...b[1].map((k) => k.x));
        return aMinX - bMinX;
      })
      .forEach(([colName, keys], index) => {
        const colConfig: Record<string, unknown> = {};
        const avgX = keys.reduce((sum, k) => sum + k.x, 0) / keys.length;
        const avgRotation =
          keys.reduce((sum, k) => sum + k.rotation, 0) / keys.length;

        if (index > 0) {
          // Calculate spread (horizontal distance)
          const spread = avgX - prevX;
          if (Math.abs(spread - KEY_UNIT_MM) > 0.1) {
            colConfig['key.spread'] = Math.round(spread * 10) / 10;
          }
        }

        if (Math.abs(avgRotation) > 0.5) {
          colConfig['key.splay'] = -Math.round(avgRotation);
        }

        columns[colName] = Object.keys(colConfig).length > 0 ? colConfig : {};
        prevX = avgX;
      });

    // Infer rows
    const rowNames = new Set<string>();
    keysWithoutZone.forEach((key) => {
      rowNames.add(key.row || `row${Math.floor(key.y)}`);
    });
    const rows: Record<string, unknown> = {};
    Array.from(rowNames)
      .sort()
      .forEach((rowName) => {
        rows[rowName] = {};
      });

    zones.matrix = {
      columns,
      rows,
    };
  }

  if (Object.keys(zones).length > 0) {
    points.zones = zones;
  }

  // Add global rotation
  if (layout.globalRotation !== 0) {
    points.rotate = layout.globalRotation;
  }

  // Add mirror settings
  if (layout.mirror.enabled) {
    const mirror: Record<string, unknown> = {};
    if (layout.mirror.ref) {
      mirror.ref = layout.mirror.ref;
    }
    mirror.distance = layout.mirror.distance;
    points.mirror = mirror;
  }

  if (Object.keys(points).length > 0) {
    config.points = points;
  }

  return yaml.dump(config, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
  });
}

/**
 * Parses an ergogen YAML configuration into a visual layout.
 */
export function yamlToLayout(yamlString: string): EditorLayout {
  const config = yaml.load(yamlString) as Record<string, unknown>;

  const layout: EditorLayout = {
    keys: new Map(),
    zones: new Map(),
    mirror: {
      enabled: false,
      ref: '',
      distance: 100,
    },
    globalRotation: 0,
    meta: {
      engine: '4.2.1',
    },
  };

  // Parse meta section
  if (config.meta && typeof config.meta === 'object') {
    const meta = config.meta as Record<string, unknown>;
    layout.meta = {
      ...layout.meta,
      ...meta,
    };

    // Ensure known fields are strings if present
    if (typeof meta.version === 'string') layout.meta.version = meta.version;
    if (typeof meta.author === 'string') layout.meta.author = meta.author;
    if (typeof meta.name === 'string') layout.meta.name = meta.name;
    if (typeof meta.engine === 'string') layout.meta.engine = meta.engine;
  }

  // Parse points section
  const points = config.points as Record<string, unknown> | undefined;
  if (!points) {
    return layout;
  }

  // Parse global rotation
  if (typeof points.rotate === 'number') {
    layout.globalRotation = points.rotate;
  }

  // Parse mirror settings
  const mirrorConfig = points.mirror as Record<string, unknown> | undefined;
  if (mirrorConfig) {
    layout.mirror.enabled = true;
    if (typeof mirrorConfig.ref === 'string') {
      layout.mirror.ref = mirrorConfig.ref;
    }
    if (typeof mirrorConfig.distance === 'number') {
      layout.mirror.distance = mirrorConfig.distance;
    }
  }

  // Parse zones
  const zonesConfig = points.zones as Record<string, unknown> | undefined;
  if (zonesConfig) {
    let currentY = 0;

    Object.entries(zonesConfig).forEach(([zoneName, zoneData]) => {
      const zoneConfig = zoneData as Record<string, unknown>;

      // Create zone
      const zone: EditorZone = {
        ...DEFAULT_ZONE,
        name: zoneName,
        columns: [],
        rows: [],
        keys: [],
      };

      // Parse anchor
      const anchorConfig = zoneConfig.anchor as
        | Record<string, unknown>
        | undefined;
      if (anchorConfig) {
        if (typeof anchorConfig.ref === 'string') {
          zone.anchor.ref = anchorConfig.ref;
        }
        if (Array.isArray(anchorConfig.shift)) {
          zone.anchor.shiftX = (anchorConfig.shift[0] as number) || 0;
          zone.anchor.shiftY = (anchorConfig.shift[1] as number) || 0;
        }
        if (typeof anchorConfig.rotate === 'number') {
          zone.anchor.rotate = anchorConfig.rotate;
        }
      }

      // Parse columns
      const columnsConfig = zoneConfig.columns as
        | Record<string, unknown>
        | undefined;
      const columnNames: string[] = [];
      if (columnsConfig) {
        Object.entries(columnsConfig).forEach(([colName, colData]) => {
          const colConfig = colData as Record<string, unknown>;
          const column: EditorColumn = {
            ...DEFAULT_COLUMN,
            name: colName,
          };

          if (typeof colConfig['key.stagger'] === 'number') {
            column.stagger = colConfig['key.stagger'];
          }
          if (typeof colConfig['key.splay'] === 'number') {
            column.splay = colConfig['key.splay'];
          }
          if (typeof colConfig['key.spread'] === 'number') {
            column.spread = colConfig['key.spread'];
          }
          if (Array.isArray(colConfig['key.origin'])) {
            column.splayOrigin = [
              (colConfig['key.origin'][0] as number) || 0,
              (colConfig['key.origin'][1] as number) || 0,
            ];
          }

          // Store other ergogen props
          Object.entries(colConfig).forEach(([key, value]) => {
            if (!key.startsWith('key.')) {
              column.ergogenProps[key] = value;
            }
          });

          zone.columns.push(column);
          columnNames.push(colName);
        });
      }

      // Parse rows
      const rowsConfig = zoneConfig.rows as Record<string, unknown> | undefined;
      const rowNames: string[] = [];
      if (rowsConfig) {
        Object.entries(rowsConfig).forEach(([rowName, rowData]) => {
          const rowConfig = rowData as Record<string, unknown>;
          const row: EditorRow = {
            ...DEFAULT_ROW,
            name: rowName,
            ergogenProps: {},
          };

          Object.entries(rowConfig).forEach(([key, value]) => {
            row.ergogenProps[key] = value;
          });

          zone.rows.push(row);
          rowNames.push(rowName);
        });
      }

      // Create keys for each column/row combination
      let colX = zone.anchor.shiftX;
      let baseRotation = zone.anchor.rotate || 0;

      zone.columns.forEach((column) => {
        const colStagger = column.stagger;
        const colSplay = column.splay;

        zone.rows.forEach((row, rowIndex) => {
          const keyName = `${zoneName}_${column.name}_${row.name}`;
          const id = generateId('key');

          const key: EditorKey = {
            ...DEFAULT_KEY,
            id,
            name: keyName,
            zone: zoneName,
            column: column.name,
            row: row.name,
            x: colX,
            y: currentY + rowIndex * KEY_UNIT_MM + colStagger,
            rotation: baseRotation + colSplay,
          };

          layout.keys.set(id, key);
          zone.keys.push(id);
        });

        colX += column.spread || KEY_UNIT_MM;
        baseRotation += colSplay;
      });

      currentY += (zone.rows.length + 1) * KEY_UNIT_MM;

      layout.zones.set(zoneName, zone);
    });
  }

  return layout;
}

/**
 * Validates an ergogen YAML configuration.
 * Returns an array of validation errors, or empty array if valid.
 */
function _validateYaml(yamlString: string): string[] {
  const errors: string[] = [];

  try {
    const config = yaml.load(yamlString);

    if (!config || typeof config !== 'object') {
      errors.push('Configuration must be a valid YAML object');
      return errors;
    }

    const configObj = config as Record<string, unknown>;

    // Check for required meta.engine
    if (!configObj.meta || typeof configObj.meta !== 'object') {
      errors.push('Missing meta section');
    } else {
      const meta = configObj.meta as Record<string, unknown>;
      if (!meta.engine) {
        errors.push('Missing meta.engine version');
      }
    }

    // Check for points section
    if (!configObj.points || typeof configObj.points !== 'object') {
      errors.push('Missing points section');
    } else {
      const points = configObj.points as Record<string, unknown>;

      // Check for zones
      if (!points.zones || typeof points.zones !== 'object') {
        errors.push('Missing points.zones section');
      }
    }
  } catch (e) {
    errors.push(
      `Invalid YAML: ${e instanceof Error ? e.message : 'Unknown error'}`
    );
  }

  return errors;
}

/**
 * Generates a simple keyboard layout with the specified number of rows and columns.
 */
function _generateSimpleLayout(
  numColumns: number,
  numRows: number,
  zoneName: string = 'matrix'
): EditorLayout {
  const layout: EditorLayout = {
    keys: new Map(),
    zones: new Map(),
    mirror: {
      enabled: false,
      ref: '',
      distance: 100,
    },
    globalRotation: 0,
    meta: {
      engine: '4.2.1',
    },
  };

  // Create column and row definitions
  const columns: EditorColumn[] = [];
  const rows: EditorRow[] = [];
  const rowNames = ['bottom', 'home', 'top', 'num'];

  for (let c = 0; c < numColumns; c++) {
    columns.push({
      ...DEFAULT_COLUMN,
      name: `col${c + 1}`,
    });
  }

  for (let r = 0; r < numRows; r++) {
    rows.push({
      ...DEFAULT_ROW,
      name: rowNames[r] || `row${r + 1}`,
    });
  }

  // Create zone
  const zone: EditorZone = {
    ...DEFAULT_ZONE,
    name: zoneName,
    columns,
    rows,
    keys: [],
  };

  // Create keys
  for (let c = 0; c < numColumns; c++) {
    for (let r = 0; r < numRows; r++) {
      const id = generateId('key');
      const key: EditorKey = {
        ...DEFAULT_KEY,
        id,
        name: `${zoneName}_${columns[c]!.name}_${rows[r]!.name}`,
        zone: zoneName,
        column: columns[c]!.name,
        row: rows[r]!.name,
        x: c * KEY_UNIT_MM,
        y: r * KEY_UNIT_MM,
      };
      layout.keys.set(id, key);
      zone.keys.push(id);
    }
  }

  layout.zones.set(zoneName, zone);

  return layout;
}
