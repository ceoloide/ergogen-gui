import fc from 'fast-check';
import { getUniqueName } from './zip';

// Property tests for the folder and file names in bulk export archives
// (#266). bulkExport.ts passes one set of used names to getUniqueName for
// every configuration in an archive.

// 200 inputs per property keep the file well under one second of test time.
const runs = { numRuns: 200 };

// Names from a few characters, so that a name and its numbered copies, such
// as `a_1`, clash often. `/` and `:` cannot appear in an archive name.
const name = fc.string({
  unit: fc.constantFrom('a', 'b', '_', '1', '2', '/', ':'),
  maxLength: 5,
});
const archiveSafeName = name.filter(
  (candidate) => candidate !== '' && !/[/\\?%*:|"<>]/.test(candidate)
);

describe('archive name properties', () => {
  it('never returns a name that is already used', () => {
    fc.assert(
      fc.property(fc.array(name), name, (used, rawName) => {
        const usedNames = new Set(used);
        const usedBefore = new Set(usedNames);

        const uniqueName = getUniqueName(usedNames, rawName);

        expect(usedBefore.has(uniqueName)).toBe(false);
      }),
      runs
    );
  });

  it('keeps a free name that is safe in an archive', () => {
    fc.assert(
      fc.property(fc.array(name), archiveSafeName, (used, rawName) => {
        const usedNames = new Set(
          used.filter((usedName) => usedName !== rawName)
        );

        expect(getUniqueName(usedNames, rawName)).toBe(rawName);
      }),
      runs
    );
  });

  it('gives every name in a list its own folder', () => {
    fc.assert(
      fc.property(fc.array(name, { maxLength: 12 }), (rawNames) => {
        const usedNames = new Set<string>();

        const folderNames = rawNames.map((rawName) =>
          getUniqueName(usedNames, rawName)
        );

        expect(new Set(folderNames).size).toBe(rawNames.length);
      }),
      runs
    );
  });
});
