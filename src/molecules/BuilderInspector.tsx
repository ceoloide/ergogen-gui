import { useEffect, useId, useRef, useState, ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import type { Layout, LayoutKey } from '../utils/builder/pointsPreview';
import type { PatchOperation } from '../utils/builder/yamlPatch';
import {
  anchorShift,
  COLUMN_PROPERTIES,
  columnKeys,
  formatNumber,
  inheritedValue,
  isOverridden,
  KEY_PROPERTIES,
  NumericProperty,
  parseFieldValue,
  PROPERTY_LABELS,
  PROPERTY_UNITS,
  provenance,
  Scope,
  scopeAvailability,
  scopePath,
  SCOPES,
  valueAtScope,
  zoneAnchor,
} from '../utils/builder/layoutModel';
import {
  addColumn,
  addRow,
  addThumbCluster,
  addZone,
  deleteColumn,
  deleteRow,
  deleteZone,
  disableMirror,
  enableMirror,
  mirrorState,
  StructureEdit,
} from '../utils/builder/structureOps';
import type { BuilderDocument } from '../hooks/useBuilderDocument';

type Props = {
  document: BuilderDocument;
  layout: Layout;
  selected: LayoutKey | null;
  scope: Scope;
  setScope: (scope: Scope) => void;
  onSelectName: (name: string) => void;
  message: string | null;
  setMessage: (message: string | null) => void;
};

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.bodySmall};
`;

const Section = styled.section`
  background: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.textDarker};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const KeyTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.base};
  font-family: ${theme.fonts.code};
  word-break: break-all;
`;

const Muted = styled.p`
  margin: 0;
  color: ${theme.colors.textDarker};
`;

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const SmallButton = styled.button`
  background: transparent;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.bodySmall};
  padding: 0.35rem 0.6rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  .material-symbols-outlined {
    font-size: ${theme.fontSizes.iconMedium};
  }

  &:hover:not(:disabled) {
    background: ${theme.colors.buttonHover};
  }

  &:disabled {
    color: ${theme.colors.textDarkest};
    cursor: not-allowed;
  }
`;

const ScopeGroup = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;

  legend {
    padding: 0;
    margin-bottom: 0.35rem;
    color: ${theme.colors.textDarker};
  }
`;

const ScopeOption = styled.label<{ $checked: boolean }>`
  border: 1px solid
    ${(props) => (props.$checked ? theme.colors.accent : theme.colors.border)};
  background: ${(props) =>
    props.$checked ? theme.colors.accentDarker : 'transparent'};
  border-radius: 6px;
  padding: 0.3rem 0.55rem;
  cursor: pointer;
  position: relative;

  /* The native radio covers its label invisibly, so it gets every click. */
  input {
    position: absolute;
    inset: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  &:focus-within {
    outline: 2px solid ${theme.colors.white};
  }
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.6rem;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  label {
    font-weight: ${theme.fontWeights.semiBold};
  }
`;

const FieldLine = styled.div`
  display: flex;
  gap: 0.35rem;
`;

const TextInput = styled.input`
  flex: 1;
  min-width: 0;
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  color: ${theme.colors.text};
  padding: 0.35rem 0.5rem;
  font-family: ${theme.fonts.code};
  font-size: ${theme.fontSizes.bodySmall};

  &:disabled {
    color: ${theme.colors.textDarkest};
  }

  &:focus {
    outline: 1px solid ${theme.colors.accent};
  }
`;

const Hint = styled.span<{ $warning?: boolean }>`
  color: ${(props) =>
    props.$warning ? theme.colors.builderHandle : theme.colors.textDarker};
  font-size: ${theme.fontSizes.bodySmall};
`;

const Message = styled.div<{ $tone: 'error' | 'info' }>`
  border-radius: 6px;
  padding: 0.5rem 0.6rem;
  background: ${(props) =>
    props.$tone === 'error' ? theme.colors.errorDark : theme.colors.infoDark};
  color: ${theme.colors.white};
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  justify-content: space-between;
  word-break: break-word;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
`;

const describeScope = (scope: Scope | 'default') =>
  scope === 'default'
    ? 'Ergogen default'
    : (
        SCOPES.find((option) => option.id === scope)?.label ?? scope
      ).toLowerCase();

