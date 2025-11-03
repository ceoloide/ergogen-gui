import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

/**
 * Structure for sharing keyboard configuration.
 * This structure allows for future expansion to include injections (footprints).
 */
export interface ShareableConfig {
  config: string;
  injections?: string[][];
}

/**
 * Encodes and compresses a keyboard configuration for sharing via URI.
 * Includes both config and injections (footprints, templates, etc.) when present.
 *
 * @param config - The YAML/JSON configuration string
 * @param injections - Optional array of injections (footprints, templates, etc.)
 * @returns Encoded and compressed string suitable for URI fragment
 */
export const encodeConfig = (
  config: string,
  injections?: string[][]
): string => {
  const shareableConfig: ShareableConfig = {
    config,
    // Include all injections if present
    ...(injections && injections.length > 0 ? { injections } : {}),
  };

  const jsonString = JSON.stringify(shareableConfig);
  return compressToEncodedURIComponent(jsonString);
};

/**
 * Decodes and decompresses a shared keyboard configuration from a URI fragment.
 *
 * @param encodedString - The encoded and compressed string from URI fragment
 * @returns The decoded ShareableConfig object, or null if decoding fails
 */
export const decodeConfig = (encodedString: string): ShareableConfig | null => {
  try {
    const decompressed = decompressFromEncodedURIComponent(encodedString);
    if (!decompressed) {
      return null;
    }

    const parsed = JSON.parse(decompressed) as ShareableConfig;
    return parsed;
  } catch (error) {
    console.error('Failed to decode shared config:', error);
    return null;
  }
};

/**
 * Creates a shareable URI with the encoded configuration as a hash fragment.
 *
 * @param config - The YAML/JSON configuration string
 * @param injections - Optional array of injections
 * @returns Full URL with encoded config in hash fragment
 */
export const createShareableUri = (
  config: string,
  injections?: string[][]
): string => {
  const encoded = encodeConfig(config, injections);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#${encoded}`;
};

/**
 * Extracts and decodes configuration from the current page's hash fragment.
 *
 * @returns The decoded ShareableConfig object, or null if no valid fragment exists
 */
export const getConfigFromHash = (): ShareableConfig | null => {
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) {
    return null;
  }

  // Remove the '#' prefix
  const encodedString = hash.substring(1);
  return decodeConfig(encodedString);
};
