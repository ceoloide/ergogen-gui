import React, { createContext, useContext } from 'react';
import { useLocalStorage } from 'react-use';

export interface GridState {
  size: number; // Major grid size in mm
  subdivisions: number; // Number of subdivisions
  enabled: boolean;
  displayUnit: 'mm' | 'U' | 'u';
}

export interface ViewState {
  x: number;
  y: number;
  k: number;
}

export interface InteractiveLayoutState {
  grid: GridState;
  view: ViewState;
  activeTool: 'select' | 'pan';
}

const DEFAULT_GRID: GridState = {
  size: 19.05,
  subdivisions: 8,
  enabled: true,
  displayUnit: 'U',
};

const DEFAULT_VIEW: ViewState = {
  x: 0,
  y: 0,
  k: 1,
};

const DEFAULT_STATE: InteractiveLayoutState = {
  grid: DEFAULT_GRID,
  view: DEFAULT_VIEW,
  activeTool: 'select',
};

interface InteractiveLayoutContextType {
  state: InteractiveLayoutState;
  setGrid: (grid: Partial<GridState>) => void;
  setViewState: (view: Partial<ViewState>) => void;
  setActiveTool: (tool: 'select' | 'pan') => void;
  resetView: () => void;
  resetAll: () => void;
}

const InteractiveLayoutContext = createContext<InteractiveLayoutContextType | null>(null);

export const useInteractiveLayoutContext = () => {
  const context = useContext(InteractiveLayoutContext);
  if (!context) {
    throw new Error('useInteractiveLayoutContext must be used within InteractiveLayoutProvider');
  }
  return context;
};

export const InteractiveLayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedState, setStoredState] = useLocalStorage<InteractiveLayoutState>(
    'interactive_layout_state',
    DEFAULT_STATE
  );

  // useLocalStorage might return undefined initially or if cleared, ensure we always have defaults
  const state: InteractiveLayoutState = {
    grid: { ...DEFAULT_GRID, ...(storedState?.grid || {}) },
    view: { ...DEFAULT_VIEW, ...(storedState?.view || {}) },
    activeTool: storedState?.activeTool || 'select',
  };

  const setGrid = (gridUpdate: Partial<GridState>) => {
    setStoredState({
      ...state,
      grid: { ...state.grid, ...gridUpdate },
    });
  };

  const setViewState = (viewUpdate: Partial<ViewState>) => {
    setStoredState({
      ...state,
      view: { ...state.view, ...viewUpdate },
    });
  };

  const setActiveTool = (tool: 'select' | 'pan') => {
    setStoredState({
      ...state,
      activeTool: tool,
    });
  };

  const resetView = () => {
    setStoredState({
      ...state,
      view: DEFAULT_VIEW,
    });
  };

  const resetAll = () => {
    setStoredState(DEFAULT_STATE);
  };

  return (
    <InteractiveLayoutContext.Provider value={{ state, setGrid, setViewState, setActiveTool, resetView, resetAll }}>
      {children}
    </InteractiveLayoutContext.Provider>
  );
};