const rawText = (value: unknown) =>
  value === undefined || value === null
    ? ''
    : typeof value === 'number'
      ? formatNumber(value, 4)
      : String(value);

type FieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  hint?: ReactNode;
  /** Resolves to true when the YAML changed. */
  onApply: (input: string) => Promise<boolean> | boolean;
  onReset?: () => void;
  resetLabel?: string;
};

/**
 * A text field that takes a number or an Ergogen math expression and applies
 * it on Enter or when it loses focus. Escape restores the written value, and
 * so does an input that was refused or changed nothing, so the field always
 * ends up showing what the YAML says.
 */
const ValueField = ({
  id,
  label,
  value,
  placeholder,
  disabled,
  hint,
  onApply,
  onReset,
  resetLabel,
}: FieldProps) => {
  const [text, setText] = useState(value);
  // Bumped after each apply, so the field shows the written value again even
  // when it reads the same as before (`6.0` written as `6`).
  const [applied, setApplied] = useState(0);
  // The input being applied, so that Enter followed by blur applies it once.
  const applying = useRef<string | null>(null);
  useEffect(() => setText(value), [value, applied]);
  const hintId = `${id}-hint`;
  const apply = async () => {
    if (text.trim() === value.trim() || applying.current === text) return;
    applying.current = text;
    try {
      await onApply(text);
    } finally {
      applying.current = null;
      setApplied((count) => count + 1);
    }
  };
  return (
    <FieldWrapper>
      <label htmlFor={id}>{label}</label>
      <FieldLine>
        <TextInput
          id={id}
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          aria-describedby={hint ? hintId : undefined}
          onChange={(event) => setText(event.target.value)}
          onBlur={() => void apply()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void apply();
            } else if (event.key === 'Escape') {
              setText(value);
            }
          }}
          spellCheck={false}
          autoComplete="off"
        />
        {onReset && (
          <SmallButton
            type="button"
            onClick={onReset}
            disabled={disabled}
            aria-label={resetLabel}
            title={resetLabel}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              backspace
            </span>
          </SmallButton>
        )}
      </FieldLine>
      {hint && <Hint id={hintId}>{hint}</Hint>}
    </FieldWrapper>
  );
};

/**
 * The Build view's side panel: the selected key, the scope of edits, its
 * parameters, zone and board controls, structure edits and undo.
 */
