import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import yaml from 'js-yaml';
import { useConfigContext } from '../context/ConfigContext';
import { theme } from '../theme/theme';
import GenOption from '../atoms/GenOption';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
`;

const Toolbar = styled.div`
  width: 50px;
  background-color: ${theme.colors.background};
  border-right: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  gap: 10px;
  z-index: 10;
`;

const CanvasContainer = styled.div`
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  background-color: #1e1e1e;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Sidebar = styled.div`
  width: 320px;
  background-color: ${theme.colors.background};
  border-left: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 10;
`;

const SidebarHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.border};
`;

const Tab = styled.div<{ $active: boolean }>`
  flex: 1;
  padding: 12px 0;
  text-align: center;
  cursor: pointer;
  background-color: ${props => props.$active ? theme.colors.background : theme.colors.backgroundLight};
  color: ${props => props.$active ? theme.colors.accent : theme.colors.textDark};
  border-bottom: 2px solid ${props => props.$active ? theme.colors.accent : 'transparent'};
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${theme.fontWeights.semiBold};

  &:hover {
    color: ${theme.colors.text};
    background-color: ${theme.colors.background};
  }
`;

const SidebarContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h3`
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.textDark};
  text-transform: uppercase;
  margin: 0;
  margin-bottom: 5px;
  font-weight: ${theme.fontWeights.bold};
  letter-spacing: 0.05em;
`;

const ToolButton = styled.button`
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: ${theme.colors.textDark};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: ${theme.colors.text};
    background-color: ${theme.colors.buttonHover};
  }

  &.active {
    color: ${theme.colors.accent};
    background-color: ${theme.colors.buttonHover};
    border-color: ${theme.colors.border};
  }

  .material-symbols-outlined {
    font-size: 20px;
  }
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Label = styled.label`
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.text};
`;

const StyledInput = styled.input`
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  color: ${theme.colors.text};
  padding: 4px 8px;
  font-size: ${theme.fontSizes.bodySmall};
  width: 80px;
  text-align: right;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const StyledTextInput = styled(StyledInput)`
  width: 100%;
  text-align: left;
`;

const Unit = styled.span`
  margin-left: 5px;
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.bodySmall};
  width: 15px;
  display: inline-block;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

// Helper to scale generic units to pixels (19.05mm = 1u standard)
const UNIT_MM = 19.05;
const PIXELS_PER_MM = 3.5; // Roughly appropriate for screen viewing

// Render constants
const MARGIN_SIDE = 1.5;
const MARGIN_TOP = 1.5;
const MARGIN_BOTTOM = 4;
const DEFAULT_KEY_SIZE = 18;

// Helper for deep updates
const setDeep = (obj: any, path: string[], value: any): any => {
    if (path.length === 0) return value;
    const [head, ...tail] = path;
    const nextObj = obj && typeof obj === 'object' && !Array.isArray(obj) ? { ...obj } : {};

    if (tail.length === 0) {
        if (value === undefined) {
            delete nextObj[head];
        } else {
            nextObj[head] = value;
        }
    } else {
        nextObj[head] = setDeep(nextObj[head] || {}, tail, value);
    }
    return nextObj;
};

// Helper to get deep value
const getDeep = (obj: any, path: string[]): any => {
    let current = obj;
    for (const key of path) {
        if (current === undefined || current === null) return undefined;
        current = current[key];
    }
    return current;
};

const PointContainer = styled.div<{ x: number; y: number; r: number; $selected: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  transform: translate(${props => props.x}px, ${props => props.y}px) rotate(${props => props.r}deg);
  cursor: pointer;
  z-index: ${props => props.$selected ? 20 : 5};

  &:hover {
    z-index: 10;
  }
`;

const Keycap = styled.div<{ width: number; height: number; $selected: boolean }>`
  position: absolute;
  /* Center the keycap on the point (origin) */
  left: -${props => props.width / 2}px;
  top: -${props => props.height / 2}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: #d7d7d7;
  border-radius: 4px;
  box-shadow: ${props => props.$selected ? '0 0 0 2px ' + theme.colors.accent : 'none'};

  /* Inner keycap face */
  &::after {
    content: '';
    position: absolute;
    left: ${MARGIN_SIDE * PIXELS_PER_MM}px;
    right: ${MARGIN_SIDE * PIXELS_PER_MM}px;
    top: ${MARGIN_TOP * PIXELS_PER_MM}px;
    bottom: ${MARGIN_BOTTOM * PIXELS_PER_MM}px;
    background-color: #f5f5f5;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  &:hover {
    background-color: #e0e0e0;
    &::after {
      background-color: #ffffff;
    }
  }
`;

