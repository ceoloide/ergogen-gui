import {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import type { Layout, LayoutKey } from '../utils/builder/pointsPreview';

/**
 * A drag handle drawn on the canvas. Positions and axes are in Ergogen
 * coordinates (millimetres, y up). While dragging, the canvas only reports
 * values; the engine lays the keys out again, so the picture always shows
 * Ergogen's real result.
 */
export type CanvasHandle = {
  id: string;
  label: string;
  glyph: string;
  x: number;
  y: number;
  step: number;
  valueText: string;
  onPreview: (value: number | [number, number]) => void;
  onCommit: (value: number | [number, number]) => void;
  onCancel: () => void;
} & (
  | { kind: 'linear'; axis: [number, number]; value: number }
  | { kind: 'angle'; pivot: [number, number]; value: number }
  | { kind: 'move'; value: [number, number] }
);

type ViewBox = { x: number; y: number; w: number; h: number };

type Props = {
  layout: Layout;
  selectedName: string | null;
  inScope: Set<string>;
  handles: CanvasHandle[];
  onSelect: (key: LayoutKey) => void;
  /** Changing this value fits the view to the layout again. */
  fitToken: string;
};

const CanvasWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  min-width: 0;
  background: ${theme.colors.builderCanvas};
  overflow: hidden;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
  user-select: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const KeyGroup = styled.g`
  cursor: pointer;
  outline: none;

  &:focus-visible rect {
    stroke: ${theme.colors.white};
    stroke-width: 0.8;
  }
`;

const HandleGroup = styled.g`
  cursor: grab;
  outline: none;

  &:focus-visible circle {
    stroke: ${theme.colors.white};
    stroke-width: 0.8;
  }
`;

const Toolbar = styled.div`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  display: flex;
  gap: 0.25rem;
`;

const ToolButton = styled.button`
  background: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.text};
  border-radius: 6px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  .material-symbols-outlined {
    font-size: ${theme.fontSizes.iconLarge};
  }

  &:hover {
    background: ${theme.colors.buttonHover};
  }
`;

const snap = (value: number, step: number) => Math.round(value / step) * step;

const roundTo = (value: number) => Math.round(value * 1000) / 1000;

const fitLayout = (layout: Layout): ViewBox => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const key of layout.keys) {
    const radius = Math.hypot(key.width, key.height) / 2;
    minX = Math.min(minX, key.x - radius);
    maxX = Math.max(maxX, key.x + radius);
    minY = Math.min(minY, -key.y - radius);
    maxY = Math.max(maxY, -key.y + radius);
  }
  if (!Number.isFinite(minX)) return { x: -50, y: -50, w: 100, h: 100 };
  const margin = 15;
  return {
    x: minX - margin,
    y: minY - margin,
    w: maxX - minX + 2 * margin,
    h: maxY - minY + 2 * margin,
  };
};

type DragState = {
  handle: CanvasHandle;
  pointerId: number;
  start: [number, number];
  last: number | [number, number];
  moved: boolean;
};

/**
 * The Build view's drawing: every key Ergogen lays out, at its real position,
 * rotation and size. Mirrored keys are dashed and select their source key;
 * skipped keys are faint outlines. The view pans by dragging the background
 * and zooms with the wheel or the buttons.
 */
