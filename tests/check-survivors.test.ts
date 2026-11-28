// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  checkSurvivors,
  renderSurvivors,
  survivorsPath,
} from '../scripts/ci/check-survivors.mts';

const mutant = (
  status: string,
  line: number,
  mutatorName: string,
  replacement: string
) => ({
  mutatorName,
  replacement,
  status,
  location: { start: { line, column: 7 }, end: { line, column: 19 } },
});

/** A report of src/utils/zip.ts with the given mutants. */
const report = (...mutants: ReturnType<typeof mutant>[]) =>
  JSON.stringify({ files: { 'src/utils/zip.ts': { mutants } } });

const survived = mutant('Survived', 38, 'ConditionalExpression', 'true');
const survivedEntry =
  '- `src/utils/zip.ts:38:7-38:19` ConditionalExpression `true`';
const untested = mutant('NoCoverage', 6, 'StringLiteral', '""');
const untestedEntry = '- `src/utils/zip.ts:6:7-6:19` StringLiteral `""`';

describe('survivor check', () => {
  it('passes when the file names every undetected mutant and nothing else', () => {
    // Arrange
    const reasons = `## Equivalent\n\n${survivedEntry}\n${untestedEntry}\n`;

    // Act
    const check = checkSurvivors(report(survived, untested), reasons);

    // Assert
    expect(check).toEqual({ undetected: 2, missing: [], stale: [] });
  });

  it('lists an undetected mutant that the file does not name', () => {
    // Act
    const check = checkSurvivors(
      report(survived, untested),
      `${survivedEntry}\n`
    );

    // Assert
    expect(check.missing).toEqual([untestedEntry]);
  });

  it('ignores the mutants that the tests detect', () => {
    // Arrange
    const killed = mutant('Killed', 17, 'UpdateOperator', 'counter--');
    const timedOut = mutant('Timeout', 46, 'ConditionalExpression', 'true');

    // Act
    const check = checkSurvivors(report(survived, killed, timedOut), '');

    // Assert
    expect(check).toEqual({
      undetected: 1,
      missing: [survivedEntry],
      stale: [],
    });
  });

  it('tells two mutants at one position apart by their replacement', () => {
    // Arrange
    const other = mutant('Survived', 38, 'ConditionalExpression', 'false');

    // Act
    const check = checkSurvivors(report(survived, other), survivedEntry);

    // Assert
    expect(check.missing).toEqual([
      '- `src/utils/zip.ts:38:7-38:19` ConditionalExpression `false`',
    ]);
  });

  it('tells two mutants with one start, mutator, and replacement apart by their end', () => {
    // Arrange: Stryker replaces both `a || b` and its operand `a` with true.
    const operand = {
      ...survived,
      location: {
        start: { line: 38, column: 7 },
        end: { line: 38, column: 9 },
      },
    };

    // Act
    const check = checkSurvivors(report(survived, operand), survivedEntry);

    // Assert
    expect(check.missing).toEqual([
      '- `src/utils/zip.ts:38:7-38:9` ConditionalExpression `true`',
    ]);
  });

  it('lists an entry of the file that names no undetected mutant', () => {
    // Arrange
    const detected = mutant('Killed', 6, 'StringLiteral', '""');

    // Act
    const check = checkSurvivors(
      report(survived, detected),
      `${survivedEntry}\n${untestedEntry}\n`
    );

    // Assert
    expect(check.stale).toEqual([untestedEntry]);
  });

  it('writes a replacement of several lines on one line, in a code span that fits its backticks', () => {
    // Arrange
    const multiline = mutant(
      'Survived',
      12,
      'StringLiteral',
      '`${name}\n    _copy`'
    );

    // Act
    const check = checkSurvivors(report(multiline), '');

    // Assert
    expect(check.missing).toEqual([
      '- `src/utils/zip.ts:12:7-12:19` StringLiteral `` `${name} _copy` ``',
    ]);
  });

  it('prints each missing mutant and each stale entry under what to do with it', () => {
    // Arrange
    const check = { undetected: 2, missing: [survivedEntry], stale: ['- x'] };

    // Act
    const text = renderSurvivors(check, 'mutation.json');

    // Assert
    expect(text).toBe(
      [
        `mutation.json has 2 undetected mutants. ${survivorsPath} names 1 of them.`,
        '',
        `Kill each of these mutants with a test, or add it to ${survivorsPath} under its reason:`,
        '',
        survivedEntry,
        '',
        `Remove these lines from ${survivorsPath}. The report has no undetected mutant that they name:`,
        '',
        '- x',
        '',
      ].join('\n')
    );
  });
});
