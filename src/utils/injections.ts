/**
 * Represents a conflict resolution strategy.
 */
export type ConflictResolution = 'skip' | 'overwrite' | 'keep-both';

/**
 * Result of checking for a conflict.
 */
export type ConflictCheckResult =
  | { hasConflict: false }
  | { hasConflict: true; conflictingName: string };

/**
 * Checks if a footprint name conflicts with existing injections.
 * @param name - The name of the footprint to check.
 * @param existingInjections - The array of existing injections.
 * @returns A conflict check result indicating if there's a conflict and the name.
 */
export const checkForConflict = (
  name: string,
  existingInjections: string[][] | undefined
): ConflictCheckResult => {
  if (!existingInjections || existingInjections.length === 0) {
    return { hasConflict: false };
  }

  const existingNames = existingInjections
    .filter((inj) => inj.length === 3 && inj[0] === 'footprint')
    .map((inj) => inj[1]);

  if (existingNames.includes(name)) {
    return { hasConflict: true, conflictingName: name };
  }

  return { hasConflict: false };
};

/**
 * Generates a unique name by appending an incremental number.
 * @param baseName - The base name to make unique.
 * @param existingInjections - The array of existing injections.
 * @returns A unique name.
 */
export const generateUniqueName = (
  baseName: string,
  existingInjections: string[][] | undefined
): string => {
  if (!existingInjections || existingInjections.length === 0) {
    return baseName;
  }

  const existingNames = existingInjections
    .filter((inj) => inj.length === 3 && inj[0] === 'footprint')
    .map((inj) => inj[1]);

  let counter = 1;
  let newName = `${baseName}_${counter}`;

  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName}_${counter}`;
  }

  return newName;
};

/**
 * Merges new footprints into existing injections based on the resolution strategy.
 * @param newFootprints - Array of new footprints to merge.
 * @param existingInjections - The current array of injections.
 * @param resolution - The conflict resolution strategy.
 * @returns The merged array of injections.
 */
export const mergeInjections = (
  newFootprints: Array<{ name: string; content: string }>,
  existingInjections: string[][] | undefined,
  resolution: ConflictResolution
): string[][] => {
  const result = existingInjections ? [...existingInjections] : [];

  for (const footprint of newFootprints) {
    const conflictCheck = checkForConflict(footprint.name, result);

    if (!conflictCheck.hasConflict) {
      // No conflict, add directly
      result.push(['footprint', footprint.name, footprint.content]);
    } else {
      // Handle conflict based on resolution strategy
      if (resolution === 'skip') {
        // Do nothing
        continue;
      } else if (resolution === 'overwrite') {
        // Find and replace the existing injection
        const index = result.findIndex(
          (inj) =>
            inj.length === 3 &&
            inj[0] === 'footprint' &&
            inj[1] === footprint.name
        );
        if (index !== -1) {
          result[index] = ['footprint', footprint.name, footprint.content];
        }
      } else if (resolution === 'keep-both') {
        // Generate a unique name and add
        const uniqueName = generateUniqueName(footprint.name, result);
        result.push(['footprint', uniqueName, footprint.content]);
      }
    }
  }

  return result;
};
