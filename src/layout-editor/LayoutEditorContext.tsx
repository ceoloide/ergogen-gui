/**
 * Context for managing the Layout Editor state.
 * Provides state management and actions for the visual keyboard layout editor.
 */
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  EditorState,
  EditorLayout,
  EditorKey,
  EditorZone,
  EditorMode,
  EditorSelection,
  EditorViewport,
  DEFAULT_KEY,
  DEFAULT_ZONE,
  DEFAULT_COLUMN,
  DEFAULT_ROW,
  KEY_UNIT_MM,
  HistoryEntry,
} from './types';
import { recalculateZone, generateMissingKeys } from './utils/layoutGenerator';

// Generate unique IDs
let idCounter = 0;
export function generateId(prefix: string = 'key'): string {
  return `${prefix}_${Date.now()}_${++idCounter}`;
}

/**
 * Creates an empty layout state.
 */
function createEmptyLayout(): EditorLayout {
  return {
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
      version: '0.1',
      author: '',
      name: '',
    },
  };
}

/**
 * Creates the initial editor state.
 */
function createInitialState(): EditorState {
  return {
    layout: createEmptyLayout(),
    mode: 'select',
    viewport: {
      zoom: 1,
      panX: 0,
      panY: 0,
    },
    selection: {
      keys: new Set(),
      zone: null,
    },
    history: [],
    historyIndex: -1,
    isDirty: false,
    grid: {
      visible: true,
      size: 19.05,
      snap: true,
    },
  };
}

