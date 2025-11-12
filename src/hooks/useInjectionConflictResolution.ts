import { useState, useCallback, useRef } from 'react';
import {
  checkForInjectionConflict,
  mergeInjectionArraysWithResolution,
  ConflictResolution,
} from '../utils/injections';

/**
 * Callbacks for context operations that the hook needs to perform.
 */
export interface InjectionConflictResolutionCallbacks {
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
export interface UseInjectionConflictResolutionReturn {
  /** Current conflict being resolved, or null if none */
  currentConflict: { type: string; name: string } | null;
  /** Process injections with conflict resolution */
  processInjectionsWithConflictResolution: (
    newInjections: string[][],
    config: string,
    resolution?: ConflictResolution | null,
    currentInjections?: string[][]
  ) => Promise<void>;
  /** Handle conflict resolution from dialog */
  handleConflictResolution: (
    action: ConflictResolution,
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
  const [currentConflict, setCurrentConflict] = useState<{
    type: string;
    name: string;
  } | null>(null);
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
      resolution: ConflictResolution | null = null,
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

      const currentInjection = newInjections[0];
      const remainingInjections = newInjections.slice(1);

      // Validate injection format
      if (
        !Array.isArray(currentInjection) ||
        currentInjection.length !== 3 ||
        typeof currentInjection[0] !== 'string' ||
        typeof currentInjection[1] !== 'string' ||
        typeof currentInjection[2] !== 'string'
      ) {
        console.warn(
          '[useInjectionConflictResolution] Skipping invalid injection format:',
          currentInjection
        );
        // Continue with remaining injections
        if (remainingInjections.length > 0) {
          await processInjectionsWithConflictResolution(
            remainingInjections,
            config,
            resolution,
            injectionsToUse
          );
        } else {
          callbacks.setInjectionInput(injectionsToUse);
          callbacks.setConfigInput(config);
          await callbacks.generateNow(config, injectionsToUse, {
            pointsonly: false,
          });
          await callbacks.onComplete?.(config, injectionsToUse);
        }
        return;
      }

      const [type, name] = currentInjection;

      // Check for conflict using the current injections state
      const conflictCheck = checkForInjectionConflict(
        type,
        name,
        injectionsToUse
      );

      if (conflictCheck.hasConflict && !resolution) {
        // Show dialog and pause processing
        setCurrentConflict({ type, name });
        setPendingInjections(newInjections);
        setPendingConfig(config);
        setPendingInjectionsAtConflict(injectionsToUse);
        return;
      }

      // Determine resolution to use
      const resolutionToUse = resolution || 'skip';

      // Merge this injection with the current injections state
      const mergedInjections = mergeInjectionArraysWithResolution(
        [currentInjection],
        injectionsToUse,
        resolutionToUse
      );

      // Process remaining injections with the updated injections
      if (remainingInjections.length > 0) {
        await processInjectionsWithConflictResolution(
          remainingInjections,
          config,
          resolution,
          mergedInjections
        );
      } else {
        // All injections processed, update context and load the config
        callbacks.setInjectionInput(mergedInjections);
        callbacks.setConfigInput(config);
        await callbacks.generateNow(config, mergedInjections, {
          pointsonly: false,
        });
        await callbacks.onComplete?.(config, mergedInjections);
      }
    },
    [callbacks]
  );

  /**
   * Handles conflict resolution from the dialog.
   */
  const handleConflictResolution = useCallback(
    async (
      action: ConflictResolution,
      applyToAllConflicts: boolean
    ): Promise<void> => {
      if (!pendingInjections || !pendingConfig) return;

      setCurrentConflict(null);

      // Process the current injection with the chosen action
      const currentInjection = pendingInjections[0];
      const remainingInjections = pendingInjections.slice(1);

      // Merge with current injections state
      const mergedInjections = mergeInjectionArraysWithResolution(
        [currentInjection],
        pendingInjectionsAtConflict || callbacks.getCurrentInjections(),
        action
      );

      // Resume processing remaining injections with the updated injections
      if (remainingInjections.length > 0) {
        await processInjectionsWithConflictResolution(
          remainingInjections,
          pendingConfig,
          applyToAllConflicts ? action : null,
          mergedInjections
        );
      } else {
        // All injections processed, update context and load the config
        callbacks.setInjectionInput(mergedInjections);
        callbacks.setConfigInput(pendingConfig);
        await callbacks.generateNow(pendingConfig, mergedInjections, {
          pointsonly: false,
        });
        await callbacks.onComplete?.(pendingConfig, mergedInjections);

        // Clean up state only after all injections are processed
        setPendingInjections(null);
        setPendingConfig(null);
        setPendingInjectionsAtConflict(null);
      }
    },
    [
      pendingInjections,
      pendingConfig,
      pendingInjectionsAtConflict,
      callbacks,
      processInjectionsWithConflictResolution,
    ]
  );

  /**
   * Handles cancellation of conflict resolution.
   */
  const handleConflictCancel = useCallback(() => {
    setCurrentConflict(null);
    setPendingInjections(null);
    setPendingConfig(null);
    setPendingInjectionsAtConflict(null);
    callbacks.setError?.('Loading cancelled by user');
  }, [callbacks]);

  return {
    currentConflict,
    processInjectionsWithConflictResolution,
    handleConflictResolution,
    handleConflictCancel,
  };
};
