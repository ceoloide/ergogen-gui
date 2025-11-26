/**
 * KeyPropertiesPanel - Panel for editing properties of selected keys.
 * Displays position, rotation, size, and other key properties.
 */
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useLayoutEditor } from '../LayoutEditorContext';
import { theme } from '../../theme/theme';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: ${theme.colors.background};
  height: 100%;
  overflow-y: auto;
`;

const PanelSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.textDark};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid ${theme.colors.border};
`;

const PropertyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PropertyLabel = styled.label`
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.textDark};
  min-width: 70px;
`;

const PropertyInput = styled.input`
  flex: 1;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 6px 10px;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.code};
  font-size: ${theme.fontSizes.bodySmall};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PropertyInputGroup = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
`;

const SmallInput = styled(PropertyInput)`
  width: 60px;
  flex: none;
`;

const InputWithLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SmallLabel = styled.span`
  font-size: 10px;
  color: ${theme.colors.textDarkest};
  text-transform: uppercase;
`;

const ColorInput = styled.input`
  width: 32px;
  height: 32px;
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 2px;
  cursor: pointer;
  background-color: transparent;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 2px;
  }
`;

const NoSelectionMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
  color: ${theme.colors.textDarkest};
  gap: 12px;

  .material-symbols-outlined {
    font-size: 48px;
    opacity: 0.5;
  }
`;

const MultiSelectionMessage = styled.div`
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.textDark};
  padding: 12px;
  background-color: ${theme.colors.backgroundLighter};
  border-radius: 4px;
  text-align: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' }>`
  flex: 1;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: ${theme.fontSizes.bodySmall};
  cursor: pointer;
  transition: all 0.15s ease;

  ${(p) =>
    p.$variant === 'danger'
      ? `
    background-color: transparent;
    border: 1px solid ${theme.colors.error};
    color: ${theme.colors.error};
    
    &:hover {
      background-color: ${theme.colors.errorDark};
      color: ${theme.colors.white};
    }
  `
      : `
    background-color: ${theme.colors.accent};
    border: 1px solid ${theme.colors.accent};
    color: ${theme.colors.white};
    
    &:hover {
      background-color: ${theme.colors.accentDark};
    }
  `}