// Action types
type EditorAction =
  | { type: 'SET_MODE'; payload: EditorMode }
  | { type: 'SET_VIEWPORT'; payload: Partial<EditorViewport> }
  | { type: 'SET_SELECTION'; payload: EditorSelection }
  | { type: 'ADD_TO_SELECTION'; payload: string }
  | { type: 'REMOVE_FROM_SELECTION'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SELECT_ALL' }
  | { type: 'ADD_KEY'; payload: Partial<EditorKey> }
  | {
      type: 'ADD_KEY_IN_DIRECTION';
      payload: {
        referenceKeyId: string;
        direction: 'up' | 'down' | 'left' | 'right';
      };
    }
  | { type: 'UPDATE_KEY'; payload: { id: string; changes: Partial<EditorKey> } }
  | { type: 'DELETE_KEYS'; payload: string[] }
  | { type: 'MOVE_KEYS'; payload: { ids: string[]; dx: number; dy: number } }
  | { type: 'ROTATE_KEYS'; payload: { ids: string[]; angle: number } }
  | { type: 'ADD_ZONE'; payload: Partial<EditorZone> & { name: string } }
  | {
      type: 'UPDATE_ZONE';
      payload: { name: string; changes: Partial<EditorZone> };
    }
  | { type: 'DELETE_ZONE'; payload: string }
  | { type: 'SET_LAYOUT'; payload: EditorLayout }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_HISTORY'; payload: string }
  | { type: 'TOGGLE_GRID' }
  | { type: 'TOGGLE_SNAP' }
  | { type: 'SET_GRID_SIZE'; payload: number }
  | { type: 'SET_MIRROR'; payload: Partial<EditorLayout['mirror']> }
  | { type: 'SET_GLOBAL_ROTATION'; payload: number }
  | { type: 'UPDATE_META'; payload: Partial<EditorLayout['meta']> }
  | { type: 'MARK_CLEAN' };

/**
 * Deep clones a layout for history.
 */
function cloneLayout(layout: EditorLayout): EditorLayout {
  return {
    keys: new Map(
      Array.from(layout.keys.entries()).map(([k, v]) => [
        k,
        { ...v, ergogenProps: { ...v.ergogenProps } },
      ])
    ),
    zones: new Map(
      Array.from(layout.zones.entries()).map(([k, v]) => [
        k,
        {
          ...v,
          anchor: { ...v.anchor },
          columns: v.columns.map((c) => ({
            ...c,
            splayOrigin: [...c.splayOrigin] as [number, number],
            ergogenProps: { ...c.ergogenProps },
          })),
          rows: v.rows.map((r) => ({
            ...r,
            ergogenProps: { ...r.ergogenProps },
          })),
          keys: [...v.keys],
          ergogenProps: { ...v.ergogenProps },
        },
      ])
    ),
    mirror: { ...layout.mirror },
    globalRotation: layout.globalRotation,
    meta: { ...layout.meta },
  };
}

/**
 * Reducer for editor state.
 */
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };

    case 'SET_VIEWPORT':
      return {
        ...state,
        viewport: { ...state.viewport, ...action.payload },
      };

    case 'SET_SELECTION':
      return { ...state, selection: action.payload };

    case 'ADD_TO_SELECTION': {
      const newKeys = new Set(state.selection.keys);
      newKeys.add(action.payload);
      return {
        ...state,
        selection: { ...state.selection, keys: newKeys },
      };
    }

    case 'REMOVE_FROM_SELECTION': {
      const newKeys = new Set(state.selection.keys);
      newKeys.delete(action.payload);
      return {
        ...state,
        selection: { ...state.selection, keys: newKeys },
      };
    }

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selection: { keys: new Set(), zone: null },
      };

    case 'SELECT_ALL': {
      const allKeys = new Set(state.layout.keys.keys());
      return {
        ...state,
        selection: { ...state.selection, keys: allKeys },
      };
    }

    case 'ADD_KEY': {
      const id = generateId('key');
      const newKey: EditorKey = {
        ...DEFAULT_KEY,
        ...action.payload,
        id,
        name: action.payload.name || `key_${id}`,
      };
      const newKeys = new Map(state.layout.keys);
      newKeys.set(id, newKey);
      return {
        ...state,
        layout: { ...state.layout, keys: newKeys },
        selection: { keys: new Set([id]), zone: null },
        isDirty: true,
      };
    }

    case 'ADD_KEY_IN_DIRECTION': {
      const { referenceKeyId, direction } = action.payload;
      const refKey = state.layout.keys.get(referenceKeyId);
      if (!refKey) return state;

      const id = generateId('key');

      // Extract numeric suffix from column/row names
      const extractNumber = (name: string): number => {
        const match = name.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 1;
      };

      // Get prefix (e.g., "col" from "col1", "row" from "row2")
      const getPrefix = (name: string): string => name.replace(/\d+$/, '');

      const colNum = extractNumber(refKey.column);
      const rowNum = extractNumber(refKey.row);
      const colPrefix = getPrefix(refKey.column);
      const rowPrefix = getPrefix(refKey.row);

      // Calculate new position and column/row based on direction
      let newX = refKey.x;
      let newY = refKey.y;
      let newColumn = refKey.column;
      let newRow = refKey.row;

      switch (direction) {
        case 'up':
          // Up = higher row number, positive Y direction
          newY = refKey.y + KEY_UNIT_MM;
          newRow = `${rowPrefix}${rowNum + 1}`;
          break;
        case 'down':
          // Down = lower row number (min 1), negative Y direction
          if (rowNum > 1) {
            newY = refKey.y - KEY_UNIT_MM;
            newRow = `${rowPrefix}${rowNum - 1}`;
          } else {
            // Should not happen if UI blocks this, but guard anyway
            return state;
          }
          break;
        case 'right':
          // Right = higher column number, positive X direction
          newX = refKey.x + KEY_UNIT_MM;
          newColumn = `${colPrefix}${colNum + 1}`;
          break;
        case 'left':
          // Left = lower column number (min 1), negative X direction
          if (colNum > 1) {
            newX = refKey.x - KEY_UNIT_MM;
            newColumn = `${colPrefix}${colNum - 1}`;
          } else {
            // Should not happen if UI blocks this, but guard anyway
            return state;
          }
          break;
      }

      const newKey: EditorKey = {
        ...DEFAULT_KEY,
        id,
        x: newX,
        y: newY,
        zone: refKey.zone,
        column: newColumn,
        row: newRow,
        name: `${refKey.zone}_${newColumn}_${newRow}`,
        rotation: refKey.rotation,
        color: refKey.color,
      };

      const newKeys = new Map(state.layout.keys);
      newKeys.set(id, newKey);

      return {
        ...state,
        layout: { ...state.layout, keys: newKeys },
        selection: { keys: new Set([id]), zone: null },
        isDirty: true,
      };
    }

    case 'UPDATE_KEY': {
      const { id, changes } = action.payload;
      const existingKey = state.layout.keys.get(id);
      if (!existingKey) return state;
      const newKeys = new Map(state.layout.keys);
      newKeys.set(id, { ...existingKey, ...changes });
      return {
        ...state,
        layout: { ...state.layout, keys: newKeys },
        isDirty: true,
      };
    }

    case 'DELETE_KEYS': {
      const newKeys = new Map(state.layout.keys);
      const newSelection = new Set(state.selection.keys);
      action.payload.forEach((id) => {
        newKeys.delete(id);
        newSelection.delete(id);
      });
      return {
        ...state,
        layout: { ...state.layout, keys: newKeys },
        selection: { ...state.selection, keys: newSelection },
        isDirty: true,
      };
    }

    case 'MOVE_KEYS': {
      const { ids, dx, dy } = action.payload;
      const newKeys = new Map(state.layout.keys);
      ids.forEach((id) => {
        const key = newKeys.get(id);
        if (key) {
          newKeys.set(id, {
            ...key,
            x: key.x + dx,
            y: key.y + dy,
          });
        }
      });
      return {
        ...state,
        layout: { ...state.layout, keys: newKeys },
        isDirty: true,
      };
    }

    case 'ROTATE_KEYS': {
      const { ids, angle } = action.payload;
      const newKeys = new Map(state.layout.keys);
      ids.forEach((id) => {
        const key = newKeys.get(id);
        if (key) {
          newKeys.set(id, {
            ...key,
            rotation: key.rotation + angle,
          });
        }
      });
      return {
        ...state,
        layout: { ...state.layout, keys: newKeys },
        isDirty: true,
      };
    }

    case 'ADD_ZONE': {
      const newZone: EditorZone = {
        ...DEFAULT_ZONE,
        ...action.payload,
        columns: action.payload.columns || [
          { ...DEFAULT_COLUMN, name: 'col1' },
        ],
        rows: action.payload.rows || [{ ...DEFAULT_ROW, name: 'row1' }],
      };
      const newZones = new Map(state.layout.zones);
      newZones.set(action.payload.name, newZone);

      // Generate keys for the new zone
      const newKeys = new Map(state.layout.keys);
      const generatedKeys = generateMissingKeys(
        newZone,
        state.layout.keys,
        () => generateId('key')
      );
      generatedKeys.forEach((key) => newKeys.set(key.id, key));

      // Recalculate key positions
      const keyUpdates = recalculateZone(newZone, newKeys);
      keyUpdates.forEach((update, keyId) => {
        const existingKey = newKeys.get(keyId);
        if (existingKey) {
          newKeys.set(keyId, { ...existingKey, ...update });
        }
      });

      return {
        ...state,
        layout: { ...state.layout, zones: newZones, keys: newKeys },
        isDirty: true,
      };
    }

    case 'UPDATE_ZONE': {
      const { name, changes } = action.payload;
      const existingZone = state.layout.zones.get(name);
      if (!existingZone) return state;

      const updatedZone = { ...existingZone, ...changes };
      const newZones = new Map(state.layout.zones);
      newZones.set(name, updatedZone);

      // Generate missing keys (e.g. if columns/rows were added)
      const newKeys = new Map(state.layout.keys);
      const generatedKeys = generateMissingKeys(
        updatedZone,
        state.layout.keys,
        () => generateId('key')
      );
      generatedKeys.forEach((key) => newKeys.set(key.id, key));

      // Recalculate key positions for this zone
      const keyUpdates = recalculateZone(updatedZone, newKeys);

      keyUpdates.forEach((update, keyId) => {
        const existingKey = newKeys.get(keyId);
        if (existingKey) {
          newKeys.set(keyId, { ...existingKey, ...update });
        }
      });

      return {
        ...state,
        layout: { ...state.layout, zones: newZones, keys: newKeys },
        isDirty: true,
      };
    }

    case 'DELETE_ZONE': {
      const newZones = new Map(state.layout.zones);
      newZones.delete(action.payload);
      return {
        ...state,
        layout: { ...state.layout, zones: newZones },
        isDirty: true,
      };
    }

    case 'SET_LAYOUT':
      return {
        ...state,
        layout: action.payload,
        isDirty: false,
        selection: { keys: new Set(), zone: null },
      };

    case 'SAVE_HISTORY': {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      const entry: HistoryEntry = {
        layout: cloneLayout(state.layout),
        description: action.payload,
      };
      newHistory.push(entry);
      // Limit history to 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const prevEntry = state.history[state.historyIndex - 1];
      if (!prevEntry) return state;
      return {
        ...state,
        layout: cloneLayout(prevEntry.layout),
        historyIndex: state.historyIndex - 1,
        isDirty: true,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const nextEntry = state.history[state.historyIndex + 1];
      if (!nextEntry) return state;
      return {
        ...state,
        layout: cloneLayout(nextEntry.layout),
        historyIndex: state.historyIndex + 1,
        isDirty: true,
      };
    }

    case 'TOGGLE_GRID':
      return {
        ...state,
        grid: { ...state.grid, visible: !state.grid.visible },
      };

    case 'TOGGLE_SNAP':
      return {
        ...state,
        grid: { ...state.grid, snap: !state.grid.snap },
      };

    case 'SET_GRID_SIZE':
      return {
        ...state,
        grid: { ...state.grid, size: action.payload },
      };

    case 'SET_MIRROR':
      return {
        ...state,
        layout: {
          ...state.layout,
          mirror: { ...state.layout.mirror, ...action.payload },
        },
        isDirty: true,
      };

    case 'SET_GLOBAL_ROTATION':
      return {
        ...state,
        layout: { ...state.layout, globalRotation: action.payload },
        isDirty: true,
      };

    case 'UPDATE_META': {
      const newMeta = { ...state.layout.meta, ...action.payload };
      
      // Validate engine version if it's being updated
      if (action.payload.engine) {
        const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
        if (!semverRegex.test(action.payload.engine)) {
          // Ignore invalid engine version
          return state;
        }
      }

      return {
        ...state,
        layout: {
          ...state.layout,
          meta: newMeta,
        },
        isDirty: true,
      };
    }

    case 'MARK_CLEAN':
      return { ...state, isDirty: false };

    default:
      return state;
  }
}

