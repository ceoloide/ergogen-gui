import { getErgogenVersionInfo } from './version';
import ergogenPkg from 'ergogen/package.json';

type FeatureName = 'templates' | 'outlines';

// Minimum Ergogen version required for each feature
const FEATURE_VERSION_REQUIREMENTS: Record<FeatureName, string> = {
  templates: '4.3.0',
  outlines: '4.3.0',
};

/**
 * Parses a version string into [major, minor, patch] numbers.
 * Returns null if the version string is not standard.
 */
export const parseVersion = (v: string): [number, number, number] | null => {
  const clean = v.replace(/^v/, '');
  const match = clean.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
};

/**
 * Compares two parsed versions. Returns true if v1 >= v2.
 */
export const compareVersions = (
  v1: [number, number, number],
  v2: [number, number, number]
): boolean => {
  for (let i = 0; i < 3; i++) {
    if (v1[i] > v2[i]) return true;
    if (v1[i] < v2[i]) return false;
  }
  return true; // Equal
};

/**
 * Checks if a specific feature is enabled in the current environment.
 * Evaluates in order:
 * 1. URL Query overrides (e.g. ?ff_templates=true)
 * 2. Environment variable overrides (e.g. REACT_APP_FEATURE_TEMPLATES=true)
 * 3. Runtime capability detection based on active Ergogen version
 */
export const isFeatureEnabled = (feature: FeatureName): boolean => {
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
  const envVarName = `REACT_APP_FEATURE_${feature.toUpperCase()}`;
  const envVal = process.env[envVarName];
  if (envVal === 'true') return true;
  if (envVal === 'false') return false;

  // --- Step 3: Runtime Capability Check ---
  const versionInfo = getErgogenVersionInfo(
    process.env.REACT_APP_ERGOGEN_VERSION
  );
  let currentVersion = versionInfo.displayText;

  // Defer to the package version carried in the package.json if the versionInfo.displayText
  // is a custom reference that doesn't resolve to a standard semver string (e.g. branch name or commit hash).
  if (!parseVersion(currentVersion)) {
    currentVersion = ergogenPkg.version;
  }

  const requiredVersion = FEATURE_VERSION_REQUIREMENTS[feature];

  const parsedCurrent = parseVersion(currentVersion);
  const parsedRequired = parseVersion(requiredVersion);

  if (parsedCurrent && parsedRequired) {
    return compareVersions(parsedCurrent, parsedRequired);
  }

  return false;
};
