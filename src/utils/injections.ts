/**
 * Utility functions for managing injections (footprints, templates, etc.).
 *
 * This module provides generic functions that work with any injection type.
 * Injections are represented as arrays of three strings: [type, name, content]
 * where:
 * - type: The injection type (e.g., 'footprint', 'template')
 * - name: The unique name of the injection
 * - content: The code/content of the injection
 *
 * The module includes both generic functions (recommended) and deprecated
 * footprint-specific wrappers for backward compatibility.
 */

/**
 * Represents a conflict resolution strategy for handling injection conflicts.
 * Used when merging injections of any type (footprints, templates, etc.).
 * - 'skip': Skip the conflicting injection, keep the existing one
 * - 'overwrite': Replace the existing injection with the new one
 * - 'keep-both': Keep both injections by renaming the new one with a unique suffix
 */
export type ConflictResolutionStrategy = 'skip' | 'overwrite' | 'keep-both';

/**
 * Result of checking for a conflict.
 */
type ConflictCheckResult =
  | { hasConflict: false }
  | { hasConflict: true; conflictingName: string };

/**
 * Validates that an injection has the correct format: [type, name, content]
 * All elements must be strings.
 * @param inj - The injection to validate
 * @returns True if the injection is valid (array of 3 strings), false otherwise
 */
export const isValidInjection = (inj: unknown): inj is string[] => {
  return (
    Array.isArray(inj) &&
    inj.length === 3 &&
    typeof inj[0] === 'string' &&
    typeof inj[1] === 'string' &&
    typeof inj[2] === 'string'
  );
};

/**
 * Checks if an injection name conflicts with existing injections of the same type.
 * @param type - The type of injection to check (e.g., 'footprint', 'template').
 * @param name - The name of the injection to check.
 * @param existingInjections - The array of existing injections.
 * @param existingNamesSet - Optional pre-calculated Set of names for the given type.
 * @returns A conflict check result indicating if there's a conflict and the name.
 */
const checkForInjectionConflict = (
  type: string,
  name: string,
  existingInjections: string[][] | undefined,
  existingNamesSet?: Set<string>
): ConflictCheckResult => {
  if (existingNamesSet) {
    return existingNamesSet.has(name)
      ? { hasConflict: true, conflictingName: name }
      : { hasConflict: false };
  }

  if (!existingInjections || existingInjections.length === 0) {
    return { hasConflict: false };
  }

  const hasConflict = existingInjections.some(
    (inj) => isValidInjection(inj) && inj[0] === type && inj[1] === name
  );

  if (hasConflict) {
    return { hasConflict: true, conflictingName: name };
  }

  return { hasConflict: false };
};

/**
 * Checks for conflicts for multiple injections at once.
 * @param newInjections - Array of new injections to check.
 * @param existingInjections - The array of existing injections.
 * @returns An array of conflict results for injections that have conflicts.
 */
export const getInjectionConflicts = (
  newInjections: string[][],
  existingInjections: string[][] | undefined
): { injection: string[]; conflict: ConflictCheckResult }[] => {
  if (!existingInjections || existingInjections.length === 0) {
    return [];
  }

  // Pre-calculate name sets grouped by type for O(1) lookups
  const nameSetsByType: Record<string, Set<string>> = {};
  for (const inj of existingInjections) {
    if (isValidInjection(inj)) {
      const [type, name] = inj;
      if (!nameSetsByType[type]) {
        nameSetsByType[type] = new Set();
      }
      nameSetsByType[type].add(name);
    }
  }

  const conflicts: { injection: string[]; conflict: ConflictCheckResult }[] =
    [];

  for (const inj of newInjections) {
    if (!isValidInjection(inj)) continue;

    const [type, name] = inj;
    const typeSet = nameSetsByType[type];
    const conflict = checkForInjectionConflict(type, name, undefined, typeSet);

    if (conflict.hasConflict) {
      conflicts.push({ injection: inj, conflict });
    }
  }

  return conflicts;
};