// Direction type
type Direction = 'up' | 'down' | 'left' | 'right';

// Context type
interface LayoutEditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  // Convenience methods
  setMode: (mode: EditorMode) => void;
  zoom: (delta: number, center?: { x: number; y: number }) => void;
  pan: (dx: number, dy: number) => void;
  resetView: () => void;
  selectKey: (id: string, extend?: boolean) => void;
  selectKeys: (ids: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;
  addKey: (key?: Partial<EditorKey>) => void;
  addFirstKey: () => void;
  addKeyInDirection: (referenceKeyId: string, direction: Direction) => void;
  updateKey: (id: string, changes: Partial<EditorKey>) => void;
  deleteSelectedKeys: () => void;
  moveSelectedKeys: (dx: number, dy: number) => void;
  rotateSelectedKeys: (angle: number) => void;
  addZone: (name: string, zone?: Partial<EditorZone>) => void;
  updateZone: (name: string, changes: Partial<EditorZone>) => void;
  deleteZone: (name: string) => void;
  undo: () => void;
  redo: () => void;
  saveHistory: (description: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedKeys: EditorKey[];
  updateMeta: (changes: Partial<EditorLayout['meta']>) => void;
  // Add key overlay state
  showAddKeyOverlay: boolean;
  setShowAddKeyOverlay: (show: boolean) => void;
  handleAddKeyButtonClick: () => void;
}

const LayoutEditorContext = createContext<LayoutEditorContextType | null>(null);

/**
 * Provider component for the Layout Editor context.
 */
export function LayoutEditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, createInitialState());
  const [showAddKeyOverlay, setShowAddKeyOverlay] = useState(false);

  // Automatically show add key overlay when exactly one key is selected
  useEffect(() => {
    if (state.selection.keys.size === 1) {
      setShowAddKeyOverlay(true);
    } else {
      setShowAddKeyOverlay(false);
    }
  }, [state.selection.keys.size]);

  const setMode = useCallback(
    (mode: EditorMode) => dispatch({ type: 'SET_MODE', payload: mode }),
    []
  );

  const zoom = useCallback(
    (delta: number, center?: { x: number; y: number }) => {
      const oldZoom = state.viewport.zoom;
      const newZoom = Math.max(0.1, Math.min(5, oldZoom + delta));

      if (center) {
        // Calculate new pan to keep the point under mouse stationary
        // The formula is derived from:
        // worldPoint = (screenPoint - pan) / zoom
        // We want worldPoint to be the same before and after zoom
        // (center.x - oldPanX) / oldZoom = (center.x - newPanX) / newZoom
        // newPanX = center.x - (center.x - oldPanX) * (newZoom / oldZoom)

        const scaleChange = newZoom / oldZoom;
        const newPanX =
          center.x - (center.x - state.viewport.panX) * scaleChange;
        const newPanY =
          center.y - (center.y - state.viewport.panY) * scaleChange;

        dispatch({
          type: 'SET_VIEWPORT',
          payload: { zoom: newZoom, panX: newPanX, panY: newPanY },
        });
      } else {
        dispatch({ type: 'SET_VIEWPORT', payload: { zoom: newZoom } });
      }
    },
    [state.viewport.zoom, state.viewport.panX, state.viewport.panY]
  );

  const pan = useCallback(
    (dx: number, dy: number) => {
      dispatch({
        type: 'SET_VIEWPORT',
        payload: {
          panX: state.viewport.panX + dx,
          panY: state.viewport.panY + dy,
        },
      });
    },
    [state.viewport.panX, state.viewport.panY]
  );

  const resetView = useCallback(() => {
    dispatch({ type: 'SET_VIEWPORT', payload: { zoom: 1, panX: 0, panY: 0 } });
  }, []);

  const selectKey = useCallback(
    (id: string, extend = false) => {
      if (extend) {
        if (state.selection.keys.has(id)) {
          dispatch({ type: 'REMOVE_FROM_SELECTION', payload: id });
        } else {
          dispatch({ type: 'ADD_TO_SELECTION', payload: id });
        }
      } else {
        dispatch({
          type: 'SET_SELECTION',
          payload: { keys: new Set([id]), zone: null },
        });
      }
    },
    [state.selection.keys]
  );

  const selectKeys = useCallback((ids: string[]) => {
    dispatch({
      type: 'SET_SELECTION',
      payload: { keys: new Set(ids), zone: null },
    });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const selectAll = useCallback(() => {
    dispatch({ type: 'SELECT_ALL' });
  }, []);

  const addKey = useCallback((key?: Partial<EditorKey>) => {
    dispatch({ type: 'ADD_KEY', payload: key || {} });
    dispatch({ type: 'SAVE_HISTORY', payload: 'Add key' });
  }, []);

  const addFirstKey = useCallback(() => {
    // Add the first key at [0,0] with default zone, column, and row
    // Also create the default zone if it doesn't exist
    if (!state.layout.zones.has('matrix')) {
      dispatch({
        type: 'ADD_ZONE',
        payload: {
          name: 'matrix',
          columns: [
            {
              name: 'col1',
              spread: 19.05,
              stagger: 0,
              splay: 0,
              splayOrigin: [0, 0],
              ergogenProps: {},
            },
          ],
          rows: [{ name: 'row1', ergogenProps: {} }],
        },
      });
    }

    dispatch({
      type: 'ADD_KEY',
      payload: {
        x: 0,
        y: 0,
        zone: 'matrix',
        column: 'col1',
        row: 'row1',
        name: 'matrix_col1_row1',
      },
    });
    dispatch({ type: 'SAVE_HISTORY', payload: 'Add first key' });
  }, [state.layout.zones]);

  const addKeyInDirection = useCallback(
    (referenceKeyId: string, direction: Direction) => {
      dispatch({
        type: 'ADD_KEY_IN_DIRECTION',
        payload: { referenceKeyId, direction },
      });
      dispatch({ type: 'SAVE_HISTORY', payload: `Add key ${direction}` });
    },
    []
  );

  const updateKey = useCallback((id: string, changes: Partial<EditorKey>) => {
    dispatch({ type: 'UPDATE_KEY', payload: { id, changes } });
  }, []);

  const deleteSelectedKeys = useCallback(() => {
    const ids = Array.from(state.selection.keys);
    if (ids.length === 0) return;
    dispatch({ type: 'DELETE_KEYS', payload: ids });
    dispatch({ type: 'SAVE_HISTORY', payload: 'Delete keys' });
  }, [state.selection.keys]);

  const moveSelectedKeys = useCallback(
    (dx: number, dy: number) => {
      const ids = Array.from(state.selection.keys);
      if (ids.length === 0) return;
      dispatch({ type: 'MOVE_KEYS', payload: { ids, dx, dy } });
    },
    [state.selection.keys]
  );

  const rotateSelectedKeys = useCallback(
    (angle: number) => {
      const ids = Array.from(state.selection.keys);
      if (ids.length === 0) return;
      dispatch({ type: 'ROTATE_KEYS', payload: { ids, angle } });
    },
    [state.selection.keys]
  );

  const addZone = useCallback((name: string, zone?: Partial<EditorZone>) => {
    dispatch({ type: 'ADD_ZONE', payload: { ...zone, name } });
    dispatch({ type: 'SAVE_HISTORY', payload: `Add zone ${name}` });
  }, []);

  const updateZone = useCallback(
    (name: string, changes: Partial<EditorZone>) => {
      dispatch({ type: 'UPDATE_ZONE', payload: { name, changes } });
    },
    []
  );

  const deleteZone = useCallback((name: string) => {
    dispatch({ type: 'DELETE_ZONE', payload: name });
    dispatch({ type: 'SAVE_HISTORY', payload: `Delete zone ${name}` });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const saveHistory = useCallback((description: string) => {
    dispatch({ type: 'SAVE_HISTORY', payload: description });
  }, []);

  const updateMeta = useCallback((changes: Partial<EditorLayout['meta']>) => {
    dispatch({ type: 'UPDATE_META', payload: changes });
  }, []);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const selectedKeys = Array.from(state.selection.keys)
    .map((id) => state.layout.keys.get(id))
    .filter((k): k is EditorKey => k !== undefined);

  const handleAddKeyButtonClick = useCallback(() => {
    // If no keys exist, add the first key at [0,0]
    if (state.layout.keys.size === 0) {
      // Add the default zone if it doesn't exist
      if (!state.layout.zones.has('matrix')) {
        dispatch({
          type: 'ADD_ZONE',
          payload: {
            name: 'matrix',
            columns: [
              {
                name: 'col1',
                spread: 19.05,
                stagger: 0,
                splay: 0,
                splayOrigin: [0, 0],
                ergogenProps: {},
              },
            ],
            rows: [{ name: 'row1', ergogenProps: {} }],
          },
        });
      }

      dispatch({
        type: 'ADD_KEY',
        payload: {
          x: 0,
          y: 0,
          zone: 'matrix',
          column: 'col1',
          row: 'row1',
          name: 'matrix_col1_row1',
        },
      });
      dispatch({ type: 'SAVE_HISTORY', payload: 'Add first key' });
      return;
    }

    // If exactly one key is selected, show the overlay
    if (state.selection.keys.size === 1) {
      setShowAddKeyOverlay(true);
      return;
    }

    // Otherwise, switch to add-key mode for click-to-add behavior
    dispatch({ type: 'SET_MODE', payload: 'add-key' });
  }, [state.layout.keys.size, state.layout.zones, state.selection.keys.size]);

  const value: LayoutEditorContextType = {
    state,
    dispatch,
    setMode,
    zoom,
    pan,
    resetView,
    selectKey,
    selectKeys,
    clearSelection,
    selectAll,
    addKey,
    addFirstKey,
    addKeyInDirection,
    updateKey,
    deleteSelectedKeys,
    moveSelectedKeys,
    rotateSelectedKeys,
    addZone,
    updateZone,
    deleteZone,
    undo,
    redo,
    saveHistory,
    canUndo,
    canRedo,
    selectedKeys,
    updateMeta,
    showAddKeyOverlay,
    setShowAddKeyOverlay,
    handleAddKeyButtonClick,
  };

  return (
    <LayoutEditorContext.Provider value={value}>
      {children}
    </LayoutEditorContext.Provider>
  );
}

/**
 * Hook to access the Layout Editor context.
 */
export function useLayoutEditor(): LayoutEditorContextType {
  const context = useContext(LayoutEditorContext);
  if (!context) {
    throw new Error(
      'useLayoutEditor must be used within a LayoutEditorProvider'
    );
  }
  return context;
}
