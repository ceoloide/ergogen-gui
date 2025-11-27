/**
 * LayoutCanvas - The main visual canvas for the keyboard layout editor.
 * Renders keys and handles mouse interactions for selection, movement, and rotation.
 */
import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useLayoutEditor } from '../LayoutEditorContext';
import { EditorKey, PIXELS_PER_UNIT } from '../types';
import { theme } from '../../theme/theme';
import { AddKeyOverlay, CardinalDirection } from './AddKeyOverlay';

// Canvas container with dark background
const CanvasContainer = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
  background-color: ${theme.colors.backgroundLight};
  cursor: default;
  user-select: none;
`;

// The actual canvas element
const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
`;

// Grid overlay canvas
const GridCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`;

// Selection rectangle overlay
const SelectionRect = styled.div<{
  $left: number;
  $top: number;
  $width: number;
  $height: number;
}>`
  position: absolute;
  left: ${(p) => p.$left}px;
  top: ${(p) => p.$top}px;
  width: ${(p) => p.$width}px;
  height: ${(p) => p.$height}px;
  border: 2px dashed ${theme.colors.accent};
  background-color: rgba(40, 167, 69, 0.1);
  pointer-events: none;
`;

// Status bar at the bottom
const StatusBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background-color: ${theme.colors.background};
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 24px;
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.textDark};
`;

const StatusItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StatusDot = styled.span<{ $active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(p) =>
    p.$active ? theme.colors.accent : theme.colors.textDarkest};
`;

interface LayoutCanvasProps {
  className?: string;
}

/**
 * Renders a single key on the canvas.
 */
function renderKey(
  ctx: CanvasRenderingContext2D,
  key: EditorKey,
  isSelected: boolean,
  zoom: number,
  panX: number,
  panY: number
) {
  const scale = PIXELS_PER_UNIT * zoom;
  const x = key.x * scale + panX;
  // Flip Y axis: positive Y goes up, negative Y goes down
  const y = -key.y * scale + panY - key.height * scale;
  const width = key.width * scale;
  const height = key.height * scale;

  ctx.save();

  // Apply rotation around key center
  if (key.rotation !== 0) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((key.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }

  // Draw key shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.roundRect(x + 3, y + 3, width - 4, height - 4, 4);
  ctx.fill();

  // Draw key base
  ctx.fillStyle = key.mirrored ? '#a0a0a0' : key.color;
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 2, width - 4, height - 4, 4);
  ctx.fill();

  // Draw key top (inset)
  const inset = 4;
  ctx.fillStyle = key.mirrored ? '#c0c0c0' : adjustColor(key.color, 20);
  ctx.beginPath();
  ctx.roundRect(
    x + inset,
    y + inset,
    width - inset * 2,
    height - inset * 2 - 2,
    3
  );
  ctx.fill();

  // Draw selection border
  if (isSelected) {
    ctx.strokeStyle = theme.colors.accent;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.roundRect(x + 1, y + 1, width - 2, height - 2, 5);
    ctx.stroke();
  }

  // Draw key border
  ctx.strokeStyle = isSelected ? theme.colors.accent : 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 2, width - 4, height - 4, 4);
  ctx.stroke();

  // Draw key label
  if (key.name) {
    ctx.fillStyle = '#333';
    ctx.font = `${Math.max(10, 12 * zoom)}px ${theme.fonts.body}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labelText =
      key.name.length > 8 ? key.name.slice(0, 7) + '…' : key.name;
    ctx.fillText(labelText, x + width / 2, y + height / 2);
  }

  ctx.restore();
}

/**
 * Adjusts a hex color's brightness.
 */
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Renders the grid on the canvas.
 */
function renderGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  zoom: number,
  panX: number,
  panY: number,
  gridSize: number
) {
  const scale = PIXELS_PER_UNIT * zoom * gridSize;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;

  // Calculate grid offset to center it
  const offsetX = panX % scale;
  const offsetY = panY % scale;

  // Draw vertical lines
  for (let x = offsetX; x < width; x += scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = offsetY; y < height; y += scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw origin marker
  ctx.strokeStyle = 'rgba(40, 167, 69, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(panX - 10, panY);
  ctx.lineTo(panX + 10, panY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(panX, panY - 10);
  ctx.lineTo(panX, panY + 10);
  ctx.stroke();
}

/**
 * Checks if a point is inside a key.
 */
function isPointInKey(
  px: number,
  py: number,
  key: EditorKey,
  zoom: number,
  panX: number,
  panY: number
): boolean {
  const scale = PIXELS_PER_UNIT * zoom;
  const x = key.x * scale + panX;
  // Flip Y axis: positive Y goes up, negative Y goes down
  const y = -key.y * scale + panY - key.height * scale;
  const width = key.width * scale;
  const height = key.height * scale;

  if (key.rotation !== 0) {
    // For rotated keys, transform the point to key's local space
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const angle = (-key.rotation * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = px - centerX;
    const dy = py - centerY;
    const localX = dx * cos - dy * sin + centerX;
    const localY = dx * sin + dy * cos + centerY;
    return (
      localX >= x && localX <= x + width && localY >= y && localY <= y + height
    );
  }

  return px >= x && px <= x + width && py >= y && py <= y + height;
}

export const LayoutCanvas: React.FC<LayoutCanvasProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectionRect, setSelectionRect] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const {
    state,
    selectKey,
    selectKeys,
    clearSelection,
    moveSelectedKeys,
    saveHistory,
    pan,
    zoom: zoomFn,
    addKey,
    addKeyInDirection,
    selectedKeys,
    showAddKeyOverlay,
    setShowAddKeyOverlay,
  } = useLayoutEditor();

  const { layout, viewport, selection, grid, mode } = state;
  const { zoom, panX, panY } = viewport;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height - 28 }); // Account for status bar
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  // Close add key overlay when selection changes
  useEffect(() => {
    // Close overlay if selection becomes empty or multi-select
    if (showAddKeyOverlay && selection.keys.size !== 1) {
      setShowAddKeyOverlay(false);
    }
  }, [selection.keys.size, showAddKeyOverlay, setShowAddKeyOverlay]);

  // Render the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const gridCanvas = gridCanvasRef.current;
    if (!canvas || !gridCanvas) return;

    const ctx = canvas.getContext('2d');
    const gridCtx = gridCanvas.getContext('2d');
    if (!ctx || !gridCtx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    gridCanvas.width = canvasSize.width * dpr;
    gridCanvas.height = canvasSize.height * dpr;
    ctx.scale(dpr, dpr);
    gridCtx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    gridCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw grid
    if (grid.visible) {
      renderGrid(
        gridCtx,
        canvasSize.width,
        canvasSize.height,
        zoom,
        panX + canvasSize.width / 2,
        panY + canvasSize.height / 2,
        grid.size
      );
    }

    // Draw keys
    const keysArray = Array.from(layout.keys.values());
    const adjustedPanX = panX + canvasSize.width / 2;
    const adjustedPanY = panY + canvasSize.height / 2;

    // Draw non-selected keys first, then selected keys on top
    keysArray
      .filter((key) => !selection.keys.has(key.id))
      .forEach((key) => {
        renderKey(ctx, key, false, zoom, adjustedPanX, adjustedPanY);
      });

    keysArray
      .filter((key) => selection.keys.has(key.id))
      .forEach((key) => {
        renderKey(ctx, key, true, zoom, adjustedPanX, adjustedPanY);
      });
  }, [layout.keys, selection.keys, zoom, panX, panY, canvasSize, grid]);

  // Find key at position
  const findKeyAtPosition = useCallback(
    (x: number, y: number): EditorKey | null => {
      const adjustedPanX = panX + canvasSize.width / 2;
      const adjustedPanY = panY + canvasSize.height / 2;

      // Check keys in reverse order (topmost first)
      const keysArray = Array.from(layout.keys.values()).reverse();
      for (const key of keysArray) {
        if (isPointInKey(x, y, key, zoom, adjustedPanX, adjustedPanY)) {
          return key;
        }
      }
      return null;
    },
    [layout.keys, zoom, panX, panY, canvasSize]
  );

  // Convert screen coordinates to grid coordinates
  const screenToGrid = useCallback(
    (screenX: number, screenY: number): { x: number; y: number } => {
      const adjustedPanX = panX + canvasSize.width / 2;
      const adjustedPanY = panY + canvasSize.height / 2;
      const scale = PIXELS_PER_UNIT * zoom;
      return {
        x: (screenX - adjustedPanX) / scale,
        // Flip Y axis: screen Y down = negative grid Y
        y: -(screenY - adjustedPanY) / scale,
      };
    },
    [panX, panY, canvasSize, zoom]
  );

  // Handle mouse down
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setDragStart({ x, y });

      if (mode === 'pan' || e.button === 1) {
        // Middle mouse button or pan mode - start panning
        setIsDragging(true);
        e.currentTarget.style.cursor = 'grabbing';
        return;
      }

      if (mode === 'add-key') {
        // Add key at click position
        const gridPos = screenToGrid(x, y);
        const snappedX = grid.snap ? Math.round(gridPos.x) : gridPos.x;
        const snappedY = grid.snap ? Math.round(gridPos.y) : gridPos.y;
        addKey({ x: snappedX, y: snappedY });
        return;
      }

      const clickedKey = findKeyAtPosition(x, y);

      if (clickedKey) {
        // Clicked on a key
        if (e.shiftKey || e.ctrlKey || e.metaKey) {
          // Extend selection
          selectKey(clickedKey.id, true);
        } else if (!selection.keys.has(clickedKey.id)) {
          // Select only this key
          selectKey(clickedKey.id, false);
        }
        // Start dragging
        setIsDragging(true);
      } else {
        // Clicked on empty space - start selection rectangle
        if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
          clearSelection();
        }
        setSelectionRect({ startX: x, startY: y, endX: x, endY: y });
      }
    },
    [
      mode,
      findKeyAtPosition,
      selectKey,
      clearSelection,
      selection.keys,
      addKey,
      screenToGrid,
      grid.snap,
    ]
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });

      if (selectionRect) {
        // Update selection rectangle
        setSelectionRect((prev) =>
          prev ? { ...prev, endX: x, endY: y } : null
        );
        return;
      }

      if (isDragging) {
        const dx = x - dragStart.x;
        const dy = y - dragStart.y;

        if (mode === 'pan' || e.buttons === 4) {
          // Panning
          pan(dx, dy);
          setDragStart({ x, y });
        } else if (selection.keys.size > 0) {
          // Moving selected keys
          const scale = PIXELS_PER_UNIT * zoom;
          let moveX = dx / scale;
          // Flip Y axis: screen down = negative grid Y
          let moveY = -dy / scale;

          if (grid.snap) {
            moveX = Math.round(moveX * 4) / 4; // Snap to 0.25 increments
            moveY = Math.round(moveY * 4) / 4;
          }

          if (moveX !== 0 || moveY !== 0) {
            moveSelectedKeys(moveX, moveY);
            // Only update dragStart by the amount we actually moved (in screen coords)
            // This preserves any remainder for the next frame
            const actualDx = moveX * scale;
            const actualDy = -moveY * scale; // Flip back for screen coordinates
            setDragStart({
              x: dragStart.x + actualDx,
              y: dragStart.y + actualDy,
            });
          }
        }
      }
    },
    [
      isDragging,
      dragStart,
      selectionRect,
      mode,
      selection.keys.size,
      zoom,
      grid.snap,
      pan,
      moveSelectedKeys,
    ]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (selectionRect) {
        // Complete selection rectangle
        const rect = e.currentTarget.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const minX = Math.min(selectionRect.startX, endX);
        const maxX = Math.max(selectionRect.startX, endX);
        const minY = Math.min(selectionRect.startY, endY);
        const maxY = Math.max(selectionRect.startY, endY);

        // Find all keys inside the rectangle
        const adjustedPanX = panX + canvasSize.width / 2;
        const adjustedPanY = panY + canvasSize.height / 2;
        const selectedIds: string[] = [];

        layout.keys.forEach((key, id) => {
          const scale = PIXELS_PER_UNIT * zoom;
          const keyX = key.x * scale + adjustedPanX;
          // Flip Y axis: positive Y goes up
          const keyY = -key.y * scale + adjustedPanY - key.height * scale;
          const keyWidth = key.width * scale;
          const keyHeight = key.height * scale;

          // Check if key overlaps with selection rectangle
          if (
            keyX + keyWidth > minX &&
            keyX < maxX &&
            keyY + keyHeight > minY &&
            keyY < maxY
          ) {
            selectedIds.push(id);
          }
        });

        if (selectedIds.length > 0) {
          selectKeys(selectedIds);
        }

        setSelectionRect(null);
      }

      if (isDragging && selection.keys.size > 0) {
        // Save history after moving
        saveHistory('Move keys');
      }

      setIsDragging(false);
      e.currentTarget.style.cursor = 'default';
    },
    [
      selectionRect,
      isDragging,
      selection.keys.size,
      layout.keys,
      zoom,
      panX,
      panY,
      canvasSize,
      selectKeys,
      saveHistory,
    ]
  );

  // Handle mouse wheel for zooming
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      zoomFn(delta);
    },
    [zoomFn]
  );

  // Handle add key in direction
  const handleAddKeyDirection = useCallback(
    (direction: CardinalDirection) => {
      if (selectedKeys.length === 1 && selectedKeys[0]) {
        addKeyInDirection(selectedKeys[0].id, direction);
        // Keep overlay open - the new key will be selected automatically
        // and the overlay will update to show directions for the new key
      }
    },
    [selectedKeys, addKeyInDirection]
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          // Delete selected keys is handled by context
          break;
        case 'Escape':
          if (showAddKeyOverlay) {
            setShowAddKeyOverlay(false);
          } else {
            clearSelection();
          }
          break;
        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Select all would be handled here
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection, showAddKeyOverlay, setShowAddKeyOverlay]);

  // Calculate grid position for display
  const gridPos = screenToGrid(mousePos.x, mousePos.y);

  return (
    <CanvasContainer ref={containerRef} className={className}>
      <GridCanvas
        ref={gridCanvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
      <StyledCanvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ width: canvasSize.width, height: canvasSize.height }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        tabIndex={0}
        data-testid="layout-canvas"
      />
      {selectionRect && (
        <SelectionRect
          $left={Math.min(selectionRect.startX, selectionRect.endX)}
          $top={Math.min(selectionRect.startY, selectionRect.endY)}
          $width={Math.abs(selectionRect.endX - selectionRect.startX)}
          $height={Math.abs(selectionRect.endY - selectionRect.startY)}
        />
      )}
      {showAddKeyOverlay && selectedKeys.length === 1 && selectedKeys[0] && (
        <AddKeyOverlay
          selectedKey={selectedKeys[0]}
          zone={layout.zones.get(selectedKeys[0].zone) || null}
          allKeys={layout.keys}
          zoom={zoom}
          panX={panX}
          panY={panY}
          canvasWidth={canvasSize.width}
          canvasHeight={canvasSize.height}
          onDirectionClick={handleAddKeyDirection}
          onClose={() => setShowAddKeyOverlay(false)}
        />
      )}
      <StatusBar>
        <StatusItem>
          <StatusDot $active />
          Active
        </StatusItem>
        <StatusItem>Keys: {layout.keys.size}</StatusItem>
        <StatusItem>Selected: {selection.keys.size}</StatusItem>
        <StatusItem>Zoom: {Math.round(zoom * 100)}%</StatusItem>
        <StatusItem>
          Mouse: {gridPos.x.toFixed(2)}, {gridPos.y.toFixed(2)}
        </StatusItem>
      </StatusBar>
    </CanvasContainer>
  );
};
