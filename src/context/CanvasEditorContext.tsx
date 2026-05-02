/**
 * Context for managing the canvas keyboard layout editor state.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import {
  CanvasKey,
  CanvasTool,
  GridSettings,
  SelectionState,
  DEFAULT_GRID_SETTINGS,
  createKey,
  generateKeyId,
  snapToGrid,
} from '../types/canvas';

/**
 * Canvas editor state
 */
interface CanvasEditorState {
  keys: CanvasKey[];
  tool: CanvasTool;
  selection: SelectionState;
  grid: GridSettings;
  rotationLock: boolean;
  zoom: number;
  pan: { x: number; y: number };
  history: CanvasKey[][];
  historyIndex: number;
  clipboard: CanvasKey[];
}

/**
 * Actions for the canvas editor
 */
type CanvasAction =
  | { type: 'SET_TOOL'; tool: CanvasTool }
  | { type: 'SET_KEYS'; keys: CanvasKey[] }
  | { type: 'ADD_KEY'; key: CanvasKey }
  | { type: 'UPDATE_KEY'; id: string; updates: Partial<CanvasKey> }
  | { type: 'DELETE_KEYS'; ids: string[] }
  | { type: 'SELECT_KEY'; id: string; addToSelection?: boolean }
  | { type: 'SELECT_KEYS'; ids: string[] }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SELECT_ALL' }
  | { type: 'START_SELECTION_RECT'; start: { x: number; y: number } }
  | { type: 'UPDATE_SELECTION_RECT'; end: { x: number; y: number } }
  | { type: 'END_SELECTION_RECT'; keysInRect: string[] }
  | { type: 'SET_GRID'; settings: Partial<GridSettings> }
  | { type: 'SET_ROTATION_LOCK'; enabled: boolean }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_PAN'; pan: { x: number; y: number } }
  | { type: 'MOVE_SELECTED'; dx: number; dy: number }
  | {
      type: 'ROTATE_SELECTED';
      angle: number;
      origin?: { x: number; y: number };
    }
  | {
      type: 'MIRROR_SELECTED';
      axis: 'vertical' | 'horizontal';
      origin?: number;
    }
  | { type: 'COPY_SELECTED' }
  | { type: 'PASTE' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'PUSH_HISTORY' };

/**
 * Initial state
 */
const initialState: CanvasEditorState = {
  keys: [],
  tool: 'select',
  selection: {
    selectedKeys: new Set(),
    isSelecting: false,
    selectionStart: null,
    selectionEnd: null,
  },
  grid: DEFAULT_GRID_SETTINGS,
  rotationLock: false,
  zoom: 1,
  pan: { x: 0, y: 0 },
  history: [[]],
  historyIndex: 0,
  clipboard: [],
};

/**
 * Maximum history size
 */
const MAX_HISTORY = 50;

/**
 * Reducer for canvas editor state
 */
