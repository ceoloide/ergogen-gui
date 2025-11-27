/**
 * Visual Keyboard Layout Editor Component
 *
 * A React component that provides a visual interface for designing keyboard layouts,
 * similar to KLE (Keyboard Layout Editor). Users can:
 * - Place keys by clicking on the canvas
 * - Drag keys to reposition them
 * - Edit key properties (label, width, height, color)
 * - Export the layout as KLE JSON format
 * - Generate Ergogen configuration from the layout
 *
 * The component generates KLE JSON format which Ergogen automatically detects
 * and converts to Ergogen configuration format.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';

// KLE Key representation
interface KleKey {
  x: number;
  y: number;
  width: number;
  height: number;
  labels: string[];
  color?: string;
  textColor?: string[];
  textSize?: number[];
  rotation_angle?: number;
  rotation_x?: number;
  rotation_y?: number;
  ghost?: boolean;
  stepped?: boolean;
  decal?: boolean;
}

interface KleKeyboard {
  meta: {
    name?: string;
    author?: string;
    backcolor?: string;
    notes?: string;
  };
  keys: KleKey[];
}

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-bottom: 1px solid ${theme.colors.border};
  align-items: center;
  flex-wrap: wrap;
`;

const ToolbarButton = styled.button`
  background-color: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CanvasContainer = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  background-color: ${theme.colors.backgroundLighter};
  background-image: 
    linear-gradient(${theme.colors.border} 1px, transparent 1px),
    linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px);
  background-size: 19px 19px;
  background-position: 0 0, 0 0;
`;

const Canvas = styled.svg`
  width: 100%;
  height: 100%;
  min-width: 2000px;
  min-height: 1000px;
`;

const KeyRect = styled.rect<{
  $isSelected?: boolean;
  $isGhost?: boolean;
}>`
  fill: ${(props) =>
    props.$isGhost
      ? theme.colors.backgroundLight
      : props.$isSelected
        ? theme.colors.accentSecondary
        : theme.colors.backgroundLight};
  stroke: ${(props) =>
    props.$isSelected ? theme.colors.accent : theme.colors.border};
  stroke-width: ${(props) => (props.$isSelected ? 2 : 1)}px;
  cursor: move;
  transition: fill 0.15s ease-in-out, stroke 0.15s ease-in-out;

  &:hover {
    fill: ${theme.colors.accentSecondary};
    stroke: ${theme.colors.accent};
  }
`;

const KeyText = styled.text`
  fill: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  font-size: 12px;
  pointer-events: none;
  user-select: none;
`;

const KeyLabel = styled.text`
  fill: ${theme.colors.textDark};
  font-family: ${theme.fonts.body};
  font-size: 10px;
  pointer-events: none;
  user-select: none;
`;

const InfoPanel = styled.div`
  padding: 1rem;
  border-top: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.backgroundLight};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
`;

const PropertiesPanel = styled.div`
  padding: 1rem;
  border-top: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.backgroundLight};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`;

const PropertyRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PropertyLabel = styled.label`
  min-width: 80px;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
`;

const PropertyInput = styled.input`
  flex: 1;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
`;

const DEFAULT_KEY_WIDTH = 1;
const DEFAULT_KEY_HEIGHT = 1;
const KEY_UNIT_SIZE = 19; // pixels per unit (standard KLE unit)

type Props = {
  onConfigChange?: (kleJson: string) => void;
  initialKleJson?: string;
};

const KleEditor: React.FC<Props> = ({ onConfigChange, initialKleJson }) => {
  const [keyboard, setKeyboard] = useState<KleKeyboard>(() => {
    if (initialKleJson) {
      try {
        const parsed = JSON.parse(initialKleJson);
        // Try to deserialize KLE format if available
        if (window.kle?.Serial && Array.isArray(parsed)) {
          try {
            const deserialized = window.kle.Serial.deserialize(
              JSON.stringify(parsed)
            ) as KleKeyboard;
            if (deserialized && deserialized.keys) {
              return deserialized;
            }
          } catch {
            // Fall through to default
          }
        }
      } catch {
        // Invalid JSON, start fresh
      }
    }
    return {
      meta: {
        name: '',
        author: '',
        backcolor: '#eeeeee',
        notes: '',
      },
      keys: [],
    };
  });

  const [selectedKeyIndex, setSelectedKeyIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isAddingKey, setIsAddingKey] = useState(false);
  const canvasRef = useRef<SVGSVGElement>(null);

  // Notify parent of changes
  useEffect(() => {
    if (onConfigChange) {
      const kleJson = JSON.stringify(keyboard, null, 2);
      onConfigChange(kleJson);
    }
  }, [keyboard, onConfigChange]);

  // Convert screen coordinates to KLE units
  const screenToKleUnits = useCallback(
    (screenX: number, screenY: number): { x: number; y: number } => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (screenX - rect.left) / KEY_UNIT_SIZE;
      const y = (screenY - rect.top) / KEY_UNIT_SIZE;
      return { x, y };
    },
    []
  );

  // Handle canvas click for adding keys
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isAddingKey) return;

      const { x, y } = screenToKleUnits(e.clientX, e.clientY);

      // Snap to grid
      const snappedX = Math.round(x);
      const snappedY = Math.round(y);

      // Check if there's already a key at this position
      const existingKey = keyboard.keys.find(
        (key) =>
          Math.abs(key.x - snappedX) < 0.5 &&
          Math.abs(key.y - snappedY) < 0.5
      );

      if (existingKey) {
        return; // Don't add duplicate key
      }

      const newKey: KleKey = {
        x: snappedX,
        y: snappedY,
        width: DEFAULT_KEY_WIDTH,
        height: DEFAULT_KEY_HEIGHT,
        labels: [''],
        color: '#cccccc',
      };

      setKeyboard({
        ...keyboard,
        keys: [...keyboard.keys, newKey],
      });

      setIsAddingKey(false);
      setSelectedKeyIndex(keyboard.keys.length);
    },
    [isAddingKey, keyboard, screenToKleUnits]
  );

  // Handle key click for selection
  const handleKeyClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      setSelectedKeyIndex(index);
      setIsAddingKey(false);
    },
    []
  );

  // Handle key drag start
  const handleKeyMouseDown = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      setSelectedKeyIndex(index);
      setIsDragging(true);
      const { x, y } = screenToKleUnits(e.clientX, e.clientY);
      const key = keyboard.keys[index];
      setDragStart({
        x: x - key.x,
        y: y - key.y,
      });
    },
    [keyboard.keys, screenToKleUnits]
  );

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || dragStart === null || selectedKeyIndex === null)
        return;

      const { x, y } = screenToKleUnits(e.clientX, e.clientY);
      const newX = Math.round(x - dragStart.x);
      const newY = Math.round(y - dragStart.y);

      setKeyboard((prev) => {
        const newKeys = [...prev.keys];
        newKeys[selectedKeyIndex] = {
          ...newKeys[selectedKeyIndex],
          x: newX,
          y: newY,
        };
        return { ...prev, keys: newKeys };
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, selectedKeyIndex, screenToKleUnits]);

  // Delete selected key
  const handleDeleteKey = useCallback(() => {
    if (selectedKeyIndex === null) return;
    setKeyboard((prev) => ({
      ...prev,
      keys: prev.keys.filter((_, i) => i !== selectedKeyIndex),
    }));
    setSelectedKeyIndex(null);
  }, [selectedKeyIndex]);

  // Update selected key property
  const updateSelectedKey = useCallback(
    (updates: Partial<KleKey>) => {
      if (selectedKeyIndex === null) return;
      setKeyboard((prev) => {
        const newKeys = [...prev.keys];
        newKeys[selectedKeyIndex] = {
          ...newKeys[selectedKeyIndex],
          ...updates,
        };
        return { ...prev, keys: newKeys };
      });
    },
    [selectedKeyIndex]
  );

  // Clear all keys
  const handleClear = useCallback(() => {
    setKeyboard((prev) => ({ ...prev, keys: [] }));
    setSelectedKeyIndex(null);
  }, []);

  // Convert KLE keyboard to KLE JSON format (serialized)
  const getKleJson = useCallback((): string => {
    // KLE format is an array where first element is metadata
    // and subsequent elements are rows of keys (compact format)
    const kleArray: unknown[] = [
      {
        name: keyboard.meta.name || '',
        author: keyboard.meta.author || '',
        backcolor: keyboard.meta.backcolor || '#eeeeee',
        notes: keyboard.meta.notes || '',
      },
    ];

    if (keyboard.keys.length === 0) {
      return JSON.stringify(kleArray);
    }

    // Group keys by row (y position)
    const rows = new Map<number, KleKey[]>();
    keyboard.keys.forEach((key) => {
      const rowY = Math.round(key.y);
      if (!rows.has(rowY)) {
        rows.set(rowY, []);
      }
      rows.get(rowY)!.push(key);
    });

    // Sort rows by y position
    const sortedRows = Array.from(rows.entries()).sort((a, b) => a[0] - b[0]);

    // Convert each row to KLE compact format
    sortedRows.forEach(([, keys]) => {
      // Sort keys in row by x position
      const sortedKeys = keys.sort((a, b) => a.x - b.x);
      const kleRow: unknown[] = [];

      sortedKeys.forEach((key, index) => {
        const kleKey: Record<string, unknown> = {};

        // Only include x/y if not at default position or not first key in row
        if (index === 0) {
          if (key.x !== 0) kleKey.x = key.x;
          if (key.y !== 0) kleKey.y = key.y;
        } else {
          // Relative positioning for subsequent keys
          const prevKey = sortedKeys[index - 1];
          const relX = key.x - (prevKey.x + prevKey.width);
          const relY = key.y - prevKey.y;
          if (relX !== 0) kleKey.x = relX;
          if (relY !== 0) kleKey.y = relY;
        }

        // Width and height (only if not 1x1)
        if (key.width !== 1) kleKey.w = key.width;
        if (key.height !== 1) kleKey.h = key.height;

        // Labels
        if (key.labels && key.labels.length > 0 && key.labels[0]) {
          kleKey.a = key.labels[0]; // Primary label (top-left)
        }

        // Color
        if (key.color && key.color !== '#cccccc') {
          kleKey.c = key.color;
        }

        // Ghost key
        if (key.ghost) {
          kleKey.g = true;
        }

        // Stepped
        if (key.stepped) {
          kleKey.l = true;
        }

        // Decal
        if (key.decal) {
          kleKey.d = true;
        }

        // Rotation
        if (key.rotation_angle) {
          kleKey.r = key.rotation_angle;
          if (key.rotation_x !== undefined) kleKey.rx = key.rotation_x;
          if (key.rotation_y !== undefined) kleKey.ry = key.rotation_y;
        }

        kleRow.push(kleKey);
      });

      kleArray.push(kleRow);
    });

    return JSON.stringify(kleArray);
  }, [keyboard]);

  return (
    <EditorContainer>
      <Toolbar>
        <ToolbarButton
          onClick={() => {
            setIsAddingKey(!isAddingKey);
            setSelectedKeyIndex(null);
          }}
          style={{
            backgroundColor: isAddingKey
              ? theme.colors.accentSecondary
              : undefined,
          }}
        >
          {isAddingKey ? 'Cancel' : 'Add Key'}
        </ToolbarButton>
        <ToolbarButton
          onClick={handleDeleteKey}
          disabled={selectedKeyIndex === null}
        >
          Delete Key
        </ToolbarButton>
        <ToolbarButton onClick={handleClear}>Clear All</ToolbarButton>
        <div style={{ flexGrow: 1 }} />
        <ToolbarButton
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              try {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  // Try to load it
                  // For now, just show a message - full deserialization would require KLE library
                  alert('Paste KLE JSON functionality coming soon. Use "Copy KLE JSON" to export.');
                }
              } catch {
                alert('Invalid JSON format');
              }
            } catch {
              alert('Could not read from clipboard');
            }
          }}
        >
          Paste KLE JSON
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const json = getKleJson();
            navigator.clipboard.writeText(json);
          }}
        >
          Copy KLE JSON
        </ToolbarButton>
      </Toolbar>
      <CanvasContainer>
        <Canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          viewBox="0 0 2000 1000"
          preserveAspectRatio="xMidYMid meet"
        >
          {keyboard.keys.map((key, index) => {
            const x = key.x * KEY_UNIT_SIZE;
            const y = key.y * KEY_UNIT_SIZE;
            const width = key.width * KEY_UNIT_SIZE;
            const height = key.height * KEY_UNIT_SIZE;
            const isSelected = index === selectedKeyIndex;

            return (
              <g key={index}>
                <KeyRect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  $isSelected={isSelected}
                  $isGhost={key.ghost}
                  onClick={(e) => handleKeyClick(e, index)}
                  onMouseDown={(e) => handleKeyMouseDown(e, index)}
                />
                {key.labels[0] && (
                  <KeyText
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {key.labels[0]}
                  </KeyText>
                )}
                {isSelected && (
                  <KeyLabel
                    x={x + width / 2}
                    y={y + height + 15}
                    textAnchor="middle"
                  >
                    {key.width}×{key.height}
                  </KeyLabel>
                )}
              </g>
            );
          })}
        </Canvas>
      </CanvasContainer>
      {selectedKeyIndex !== null && keyboard.keys[selectedKeyIndex] && (
        <PropertiesPanel>
          <PropertyRow>
            <PropertyLabel>Label:</PropertyLabel>
            <PropertyInput
              type="text"
              value={keyboard.keys[selectedKeyIndex].labels[0] || ''}
              onChange={(e) => {
                const newLabels = [...keyboard.keys[selectedKeyIndex].labels];
                newLabels[0] = e.target.value;
                updateSelectedKey({ labels: newLabels });
              }}
              placeholder="Key label"
            />
          </PropertyRow>
          <PropertyRow>
            <PropertyLabel>Width:</PropertyLabel>
            <PropertyInput
              type="number"
              min="0.25"
              max="6"
              step="0.25"
              value={keyboard.keys[selectedKeyIndex].width}
              onChange={(e) => {
                const width = parseFloat(e.target.value) || 1;
                updateSelectedKey({ width });
              }}
            />
          </PropertyRow>
          <PropertyRow>
            <PropertyLabel>Height:</PropertyLabel>
            <PropertyInput
              type="number"
              min="0.25"
              max="6"
              step="0.25"
              value={keyboard.keys[selectedKeyIndex].height}
              onChange={(e) => {
                const height = parseFloat(e.target.value) || 1;
                updateSelectedKey({ height });
              }}
            />
          </PropertyRow>
          <PropertyRow>
            <PropertyLabel>Color:</PropertyLabel>
            <PropertyInput
              type="color"
              value={keyboard.keys[selectedKeyIndex].color || '#cccccc'}
              onChange={(e) => {
                updateSelectedKey({ color: e.target.value });
              }}
            />
          </PropertyRow>
        </PropertiesPanel>
      )}
      <InfoPanel>
        {isAddingKey
          ? 'Click on the canvas to add a key'
          : selectedKeyIndex !== null
            ? `Selected key ${selectedKeyIndex + 1} of ${keyboard.keys.length}. Drag to move.`
            : `${keyboard.keys.length} keys. Click "Add Key" to start.`}
      </InfoPanel>
    </EditorContainer>
  );
};

export default KleEditor;
export type { KleKeyboard, KleKey };
