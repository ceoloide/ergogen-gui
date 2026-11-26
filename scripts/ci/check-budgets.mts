// Fails when a count of `pnpm metrics` differs from its ceiling in
// budgets.json:
//
//   node scripts/ci/check-budgets.mts
//
// Each key of budgets.json names a count of `countDefinitions` in metrics.mts,
// which holds the pattern and the files it reads, so both commands print the
// same number. A count above its ceiling fails with the message of its budget.
// A count below its ceiling also fails until the ceiling is lowered to it, so
// a ceiling can only go down.
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import {
  countDefinitions,
  countPatterns,
  readSourceFiles,
  type Counts,
  type SourceFile,
} from './metrics.mts';

export const budgetsPath = 'budgets.json';

export interface Budget {
  name: keyof Counts;
  ceiling: number;
  /** Names what a contributor writes instead of the pattern. */
  message: string;
}

/** budgets.json does not have the shape that `parseBudgets` reads. */
export class BudgetFileError extends Error {}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isCountName = (name: string): name is keyof Counts =>
  Object.hasOwn(countDefinitions, name);

const fail = (problem: string): never => {
  throw new BudgetFileError(`${budgetsPath}: ${problem}`);
};

export function parseBudgets(text: string): Budget[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    return fail(`not valid JSON: ${(error as Error).message}`);
  }
  if (!isObject(parsed)) {
    return fail('must be an object with one budget for each count name');
  }
  return Object.entries(parsed).map(([name, entry]) => {
    if (!isCountName(name)) {
      return fail(
        `"${name}" is not a count of pnpm metrics. Use one of: ${Object.keys(countDefinitions).join(', ')}`
      );
    }
    if (!isObject(entry)) return fail(`"${name}" must be an object`);
    const { ceiling, message, ...unknownFields } = entry;
    const unknownNames = Object.keys(unknownFields);
    if (unknownNames.length > 0) {
      return fail(
        `"${name}" has unknown fields ${unknownNames.join(', ')}. A budget has only a ceiling and a message`
      );
    }
    if (typeof ceiling !== 'number' || !Number.isInteger(ceiling)) {
      return fail(`"${name}" needs a ceiling that is a whole number`);
    }
    if (ceiling < 0) return fail(`"${name}" has a ceiling below 0`);
    if (typeof message !== 'string' || message.trim() === '') {
      return fail(`"${name}" needs a message that names the replacement`);
    }
    return { name, ceiling, message };
  });
}

/** One problem for each count that differs from its ceiling. */
export function checkBudgets(
  budgets: readonly Budget[],
  files: readonly SourceFile[]
): string[] {
  const counts = countPatterns(files);
  return budgets.flatMap(({ name, ceiling, message }) => {
    const count = counts[name];
    const counted = `${name}: ${count} ${countDefinitions[name].description}`;
    if (count > ceiling) {
      return [`${counted}, above the ceiling of ${ceiling}.\n  ${message}`];
    }
    if (count < ceiling) {
      return [
        `${counted}, below the ceiling of ${ceiling}.\n  Lower the ceiling of ${name} in ${budgetsPath} to ${count}.`,
      ];
    }
    return [];
  });
}

function main() {
  let budgets: Budget[];
  try {
    budgets = parseBudgets(readFileSync(budgetsPath, 'utf8'));
  } catch (error) {
    if (!(error instanceof BudgetFileError)) throw error;
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
    return;
  }
  const problems = checkBudgets(budgets, readSourceFiles());
  if (problems.length > 0) {
    process.stderr.write(`${problems.join('\n')}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(
    `${budgets.length} budgets in ${budgetsPath} match their counts.\n`
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