/**
 * Checks if a footprint name conflicts with existing injections.
 * This is a footprint-specific wrapper around checkForInjectionConflict.
 * @param name - The name of the footprint to check.
 * @param existingInjections - The array of existing injections.
 * @param existingNamesSet - Optional pre-calculated Set of names for the 'footprint' type.
 * @returns A conflict check result indicating if there's a conflict and the name.
 * @deprecated Use checkForInjectionConflict instead for generic injection type support.
 */
export const checkForConflict = (
  name: string,
  existingInjections: string[][] | undefined,
  existingNamesSet?: Set<string>
): ConflictCheckResult => {
  return checkForInjectionConflict(
    'footprint',
    name,
    existingNamesSet ? undefined : existingInjections,
    existingNamesSet
  );
};

/**
 * Generates a unique name by appending an incremental number.
 * @param type - The type of injection (e.g., 'footprint', 'template').
 * @param baseName - The base name to make unique.
 * @param existingInjections - The array of existing injections.
 * @param existingNamesSet - Optional pre-calculated Set of names for the given type.
 * @returns A unique name.
 */
export const generateUniqueInjectionName = (
  type: string,
  baseName: string,
  existingInjections: string[][] | undefined,
  existingNamesSet?: Set<string>
): string => {
  const existingNames =
    existingNamesSet ||
    (existingInjections && existingInjections.length > 0
      ? new Set(
          existingInjections
            .filter((inj) => isValidInjection(inj) && inj[0] === type)
            .map((inj) => inj[1])
        )
      : new Set<string>());

  if (existingNames.size === 0) {
    return baseName;
  }

  let counter = 1;
  let newName = `${baseName}_${counter}`;

  while (existingNames.has(newName)) {
    counter++;
    newName = `${baseName}_${counter}`;
  }

  return newName;
};

/**
 * Generates a unique footprint name by appending an incremental number.
 * This is a footprint-specific wrapper around generateUniqueInjectionName.
 * @param baseName - The base name to make unique.
 * @param existingInjections - The array of existing injections.
 * @returns A unique name.
 * @deprecated Use generateUniqueInjectionName instead for generic injection type support.
 */
export const generateUniqueName = (
  baseName: string,
  existingInjections: string[][] | undefined
): string => {
  return generateUniqueInjectionName('footprint', baseName, existingInjections);
};

/**
 * Merges new footprints into existing injections based on the resolution strategy.
 * This is a footprint-specific wrapper that converts footprint objects to the generic
 * injection format and uses mergeInjectionArraysWithResolution internally.
 * @param newFootprints - Array of new footprints to merge.
 * @param existingInjections - The current array of injections.
 * @param resolution - The conflict resolution strategy.
 * @returns The merged array of injections.
 * @deprecated For new code, use mergeInjectionArraysWithResolution directly with
 *   injections in the format [type, name, content] for generic injection type support.
 */
export const mergeInjections = (
  newFootprints: Array<{ name: string; content: string }>,
  existingInjections: string[][] | undefined,
  resolution: ConflictResolutionStrategy
): string[][] => {
  const result = existingInjections ? [...existingInjections] : [];

  // Pre-calculate footprint name set for O(1) lookups
  const footprintNames = new Set<string>();
  for (const inj of result) {
    if (isValidInjection(inj) && inj[0] === 'footprint') {
      footprintNames.add(inj[1]);
    }
  }

  for (const footprint of newFootprints) {
    const conflictCheck = checkForConflict(
      footprint.name,
      undefined,
      footprintNames
    );

    if (!conflictCheck.hasConflict) {
      // No conflict, add directly
      result.push(['footprint', footprint.name, footprint.content]);
      footprintNames.add(footprint.name);
    } else {
      // Handle conflict based on resolution strategy
      if (resolution === 'skip') {
        // Do nothing
        continue;
      } else if (resolution === 'overwrite') {
        // Find and replace the existing injection
        const index = result.findIndex(
          (inj) =>
            isValidInjection(inj) &&
            inj[0] === 'footprint' &&
            inj[1] === footprint.name
        );
        if (index !== -1) {
          result[index] = ['footprint', footprint.name, footprint.content];
          // Set already contains the name
        }
      } else if (resolution === 'keep-both') {
        // Generate a unique name and add
        const uniqueName = generateUniqueInjectionName(
          'footprint',
          footprint.name,
          undefined,
          footprintNames
        );
        result.push(['footprint', uniqueName, footprint.content]);
        footprintNames.add(uniqueName);
      }
    }
  }

  return result;
};

