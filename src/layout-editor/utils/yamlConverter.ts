/**
 * YAML Converter - Utilities for converting between visual layout and ergogen YAML configuration.
 *
 * This module handles the conversion between:
 * - EditorLayout (visual representation with EditorKey, EditorZone, etc.)
 * - Ergogen YAML configuration format
 *
 * The conversion maintains consistency with Ergogen's config structure.
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
  ERGOGEN_DEFAULTS,
} from '../types';
import { generateId } from '../LayoutEditorContext';
import { renderZonePoints } from './layoutGenerator';

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
    if (!['engine', 'version', 'author', 'name'].includes(key)) {
      (config.meta as Record<string, unknown>)[key] = value;
    }
  });

  // Build points section
  const points: Record<string, unknown> = {};
  const zones: Record<string, unknown> = {};

  // Process each zone
  layout.zones.forEach((zone, zoneName) => {
    const zoneConfig: Record<string, unknown> = {};

    // Add anchor if defined
    const hasAnchor =
      zone.anchor.ref ||
      zone.anchor.shift[0] !== 0 ||
      zone.anchor.shift[1] !== 0 ||
      zone.anchor.rotate !== 0;

    if (hasAnchor) {
      const anchor: Record<string, unknown> = {};
      if (zone.anchor.ref) {
        anchor.ref = zone.anchor.ref;
      }
      if (zone.anchor.shift[0] !== 0 || zone.anchor.shift[1] !== 0) {
        anchor.shift = zone.anchor.shift;
      }
      if (zone.anchor.rotate !== 0) {
        anchor.rotate = zone.anchor.rotate;
      }
      zoneConfig.anchor = anchor;
    }

    // Add zone-level key defaults if present
    if (Object.keys(zone.key).length > 0) {
      const keyConfig: Record<string, unknown> = {};
      Object.entries(zone.key).forEach(([k, v]) => {
        keyConfig[`key.${k}`] = v;
      });
      Object.assign(zoneConfig, keyConfig);
    }

    // Build columns
    if (zone.columns.length > 0) {
      const columns: Record<string, unknown> = {};
      zone.columns.forEach((col, index) => {
        const colConfig: Record<string, unknown> = {};

        // Only add non-default values
        if (col.key.stagger !== ERGOGEN_DEFAULTS.stagger) {
          colConfig['key.stagger'] = col.key.stagger;
        }
        if (col.key.splay !== ERGOGEN_DEFAULTS.splay) {
          colConfig['key.splay'] = col.key.splay;
          if (col.key.origin[0] !== 0 || col.key.origin[1] !== 0) {
            colConfig['key.origin'] = col.key.origin;
          }
        }
        if (col.key.spread !== ERGOGEN_DEFAULTS.spread && index > 0) {
          colConfig['key.spread'] = col.key.spread;
        }

        // Add row-level overrides within this column
        if (Object.keys(col.rows).length > 0) {
          const rowsConfig: Record<string, unknown> = {};
          Object.entries(col.rows).forEach(([rowName, rowKey]) => {
            const rowConfig: Record<string, unknown> = {};
            Object.entries(rowKey).forEach(([k, v]) => {
              rowConfig[k] = v;
            });
            if (Object.keys(rowConfig).length > 0) {
              rowsConfig[rowName] = rowConfig;
            }
          });
          if (Object.keys(rowsConfig).length > 0) {
            colConfig.rows = rowsConfig;
          }
        }

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

        // Add row-level key config
        if (row.key && Object.keys(row.key).length > 0) {
          Object.entries(row.key).forEach(([k, v]) => {
            rowConfig[k] = v;
          });
        }

        rows[row.name] = Object.keys(rowConfig).length > 0 ? rowConfig : {};
      });
      zoneConfig.rows = rows;
    }

    // Add zone rotation
    if (zone.rotate !== 0) {
      zoneConfig.rotate = zone.rotate;
    }

    // Add zone-level mirroring
    if (zone.mirror) {
      const mirrorConfig: Record<string, unknown> = {};
      if (zone.mirror.ref) {
        mirrorConfig.ref = zone.mirror.ref;
      }
      if (zone.mirror.distance !== 0) {
        mirrorConfig.distance = zone.mirror.distance;
      }
      if (Object.keys(mirrorConfig).length > 0) {
        zoneConfig.mirror = mirrorConfig;
      }
    }

    zones[zoneName] = zoneConfig;
  });

  // Handle keys without zones (create inferred matrix zone)
  const keysWithoutZone = Array.from(layout.keys.values()).filter(
    (k) => !k.zone || !layout.zones.has(k.zone)
  );

  if (keysWithoutZone.length > 0 && !layout.zones.has('matrix')) {
    // Group keys by their column and row
    const columnMap = new Map<string, EditorKey[]>();
    keysWithoutZone.forEach((key) => {
      const colName = key.column || `col${Math.floor(key.x / KEY_UNIT_MM)}`;
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
      rowNames.add(key.row || `row${Math.floor(key.y / KEY_UNIT_MM)}`);
    });
    const rows: Record<string, unknown> = {};
    Array.from(rowNames)
      .sort()
      .forEach((rowName) => {
        rows[rowName] = {};
      });

    zones.matrix = { columns, rows };
  }

  if (Object.keys(zones).length > 0) {
    points.zones = zones;
  }

  // Add global rotation
  if (layout.globalRotation !== 0) {
    points.rotate = layout.globalRotation;
  }

  // Add global mirror settings
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
      distance: 190.5,
    },
    globalRotation: 0,
    meta: {
      engine: '4.2.1',
    },
  };

  // Parse meta section
  if (config.meta && typeof config.meta === 'object') {
    const meta = config.meta as Record<string, unknown>;
    layout.meta = { ...layout.meta, ...meta };

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

  // Parse global mirror settings
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
    Object.entries(zonesConfig).forEach(([zoneName, zoneData]) => {
      const zoneConfig = zoneData as Record<string, unknown>;

      // Create zone with defaults
      const zone: EditorZone = {
        ...DEFAULT_ZONE,
        name: zoneName,
        columns: [],
        rows: [],
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
          zone.anchor.shift = [
            (anchorConfig.shift[0] as number) || 0,
            (anchorConfig.shift[1] as number) || 0,
          ];
        }
        if (typeof anchorConfig.rotate === 'number') {
          zone.anchor.rotate = anchorConfig.rotate;
        }
      }

      // Parse zone-level key defaults
      const zoneKeyConfig: Record<string, unknown> = {};
      Object.entries(zoneConfig).forEach(([key, value]) => {
        if (key.startsWith('key.')) {
          zoneKeyConfig[key.substring(4)] = value;
        }
      });
      if (Object.keys(zoneKeyConfig).length > 0) {
        zone.key = zoneKeyConfig;
      }

      // Parse zone rotation
      if (typeof zoneConfig.rotate === 'number') {
        zone.rotate = zoneConfig.rotate;
      }

      // Parse zone mirror
      const zoneMirrorConfig = zoneConfig.mirror as
        | Record<string, unknown>
        | undefined;
      if (zoneMirrorConfig) {
        zone.mirror = {
          distance: (zoneMirrorConfig.distance as number) || 0,
        };
        if (typeof zoneMirrorConfig.ref === 'string') {
          zone.mirror.ref = zoneMirrorConfig.ref;
        }
      }

      // Parse columns
      const columnsConfig = zoneConfig.columns as
        | Record<string, unknown>
        | undefined;
      if (columnsConfig) {
        Object.entries(columnsConfig).forEach(([colName, colData]) => {
          const colConfig = (colData || {}) as Record<string, unknown>;
          const column: EditorColumn = {
            ...DEFAULT_COLUMN,
            name: colName,
            key: {
              ...DEFAULT_COLUMN.key,
              origin: [...DEFAULT_COLUMN.key.origin] as [number, number],
            },
            rows: {},
          };

          // Parse column-level key settings
          if (typeof colConfig['key.stagger'] === 'number') {
            column.key.stagger = colConfig['key.stagger'];
          }
          if (typeof colConfig['key.splay'] === 'number') {
            column.key.splay = colConfig['key.splay'];
          }
          if (typeof colConfig['key.spread'] === 'number') {
            column.key.spread = colConfig['key.spread'];
          }
          if (Array.isArray(colConfig['key.origin'])) {
            column.key.origin = [
              (colConfig['key.origin'][0] as number) || 0,
              (colConfig['key.origin'][1] as number) || 0,
            ];
          }

          // Parse row overrides within this column
          const rowOverrides = colConfig.rows as
            | Record<string, unknown>
            | undefined;
          if (rowOverrides) {
            Object.entries(rowOverrides).forEach(([rowName, rowConfig]) => {
              column.rows[rowName] = rowConfig as Record<string, unknown>;
            });
          }

          zone.columns.push(column);
        });
      }

      // Parse rows
      const rowsConfig = zoneConfig.rows as Record<string, unknown> | undefined;
      if (rowsConfig) {
        Object.entries(rowsConfig).forEach(([rowName, rowData]) => {
          const rowConfig = (rowData || {}) as Record<string, unknown>;
          const row: EditorRow = {
            ...DEFAULT_ROW,
            name: rowName,
            key: { ...rowConfig },
          };
          zone.rows.push(row);
        });
      }

      // Generate keys using the Point-based rendering
      const renderedPoints = renderZonePoints(zone, DEFAULT_KEY);
      renderedPoints.forEach((point, pointName) => {
        const id = generateId('key');
        const meta = point.meta;

        const key: EditorKey = {
          ...DEFAULT_KEY,
          id,
          name: pointName,
          zone: zoneName,
          column: (meta.col as { name: string })?.name || '',
          row: (meta.row as string) || '',
          x: point.x,
          y: point.y,
          rotation: point.r,
          width: (meta.width as number) || ERGOGEN_DEFAULTS.width,
          height: (meta.height as number) || ERGOGEN_DEFAULTS.height,
          stagger: (meta.stagger as number) || ERGOGEN_DEFAULTS.stagger,
          spread: (meta.spread as number) || ERGOGEN_DEFAULTS.spread,
          splay: (meta.splay as number) || ERGOGEN_DEFAULTS.splay,
          padding: (meta.padding as number) || ERGOGEN_DEFAULTS.padding,
        };

        layout.keys.set(id, key);
      });

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