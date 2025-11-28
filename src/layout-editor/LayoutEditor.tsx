/**
 * LayoutEditor - Main page component for the visual keyboard layout editor.
 * Combines the canvas, toolbar, and properties panels into a complete editor interface.
 */
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LayoutEditorProvider, useLayoutEditor } from './LayoutEditorContext';
import {
  LayoutCanvas,
  EditorToolbar,
  KeyPropertiesPanel,
  ZonePropertiesPanel,
  UnitInput,
} from './components';
import { layoutToYaml, yamlToLayout } from './utils/yamlConverter';
import { theme } from '../theme/theme';
import ResizablePanel from '../molecules/ResizablePanel';
import { useConfigContext } from '../context/ConfigContext';

// Main container for the layout editor
const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${theme.colors.background};
`;

// Header with title and actions
const EditorHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.border};
  min-height: 48px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderTitle = styled.h1`
  font-size: ${theme.fontSizes.bodyLarge};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text};
  margin: 0;
`;

const SavedIndicator = styled.span`
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.textDark};
  display: flex;
  align-items: center;
  gap: 4px;

  .material-symbols-outlined {
    font-size: 14px;
    color: ${theme.colors.accent};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${theme.fontWeights.semiBold};
  cursor: pointer;
  transition: all 0.15s ease;

  .material-symbols-outlined {
    font-size: 18px;
  }

  ${(p) =>
    p.$primary
      ? `
    background-color: ${theme.colors.accent};
    border: 1px solid ${theme.colors.accent};
    color: ${theme.colors.white};
    
    &:hover {
      background-color: ${theme.colors.accentDark};
    }
  `
      : `
    background-color: transparent;
    border: 1px solid ${theme.colors.border};
    color: ${theme.colors.textDark};
    
    &:hover {
      background-color: ${theme.colors.buttonHover};
      color: ${theme.colors.text};
    }
  `}
`;

// Main content area
const EditorContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// Canvas area with toolbar
const CanvasArea = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// Properties panel container
const PropertiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${theme.colors.background};
`;

// Tab bar for properties panels
const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.border};
`;

const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 12px 16px;
  background-color: ${(p) =>
    p.$active ? theme.colors.backgroundLight : 'transparent'};
  border: none;
  border-bottom: 2px solid
    ${(p) => (p.$active ? theme.colors.accent : 'transparent')};
  color: ${(p) => (p.$active ? theme.colors.text : theme.colors.textDark)};
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${theme.fontWeights.semiBold};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow: hidden;
`;

// Help button
const HelpButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.border};
  background-color: transparent;
  color: ${theme.colors.textDark};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${theme.colors.buttonHover};
    color: ${theme.colors.text};
  }

  .material-symbols-outlined {
    font-size: 18px;
  }
