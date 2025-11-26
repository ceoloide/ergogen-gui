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
 * If canonical YAML is provided, only footprints actually used in the configuration
 * are included in the share link.
 *
 * @param config - The YAML/JSON configuration string
 * @param injections - Optional array of injections (footprints, templates, etc.)
 * @param canonical - Optional canonical YAML object to filter footprints
 * @returns Encoded and compressed string suitable for URI fragment
 */
export const encodeConfig = (
  config: string,
  injections?: string[][],
  canonical?: unknown
): string => {
  // Filter footprints if canonical YAML is provided
  const filteredInjections =
    canonical && injections
      ? filterUsedFootprints(injections, canonical)
      : injections;

  const shareableConfig: ShareableConfig = {
    config,
    // Include filtered injections if present
    ...(filteredInjections && filteredInjections.length > 0
      ? { injections: filteredInjections }
      : {}),
  };

  const jsonString = JSON.stringify(shareableConfig);
  return compressToEncodedURIComponent(jsonString);
};

/**
 * Result of decoding a shared configuration.
 */
type DecodeResult =
  | { success: true; config: ShareableConfig }
  | {
      success: false;
      error: 'DECODE_ERROR' | 'VALIDATION_ERROR';
      message: string;
    };

/**
 * Checks if debug mode is enabled via URL parameter.
 */
const isDebugMode = (): boolean => {
  const queryParameters = new URLSearchParams(window.location.search);
  return queryParameters.get('debug') !== null;
};

/**
 * Decodes and decompresses a shared keyboard configuration from a URI fragment.
 *
 * @param encodedString - The encoded and compressed string from URI fragment
 * @returns A DecodeResult indicating success or failure with error details
 */
export const decodeConfig = (encodedString: string): DecodeResult => {
  const debug = isDebugMode();

  try {
    const decompressed = decompressFromEncodedURIComponent(encodedString);
    if (!decompressed) {
      console.error(
        '[Share] DECODE_ERROR: Failed to decompress encoded string'
      );
      return {
        success: false,
        error: 'DECODE_ERROR',
        message:
          'The shared configuration link is invalid or corrupted. The encoded data could not be decompressed.',
      };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(decompressed);
    } catch (parseError) {
      console.error('[Share] DECODE_ERROR: Failed to parse decompressed JSON', {
        parseError,
        decompressedLength: decompressed.length,
        decompressedPreview: decompressed.substring(0, 100),
      });
      return {
        success: false,
        error: 'DECODE_ERROR',
        message:
          'The shared configuration link is invalid or corrupted. The decompressed data is not valid JSON.',
      };
    }

    // Validate the structure
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('config' in parsed) ||
      typeof (parsed as { config: unknown }).config !== 'string'
    ) {
      console.error('[Share] VALIDATION_ERROR: Invalid object structure', {
        parsed,
        hasConfig: parsed && typeof parsed === 'object' && 'config' in parsed,
        configType:
          parsed && typeof parsed === 'object' && 'config' in parsed
            ? typeof (parsed as { config: unknown }).config
            : 'N/A',
      });
      return {
        success: false,
        error: 'VALIDATION_ERROR',
        message:
          'The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure.',
      };
    }

    const shareableConfig = parsed as ShareableConfig;

    // Validate injections if present
    if (
      'injections' in shareableConfig &&
      shareableConfig.injections !== undefined
    ) {
      if (
        !Array.isArray(shareableConfig.injections) ||
        !shareableConfig.injections.every(
          (inj) =>
            Array.isArray(inj) &&
            inj.length === 3 &&
            typeof inj[0] === 'string' &&
            typeof inj[1] === 'string' &&
            typeof inj[2] === 'string'
        )
      ) {
        console.error(
          '[Share] VALIDATION_ERROR: Invalid injections structure',
          {
            injections: shareableConfig.injections,
            isArray: Array.isArray(shareableConfig.injections),
          }
        );
        return {
          success: false,
          error: 'VALIDATION_ERROR',
          message:
            'The shared configuration link contains invalid injections data. Injections must be an array of [type, name, content] tuples.',
        };
      }
    }

    // Debug logging: log the decoded object when debug mode is enabled
    if (debug) {
      console.log('[Share] DEBUG: Decoded configuration object', {
        configLength: shareableConfig.config.length,
        hasInjections: shareableConfig.injections !== undefined,
        injectionsCount: shareableConfig.injections?.length ?? 0,
        fullObject: shareableConfig,
      });
    }

    return { success: true, config: shareableConfig };
  } catch (error) {
    console.error('[Share] DECODE_ERROR: Unexpected error during decoding', {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: 'DECODE_ERROR',
      message:
        'The shared configuration link is invalid or corrupted. An unexpected error occurred while decoding.',
    };
  }
};