`;

export const KeyPropertiesPanel: React.FC = () => {
  const { selectedKeys, updateKey, deleteSelectedKeys, saveHistory } =
    useLayoutEditor();

  const selectedCount = selectedKeys.length;
  const singleKey = selectedCount === 1 ? selectedKeys[0] : null;

  const handlePropertyChange = useCallback(
    (property: string, value: string | number) => {
      if (!singleKey) return;
      updateKey(singleKey.id, { [property]: value });
    },
    [singleKey, updateKey]
  );

  const handleBlur = useCallback(() => {
    saveHistory('Update key properties');
  }, [saveHistory]);

  if (selectedCount === 0) {
    return (
      <PanelContainer>
        <NoSelectionMessage>
          <span className="material-symbols-outlined">touch_app</span>
          <div>
            <strong>No key selected</strong>
            <p>
              Click on a key to select it, or use the Add Key tool to create new
              keys.
            </p>
          </div>
        </NoSelectionMessage>
      </PanelContainer>
    );
  }

  if (selectedCount > 1) {
    return (
      <PanelContainer>
        <PanelSection>
          <SectionTitle>Multiple Selection</SectionTitle>
          <MultiSelectionMessage>
            {selectedCount} keys selected
          </MultiSelectionMessage>
          <ButtonRow>
            <ActionButton
              $variant="danger"
              onClick={deleteSelectedKeys}
              aria-label="Delete selected keys"
            >
              Delete All
            </ActionButton>
          </ButtonRow>
        </PanelSection>

        <PanelSection>
          <SectionTitle>Bulk Actions</SectionTitle>
          <ButtonRow>
            <ActionButton
              onClick={() => {
                // TODO: Align left
              }}
              aria-label="Align keys left"
            >
              Align Left
            </ActionButton>
            <ActionButton
              onClick={() => {
                // TODO: Align right
              }}
              aria-label="Align keys right"
            >
              Align Right
            </ActionButton>
          </ButtonRow>
          <ButtonRow>
            <ActionButton
              onClick={() => {
                // TODO: Align top
              }}
              aria-label="Align keys top"
            >
              Align Top
            </ActionButton>
            <ActionButton
              onClick={() => {
                // TODO: Align bottom
              }}
              aria-label="Align keys bottom"
            >
              Align Bottom
            </ActionButton>
          </ButtonRow>
        </PanelSection>
      </PanelContainer>
    );
  }

  // Single key selected
  return (
    <PanelContainer data-testid="key-properties-panel">
      <PanelSection>
        <SectionTitle>Position &amp; Rotation</SectionTitle>
        <PropertyRow>
          <PropertyLabel>Position</PropertyLabel>
          <PropertyInputGroup>
            <InputWithLabel>
              <SmallLabel>X</SmallLabel>
              <SmallInput
                type="number"
                step="0.25"
                value={singleKey!.x}
                onChange={(e) =>
                  handlePropertyChange('x', parseFloat(e.target.value) || 0)
                }
                onBlur={handleBlur}
                aria-label="X position"
              />
            </InputWithLabel>
            <InputWithLabel>
              <SmallLabel>Y</SmallLabel>
              <SmallInput
                type="number"
                step="0.25"
                value={singleKey!.y}
                onChange={(e) =>
                  handlePropertyChange('y', parseFloat(e.target.value) || 0)
                }
                onBlur={handleBlur}
                aria-label="Y position"
              />
            </InputWithLabel>
          </PropertyInputGroup>
        </PropertyRow>

        <PropertyRow>
          <PropertyLabel>Size</PropertyLabel>
          <PropertyInputGroup>
            <InputWithLabel>
              <SmallLabel>Width</SmallLabel>
              <SmallInput
                type="number"
                step="0.25"
                min="0.25"
                value={singleKey!.width}
                onChange={(e) =>
                  handlePropertyChange(
                    'width',
                    Math.max(0.25, parseFloat(e.target.value) || 1)
                  )
                }
                onBlur={handleBlur}
                aria-label="Width"
              />
            </InputWithLabel>
            <InputWithLabel>
              <SmallLabel>Height</SmallLabel>
              <SmallInput
                type="number"
                step="0.25"
                min="0.25"
                value={singleKey!.height}
                onChange={(e) =>
                  handlePropertyChange(
                    'height',
                    Math.max(0.25, parseFloat(e.target.value) || 1)
                  )
                }
                onBlur={handleBlur}
                aria-label="Height"
              />
            </InputWithLabel>
          </PropertyInputGroup>
        </PropertyRow>

        <PropertyRow>
          <PropertyLabel>Rotation</PropertyLabel>
          <PropertyInputGroup>
            <PropertyInput
              type="number"
              step="5"
              value={singleKey!.rotation}
              onChange={(e) =>
                handlePropertyChange(
                  'rotation',
                  parseFloat(e.target.value) || 0
                )
              }
              onBlur={handleBlur}
              aria-label="Rotation angle"
            />
            <SmallLabel style={{ alignSelf: 'center' }}>degrees</SmallLabel>
          </PropertyInputGroup>
        </PropertyRow>
      </PanelSection>

      <PanelSection>
        <SectionTitle>Key Properties</SectionTitle>
        <PropertyRow>
          <PropertyLabel>Name</PropertyLabel>
          <PropertyInput
            type="text"
            value={singleKey!.name}
            onChange={(e) => handlePropertyChange('name', e.target.value)}
            onBlur={handleBlur}
            placeholder="key_name"
            aria-label="Key name"
          />
        </PropertyRow>

        <PropertyRow>
          <PropertyLabel>Zone</PropertyLabel>
          <PropertyInput
            type="text"
            value={singleKey!.zone}
            onChange={(e) => handlePropertyChange('zone', e.target.value)}
            onBlur={handleBlur}
            placeholder="matrix"
            aria-label="Zone name"
          />
        </PropertyRow>

        <PropertyRow>
          <PropertyLabel>Column</PropertyLabel>
          <PropertyInput
            type="text"
            value={singleKey!.column}
            onChange={(e) => handlePropertyChange('column', e.target.value)}
            onBlur={handleBlur}
            placeholder="pinky"
            aria-label="Column name"
          />
        </PropertyRow>

        <PropertyRow>
          <PropertyLabel>Row</PropertyLabel>
          <PropertyInput
            type="text"
            value={singleKey!.row}
            onChange={(e) => handlePropertyChange('row', e.target.value)}
            onBlur={handleBlur}
            placeholder="home"
            aria-label="Row name"
          />
        </PropertyRow>
      </PanelSection>

      <PanelSection>
        <SectionTitle>Appearance</SectionTitle>
        <PropertyRow>
          <PropertyLabel>Color</PropertyLabel>
          <ColorInput
            type="color"
            value={singleKey!.color}
            onChange={(e) => handlePropertyChange('color', e.target.value)}
            onBlur={handleBlur}
            aria-label="Key color"
          />
          <PropertyInput
            type="text"
            value={singleKey!.color}
            onChange={(e) => handlePropertyChange('color', e.target.value)}
            onBlur={handleBlur}
            placeholder="#cccccc"
            style={{ flex: 1 }}
          />
        </PropertyRow>
      </PanelSection>

      <PanelSection>
        <SectionTitle>Actions</SectionTitle>
        <ButtonRow>
          <ActionButton
            onClick={() => {
              // TODO: Duplicate key
            }}
            aria-label="Duplicate key"
          >
            Duplicate
          </ActionButton>
          <ActionButton
            $variant="danger"
            onClick={deleteSelectedKeys}
            aria-label="Delete key"
          >
            Delete
          </ActionButton>
        </ButtonRow>
      </PanelSection>
    </PanelContainer>
  );
};
