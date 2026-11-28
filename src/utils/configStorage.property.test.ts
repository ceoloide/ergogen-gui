import fc from 'fast-check';
import { migrateConfigStorage, type StoredConfigs } from './configStorage';

// Property tests for the storage migration that ConfigContext runs on load. It
// reads the container under `ergogen:multi-config` (storage version 1 or 2)
// and the two keys of releases before the container, `LOCAL_STORAGE_CONFIG`
// (`legacyConfig`) and `ergogen:config` (`singleConfig`).

// 200 inputs per property keep the file well under one second of test time.
const runs = { numRuns: 200 };

const now = '2026-11-27T12:00:00.000Z';
const newIds = (prefix: string) => {
  let count = 0;
  return () => `${prefix}-${++count}`;
};

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
// No known release stored JSON that is not a string, such as 123 or {}.
const nonStringJson = fc
  .jsonValue()
  .filter((value) => typeof value !== 'string')
  .map((value) => JSON.stringify(value));
const legacyKeyText = fc.option(
  fc.oneof(
    fc
      .tuple(fc.oneof(configText, blankText), fc.boolean())
      .map(([text, asPlainText]) => storeLegacyText(text, asPlainText)),
    nonStringJson
  ),
  { nil: null }
);
const legacyKeyWithText = fc.oneof(
  fc.tuple(filledText, fc.boolean()).map(([text, asPlainText]) => ({
    value: storeLegacyText(text, asPlainText),
    text,
  })),
  nonStringJson.map((value) => ({ value, text: value }))
);
const emptyLegacyKey = fc.oneof(
  fc.constant(null),
  blankText.map((text) => JSON.stringify(text)),
  blankText
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
        const once = migrateConfigStorage(stored, now, newIds('first'));

        // The second run gets other ids, so a legacy configuration that it
        // added again would differ.
        const twice = migrateConfigStorage(once.stored, now, newIds('second'));

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
            newIds('new')
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

  it('turns the text of a legacy key into the active "Legacy Config", stores it as version 2, and clears both legacy keys, when the other key holds no text', () => {
    fc.assert(
      fc.property(
        containerWithoutLegacyConfig,
        legacyKeyWithText,
        emptyLegacyKey,
        fc.boolean(),
        (stored, { value, text }, emptyValue, textInSingleConfig) => {
          const { container: loaded, stored: migrated } = migrateConfigStorage(
            {
              multiConfig: JSON.stringify(stored),
              legacyConfig: textInSingleConfig ? emptyValue : value,
              singleConfig: textInSingleConfig ? value : emptyValue,
            },
            now,
            () => 'new-id'
          );

          expect(loaded.configs).toHaveLength(stored.configs.length + 1);
          expect(loaded.configs.at(-1)).toEqual({
            id: 'new-id',
            name: 'Legacy Config',
            config: text,
            createdAt: now,
            updatedAt: now,
          });
          expect(loaded.activeConfigId).toBe('new-id');
          expect(JSON.parse(migrated.multiConfig ?? 'null')).toEqual({
            version: 2,
            activeConfigId: 'new-id',
            configs: loaded.configs,
          });
          expect(migrated.legacyConfig).toBeNull();
          expect(migrated.singleConfig).toBeNull();
        }
      ),
      runs
    );
  });

  it('makes the ergogen:config text active and keeps a different LOCAL_STORAGE_CONFIG text as "Legacy Config (older)", when both keys hold text', () => {
    fc.assert(
      fc.property(
        containerWithoutLegacyConfig,
        legacyKeyWithText,
        legacyKeyWithText,
        (stored, legacy, single) => {
          const { container: loaded, stored: migrated } = migrateConfigStorage(
            {
              multiConfig: JSON.stringify(stored),
              legacyConfig: legacy.value,
              singleConfig: single.value,
            },
            now,
            newIds('new')
          );

          const added = loaded.configs.slice(stored.configs.length);
          const older =
            legacy.text === single.text
              ? []
              : [{ name: 'Legacy Config (older)', config: legacy.text }];
          expect(added.map(({ name, config }) => ({ name, config }))).toEqual([
            ...older,
            { name: 'Legacy Config', config: single.text },
          ]);
          expect(loaded.activeConfigId).toBe(added.at(-1)?.id);
          expect(new Set(added.map(({ id }) => id)).size).toBe(added.length);
          expect(JSON.parse(migrated.multiConfig ?? 'null')).toEqual(loaded);
          expect(migrated.legacyConfig).toBeNull();
          expect(migrated.singleConfig).toBeNull();
        }
      ),
      runs
    );
  });

  it('changes no storage and keeps the active configuration when no legacy key holds text', () => {
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
            newIds('new')
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