function canvasReducer(
  state: CanvasEditorState,
  action: CanvasAction
): CanvasEditorState {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, tool: action.tool };

    case 'SET_KEYS':
      return { ...state, keys: action.keys };

    case 'ADD_KEY':
      return { ...state, keys: [...state.keys, action.key] };

    case 'UPDATE_KEY':
      return {
        ...state,
        keys: state.keys.map((key) =>
          key.id === action.id ? { ...key, ...action.updates } : key
        ),
      };

    case 'DELETE_KEYS': {
      const idsToDelete = new Set(action.ids);
      return {
        ...state,
        keys: state.keys.filter((key) => !idsToDelete.has(key.id)),
        selection: {
          ...state.selection,
          selectedKeys: new Set(
            Array.from(state.selection.selectedKeys).filter(
              (id) => !idsToDelete.has(id)
            )
          ),
        },
      };
    }

    case 'SELECT_KEY': {
      const newSelection = new Set(
        action.addToSelection ? state.selection.selectedKeys : []
      );
      if (newSelection.has(action.id)) {
        newSelection.delete(action.id);
      } else {
        newSelection.add(action.id);
      }
      return {
        ...state,
        selection: { ...state.selection, selectedKeys: newSelection },
      };
    }

    case 'SELECT_KEYS':
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedKeys: new Set(action.ids),
        },
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedKeys: new Set(),
          isSelecting: false,
          selectionStart: null,
          selectionEnd: null,
        },
      };

    case 'SELECT_ALL':
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedKeys: new Set(state.keys.map((k) => k.id)),
        },
      };

    case 'START_SELECTION_RECT':
      return {
        ...state,
        selection: {
          ...state.selection,
          isSelecting: true,
          selectionStart: action.start,
          selectionEnd: action.start,
        },
      };

    case 'UPDATE_SELECTION_RECT':
      return {
        ...state,
        selection: {
          ...state.selection,
          selectionEnd: action.end,
        },
      };

    case 'END_SELECTION_RECT':
      return {
        ...state,
        selection: {
          ...state.selection,
          isSelecting: false,
          selectionStart: null,
          selectionEnd: null,
          selectedKeys: new Set(action.keysInRect),
        },
      };

    case 'SET_GRID':
      return {
        ...state,
        grid: { ...state.grid, ...action.settings },
      };

    case 'SET_ROTATION_LOCK':
      return { ...state, rotationLock: action.enabled };

    case 'SET_ZOOM':
      return { ...state, zoom: Math.max(0.1, Math.min(5, action.zoom)) };

    case 'SET_PAN':
      return { ...state, pan: action.pan };

    case 'MOVE_SELECTED': {
      const selectedIds = state.selection.selectedKeys;
      if (selectedIds.size === 0) return state;

      return {
        ...state,
        keys: state.keys.map((key) => {
          if (!selectedIds.has(key.id)) return key;

          if (state.rotationLock && key.rotation !== 0) {
            // When rotation lock is enabled, movement occurs in normal coordinate space
            // The rotation origin moves with the key
            return {
              ...key,
              x: key.x + action.dx,
              y: key.y + action.dy,
            };
          } else if (key.rotation !== 0) {
            // When rotation lock is disabled, keys move in their rotated coordinate space
            const rad = (key.rotation * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            const rotatedDx = action.dx * cos + action.dy * sin;
            const rotatedDy = -action.dx * sin + action.dy * cos;
            return {
              ...key,
              x: key.x + rotatedDx,
              y: key.y + rotatedDy,
            };
          } else {
            return {
              ...key,
              x: key.x + action.dx,
              y: key.y + action.dy,
            };
          }
        }),
      };
    }

    case 'ROTATE_SELECTED': {
      const selectedIds = state.selection.selectedKeys;
      if (selectedIds.size === 0) return state;

      // Calculate selection center if no origin provided
      const selectedKeys = state.keys.filter((k) => selectedIds.has(k.id));
      const origin = action.origin || {
        x: selectedKeys.reduce((sum, k) => sum + k.x, 0) / selectedKeys.length,
        y: selectedKeys.reduce((sum, k) => sum + k.y, 0) / selectedKeys.length,
      };

      const rad = (action.angle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      return {
        ...state,
        keys: state.keys.map((key) => {
          if (!selectedIds.has(key.id)) return key;

          // Rotate position around origin
          const dx = key.x - origin.x;
          const dy = key.y - origin.y;
          const newX = origin.x + dx * cos - dy * sin;
          const newY = origin.y + dx * sin + dy * cos;

          return {
            ...key,
            x: newX,
            y: newY,
            rotation: (key.rotation + action.angle) % 360,
          };
        }),
      };
    }

    case 'MIRROR_SELECTED': {
      const selectedIds = state.selection.selectedKeys;
      if (selectedIds.size === 0) return state;

      const selectedKeys = state.keys.filter((k) => selectedIds.has(k.id));

      // Calculate mirror axis if not provided
      const axis =
        action.origin ??
        (action.axis === 'vertical'
          ? Math.max(...selectedKeys.map((k) => k.x)) + 0.5
          : Math.max(...selectedKeys.map((k) => k.y)) + 0.5);

      // Create mirrored copies
      const mirroredKeys = selectedKeys.map((key) => {
        const newKey = { ...key, id: generateKeyId(), mirrored: !key.mirrored };
        if (action.axis === 'vertical') {
          newKey.x = 2 * axis - key.x;
          newKey.rotation = -key.rotation;
        } else {
          newKey.y = 2 * axis - key.y;
          newKey.rotation = -key.rotation;
        }
        return newKey;
      });

      return {
        ...state,
        keys: [...state.keys, ...mirroredKeys],
        selection: {
          ...state.selection,
          selectedKeys: new Set(mirroredKeys.map((k) => k.id)),
        },
      };
    }

    case 'COPY_SELECTED': {
      const selectedKeys = state.keys.filter((k) =>
        state.selection.selectedKeys.has(k.id)
      );
      return { ...state, clipboard: selectedKeys };
    }

    case 'PASTE': {
      if (state.clipboard.length === 0) return state;

      // Offset pasted keys slightly
      const pastedKeys = state.clipboard.map((key) => ({
        ...key,
        id: generateKeyId(),
        x: key.x + 1,
        y: key.y + 1,
      }));

      return {
        ...state,
        keys: [...state.keys, ...pastedKeys],
        selection: {
          ...state.selection,
          selectedKeys: new Set(pastedKeys.map((k) => k.id)),
        },
      };
    }

    case 'PUSH_HISTORY': {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.keys]);
      if (newHistory.length > MAX_HISTORY) {
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
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        keys: [...state.history[newIndex]],
        historyIndex: newIndex,
        selection: { ...state.selection, selectedKeys: new Set() },
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        keys: [...state.history[newIndex]],
        historyIndex: newIndex,
        selection: { ...state.selection, selectedKeys: new Set() },
      };
    }

    default:
      return state;
  }
}

/**
 * Context value type
 */
