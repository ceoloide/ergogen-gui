/**
 * The Build view's model. The YAML in ConfigContext stays the only source of
 * truth: the layout is read from it with the engine's points stage, and every
 * edit is a text-preserving patch of it, committed the same way as typing in
 * the editor (so shared configurations fork and saving works as usual).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useConfigContext } from '../context/ConfigContext';
import { createPointsWorker } from '../workers/workerFactory';
import {
  PointsPreviewClient,
  PreviewResult,
} from '../utils/builder/previewClient';
import type { Layout } from '../utils/builder/pointsPreview';
import { applyPatch, PatchOperation } from '../utils/builder/yamlPatch';

export type BuilderStatus = 'loading' | 'updating' | 'ready' | 'error';

type HistoryEntry = { before: string; after: string; label: string };

type LaidOut = { text: string; layout: Layout };

export type CheckedEditResult = {
  /** Why nothing was written, or null. */
  reason: string | null;
  /** True when the YAML changed. */
  changed: boolean;
};

/** Returned when the layout does not show the current YAML yet. */
const STALE_LAYOUT_REASON =
  'The layout is catching up with the YAML; try again in a moment.';

export type BuilderDocument = {
  layout: Layout | null;
  status: BuilderStatus;
  /** The engine or YAML error of the current text, if any. */
  error: string | null;
  /** False while the layout is missing or the current text is invalid. */
  canEdit: boolean;
  /** Changes whenever the builder starts over on another configuration. */
  generation: number;
  /** Applies operations and commits the result; returns a refusal reason. */
  edit: (operations: PatchOperation[], label: string) => string | null;
  /**
   * Like `edit`, but lays the result out with the engine first and only
   * commits it when the engine accepts it (for expressions and structure).
   */
  editChecked: (
    operations: PatchOperation[],
    label: string
  ) => Promise<CheckedEditResult>;
  /** Shows operations in the canvas without committing them. */
  preview: (operations: PatchOperation[]) => string | null;
  /** Discards a preview and shows the committed text again. */
  cancelPreview: () => void;
  undo: () => void;
  redo: () => void;
  undoLabel: string | null;
  redoLabel: string | null;
  notice: string | null;
  clearNotice: () => void;
};

/**
 * @param active - False while the Build view is hidden: no layouts are
 *   requested, but history and the last layout are kept.
 */
