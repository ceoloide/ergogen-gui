import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useBuilderDocument } from '../hooks/useBuilderDocument';
import BuilderCanvas, { CanvasHandle } from '../molecules/BuilderCanvas';
import BuilderInspector from '../molecules/BuilderInspector';
import type { Layout, LayoutKey } from '../utils/builder/pointsPreview';
import {
  anchorShift,
  columnFrame,
  formatNumber,
  keysInScope,
  provenance,
  rotateVector,
  Scope,
  scopePath,
  sourceKey,
  valueAtScope,
  zoneAnchor,
} from '../utils/builder/layoutModel';

const BuilderLayout = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  min-height: 0;

  @media (max-width: 639px) {
    flex-direction: column;
  }
`;

const CanvasColumn = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 639px) {
    flex: 0 0 55%;
  }
`;

const InspectorColumn = styled.aside`
  width: 340px;
  flex-shrink: 0;
  overflow-y: auto;
  border-left: 1px solid ${theme.colors.border};
  background: ${theme.colors.background};

  @media (max-width: 639px) {
    width: 100%;
    flex: 1;
    border-left: none;
    border-top: 1px solid ${theme.colors.border};
  }
`;

const StatusBar = styled.div<{ $tone: 'normal' | 'error' }>`
  padding: 0.4rem 0.75rem;
  font-size: ${theme.fontSizes.bodySmall};
  border-bottom: 1px solid ${theme.colors.border};
  color: ${(props) =>
    props.$tone === 'error' ? theme.colors.white : theme.colors.textDarker};
  background: ${(props) =>
    props.$tone === 'error' ? theme.colors.errorDark : theme.colors.background};
  word-break: break-word;
`;