interface CanvasEditorContextValue {
  state: CanvasEditorState;
  dispatch: React.Dispatch<CanvasAction>;
  // Convenience methods
  setTool: (tool: CanvasTool) => void;
  addKey: (x: number, y: number, overrides?: Partial<CanvasKey>) => void;
  updateKey: (id: string, updates: Partial<CanvasKey>) => void;
  deleteSelectedKeys: () => void;
  selectKey: (id: string, addToSelection?: boolean) => void;
  selectKeys: (ids: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;
  moveSelected: (dx: number, dy: number) => void;
  rotateSelected: (angle: number, origin?: { x: number; y: number }) => void;
  mirrorSelected: (axis: 'vertical' | 'horizontal', origin?: number) => void;
  copySelected: () => void;
  paste: () => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  setGrid: (settings: Partial<GridSettings>) => void;
  setRotationLock: (enabled: boolean) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  snapValue: (value: number) => number;
  getSelectedKeys: () => CanvasKey[];
}

const CanvasEditorContext = createContext<CanvasEditorContextValue | null>(
  null
);

/**
 * Canvas editor provider component
 */
export function CanvasEditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  const setTool = useCallback((tool: CanvasTool) => {
    dispatch({ type: 'SET_TOOL', tool });
  }, []);

  const addKey = useCallback(
    (x: number, y: number, overrides?: Partial<CanvasKey>) => {
      const id = generateKeyId();
      const snappedX = state.grid.snap ? snapToGrid(x, state.grid.size) : x;
      const snappedY = state.grid.snap ? snapToGrid(y, state.grid.size) : y;
      dispatch({
        type: 'ADD_KEY',
        key: createKey(id, snappedX, snappedY, overrides),
      });
    },
    [state.grid.snap, state.grid.size]
  );

  const updateKey = useCallback((id: string, updates: Partial<CanvasKey>) => {
    dispatch({ type: 'UPDATE_KEY', id, updates });
  }, []);

  const deleteSelectedKeys = useCallback(() => {
    dispatch({
      type: 'DELETE_KEYS',
      ids: Array.from(state.selection.selectedKeys),
    });
  }, [state.selection.selectedKeys]);

  const selectKey = useCallback((id: string, addToSelection?: boolean) => {
    dispatch({ type: 'SELECT_KEY', id, addToSelection });
  }, []);

  const selectKeys = useCallback((ids: string[]) => {
    dispatch({ type: 'SELECT_KEYS', ids });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const selectAll = useCallback(() => {
    dispatch({ type: 'SELECT_ALL' });
  }, []);

  const moveSelected = useCallback((dx: number, dy: number) => {
    dispatch({ type: 'MOVE_SELECTED', dx, dy });
  }, []);

  const rotateSelected = useCallback(
    (angle: number, origin?: { x: number; y: number }) => {
      dispatch({ type: 'ROTATE_SELECTED', angle, origin });
    },
    []
  );

  const mirrorSelected = useCallback(
    (axis: 'vertical' | 'horizontal', origin?: number) => {
      dispatch({ type: 'MIRROR_SELECTED', axis, origin });
    },
    []
  );

  const copySelected = useCallback(() => {
    dispatch({ type: 'COPY_SELECTED' });
  }, []);

  const paste = useCallback(() => {
    dispatch({ type: 'PASTE' });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const pushHistory = useCallback(() => {
    dispatch({ type: 'PUSH_HISTORY' });
  }, []);

  const setGrid = useCallback((settings: Partial<GridSettings>) => {
    dispatch({ type: 'SET_GRID', settings });
  }, []);

  const setRotationLock = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_ROTATION_LOCK', enabled });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', zoom });
  }, []);

  const setPan = useCallback((pan: { x: number; y: number }) => {
    dispatch({ type: 'SET_PAN', pan });
  }, []);

  const snapValue = useCallback(
    (value: number) => {
      if (!state.grid.snap) return value;
      return snapToGrid(value, state.grid.size);
    },
    [state.grid.snap, state.grid.size]
  );

  const getSelectedKeys = useCallback(() => {
    return state.keys.filter((k) => state.selection.selectedKeys.has(k.id));
  }, [state.keys, state.selection.selectedKeys]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      setTool,
      addKey,
      updateKey,
      deleteSelectedKeys,
      selectKey,
      selectKeys,
      clearSelection,
      selectAll,
      moveSelected,
      rotateSelected,
      mirrorSelected,
      copySelected,
      paste,
      undo,
      redo,
      pushHistory,
      setGrid,
      setRotationLock,
      setZoom,
      setPan,
      snapValue,
      getSelectedKeys,
    }),
    [
      state,
      setTool,
      addKey,
      updateKey,
      deleteSelectedKeys,
      selectKey,
      selectKeys,
      clearSelection,
      selectAll,
      moveSelected,
      rotateSelected,
      mirrorSelected,
      copySelected,
      paste,
      undo,
      redo,
      pushHistory,
      setGrid,
      setRotationLock,
      setZoom,
      setPan,
      snapValue,
      getSelectedKeys,
    ]
  );

  return (
    <CanvasEditorContext.Provider value={value}>
      {children}
    </CanvasEditorContext.Provider>
  );
}

/**
 * Hook to use the canvas editor context
 */
export function useCanvasEditor(): CanvasEditorContextValue {
  const context = useContext(CanvasEditorContext);
  if (!context) {
    throw new Error(
      'useCanvasEditor must be used within a CanvasEditorProvider'
    );
  }
  return context;
}
