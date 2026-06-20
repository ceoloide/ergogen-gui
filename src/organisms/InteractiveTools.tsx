import React from 'react';
import styled from 'styled-components';
import { useInteractiveLayoutContext } from '../context/InteractiveLayoutContext';
import { theme } from '../theme/theme';

const ToolsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  padding-top: 0.5rem;
`;

const ToolButton = styled.button<{ $active?: boolean }>`
  background-color: ${props => props.$active ? theme.colors.accent : 'transparent'};
  color: ${props => props.$active ? theme.colors.white : theme.colors.text};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.$active ? theme.colors.accent : theme.colors.buttonHover};
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
`;

const Separator = styled.div`
  height: 1px;
  width: 80%;
  background-color: ${theme.colors.border};
  margin: 4px 0;
`;

const InteractiveTools = () => {
  const { state, setActiveTool, setViewState, resetView } = useInteractiveLayoutContext();

  const handleZoomIn = () => {
    // Simple zoom for now.
    // Ideally we would read the canvas size to zoom towards center,
    // but context doesn't know about canvas size.
    setViewState({ k: state.view.k * 1.2 });
  };

  const handleZoomOut = () => {
    setViewState({ k: state.view.k / 1.2 });
  };

  return (
    <ToolsContainer>
      <ToolButton
        $active={state.activeTool === 'select'}
        onClick={() => setActiveTool('select')}
        title="Select Tool"
      >
        <span className="material-symbols-outlined">near_me</span>
      </ToolButton>
      <ToolButton
        $active={state.activeTool === 'pan'}
        onClick={() => setActiveTool('pan')}
        title="Pan Tool"
      >
        <span className="material-symbols-outlined">pan_tool</span>
      </ToolButton>

      <Separator />

      <ToolButton onClick={handleZoomIn} title="Zoom In">
        <span className="material-symbols-outlined">zoom_in</span>
      </ToolButton>
      <ToolButton onClick={handleZoomOut} title="Zoom Out">
        <span className="material-symbols-outlined">zoom_out</span>
      </ToolButton>
      <ToolButton onClick={resetView} title="Fit / Reset View">
        <span className="material-symbols-outlined">fit_screen</span>
      </ToolButton>
    </ToolsContainer>
  );
};

export default InteractiveTools;
