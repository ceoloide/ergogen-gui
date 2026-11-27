import fc from 'fast-check';
import { migrateConfigStorage, type StoredConfigs } from './configStorage';

// Property tests for the storage migration that ConfigContext runs on load. It
// reads the container under `ergogen:multi-config` (storage version 1 or 2)
// and the two keys of releases before the container, `LOCAL_STORAGE_CONFIG`
// (`legacyConfig`) and `ergogen:config` (`singleConfig`).

// 200 inputs per property keep the file well under one second of test time.
const runs = { numRuns: 200 };

const now = '2026-11-27T12:00:00.000Z';
const newId = 'new-id';

const timestamp = fc
  .date({
    min: new Date('2020-01-01T00:00:00.000Z'),
    max: new Date('2030-01-01T00:00:00.000Z'),
    noInvalidDate: true,
  })
  .map((date) => date.toISOString());
const configText = fc.string({ unit: 'binary', size: 'small' });
const blankText = fc.constantFrom('', ' ', '\n', ' \t ');
const filledText = configText.filter((text) => text.trim() !== '');

// Storage version 1 kept no timestamps, so they may be missing.
const containerWithNames = (name: fc.Arbitrary<string>) =>
  fc.record({
    version: fc.constantFrom(1, 2),
    activeConfigId: fc.option(fc.uuid(), { nil: null }),
    configs: fc.array(
      fc.record(
        {
          id: fc.uuid(),
          name,
          config: configText,
          createdAt: timestamp,
          updatedAt: timestamp,
          previewSvg: fc.string({ size: 'small' }),
        },
        { requiredKeys: ['id', 'name', 'config'] }
      ),
      { maxLength: 4 }
    ),
  });
const configName = fc.string({ size: 'small' });
const container = containerWithNames(
  fc.oneof(configName, fc.constant('Legacy Config'))
);
const containerWithoutLegacyConfig = containerWithNames(
  configName.filter((name) => name !== 'Legacy Config')
);

const isJson = (text: string) => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

// Releases before the container wrote the editor text with useLocalStorage,
// which stores it as JSON. The migration also reads text that is not JSON.
const storeLegacyText = (text: string, asPlainText: boolean) =>
  asPlainText && !isJson(text) ? text : JSON.stringify(text);
const legacyKeyText = fc.option(
  fc
    .tuple(fc.oneof(configText, blankText), fc.boolean())
    .map(([text, asPlainText]) => storeLegacyText(text, asPlainText)),
  { nil: null }
);

// Any storage: a container, JSON without a version, unreadable text, or
// nothing under each key.
const storedConfigs: fc.Arbitrary<StoredConfigs> = fc.record({
  multiConfig: fc.option(
    fc.oneof(
      container.map((stored) => JSON.stringify(stored)),
      fc.json(),
      fc.string()
    ),
    { nil: null }
  ),
  legacyConfig: legacyKeyText,
  singleConfig: legacyKeyText,
});

describe('storage migration properties', () => {
  it('gives the same result when applied to its own result', () => {
    fc.assert(
      fc.property(storedConfigs, (stored) => {
        const once = migrateConfigStorage(stored, now, 'first-id');

        // The second run gets another id, so a legacy configuration that it
        // added again would differ.
        const twice = migrateConfigStorage(once.stored, now, 'second-id');

        expect(twice.stored).toEqual(once.stored);
        expect(twice.container).toEqual(once.container);
      }),
      runs
    );
  });

  it('keeps every stored configuration and its fields, and gives a missing timestamp the load time', () => {
    fc.assert(
      fc.property(
        container,
        legacyKeyText,
        legacyKeyText,
        (stored, legacyConfig, singleConfig) => {
          const { container: loaded } = migrateConfigStorage(
            { multiConfig: JSON.stringify(stored), legacyConfig, singleConfig },
            now,
            newId
          );

          expect(loaded.configs.slice(0, stored.configs.length)).toEqual(
            stored.configs.map((config) => ({
              createdAt: now,
              updatedAt: now,
              ...config,
            }))
          );
        }
      ),
      runs
    );
  });

  it('turns the text of a legacy key into the active "Legacy Config", stores it as version 2, and clears both legacy keys', () => {
    fc.assert(
      fc.property(
        containerWithoutLegacyConfig,
        filledText,
        fc.boolean(),
        fc.constantFrom('legacyConfig', 'singleConfig'),
        (stored, text, asPlainText, key) => {
          const { container: loaded, stored: migrated } = migrateConfigStorage(
            {
              multiConfig: JSON.stringify(stored),
              legacyConfig: null,
              singleConfig: null,
              [key]: storeLegacyText(text, asPlainText),
            },
            now,
            newId
          );

          expect(loaded.configs).toHaveLength(stored.configs.length + 1);
          expect(loaded.configs.at(-1)).toEqual({
            id: newId,
            name: 'Legacy Config',
            config: text,
            createdAt: now,
            updatedAt: now,
          });
          expect(loaded.activeConfigId).toBe(newId);
          expect(JSON.parse(migrated.multiConfig ?? 'null')).toEqual({
            version: 2,
            activeConfigId: newId,
            configs: loaded.configs,
          });
          expect(migrated.legacyConfig).toBeNull();
          expect(migrated.singleConfig).toBeNull();
        }
      ),
      runs
    );
  });

  it('changes no storage and keeps the active configuration when no legacy key holds text', () => {
    const emptyLegacyKey = fc.oneof(
      fc.constant(null),
      blankText.map((text) => JSON.stringify(text))
    );

    fc.assert(
      fc.property(
        container,
        emptyLegacyKey,
        emptyLegacyKey,
        (stored, legacyConfig, singleConfig) => {
          const before = {
            multiConfig: JSON.stringify(stored),
            legacyConfig,
            singleConfig,
          };

          const { container: loaded, stored: after } = migrateConfigStorage(
            before,
            now,
            newId
          );

          expect(after).toEqual(before);
          expect(loaded.activeConfigId).toBe(stored.activeConfigId);
          expect(loaded.configs).toHaveLength(stored.configs.length);
        }
      ),
      runs
    );
  });
});
