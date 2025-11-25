import { useState, useCallback } from 'react';
import {
  getInjectionConflicts,
  mergeInjectionArraysWithResolution,
  ConflictResolutionStrategy,
  isValidInjection,
  generateUniqueInjectionName,
} from '../utils/injections';

/**
 * Callbacks for context operations that the hook needs to perform.
 */
interface InjectionConflictResolutionCallbacks {
  /** Set the injection input */
  setInjectionInput: (injections: string[][]) => void;
  /** Set the config input */
  setConfigInput: (config: string) => void;
  /** Generate the configuration with the given config and injections */
  generateNow: (
    config: string,
    injections: string[][],
    options?: { pointsonly: boolean }
  ) => Promise<void>;
  /** Get the current injection input */
  getCurrentInjections: () => string[][];
  /** Optional callback when all injections are processed */
  onComplete?: (config: string, injections: string[][]) => void | Promise<void>;
  /** Optional callback to set an error message */
  setError?: (error: string) => void;
}

/**
 * Return type for the useInjectionConflictResolution hook.
 */
interface UseInjectionConflictResolutionReturn {
  /** Current conflict being resolved, or null if none */
  currentConflict: { name: string; type: string } | null;
  /** Process injections with conflict resolution */
  processInjectionsWithConflictResolution: (
    newInjections: string[][],
    config: string,
    resolution?: ConflictResolutionStrategy | null,
    currentInjections?: string[][]
  ) => Promise<void>;
  /** Handle conflict resolution from dialog */
  handleConflictResolution: (
    action: ConflictResolutionStrategy,
    applyToAllConflicts: boolean
  ) => Promise<void>;
  /** Handle cancellation of conflict resolution */
  handleConflictCancel: () => void;
}

/**
 * Custom hook for managing injection conflict resolution.
 *
 * This hook provides a reusable way to process injections with conflict resolution
 * dialogs, managing all the state and logic needed for the conflict resolution flow.
 *
 * @param callbacks - Callbacks for context operations
 * @returns Conflict resolution state and handlers
 */