const Crosshair = styled.div<{ $selected: boolean }>`
  position: absolute;
  left: -5px;
  top: -5px;
  width: 10px;
  height: 10px;

  &::before, &::after {
    content: '';
    position: absolute;
    background-color: ${props => props.$selected ? theme.colors.accent : theme.colors.text};
  }

  /* Horizontal line */
  &::before {
    top: 4px;
    left: 0;
    width: 100%;
    height: 2px;
  }

  /* Vertical line */
  &::after {
    left: 4px;
    top: 0;
    height: 100%;
    width: 2px;
  }
`;

const LayoutEditor = () => {
  const context = useConfigContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Local config state
  const [localConfig, setLocalConfig] = useState<any>({});

  // View settings
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(1);
  const [snapToGrid, setSnapToGrid] = useState(true); // Placeholder for future feature

  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize local config from context
  useEffect(() => {
    if (context?.configInput) {
        try {
            const parsed = yaml.load(context.configInput);
            setLocalConfig(parsed || {});
        } catch (e) {
            console.error('Failed to parse config for Layout Editor', e);
        }
    }
  }, [context?.configInput]);

  // Center canvas on load
  useEffect(() => {
    if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setPan({ x: width / 2, y: height / 2 });
    }
  }, []);

  const updateConfig = (path: string[], value: any) => {
    const newConfig = setDeep(localConfig, path, value);
    setLocalConfig(newConfig);

    // Update global context (debounced by context provider)
    if (context) {
        try {
             const dump = yaml.dump(newConfig);
             context.setConfigInput(dump);
        } catch (e) {
            console.error('Failed to dump config', e);
        }
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).getAttribute('data-bg') === 'true') {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setSelectedPoint(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const scaleAmount = -e.deltaY * 0.001;
    const newZoom = Math.min(Math.max(0.1, zoom + scaleAmount), 5);
    setZoom(newZoom);
  };

  // Values for inputs
  const pointsMirror = getDeep(localConfig, ['points', 'mirror']);
  const mirrorEnabled = !!pointsMirror;
  const mirrorDistance = typeof pointsMirror === 'object' ? pointsMirror.distance : (pointsMirror === true ? 0 : 0); // default 0 if true? Ergogen default is 0?

  const globalRotation = getDeep(localConfig, ['points', 'rotate']) || 0;

  const metaName = getDeep(localConfig, ['meta', 'name']) || '';
  const metaVersion = getDeep(localConfig, ['meta', 'version']) || '';
  const metaAuthor = getDeep(localConfig, ['meta', 'author']) || '';

  // Extract points for rendering
  const points = (context?.results?.points as Record<string, any>) || {};

  return (
    <Container onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <Toolbar>
        <ToolButton onClick={() => navigate('/')} title="Back to Ergogen">
          <span className="material-symbols-outlined">arrow_back</span>
        </ToolButton>
        <div style={{ height: '20px' }} />
        <ToolButton className="active" title="Select">
          <span className="material-symbols-outlined">arrow_selector_tool</span>
        </ToolButton>
        <ToolButton title="Pan (Hold Space or Drag Background)">
           <span className="material-symbols-outlined">pan_tool</span>
        </ToolButton>
        <ToolButton title="Zoom In" onClick={() => setZoom(z => Math.min(z + 0.1, 5))}>
            <span className="material-symbols-outlined">zoom_in</span>
        </ToolButton>
        <ToolButton title="Zoom Out" onClick={() => setZoom(z => Math.max(z - 0.1, 0.1))}>
            <span className="material-symbols-outlined">zoom_out</span>
        </ToolButton>
        <ToolButton title="Reset View" onClick={() => {
             if (canvasRef.current) {
                const { width, height } = canvasRef.current.getBoundingClientRect();
                setPan({ x: width / 2, y: height / 2 });
                setZoom(1);
            }
        }}>
            <span className="material-symbols-outlined">center_focus_strong</span>
        </ToolButton>
      </Toolbar>

      <CanvasContainer
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
        data-bg="true"
      >
        <div style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none' // Let events pass to keys, but handle bg drag on container
        }}>
            {/* Grid Lines */}
            {showGrid && (
                <>
                    {/* Minor Grid (1/8th of 1U) */}
                    <div style={{
                        position: 'absolute',
                        left: -5000, top: -5000,
                        width: 10000, height: 10000,
                        backgroundImage: `
                            linear-gradient(${theme.colors.border} 1px, transparent 1px),
                            linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px)
                        `,
                        backgroundSize: `${(UNIT_MM / 8) * PIXELS_PER_MM}px ${(UNIT_MM / 8) * PIXELS_PER_MM}px`,
                        opacity: 0.1,
                        pointerEvents: 'none'
                    }} />
                    {/* Major Grid (User defined size, default 1U) */}
                    <div style={{
                        position: 'absolute',
                        left: -5000, top: -5000,
                        width: 10000, height: 10000,
                        backgroundImage: `
                            linear-gradient(${theme.colors.border} 1px, transparent 1px),
                            linear-gradient(90deg, ${theme.colors.border} 1px, transparent 1px)
                        `,
                        backgroundSize: `${UNIT_MM * gridSize * PIXELS_PER_MM}px ${UNIT_MM * gridSize * PIXELS_PER_MM}px`,
                        opacity: 0.25,
                        pointerEvents: 'none'
                    }} />
                </>
            )}

            <div style={{ pointerEvents: 'auto' }}>
                {Object.entries(points).map(([name, point]) => {
                    const meta = point.meta || {};
                    const tags = meta.tags || {};

                    // Check if it's a key
                    // Tags can be an object (keys as tags) or array? Ergogen v4 is usually object.
                    // Also check if any tag starts with "key"
                    const hasKeyTag = Object.keys(tags).some(t => t === 'key' || t.startsWith('key_'));

                    // Determine dimensions
                    // Default to 18mm if not specified
                    // If width is specified in units (< 10), convert to mm using the formula: units * 19.05 - (19.05 - 18)
                    // If width is large (> 10), assume mm
                    let w = DEFAULT_KEY_SIZE;
                    let h = DEFAULT_KEY_SIZE;

                    if (meta.width !== undefined) {
                        const val = parseFloat(meta.width);
                        if (!isNaN(val)) {
                            if (val < 10) {
                                // Assume units
                                // Formula: units * 19.05 - gap (1.05)
                                w = val * UNIT_MM - (UNIT_MM - DEFAULT_KEY_SIZE);
                            } else {
                                // Assume mm
                                w = val;
                            }
                        }
                    }

                    if (meta.height !== undefined) {
                        const val = parseFloat(meta.height);
                        if (!isNaN(val)) {
                             if (val < 10) {
                                h = val * UNIT_MM - (UNIT_MM - DEFAULT_KEY_SIZE);
                            } else {
                                h = val;
                            }
                        }
                    }

                    return (
                        <PointContainer
                            key={name}
                            x={(point.x || 0) * PIXELS_PER_MM}
                            y={-(point.y || 0) * PIXELS_PER_MM}
                            r={-(point.r || 0)}
                            $selected={selectedPoint === name}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPoint(name);
                                setActiveTab('properties');
                            }}
                            title={name}
                        >
                            {hasKeyTag ? (
                                <Keycap
                                    width={w * PIXELS_PER_MM}
                                    height={h * PIXELS_PER_MM}
                                    $selected={selectedPoint === name}
                                />
                            ) : (
                                <Crosshair $selected={selectedPoint === name} />
                            )}
                        </PointContainer>
                    );
                })}
            </div>

            {/* Origin Marker */}
            <div style={{
                position: 'absolute',
                left: -10, top: -1,
                width: 20, height: 2,
                backgroundColor: 'red',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                left: -1, top: -10,
                width: 2, height: 20,
                backgroundColor: 'green',
                pointerEvents: 'none'
            }} />
        </div>
      </CanvasContainer>

      <Sidebar>
        <SidebarHeader>
            <Tab $active={activeTab === 'properties'} onClick={() => setActiveTab('properties')}>Key Properties</Tab>
            <Tab $active={activeTab === 'zones'} onClick={() => setActiveTab('zones')}>Zones</Tab>
            <Tab $active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>Settings</Tab>
        </SidebarHeader>
        <SidebarContent>
            {activeTab === 'settings' && (
                <>
                    <Section>
                        <SectionTitle>Grid</SectionTitle>
                        <GenOption
                            optionId="show-grid"
                            label="Show Grid"
                            checked={showGrid}
                            setSelected={setShowGrid}
                        />
                        <GenOption
                            optionId="snap-grid"
                            label="Snap to Grid"
                            checked={snapToGrid}
                            setSelected={setSnapToGrid}
                        />
                         <InputRow>
                            <Label>Grid Size</Label>
                            <InputWrapper>
                                <StyledInput
                                    type="number"
                                    step="0.1"
                                    value={gridSize}
                                    onChange={(e) => setGridSize(parseFloat(e.target.value) || 1)}
                                />
                                <Unit>U</Unit>
                            </InputWrapper>
                        </InputRow>
                    </Section>

                    <Section>
                        <SectionTitle>Mirror</SectionTitle>
                        <GenOption
                            optionId="enable-mirror"
                            label="Enable Mirror"
                            checked={mirrorEnabled}
                            setSelected={(val) => {
                                if (val) {
                                    updateConfig(['points', 'mirror'], { distance: 0 });
                                } else {
                                    updateConfig(['points', 'mirror'], undefined);
                                }
                            }}
                        />
                        {mirrorEnabled && (
                            <InputRow>
                                <Label>Distance</Label>
                                <InputWrapper>
                                    <StyledInput
                                        type="number"
                                        value={mirrorDistance || 0}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value) || 0;
                                            // Ensure mirror is an object
                                            updateConfig(['points', 'mirror'], { distance: val });
                                        }}
                                    />
                                    <Unit>mm</Unit>
                                </InputWrapper>
                            </InputRow>
                        )}
                    </Section>

                    <Section>
                        <SectionTitle>Global Transform</SectionTitle>
                        <InputRow>
                            <Label>Rotation</Label>
                            <InputWrapper>
                                <StyledInput
                                    type="number"
                                    value={globalRotation}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        updateConfig(['points', 'rotate'], val);
                                    }}
                                />
                                <Unit>°</Unit>
                            </InputWrapper>
                        </InputRow>
                    </Section>

                    <Section>
                        <SectionTitle>Meta</SectionTitle>
                        <InputRow>
                            <Label>Name</Label>
                            <StyledTextInput
                                value={metaName}
                                onChange={(e) => updateConfig(['meta', 'name'], e.target.value)}
                            />
                        </InputRow>
                        <InputRow>
                            <Label>Version</Label>
                            <StyledTextInput
                                value={metaVersion}
                                onChange={(e) => updateConfig(['meta', 'version'], e.target.value)}
                            />
                        </InputRow>
                        <InputRow>
                            <Label>Author</Label>
                            <StyledTextInput
                                value={metaAuthor}
                                onChange={(e) => updateConfig(['meta', 'author'], e.target.value)}
                            />
                        </InputRow>
                    </Section>
                </>
            )}

            {activeTab === 'properties' && (
                <Section>
                    <SectionTitle>Selected Key</SectionTitle>
                    {selectedPoint ? (
                        <>
                            <InputRow>
                                <Label>Name</Label>
                                <span style={{fontSize: theme.fontSizes.bodySmall}}>{selectedPoint}</span>
                            </InputRow>
                            <InputRow>
                                <Label>X</Label>
                                <span style={{fontSize: theme.fontSizes.bodySmall}}>{points[selectedPoint]?.x?.toFixed(2)} mm</span>
                            </InputRow>
                            <InputRow>
                                <Label>Y</Label>
                                <span style={{fontSize: theme.fontSizes.bodySmall}}>{points[selectedPoint]?.y?.toFixed(2)} mm</span>
                            </InputRow>
                            <InputRow>
                                <Label>Rotation</Label>
                                <span style={{fontSize: theme.fontSizes.bodySmall}}>{points[selectedPoint]?.r?.toFixed(2)} °</span>
                            </InputRow>
                            <div style={{marginTop: '10px', fontSize: theme.fontSizes.xs, color: theme.colors.textDark}}>
                                Note: Edit key properties in the Zones tab or via source config.
                            </div>
                        </>
                    ) : (
                        <div style={{color: theme.colors.textDark, fontSize: theme.fontSizes.bodySmall, fontStyle: 'italic'}}>
                            Select a key on the grid to view its properties.
                        </div>
                    )}
                </Section>
            )}

            {activeTab === 'zones' && (
                <Section>
                    <SectionTitle>Zones</SectionTitle>
                    <div style={{color: theme.colors.textDark, fontSize: theme.fontSizes.bodySmall}}>
                        Zone editing is not yet implemented. Please use the source config.
                    </div>
                </Section>
            )}
        </SidebarContent>
      </Sidebar>
    </Container>
  );
};

export default LayoutEditor;
