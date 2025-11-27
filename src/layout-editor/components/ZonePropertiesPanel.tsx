/**
 * ZonePropertiesPanel - Panel for managing zones, columns, and rows.
 * Allows creating and editing ergogen zone structures.
 */
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useLayoutEditor } from '../LayoutEditorContext';
import { EditorColumn, DEFAULT_COLUMN, DEFAULT_ROW } from '../types';
import { theme } from '../../theme/theme';
import { UnitInput } from './UnitInput';

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
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.accent};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: ${theme.fontSizes.bodySmall};
  padding: 2px 8px;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }

  .material-symbols-outlined {
    font-size: 16px;
  }
`;

const ZoneCard = styled.div<{ $selected?: boolean }>`
  background-color: ${(p) =>
    p.$selected
      ? theme.colors.backgroundLighter
      : theme.colors.backgroundLight};
  border: 1px solid
    ${(p) => (p.$selected ? theme.colors.accent : theme.colors.border)};
  border-radius: 6px;
  overflow: hidden;
`;

const ZoneHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }
`;

const ZoneName = styled.span`
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.text};
`;

const ZoneInfo = styled.span`
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.textDarkest};
`;

const ZoneActions = styled.div`
  display: flex;
  gap: 4px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textDark};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${theme.colors.buttonHover};
    color: ${theme.colors.text};
  }

  &:hover.danger {
    background-color: ${theme.colors.errorDark};
    color: ${theme.colors.white};
  }

  .material-symbols-outlined {
    font-size: 18px;
  }
`;

const ZoneContent = styled.div`
  padding: 12px;
  border-top: 1px solid ${theme.colors.border};
`;

const PropertyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PropertyLabel = styled.label`
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.textDark};
  min-width: 60px;
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
`;

const SubsectionTitle = styled.h4`
  font-size: 11px;
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.textDarkest};
  text-transform: uppercase;
  margin: 12px 0 8px 0;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background-color: ${theme.colors.background};
  border-radius: 4px;
`;

const SmallInput = styled(PropertyInput)`
  width: 50px;
  padding: 4px 6px;
  font-size: 11px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: ${theme.colors.textDarkest};

  .material-symbols-outlined {
    font-size: 32px;
    opacity: 0.5;
    margin-bottom: 8px;
    display: block;
  }
`;

interface NewZoneDialogProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogBox = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  min-width: 300px;
`;

const DialogTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: ${theme.fontSizes.bodyLarge};
  color: ${theme.colors.text};
`;

const DialogButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const DialogButton = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: ${theme.fontSizes.bodySmall};
  cursor: pointer;
  transition: all 0.15s ease;

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
    }
  `}
`;

const NewZoneDialog: React.FC<NewZoneDialogProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <DialogOverlay onClick={onCancel}>
      <DialogBox onClick={(e) => e.stopPropagation()}>
        <DialogTitle>New Zone</DialogTitle>
        <form onSubmit={handleSubmit}>
          <PropertyRow>
            <PropertyLabel>Name</PropertyLabel>
            <PropertyInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="matrix"
            />
          </PropertyRow>
          <DialogButtons>
            <DialogButton type="button" onClick={onCancel}>
              Cancel
            </DialogButton>
            <DialogButton type="submit" $primary disabled={!name.trim()}>
              Create
            </DialogButton>
          </DialogButtons>
        </form>
      </DialogBox>
    </DialogOverlay>
  );
};

