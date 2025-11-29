import React from 'react';
import styled from 'styled-components';
import { useInteractiveLayoutContext } from '../context/InteractiveLayoutContext';
import { theme } from '../theme/theme';
import Title from '../atoms/Title';
import Button from '../atoms/Button';
import GenOption from '../atoms/GenOption';
import UnitInput from '../atoms/UnitInput';
import { toDisplay, toMM } from '../utils/units';

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

const StyledSelect = styled.select`
  background-color: ${theme.colors.backgroundLight};
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};
  padding: 8px;
  border-radius: 4px;
  font-family: ${theme.fonts.body};
  width: 100%;
`;

const InteractiveProperties = () => {
    const { state, setGrid, setVisualizationMode, resetAll } = useInteractiveLayoutContext();
    const { grid } = state;

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

                <GenOption
                    optionId="snapToGrid"
                    label="Snap to Grid"
                    setSelected={(val) => {
                      if (typeof val === 'function') {
                        setGrid({ snapEnabled: val(grid.snapEnabled) });
                      } else {
                        setGrid({ snapEnabled: val });
                      }
                    }}
                    checked={grid.snapEnabled || false}
                />

                <Row style={{ marginTop: '10px' }}>
                    <Label>Visualization</Label>
                    <div style={{ width: '60%' }}>
                        <StyledSelect
                            value={state.visualizationMode}
                            onChange={(e) => setVisualizationMode(e.target.value as any)}
                            aria-label="Visualization Mode"
                        >
                            <option value="debug">Debug</option>
                            <option value="wireframe">Wireframe</option>
                            <option value="visual">Visual</option>
                        </StyledSelect>
                    </div>
                </Row>

                <Row style={{ marginTop: '10px' }}>
                    <Label>Grid Size</Label>
                    <div style={{ width: '60%' }}>
                        <UnitInput
                            value={formattedSize}
                            unit={grid.displayUnit}
                            step={toDisplay(grid.size / Math.max(1, grid.subdivisions), grid.displayUnit)}
                            onChange={(val) => setGrid({ size: toMM(val, grid.displayUnit) })}
                            onUnitChange={(unit) => setGrid({ displayUnit: unit as any })}
                            aria-label="Grid Size"
                        />
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
