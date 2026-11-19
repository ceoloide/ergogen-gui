import {
  engineHasFeature,
  installedEngineVersion,
  type EngineFeature,
} from './engineRequirements';

/**
 * Checks if a specific feature is enabled in the current environment.
 * Evaluates in order:
 * 1. URL Query overrides (e.g. ?ff_templates=true)
 * 2. Environment variable overrides (e.g. REACT_APP_FEATURE_TEMPLATES=true)
 * 3. Whether the engine this build uses has the feature, as recorded in
 *    src/utils/engineRequirements.ts
 */
export const isFeatureEnabled = (feature: EngineFeature): boolean => {
  // --- Step 1: URL Query Overrides (for testing/development) ---
  if (typeof window !== 'undefined' && window.location) {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryOverride = params.get(`ff_${feature}`);
      if (queryOverride === 'true') return true;
      if (queryOverride === 'false') return false;
    } catch (e) {
      console.warn('[FeatureFlags] Failed to check URL query parameters:', e);
    }
  }

  // --- Step 2: Build-Time Environment Variable Check ---
  let envVal: string | undefined;
  if (feature === 'templates') {
    envVal = import.meta.env.VITE_FEATURE_TEMPLATES;
  } else if (feature === 'outlines') {
    envVal = import.meta.env.VITE_FEATURE_OUTLINES;
  }
  if (envVal === 'true') return true;
  if (envVal === 'false') return false;

  // --- Step 3: Engine Requirement Check ---
  return engineHasFeature(feature, installedEngineVersion());
};
