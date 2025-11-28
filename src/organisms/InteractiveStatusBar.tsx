import React from 'react';
import styled from 'styled-components';
import { useInteractiveLayoutContext } from '../context/InteractiveLayoutContext';
import { toDisplay } from '../utils/units';
import { theme } from '../theme/theme';

const StatusBarContainer = styled.div`
  background-color: ${theme.colors.backgroundLighter};
  border-top: 1px solid ${theme.colors.border};
  padding: 4px 12px;
  display: flex;
  gap: 2rem;
  align-items: center;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.text};
  height: 28px;
  width: 100%;
  flex-shrink: 0;
  user-select: none;
`;

const StatusItem = styled.div`
  display: flex;
  gap: 0.5rem;
  white-space: nowrap;
`;

interface Props {
  mousePos: { x: number; y: number };
}

const InteractiveStatusBar: React.FC<Props> = ({ mousePos }) => {
  const { state } = useInteractiveLayoutContext();
  const { view, grid } = state;

  // Keys: 0, Selected: 0 (Placeholders)
  // Zoom: percentage
  const zoomPercent = Math.round(view.k * 100);

  // Mouse: unit conversion
  const displayX = toDisplay(mousePos.x, grid.displayUnit).toFixed(2);
  const displayY = toDisplay(mousePos.y, grid.displayUnit).toFixed(2);

  return (
    <StatusBarContainer>
      <StatusItem>Keys: 15</StatusItem>
      <StatusItem>Selected: 1</StatusItem>
      <StatusItem>Zoom: {zoomPercent}%</StatusItem>
      <StatusItem>Mouse: {displayX}, {displayY}</StatusItem>
    </StatusBarContainer>
  );
};

export default InteractiveStatusBar;
