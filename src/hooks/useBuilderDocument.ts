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

export type BuilderDocument = {
  layout: Layout | null;
  status: BuilderStatus;
  /** The engine or YAML error of the current text, if any. */
  error: string | null;
  /** False while the current text is invalid: edits would be guesses. */
  canEdit: boolean;
  /** Applies operations and commits the result; returns a refusal reason. */
  edit: (operations: PatchOperation[], label: string) => string | null;
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

export const useBuilderDocument = (active: boolean): BuilderDocument => {
  const context = useConfigContext();
  const configInput = context?.configInput ?? '';
  const activeConfigId = context?.activeConfigId ?? null;

  const [lastGood, setLastGood] = useState<{
    text: string;
    layout: Layout;
  } | null>(null);
  const [latest, setLatest] = useState<PreviewResult | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [, setHistoryVersion] = useState(0);
  const undoStack = useRef<HistoryEntry[]>([]);
  const redoStack = useRef<HistoryEntry[]>([]);
  const lastCommitRef = useRef<string | null>(null);
  const clientRef = useRef<PointsPreviewClient | null>(null);

  useEffect(() => {
    if (!active) return;
    const client = new PointsPreviewClient(createPointsWorker, (result) => {
      setLatest(result);
      if (result.layout) {
        setLastGood({ text: result.text, layout: result.layout });
      }
    });
    clientRef.current = client;
    return () => {
      client.dispose();
      clientRef.current = null;
    };
  }, [active]);

  const shownText = draft ?? configInput;
  useEffect(() => {
    if (active && shownText) clientRef.current?.request(shownText);
  }, [active, shownText]);

  // A different configuration has its own history. Forking a shared
  // configuration on the first edit keeps the edit's history.
  useEffect(() => {
    const current = context?.getRealtimeConfigInput() ?? configInput;
    if (lastCommitRef.current !== null && lastCommitRef.current === current) {
      return;
    }
    undoStack.current = [];
    redoStack.current = [];
    lastCommitRef.current = null;
    setDraft(null);
    setHistoryVersion((version) => version + 1);
    // Only the configuration identity matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConfigId]);

  const currentText = useCallback(
    () => context?.getRealtimeConfigInput() ?? context?.configInput ?? '',
    [context]
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
      const result = applyPatch(before, operations);
      if (!result.ok) return result.reason;
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
    [commit, currentText, record]
  );

  const preview = useCallback(
    (operations: PatchOperation[]) => {
      const result = applyPatch(currentText(), operations);
      if (!result.ok) return result.reason;
      setDraft(result.text);
      return null;
    },
    [currentText]
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
  const canEdit =
    lastGood !== null && (draft !== null || !(latest?.error && isCurrent));

  return {
    layout: lastGood?.layout ?? null,
    status,
    error,
    canEdit,
    edit,
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
