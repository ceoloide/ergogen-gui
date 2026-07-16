/**
 * Toolbar for the canvas keyboard layout editor.
 * Provides tool selection, grid controls, and other settings.
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useCanvasEditor } from '../context/CanvasEditorContext';
import { CanvasTool, GridUnit } from '../types/canvas';

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.backgroundLight};
  border-right: 1px solid ${theme.colors.border};
  padding: 8px;
  gap: 8px;
  width: 48px;
  align-items: center;
`;

const ToolGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;
  border-bottom: 1px solid ${theme.colors.border};
  width: 100%;

  &:last-child {
    border-bottom: none;
  }
`;

const ToolButton = styled.button<{ $active?: boolean; $title?: string }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$active ? theme.colors.accent : 'transparent'};
  border: 1px solid
    ${(props) => (props.$active ? theme.colors.accent : 'transparent')};
  border-radius: 4px;
  cursor: pointer;
  color: ${theme.colors.text};
  font-size: 16px;
  transition: all 0.15s ease;
  margin: 0 auto;

  &:hover {
    background-color: ${(props) =>
      props.$active ? theme.colors.accentDark : theme.colors.buttonHover};
    border-color: ${theme.colors.border};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const BottomToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background-color: ${theme.colors.backgroundLight};
  border-top: 1px solid ${theme.colors.border};
  flex-wrap: wrap;
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
`;

const Select = styled.select`
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 4px 8px;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const NumberInput = styled.input`
  width: 60px;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 4px 8px;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;

const Checkbox = styled.input`
  cursor: pointer;
  accent-color: ${theme.colors.accent};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
  cursor: pointer;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: ${theme.colors.border};
`;

const ZoomDisplay = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
  min-width: 50px;
  text-align: center;
`;

// SVG Icons for tools
const SelectIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4L7 18.5V2z" />
  </svg>
);

const AddIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const MoveIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z" />
  </svg>
);

const RotateIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
  </svg>
);

const MirrorVerticalIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 21h2v-2h-2v2zm4-12h2V7h-2v2zm0 4h2v-2h-2v2zm0 4h2v-2h-2v2zm-8 4h2V3h-2v18zm8-16v2h2V5h-2zM5 7H3v2h2V7zm0 4H3v2h2v-2zm0 4H3v2h2v-2zm0 4H3v2h2v-2zm0-12H3v2h2V7z" />
  </svg>
);

const MirrorHorizontalIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 15v2h2v-2H3zm12 4v2h2v-2h-2zm-4-8v2h18v-2H11zM7 19v2h2v-2H7zm-4 0v2h2v-2H3zm4-12V5H5v2h2zm4 0V5H9v2h2zm4 0V5h-2v2h2zm4 0V5h-2v2h2zM7 15v2h2v-2H7zm8 0v2h2v-2h-2z" />
  </svg>
);

const UndoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
  </svg>
);

const RedoIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" />
  </svg>
);

const ZoomInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
  </svg>
);

const ZoomOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7V9z" />
  </svg>
);

const FitIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 5v4h2V5h4V3H5c-1.1 0-2 .9-2 2zm2 10H3v4c0 1.1.9 2 2 2h4v-2H5v-4zm14 4h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zm0-16h-4v2h4v4h2V5c0-1.1-.9-2-2-2z" />
  </svg>
);

interface CanvasToolbarProps {
  onExport: () => void;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onExport: _onExport,
}) => {
  const { state, setTool, setZoom, setPan, undo, redo } = useCanvasEditor();

  const tools: { id: CanvasTool; icon: React.ReactNode; title: string }[] = [
    { id: 'select', icon: <SelectIcon />, title: 'Select (V)' },
    { id: 'add', icon: <AddIcon />, title: 'Add Key (A)' },
    { id: 'move', icon: <MoveIcon />, title: 'Move (M)' },
    { id: 'rotate', icon: <RotateIcon />, title: 'Rotate (R)' },
    {
      id: 'mirror-vertical',
      icon: <MirrorVerticalIcon />,
      title: 'Mirror Vertical',
    },
    {
      id: 'mirror-horizontal',
      icon: <MirrorHorizontalIcon />,
      title: 'Mirror Horizontal',
    },
  ];

  const handleZoomIn = () => setZoom(state.zoom * 1.2);
  const handleZoomOut = () => setZoom(state.zoom / 1.2);
  const handleFitToScreen = () => {
    setZoom(1);
    setPan({ x: 100, y: 100 });
  };

  return (
    <>
      <ToolbarContainer>
        <ToolGroup>
          {tools.slice(0, 4).map((tool) => (
            <ToolButton
              key={tool.id}
              $active={state.tool === tool.id}
              onClick={() => setTool(tool.id)}
              title={tool.title}
              aria-label={tool.title}
            >
              {tool.icon}
            </ToolButton>
          ))}
        </ToolGroup>

        <ToolGroup>
          {tools.slice(4).map((tool) => (
            <ToolButton
              key={tool.id}
              $active={state.tool === tool.id}
              onClick={() => setTool(tool.id)}
              title={tool.title}
              aria-label={tool.title}
            >
              {tool.icon}
            </ToolButton>
          ))}
        </ToolGroup>

        <ToolGroup>
          <ToolButton
            onClick={undo}
            disabled={state.historyIndex <= 0}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <UndoIcon />
          </ToolButton>
          <ToolButton
            onClick={redo}
            disabled={state.historyIndex >= state.history.length - 1}
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <RedoIcon />
          </ToolButton>
        </ToolGroup>

        <ToolGroup>
          <ToolButton
            onClick={handleZoomIn}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomInIcon />
          </ToolButton>
          <ToolButton
            onClick={handleZoomOut}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOutIcon />
          </ToolButton>
          <ToolButton
            onClick={handleFitToScreen}
            title="Fit to Screen"
            aria-label="Fit to Screen"
          >
            <FitIcon />
          </ToolButton>
        </ToolGroup>
      </ToolbarContainer>
    </>
  );
};

export const CanvasBottomToolbar: React.FC<{ onExport: () => void }> = ({
  onExport,
}) => {
  const { state, setGrid, setRotationLock } = useCanvasEditor();

  return (
    <BottomToolbar>
      <ToolbarSection>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={state.grid.visible}
            onChange={(e) => setGrid({ visible: e.target.checked })}
          />
          Show Grid
        </CheckboxLabel>
      </ToolbarSection>

      <ToolbarSection>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={state.grid.snap}
            onChange={(e) => setGrid({ snap: e.target.checked })}
          />
          Snap to Grid
        </CheckboxLabel>
      </ToolbarSection>

      <Divider />

      <ToolbarSection>
        <Label>Unit:</Label>
        <Select
          value={state.grid.unit}
          onChange={(e) => setGrid({ unit: e.target.value as GridUnit })}
          aria-label="Grid unit"
        >
          <option value="U">U (19.05mm)</option>
          <option value="u">u (19mm)</option>
          <option value="mm">mm</option>
        </Select>
      </ToolbarSection>

      <ToolbarSection>
        <Label>Step:</Label>
        <NumberInput
          type="number"
          min="0.1"
          step="0.1"
          value={state.grid.size}
          onChange={(e) => setGrid({ size: parseFloat(e.target.value) || 1 })}
          aria-label="Grid step size"
        />
      </ToolbarSection>

      <Divider />

      <ToolbarSection>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={state.rotationLock}
            onChange={(e) => setRotationLock(e.target.checked)}
          />
          Lock Rotations
        </CheckboxLabel>
      </ToolbarSection>

      <Divider />

      <ToolbarSection>
        <ZoomDisplay>{Math.round(state.zoom * 100)}%</ZoomDisplay>
      </ToolbarSection>

      <ToolbarSection style={{ marginLeft: 'auto' }}>
        <Label>{state.keys.length} keys</Label>
        {state.selection.selectedKeys.size > 0 && (
          <Label>({state.selection.selectedKeys.size} selected)</Label>
        )}
      </ToolbarSection>

      <ExportButton onClick={onExport}>Export to Ergogen</ExportButton>
    </BottomToolbar>
  );
};

const ExportButton = styled.button`
  background-color: ${theme.colors.accent};
  color: ${theme.colors.white};
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semiBold};
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${theme.colors.accentDark};
  }

  &:active {
    background-color: ${theme.colors.accentDarker};
  }
`;

export default CanvasToolbar;