`;

type PropertiesTab = 'key' | 'zone' | 'settings';

/**
 * Inner component that uses the layout editor context.
 */
const LayoutEditorContent: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch, saveHistory } = useLayoutEditor();
  const configContext = useConfigContext();
  const [activeTab, setActiveTab] = useState<PropertiesTab>('key');
  const [showHelp, setShowHelp] = useState(false);

  const { layout, isDirty } = state;

  // Handle export to YAML
  const handleExport = useCallback(() => {
    try {
      const yaml = layoutToYaml(layout);

      // Create a blob and download
      const blob = new Blob([yaml], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'config.yaml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      dispatch({ type: 'MARK_CLEAN' });
    } catch (error) {
      console.error('Failed to export layout:', error);
    }
  }, [layout, dispatch]);

  // Handle send to Ergogen editor
  const handleSendToEditor = useCallback(async () => {
    if (!configContext) {
      console.error('Config context not available');
      return;
    }

    try {
      const yaml = layoutToYaml(layout);

      // Update the config in the context (this will also update localStorage)
      configContext.setConfigInput(yaml);

      // Generate the output
      await configContext.generateNow(yaml, configContext.injectionInput, {
        pointsonly: false,
      });

      // Navigate to the main editor
      navigate('/');
    } catch (error) {
      console.error('Failed to send to editor:', error);
    }
  }, [layout, navigate, configContext]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl/Cmd + S: Prevent default (auto-save handles saving)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Auto-save is handled by the effect below, no action needed
      }

      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // Auto-save to localStorage after every layout change
  useEffect(() => {
    if (isDirty) {
      try {
        const yaml = layoutToYaml(layout);
        localStorage.setItem('layout-editor:autosave', yaml);
        // Mark as clean since we've auto-saved
        dispatch({ type: 'MARK_CLEAN' });
      } catch (error) {
        console.error('Failed to autosave:', error);
      }
    }
  }, [isDirty, layout, dispatch]);

  // Load autosave on mount
  useEffect(() => {
    const autosave = localStorage.getItem('layout-editor:autosave');
    if (autosave) {
      try {
        const loadedLayout = yamlToLayout(autosave);
        dispatch({ type: 'SET_LAYOUT', payload: loadedLayout });
        saveHistory('Load autosaved layout');
      } catch (error) {
        console.error('Failed to load autosave:', error);
      }
    }
  }, [dispatch, saveHistory]);

  return (
    <EditorContainer>
      <EditorHeader>
        <HeaderLeft>
          <HeaderTitle>Layout Editor</HeaderTitle>
          <SavedIndicator>
            <span className="material-symbols-outlined">check_circle</span>
            Auto-saved
          </SavedIndicator>
        </HeaderLeft>
        <HeaderActions>
          <HelpButton
            onClick={() => setShowHelp(!showHelp)}
            title="Help"
            aria-label="Show help"
          >
            <span className="material-symbols-outlined">help</span>
          </HelpButton>
          <HeaderButton onClick={() => navigate('/new')}>
            <span className="material-symbols-outlined">close</span>
            Cancel
          </HeaderButton>
          <HeaderButton onClick={handleExport}>
            <span className="material-symbols-outlined">download</span>
            Export YAML
          </HeaderButton>
          <HeaderButton $primary onClick={handleSendToEditor}>
            <span className="material-symbols-outlined">send</span>
            Send to Editor
          </HeaderButton>
        </HeaderActions>
      </EditorHeader>

      <EditorContent>
        <CanvasArea>
          <EditorToolbar />
          <LayoutCanvas />
        </CanvasArea>

        <ResizablePanel
          initialWidth={320}
          minWidth={250}
          maxWidth="40%"
          side="right"
          data-testid="properties-panel"
        >
          <PropertiesContainer>
            <TabBar>
              <Tab
                $active={activeTab === 'key'}
                onClick={() => setActiveTab('key')}
              >
                Key Properties
              </Tab>
              <Tab
                $active={activeTab === 'zone'}
                onClick={() => setActiveTab('zone')}
              >
                Zones
              </Tab>
              <Tab
                $active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </Tab>
            </TabBar>
            <TabContent>
              {activeTab === 'key' && <KeyPropertiesPanel />}
              {activeTab === 'zone' && <ZonePropertiesPanel />}
              {activeTab === 'settings' && <SettingsPanel />}
            </TabContent>
          </PropertiesContainer>
        </ResizablePanel>
      </EditorContent>
    </EditorContainer>
  );
};

/**
 * Settings panel for global layout settings.
 */
const SettingsPanelContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SettingsTitle = styled.h3`
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.textDark};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${theme.colors.border};
`;

const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SettingsLabel = styled.label`
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.textDark};
`;

const Toggle = styled.button<{ $active?: boolean }>`
  width: 48px;
  height: 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  background-color: ${(p) =>
    p.$active ? theme.colors.accent : theme.colors.backgroundLighter};

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${(p) => (p.$active ? '26px' : '2px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${theme.colors.white};
    transition: left 0.2s ease;
  }
`;

const SettingsInput = styled.input`
  width: 80px;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 6px 10px;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.code};
  font-size: ${theme.fontSizes.bodySmall};
  text-align: right;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const SettingsPanel: React.FC = () => {
  const { state, dispatch } = useLayoutEditor();
  const { grid, layout } = state;

  return (
    <SettingsPanelContainer>
      <SettingsSection>
        <SettingsTitle>Grid</SettingsTitle>
        <SettingsRow>
          <SettingsLabel>Show Grid</SettingsLabel>
          <Toggle
            $active={grid.visible}
            onClick={() => dispatch({ type: 'TOGGLE_GRID' })}
            aria-label="Toggle grid visibility"
          />
        </SettingsRow>
        <SettingsRow>
          <SettingsLabel>Snap to Grid</SettingsLabel>
          <Toggle
            $active={grid.snap}
            onClick={() => dispatch({ type: 'TOGGLE_SNAP' })}
            aria-label="Toggle snap to grid"
          />
        </SettingsRow>
        <SettingsRow>
          <SettingsLabel>Grid Size</SettingsLabel>
          <UnitInput
            value={grid.size}
            onChange={(val) =>
              dispatch({
                type: 'SET_GRID_SIZE',
                payload: Math.max(0.1, val),
              })
            }
            min={0.1}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection>
        <SettingsTitle>Mirror</SettingsTitle>
        <SettingsRow>
          <SettingsLabel>Enable Mirror</SettingsLabel>
          <Toggle
            $active={layout.mirror.enabled}
            onClick={() =>
              dispatch({
                type: 'SET_MIRROR',
                payload: { enabled: !layout.mirror.enabled },
              })
            }
            aria-label="Toggle mirror"
          />
        </SettingsRow>
        <SettingsRow>
          <SettingsLabel>Distance</SettingsLabel>
          <UnitInput
            value={layout.mirror.distance}
            onChange={(val) =>
              dispatch({
                type: 'SET_MIRROR',
                payload: { distance: val },
              })
            }
            step={1}
            disabled={!layout.mirror.enabled}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection>
        <SettingsTitle>Global Transform</SettingsTitle>
        <SettingsRow>
          <SettingsLabel>Rotation</SettingsLabel>
          <UnitInput
            type="angle"
            value={layout.globalRotation}
            onChange={(val) =>
              dispatch({
                type: 'SET_GLOBAL_ROTATION',
                payload: val,
              })
            }
            step={5}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection>
        <SettingsTitle>Meta</SettingsTitle>
        <SettingsRow>
          <SettingsLabel>Name</SettingsLabel>
          <SettingsInput
            type="text"
            value={layout.meta.name || ''}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_META',
                payload: { name: e.target.value },
              })
            }
            placeholder="Keyboard Name"
            style={{ width: '120px', textAlign: 'left' }}
          />
        </SettingsRow>
        <SettingsRow>
          <SettingsLabel>Version</SettingsLabel>
          <SettingsInput
            type="text"
            value={layout.meta.version || ''}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_META',
                payload: { version: e.target.value },
              })
            }
            placeholder="0.1"
            style={{ width: '60px' }}
          />
        </SettingsRow>
        <SettingsRow>
          <SettingsLabel>Author</SettingsLabel>
          <SettingsInput
            type="text"
            value={layout.meta.author || ''}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_META',
                payload: { author: e.target.value },
              })
            }
            placeholder="Your Name"
            style={{ width: '120px', textAlign: 'left' }}
          />
        </SettingsRow>
      </SettingsSection>
    </SettingsPanelContainer>
  );
};

/**
 * Main LayoutEditor component wrapped with provider.
 */
export const LayoutEditor: React.FC = () => {
  return (
    <LayoutEditorProvider>
      <LayoutEditorContent />
    </LayoutEditorProvider>
  );
};
