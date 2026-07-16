/**
 * Interactive keyboard layout canvas component.
 * Handles rendering of keys, grid, and user interactions.
 */

import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useCanvasEditor } from '../context/CanvasEditorContext';
import { CanvasKey, UNIT_TO_MM, isPointInKey, Point } from '../types/canvas';

/**
 * Canvas container with proper sizing
 */
const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.backgroundLight};
  overflow: hidden;
  position: relative;
`;

const StyledCanvas = styled.canvas`
  flex: 1;
  cursor: crosshair;

  &.tool-select {
    cursor: default;
  }

  &.tool-add {
    cursor: crosshair;
  }

  &.tool-move {
    cursor: move;
  }

  &.tool-rotate {
    cursor: grab;
  }

  &.tool-mirror-vertical,
  &.tool-mirror-horizontal {
    cursor: copy;
  }

  &.dragging {
    cursor: grabbing;
  }
`;

/**
 * Canvas rendering constants
 */
const KEY_FILL_COLOR = '#3a3a3a';
const KEY_STROKE_COLOR = '#5a5a5a';
const KEY_SELECTED_STROKE = theme.colors.accent;
const KEY_HOVER_STROKE = '#888888';
const GRID_COLOR = '#2a2a2a';
const GRID_MAJOR_COLOR = '#3a3a3a';
const SELECTION_RECT_FILL = 'rgba(40, 167, 69, 0.1)';
const SELECTION_RECT_STROKE = theme.colors.accent;

interface KeyboardCanvasProps {
  className?: string;
}

const KeyboardCanvas: React.FC<KeyboardCanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    state,
    dispatch,
    addKey,
    selectKey,
    selectKeys,
    clearSelection,
    moveSelected,
    pushHistory,
    setZoom,
    setPan,
  } = useCanvasEditor();

  const [hoveredKeyId, setHoveredKeyId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point | null>(null);

  // Convert screen coordinates to canvas/world coordinates
  const screenToWorld = useCallback(
    (screenX: number, screenY: number): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const x = (screenX - rect.left - state.pan.x) / state.zoom;
      const y = (screenY - rect.top - state.pan.y) / state.zoom;

      // Convert from screen Y (down is positive) to world Y (up is positive)
      const canvasHeight = canvas.height / state.zoom;
      return {
        x: x / (UNIT_TO_MM[state.grid.unit] * 2), // Scale to unit space
        y: (canvasHeight - y) / (UNIT_TO_MM[state.grid.unit] * 2),
      };
    },
    [state.pan, state.zoom, state.grid.unit]
  );

  // Find key at a given world position
  const findKeyAtPosition = useCallback(
    (worldPos: Point): CanvasKey | null => {
      // Check keys in reverse order (top keys first)
      for (let i = state.keys.length - 1; i >= 0; i--) {
        const key = state.keys[i];
        const pointInMM = {
          x: worldPos.x * UNIT_TO_MM[state.grid.unit],
          y: worldPos.y * UNIT_TO_MM[state.grid.unit],
        };
        if (isPointInKey(pointInMM, key, state.grid.unit)) {
          return key;
        }
      }
      return null;
    },
    [state.keys, state.grid.unit]
  );

  // Render the canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = theme.colors.background;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Apply transformations
    ctx.save();
    ctx.translate(state.pan.x, state.pan.y);
    ctx.scale(state.zoom, state.zoom);

    // Calculate scale: pixels per unit
    const pixelsPerUnit = UNIT_TO_MM[state.grid.unit] * 2;

    // Draw grid if visible
    if (state.grid.visible) {
      drawGrid(ctx, rect.width, rect.height, pixelsPerUnit);
    }

    // Flip Y axis for Ergogen convention (up is positive)
    ctx.save();
    ctx.translate(0, rect.height / state.zoom);
    ctx.scale(1, -1);

    // Draw keys
    for (const key of state.keys) {
      drawKey(ctx, key, pixelsPerUnit);
    }

    ctx.restore();

    // Draw selection rectangle (in screen space)
    if (
      state.selection.isSelecting &&
      state.selection.selectionStart &&
      state.selection.selectionEnd
    ) {
      drawSelectionRect(
        ctx,
        state.selection.selectionStart,
        state.selection.selectionEnd
      );
    }

    ctx.restore();
  }, [state, hoveredKeyId]);

  // Draw grid
  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    pixelsPerUnit: number
  ) => {
    const gridSizeInPixels = state.grid.size * pixelsPerUnit;
    const majorGridInterval = 5; // Every 5 lines is a major line

    // Calculate grid offset based on pan
    const offsetX = state.pan.x % gridSizeInPixels;
    const offsetY = state.pan.y % gridSizeInPixels;

    ctx.save();
    ctx.lineWidth = 1 / state.zoom;

    // Draw minor grid lines
    ctx.strokeStyle = GRID_COLOR;
    ctx.beginPath();

    for (
      let x = -gridSizeInPixels;
      x < width / state.zoom + gridSizeInPixels;
      x += gridSizeInPixels
    ) {
      const screenX = x - offsetX / state.zoom;
      ctx.moveTo(screenX, -height / state.zoom);
      ctx.lineTo(screenX, (height / state.zoom) * 2);
    }

    for (
      let y = -gridSizeInPixels;
      y < height / state.zoom + gridSizeInPixels;
      y += gridSizeInPixels
    ) {
      const screenY = y - offsetY / state.zoom;
      ctx.moveTo(-width / state.zoom, screenY);
      ctx.lineTo((width / state.zoom) * 2, screenY);
    }

    ctx.stroke();

    // Draw major grid lines
    const majorGridSize = gridSizeInPixels * majorGridInterval;
    ctx.strokeStyle = GRID_MAJOR_COLOR;
    ctx.lineWidth = 2 / state.zoom;
    ctx.beginPath();

    const majorOffsetX = state.pan.x % majorGridSize;
    const majorOffsetY = state.pan.y % majorGridSize;

    for (
      let x = -majorGridSize;
      x < width / state.zoom + majorGridSize;
      x += majorGridSize
    ) {
      const screenX = x - majorOffsetX / state.zoom;
      ctx.moveTo(screenX, -height / state.zoom);
      ctx.lineTo(screenX, (height / state.zoom) * 2);
    }

    for (
      let y = -majorGridSize;
      y < height / state.zoom + majorGridSize;
      y += majorGridSize
    ) {
      const screenY = y - majorOffsetY / state.zoom;
      ctx.moveTo(-width / state.zoom, screenY);
      ctx.lineTo((width / state.zoom) * 2, screenY);
    }

    ctx.stroke();

    // Draw origin axes
    ctx.strokeStyle = theme.colors.accent;
    ctx.lineWidth = 2 / state.zoom;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(-width / state.zoom, 0);
    ctx.lineTo((width / state.zoom) * 2, 0);
    ctx.moveTo(0, -height / state.zoom);
    ctx.lineTo(0, (height / state.zoom) * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.restore();
  };

  // Draw a single key
  const drawKey = (
    ctx: CanvasRenderingContext2D,
    key: CanvasKey,
    pixelsPerUnit: number
  ) => {
    const isSelected = state.selection.selectedKeys.has(key.id);
    const isHovered = hoveredKeyId === key.id;

    const x = key.x * pixelsPerUnit;
    const y = key.y * pixelsPerUnit;
    const width = key.width * pixelsPerUnit;
    const height = key.height * pixelsPerUnit;

    ctx.save();

    // Move to key position and apply rotation
    ctx.translate(x, y);
    ctx.rotate((key.rotation * Math.PI) / 180);

    // Draw key body
    ctx.fillStyle = KEY_FILL_COLOR;
    ctx.strokeStyle = isSelected
      ? KEY_SELECTED_STROKE
      : isHovered
        ? KEY_HOVER_STROKE
        : KEY_STROKE_COLOR;
    ctx.lineWidth = isSelected ? 3 / state.zoom : 2 / state.zoom;

    const cornerRadius = 4 / state.zoom;
    roundRect(ctx, -width / 2, -height / 2, width, height, cornerRadius);
    ctx.fill();
    ctx.stroke();

    // Draw inner keycap area
    const innerPadding = pixelsPerUnit * 0.1;
    ctx.fillStyle = isSelected ? 'rgba(40, 167, 69, 0.2)' : '#4a4a4a';
    roundRect(
      ctx,
      -width / 2 + innerPadding,
      -height / 2 + innerPadding,
      width - innerPadding * 2,
      height - innerPadding * 2,
      cornerRadius
    );
    ctx.fill();

    // Draw label (flip text back since canvas is flipped)
    if (key.label) {
      ctx.save();
      ctx.scale(1, -1);
      ctx.fillStyle = theme.colors.text;
      ctx.font = `${12 / state.zoom}px ${theme.fonts.body}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(key.label, 0, 0);
      ctx.restore();
    }

    ctx.restore();
  };

  // Draw selection rectangle
  const drawSelectionRect = (
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point
  ) => {
    const minX = Math.min(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    ctx.fillStyle = SELECTION_RECT_FILL;
    ctx.strokeStyle = SELECTION_RECT_STROKE;
    ctx.lineWidth = 1 / state.zoom;
    ctx.setLineDash([5 / state.zoom, 5 / state.zoom]);
    ctx.fillRect(minX, minY, width, height);
    ctx.strokeRect(minX, minY, width, height);
    ctx.setLineDash([]);
  };

  // Helper function to draw rounded rectangles
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const worldPos = screenToWorld(e.clientX, e.clientY);

      // Middle mouse button for panning
      if (e.button === 1) {
        e.preventDefault();
        setIsPanning(true);
        setPanStart({ x: e.clientX - state.pan.x, y: e.clientY - state.pan.y });
        return;
      }

      if (e.button !== 0) return; // Only handle left click

      const keyAtPos = findKeyAtPosition(worldPos);

      switch (state.tool) {
        case 'select':
          if (keyAtPos) {
            if (e.ctrlKey || e.metaKey) {
              selectKey(keyAtPos.id, true);
            } else if (!state.selection.selectedKeys.has(keyAtPos.id)) {
              selectKeys([keyAtPos.id]);
            }
            // Start dragging
            setIsDragging(true);
            setDragStart(worldPos);
          } else {
            // Start selection rectangle
            if (!e.ctrlKey && !e.metaKey) {
              clearSelection();
            }
            const canvas = canvasRef.current!;
            const rect = canvas.getBoundingClientRect();
            dispatch({
              type: 'START_SELECTION_RECT',
              start: {
                x: (e.clientX - rect.left - state.pan.x) / state.zoom,
                y: (e.clientY - rect.top - state.pan.y) / state.zoom,
              },
            });
          }
          break;

        case 'add': {
          pushHistory();
          const snappedX = state.grid.snap
            ? Math.round(worldPos.x / state.grid.size) * state.grid.size
            : worldPos.x;
          const snappedY = state.grid.snap
            ? Math.round(worldPos.y / state.grid.size) * state.grid.size
            : worldPos.y;
          addKey(snappedX, snappedY);
          break;
        }

        case 'move':
          if (keyAtPos && !state.selection.selectedKeys.has(keyAtPos.id)) {
            selectKeys([keyAtPos.id]);
          }
          if (state.selection.selectedKeys.size > 0 || keyAtPos) {
            setIsDragging(true);
            setDragStart(worldPos);
          }
          break;

        case 'rotate':
          // Start rotation - will handle in mouse move
          if (state.selection.selectedKeys.size > 0) {
            setIsDragging(true);
            setDragStart(worldPos);
          }
          break;

        case 'mirror-vertical':
        case 'mirror-horizontal':
          // Mirror is applied on click
          if (state.selection.selectedKeys.size > 0) {
            pushHistory();
            dispatch({
              type: 'MIRROR_SELECTED',
              axis:
                state.tool === 'mirror-vertical' ? 'vertical' : 'horizontal',
              origin:
                state.tool === 'mirror-vertical' ? worldPos.x : worldPos.y,
            });
          }
          break;
      }
    },
    [
      state,
      screenToWorld,
      findKeyAtPosition,
      selectKey,
      selectKeys,
      clearSelection,
      addKey,
      pushHistory,
      dispatch,
    ]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const worldPos = screenToWorld(e.clientX, e.clientY);

      // Handle panning
      if (isPanning && panStart) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
        return;
      }

      // Update hovered key
      const keyAtPos = findKeyAtPosition(worldPos);
      setHoveredKeyId(keyAtPos?.id || null);

      // Handle selection rectangle
      if (state.selection.isSelecting) {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        dispatch({
          type: 'UPDATE_SELECTION_RECT',
          end: {
            x: (e.clientX - rect.left - state.pan.x) / state.zoom,
            y: (e.clientY - rect.top - state.pan.y) / state.zoom,
          },
        });
        return;
      }

      // Handle dragging
      if (isDragging && dragStart) {
        const dx = worldPos.x - dragStart.x;
        const dy = worldPos.y - dragStart.y;

        if (state.tool === 'rotate') {
          // Calculate rotation angle based on mouse movement
          const selectedKeys = state.keys.filter((k) =>
            state.selection.selectedKeys.has(k.id)
          );
          if (selectedKeys.length > 0) {
            const center = {
              x:
                selectedKeys.reduce((sum, k) => sum + k.x, 0) /
                selectedKeys.length,
              y:
                selectedKeys.reduce((sum, k) => sum + k.y, 0) /
                selectedKeys.length,
            };
            const startAngle = Math.atan2(
              dragStart.y - center.y,
              dragStart.x - center.x
            );
            const currentAngle = Math.atan2(
              worldPos.y - center.y,
              worldPos.x - center.x
            );
            const angleDiff = ((currentAngle - startAngle) * 180) / Math.PI;

            // Snap to 15-degree increments if shift is held
            const snappedAngle = e.shiftKey
              ? Math.round(angleDiff / 15) * 15
              : angleDiff;

            dispatch({
              type: 'ROTATE_SELECTED',
              angle: snappedAngle,
              origin: center,
            });
            setDragStart(worldPos);
          }
        } else if (state.tool === 'select' || state.tool === 'move') {
          // Snap movement to grid if enabled
          const snapDx = state.grid.snap
            ? Math.round(dx / state.grid.size) * state.grid.size
            : dx;
          const snapDy = state.grid.snap
            ? Math.round(dy / state.grid.size) * state.grid.size
            : dy;

          if (snapDx !== 0 || snapDy !== 0) {
            moveSelected(snapDx, snapDy);
            setDragStart({
              x: dragStart.x + snapDx,
              y: dragStart.y + snapDy,
            });
          }
        }
      }
    },
    [
      state,
      screenToWorld,
      findKeyAtPosition,
      isPanning,
      panStart,
      isDragging,
      dragStart,
      setPan,
      moveSelected,
      dispatch,
    ]
  );

  const handleMouseUp = useCallback(
    (_e: React.MouseEvent<HTMLCanvasElement>) => {
      // End panning
      if (isPanning) {
        setIsPanning(false);
        setPanStart(null);
        return;
      }

      // End selection rectangle
      if (
        state.selection.isSelecting &&
        state.selection.selectionStart &&
        state.selection.selectionEnd
      ) {
        const canvas = canvasRef.current!;
        const height = canvas.height / window.devicePixelRatio;

        // Find keys within selection rectangle
        const minX = Math.min(
          state.selection.selectionStart.x,
          state.selection.selectionEnd.x
        );
        const maxX = Math.max(
          state.selection.selectionStart.x,
          state.selection.selectionEnd.x
        );
        const minY = Math.min(
          state.selection.selectionStart.y,
          state.selection.selectionEnd.y
        );
        const maxY = Math.max(
          state.selection.selectionStart.y,
          state.selection.selectionEnd.y
        );

        const pixelsPerUnit = UNIT_TO_MM[state.grid.unit] * 2;

        // Convert screen rect to world coordinates
        const worldMinX = minX / pixelsPerUnit;
        const worldMaxX = maxX / pixelsPerUnit;
        // Flip Y coordinates since canvas is flipped
        const worldMinY = (height / state.zoom - maxY) / pixelsPerUnit;
        const worldMaxY = (height / state.zoom - minY) / pixelsPerUnit;

        const keysInRect = state.keys
          .filter((key) => {
            const kx = key.x;
            const ky = key.y;
            const hw = key.width / 2;
            const hh = key.height / 2;

            // Check if key bounds overlap with selection rect
            return (
              kx + hw >= worldMinX &&
              kx - hw <= worldMaxX &&
              ky + hh >= worldMinY &&
              ky - hh <= worldMaxY
            );
          })
          .map((k) => k.id);

        dispatch({ type: 'END_SELECTION_RECT', keysInRect });
      }

      // End dragging and push history if we moved
      if (isDragging) {
        pushHistory();
        setIsDragging(false);
        setDragStart(null);
      }
    },
    [state, isDragging, isPanning, pushHistory, dispatch]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Zoom
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(5, state.zoom * delta));

        // Zoom towards mouse position
        const rect = canvasRef.current!.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newPanX =
          mouseX - (mouseX - state.pan.x) * (newZoom / state.zoom);
        const newPanY =
          mouseY - (mouseY - state.pan.y) * (newZoom / state.zoom);

        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });
      } else {
        // Pan
        setPan({
          x: state.pan.x - e.deltaX,
          y: state.pan.y - e.deltaY,
        });
      }
    },
    [state.zoom, state.pan, setZoom, setPan]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const step = state.grid.snap ? state.grid.size : 0.1;

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          if (state.selection.selectedKeys.size > 0) {
            e.preventDefault();
            pushHistory();
            dispatch({
              type: 'DELETE_KEYS',
              ids: Array.from(state.selection.selectedKeys),
            });
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (state.selection.selectedKeys.size > 0) {
            moveSelected(0, step);
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (state.selection.selectedKeys.size > 0) {
            moveSelected(0, -step);
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (state.selection.selectedKeys.size > 0) {
            moveSelected(-step, 0);
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (state.selection.selectedKeys.size > 0) {
            moveSelected(step, 0);
          }
          break;

        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            dispatch({ type: 'SELECT_ALL' });
          }
          break;

        case 'c':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            dispatch({ type: 'COPY_SELECTED' });
          }
          break;

        case 'v':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            pushHistory();
            dispatch({ type: 'PASTE' });
          }
          break;

        case 'z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) {
              dispatch({ type: 'REDO' });
            } else {
              dispatch({ type: 'UNDO' });
            }
          }
          break;

        case 'y':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            dispatch({ type: 'REDO' });
          }
          break;

        case 'Escape':
          clearSelection();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, moveSelected, clearSelection, pushHistory, dispatch]);

  // Render loop
  useEffect(() => {
    let animationFrame: number;

    const loop = () => {
      render();
      animationFrame = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrame);
  }, [render]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      render();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  const cursorClass = useMemo(() => {
    if (isDragging) return 'dragging';
    return `tool-${state.tool}`;
  }, [state.tool, isDragging]);

  return (
    <CanvasContainer ref={containerRef} className={className}>
      <StyledCanvas
        ref={canvasRef}
        className={cursorClass}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      />
    </CanvasContainer>
  );
};

export default KeyboardCanvas;
