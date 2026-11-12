/**
 * Properties panel for editing selected keys in the canvas editor.
 */

import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useCanvasEditor } from '../context/CanvasEditorContext';

const PanelContainer = styled.div`
  width: 250px;
  background-color: ${theme.colors.backgroundLight};
  border-left: 1px solid ${theme.colors.border};
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.text};
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: 8px;
`;

const NoSelectionMessage = styled.p`
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  margin-top: 32px;
`;

const PropertyGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PropertyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PropertyLabel = styled.label`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
  min-width: 60px;
`;

const PropertyInput = styled.input`
  flex: 1;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 6px 8px;
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

const CoordinateInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const CoordinateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CoordinateLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDark};
  width: 16px;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textDarker};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ActionButton = styled.button`
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 8px 12px;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }

  &:active {
    background-color: ${theme.colors.border};
  }
`;

const ActionButtonDanger = styled(ActionButton)`
  color: ${theme.colors.error};
  border-color: ${theme.colors.error};

  &:hover {
    background-color: ${theme.colors.errorDark};
    color: ${theme.colors.white};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

const QuickAngleButtons = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const QuickAngleButton = styled.button<{ $active?: boolean }>`
  background-color: ${(props) =>
    props.$active ? theme.colors.accent : theme.colors.backgroundLighter};
  border: 1px solid
    ${(props) => (props.$active ? theme.colors.accent : theme.colors.border)};
  border-radius: 4px;
  padding: 4px 8px;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.xs};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${(props) =>
      props.$active ? theme.colors.accentDark : theme.colors.buttonHover};
  }
`;

const KeyPropertiesPanel: React.FC = () => {
  const { state, updateKey, deleteSelectedKeys, pushHistory, getSelectedKeys } =
    useCanvasEditor();

  const selectedKeys = useMemo(() => getSelectedKeys(), [getSelectedKeys]);

  // Get common values for selected keys (if all same, show value; otherwise show mixed)
  const commonValues = useMemo(() => {
    if (selectedKeys.length === 0) return null;
    if (selectedKeys.length === 1) return selectedKeys[0];

    const first = selectedKeys[0];
    return {
      x: selectedKeys.every((k) => k.x === first.x) ? first.x : null,
      y: selectedKeys.every((k) => k.y === first.y) ? first.y : null,
      width: selectedKeys.every((k) => k.width === first.width)
        ? first.width
        : null,
      height: selectedKeys.every((k) => k.height === first.height)
        ? first.height
        : null,
      rotation: selectedKeys.every((k) => k.rotation === first.rotation)
        ? first.rotation
        : null,
      label: selectedKeys.every((k) => k.label === first.label)
        ? first.label
        : null,
      column: selectedKeys.every((k) => k.column === first.column)
        ? first.column
        : null,
      row: selectedKeys.every((k) => k.row === first.row) ? first.row : null,
    };
  }, [selectedKeys]);

  const handlePropertyChange = useCallback(
    (property: string, value: string | number) => {
      pushHistory();
      for (const key of selectedKeys) {
        updateKey(key.id, { [property]: value });
      }
    },
    [selectedKeys, updateKey, pushHistory]
  );

  const handleQuickRotation = useCallback(
    (angle: number) => {
      pushHistory();
      for (const key of selectedKeys) {
        updateKey(key.id, { rotation: angle });
      }
    },
    [selectedKeys, updateKey, pushHistory]
  );

  const handleAlignLeft = useCallback(() => {
    if (selectedKeys.length < 2) return;
    pushHistory();
    const minX = Math.min(...selectedKeys.map((k) => k.x));
    for (const key of selectedKeys) {
      updateKey(key.id, { x: minX });
    }
  }, [selectedKeys, updateKey, pushHistory]);

  const handleAlignRight = useCallback(() => {
    if (selectedKeys.length < 2) return;
    pushHistory();
    const maxX = Math.max(...selectedKeys.map((k) => k.x + k.width));
    for (const key of selectedKeys) {
      updateKey(key.id, { x: maxX - key.width });
    }
  }, [selectedKeys, updateKey, pushHistory]);

  const handleAlignTop = useCallback(() => {
    if (selectedKeys.length < 2) return;
    pushHistory();
    const maxY = Math.max(...selectedKeys.map((k) => k.y));
    for (const key of selectedKeys) {
      updateKey(key.id, { y: maxY });
    }
  }, [selectedKeys, updateKey, pushHistory]);

  const handleAlignBottom = useCallback(() => {
    if (selectedKeys.length < 2) return;
    pushHistory();
    const minY = Math.min(...selectedKeys.map((k) => k.y - k.height));
    for (const key of selectedKeys) {
      updateKey(key.id, { y: minY + key.height });
    }
  }, [selectedKeys, updateKey, pushHistory]);

  const handleDistributeHorizontally = useCallback(() => {
    if (selectedKeys.length < 3) return;
    pushHistory();
    const sorted = [...selectedKeys].sort((a, b) => a.x - b.x);
    const minX = sorted[0].x;
    const maxX = sorted[sorted.length - 1].x;
    const step = (maxX - minX) / (sorted.length - 1);

    sorted.forEach((key, index) => {
      updateKey(key.id, { x: minX + step * index });
    });
  }, [selectedKeys, updateKey, pushHistory]);

  const handleDistributeVertically = useCallback(() => {
    if (selectedKeys.length < 3) return;
    pushHistory();
    const sorted = [...selectedKeys].sort((a, b) => a.y - b.y);
    const minY = sorted[0].y;
    const maxY = sorted[sorted.length - 1].y;
    const step = (maxY - minY) / (sorted.length - 1);

    sorted.forEach((key, index) => {
      updateKey(key.id, { y: minY + step * index });
    });
  }, [selectedKeys, updateKey, pushHistory]);

  const handleDelete = useCallback(() => {
    pushHistory();
    deleteSelectedKeys();
  }, [deleteSelectedKeys, pushHistory]);

  if (selectedKeys.length === 0) {
    return (
      <PanelContainer>
        <PanelTitle>Key Properties</PanelTitle>
        <NoSelectionMessage>
          Select a key to view and edit its properties.
          <br />
          <br />
          Use the Add tool (A) to add new keys.
        </NoSelectionMessage>
      </PanelContainer>
    );
  }

  const unitSuffix = state.grid.unit;

  return (
    <PanelContainer>
      <PanelTitle>
        {selectedKeys.length === 1
          ? 'Key Properties'
          : `${selectedKeys.length} Keys Selected`}
      </PanelTitle>

      <PropertyGroup>
        <SectionTitle>Position ({unitSuffix})</SectionTitle>
        <CoordinateInputs>
          <CoordinateWrapper>
            <CoordinateLabel>X</CoordinateLabel>
            <PropertyInput
              type="number"
              step="0.1"
              value={commonValues?.x ?? ''}
              placeholder={commonValues?.x === null ? 'Mixed' : ''}
              onChange={(e) =>
                handlePropertyChange('x', parseFloat(e.target.value) || 0)
              }
              aria-label="X position"
            />
          </CoordinateWrapper>
          <CoordinateWrapper>
            <CoordinateLabel>Y</CoordinateLabel>
            <PropertyInput
              type="number"
              step="0.1"
              value={commonValues?.y ?? ''}
              placeholder={commonValues?.y === null ? 'Mixed' : ''}
              onChange={(e) =>
                handlePropertyChange('y', parseFloat(e.target.value) || 0)
              }
              aria-label="Y position"
            />
          </CoordinateWrapper>
        </CoordinateInputs>
      </PropertyGroup>

      <PropertyGroup>
        <SectionTitle>Size ({unitSuffix})</SectionTitle>
        <CoordinateInputs>
          <CoordinateWrapper>
            <CoordinateLabel>W</CoordinateLabel>
            <PropertyInput
              type="number"
              step="0.25"
              min="0.25"
              value={commonValues?.width ?? ''}
              placeholder={commonValues?.width === null ? 'Mixed' : ''}
              onChange={(e) =>
                handlePropertyChange(
                  'width',
                  Math.max(0.25, parseFloat(e.target.value) || 1)
                )
              }
              aria-label="Width"
            />
          </CoordinateWrapper>
          <CoordinateWrapper>
            <CoordinateLabel>H</CoordinateLabel>
            <PropertyInput
              type="number"
              step="0.25"
              min="0.25"
              value={commonValues?.height ?? ''}
              placeholder={commonValues?.height === null ? 'Mixed' : ''}
              onChange={(e) =>
                handlePropertyChange(
                  'height',
                  Math.max(0.25, parseFloat(e.target.value) || 1)
                )
              }
              aria-label="Height"
            />
          </CoordinateWrapper>
        </CoordinateInputs>
      </PropertyGroup>

      <PropertyGroup>
        <SectionTitle>Rotation (°)</SectionTitle>
        <PropertyRow>
          <PropertyInput
            type="number"
            step="5"
            value={commonValues?.rotation ?? ''}
            placeholder={commonValues?.rotation === null ? 'Mixed' : ''}
            onChange={(e) =>
              handlePropertyChange('rotation', parseFloat(e.target.value) || 0)
            }
            aria-label="Rotation angle"
          />
        </PropertyRow>
        <QuickAngleButtons>
          {[0, 15, 30, 45, 90, -15, -30, -45].map((angle) => (
            <QuickAngleButton
              key={angle}
              $active={commonValues?.rotation === angle}
              onClick={() => handleQuickRotation(angle)}
            >
              {angle}°
            </QuickAngleButton>
          ))}
        </QuickAngleButtons>
      </PropertyGroup>

      <PropertyGroup>
        <SectionTitle>Label</SectionTitle>
        <PropertyInput
          type="text"
          value={commonValues?.label ?? ''}
          placeholder={commonValues?.label === null ? 'Mixed' : 'Key label'}
          onChange={(e) => handlePropertyChange('label', e.target.value)}
          aria-label="Key label"
        />
      </PropertyGroup>

      <PropertyGroup>
        <SectionTitle>Ergogen Assignment</SectionTitle>
        <PropertyRow>
          <PropertyLabel>Column</PropertyLabel>
          <PropertyInput
            type="text"
            value={commonValues?.column ?? ''}
            placeholder={commonValues?.column === null ? 'Mixed' : 'Auto'}
            onChange={(e) => handlePropertyChange('column', e.target.value)}
            aria-label="Column name"
          />
        </PropertyRow>
        <PropertyRow>
          <PropertyLabel>Row</PropertyLabel>
          <PropertyInput
            type="text"
            value={commonValues?.row ?? ''}
            placeholder={commonValues?.row === null ? 'Mixed' : 'Auto'}
            onChange={(e) => handlePropertyChange('row', e.target.value)}
            aria-label="Row name"
          />
        </PropertyRow>
      </PropertyGroup>

      {selectedKeys.length >= 2 && (
        <PropertyGroup>
          <SectionTitle>Align</SectionTitle>
          <ButtonRow>
            <ActionButton onClick={handleAlignLeft} title="Align Left">
              ⬅
            </ActionButton>
            <ActionButton onClick={handleAlignRight} title="Align Right">
              ➡
            </ActionButton>
            <ActionButton onClick={handleAlignTop} title="Align Top">
              ⬆
            </ActionButton>
            <ActionButton onClick={handleAlignBottom} title="Align Bottom">
              ⬇
            </ActionButton>
          </ButtonRow>
          {selectedKeys.length >= 3 && (
            <>
              <SectionTitle>Distribute</SectionTitle>
              <ButtonRow>
                <ActionButton
                  onClick={handleDistributeHorizontally}
                  title="Distribute Horizontally"
                >
                  ↔
                </ActionButton>
                <ActionButton
                  onClick={handleDistributeVertically}
                  title="Distribute Vertically"
                >
                  ↕
                </ActionButton>
              </ButtonRow>
            </>
          )}
        </PropertyGroup>
      )}

      <PropertyGroup style={{ marginTop: 'auto' }}>
        <ActionButtonDanger onClick={handleDelete}>
          Delete Selected ({selectedKeys.length})
        </ActionButtonDanger>
      </PropertyGroup>
    </PanelContainer>
  );
};

export default KeyPropertiesPanel;
