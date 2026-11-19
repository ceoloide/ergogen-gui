import {
  engineHasFeature,
  installedEngineVersion,
  type EngineFeature,
} from './engineRequirements';

/**
 * The build-variable override of each feature, read when called. The type
 * lists every feature in src/utils/engineRequirements.ts, so a new feature does
 * not compile until it has a line here (and its variable in vite.config.mts).
 */
const featureEnvOverrides = (): Record<EngineFeature, string | undefined> => ({
  templates: import.meta.env.VITE_FEATURE_TEMPLATES,
  outlines: import.meta.env.VITE_FEATURE_OUTLINES,
});

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
  const envVal = featureEnvOverrides()[feature];
  if (envVal === 'true') return true;
  if (envVal === 'false') return false;

  // --- Step 3: Engine Requirement Check ---
  return engineHasFeature(feature, installedEngineVersion());
};
