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
 * Options for creating a shareable URI.
 */
type CreateShareableUriOptions = {
  /** The YAML/JSON configuration string */
  config: string;
  /** Optional array of injections (footprints, templates, etc.) */
  injections?: string[][];
  /**
   * Optional canonical output from Ergogen (results.canonical).
   * When provided, footprint injections are filtered to only include
   * those actually used in the configuration's PCBs section.
   * Non-footprint injections (templates, etc.) are always included.
   */
  canonical?: unknown;
};

/**
 * Creates a shareable URI with the encoded configuration as a hash fragment.
 * When canonical output is provided, only footprints used in the configuration
 * are included in the share link.
 *
 * @param options - Configuration options for creating the shareable URI
 * @returns Full URL with encoded config in hash fragment
 */
export const createShareableUri = (
  options: CreateShareableUriOptions
): string => {
  const { config, injections, canonical } = options;

  // Filter injections if canonical output is provided
  let injectionsToShare = injections;
  if (canonical && injections && injections.length > 0) {
    const usedFootprints = extractUsedFootprintsFromCanonical(canonical);
    injectionsToShare = filterInjectionsForSharing(injections, usedFootprints);
  }

  // Only include injections if there are any after filtering
  const finalInjections =
    injectionsToShare && injectionsToShare.length > 0
      ? injectionsToShare
      : undefined;

  const encoded = encodeConfig(config, finalInjections);
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

/**
 * Type definition for the canonical output structure from Ergogen.
 * The canonical output contains the fully resolved configuration after all
 * YAML substitutions and anchors have been processed.
 */
type CanonicalPcbFootprint = {
  what?: string;
  [key: string]: unknown;
};

type CanonicalPcb = {
  footprints?: Record<string, CanonicalPcbFootprint>;
  [key: string]: unknown;
};

type CanonicalOutput = {
  pcbs?: Record<string, CanonicalPcb>;
  [key: string]: unknown;
};

/**
 * Extracts the names of all footprints used in the PCBs section of the canonical output.
 * This examines the resolved `what` property of each footprint definition to determine
 * which footprints are actually used in the configuration.
 *
 * @param canonical - The canonical output from Ergogen (results.canonical)
 * @returns A Set of footprint names that are used in the configuration
 */
export const extractUsedFootprintsFromCanonical = (
  canonical: unknown
): Set<string> => {
  const usedFootprints = new Set<string>();

  // Return empty set if canonical is null or undefined
  if (!canonical || typeof canonical !== 'object') {
    return usedFootprints;
  }

  const canonicalOutput = canonical as CanonicalOutput;

  // Return empty set if there's no pcbs section
  if (!canonicalOutput.pcbs || typeof canonicalOutput.pcbs !== 'object') {
    return usedFootprints;
  }

  // Iterate through all PCBs
  for (const pcbName of Object.keys(canonicalOutput.pcbs)) {
    const pcb = canonicalOutput.pcbs[pcbName];

    // Skip if no footprints in this PCB
    if (!pcb || !pcb.footprints || typeof pcb.footprints !== 'object') {
      continue;
    }

    // Iterate through all footprints in this PCB
    for (const footprintName of Object.keys(pcb.footprints)) {
      const footprint = pcb.footprints[footprintName];

      // Add the footprint name (from 'what' property) if it's a valid string
      if (footprint && typeof footprint.what === 'string') {
        usedFootprints.add(footprint.what);
      }
    }
  }

  return usedFootprints;
};

/**
 * Filters injections to only include footprints that are actually used in the configuration.
 * Non-footprint injections (templates, etc.) are always included.
 *
 * @param injections - The array of injections [type, name, content]
 * @param usedFootprints - A Set of footprint names that are used in the configuration
 * @returns A filtered array of injections
 */
export const filterInjectionsForSharing = (
  injections: string[][] | undefined,
  usedFootprints: Set<string>
): string[][] => {
  if (!injections || injections.length === 0) {
    return [];
  }

  return injections.filter((injection) => {
    const [type, name] = injection;

    // Keep non-footprint injections (templates, etc.)
    if (type !== 'footprint') {
      return true;
    }

    // For footprints, only include if they're in the used set
    return usedFootprints.has(name);
  });
};