export const useBuilderDocument = (active: boolean): BuilderDocument => {
  const context = useConfigContext();
  const configInput = context?.configInput ?? '';
  const isPreview = context?.isPreview ?? false;
  const identity = `${context?.activeConfigId ?? ''}:${isPreview}`;

  const [lastGood, setLastGood] = useState<LaidOut | null>(null);
  const [latest, setLatest] = useState<PreviewResult | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);
  const [, setHistoryVersion] = useState(0);
  const undoStack = useRef<HistoryEntry[]>([]);
  const redoStack = useRef<HistoryEntry[]>([]);
  /** The last text this builder committed. */
  const lastCommitRef = useRef<string | null>(null);
  /** The last committed (not dragged) text the engine laid out. */
  const committedRef = useRef<LaidOut | null>(null);
  const clientRef = useRef<PointsPreviewClient | null>(null);

  const shownText = draft ?? configInput;
  const shownTextRef = useRef(shownText);
  shownTextRef.current = shownText;
  const draftRef = useRef(draft);
  draftRef.current = draft;

  const accept = useCallback((result: PreviewResult) => {
    setLatest(result);
    if (result.layout) {
      const laidOut = { text: result.text, layout: result.layout };
      setLastGood(laidOut);
      if (result.text !== draftRef.current) committedRef.current = laidOut;
    }
  }, []);

  useEffect(() => {
    const client = new PointsPreviewClient(createPointsWorker, (result) => {
      // An answer for a text no longer shown (another configuration, or a
      // drag that has ended) must not replace the current layout.
      if (result.text === shownTextRef.current) accept(result);
    });
    clientRef.current = client;
    return () => {
      client.dispose();
      clientRef.current = null;
    };
  }, [accept]);

  useEffect(() => {
    if (active) clientRef.current?.request(shownText);
  }, [active, shownText, generation]);

  // Another configuration starts over: its own layout, history and messages.
  // Forking a shared configuration on the first edit keeps all of them.
  const identityRef = useRef(identity);
  useEffect(() => {
    const previous = identityRef.current;
    identityRef.current = identity;
    if (previous === identity) return;
    const forked =
      previous.endsWith(':true') &&
      lastCommitRef.current !== null &&
      lastCommitRef.current === configInput;
    if (forked) return;
    undoStack.current = [];
    redoStack.current = [];
    lastCommitRef.current = null;
    committedRef.current = null;
    setDraft(null);
    setLatest(null);
    setLastGood(null);
    setNotice(null);
    setGeneration((value) => value + 1);
    // Only the configuration identity matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);

  const currentText = useCallback(
    () => context?.getRealtimeConfigInput() ?? context?.configInput ?? '',
    [context]
  );

  /**
   * Edits are only made on the text the layout shows (or on this builder's
   * own last commit, which the engine is laying out), never on text typed
   * since or on another configuration.
   */
  const isBaseline = useCallback(
    (text: string) =>
      committedRef.current?.text === text || lastCommitRef.current === text,
    []
  );

  const commit = useCallback(
    (text: string) => {
      if (!context) return;
      lastCommitRef.current = text;
      context.updateRealtimeConfigInput(text);
      context.setConfigInput(text);
    },
    [context]
  );

  const record = useCallback((entry: HistoryEntry) => {
    undoStack.current.push(entry);
    redoStack.current = [];
    setHistoryVersion((version) => version + 1);
  }, []);

  const edit = useCallback(
    (operations: PatchOperation[], label: string) => {
      const before = currentText();
      // A refused edit also ends any drag preview it would have committed.
      if (!isBaseline(before)) {
        setDraft(null);
        return STALE_LAYOUT_REASON;
      }
      const result = applyPatch(before, operations);
      if (!result.ok) {
        setDraft(null);
        return result.reason;
      }
      if (result.text === before) {
        setDraft(null);
        return null;
      }
      record({ before, after: result.text, label });
      setNotice(null);
      setDraft(null);
      commit(result.text);
      return null;
    },
    [commit, currentText, isBaseline, record]
  );

  const editChecked = useCallback(
    async (
      operations: PatchOperation[],
      label: string
    ): Promise<CheckedEditResult> => {
      const before = currentText();
      if (!isBaseline(before)) {
        return { reason: STALE_LAYOUT_REASON, changed: false };
      }
      const result = applyPatch(before, operations);
      if (!result.ok) return { reason: result.reason, changed: false };
      if (result.text === before) return { reason: null, changed: false };
      const client = clientRef.current;
      if (!client) {
        return {
          reason: 'Layout preview is not available here.',
          changed: false,
        };
      }
      const checked = await client.check(result.text);
      if (checked.error !== undefined) {
        return {
          reason: `The ${label} was not applied, because Ergogen could not lay out the result: ${checked.error}`,
          changed: false,
        };
      }
      if (currentText() !== before) {
        return {
          reason:
            'The YAML changed while the edit was being checked, so it was not applied; try again.',
          changed: false,
        };
      }
      record({ before, after: result.text, label });
      setNotice(null);
      setDraft(null);
      commit(result.text);
      // The check already laid the new text out.
      shownTextRef.current = result.text;
      accept(checked);
      return { reason: null, changed: true };
    },
    [accept, commit, currentText, isBaseline, record]
  );

  const preview = useCallback(
    (operations: PatchOperation[]) => {
      const before = currentText();
      if (!isBaseline(before)) return STALE_LAYOUT_REASON;
      const result = applyPatch(before, operations);
      if (!result.ok) return result.reason;
      setDraft(result.text);
      return null;
    },
    [currentText, isBaseline]
  );

  const cancelPreview = useCallback(() => setDraft(null), []);

  const travel = useCallback(
    (
      from: typeof undoStack,
      to: typeof undoStack,
      direction: 'undo' | 'redo'
    ) => {
      const entry = from.current[from.current.length - 1];
      if (!entry) return;
      const expected = direction === 'undo' ? entry.after : entry.before;
      if (currentText() !== expected) {
        undoStack.current = [];
        redoStack.current = [];
        setHistoryVersion((version) => version + 1);
        setNotice(
          'The YAML was changed outside the builder, so the builder history was cleared.'
        );
        return;
      }
      from.current.pop();
      to.current.push(entry);
      setHistoryVersion((version) => version + 1);
      setNotice(null);
      commit(direction === 'undo' ? entry.before : entry.after);
    },
    [commit, currentText]
  );

  const undo = useCallback(
    () => travel(undoStack, redoStack, 'undo'),
    [travel]
  );
  const redo = useCallback(
    () => travel(redoStack, undoStack, 'redo'),
    [travel]
  );

  const isCurrent = latest !== null && latest.text === shownText;
  const error = isCurrent && latest?.error ? latest.error : null;
  let status: BuilderStatus;
  if (!lastGood && !error) status = 'loading';
  else if (error) status = 'error';
  else if (!isCurrent) status = 'updating';
  else status = 'ready';
  // While dragging, an invalid draft must not block finishing the drag.
  // Otherwise the layout must show the current YAML (or the builder's own
  // commit that the engine is laying out), not text typed since.
  const canEdit =
    lastGood !== null &&
    (draft !== null ||
      (!(latest?.error && isCurrent) && isBaseline(currentText())));

  return {
    layout: lastGood?.layout ?? null,
    status,
    error,
    canEdit,
    generation,
    edit,
    editChecked,
    preview,
    cancelPreview,
    undo,
    redo,
    undoLabel: undoStack.current[undoStack.current.length - 1]?.label ?? null,
    redoLabel: redoStack.current[redoStack.current.length - 1]?.label ?? null,
    notice,
    clearNotice: () => setNotice(null),
  };
};
