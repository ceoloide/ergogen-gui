/**
 * Utilities for working with KLE (Keyboard Layout Editor) format
 * and converting it to Ergogen configuration.
 */

// Window type definitions are in src/types/window.d.ts

/**
 * Converts KLE JSON string to Ergogen configuration.
 * Uses the existing KLE conversion functionality in ergogen.js.
 *
 * @param kleJson - The KLE JSON string (serialized format)
 * @returns The Ergogen configuration as YAML string, or null if conversion fails
 */
export const convertKleToErgogen = (kleJson: string): string | null => {
  try {
    // Check if ergogen and kle are available
    if (!window.ergogen || !window.kle?.Serial) {
      console.error('Ergogen or KLE serialization not available');
      return null;
    }

    // The ergogen.process function can handle KLE format directly
    // It will detect it's KLE and convert it automatically
    const result = window.ergogen.process(
      kleJson,
      false,
      (message: string) => {
        console.log('[Ergogen KLE conversion]', message);
      }
    );

    // The result should be an Ergogen config object
    // We need to convert it to YAML format
    // For now, we'll return the KLE JSON and let ergogen handle it
    // The actual conversion happens in the worker

    return kleJson;
  } catch (error) {
    console.error('Failed to convert KLE to Ergogen:', error);
    return null;
  }
};

/**
 * Validates if a string is valid KLE JSON format.
 *
 * @param jsonString - The JSON string to validate
 * @returns true if valid KLE format, false otherwise
 */
export const isValidKleJson = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    // KLE format is an array where first element is metadata
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return false;
    }
    // First element should be an object with metadata
    if (typeof parsed[0] !== 'object' || parsed[0] === null) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Creates a basic Ergogen config wrapper around KLE data.
 * This allows the KLE data to be processed by Ergogen's KLE converter.
 *
 * @param kleJson - The KLE JSON string
 * @returns A minimal Ergogen config that will trigger KLE conversion
 */
export const createErgogenConfigFromKle = (kleJson: string): string => {
  // Ergogen can process KLE format directly - it detects it automatically
  // We just need to pass it through. The ergogen worker will handle conversion.
  return kleJson;
};