const Empty = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  color: ${theme.colors.textDarker};
`;

const HANDLE_GAP = 6;

const offset = (key: LayoutKey, local: [number, number]) => {
  const [dx, dy] = rotateVector(key.r, local);
  return [key.x + dx, key.y + dy] as [number, number];
};

const isNumber = (value: unknown) => typeof value === 'number';

type BuilderProps = {
  /** False while the view is hidden: layouts are not requested. */
  active?: boolean;
};

/**
 * The Build view: the engine's key layout on a canvas next to an inspector.
 * All edits patch the YAML in place.
 */
const Builder = ({ active = true }: BuilderProps) => {
  const document = useBuilderDocument(active);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [scope, setScope] = useState<Scope>('column');
  const [message, setMessage] = useState<string | null>(null);
  const layout = document.layout;

  // Another configuration starts with a fresh selection and no message.
  useEffect(() => {
    setSelectedName(null);
    setMessage(null);
  }, [document.generation]);

  const selected = useMemo(
    () =>
      layout?.keys.find((key) => !key.mirrored && key.name === selectedName) ??
      null,
    [layout, selectedName]
  );

  // Keep a selection: the first key at first or after its key is deleted.
  // Wait for an up-to-date layout, so a key that an edit just added and
  // selected is not replaced before it appears.
  const layoutIsCurrent = document.status === 'ready';
  // When every key is skipped, a skipped key is selected, so that skipping
  // can be turned off again.
  useEffect(() => {
    if (!layout || selected || (selectedName && !layoutIsCurrent)) return;
    const fallback =
      layout.keys.find((key) => !key.mirrored && !key.skipped) ??
      layout.keys.find((key) => !key.mirrored);
    if (fallback) setSelectedName(fallback.name);
  }, [layout, selected, selectedName, layoutIsCurrent]);

  const inScope = useMemo(
    () =>
      layout && selected
        ? keysInScope(layout, selected, scope)
        : new Set<string>(),
    [layout, selected, scope]
  );

  const handles = useMemo(
    () =>
      layout && selected && document.canEdit
        ? buildHandles(layout, selected, document, setMessage)
        : [],
    [layout, selected, document]
  );

  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'z') {
      return;
    }
    event.preventDefault();
    if (event.shiftKey) document.redo();
    else document.undo();
  };

  let statusText: string;
  switch (document.status) {
    case 'loading':
      statusText = 'Laying out keys…';
      break;
    case 'updating':
      statusText = 'Updating layout…';
      break;
    case 'error':
      statusText = layout
        ? `The configuration has an error, so the last valid layout is shown and editing is paused: ${document.error}`
        : `The configuration has an error: ${document.error}`;
      break;
    default:
      statusText = layout
        ? `${layout.keys.filter((key) => !key.mirrored && !key.skipped).length} keys${
            layout.keys.some((key) => key.mirrored) ? ' per side, mirrored' : ''
          }. Drag the yellow handles or use the fields to edit.`
        : '';
  }

  return (
    <BuilderLayout onKeyDown={onKeyDown} data-testid="builder">
      <CanvasColumn>
        <StatusBar
          role="status"
          aria-live="polite"
          $tone={document.status === 'error' ? 'error' : 'normal'}
          data-testid="builder-status"
        >
          {statusText}
        </StatusBar>
        {layout ? (
          <BuilderCanvas
            layout={layout}
            selectedName={selected?.name ?? null}
            inScope={inScope}
            handles={handles}
            onSelect={(key) => setSelectedName(sourceKey(layout, key).name)}
            onRefuse={setMessage}
            // Refit when the builder starts over on another configuration
            // (but not when a shared one is forked) and after structure
            // edits, which can add keys outside the current view.
            fitToken={`${document.generation}:${layout.keys.length}`}
          />
        ) : (
          <Empty>
            {document.status === 'error'
              ? 'Fix the configuration to see its keys.'
              : 'Laying out keys…'}
          </Empty>
        )}
      </CanvasColumn>
      {layout && (
        <InspectorColumn aria-label="Build inspector">
          <BuilderInspector
            document={document}
            layout={layout}
            selected={selected}
            scope={scope}
            setScope={setScope}
            onSelectName={setSelectedName}
            message={message}
            setMessage={setMessage}
          />
        </InspectorColumn>
      )}
    </BuilderLayout>
  );
};

const HANDLE_RANGE: Record<'stagger' | 'spread' | 'splay', [number, number]> = {
  stagger: [-200, 200],
  spread: [-200, 200],
  splay: [-180, 180],
};

/**
 * Drag handles for the selected key's column and zone. Each one maps the
 * pointer to a single configuration value; the engine then lays the keys out
 * again, so what the canvas shows is always Ergogen's own result. Column
 * handles always write the column's own value, which the engine reads from
 * the column's first key.
 */
const buildHandles = (
  layout: Layout,
  selected: LayoutKey,
  document: ReturnType<typeof useBuilderDocument>,
  setMessage: (message: string | null) => void
): CanvasHandle[] => [
  ...columnHandles(layout, selected, document, setMessage),
  ...zoneHandles(layout, selected, document, setMessage),
];

/** Stagger, spread and splay handles of the selected key's column. */
const columnHandles = (
  layout: Layout,
  selected: LayoutKey,
  document: ReturnType<typeof useBuilderDocument>,
  setMessage: (message: string | null) => void
): CanvasHandle[] => {
  const frame = columnFrame(layout, selected.zone, selected.column);
  if (!frame.ok) return [];
  const { first, axisAngle, pivot } = frame;
  const keys = layout.keys.filter(
    (key) =>
      !key.mirrored &&
      key.zone === selected.zone &&
      key.column === selected.column
  );
  const top = keys[keys.length - 1];
  const handles: CanvasHandle[] = [];

  /** Why dragging would not change `property` as shown, if it would not. */
  const refusal = (property: 'stagger' | 'spread' | 'splay') => {
    const origin = provenance(layout, first, property);
    if (origin.scope === 'row' || origin.scope === 'key') {
      return `The ${first.row} row sets the ${property} of column ${selected.column}, so a column value would have no effect; change it in YAML.`;
    }
    const written = valueAtScope(layout, first, property, 'column');
    if (written !== undefined && typeof written !== 'number') {
      return `The ${property} of column ${selected.column} is the expression "${String(written)}"; edit it in the field so it is not replaced by a number.`;
    }
    return undefined;
  };

  const valueHandle = (
    property: 'stagger' | 'spread' | 'splay',
    base: Omit<
      CanvasHandle,
      | 'onPreview'
      | 'onCommit'
      | 'onCancel'
      | 'valueText'
      | 'step'
      | 'value'
      | 'min'
      | 'max'
    >
  ): CanvasHandle => {
    const path = scopePath('column', first, property);
    const unit = property === 'splay' ? '°' : ' mm';
    const value = first.params[property];
    // A value written beyond the usual range widens it, so the slider keeps
    // it and arrow keys step from it instead of jumping to the bound.
    const [min, max] = HANDLE_RANGE[property];
    return {
      ...base,
      value,
      min: Math.min(min, value),
      max: Math.max(max, value),
      step: property === 'splay' ? 1 : 0.5,
      valueText: `${formatNumber(first.params[property])}${unit}`,
      disabledReason: refusal(property),
      onPreview: (value) => {
        const reason = document.preview([{ type: 'set', path, value }]);
        if (reason) setMessage(reason);
      },
      onCommit: (value) => {
        setMessage(
          document.edit([{ type: 'set', path, value }], `${property} drag`)
        );
      },
      onCancel: document.cancelPreview,
    } as CanvasHandle;
  };

  const [staggerX, staggerY] = offset(top, [0, top.height / 2 + HANDLE_GAP]);
  handles.push(
    valueHandle('stagger', {
      id: 'stagger',
      kind: 'linear',
      label: `Column ${selected.column} stagger`,
      glyph: '↕',
      x: staggerX,
      y: staggerY,
      axis: rotateVector(axisAngle, [0, 1]),
    } as CanvasHandle)
  );

  const zone = layout.zones.find(
    (candidate) => candidate.name === selected.zone
  );
  if (zone && zone.columns[0] !== selected.column) {
    const [spreadX, spreadY] = offset(first, [
      -(first.width / 2 + HANDLE_GAP),
      0,
    ]);
    handles.push(
      valueHandle('spread', {
        id: 'spread',
        kind: 'linear',
        label: `Column ${selected.column} spread`,
        glyph: '↔',
        x: spreadX,
        y: spreadY,
        axis: rotateVector(axisAngle, [1, 0]),
      } as CanvasHandle)
    );
  }

  const [splayX, splayY] = offset(top, [
    top.width / 2 + HANDLE_GAP,
    top.height / 2 + HANDLE_GAP,
  ]);
  handles.push(
    valueHandle('splay', {
      id: 'splay',
      kind: 'angle',
      label: `Column ${selected.column} splay`,
      glyph: '↻',
      x: splayX,
      y: splayY,
      pivot,
    } as CanvasHandle)
  );
  return handles;
};

/** The handle that moves the selected key's zone. */
const zoneHandles = (
  layout: Layout,
  selected: LayoutKey,
  document: ReturnType<typeof useBuilderDocument>,
  setMessage: (message: string | null) => void
): CanvasHandle[] => {
  const zone = layout.zones.find(
    (candidate) => candidate.name === selected.zone
  );
  // Moving a zone by its anchor shift is only offered where the shift is in
  // board coordinates: a plain, numeric shift with no reference, rotation or
  // zone or board rotation that would turn it.
  const { anchor, reason } = zoneAnchor(layout, selected.zone);
  const zoneConfig = (layout.canonicalPoints.zones as Record<string, unknown>)[
    selected.zone
  ] as Record<string, unknown> | null;
  const [shiftX, shiftY] = anchorShift(anchor);
  const plainAnchor =
    !reason &&
    Object.keys(anchor ?? {}).every((key) => key === 'shift') &&
    isNumber(shiftX) &&
    isNumber(shiftY) &&
    !zoneConfig?.rotate &&
    !layout.canonicalPoints.rotate;
  const zoneFirst = layout.keys.find(
    (key) =>
      !key.mirrored &&
      key.zone === selected.zone &&
      key.column === zone?.columns[0] &&
      key.row === zone?.rows[0]
  );
  if (!plainAnchor || !zoneFirst) return [];
  const [moveX, moveY] = offset(zoneFirst, [
    -(zoneFirst.width / 2 + HANDLE_GAP),
    -(zoneFirst.height / 2 + HANDLE_GAP),
  ]);
  const path = ['points', 'zones', selected.zone, 'anchor', 'shift'];
  const value: [number, number] = [shiftX as number, shiftY as number];
  return [
    {
      id: 'zone-move',
      kind: 'move',
      label: `Move zone ${selected.zone}`,
      glyph: '✥',
      x: moveX,
      y: moveY,
      value,
      step: 0.5,
      valueText: `shift ${formatNumber(value[0])}, ${formatNumber(value[1])} mm`,
      onPreview: (next) => {
        const refusal = document.preview([
          { type: 'set', path, value: next as [number, number] },
        ]);
        if (refusal) setMessage(refusal);
      },
      onCommit: (next) =>
        setMessage(
          document.edit(
            [{ type: 'set', path, value: next as [number, number] }],
            'zone move'
          )
        ),
      onCancel: document.cancelPreview,
    },
  ];
};

export default Builder;
