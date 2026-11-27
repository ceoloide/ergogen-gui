// Lists each mutant that a Stryker JSON report marks as undetected and that
// docs/records/mutation-survivors.md does not name:
//
//   node scripts/ci/check-survivors.mts [report]
//
// The report defaults to the one that `pnpm test:mutation` writes. The file
// names each mutant on a line of its own, in the form that this script prints:
//
//   - `src/utils/zip.ts:38:9-38:21` ConditionalExpression `true`
//
// The range is the code that Stryker replaces, in the form that
// `stryker run --mutate` reads. It tells apart mutants that start at one
// position with one mutator and one replacement, such as `a || b` and its
// operand `a`, each replaced with `true`.
//
// The script also lists each line of the file that names no undetected mutant
// of the report, so that the file names exactly the undetected mutants. It
// fails when either list has a line.
import { appendFileSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { mutationReportPath, scoredStatuses } from './metrics.mts';

export const survivorsPath = 'docs/records/mutation-survivors.md';

/** The part of a Stryker JSON report that this script reads. */
interface MutationReport {
  files: Record<
    string,
    {
      mutants: {
        mutatorName: string;
        replacement?: string;
        status: string;
        location: {
          start: { line: number; column: number };
          end: { line: number; column: number };
        };
      }[];
    }
  >;
}

export interface SurvivorCheck {
  undetected: number;
  /** Undetected mutants of the report that the file does not name. */
  missing: string[];
  /** Lines of the file that name no undetected mutant of the report. */
  stale: string[];
}

/** A code span that shows `code` unchanged, whatever backticks it holds. */
const codeSpan = (code: string) => {
  const longestRun = Math.max(
    0,
    ...(code.match(/`+/g) ?? []).map((run) => run.length)
  );
  const fence = '`'.repeat(longestRun + 1);
  const padding = code.startsWith('`') || code.endsWith('`') ? ' ' : '';
  return `${fence}${padding}${code}${padding}${fence}`;
};

/**
 * The line that names a mutant. Stryker reports a replacement that spans
 * several lines with its line breaks and indentation, which this line turns
 * into single spaces.
 */
const entryOf = (
  path: string,
  mutant: MutationReport['files'][string]['mutants'][number]
) => {
  const { start, end } = mutant.location;
  const range = `${start.line}:${start.column}-${end.line}:${end.column}`;
  const replacement = (mutant.replacement ?? '').replace(/\s+/g, ' ').trim();
  return `- \`${path}:${range}\` ${mutant.mutatorName} ${codeSpan(replacement)}`;
};

/** Lines that start like an entry: a list item with a file and a range. */
const entryPattern = /^- `[^`]+:\d+:\d+-\d+:\d+` /;

export function checkSurvivors(
  reportJson: string,
  survivorsText: string
): SurvivorCheck {
  const { files } = JSON.parse(reportJson) as MutationReport;
  const undetected = Object.entries(files).flatMap(([path, { mutants }]) =>
    mutants
      .filter(
        ({ status }) =>
          scoredStatuses[status as keyof typeof scoredStatuses] === 'undetected'
      )
      .map((mutant) => entryOf(path, mutant))
  );
  const named = new Set(
    survivorsText
      .split('\n')
      .map((line) => line.trimEnd())
      .filter((line) => entryPattern.test(line))
  );
  const undetectedSet = new Set(undetected);
  return {
    undetected: undetected.length,
    missing: undetected.filter((entry) => !named.has(entry)),
    stale: [...named].filter((entry) => !undetectedSet.has(entry)),
  };
}

export function renderSurvivors(
  { undetected, missing, stale }: SurvivorCheck,
  reportPath: string
): string {
  const lines = [
    `${reportPath} has ${undetected} undetected mutants. ${survivorsPath} names ${undetected - missing.length} of them.`,
  ];
  if (missing.length > 0) {
    lines.push(
      '',
      `Kill each of these mutants with a test, or add it to ${survivorsPath} under its reason:`,
      '',
      ...missing
    );
  }
  if (stale.length > 0) {
    lines.push(
      '',
      `Remove these lines from ${survivorsPath}. The report has no undetected mutant that they name:`,
      '',
      ...stale
    );
  }
  return lines.join('\n') + '\n';
}

function main() {
  const reportPath = process.argv[2] ?? mutationReportPath;
  const check = checkSurvivors(
    readFileSync(reportPath, 'utf8'),
    readFileSync(survivorsPath, 'utf8')
  );
  const summary = renderSurvivors(check, reportPath);
  process.stdout.write(summary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  }
  process.exitCode = check.missing.length + check.stale.length > 0 ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
