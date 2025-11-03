import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

/**
 * Represents a shareable configuration that can be encoded in a URI fragment.
 * This structure is designed to be extensible to support future additions like injections.
 */
export interface ShareableConfig {
  /** The YAML/JSON configuration string */
  config: string;
  /** Optional: Array of code injections (footprints, templates) for future use */
  injections?: string[][];
  /** Version of the share format for future compatibility */
  version?: number;
}

/**
 * Encodes a configuration into a compressed, URL-safe string suitable for URI fragments.
 * Uses lz-string's compressToEncodedURIComponent for compression and URL encoding.
 *
 * @param config - The configuration string to encode
 * @param injections - Optional array of injections for future use
 * @returns A compressed and URL-encoded string
 */
export const encodeConfigToUri = (
  config: string,
  injections?: string[][]
): string => {
  const shareable: ShareableConfig = {
    config,
    version: 1,
  };

  // Include injections if provided (for future use)
  if (injections && injections.length > 0) {
    shareable.injections = injections;
  }

  const jsonString = JSON.stringify(shareable);
  return compressToEncodedURIComponent(jsonString);
};

/**
 * Decodes a configuration from a compressed URI fragment.
 * Uses lz-string's decompressFromEncodedURIComponent for decompression.
 *
 * @param encoded - The compressed and URL-encoded string from the URI fragment
 * @returns The decoded ShareableConfig object, or null if decoding fails
 */
export const decodeConfigFromUri = (
  encoded: string
): ShareableConfig | null => {
  try {
    const decompressed = decompressFromEncodedURIComponent(encoded);
    if (!decompressed) {
      return null;
    }

    const parsed = JSON.parse(decompressed);

    // Validate the parsed object has required fields
    if (typeof parsed.config !== 'string') {
      return null;
    }

    return parsed as ShareableConfig;
  } catch (error) {
    console.error('Failed to decode config from URI:', error);
    return null;
  }
};

/**
 * Creates a shareable URI for the current page with the encoded config in the hash fragment.
 *
 * @param config - The configuration string to share
 * @param injections - Optional array of injections for future use
 * @returns The complete shareable URI
 */
export const createShareableUri = (
  config: string,
  injections?: string[][]
): string => {
  const encoded = encodeConfigToUri(config, injections);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#${encoded}`;
};