export const ZonePropertiesPanel: React.FC = () => {
  const { state, addZone, updateZone, deleteZone, saveHistory } =
    useLayoutEditor();
  const [expandedZone, setExpandedZone] = useState<string | null>(null);
  const [showNewZoneDialog, setShowNewZoneDialog] = useState(false);

  const { layout } = state;
  const zones = Array.from(layout.zones.values());

  const handleAddZone = useCallback(
    (name: string) => {
      addZone(name, {
        columns: [{ ...DEFAULT_COLUMN, name: 'col1' }],
        rows: [{ ...DEFAULT_ROW, name: 'row1' }],
      });
      setShowNewZoneDialog(false);
      setExpandedZone(name);
    },
    [addZone]
  );

  const handleDeleteZone = useCallback(
    (name: string) => {
      deleteZone(name);
      if (expandedZone === name) {
        setExpandedZone(null);
      }
    },
    [deleteZone, expandedZone]
  );

  const handleAddColumn = useCallback(
    (zoneName: string) => {
      const zone = layout.zones.get(zoneName);
      if (!zone) return;

      const newColName = `col${zone.columns.length + 1}`;
      const newColumns = [
        ...zone.columns,
        { ...DEFAULT_COLUMN, name: newColName },
      ];
      updateZone(zoneName, { columns: newColumns });
      saveHistory(`Add column to ${zoneName}`);
    },
    [layout.zones, updateZone, saveHistory]
  );

  const handleAddRow = useCallback(
    (zoneName: string) => {
      const zone = layout.zones.get(zoneName);
      if (!zone) return;

      const newRowName = `row${zone.rows.length + 1}`;
      const newRows = [...zone.rows, { ...DEFAULT_ROW, name: newRowName }];
      updateZone(zoneName, { rows: newRows });
      saveHistory(`Add row to ${zoneName}`);
    },
    [layout.zones, updateZone, saveHistory]
  );

  const handleUpdateColumn = useCallback(
    (zoneName: string, colIndex: number, changes: Partial<EditorColumn>) => {
      const zone = layout.zones.get(zoneName);
      if (!zone) return;

      const newColumns = zone.columns.map((col, i) =>
        i === colIndex ? { ...col, ...changes } : col
      );
      updateZone(zoneName, { columns: newColumns });
    },
    [layout.zones, updateZone]
  );

  const handleDeleteColumn = useCallback(
    (zoneName: string, colIndex: number) => {
      const zone = layout.zones.get(zoneName);
      if (!zone || zone.columns.length <= 1) return;

      const newColumns = zone.columns.filter((_, i) => i !== colIndex);
      updateZone(zoneName, { columns: newColumns });
      saveHistory(`Delete column from ${zoneName}`);
    },
    [layout.zones, updateZone, saveHistory]
  );

  const handleDeleteRow = useCallback(
    (zoneName: string, rowIndex: number) => {
      const zone = layout.zones.get(zoneName);
      if (!zone || zone.rows.length <= 1) return;

      const newRows = zone.rows.filter((_, i) => i !== rowIndex);
      updateZone(zoneName, { rows: newRows });
      saveHistory(`Delete row from ${zoneName}`);
    },
    [layout.zones, updateZone, saveHistory]
  );

  return (
    <PanelContainer data-testid="zone-properties-panel">
      <PanelSection>
        <SectionTitle>
          Zones
          <AddButton onClick={() => setShowNewZoneDialog(true)}>
            <span className="material-symbols-outlined">add</span>
            Add Zone
          </AddButton>
        </SectionTitle>

        {zones.length === 0 ? (
          <EmptyState>
            <span className="material-symbols-outlined">layers</span>
            <div>No zones defined</div>
            <div>Click &quot;Add Zone&quot; to create a zone</div>
          </EmptyState>
        ) : (
          zones.map((zone) => (
            <ZoneCard key={zone.name} $selected={expandedZone === zone.name}>
              <ZoneHeader
                onClick={() =>
                  setExpandedZone(expandedZone === zone.name ? null : zone.name)
                }
              >
                <div>
                  <ZoneName>{zone.name}</ZoneName>
                  <ZoneInfo>
                    {' '}
                    • {zone.columns.length} col × {zone.rows.length} row
                  </ZoneInfo>
                </div>
                <ZoneActions>
                  <IconButton
                    className="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteZone(zone.name);
                    }}
                    title="Delete zone"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </IconButton>
                </ZoneActions>
              </ZoneHeader>

              {expandedZone === zone.name && (
                <ZoneContent>
                  <PropertyRow>
                    <PropertyLabel>Rotate</PropertyLabel>
                    <UnitInput
                      type="angle"
                      value={zone.rotate}
                      onChange={(val) =>
                        updateZone(zone.name, {
                          rotate: val,
                        })
                      }
                      step={5}
                    />
                  </PropertyRow>

                  <SubsectionTitle>
                    Columns
                    <AddButton
                      style={{ float: 'right' }}
                      onClick={() => handleAddColumn(zone.name)}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </AddButton>
                  </SubsectionTitle>
                  <ItemList>
                    {zone.columns.map((col, i) => (
                      <ItemRow key={col.name}>
                        <SmallInput
                          type="text"
                          value={col.name}
                          onChange={(e) =>
                            handleUpdateColumn(zone.name, i, {
                              name: e.target.value,
                            })
                          }
                          style={{ width: '60px' }}
                        />
                        <UnitInput
                          value={col.stagger}
                          onChange={(val) =>
                            handleUpdateColumn(zone.name, i, {
                              stagger: val,
                            })
                          }
                          step={0.25}
                          style={{ width: '90px' }}
                        />
                        <UnitInput
                          type="angle"
                          value={col.splay}
                          onChange={(val) =>
                            handleUpdateColumn(zone.name, i, {
                              splay: val,
                            })
                          }
                          step={5}
                          style={{ width: '90px' }}
                        />
                        <IconButton
                          className="danger"
                          onClick={() => handleDeleteColumn(zone.name, i)}
                          title="Delete column"
                          style={{
                            visibility:
                              zone.columns.length > 1 ? 'visible' : 'hidden',
                          }}
                        >
                          <span className="material-symbols-outlined">
                            close
                          </span>
                        </IconButton>
                      </ItemRow>
                    ))}
                  </ItemList>

                  <SubsectionTitle>
                    Rows
                    <AddButton
                      style={{ float: 'right' }}
                      onClick={() => handleAddRow(zone.name)}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </AddButton>
                  </SubsectionTitle>
                  <ItemList>
                    {zone.rows.map((row, i) => (
                      <ItemRow key={row.name}>
                        <SmallInput
                          type="text"
                          value={row.name}
                          style={{ flex: 1 }}
                        />
                        <IconButton
                          className="danger"
                          onClick={() => handleDeleteRow(zone.name, i)}
                          title="Delete row"
                          style={{
                            visibility:
                              zone.rows.length > 1 ? 'visible' : 'hidden',
                          }}
                        >
                          <span className="material-symbols-outlined">
                            close
                          </span>
                        </IconButton>
                      </ItemRow>
                    ))}
                  </ItemList>
                </ZoneContent>
              )}
            </ZoneCard>
          ))
        )}
      </PanelSection>

      {showNewZoneDialog && (
        <NewZoneDialog
          onSubmit={handleAddZone}
          onCancel={() => setShowNewZoneDialog(false)}
        />
      )}
    </PanelContainer>
  );
};
