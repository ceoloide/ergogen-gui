import {
  migrateConfigStorage,
  type MultiConfigContainer,
  type SavedConfig,
  type StoredConfigs,
} from './configStorage';

const now = '2026-11-27T12:00:00.000Z';

const savedConfig: SavedConfig = {
  id: 'saved-id',
  name: 'My keyboard',
  config: 'points: {}',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

const multiConfig = JSON.stringify({
  version: 2,
  activeConfigId: savedConfig.id,
  configs: [savedConfig],
});

const newIds = () => {
  let count = 0;
  return () => `new-id-${++count}`;
};

const configsByName = (container: MultiConfigContainer) =>
  container.configs.map(({ name, config }) => ({ name, config }));

const activeConfig = (container: MultiConfigContainer) =>
  container.configs.find((config) => config.id === container.activeConfigId);

describe('migrateConfigStorage', () => {
  it.each([
    ['one character each', '!', '"'],
    ['two YAML configurations', 'units:\n  kx: 18', 'units:\n  kx: 19'],
  ])(
    'makes the ergogen:config text active and keeps the LOCAL_STORAGE_CONFIG text when both differ (%s)',
    (_, legacyText, singleText) => {
      const stored: StoredConfigs = {
        multiConfig,
        legacyConfig: JSON.stringify(legacyText),
        singleConfig: JSON.stringify(singleText),
      };

      const { container, stored: after } = migrateConfigStorage(
        stored,
        now,
        newIds()
      );

      expect(configsByName(container)).toEqual([
        { name: savedConfig.name, config: savedConfig.config },
        { name: 'Legacy Config (older)', config: legacyText },
        { name: 'Legacy Config', config: singleText },
      ]);
      expect(activeConfig(container)?.name).toBe('Legacy Config');
      expect(JSON.parse(after.multiConfig ?? 'null')).toEqual(container);
      expect(after.legacyConfig).toBeNull();
      expect(after.singleConfig).toBeNull();
    }
  );

  it('adds one configuration when both old keys hold the same text', () => {
    const text = 'units:\n  kx: 18';
    const stored: StoredConfigs = {
      multiConfig: null,
      legacyConfig: JSON.stringify(text),
      singleConfig: JSON.stringify(text),
    };

    const { container } = migrateConfigStorage(stored, now, newIds());

    expect(configsByName(container)).toEqual([
      { name: 'Legacy Config', config: text },
    ]);
    expect(activeConfig(container)?.config).toBe(text);
  });

  it.each([
    ['""', '""'],
    ['a blank JSON string', JSON.stringify(' \n ')],
    ['blank text', ' '],
    ['text of zero length', ''],
  ])(
    'makes the ergogen:config text active when LOCAL_STORAGE_CONFIG holds %s',
    (_, legacyConfig) => {
      const text = 'units:\n  kx: 18';
      const stored: StoredConfigs = {
        multiConfig,
        legacyConfig,
        singleConfig: JSON.stringify(text),
      };

      const { container, stored: after } = migrateConfigStorage(
        stored,
        now,
        newIds()
      );

      expect(configsByName(container)).toEqual([
        { name: savedConfig.name, config: savedConfig.config },
        { name: 'Legacy Config', config: text },
      ]);
      expect(activeConfig(container)?.config).toBe(text);
      expect(after.legacyConfig).toBeNull();
      expect(after.singleConfig).toBeNull();
    }
  );

  describe.each(['legacyConfig', 'singleConfig'] as const)(
    'with JSON that is not a string under %s',
    (key) => {
      it.each(['123', 'true', '{}', '[]'])(
        'keeps the stored configurations and copies %s as its stored text',
        (value) => {
          const stored: StoredConfigs = {
            multiConfig,
            legacyConfig: null,
            singleConfig: null,
            [key]: value,
          };

          const { container, stored: after } = migrateConfigStorage(
            stored,
            now,
            newIds()
          );

          expect(container.configs[0]).toEqual(savedConfig);
          expect(configsByName(container)).toEqual([
            { name: savedConfig.name, config: savedConfig.config },
            { name: 'Legacy Config', config: value },
          ]);
          expect(after.legacyConfig).toBeNull();
          expect(after.singleConfig).toBeNull();
        }
      );
    }
  );

  it.each(['null', '0', '123', 'true', '{}', '[]'])(
    'makes the ergogen:config text active and keeps %s from LOCAL_STORAGE_CONFIG as its stored text',
    (legacyConfig) => {
      const text = 'units:\n  kx: 18';
      const stored: StoredConfigs = {
        multiConfig: null,
        legacyConfig,
        singleConfig: JSON.stringify(text),
      };

      const { container } = migrateConfigStorage(stored, now, newIds());

      expect(activeConfig(container)?.config).toBe(text);
      expect(configsByName(container)).toContainEqual({
        name: 'Legacy Config (older)',
        config: legacyConfig,
      });
    }
  );
});
