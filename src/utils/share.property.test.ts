import fc from 'fast-check';
import { compressToEncodedURIComponent } from 'lz-string';
import { decodeConfig, encodeConfig } from './share';

// Property tests for the share link format in README.md, "Share links". A link
// payload is compressToEncodedURIComponent(JSON.stringify(data)), where data
// holds `config`, optional [type, name, code] `injections`, and optional
// `guiVersion` and `ergogenVersion`.

// README.md: "The app treats missing versions as GUI 0.9.0 and Ergogen 4.2.1."
const missingVersions = {
  guiVersion: '0.9.0',
  ergogenVersion: 'github:ergogen/ergogen#v4.2.1',
};

// 200 inputs per property keep the file under one second of test time.
const runs = { numRuns: 200 };

// Any Unicode text of up to 100 code points.
const text = fc.string({ unit: 'binary', size: 'medium' });
const version = fc.string({ unit: 'binary', minLength: 1 });
const injection = fc.tuple(
  fc.constantFrom('footprint', 'template', 'outline'),
  text,
  text
);
const injections = fc.array(injection, { minLength: 1, maxLength: 4 });
const maybeInjections = fc.option(injections, { nil: undefined });

// Text that looks like a link: characters from the payload alphabet.
const linkAlphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$';
const linkLikeText = fc.string({
  unit: fc.constantFrom(...linkAlphabet),
  size: 'medium',
});

const isInjectionList = (value: unknown) =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      Array.isArray(item) &&
      item.length === 3 &&
      item.every((field) => typeof field === 'string')
  );

// Payloads that break the format: no text config, injections that are not
// [string, string, string] tuples, or data that is not an object.
const malformedData = fc.oneof(
  fc.record(
    {
      config: fc.jsonValue().filter((value) => typeof value !== 'string'),
      guiVersion: version,
      ergogenVersion: version,
    },
    { requiredKeys: [] }
  ),
  fc.record({
    config: text,
    injections: fc.jsonValue().filter((value) => !isInjectionList(value)),
  }),
  fc
    .jsonValue()
    .filter(
      (value) =>
        typeof value !== 'object' || value === null || Array.isArray(value)
    )
);

/** Builds a payload the way README.md tells other tools to. */
const documentedPayload = (data: unknown) =>
  compressToEncodedURIComponent(JSON.stringify(data));

describe('share link properties', () => {
  beforeEach(() => {
    // decodeConfig logs every link that it rejects.
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('decodes every encoded link to the same config, injections, and versions', () => {
    fc.assert(
      fc.property(
        text,
        maybeInjections,
        version,
        version,
        (config, injectionList, guiVersion, ergogenVersion) => {
          const link = encodeConfig(
            config,
            injectionList,
            guiVersion,
            ergogenVersion
          );

          expect(decodeConfig(link)).toEqual({
            success: true,
            config: {
              config,
              injections: injectionList,
              guiVersion,
              ergogenVersion,
            },
          });
        }
      ),
      runs
    );
  });

  it('reads a link built as README.md describes, and a missing version as GUI 0.9.0 and Ergogen 4.2.1', () => {
    const documentedData = fc.record(
      {
        config: text,
        injections,
        guiVersion: version,
        ergogenVersion: version,
      },
      { requiredKeys: ['config'] }
    );

    fc.assert(
      fc.property(documentedData, (data) => {
        expect(decodeConfig(documentedPayload(data))).toEqual({
          success: true,
          config: { ...missingVersions, ...data },
        });
      }),
      runs
    );
  });

  it('rejects a link with characters cut from its end unless the cut kept the whole configuration', () => {
    fc.assert(
      fc.property(
        text,
        maybeInjections,
        version,
        version,
        // Counting from the end keeps a failing cut in place while fast-check
        // shrinks the configuration.
        fc.integer({ min: 1, max: 2000 }),
        (config, injectionList, guiVersion, ergogenVersion, dropped) => {
          const link = encodeConfig(
            config,
            injectionList,
            guiVersion,
            ergogenVersion
          );
          const original = {
            config,
            injections: injectionList,
            guiVersion,
            ergogenVersion,
          };

          const result = decodeConfig(link.slice(0, -dropped));

          // lz-string ends a payload with padding, so a short cut can still
          // decode the whole link.
          if (result.success) {
            expect(result.config).toEqual(original);
          }
        }
      ),
      runs
    );
  });

  it('rejects a payload that breaks the format', () => {
    fc.assert(
      fc.property(malformedData, (data) => {
        expect(decodeConfig(documentedPayload(data))).toEqual({
          success: false,
          error: 'VALIDATION_ERROR',
          message: expect.any(String),
        });
      }),
      runs
    );
  });

  it('returns an error result, never a throw, for text that is not a link', () => {
    fc.assert(
      fc.property(fc.oneof(text, linkLikeText), (input) => {
        expect(decodeConfig(input).success).toBe(false);
      }),
      runs
    );
  });
});
