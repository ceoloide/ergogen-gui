/**
 * Interactive canvas-based keyboard layout editor page.
 *
 * This page provides a visual editor for creating keyboard layouts
 * without writing YAML configurations directly.
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import {
  CanvasEditorProvider,
  useCanvasEditor,
} from '../context/CanvasEditorContext';
import KeyboardCanvas from '../molecules/KeyboardCanvas';
import CanvasToolbar, { CanvasBottomToolbar } from '../molecules/CanvasToolbar';
import KeyPropertiesPanel from '../molecules/KeyPropertiesPanel';
import { exportToErgogenYaml } from '../utils/ergogenExport';
import { useConfigContext } from '../context/ConfigContext';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${theme.colors.background};
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const CanvasArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ExportDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ExportDialogContent = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border-radius: 8px;
  padding: 24px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ExportDialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ExportDialogTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.h3};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textDark};
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;

  &:hover {
    color: ${theme.colors.text};
  }
`;

const ExportPreview = styled.pre`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 16px;
  margin: 0;
  overflow: auto;
  flex: 1;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.code};
  font-size: ${theme.fontSizes.sm};
  white-space: pre;
  min-height: 200px;
`;

const ExportActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  background-color: ${(props) =>
    props.$primary ? theme.colors.accent : theme.colors.backgroundLighter};
  color: ${theme.colors.text};
  border: 1px solid
    ${(props) => (props.$primary ? theme.colors.accent : theme.colors.border)};
  border-radius: 4px;
  padding: 10px 20px;
  font-size: ${theme.fontSizes.base};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${(props) =>
      props.$primary ? theme.colors.accentDark : theme.colors.buttonHover};
  }
`;

/**
 * Inner content component that uses the canvas editor context
 */
const CanvasEditorContent: React.FC = () => {
  const { state } = useCanvasEditor();
  const configContext = useConfigContext();
  const navigate = useNavigate();

  const [showExport, setShowExport] = useState(false);
  const [exportedYaml, setExportedYaml] = useState('');

  const handleExport = useCallback(() => {
    const yaml = exportToErgogenYaml(state.keys, {
      unit: state.grid.unit,
      autoAssign: true,
      includeSize: true,
    });
    setExportedYaml(yaml);
    setShowExport(true);
  }, [state.keys, state.grid.unit]);

  const handleCopyYaml = useCallback(() => {
    navigator.clipboard.writeText(exportedYaml);
  }, [exportedYaml]);

  const handleUseInEditor = useCallback(async () => {
    if (configContext) {
      configContext.setConfigInput(exportedYaml);
      await configContext.generateNow(
        exportedYaml,
        configContext.injectionInput,
        { pointsonly: false }
      );
      navigate('/');
    }
  }, [exportedYaml, configContext, navigate]);

  const handleDownloadYaml = useCallback(() => {
    const blob = new Blob([exportedYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyboard-layout.yaml';
    a.click();
    URL.revokeObjectURL(url);
  }, [exportedYaml]);

  return (
    <PageContainer>
      <MainContent>
        <CanvasToolbar onExport={handleExport} />
        <CanvasArea>
          <KeyboardCanvas />
          <CanvasBottomToolbar onExport={handleExport} />
        </CanvasArea>
        <KeyPropertiesPanel />
      </MainContent>

      {showExport && (
        <ExportDialog onClick={() => setShowExport(false)}>
          <ExportDialogContent onClick={(e) => e.stopPropagation()}>
            <ExportDialogHeader>
              <ExportDialogTitle>Export to Ergogen YAML</ExportDialogTitle>
              <CloseButton
                onClick={() => setShowExport(false)}
                aria-label="Close"
              >
                ×
              </CloseButton>
            </ExportDialogHeader>
            <ExportPreview>{exportedYaml}</ExportPreview>
            <ExportActions>
              <ActionButton onClick={handleCopyYaml}>
                Copy to Clipboard
              </ActionButton>
              <ActionButton onClick={handleDownloadYaml}>
                Download YAML
              </ActionButton>
              <ActionButton $primary onClick={handleUseInEditor}>
                Use in YAML Editor
              </ActionButton>
            </ExportActions>
          </ExportDialogContent>
        </ExportDialog>
      )}
    </PageContainer>
  );
};

/**
 * Main Canvas Editor page component with provider
 */
const CanvasEditor: React.FC = () => {
  return (
    <CanvasEditorProvider>
      <CanvasEditorContent />
    </CanvasEditorProvider>
  );
};

export default CanvasEditor;
