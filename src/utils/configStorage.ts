/** A configuration that the app keeps in storage. */
export interface SavedConfig {
  id: string;
  name: string;
  config: string;
  createdAt: string;
  updatedAt: string;
  previewSvg?: string;
}

/** The stored configurations and the id of the active one. */
export interface MultiConfigContainer {
  version: number;
  activeConfigId: string | null;
  configs: SavedConfig[];
}

/**
 * The text of each storage key that holds configurations, or null when the
 * key is missing.
 */
export interface StoredConfigs {
  /** `ergogen:multi-config`: the container, storage version 1 or 2. */
  multiConfig: string | null;
  /** `LOCAL_STORAGE_CONFIG`: editor text of releases from 2022 to October 2025. */
  legacyConfig: string | null;
  /** `ergogen:config`: editor text of releases from October 2025 to July 2026. */
  singleConfig: string | null;
}

interface ConfigStorageMigration {
  /** The container that the app loads. */
  container: MultiConfigContainer;
  /** The text of each key after the migration. Write back each one that changed. */
  stored: StoredConfigs;
  /** Why the stored container could not be read, when it could not. */
  readError?: unknown;
}

const LEGACY_CONFIG_NAME = 'Legacy Config';

const emptyContainer = (): MultiConfigContainer => ({
  version: 2,
  activeConfigId: null,
  configs: [],
});

/** Storage version 1 kept no timestamps, so a missing one becomes `now`. */
const readContainer = (
  multiConfig: string | null,
  now: string
): Pick<ConfigStorageMigration, 'container' | 'readError'> => {
  if (!multiConfig) return { container: emptyContainer() };
  try {
    const parsed = JSON.parse(multiConfig);
    if (parsed && typeof parsed.version === 'number') {
      const configs = (parsed.configs || []).map(
        (cfg: Partial<SavedConfig>) => ({
          ...cfg,
          createdAt: cfg.createdAt || now,
          updatedAt: cfg.updatedAt || now,
        })
      );
      return { container: { ...parsed, configs } };
    }
  } catch (error) {
    return { container: emptyContainer(), readError: error };
  }
  return { container: emptyContainer() };
};

/**
 * Releases before the container stored the editor text as JSON. Text that is
 * not JSON is read as it is.
 */
const readLegacyText = (value: string): string => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/**
 * Turns the stored text of the configuration keys into the container that the
 * app loads. It reads the editor text from `legacyConfig`, or from
 * `singleConfig` when `legacyConfig` is missing. Text that is not blank becomes
 * the active configuration "Legacy Config" unless one exists, and both keys are
 * cleared. Applied to its own `stored` result, it returns the same result.
 */
export const migrateConfigStorage = (
  stored: StoredConfigs,
  now: string,
  newId: string
): ConfigStorageMigration => {
  const { container, readError } = readContainer(stored.multiConfig, now);
  const legacyValue = stored.legacyConfig || stored.singleConfig;
  const legacyText = legacyValue ? readLegacyText(legacyValue) : '';
  if (!legacyText || legacyText.trim() === '') {
    return { container, stored, readError };
  }

  const withoutLegacyKeys = {
    ...stored,
    legacyConfig: null,
    singleConfig: null,
  };
  if (container.configs.some((c) => c.name === LEGACY_CONFIG_NAME)) {
    return { container, stored: withoutLegacyKeys, readError };
  }

  const legacyConfig: SavedConfig = {
    id: newId,
    name: LEGACY_CONFIG_NAME,
    config: legacyText,
    createdAt: now,
    updatedAt: now,
  };
  const migrated: MultiConfigContainer = {
    version: 2,
    activeConfigId: newId,
    configs: [...container.configs, legacyConfig],
  };
  return {
    container: migrated,
    stored: { ...withoutLegacyKeys, multiConfig: JSON.stringify(migrated) },
    readError,
  };
};
