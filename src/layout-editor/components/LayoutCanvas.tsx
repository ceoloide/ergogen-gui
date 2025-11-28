/**
 * LayoutCanvas - The main visual canvas for the keyboard layout editor.
 * Renders keys and handles mouse interactions for selection, movement, and rotation.
 */
import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useLayoutEditor } from '../LayoutEditorContext';
import { EditorKey, PIXELS_PER_UNIT, KEY_UNIT_MM } from '../types';
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



interface LayoutCanvasProps {
  className?: string;
}

/**
 * Renders a single key on the canvas (keycap style).
 * Key coordinates (x, y) represent the CENTER of the key.
 * Draws two concentric rounded rectangles to simulate a keycap appearance.
 */
function renderKey(
  ctx: CanvasRenderingContext2D,
  key: EditorKey,
  isSelected: boolean,
  isBeingDragged: boolean,
  isPendingSelection: boolean,
  zoom: number,
  panX: number,
  panY: number,
  globalRotation: number
) {
  const scale = (PIXELS_PER_UNIT / KEY_UNIT_MM) * zoom;
  const width = key.width * scale;
  const height = key.height * scale;

  // Key coordinates are the CENTER - convert to screen center position
  const centerX = key.x * scale + panX;
  // Flip Y axis: positive Y goes up, negative Y goes down
  const centerY = -key.y * scale + panY;

  // Calculate top-left corner from center
  const x = centerX - width / 2;
  const y = centerY - height / 2;

  // Outer and inner rectangle parameters
  const outerRadius = Math.min(6 * zoom, width / 4, height / 4);
  // Inner rectangle has a fixed margin of 1.8mm (based on 10% of standard 18mm key)
  const innerInsetX = 1.8 * scale;
  const innerInsetY = 1.8 * scale;
  const innerRadius = Math.min(
    4 * zoom,
    (width - innerInsetX * 2) / 4,
    (height - innerInsetY * 2) / 4
  );
  const topOffset = Math.max(4 * zoom, 2); // Inner rect is slightly offset upward

  ctx.save();

  // Make key semi-transparent when being dragged for easier grid alignment
  if (isBeingDragged) {
    ctx.globalAlpha = 0.5;
  }

  // Apply rotation around key center
  const totalRotation = key.rotation + globalRotation;
  if (totalRotation !== 0) {
    ctx.translate(centerX, centerY);
    ctx.rotate((totalRotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }

  // Colors for the keycap
  const outerColor = key.mirrored ? '#a0a0a0' : '#d7d7d7'; // Off-white/light grey
  const innerColor = key.mirrored ? '#c0c0c0' : '#f5f5f5'; // White/very light
  const borderColor = key.mirrored ? '#888888' : '#b0b0b0'; // Border

  // Draw outer rectangle (base of keycap)
  ctx.fillStyle = outerColor;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, outerRadius);
  ctx.fill();

  // Draw outer border
  if (isPendingSelection) {
    ctx.strokeStyle = theme.colors.accent; // Green/Accent for pending selection
    ctx.lineWidth = 2;
  } else {
    ctx.strokeStyle = isSelected ? theme.colors.accent : borderColor;
    ctx.lineWidth = isSelected ? 2 : 1;
  }
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, outerRadius);
  ctx.stroke();

  // Draw inner rectangle (top surface of keycap) - slightly offset upward
  const innerX = x + innerInsetX;
  const innerY = y + innerInsetY - topOffset; // Offset upward
  const innerWidth = width - innerInsetX * 2;
  const innerHeight = height - innerInsetY * 2;

  ctx.fillStyle = innerColor;
  ctx.beginPath();
  ctx.roundRect(innerX, innerY, innerWidth, innerHeight, innerRadius);
  ctx.fill();

  // Draw inner border (subtle)
  ctx.strokeStyle = isSelected ? theme.colors.accent : '#c8c8c8';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.roundRect(innerX, innerY, innerWidth, innerHeight, innerRadius);
  ctx.stroke();

  // Draw selection highlight and center crosshair
  if (isSelected) {
    // Draw outer glow/highlight
    ctx.strokeStyle = theme.colors.accent;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.roundRect(x - 2, y - 2, width + 4, height + 4, outerRadius + 2);
    ctx.stroke();

    // Draw center crosshair
    const crosshairSize = Math.min(12 * zoom, width / 3, height / 3);
    const circleRadius = crosshairSize * 0.6;

    // Crosshair lines
    ctx.strokeStyle = theme.colors.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Horizontal line
    ctx.moveTo(centerX - crosshairSize, centerY);
    ctx.lineTo(centerX + crosshairSize, centerY);
    // Vertical line
    ctx.moveTo(centerX, centerY - crosshairSize);
    ctx.lineTo(centerX, centerY + crosshairSize);
    ctx.stroke();

    // Circle around crosshair
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = theme.colors.accent;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Adjusts a hex color's brightness.
 * Currently unused but kept for potential future use.
 */
function _adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Renders the grid on the canvas with major and minor grid lines.
 * Major grid: gridSize intervals (in mm)
 * Minor grid: 1/8 of major grid
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
  const pixelsPerMm = (PIXELS_PER_UNIT / KEY_UNIT_MM) * zoom;

  // Major grid: gridSize (in mm)
  const majorScale = gridSize * pixelsPerMm;

  // Minor grid: 1/8 of major grid
  const minorScale = majorScale / 8;

  // Offset so origin is centered between major lines
  const majorOffset = majorScale / 2;

  // Draw minor grid lines (lighter)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;

  // Calculate minor grid offset
  const minorOffsetX = ((panX % minorScale) + minorScale) % minorScale;
  const minorOffsetY = ((panY % minorScale) + minorScale) % minorScale;

  // Draw minor vertical lines
  for (let x = minorOffsetX; x < width; x += minorScale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Draw minor horizontal lines
  for (let y = minorOffsetY; y < height; y += minorScale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw major grid lines (more visible)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;

  // Calculate major grid offset (including the shift)
  const majorOffsetX =
    (((panX + majorOffset) % majorScale) + majorScale) % majorScale;
  const majorOffsetY =
    (((panY + majorOffset) % majorScale) + majorScale) % majorScale;

  // Draw major vertical lines
  for (let x = majorOffsetX; x < width; x += majorScale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Draw major horizontal lines
  for (let y = majorOffsetY; y < height; y += majorScale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw origin marker (crosshair at [0,0])
  ctx.strokeStyle = 'rgba(40, 167, 69, 0.7)';
  ctx.lineWidth = 2;
  const originMarkerSize = 15;
  ctx.beginPath();
  ctx.moveTo(panX - originMarkerSize, panY);
  ctx.lineTo(panX + originMarkerSize, panY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(panX, panY - originMarkerSize);
  ctx.lineTo(panX, panY + originMarkerSize);
  ctx.stroke();

  // Draw small circle at origin
  ctx.beginPath();
  ctx.arc(panX, panY, 3, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Checks if a point is inside a key.
 * Key coordinates (x, y) represent the CENTER of the key.
 */
function isPointInKey(
  px: number,
  py: number,
  key: EditorKey,
  zoom: number,
  panX: number,
  panY: number,
  globalRotation: number
): boolean {
  const scale = (PIXELS_PER_UNIT / KEY_UNIT_MM) * zoom;
  const width = key.width * scale;
  const height = key.height * scale;

  // Key coordinates are the CENTER
  const centerX = key.x * scale + panX;
  // Flip Y axis: positive Y goes up, negative Y goes down
  const centerY = -key.y * scale + panY;

  // Calculate top-left corner from center
  const x = centerX - width / 2;
  const y = centerY - height / 2;

  const totalRotation = key.rotation + globalRotation;
  if (totalRotation !== 0) {
    // For rotated keys, transform the point to key's local space
    const angle = (-totalRotation * Math.PI) / 180;
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
    deleteSelectedKeys,
    selectedKeys,
    showAddKeyOverlay,
    setShowAddKeyOverlay,
    setMode,
    undo,
    redo,
    handleAddKeyButtonClick,
    selectAll,
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
        let isPendingSelection = false;
        if (selectionRect) {
          const minX = Math.min(selectionRect.startX, selectionRect.endX);
          const maxX = Math.max(selectionRect.startX, selectionRect.endX);
          const minY = Math.min(selectionRect.startY, selectionRect.endY);
          const maxY = Math.max(selectionRect.startY, selectionRect.endY);

          const scale = (PIXELS_PER_UNIT / KEY_UNIT_MM) * zoom;
          const keyWidth = key.width * scale;
          const keyHeight = key.height * scale;
          const keyCenterX = key.x * scale + adjustedPanX;
          const keyCenterY = -key.y * scale + adjustedPanY;
          const keyX = keyCenterX - keyWidth / 2;
          const keyY = keyCenterY - keyHeight / 2;

          if (
            keyX + keyWidth > minX &&
            keyX < maxX &&
            keyY + keyHeight > minY &&
            keyY < maxY
          ) {
            isPendingSelection = true;
          }
        }
        renderKey(
          ctx,
          key,
          false,
          false,
          isPendingSelection,
          zoom,
          adjustedPanX,
          adjustedPanY,
          layout.globalRotation
        );
      });

    keysArray
      .filter((key) => selection.keys.has(key.id))
      .forEach((key) => {
        // Keys being dragged are semi-transparent
        const isBeingDragged = isDragging && selection.keys.size > 0;
        renderKey(
          ctx,
          key,
          true,
          isBeingDragged,
          false, // Already selected, so not pending
          zoom,
          adjustedPanX,
          adjustedPanY,
          layout.globalRotation
        );
      });
  }, [
    layout.keys,
    selection.keys,
    zoom,
    panX,
    panY,
    canvasSize,
    grid,
    isDragging,
    selectionRect,
  ]);

  // Find key at position
  const findKeyAtPosition = useCallback(
    (x: number, y: number): EditorKey | null => {
      const adjustedPanX = panX + canvasSize.width / 2;
      const adjustedPanY = panY + canvasSize.height / 2;

      // Check keys in reverse order (topmost first)
      const keysArray = Array.from(layout.keys.values()).reverse();
      for (const key of keysArray) {
        if (
          isPointInKey(
            x,
            y,
            key,
            zoom,
            adjustedPanX,
            adjustedPanY,
            layout.globalRotation
          )
        ) {
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
      const scale = (PIXELS_PER_UNIT / KEY_UNIT_MM) * zoom;
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
        // Add key at click position, snap to minor grid (gridSize / 8)
        const gridPos = screenToGrid(x, y);
        const snapStep = grid.size / 8;
        const snappedX = grid.snap
          ? Math.round(gridPos.x / snapStep) * snapStep
          : gridPos.x;
        const snappedY = grid.snap
          ? Math.round(gridPos.y / snapStep) * snapStep
          : gridPos.y;
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
        // Start dragging only if in move mode
        if (mode === 'move') {
          setIsDragging(true);
        } else {
          // In select mode, we might want to start a selection rectangle if we didn't just select the key
          // But for now, just don't drag
        }
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
          const scale = (PIXELS_PER_UNIT / KEY_UNIT_MM) * zoom;
          let moveX = dx / scale;
          // Flip Y axis: screen down = negative grid Y
          let moveY = -dy / scale;

          if (grid.snap) {
            // Snap to minor grid (gridSize / 8)
            const snapStep = grid.size / 8;
            moveX = Math.round(moveX / snapStep) * snapStep;
            moveY = Math.round(moveY / snapStep) * snapStep;
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
          const scale = (PIXELS_PER_UNIT / KEY_UNIT_MM) * zoom;
          const keyWidth = key.width * scale;
          const keyHeight = key.height * scale;

          // Key coordinates are the CENTER
          const keyCenterX = key.x * scale + adjustedPanX;
          // Flip Y axis: positive Y goes up
          const keyCenterY = -key.y * scale + adjustedPanY;

          // Calculate top-left corner from center
          const keyX = keyCenterX - keyWidth / 2;
          const keyY = keyCenterY - keyHeight / 2;

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

      // Calculate mouse position relative to canvas center (which is 0,0 for pan)
      // The pan values are offsets from the center of the canvas
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Convert to coordinates relative to the center of the canvas
      // This matches the coordinate system used by panX/panY
      const centerX = mouseX - canvasSize.width / 2;
      const centerY = mouseY - canvasSize.height / 2;

      zoomFn(delta, { x: centerX, y: centerY });
    },
    [zoomFn, canvasSize]
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
          if (selection.keys.size > 0) {
            deleteSelectedKeys();
          }
          break;
        case 'Escape':
          if (showAddKeyOverlay) {
            setShowAddKeyOverlay(false);
          } else {
            clearSelection();
          }
          break;
        case 'v':
        case 'V':
          setMode('select');
          break;
        case 'm':
        case 'M':
          setMode('move');
          break;
        case 'r':
        case 'R':
          if (selection.keys.size > 0) {
            setMode('rotate');
          }
          break;
        case 'a':
        case 'A':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            selectAll();
          } else {
            handleAddKeyButtonClick();
          }
          break;
        case 'z':
        case 'Z':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    clearSelection,
    showAddKeyOverlay,
    setShowAddKeyOverlay,
    selection.keys.size,
    deleteSelectedKeys,
    setMode,
    undo,
    redo,
    handleAddKeyButtonClick,
    selectAll,
  ]);

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