const BuilderInspector = ({
  document,
  layout,
  selected,
  scope,
  setScope,
  onSelectName,
  message,
  setMessage,
}: Props) => {
  const baseId = useId();
  const disabled = !document.canEdit;

  /**
   * Writes an edit once the engine has laid out the result, so a mistyped
   * expression or a broken structure is explained instead of written.
   * Resolves to true when the YAML changed.
   */
  const run = async (operations: PatchOperation[], label: string) => {
    const { reason, changed } = await document.editChecked(operations, label);
    setMessage(reason);
    return changed;
  };

  const runStructure = async (edit: StructureEdit, label: string) => {
    if (!edit.ok) {
      setMessage(edit.reason);
      return;
    }
    if ((await run(edit.operations, label)) && edit.select) {
      onSelectName(edit.select);
    }
  };

  /**
   * The scope a field writes: the chosen one, or the nearest one where the
   * property means something (the column for column values, this key for
   * per-key values in a row that is not zone-wide).
   */
  const writableScope = (
    property: NumericProperty | 'skip',
    key: LayoutKey
  ): { scope: Scope; reason: string | null } => {
    const reason = scopeAvailability(layout, key, property)[scope];
    if (!reason) return { scope, reason: null };
    return {
      scope: (COLUMN_PROPERTIES as string[]).includes(property)
        ? 'column'
        : 'key',
      reason,
    };
  };

  const propertyField = (property: NumericProperty) => {
    if (!selected) return null;
    // The engine reads column values from the column's first key.
    const subject = (COLUMN_PROPERTIES as string[]).includes(property)
      ? (columnKeys(layout, selected.zone, selected.column)[0] ?? selected)
      : selected;
    const { scope: fieldScope, reason: availability } = writableScope(
      property,
      subject
    );
    const written = valueAtScope(layout, subject, property, fieldScope);
    const origin = provenance(layout, subject, property);
    const effective = subject.params[property];
    const unit = PROPERTY_UNITS[property];
    const path = scopePath(fieldScope, subject, property);
    const scopeName = describeScope(fieldScope);
    const isFirstColumn =
      layout.zones.find((zone) => zone.name === selected.zone)?.columns[0] ===
      selected.column;
    const notes: string[] = [
      `Effective ${formatNumber(effective)} ${unit}, from ${describeScope(origin.scope)}${
        origin.raw !== undefined ? ` (${rawText(origin.raw)})` : ''
      }.`,
    ];
    if (availability) {
      notes.push(
        `Edits ${fieldScope === 'column' ? 'the column' : 'this key'}: ${availability}`
      );
    }
    if (isOverridden(layout, subject, property, fieldScope)) {
      notes.push(
        `A ${describeScope(origin.scope)} value overrides this ${scopeName} value.`
      );
    }
    if (property === 'spread' && isFirstColumn) {
      notes.push('Ergogen ignores spread for the first column of a zone.');
    }
    return (
      <ValueField
        key={`${property}-${fieldScope}-${selected.name}`}
        id={`${baseId}-${property}`}
        label={`${PROPERTY_LABELS[property]} (${unit}, ${scopeName})`}
        value={rawText(written)}
        placeholder={formatNumber(effective)}
        disabled={disabled}
        hint={notes.join(' ')}
        onApply={(input) => {
          const value = parseFieldValue(input);
          return run(
            value === null
              ? [{ type: 'delete', path }]
              : [{ type: 'set', path, value }],
            `${PROPERTY_LABELS[property].toLowerCase()} (${scopeName})`
          );
        }}
        onReset={
          written !== undefined
            ? () =>
                void run(
                  [{ type: 'delete', path }],
                  `reset ${PROPERTY_LABELS[property].toLowerCase()}`
                )
            : undefined
        }
        resetLabel={`Remove the ${scopeName} ${PROPERTY_LABELS[property].toLowerCase()}`}
      />
    );
  };

  const skipControl = () => {
    if (!selected) return null;
    const { scope: skipScope } = writableScope('skip', selected);
    const skipPath = scopePath(skipScope, selected, 'skip');
    const written = valueAtScope(layout, selected, 'skip', skipScope);
    // What this scope says: its own value, or else what broader scopes give
    // it. Narrower values (a row or this key) override it and are kept.
    const inherited = inheritedValue(layout, selected, 'skip', skipScope);
    const checked =
      written !== undefined ? written === true : inherited === true;
    const origin = provenance(layout, selected, 'skip');
    // Only a narrower value can make this key differ from what the box says.
    const overridden = checked !== selected.skipped;
    const overrideId = `${baseId}-skip-override`;
    return (
      <>
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            aria-describedby={overridden ? overrideId : undefined}
            onChange={(event) => {
              const operations: PatchOperation[] = event.target.checked
                ? [{ type: 'set', path: skipPath, value: true }]
                : inherited === true
                  ? [{ type: 'set', path: skipPath, value: false }]
                  : [{ type: 'delete', path: skipPath }];
              void run(
                operations,
                event.target.checked ? 'skip keys' : 'restore keys'
              );
            }}
          />
          {skipScope === 'key'
            ? 'Skip this key'
            : skipScope === 'all'
              ? 'Skip all keys'
              : `Skip keys in this ${skipScope}`}
          {selected.skipped ? ' (this key is skipped)' : ''}
        </CheckboxLabel>
        {overridden && (
          <Hint id={overrideId}>
            {`A narrower ${origin.scope === 'key' ? 'key' : origin.scope} value ${
              selected.skipped ? 'skips' : 'keeps'
            } the selected key anyway.`}
          </Hint>
        )}
      </>
    );
  };

  const zoneControls = () => {
    if (!selected) return null;
    const zone = selected.zone;
    const zonePath = ['points', 'zones', zone];
    const { anchor, reason } = zoneAnchor(layout, zone);
    const [shiftX, shiftY] = anchorShift(anchor);
    const zoneConfig = (
      layout.canonicalPoints.zones as Record<string, unknown>
    )?.[zone] as Record<string, unknown> | null;
    const setShift = (index: 0 | 1) => (input: string) => {
      const value = parseFieldValue(input) ?? 0;
      const next = [shiftX, shiftY] as Array<unknown>;
      next[index] = value;
      return run(
        [
          {
            type: 'set',
            path: [...zonePath, 'anchor', 'shift'],
            value: next as Array<string | number>,
          },
        ],
        'zone shift'
      );
    };
    return (
      <Section aria-labelledby={`${baseId}-zone`}>
        <SectionTitle id={`${baseId}-zone`}>Zone {zone}</SectionTitle>
        {reason ? (
          <Muted>{reason}</Muted>
        ) : (
          <FieldGrid>
            <ValueField
              id={`${baseId}-shift-x`}
              label="Anchor shift X (mm)"
              value={rawText(shiftX)}
              disabled={disabled}
              onApply={setShift(0)}
            />
            <ValueField
              id={`${baseId}-shift-y`}
              label="Anchor shift Y (mm)"
              value={rawText(shiftY)}
              disabled={disabled}
              onApply={setShift(1)}
            />
            <ValueField
              id={`${baseId}-anchor-rotate`}
              label="Anchor rotate (°)"
              value={rawText(anchor?.rotate)}
              placeholder="0"
              disabled={disabled}
              hint={
                anchor?.ref ? `Relative to ${rawText(anchor.ref)}.` : undefined
              }
              onApply={(input) => {
                const value = parseFieldValue(input);
                const path = [...zonePath, 'anchor', 'rotate'];
                return run(
                  value === null
                    ? [{ type: 'delete', path }]
                    : [{ type: 'set', path, value }],
                  'anchor rotation'
                );
              }}
            />
          </FieldGrid>
        )}
        <ValueField
          id={`${baseId}-zone-rotate`}
          label="Zone rotate around the origin (°)"
          value={rawText(zoneConfig?.rotate)}
          placeholder="0"
          disabled={disabled}
          onApply={(input) => {
            const value = parseFieldValue(input);
            const path = [...zonePath, 'rotate'];
            return run(
              value === null
                ? [{ type: 'delete', path }]
                : [{ type: 'set', path, value }],
              'zone rotation'
            );
          }}
        />
      </Section>
    );
  };

  const mirror = mirrorState(layout);

  return (
    <Panel>
      <Row>
        <SmallButton
          type="button"
          onClick={document.undo}
          disabled={!document.undoLabel}
          aria-label={
            document.undoLabel ? `Undo ${document.undoLabel}` : 'Undo'
          }
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            undo
          </span>
          Undo
        </SmallButton>
        <SmallButton
          type="button"
          onClick={document.redo}
          disabled={!document.redoLabel}
          aria-label={
            document.redoLabel ? `Redo ${document.redoLabel}` : 'Redo'
          }
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            redo
          </span>
          Redo
        </SmallButton>
      </Row>
      {(message || document.notice) && (
        <Message $tone="info" role="alert">
          <span>{message ?? document.notice}</span>
          <SmallButton
            type="button"
            aria-label="Dismiss message"
            onClick={() => {
              setMessage(null);
              document.clearNotice();
            }}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </SmallButton>
        </Message>
      )}

      {selected ? (
        <Section aria-labelledby={`${baseId}-key`}>
          <KeyTitle id={`${baseId}-key`}>{selected.name}</KeyTitle>
          <Muted>
            Zone {selected.zone} · column {selected.column} · row {selected.row}
          </Muted>
          <Muted>
            x {formatNumber(selected.x)} · y {formatNumber(selected.y)} · r{' '}
            {formatNumber(selected.r)}° · {formatNumber(selected.width)} ×{' '}
            {formatNumber(selected.height)} mm
          </Muted>
          <ScopeGroup>
            <legend>Apply edits to</legend>
            {SCOPES.map((option) => (
              <ScopeOption key={option.id} $checked={scope === option.id}>
                <input
                  type="radio"
                  name={`${baseId}-scope`}
                  value={option.id}
                  checked={scope === option.id}
                  onChange={() => setScope(option.id)}
                />
                {option.label}
              </ScopeOption>
            ))}
          </ScopeGroup>
          <FieldGrid>
            {COLUMN_PROPERTIES.map(propertyField)}
            {KEY_PROPERTIES.map(propertyField)}
          </FieldGrid>
          {skipControl()}
        </Section>
      ) : (
        <Section>
          <Muted>Select a key in the canvas to edit it.</Muted>
        </Section>
      )}

      {selected && zoneControls()}

      <Section aria-labelledby={`${baseId}-structure`}>
        <SectionTitle id={`${baseId}-structure`}>Structure</SectionTitle>
        <Row>
          <SmallButton
            type="button"
            disabled={disabled || !selected}
            onClick={() =>
              selected &&
              void runStructure(
                addColumn(layout, selected.zone, selected.column),
                'add column'
              )
            }
          >
            Add column
          </SmallButton>
          <SmallButton
            type="button"
            disabled={disabled || !selected}
            onClick={() =>
              selected &&
              void runStructure(
                deleteColumn(layout, selected.zone, selected.column),
                `delete column ${selected.column}`
              )
            }
          >
            Delete column
          </SmallButton>
          <SmallButton
            type="button"
            disabled={disabled || !selected}
            onClick={() =>
              selected &&
              void runStructure(addRow(layout, selected.zone), 'add row')
            }
          >
            Add row
          </SmallButton>
          <SmallButton
            type="button"
            disabled={disabled || !selected}
            onClick={() =>
              selected &&
              void runStructure(
                deleteRow(layout, selected.zone, selected.row),
                `delete row ${selected.row}`
              )
            }
          >
            Delete row
          </SmallButton>
        </Row>
        <Row>
          <SmallButton
            type="button"
            disabled={disabled || !selected}
            onClick={() =>
              selected &&
              void runStructure(
                addThumbCluster(layout, selected.zone),
                'add thumb cluster'
              )
            }
          >
            Add thumb cluster
          </SmallButton>
          <SmallButton
            type="button"
            disabled={disabled}
            onClick={() => void runStructure(addZone(layout), 'add zone')}
          >
            Add zone
          </SmallButton>
          <SmallButton
            type="button"
            disabled={disabled || !selected}
            onClick={() =>
              selected &&
              void runStructure(
                deleteZone(layout, selected.zone),
                `delete zone ${selected.zone}`
              )
            }
          >
            Delete zone
          </SmallButton>
        </Row>
        <Muted>
          New columns go after the selected one; new rows go on top. Other keys
          keep their names.
        </Muted>
      </Section>

      <Section aria-labelledby={`${baseId}-board`}>
        <SectionTitle id={`${baseId}-board`}>Board</SectionTitle>
        <ValueField
          id={`${baseId}-board-rotate`}
          label="Rotate all keys (°)"
          value={rawText(layout.canonicalPoints.rotate)}
          placeholder="0"
          disabled={disabled}
          onApply={(input) => {
            const value = parseFieldValue(input);
            const path = ['points', 'rotate'];
            return run(
              value === null
                ? [{ type: 'delete', path }]
                : [{ type: 'set', path, value }],
              'board rotation'
            );
          }}
        />
        {mirror.kind === 'custom' ? (
          <Muted>
            This board mirrors with a custom axis or per zone; edit mirroring in
            YAML.
          </Muted>
        ) : (
          <>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={mirror.kind === 'reference'}
                disabled={disabled}
                onChange={(event) =>
                  void runStructure(
                    event.target.checked
                      ? enableMirror(layout)
                      : disableMirror(layout),
                    event.target.checked ? 'mirror board' : 'remove mirror'
                  )
                }
              />
              Mirror the board (split keyboard)
            </CheckboxLabel>
            {mirror.kind === 'reference' && (
              <ValueField
                id={`${baseId}-mirror-distance`}
                label="Mirror distance (mm)"
                value={rawText(mirror.distance)}
                disabled={disabled}
                hint={
                  mirror.ref
                    ? `Distance between ${rawText(mirror.ref)} and its mirror copy.`
                    : undefined
                }
                onApply={(input) => {
                  const value = parseFieldValue(input) ?? 0;
                  return run(
                    [
                      {
                        type: 'set',
                        path: ['points', 'mirror', 'distance'],
                        value,
                      },
                    ],
                    'mirror distance'
                  );
                }}
              />
            )}
          </>
        )}
      </Section>
    </Panel>
  );
};

export default BuilderInspector;
