/**
 * EditorToolbar - Vertical toolbar with editing tools for the layout editor.
 * Provides tools for selection, adding keys, moving, rotating, and other operations.
 */
import React from 'react';
import styled from 'styled-components';
import { useLayoutEditor } from '../LayoutEditorContext';
import { EditorMode } from '../types';
import { theme } from '../../theme/theme';

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 48px;
  background-color: ${theme.colors.background};
  border-right: 1px solid ${theme.colors.border};
  padding: 8px;
  gap: 4px;
`;

const ToolSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SectionLabel = styled.span`
  font-size: 10px;
  color: ${theme.colors.textDarkest};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 0;
`;

const ToolButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background-color: ${(p) => (p.$active ? theme.colors.accent : 'transparent')};
  color: ${(p) => (p.$active ? theme.colors.white : theme.colors.textDark)};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${(p) =>
      p.$active ? theme.colors.accentDark : theme.colors.buttonHover};
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
`;

interface ToolbarItemProps {
  icon: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const ToolbarItem: React.FC<ToolbarItemProps> = ({
  icon,
  title,
  active,
  disabled,
  onClick,
}) => (
  <ToolButton
    $active={active}
    $disabled={disabled}
    disabled={disabled}
    onClick={onClick}
    title={title}
    aria-label={title}
  >
    <span className="material-symbols-outlined">{icon}</span>
  </ToolButton>
);

export const EditorToolbar: React.FC = () => {
  const {
    state,
    setMode,
    deleteSelectedKeys,
    undo,
    redo,
    canUndo,
    canRedo,
    handleAddKeyButtonClick,
    zoom,
    resetView,
  } = useLayoutEditor();

  const { mode, selection } = state;
  const hasSelection = selection.keys.size > 0;

  const handleModeChange = (newMode: EditorMode) => {
    setMode(newMode);
  };

  return (
    <ToolbarContainer data-testid="editor-toolbar">
      <ToolSection>
        <SectionLabel>Edit</SectionLabel>
        <ToolbarItem
          icon="add_circle"
          title="Add Key (A)"
          active={mode === 'add-key'}
          onClick={handleAddKeyButtonClick}
        />
        <ToolbarItem
          icon="remove_circle"
          title="Delete Selected (Delete)"
          disabled={!hasSelection}
          onClick={deleteSelectedKeys}
        />
        <ToolbarItem
          icon="content_copy"
          title="Duplicate Selected (Ctrl+D)"
          disabled={!hasSelection}
          onClick={() => {
            // TODO: Implement duplication
          }}
        />
      </ToolSection>

      <ToolSection>
        <SectionLabel>Tools</SectionLabel>
        <ToolbarItem
          icon="arrow_selector_tool"
          title="Select (V)"
          active={mode === 'select'}
          onClick={() => handleModeChange('select')}
        />
        <ToolbarItem
          icon="open_with"
          title="Move (M)"
          active={mode === 'move'}
          onClick={() => handleModeChange('move')}
        />
        <ToolbarItem
          icon="pan_tool"
          title="Pan (Space+Drag)"
          active={mode === 'pan'}
          onClick={() => handleModeChange('pan')}
        />
        <ToolbarItem
          icon="rotate_right"
          title="Rotate (R)"
          active={mode === 'rotate'}
          disabled={!hasSelection}
          onClick={() => handleModeChange('rotate')}
        />
      </ToolSection>

      <ToolSection>
        <SectionLabel>View</SectionLabel>
        <ToolbarItem
          icon="zoom_in"
          title="Zoom In"
          onClick={() => zoom(0.1)}
        />
        <ToolbarItem
          icon="zoom_out"
          title="Zoom Out"
          onClick={() => zoom(-0.1)}
        />
        <ToolbarItem
          icon="fit_screen"
          title="Fit to View"
          onClick={resetView}
        />
      </ToolSection>

      <ToolSection>
        <SectionLabel>History</SectionLabel>
        <ToolbarItem
          icon="undo"
          title="Undo (Ctrl+Z)"
          disabled={!canUndo}
          onClick={undo}
        />
        <ToolbarItem
          icon="redo"
          title="Redo (Ctrl+Shift+Z)"
          disabled={!canRedo}
          onClick={redo}
        />
      </ToolSection>
    </ToolbarContainer>
  );
};