export const useInjectionConflictResolution = (
  callbacks: InjectionConflictResolutionCallbacks
): UseInjectionConflictResolutionReturn => {
  // Queue of conflicts to be resolved
  const [conflictQueue, setConflictQueue] = useState<
    {
      injection: string[];
      conflict: { conflictingName: string };
    }[]
  >([]);

  // State for the current conflict being resolved (derived from queue)
  const currentConflict = conflictQueue.length > 0 ? conflictQueue[0] : null;

  const [pendingInjections, setPendingInjections] = useState<string[][] | null>(
    null
  );
  const [pendingConfig, setPendingConfig] = useState<string | null>(null);
  const [pendingInjectionsAtConflict, setPendingInjectionsAtConflict] =
    useState<string[][] | null>(null);

  /**
   * Processes injections with conflict resolution, showing dialog when conflicts are found.
   */
  const processInjectionsWithConflictResolution = useCallback(
    async (
      newInjections: string[][],
      config: string,
      resolution: ConflictResolutionStrategy | null = null,
      currentInjections?: string[][]
    ): Promise<void> => {
      const injectionsToUse =
        currentInjections || callbacks.getCurrentInjections();

      if (newInjections.length === 0) {
        // No injections to process, just load the config
        callbacks.setInjectionInput(injectionsToUse);
        callbacks.setConfigInput(config);
        await callbacks.generateNow(config, injectionsToUse, {
          pointsonly: false,
        });
        await callbacks.onComplete?.(config, injectionsToUse);
        return;
      }

      // Filter out invalid injections
      const validInjections = newInjections.filter((inj) => {
        if (!isValidInjection(inj)) {
          console.warn(
            '[useInjectionConflictResolution] Skipping invalid injection format:',
            inj
          );
          return false;
        }
        return true;
      });

      if (validInjections.length === 0) {
        // All were invalid, proceed with what we have
        callbacks.setInjectionInput(injectionsToUse);
        callbacks.setConfigInput(config);
        await callbacks.generateNow(config, injectionsToUse, {
          pointsonly: false,
        });
        await callbacks.onComplete?.(config, injectionsToUse);
        return;
      }

      // Check for conflicts
      const conflicts = getInjectionConflicts(validInjections, injectionsToUse);

      if (conflicts.length > 0 && !resolution) {
        // Show dialog for the first conflict and queue the rest
        const formattedConflicts = conflicts.map((c) => ({
          injection: c.injection,
          conflict: c.conflict as { conflictingName: string },
        }));

        setConflictQueue(formattedConflicts);
        setPendingInjections(validInjections);
        setPendingConfig(config);
        setPendingInjectionsAtConflict(injectionsToUse);
        return;
      }

      // Determine resolution to use
      const resolutionToUse = resolution || 'skip';

      // Merge all injections with the resolution strategy
      const mergedInjections = mergeInjectionArraysWithResolution(
        validInjections,
        injectionsToUse,
        resolutionToUse
      );

      // All injections processed, update context and load the config
      callbacks.setInjectionInput(mergedInjections);
      callbacks.setConfigInput(config);
      await callbacks.generateNow(config, mergedInjections, {
        pointsonly: false,
      });
      await callbacks.onComplete?.(config, mergedInjections);
    },
    [callbacks]
  );

  /**
   * Handles conflict resolution from the dialog.
   */
  const handleConflictResolution = useCallback(
    async (
      action: ConflictResolutionStrategy,
      applyToAllConflicts: boolean
    ): Promise<void> => {
      if (!pendingInjections || !pendingConfig || conflictQueue.length === 0)
        return;

      if (applyToAllConflicts) {
        // Apply action to ALL remaining conflicts
        // We can do this by calling processInjectionsWithConflictResolution with the chosen strategy
        // But we need to be careful: we want to apply this strategy to the *remaining* conflicts
        // which are in pendingInjections.

        // Actually, mergeInjectionArraysWithResolution applies the strategy to ALL conflicts it finds.
        // So if we just call it with the strategy, it will handle all of them.

        const mergedInjections = mergeInjectionArraysWithResolution(
          pendingInjections,
          pendingInjectionsAtConflict || callbacks.getCurrentInjections(),
          action
        );

        // Update context and load the config
        callbacks.setInjectionInput(mergedInjections);
        callbacks.setConfigInput(pendingConfig);
        await callbacks.generateNow(pendingConfig, mergedInjections, {
          pointsonly: false,
        });
        await callbacks.onComplete?.(pendingConfig, mergedInjections);

        // Clean up state
        setConflictQueue([]);
        setPendingInjections(null);
        setPendingConfig(null);
        setPendingInjectionsAtConflict(null);
      } else {
        // Apply action to ONLY the current conflict
        const currentConflictItem = conflictQueue[0];
        const [type, name] = currentConflictItem.injection;
        const currentNewInjection = currentConflictItem.injection;

        // Remove the current conflict from queue
        const nextQueue = conflictQueue.slice(1);
        setConflictQueue(nextQueue);

        // Calculate updated state locally
        let updatedBase = [
          ...(pendingInjectionsAtConflict || callbacks.getCurrentInjections()),
        ];
        let updatedNew = [...(pendingInjections || [])];

        if (action === 'overwrite') {
          // Remove the conflicting item from the base (existing injections)
          updatedBase = updatedBase.filter(
            (inj) => !(inj[0] === type && inj[1] === name)
          );
          // The new one remains in updatedNew and will be added during merge
        } else if (action === 'skip') {
          // Remove the new injection from updatedNew
          updatedNew = updatedNew.filter(
            (inj) =>
              !(
                inj[0] === type &&
                inj[1] === name &&
                inj[2] === currentNewInjection[2]
              )
          );
        } else if (action === 'keep-both') {
          // Generate a unique name for the new injection to avoid conflict
          const uniqueName = generateUniqueInjectionName(
            type,
            name,
            updatedBase
          );

          // Create a new injection with the unique name
          const renamedInjection = [type, uniqueName, currentNewInjection[2]];

          // Add the renamed injection to the base (effectively accepting it)
          updatedBase = [...updatedBase, renamedInjection];

          // Remove the original injection from updatedNew so it's not processed again
          updatedNew = updatedNew.filter(
            (inj) =>
              !(
                inj[0] === type &&
                inj[1] === name &&
                inj[2] === currentNewInjection[2]
              )
          );
        }

        // Update state
        setPendingInjectionsAtConflict(updatedBase);
        setPendingInjections(updatedNew);

        // If queue is empty after this, we are done!
        if (nextQueue.length === 0) {
          // Final merge of whatever is left
          const mergedInjections = mergeInjectionArraysWithResolution(
            updatedNew,
            updatedBase,
            'skip' // Should be safe as conflicts are resolved
          );

          callbacks.setInjectionInput(mergedInjections);
          callbacks.setConfigInput(pendingConfig);
          await callbacks.generateNow(pendingConfig, mergedInjections, {
            pointsonly: false,
          });
          await callbacks.onComplete?.(pendingConfig, mergedInjections);

          setPendingInjections(null);
          setPendingConfig(null);
          setPendingInjectionsAtConflict(null);
        }
      }
    },
    [
      pendingInjections,
      pendingConfig,
      pendingInjectionsAtConflict,
      conflictQueue,
      callbacks,
    ]
  );

  /**
   * Handles cancellation of conflict resolution.
   */
  const handleConflictCancel = useCallback(() => {
    setConflictQueue([]);
    setPendingInjections(null);
    setPendingConfig(null);
    setPendingInjectionsAtConflict(null);
    callbacks.setError?.('Loading cancelled by user');
  }, [callbacks]);

  return {
    currentConflict: currentConflict
      ? {
          name: currentConflict.injection[1],
          type: currentConflict.injection[0],
        }
      : null,
    processInjectionsWithConflictResolution,
    handleConflictResolution,
    handleConflictCancel,
  };
};
