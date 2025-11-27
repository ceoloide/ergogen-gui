/**
 * AddKeyOverlay - Overlay that appears when adding a key with a selection.
 * Shows 4 cardinal direction buttons to choose where to add the new key.
 */
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';
import { EditorKey, EditorZone, PIXELS_PER_UNIT } from '../types';

/**
 * Cardinal directions for adding keys.
 */
export type CardinalDirection = 'up' | 'down' | 'left' | 'right';

const OverlayContainer = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${(p) => p.$x}px;
  top: ${(p) => p.$y}px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 100;
`;

const DirectionButton = styled.button<{
  $direction: CardinalDirection;
  $disabled?: boolean;
}>`
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid ${theme.colors.accent};
  background-color: ${(p) =>
    p.$disabled ? theme.colors.backgroundLighter : theme.colors.accent};
  color: ${(p) =>
    p.$disabled ? theme.colors.textDarkest : theme.colors.white};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.4 : 1)};
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  ${(p) => {
    const offset = 50;
    switch (p.$direction) {
      case 'up':
        return `top: -${offset}px; left: 50%; transform: translateX(-50%);`;
      case 'down':
        return `bottom: -${offset}px; left: 50%; transform: translateX(-50%);`;
      case 'left':
        return `left: -${offset}px; top: 50%; transform: translateY(-50%);`;
      case 'right':
        return `right: -${offset}px; top: 50%; transform: translateY(-50%);`;
    }
  }}

  &:hover:not(:disabled) {
    background-color: ${theme.colors.accentDark};
    transform: ${(p) => {
      switch (p.$direction) {
        case 'up':
          return 'translateX(-50%) scale(1.1)';
        case 'down':
          return 'translateX(-50%) scale(1.1)';
        case 'left':
          return 'translateY(-50%) scale(1.1)';
        case 'right':
          return 'translateY(-50%) scale(1.1)';
      }
    }};
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
`;

const CenterIndicator = styled.div`
  width: 60px;
  height: 60px;
  border: 2px dashed ${theme.colors.accent};
  border-radius: 8px;
  background-color: rgba(40, 167, 69, 0.1);
`;

interface AddKeyOverlayProps {
  /** The currently selected key */
  selectedKey: EditorKey;
  /** The zone containing the selected key */
  zone: EditorZone | null;
  /** All keys in the layout */
  allKeys: Map<string, EditorKey>;
  /** Current zoom level */
  zoom: number;
  /** Pan offset X */
  panX: number;
  /** Pan offset Y */
  panY: number;
  /** Canvas width */
  canvasWidth: number;
  /** Canvas height */
  canvasHeight: number;
  /** Callback when a direction is clicked */
  onDirectionClick: (direction: CardinalDirection) => void;
  /** Callback when overlay should be closed */
  onClose: () => void;
}

/**
 * Gets the icon for a direction.
 */
function getDirectionIcon(direction: CardinalDirection): string {
  switch (direction) {
    case 'up':
      return 'arrow_upward';
    case 'down':
      return 'arrow_downward';
    case 'left':
      return 'arrow_back';
    case 'right':
      return 'arrow_forward';
  }
}

/**
 * Gets the title for a direction button.
 */
function getDirectionTitle(
  direction: CardinalDirection,
  disabled: boolean
): string {
  const directionName = direction.charAt(0).toUpperCase() + direction.slice(1);
  if (disabled) {
    return `Cannot add key ${directionName.toLowerCase()} - key already exists`;
  }
  return `Add key ${directionName.toLowerCase()}`;
}

/**
 * Extracts the numeric suffix from a name like "col1", "row2", etc.
 * Returns 1 if no number is found.
 */
function extractNumber(name: string): number {
  const match = name.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Determines which directions are blocked for adding a new key.
 */
function getBlockedDirections(
  selectedKey: EditorKey,
  zone: EditorZone | null,
  allKeys: Map<string, EditorKey>
): Set<CardinalDirection> {
  const blocked = new Set<CardinalDirection>();

  // Extract current row and column numbers
  const rowNum = extractNumber(selectedKey.row);
  const colNum = extractNumber(selectedKey.column);

  // Block "down" if row is 1 (can't go below 1)
  if (rowNum <= 1) {
    blocked.add('down');
  }

  // Block "left" if column is 1 (can't go below 1)
  if (colNum <= 1) {
    blocked.add('left');
  }

  // Check for existing keys in each direction
  const keysArray = Array.from(allKeys.values()).filter(
    (k) => k.id !== selectedKey.id && k.zone === selectedKey.zone
  );

  // Helper to check if a key exists at a specific row/column
  const hasKeyAt = (col: string, row: string) =>
    keysArray.some((k) => k.column === col && k.row === row);

  // Generate expected names for adjacent positions
  const colPrefix = selectedKey.column.replace(/\d+$/, '');
  const rowPrefix = selectedKey.row.replace(/\d+$/, '');

  // Up = higher row number
  const upRowName = `${rowPrefix}${rowNum + 1}`;
  if (hasKeyAt(selectedKey.column, upRowName)) {
    blocked.add('up');
  }

  // Down = lower row number (already blocked if rowNum <= 1)
  if (rowNum > 1) {
    const downRowName = `${rowPrefix}${rowNum - 1}`;
    if (hasKeyAt(selectedKey.column, downRowName)) {
      blocked.add('down');
    }
  }

  // Right = higher column number
  const rightColName = `${colPrefix}${colNum + 1}`;
  if (hasKeyAt(rightColName, selectedKey.row)) {
    blocked.add('right');
  }

  // Left = lower column number (already blocked if colNum <= 1)
  if (colNum > 1) {
    const leftColName = `${colPrefix}${colNum - 1}`;
    if (hasKeyAt(leftColName, selectedKey.row)) {
      blocked.add('left');
    }
  }

  return blocked;
}

export const AddKeyOverlay: React.FC<AddKeyOverlayProps> = ({
  selectedKey,
  zone,
  allKeys,
  zoom,
  panX,
  panY,
  canvasWidth,
  canvasHeight,
  onDirectionClick,
}) => {
  const blockedDirections = getBlockedDirections(selectedKey, zone, allKeys);

  // Calculate screen position of the selected key's center
  // Key coordinates (x, y) already represent the CENTER
  const scale = PIXELS_PER_UNIT * zoom;
  const adjustedPanX = panX + canvasWidth / 2;
  const adjustedPanY = panY + canvasHeight / 2;
  const screenX = selectedKey.x * scale + adjustedPanX;
  // Flip Y axis: positive Y goes up on screen
  const screenY = -selectedKey.y * scale + adjustedPanY;

  const directions: CardinalDirection[] = ['up', 'down', 'left', 'right'];

  return (
    <OverlayContainer $x={screenX} $y={screenY} data-testid="add-key-overlay">
      <CenterIndicator />
      {directions.map((direction) => {
        const isBlocked = blockedDirections.has(direction);
        return (
          <DirectionButton
            key={direction}
            $direction={direction}
            $disabled={isBlocked}
            disabled={isBlocked}
            onClick={() => !isBlocked && onDirectionClick(direction)}
            title={getDirectionTitle(direction, isBlocked)}
            aria-label={getDirectionTitle(direction, isBlocked)}
            data-testid={`add-key-${direction}`}
          >
            <span className="material-symbols-outlined">
              {getDirectionIcon(direction)}
            </span>
          </DirectionButton>
        );
      })}
    </OverlayContainer>
  );
};
