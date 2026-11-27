import fc from 'fast-check';
import { generateUniqueInjectionName } from './injections';

// Property tests for the name that an injection gets when the user keeps both
// sides of a name conflict, such as `name_1`. useInjectionConflictResolution
// and mergeInjectionArraysWithResolution call generateUniqueInjectionName with
// the name that clashes.

// 200 inputs per property keep the file well under one second of test time.
const runs = { numRuns: 200 };

const type = fc.constantFrom('footprint', 'template', 'outline');
const baseName = fc.string({
  unit: fc.constantFrom('a', 'b', '_', '1'),
  minLength: 1,
  maxLength: 3,
});
const content = fc.string({ size: 'xsmall' });

// Injections of any type, named after the base name, a numbered copy of it,
// or another name, and one injection of the given type that has the base name.
const conflict = fc
  .tuple(type, baseName)
  .chain(([conflictType, conflictName]) =>
    fc.record({
      type: fc.constant(conflictType),
      name: fc.constant(conflictName),
      existing: fc
        .array(
          fc.tuple(
            type,
            fc.oneof(
              fc.constant(conflictName),
              fc
                .integer({ min: 1, max: 4 })
                .map((number) => `${conflictName}_${number}`),
              baseName
            ),
            content
          ),
          { maxLength: 8 }
        )
        .map((injections) => [
          ...injections,
          [conflictType, conflictName, 'existing code'],
        ]),
    })
  );

describe('injection conflict name properties', () => {
  it('names the new injection after the first number that no injection of its type has', () => {
    fc.assert(
      fc.property(conflict, ({ type: injectionType, name, existing }) => {
        const taken = new Set(
          existing
            .filter(([existingType]) => existingType === injectionType)
            .map(([, existingName]) => existingName)
        );

        const uniqueName = generateUniqueInjectionName(
          injectionType,
          name,
          existing
        );

        expect(taken.has(uniqueName)).toBe(false);
        const number = Number(uniqueName.slice(name.length + 1));
        expect(uniqueName).toBe(`${name}_${number}`);
        expect(number).toBeGreaterThanOrEqual(1);
        for (let lower = 1; lower < number; lower++) {
          expect(taken.has(`${name}_${lower}`)).toBe(true);
        }
      }),
      runs
    );
  });

  it('keeps the name when there are no injections', () => {
    fc.assert(
      fc.property(
        type,
        baseName,
        fc.constantFrom<string[][] | undefined>(undefined, []),
        (injectionType, name, existing) => {
          expect(
            generateUniqueInjectionName(injectionType, name, existing)
          ).toBe(name);
        }
      ),
      runs
    );
  });
});
