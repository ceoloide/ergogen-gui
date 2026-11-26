// @vitest-environment node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  BudgetFileError,
  checkBudgets,
  parseBudgets,
} from '../scripts/ci/check-budgets.mts';
import type { SourceFile } from '../scripts/ci/metrics.mts';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const file = (path: string, text: string): SourceFile => ({
  path,
  text,
  bytes: Buffer.byteLength(text),
});

const effectMessage = 'Compute the value during render.';

const useEffectBudget = (ceiling: number) =>
  parseBudgets(
    JSON.stringify({ use_effect: { ceiling, message: effectMessage } })
  );

const appWithEffects = (calls: number) => [
  file('src/App.tsx', 'useEffect(() => {});\n'.repeat(calls)),
];

describe('budget check', () => {
  it('passes when every count equals its ceiling', () => {
    // Act
    const problems = checkBudgets(useEffectBudget(2), appWithEffects(2));

    // Assert
    expect(problems).toEqual([]);
  });

  it('fails with the message of the budget when a count is above its ceiling', () => {
    // Act
    const problems = checkBudgets(useEffectBudget(2), appWithEffects(3));

    // Assert
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('use_effect: 3');
    expect(problems[0]).toContain('above the ceiling of 2');
    expect(problems[0]).toContain(effectMessage);
  });

  it('fails when a count is below its ceiling until the ceiling is lowered', () => {
    // Arrange
    const files = appWithEffects(1);

    // Act
    const before = checkBudgets(useEffectBudget(2), files);
    const after = checkBudgets(useEffectBudget(1), files);

    // Assert
    expect(before).toHaveLength(1);
    expect(before[0]).toContain('Lower the ceiling of use_effect');
    expect(before[0]).toContain('to 1');
    expect(after).toEqual([]);
  });

  it('does not count test files against a production budget', () => {
    // Arrange
    const files = [
      ...appWithEffects(1),
      file('src/App.test.tsx', 'useEffect(() => {});\n'),
      file('tests/app.test.ts', 'useEffect(() => {});\n'),
    ];

    // Act
    const problems = checkBudgets(useEffectBudget(1), files);

    // Assert
    expect(problems).toEqual([]);
  });
});

describe('budget file', () => {
  const budget = { ceiling: 1, message: effectMessage };

  it.each([
    ['is not JSON', '{', 'not valid JSON'],
    ['is a list', JSON.stringify([budget]), 'must be an object'],
    ['has no budget', '{}', 'has no budget'],
    [
      'names an unknown count',
      JSON.stringify({ use_effects: budget }),
      '"use_effects" is not a count',
    ],
    [
      'has no ceiling',
      JSON.stringify({ use_effect: { message: effectMessage } }),
      'needs a ceiling',
    ],
    [
      'has a fractional ceiling',
      JSON.stringify({ use_effect: { ...budget, ceiling: 1.5 } }),
      'needs a ceiling',
    ],
    [
      'has a negative ceiling',
      JSON.stringify({ use_effect: { ...budget, ceiling: -1 } }),
      'ceiling below 0',
    ],
    [
      'has no message',
      JSON.stringify({ use_effect: { ceiling: 1 } }),
      'needs a message',
    ],
    [
      'has an empty message',
      JSON.stringify({ use_effect: { ...budget, message: ' ' } }),
      'needs a message',
    ],
    [
      'has a field the check ignores',
      JSON.stringify({ use_effect: { ...budget, glob: 'src/**' } }),
      'unknown fields glob',
    ],
  ])('is rejected when it %s', (_case, text, problem) => {
    // Act
    const parse = () => parseBudgets(text);

    // Assert
    expect(parse).toThrow(BudgetFileError);
    expect(parse).toThrow(problem);
  });

  it('in the repository parses', () => {
    // Arrange
    const text = readFileSync(resolve(projectRoot, 'budgets.json'), 'utf8');

    // Act
    const budgets = parseBudgets(text);

    // Assert
    expect(budgets.length).toBeGreaterThan(0);
  });
});