/**
 * Extracts footprint names used in the PCBs section of the canonical YAML.
 * Traverses all PCBs and collects all `what` values from footprint definitions.
 *
 * @param canonical - The canonical YAML object (already parsed)
 * @returns Set of footprint names (e.g., 'ceoloide/switch_mx')
 */
export const extractUsedFootprints = (
  canonical: unknown
): Set<string> => {
  const usedFootprints = new Set<string>();

  if (!canonical || typeof canonical !== 'object') {
    return usedFootprints;
  }

  const canonicalObj = canonical as Record<string, unknown>;

  // Check if pcbs section exists
  if (!canonicalObj.pcbs || typeof canonicalObj.pcbs !== 'object') {
    return usedFootprints;
  }

  const pcbs = canonicalObj.pcbs as Record<string, unknown>;

  // Iterate through each PCB
  for (const pcbName of Object.keys(pcbs)) {
    const pcb = pcbs[pcbName];
    if (!pcb || typeof pcb !== 'object') {
      continue;
    }

    const pcbObj = pcb as Record<string, unknown>;

    // Check if footprints section exists
    if (!pcbObj.footprints || typeof pcbObj.footprints !== 'object') {
      continue;
    }

    const footprints = pcbObj.footprints as Record<string, unknown>;

    // Iterate through each footprint definition
    for (const footprintName of Object.keys(footprints)) {
      const footprint = footprints[footprintName];
      if (!footprint || typeof footprint !== 'object') {
        continue;
      }

      const footprintObj = footprint as Record<string, unknown>;

      // Extract the 'what' field which contains the footprint name
      if (
        footprintObj.what &&
        typeof footprintObj.what === 'string' &&
        footprintObj.what.trim().length > 0
      ) {
        usedFootprints.add(footprintObj.what);
      }
    }
  }

  return usedFootprints;
};

/**
 * Filters injections to only include footprints that are used in the configuration.
 * Uses the canonical YAML to determine which footprints are actually used.
 *
 * @param injections - Array of injections to filter (format: [type, name, content][])
 * @param canonical - The canonical YAML object (already parsed)
 * @returns Filtered array containing only used footprints and all non-footprint injections
 */
export const filterUsedFootprints = (
  injections: string[][] | undefined,
  canonical: unknown
): string[][] | undefined => {
  if (!injections || injections.length === 0) {
    return undefined;
  }

  const usedFootprints = extractUsedFootprints(canonical);

  // If no footprints are used, filter out all footprint injections
  if (usedFootprints.size === 0) {
    return injections.filter((inj) => {
      if (!Array.isArray(inj) || inj.length !== 3) {
        return true; // Keep invalid injections (shouldn't happen, but be safe)
      }
      const [type] = inj;
      return type !== 'footprint'; // Keep non-footprint injections
    });
  }

  // Filter injections: keep footprints that are used, and all non-footprint injections
  const filtered = injections.filter((inj) => {
    if (!Array.isArray(inj) || inj.length !== 3) {
      return true; // Keep invalid injections (shouldn't happen, but be safe)
    }

    const [type, name] = inj;

    // Keep all non-footprint injections (templates, etc.)
    if (type !== 'footprint') {
      return true;
    }

    // For footprints, only keep if they're used
    return usedFootprints.has(name);
  });

  return filtered.length > 0 ? filtered : undefined;
};

/**
 * Creates a shareable URI with the encoded configuration as a hash fragment.
 * If canonical YAML is provided, only footprints actually used in the configuration
 * are included in the share link.
 *
 * @param config - The YAML/JSON configuration string
 * @param injections - Optional array of injections
 * @param canonical - Optional canonical YAML object to filter footprints
 * @returns Full URL with encoded config in hash fragment
 */
export const createShareableUri = (
  config: string,
  injections?: string[][],
  canonical?: unknown
): string => {
  const encoded = encodeConfig(config, injections, canonical);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#${encoded}`;
};

/**
 * Extracts and decodes configuration from the current page's hash fragment.
 *
 * @returns A DecodeResult indicating success or failure with error details, or null if no hash fragment exists
 */
export const getConfigFromHash = (): DecodeResult | null => {
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) {
    return null;
  }

  // Remove the '#' prefix
  const encodedString = hash.substring(1);
  return decodeConfig(encodedString);
};
