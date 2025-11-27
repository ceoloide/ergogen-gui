import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import yaml from 'js-yaml';
import { theme } from '../theme/theme';
import { useConfigContext } from '../context/ConfigContext';
import Button from '../atoms/Button';
import OutlineIconButton from '../atoms/OutlineIconButton';
import { useHotkeys } from 'react-hotkeys-hook';

const CanvasEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.backgroundLight};
  flex-shrink: 0;
  flex-wrap: wrap;
`;

const CanvasContainer = styled.div<{ $cursor?: string }>`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: ${theme.colors.backgroundLighter};
  cursor: ${(props) => props.$cursor || 'default'};
`;

const Canvas = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
`;

const GridOverlay = styled.div<{ $gridSize: number; $showGrid: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-image: ${(props) =>
    props.$showGrid
      ? `linear-gradient(to right, ${theme.colors.border} 1px, transparent 1px),
         linear-gradient(to bottom, ${theme.colors.border} 1px, transparent 1px)`
      : 'none'};
  background-size: ${(props) => `${props.$gridSize}px ${props.$gridSize}px`};
  background-position: 0 0;
  opacity: 0.3;
`;

const GridControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  padding: 0 1rem;
`;

const GridInput = styled.input`
  width: 60px;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
`;

const GridUnitSelect = styled.select`
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
`;

const SelectionRect = styled.rect`
  fill: none;
  stroke: ${theme.colors.accent};
  stroke-width: 2;
  stroke-dasharray: 5, 5;
  pointer-events: none;
`;

// Internal representation of a key
export interface CanvasKey {
  id: string;
  x: number; // Position in mm
  y: number; // Position in mm
  width: number; // Width in U
  height: number; // Height in U
  rotation: number; // Rotation in degrees
  rotationOriginX: number; // Rotation origin X in mm
  rotationOriginY: number; // Rotation origin Y in mm
  column?: string; // Column identifier for Ergogen export
  row?: string; // Row identifier for Ergogen export
}

// Tool types
type ToolType = 'select' | 'move-exactly' | 'rotate' | 'mirror';

// Convert screen coordinates to canvas coordinates
const screenToCanvas = (
  screenX: number,
  screenY: number,
  rect: DOMRect,
  viewOffset: { x: number; y: number },
  viewZoom: number
): { x: number; y: number } => {
  return {
    x: (screenX - rect.left) / viewZoom - viewOffset.x,
    y: (screenY - rect.top) / viewZoom - viewOffset.y,
  };
};

// Snap a value to grid
const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

// Convert U to mm
const uToMm = (u: number, unit: 'U' | 'u' | 'mm'): number => {
  if (unit === 'U') return u * 19.05;
  if (unit === 'u') return u * 19;
  return u; // mm
};

// Convert mm to U
const mmToU = (mm: number, unit: 'U' | 'u' | 'mm'): number => {
  if (unit === 'U') return mm / 19.05;
  if (unit === 'u') return mm / 19;
  return mm; // mm
};

const CanvasEditor: React.FC = () => {
  const navigate = useNavigate();
  const configContext = useConfigContext();
  const canvasRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [keys, setKeys] = useState<CanvasKey[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [currentTool, setCurrentTool] = useState<ToolType>('select');
  const [showGrid, setShowGrid] = useState(true);
  const [gridUnit, setGridUnit] = useState<'U' | 'u' | 'mm'>('U');
  const [gridSize, setGridSize] = useState<number>(1); // Grid size in selected unit
  const [gridSizeMm, setGridSizeMm] = useState<number>(19.05); // Grid size in mm
  const [rotationLock, setRotationLock] = useState(false);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [viewZoom, setViewZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectionRect, setSelectionRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(
    null
  );

  // Convert grid size to mm based on unit
  useEffect(() => {
    setGridSizeMm(uToMm(gridSize, gridUnit));
  }, [gridUnit, gridSize]);

  // Keyboard shortcuts
  useHotkeys('a', () => {
    if (selectedKeys.size === keys.length) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(keys.map((k) => k.id)));
    }
  });

  useHotkeys('delete', () => {
    if (selectedKeys.size > 0) {
      setKeys((prev) => prev.filter((k) => !selectedKeys.has(k.id)));
      setSelectedKeys(new Set());
    }
  });

  useHotkeys('escape', () => {
    setSelectedKeys(new Set());
    setCurrentTool('select');
  });

  // Arrow key movement
  useHotkeys(
    'up',
    () => {
      if (selectedKeys.size > 0) {
        moveSelectedKeys(0, -gridSizeMm);
      }
    },
    { preventDefault: true }
  );

  useHotkeys(
    'down',
    () => {
      if (selectedKeys.size > 0) {
        moveSelectedKeys(0, gridSizeMm);
      }
    },
    { preventDefault: true }
  );

  useHotkeys(
    'left',
    () => {
      if (selectedKeys.size > 0) {
        moveSelectedKeys(-gridSizeMm, 0);
      }
    },
    { preventDefault: true }
  );

  useHotkeys(
    'right',
    () => {
      if (selectedKeys.size > 0) {
        moveSelectedKeys(gridSizeMm, 0);
      }
    },
    { preventDefault: true }
  );

  const handleAddKey = useCallback(
    (x: number, y: number) => {
      // Snap to grid
      const snappedX = snapToGrid(x, gridSizeMm);
      const snappedY = snapToGrid(y, gridSizeMm);

      const newKey: CanvasKey = {
        id: `key-${Date.now()}-${Math.random()}`,
        x: snappedX,
        y: snappedY,
        width: 1,
        height: 1,
        rotation: 0,
        rotationOriginX: snappedX,
        rotationOriginY: snappedY,
      };

      setKeys((prev) => [...prev, newKey]);
      setSelectedKeys(new Set([newKey.id]));
    },
    [gridSizeMm]
  );

  const moveSelectedKeys = useCallback(
    (dx: number, dy: number) => {
      setKeys((prev) =>
        prev.map((key) => {
          if (!selectedKeys.has(key.id)) return key;

          let newX = key.x + dx;
          let newY = key.y + dy;

          // Snap to grid
          newX = snapToGrid(newX, gridSizeMm);
          newY = snapToGrid(newY, gridSizeMm);

          // Handle rotation lock
          if (rotationLock) {
            // Move rotation origin with the key
            return {
              ...key,
              x: newX,
              y: newY,
              rotationOriginX: key.rotationOriginX + dx,
              rotationOriginY: key.rotationOriginY + dy,
            };
          } else {
            // Keep rotation origin fixed
            return {
              ...key,
              x: newX,
              y: newY,
            };
          }
        })
      );
    },
    [selectedKeys, gridSizeMm, rotationLock]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const canvasPos = screenToCanvas(
        e.clientX,
        e.clientY,
        rect,
        viewOffset,
        viewZoom
      );

      // Middle mouse button or space for panning
      if (e.button === 1 || e.ctrlKey) {
        setIsPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
        return;
      }

      if (currentTool === 'select') {
        // Check if clicking on a key
        const clickedKey = keys.find((key) => {
          const keyWidth = uToMm(key.width, gridUnit) * gridSize;
          const keyHeight = uToMm(key.height, gridUnit) * gridSize;
          const dx = canvasPos.x - key.x;
          const dy = canvasPos.y - key.y;
          return (
            Math.abs(dx) < keyWidth / 2 && Math.abs(dy) < keyHeight / 2
          );
        });

        if (clickedKey) {
          if (e.shiftKey || e.ctrlKey || e.metaKey) {
            // Toggle selection
            setSelectedKeys((prev) => {
              const next = new Set(prev);
              if (next.has(clickedKey.id)) {
                next.delete(clickedKey.id);
              } else {
                next.add(clickedKey.id);
              }
              return next;
            });
          } else {
            // Select only this key
            if (!selectedKeys.has(clickedKey.id)) {
              setSelectedKeys(new Set([clickedKey.id]));
            }
            // Start dragging
            setIsDragging(true);
            setDragStart(canvasPos);
          }
        } else {
          // Start selection rectangle
          if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
            setSelectedKeys(new Set());
          }
          setIsDragging(true);
          setDragStart(canvasPos);
          setSelectionRect({ x: canvasPos.x, y: canvasPos.y, width: 0, height: 0 });
        }
      } else if (currentTool === 'move-exactly') {
        // Start moving selected keys, or add new key if nothing selected
        if (selectedKeys.size > 0) {
          setIsDragging(true);
          setDragStart(canvasPos);
        } else {
          handleAddKey(canvasPos.x, canvasPos.y);
        }
      }
    },
    [
      currentTool,
      keys,
      selectedKeys,
      viewOffset,
      viewZoom,
      gridUnit,
      gridSize,
      handleAddKey,
    ]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const canvasPos = screenToCanvas(
        e.clientX,
        e.clientY,
        rect,
        viewOffset,
        viewZoom
      );

      if (isPanning && panStart) {
        const dx = (e.clientX - panStart.x) / viewZoom;
        const dy = (e.clientY - panStart.y) / viewZoom;
        setViewOffset((prev) => ({
          x: prev.x - dx,
          y: prev.y - dy,
        }));
        setPanStart({ x: e.clientX, y: e.clientY });
        return;
      }

      if (isDragging && dragStart) {
        if (currentTool === 'select' && selectionRect) {
          // Update selection rectangle
          const width = canvasPos.x - dragStart.x;
          const height = canvasPos.y - dragStart.y;
          setSelectionRect({
            x: Math.min(dragStart.x, canvasPos.x),
            y: Math.min(dragStart.y, canvasPos.y),
            width: Math.abs(width),
            height: Math.abs(height),
          });

          // Select keys within rectangle
          const rect = {
            x: Math.min(dragStart.x, canvasPos.x),
            y: Math.min(dragStart.y, canvasPos.y),
            width: Math.abs(width),
            height: Math.abs(height),
          };

          const keysInRect = keys.filter((key) => {
            const keyWidth = uToMm(key.width, gridUnit) * gridSize;
            const keyHeight = uToMm(key.height, gridUnit) * gridSize;
            return (
              key.x - keyWidth / 2 >= rect.x &&
              key.x + keyWidth / 2 <= rect.x + rect.width &&
              key.y - keyHeight / 2 >= rect.y &&
              key.y + keyHeight / 2 <= rect.y + rect.height
            );
          });

          setSelectedKeys((prev) => {
            const next = new Set(prev);
            keysInRect.forEach((key) => next.add(key.id));
            return next;
          });
        } else if (currentTool === 'move-exactly' && selectedKeys.size > 0) {
          // Move selected keys
          const dx = canvasPos.x - dragStart.x;
          const dy = canvasPos.y - dragStart.y;

          setKeys((prev) =>
            prev.map((key) => {
              if (!selectedKeys.has(key.id)) return key;

              let newX = key.x + dx;
              let newY = key.y + dy;

              // Snap to grid if shift is held
              if (e.shiftKey) {
                newX = snapToGrid(newX, gridSizeMm);
                newY = snapToGrid(newY, gridSizeMm);
              }

              if (rotationLock) {
                return {
                  ...key,
                  x: newX,
                  y: newY,
                  rotationOriginX: key.rotationOriginX + dx,
                  rotationOriginY: key.rotationOriginY + dy,
                };
              } else {
                return {
                  ...key,
                  x: newX,
                  y: newY,
                };
              }
            })
          );

          setDragStart(canvasPos);
        }
      }
    },
    [
      isPanning,
      panStart,
      isDragging,
      dragStart,
      currentTool,
      selectionRect,
      keys,
      selectedKeys,
      viewOffset,
      viewZoom,
      gridUnit,
      gridSize,
      gridSizeMm,
      rotationLock,
    ]
  );

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
    setDragStart(null);
    setPanStart(null);
    setSelectionRect(null);
  }, []);

  const handleCanvasWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      if (!canvasRef.current) return;

      e.preventDefault();
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, viewZoom * zoomFactor));

      // Zoom towards mouse position
      const zoomRatio = newZoom / viewZoom;
      setViewOffset((prev) => ({
        x: mouseX / newZoom - (mouseX / viewZoom - prev.x) * zoomRatio,
        y: mouseY / newZoom - (mouseY / viewZoom - prev.y) * zoomRatio,
      }));

      setViewZoom(newZoom);
    },
    [viewZoom]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDragging || isPanning) return;
      if (!canvasRef.current) return;
      // Click handling is done in mouseDown, this is just for tools that add keys
      if (currentTool === 'rotate' || currentTool === 'mirror') {
        // These tools operate on selection, not adding keys
        return;
      }
    },
    [currentTool, isDragging, isPanning]
  );

  const handleRotateSelection = useCallback(() => {
    if (selectedKeys.size === 0) return;

    // Find rotation anchor (center of selection or key corner)
    const selected = keys.filter((k) => selectedKeys.has(k.id));
    const centerX =
      selected.reduce((sum, k) => sum + k.x, 0) / selected.length;
    const centerY =
      selected.reduce((sum, k) => sum + k.y, 0) / selected.length;

    setKeys((prev) =>
      prev.map((key) => {
        if (!selectedKeys.has(key.id)) return key;

        // Rotate 90 degrees around center
        const dx = key.x - centerX;
        const dy = key.y - centerY;
        const newX = centerX - dy;
        const newY = centerY + dx;

        return {
          ...key,
          x: snapToGrid(newX, gridSizeMm),
          y: snapToGrid(newY, gridSizeMm),
          rotation: (key.rotation + 90) % 360,
          rotationOriginX: centerX,
          rotationOriginY: centerY,
        };
      })
    );
  }, [selectedKeys, keys, gridSizeMm]);

  const handleMirror = useCallback(
    (horizontal: boolean) => {
      if (selectedKeys.size === 0) return;

      const selected = keys.filter((k) => selectedKeys.has(k.id));
      const centerX =
        selected.reduce((sum, k) => sum + k.x, 0) / selected.length;
      const centerY =
        selected.reduce((sum, k) => sum + k.y, 0) / selected.length;

      setKeys((prev) =>
        prev.map((key) => {
          if (!selectedKeys.has(key.id)) return key;

          if (horizontal) {
            return {
              ...key,
              x: centerX - (key.x - centerX),
              rotation: -key.rotation,
            };
          } else {
            return {
              ...key,
              y: centerY - (key.y - centerY),
              rotation: -key.rotation,
            };
          }
        })
      );
    },
    [selectedKeys, keys]
  );

  const exportToErgogen = useCallback(() => {
    if (keys.length === 0) {
      alert('No keys to export');
      return;
    }

    // Group keys by columns and rows
    // For Ergogen: columns-first, rows-second, columns grow bottom-to-top
    const sortedKeys = [...keys].sort((a, b) => {
      // Sort by X first (columns), then by Y descending (bottom to top)
      if (Math.abs(a.x - b.x) > gridSizeMm / 2) {
        return a.x - b.x;
      }
      return b.y - a.y; // Descending for bottom-to-top
    });

    // Group into columns
    const columns: CanvasKey[][] = [];
    let currentColumn: CanvasKey[] = [];
    let lastX = sortedKeys[0]?.x ?? 0;

    sortedKeys.forEach((key) => {
      if (Math.abs(key.x - lastX) > gridSizeMm / 2) {
        if (currentColumn.length > 0) {
          columns.push(currentColumn);
        }
        currentColumn = [key];
        lastX = key.x;
      } else {
        currentColumn.push(key);
      }
    });
    if (currentColumn.length > 0) {
      columns.push(currentColumn);
    }

    // Generate column and row names
    const columnNames = columns.map((_, i) => `col_${i + 1}`);
    const rowNames: string[] = [];
    const maxRows = Math.max(...columns.map((col) => col.length));

    // Rows are bottom to top
    for (let i = 0; i < maxRows; i++) {
      rowNames.push(`row_${i + 1}`);
    }

    // Build Ergogen config
    const config: any = {
      meta: {
        engine: '4.1.0',
      },
      units: {
        visual_x: gridUnit === 'U' ? 19.05 : gridUnit === 'u' ? 19 : 1,
        visual_y: gridUnit === 'U' ? 19.05 : gridUnit === 'u' ? 19 : 1,
      },
      points: {
        zones: {
          matrix: {
            columns: {},
            rows: {},
          },
        },
      },
    };

    // Add columns
    columns.forEach((colKeys, colIdx) => {
      const colName = columnNames[colIdx];
      config.points.zones.matrix.columns[colName] = {};

      // Add keys in this column (bottom to top)
      colKeys.forEach((key, keyIdx) => {
        const rowName = rowNames[keyIdx];
        if (keyIdx === 0) {
          // First key (bottom) defines the column
          config.points.zones.matrix.columns[colName].key = {
            shift: [key.x, -key.y], // Negate Y for Ergogen coordinate system
          };
          if (key.rotation !== 0) {
            config.points.zones.matrix.columns[colName].key.rotate = key.rotation;
          }
        } else {
          // Subsequent keys are in rows
          if (!config.points.zones.matrix.columns[colName].rows) {
            config.points.zones.matrix.columns[colName].rows = {};
          }
          const prevKey = colKeys[keyIdx - 1];
          const rowShift = [key.x - prevKey.x, -(key.y - prevKey.y)];
          config.points.zones.matrix.columns[colName].rows[rowName] = {
            shift: rowShift,
          };
          if (key.rotation !== 0) {
            config.points.zones.matrix.columns[colName].rows[rowName].rotate = key.rotation;
          }
        }
      });
    });

    // Add rows
    rowNames.forEach((rowName) => {
      config.points.zones.matrix.rows[rowName] = {};
    });

    const yamlString = yaml.dump(config, { indent: 2 });

    if (configContext) {
      configContext.setConfigInput(yamlString);
      navigate('/');
    }
  }, [keys, gridSizeMm, gridUnit, configContext, navigate]);

  const cursor = useMemo(() => {
    if (isPanning) return 'grabbing';
    if (currentTool === 'select') return 'default';
    if (currentTool === 'move-exactly') return 'move';
    if (currentTool === 'rotate') return 'grab';
    if (currentTool === 'mirror') return 'grab';
    return 'crosshair';
  }, [currentTool, isPanning]);

  return (
    <CanvasEditorWrapper>
      <Toolbar>
        <OutlineIconButton
          onClick={() => navigate('/new')}
          aria-label="Back to welcome"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </OutlineIconButton>
        <OutlineIconButton
          className={currentTool === 'select' ? 'active' : ''}
          onClick={() => setCurrentTool('select')}
          aria-label="Selection tool"
          title="Selection Tool (S)"
        >
          <span className="material-symbols-outlined">select_all</span>
        </OutlineIconButton>
        <OutlineIconButton
          className={currentTool === 'move-exactly' ? 'active' : ''}
          onClick={() => setCurrentTool('move-exactly')}
          aria-label="Move exactly tool"
          title="Move Exactly Tool (M)"
        >
          <span className="material-symbols-outlined">open_with</span>
        </OutlineIconButton>
        <OutlineIconButton
          className={currentTool === 'rotate' ? 'active' : ''}
          onClick={() => {
            setCurrentTool('rotate');
            handleRotateSelection();
          }}
          aria-label="Rotate selection tool"
          title="Rotate Selection (R)"
        >
          <span className="material-symbols-outlined">rotate_right</span>
        </OutlineIconButton>
        <OutlineIconButton
          className={currentTool === 'mirror' ? 'active' : ''}
          onClick={() => {
            setCurrentTool('mirror');
            handleMirror(true);
          }}
          aria-label="Mirror tool"
          title="Mirror Tool (F)"
        >
          <span className="material-symbols-outlined">flip</span>
        </OutlineIconButton>
        <OutlineIconButton
          className={rotationLock ? 'active' : ''}
          onClick={() => setRotationLock(!rotationLock)}
          aria-label="Lock rotations"
          title="Lock Rotations"
        >
          <span className="material-symbols-outlined">
            {rotationLock ? 'lock' : 'lock_open'}
          </span>
        </OutlineIconButton>
        <GridControls>
          <label>
            Grid:
            <GridInput
              type="number"
              min="0.1"
              step="0.1"
              value={gridSize}
              onChange={(e) => setGridSize(parseFloat(e.target.value) || 1)}
            />
            <GridUnitSelect
              value={gridUnit}
              onChange={(e) => setGridUnit(e.target.value as 'U' | 'u' | 'mm')}
            >
              <option value="U">U</option>
              <option value="u">u</option>
              <option value="mm">mm</option>
            </GridUnitSelect>
          </label>
          <OutlineIconButton
            className={showGrid ? 'active' : ''}
            onClick={() => setShowGrid(!showGrid)}
            aria-label="Toggle grid"
          >
            <span className="material-symbols-outlined">grid_on</span>
          </OutlineIconButton>
        </GridControls>
        <Button onClick={exportToErgogen} aria-label="Export to Ergogen">
          Export to Ergogen
        </Button>
      </Toolbar>
      <CanvasContainer ref={containerRef} $cursor={cursor}>
        <GridOverlay
          $gridSize={gridSizeMm * viewZoom}
          $showGrid={showGrid}
        />
        <Canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onWheel={handleCanvasWheel}
          viewBox={`${viewOffset.x} ${viewOffset.y} ${1000 / viewZoom} ${1000 / viewZoom}`}
          preserveAspectRatio="none"
        >
          {/* Selection rectangle */}
          {selectionRect && (
            <SelectionRect
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.width}
              height={selectionRect.height}
            />
          )}

          {/* Keys */}
          {keys.map((key) => {
            const keyWidthMm = uToMm(key.width, gridUnit) * gridSize;
            const keyHeightMm = uToMm(key.height, gridUnit) * gridSize;
            const isSelected = selectedKeys.has(key.id);

            return (
              <g
                key={key.id}
                transform={`translate(${key.x}, ${key.y}) rotate(${key.rotation} ${key.rotationOriginX - key.x} ${key.rotationOriginY - key.y})`}
              >
                <rect
                  x={-keyWidthMm / 2}
                  y={-keyHeightMm / 2}
                  width={keyWidthMm}
                  height={keyHeightMm}
                  fill={
                    isSelected
                      ? theme.colors.accent
                      : theme.colors.backgroundLight
                  }
                  stroke={isSelected ? theme.colors.accentDark : theme.colors.border}
                  strokeWidth={isSelected ? 3 : 2}
                  rx="2"
                  style={{ cursor: 'pointer' }}
                />
                {isSelected && (
                  <circle
                    cx={key.rotationOriginX - key.x}
                    cy={key.rotationOriginY - key.y}
                    r="3"
                    fill={theme.colors.accentDark}
                  />
                )}
              </g>
            );
          })}
        </Canvas>
      </CanvasContainer>
    </CanvasEditorWrapper>
  );
};

export default CanvasEditor;