/**
 * Merges new injection arrays into existing injections with conflict resolution.
 * This function is generic and works with any injection type (footprints, templates, etc.).
 * For each injection in the new array:
 * - If an injection with the same type and name exists, applies the resolution strategy
 * - If no injection with the same type and name exists, it adds it
 * - Existing injections not present in the new array are kept intact
 * @param newInjections - Array of new injections to merge (format: [type, name, content][])
 *   where type can be 'footprint', 'template', or any future injection type
 * @param existingInjections - The current array of injections
 * @param resolution - The conflict resolution strategy
 * @returns The merged array of injections
 */
export const mergeInjectionArraysWithResolution = (
  newInjections: string[][],
  existingInjections: string[][] | undefined,
  resolution: ConflictResolutionStrategy
): string[][] => {
  const result = existingInjections ? [...existingInjections] : [];

  // Pre-calculate name sets grouped by type for O(1) lookups
  const nameSetsByType: Record<string, Set<string>> = {};
  for (const inj of result) {
    if (isValidInjection(inj)) {
      const [type, name] = inj;
      if (!nameSetsByType[type]) {
        nameSetsByType[type] = new Set();
      }
      nameSetsByType[type].add(name);
    }
  }

  // Process each new injection
  for (const newInj of newInjections) {
    // Validate injection format
    if (!isValidInjection(newInj)) {
      console.warn(
        '[mergeInjectionArraysWithResolution] Skipping invalid injection format:',
        newInj
      );
      continue;
    }

    const [type, name, content] = newInj;

    if (!nameSetsByType[type]) {
      nameSetsByType[type] = new Set();
    }
    const typeSet = nameSetsByType[type];

    // Check for conflict
    const conflictCheck = checkForInjectionConflict(
      type,
      name,
      undefined,
      typeSet
    );

    if (!conflictCheck.hasConflict) {
      // No conflict, add directly
      result.push([type, name, content]);
      typeSet.add(name);
    } else {
      // Handle conflict based on resolution strategy
      if (resolution === 'skip') {
        // Do nothing, skip this injection
        continue;
      } else if (resolution === 'overwrite') {
        // Find and replace the existing injection
        const existingIndex = result.findIndex(
          (inj) => isValidInjection(inj) && inj[0] === type && inj[1] === name
        );
        if (existingIndex !== -1) {
          result[existingIndex] = [type, name, content];
          // typeSet already contains name
        }
      } else if (resolution === 'keep-both') {
        // Generate a unique name and add
        const uniqueName = generateUniqueInjectionName(
          type,
          name,
          undefined,
          typeSet
        );
        result.push([type, uniqueName, content]);
        typeSet.add(uniqueName);
      }
    }
  }

  return result;
};

/**
 * Merges new injection arrays into existing injections.
 * For each injection in the new array:
 * - If an injection with the same type and name exists, it overwrites it
 * - If no injection with the same type and name exists, it adds it
 * - Existing injections not present in the new array are kept intact
 * @param newInjections - Array of new injections to merge (format: [type, name, content][])
 * @param existingInjections - The current array of injections
 * @returns The merged array of injections
 */
export const mergeInjectionArrays = (
  newInjections: string[][],
  existingInjections: string[][] | undefined
): string[][] => {
  // Use 'overwrite' as the default strategy for backward compatibility
  return mergeInjectionArraysWithResolution(
    newInjections,
    existingInjections,
    'overwrite'
  );
};
