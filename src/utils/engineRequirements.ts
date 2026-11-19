import ergogenPkg from 'ergogen/package.json';
import { compareVersions, parseVersion } from './version';

/**
 * The one place that records which Ergogen engine version the GUI needs for
 * each engine feature it offers. A deployment may build with an older engine
 * than the canonical one (see DEVELOPMENT.md, "Deployment engine"); the GUI
 * then hides what that engine cannot do. To add a feature, add its line here
 * and its build-variable override to `featureEnvOverrides` in
 * src/utils/featureFlags.ts (TypeScript rejects a feature without one), and
 * gate its UI with `isFeatureEnabled`.
 */
export const ENGINE_FEATURES = {
  templates: '4.3.0',
  outlines: '4.3.0',
} as const;

export type EngineFeature = keyof typeof ENGINE_FEATURES;

/**
 * The version of the engine this build uses, for requirement checks (features,
 * examples and share-link compatibility): the version of the installed
 * package. `VITE_ERGOGEN_VERSION` only names the engine in the UI and share
 * links, so it is not consulted here. src/utils/version.ts reads the package
 * version too, for the displayed identity.
 *
 * GUI tests replace this function with the canonical version (see
 * src/setupTests.tsx), so they behave the same whichever engine is installed.
 */
export const installedEngineVersion = (): string => ergogenPkg.version;

/** Parses `4.3`, `v4.3.0` or `4.3.0-beta` the way the engine reads `meta.engine`. */
const parseEngineVersion = (value: string): [number, number, number] | null => {
  const parts = value.split('-')[0].replace(/^v/, '').split('.');
  while (parts.length < 3) parts.push('0');
  if (parts.length > 3 || !parts.every((part) => /^\d+$/.test(part))) {
    return null;
  }
  return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
};

/**
 * Whether the engine version `engineVersion` meets a `required` version, such
 * as a configuration's `meta.engine`. This is the engine's own rule: the same
 * major version, and a minor and patch version at least as high. A value the
 * engine could not read is never met.
 */
export const meetsEngineRequirement = (
  engineVersion: string,
  required: string
): boolean => {
  const current = parseEngineVersion(engineVersion);
  const requirement = parseEngineVersion(required);
  if (!current || !requirement) return false;
  const [major, minor, patch] = current;
  const [requiredMajor, requiredMinor, requiredPatch] = requirement;
  return (
    major === requiredMajor &&
    (minor > requiredMinor ||
      (minor === requiredMinor && patch >= requiredPatch))
  );
};

/**
 * Whether the engine version `engineVersion` has an engine feature: it is at
 * least the feature's minimum version, whatever the major version.
 */
export const engineHasFeature = (
  feature: EngineFeature,
  engineVersion: string
): boolean => {
  const current = parseVersion(engineVersion);
  const required = parseVersion(ENGINE_FEATURES[feature]);
  return current !== null && required !== null
    ? compareVersions(current, required)
    : false;
};
