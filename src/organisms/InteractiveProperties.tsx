import React from 'react';
import styled from 'styled-components';
import { useInteractiveLayoutContext } from '../context/InteractiveLayoutContext';
import { theme } from '../theme/theme';
import Title from '../atoms/Title';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import GenOption from '../atoms/GenOption';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.bodyMedium};
`;

const UnitSelect = styled.select`
  background-color: ${theme.colors.backgroundLight};
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};
  padding: 8px;
  border-radius: 4px;
  font-family: ${theme.fonts.body};
`;

// Helper to convert mm to display unit
const toDisplay = (mm: number, unit: string) => {
    if (unit === 'U') return mm / 19.05;
    if (unit === 'u') return mm / 19.00;
    return mm;
};

// Helper to convert display unit to mm
const toMM = (val: number, unit: string) => {
    if (unit === 'U') return val * 19.05;
    if (unit === 'u') return val * 19.00;
    return val;
};

const InteractiveProperties = () => {
    const { state, setGrid, resetAll } = useInteractiveLayoutContext();
    const { grid } = state;

    const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) {
            setGrid({ size: toMM(val, grid.displayUnit) });
        }
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newUnit = e.target.value as 'mm' | 'U' | 'u';
        setGrid({ displayUnit: newUnit });
    };

    // Calculate display value
    const displaySize = toDisplay(grid.size, grid.displayUnit);
    // Round to reasonable decimals for display (e.g. 4)
    const formattedSize = Math.round(displaySize * 10000) / 10000;

    return (
        <Container>
            <Section>
                <Title>GRID</Title>
                <GenOption
                    optionId="showGrid"
                    label="Show Grid"
                    setSelected={(val) => {
                      if (typeof val === 'function') {
                        setGrid({ enabled: val(grid.enabled) });
                      } else {
                        setGrid({ enabled: val });
                      }
                    }}
                    checked={grid.enabled}
                />
                 {/* Snap to Grid placeholder - visual only for now */}
                 <Row style={{ opacity: 0.5 }}>
                    <Label>Snap to Grid</Label>
                    <input type="checkbox" disabled />
                 </Row>

                <Row style={{ marginTop: '10px' }}>
                    <Label>Grid Size</Label>
                    <div style={{ display: 'flex', gap: '5px', width: '60%' }}>
                        <Input
                            type="number"
                            step="0.1"
                            value={formattedSize}
                            onChange={handleGridSizeChange}
                            aria-label="Grid Size"
                        />
                        <UnitSelect
                            value={grid.displayUnit}
                            onChange={handleUnitChange}
                            aria-label="Grid Unit"
                        >
                            <option value="mm">mm</option>
                            <option value="U">U</option>
                            <option value="u">u</option>
                        </UnitSelect>
                    </div>
                </Row>
            </Section>

             <Section>
                <Title>ACTIONS</Title>
                <Button onClick={() => {
                    if(window.confirm('Are you sure you want to start over? This will reset the view and settings.')) {
                        resetAll();
                    }
                }}>
                    Start Over
                </Button>
            </Section>
        </Container>
    );
};

export default InteractiveProperties;
