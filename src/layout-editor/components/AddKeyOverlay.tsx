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
 * Determines which directions are blocked for adding a new key.
 */
function getBlockedDirections(
  selectedKey: EditorKey,
  zone: EditorZone | null,
  allKeys: Map<string, EditorKey>
): Set<CardinalDirection> {
  const blocked = new Set<CardinalDirection>();

  if (!zone) {
    // No zone - check by position only
    const keysArray = Array.from(allKeys.values());
    const hasKeyAt = (x: number, y: number) =>
      keysArray.some(
        (k) =>
          k.id !== selectedKey.id &&
          Math.abs(k.x - x) < 0.1 &&
          Math.abs(k.y - y) < 0.1
      );

    if (hasKeyAt(selectedKey.x, selectedKey.y - 1)) blocked.add('up');
    if (hasKeyAt(selectedKey.x, selectedKey.y + 1)) blocked.add('down');
    if (hasKeyAt(selectedKey.x - 1, selectedKey.y)) blocked.add('left');
    if (hasKeyAt(selectedKey.x + 1, selectedKey.y)) blocked.add('right');

    return blocked;
  }

  // Find the column and row indices
  const colIndex = zone.columns.findIndex((c) => c.name === selectedKey.column);
  const rowIndex = zone.rows.findIndex((r) => r.name === selectedKey.row);

  // Get all keys in the same zone
  const zoneKeys = Array.from(allKeys.values()).filter(
    (k) => k.zone === zone.name && k.id !== selectedKey.id
  );

  // Check if there's a key in each direction
  // Up = previous row (lower row index)
  if (rowIndex <= 0) {
    // At the first row, can add up (will create new row)
  } else {
    const prevRowName = zone.rows[rowIndex - 1]?.name;
    if (
      prevRowName &&
      zoneKeys.some(
        (k) => k.column === selectedKey.column && k.row === prevRowName
      )
    ) {
      blocked.add('up');
    }
  }

  // Down = next row (higher row index)
  if (rowIndex >= zone.rows.length - 1) {
    // At the last row, can add down (will create new row)
  } else {
    const nextRowName = zone.rows[rowIndex + 1]?.name;
    if (
      nextRowName &&
      zoneKeys.some(
        (k) => k.column === selectedKey.column && k.row === nextRowName
      )
    ) {
      blocked.add('down');
    }
  }

  // Left = previous column (lower column index)
  if (colIndex <= 0) {
    // At the first column, can add left (will create new column)
  } else {
    const prevColName = zone.columns[colIndex - 1]?.name;
    if (
      prevColName &&
      zoneKeys.some(
        (k) => k.row === selectedKey.row && k.column === prevColName
      )
    ) {
      blocked.add('left');
    }
  }

  // Right = next column (higher column index)
  if (colIndex >= zone.columns.length - 1) {
    // At the last column, can add right (will create new column)
  } else {
    const nextColName = zone.columns[colIndex + 1]?.name;
    if (
      nextColName &&
      zoneKeys.some(
        (k) => k.row === selectedKey.row && k.column === nextColName
      )
    ) {
      blocked.add('right');
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
  const scale = PIXELS_PER_UNIT * zoom;
  const adjustedPanX = panX + canvasWidth / 2;
  const adjustedPanY = panY + canvasHeight / 2;
  const screenX =
    selectedKey.x * scale + adjustedPanX + (selectedKey.width * scale) / 2;
  const screenY =
    selectedKey.y * scale + adjustedPanY + (selectedKey.height * scale) / 2;

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
