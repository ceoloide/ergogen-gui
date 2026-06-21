import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorToolbar } from './EditorToolbar';
import { useLayoutEditor } from '../LayoutEditorContext';

// Mock the context hook
jest.mock('../LayoutEditorContext', () => ({
  useLayoutEditor: jest.fn(),
}));

// Mock the theme
jest.mock('../../theme/theme', () => ({
  theme: {
    colors: {
      background: '#222',
      border: '#444',
      textDarkest: '#999',
      accent: '#28a745',
      white: '#fff',
      textDark: '#ccc',
      buttonHover: '#333',
      accentDark: '#1e7b34',
    },
  },
}));

describe('EditorToolbar', () => {
  const mockZoom = jest.fn();
  const mockResetView = jest.fn();
  const mockSetMode = jest.fn();
  const mockDeleteSelectedKeys = jest.fn();
  const mockUndo = jest.fn();
  const mockRedo = jest.fn();
  const mockHandleAddKeyButtonClick = jest.fn();

  const defaultContext = {
    state: {
      mode: 'select',
      selection: { keys: new Set() },
    },
    setMode: mockSetMode,
    deleteSelectedKeys: mockDeleteSelectedKeys,
    undo: mockUndo,
    redo: mockRedo,
    canUndo: false,
    canRedo: false,
    handleAddKeyButtonClick: mockHandleAddKeyButtonClick,
    zoom: mockZoom,
    resetView: mockResetView,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useLayoutEditor as jest.Mock).mockReturnValue(defaultContext);
  });

  it('should call zoom with 0.1 when Zoom In is clicked', () => {
    render(<EditorToolbar />);
    const zoomInButton = screen.getByTitle('Zoom In');
    fireEvent.click(zoomInButton);
    expect(mockZoom).toHaveBeenCalledWith(0.1);
  });

  it('should call zoom with -0.1 when Zoom Out is clicked', () => {
    render(<EditorToolbar />);
    const zoomOutButton = screen.getByTitle('Zoom Out');
    fireEvent.click(zoomOutButton);
    expect(mockZoom).toHaveBeenCalledWith(-0.1);
  });

  it('should call resetView when Fit to View is clicked', () => {
    render(<EditorToolbar />);
    const fitButton = screen.getByTitle('Fit to View');
    fireEvent.click(fitButton);
    expect(mockResetView).toHaveBeenCalled();
  });
});