const BuilderCanvas = ({
  layout,
  selectedName,
  inScope,
  handles,
  onSelect,
  fitToken,
}: Props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [view, setView] = useState<ViewBox>(() => fitLayout(layout));
  const dragRef = useRef<DragState | null>(null);
  const panRef = useRef<{ pointerId: number; x: number; y: number } | null>(
    null
  );
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const fit = useCallback(() => setView(fitLayout(layoutRef.current)), []);

  useEffect(() => {
    fit();
  }, [fitToken, fit]);

  /** Converts a pointer position to Ergogen coordinates. */
  const toEngine = useCallback(
    (clientX: number, clientY: number): [number, number] | null => {
      const svg = svgRef.current;
      const matrix = svg?.getScreenCTM?.();
      if (!svg || !matrix) return null;
      const point = svg.createSVGPoint();
      point.x = clientX;
      point.y = clientY;
      const local = point.matrixTransform(matrix.inverse());
      return [local.x, -local.y];
    },
    []
  );

  const valueFor = (drag: DragState, at: [number, number]) => {
    const { handle, start } = drag;
    const dx = at[0] - start[0];
    const dy = at[1] - start[1];
    if (handle.kind === 'linear') {
      const delta = dx * handle.axis[0] + dy * handle.axis[1];
      return roundTo(snap(handle.value + delta, handle.step));
    }
    if (handle.kind === 'angle') {
      const [px, py] = handle.pivot;
      const before = Math.atan2(start[1] - py, start[0] - px);
      const after = Math.atan2(at[1] - py, at[0] - px);
      let delta = ((after - before) * 180) / Math.PI;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      return roundTo(snap(handle.value + delta, handle.step));
    }
    return [
      roundTo(snap(handle.value[0] + dx, handle.step)),
      roundTo(snap(handle.value[1] + dy, handle.step)),
    ] as [number, number];
  };

  const sameValue = (
    a: number | [number, number],
    b: number | [number, number]
  ) => JSON.stringify(a) === JSON.stringify(b);

  const startDrag = (handle: CanvasHandle) => (event: ReactPointerEvent) => {
    event.stopPropagation();
    if (event.button !== 0) return;
    const start = toEngine(event.clientX, event.clientY);
    if (!start) return;
    (event.currentTarget as Element).setPointerCapture?.(event.pointerId);
    dragRef.current = {
      handle,
      pointerId: event.pointerId,
      start,
      last: handle.value,
      moved: false,
    };
  };

  const moveDrag = (event: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (drag && drag.pointerId === event.pointerId) {
      const at = toEngine(event.clientX, event.clientY);
      if (!at) return;
      const value = valueFor(drag, at);
      if (!sameValue(value, drag.last)) {
        drag.last = value;
        drag.moved = true;
        drag.handle.onPreview(value);
      }
      return;
    }
    const pan = panRef.current;
    if (pan && pan.pointerId === event.pointerId && svgRef.current) {
      const scale = view.w / Math.max(svgRef.current.clientWidth, 1);
      const scaleY = view.h / Math.max(svgRef.current.clientHeight, 1);
      const factor = Math.max(scale, scaleY);
      const dx = (event.clientX - pan.x) * factor;
      const dy = (event.clientY - pan.y) * factor;
      panRef.current = { ...pan, x: event.clientX, y: event.clientY };
      setView((current) => ({
        ...current,
        x: current.x - dx,
        y: current.y - dy,
      }));
    }
  };

  const endDrag = (event: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (drag && drag.pointerId === event.pointerId) {
      dragRef.current = null;
      if (drag.moved) drag.handle.onCommit(drag.last);
      else drag.handle.onCancel();
    }
    if (panRef.current?.pointerId === event.pointerId) panRef.current = null;
  };

  const cancelDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return false;
    dragRef.current = null;
    drag.handle.onCancel();
    return true;
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && cancelDrag()) event.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cancelDrag]);

  const startPan = (event: ReactPointerEvent) => {
    if (event.button !== 0 || dragRef.current) return;
    (event.currentTarget as Element).setPointerCapture?.(event.pointerId);
    panRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const zoom = useCallback((factor: number, center?: [number, number]) => {
    setView((current) => {
      const cx = center ? center[0] : current.x + current.w / 2;
      const cy = center ? center[1] : current.y + current.h / 2;
      const w = Math.min(Math.max(current.w * factor, 10), 5000);
      const h = (current.h * w) / current.w;
      return {
        x: cx - ((cx - current.x) * w) / current.w,
        y: cy - ((cy - current.y) * h) / current.h,
        w,
        h,
      };
    });
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const at = toEngine(event.clientX, event.clientY);
      zoom(Math.pow(1.0015, event.deltaY), at ? [at[0], -at[1]] : undefined);
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [toEngine, zoom]);

  const handleKeyKeyDown = (key: LayoutKey) => (event: ReactKeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(key);
    }
  };

  const handleHandleKeyDown =
    (handle: CanvasHandle) => (event: ReactKeyboardEvent) => {
      const direction: Record<string, [number, number]> = {
        ArrowUp: [0, 1],
        ArrowDown: [0, -1],
        ArrowRight: [1, 0],
        ArrowLeft: [-1, 0],
      };
      const move = direction[event.key];
      if (!move) return;
      event.preventDefault();
      if (handle.kind === 'move') {
        handle.onCommit([
          roundTo(handle.value[0] + move[0] * handle.step),
          roundTo(handle.value[1] + move[1] * handle.step),
        ]);
      } else {
        const sign = move[0] + move[1];
        handle.onCommit(roundTo(handle.value + sign * handle.step));
      }
    };

  const drawOrder = useMemo(
    () =>
      [...layout.keys].sort(
        (a, b) =>
          Number(b.skipped) - Number(a.skipped) ||
          Number(b.mirrored) - Number(a.mirrored) ||
          Number(a.name === selectedName) - Number(b.name === selectedName)
      ),
    [layout.keys, selectedName]
  );

  const strokeScale = view.w / 400;

  return (
    <CanvasWrapper>
      <Svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={startPan}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        aria-label="Keyboard layout canvas"
        data-testid="builder-canvas"
      >
        <defs>
          <pattern
            id="builder-grid"
            width={19}
            height={19}
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 19 0 L 0 0 0 19"
              fill="none"
              stroke={theme.colors.builderGridMajor}
              strokeWidth={0.3}
            />
          </pattern>
        </defs>
        <rect
          x={view.x}
          y={view.y}
          width={view.w}
          height={view.h}
          fill="url(#builder-grid)"
        />
        <line
          x1={view.x}
          x2={view.x + view.w}
          y1={0}
          y2={0}
          stroke={theme.colors.builderGrid}
          strokeWidth={0.6}
        />
        <line
          y1={view.y}
          y2={view.y + view.h}
          x1={0}
          x2={0}
          stroke={theme.colors.builderGrid}
          strokeWidth={0.6}
        />
        {drawOrder.map((key) => {
          const selected = key.name === selectedName;
          const highlighted = inScope.has(key.name);
          const label = `${key.mirrored ? `${key.name}, mirror of ${key.source}` : key.name}${
            key.skipped ? ', skipped' : ''
          }`;
          return (
            <KeyGroup
              key={key.name}
              transform={`translate(${key.x} ${-key.y}) rotate(${-key.r})`}
              role="button"
              tabIndex={key.mirrored ? -1 : 0}
              aria-label={label}
              aria-pressed={selected}
              data-key-name={key.name}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onSelect(key)}
              onKeyDown={handleKeyKeyDown(key)}
              opacity={key.skipped ? 0.55 : key.mirrored ? 0.5 : 1}
            >
              <title>{label}</title>
              <rect
                x={-key.width / 2}
                y={-key.height / 2}
                width={key.width}
                height={key.height}
                rx={1}
                fill={
                  key.skipped
                    ? 'none'
                    : highlighted
                      ? theme.colors.builderKeyInScope
                      : theme.colors.builderKey
                }
                stroke={
                  selected ? theme.colors.accent : theme.colors.builderKeyStroke
                }
                strokeWidth={selected ? 0.9 : 0.35}
                strokeDasharray={
                  key.mirrored || key.skipped ? '1.5 1' : undefined
                }
              />
            </KeyGroup>
          );
        })}
        {handles.map((handle) => (
          <HandleGroup
            key={handle.id}
            transform={`translate(${handle.x} ${-handle.y})`}
            role="slider"
            tabIndex={0}
            aria-label={handle.label}
            aria-valuetext={handle.valueText}
            aria-valuenow={
              typeof handle.value === 'number' ? handle.value : undefined
            }
            data-handle={handle.id}
            onPointerDown={startDrag(handle)}
            onKeyDown={handleHandleKeyDown(handle)}
          >
            <title>{`${handle.label}: ${handle.valueText}`}</title>
            <circle
              r={Math.max(2.6, 9 * strokeScale)}
              fill={theme.colors.builderHandle}
              stroke={theme.colors.builderHandleText}
              strokeWidth={0.3}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={Math.max(3, 10 * strokeScale)}
              fontFamily={theme.fonts.body}
              fill={theme.colors.builderHandleText}
              pointerEvents="none"
            >
              {handle.glyph}
            </text>
          </HandleGroup>
        ))}
      </Svg>
      <Toolbar>
        <ToolButton
          type="button"
          onClick={() => zoom(1 / 1.25)}
          aria-label="Zoom in"
        >
          <span className="material-symbols-outlined">add</span>
        </ToolButton>
        <ToolButton
          type="button"
          onClick={() => zoom(1.25)}
          aria-label="Zoom out"
        >
          <span className="material-symbols-outlined">remove</span>
        </ToolButton>
        <ToolButton type="button" onClick={fit} aria-label="Fit layout to view">
          <span className="material-symbols-outlined">fit_screen</span>
        </ToolButton>
      </Toolbar>
    </CanvasWrapper>
  );
};

export default BuilderCanvas;
