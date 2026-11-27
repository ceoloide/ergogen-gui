// Records the baseline that later roadmap tasks compare against. `pnpm metrics`
// runs the stages of `pnpm validate` through scripts/ci/validate.mts, which
// starts independent stages at the same time, and times each stage. It reads
// the unit test report and the bundle that those stages produce, and the
// mutation report of an earlier `pnpm test:mutation` when one exists. It counts
// patterns in the source, writes reports/metrics.json and prints a table.
//
// The counts port source/measure.sh from the 2027 roadmap report and keep its
// names, so both give the same numbers on one commit. They read only the files
// that Git tracks or would track, so they do not depend on the machine.
//
// Stage times do depend on the machine, and on the stages that run at the same
// time. With --repeat <n>, the script runs all stages n times, one round after
// another, and records the median of each.
import { execFileSync } from 'node:child_process';
import {
  appendFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { availableParallelism, cpus, loadavg } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { summarizeJUnit } from './junit.mts';
import {
  runStages,
  validationStages,
  type ValidationRun,
} from './validate.mts';

export const metricsPath = 'reports/metrics.json';
const unitReportPath = 'reports/unit.xml';
/** The jsonReporter default of Stryker, which stryker.config.json keeps. */
export const mutationReportPath = 'reports/mutation/mutation.json';
const bundleDirectory = 'dist';

export interface SourceFile {
  /** Relative to the repository root, with forward slashes. */
  path: string;
  text: string;
  bytes: number;
}

/** The only paths that a count reads. */
const scannedPaths = ['src', 'e2e', 'tests', 'scripts', 'DEVELOPMENT.md'];

const lines = (file: SourceFile) => file.text.split('\n');

const sum = <T,>(items: readonly T[], value: (item: T) => number) =>
  items.reduce((total, item) => total + value(item), 0);

/** Newline characters, as `wc -l` counts them. */
const newlines = (files: readonly SourceFile[]) =>
  sum(files, (file) => lines(file).length - 1);

/** Every match on every line, as `grep -o` lists them. */
const matches = (pattern: RegExp, files: readonly SourceFile[]) => {
  const global = new RegExp(pattern, 'g');
  return sum(files, (file) =>
    sum(lines(file), (line) => [...line.matchAll(global)].length)
  );
};

/** Lines with at least one match, as `grep -c` counts them. */
const matchingLines = (pattern: RegExp, files: readonly SourceFile[]) =>
  sum(files, (file) => lines(file).filter((line) => pattern.test(line)).length);

/** The file sets that measure.sh selects with `find`. */
function selectFiles(files: readonly SourceFile[]) {
  const inside = (...directories: string[]) =>
    files.filter(({ path }) =>
      directories.some((directory) => path.startsWith(`${directory}/`))
    );
  const isTestName = ({ path }: SourceFile) =>
    basename(path).includes('.test.');
  const production = inside('src').filter(
    (file) => /\.tsx?$/.test(file.path) && !isTestName(file)
  );
  const productionInside = (directory: string) =>
    production.filter(({ path }) => path.startsWith(`${directory}/`));
  const outside = (...directories: string[]) =>
    production.filter(
      ({ path }) =>
        !directories.some((directory) => path.startsWith(`${directory}/`))
    );
  return {
    production,
    productionInside,
    productionOutsideExamples: outside('src/examples'),
    productionOutsideThemeAndExamples: outside('src/theme', 'src/examples'),
    file: (path: string) => files.filter((file) => file.path === path),
    unitAndBrowserTests: inside('src', 'e2e').filter(({ path }) =>
      /\.(test\.tsx?|spec\.ts)$/.test(path)
    ),
    testsIn: (...directories: string[]) =>
      inside(...directories).filter(isTestName),
    browserSpecs: files.filter(({ path }) =>
      /^e2e\/[^/]+\.spec\.ts$/.test(path)
    ),
  };
}

type FileSets = ReturnType<typeof selectFiles>;

interface CountDefinition {
  description: string;
  count: (sets: FileSets) => number;
}

const configContext = 'src/context/ConfigContext.tsx';

/** Imports from a higher layer, as lines of `from '../<layer>/`. */
const layerImports = (sets: FileSets, directory: string, layers: string) =>
  matchingLines(
    new RegExp(`from '(\\.\\./)+(${layers})/`),
    sets.productionInside(directory)
  );

/**
 * One entry per line of measure.sh, in its order. "Production code" means the
 * .ts and .tsx files in src, without test files.
 */
export const countDefinitions = {
  production_files: {
    description: 'Production files',
    count: ({ production }) => production.length,
  },
  production_lines: {
    description: 'Lines in production files',
    count: ({ production }) => newlines(production),
  },
  files_over_600_lines: {
    description: 'Production files over 600 lines, outside src/examples',
    count: ({ productionOutsideExamples }) =>
      productionOutsideExamples.filter((file) => newlines([file]) > 600).length,
  },
  config_context_lines: {
    description: `Lines in ${configContext}`,
    count: ({ file }) => newlines(file(configContext)),
  },
  config_context_effects: {
    description: `useEffect calls in ${configContext}`,
    count: ({ file }) => matches(/useEffect\(/, file(configContext)),
  },
  use_effect: {
    description: 'useEffect calls in production code',
    count: ({ production }) => matches(/useEffect\(/, production),
  },
  set_timeout: {
    description: 'setTimeout calls in production code',
    count: ({ production }) => matches(/setTimeout\(/, production),
  },
  local_storage: {
    description: 'localStorage uses in production code',
    count: ({ production }) => matches(/localStorage\./, production),
  },
  local_storage_files: {
    description: 'Production files that use localStorage',
    count: ({ production }) =>
      production.filter((file) => matches(/localStorage\./, [file]) > 0).length,
  },
  console: {
    description: 'console calls in production code',
    count: ({ production }) =>
      matches(/console\.(log|warn|error|debug|info)/, production),
  },
  eslint_disable: {
    description: 'eslint-disable comments in production code',
    count: ({ production }) => matches(/eslint-disable/, production),
  },
  as_unknown_as: {
    description: '"as unknown as" casts in production code',
    count: ({ production }) => matches(/as unknown as/, production),
  },
  ts_expect_error: {
    description:
      '@ts-ignore, @ts-expect-error and @ts-nocheck in production code',
    count: ({ production }) =>
      matches(/@ts-(ignore|expect-error|nocheck)/, production),
  },
  post_message: {
    description: 'postMessage calls in production code',
    count: ({ production }) => matches(/postMessage\(/, production),
  },
  track_calls: {
    description: 'trackEvent and gtag calls in production code',
    count: ({ production }) => matches(/trackEvent\(|gtag\(/, production),
  },
  base_url: {
    description: 'Lines in production code that join a path to BASE_URL',
    count: ({ production }) =>
      matchingLines(
        /\$\{import\.meta\.env\.BASE_URL\}|BASE_URL \+/,
        production
      ),
  },
  hex_colors_outside_theme: {
    description:
      'Hex colors in production code outside src/theme and src/examples',
    count: ({ productionOutsideThemeAndExamples }) =>
      matches(/#[0-9a-fA-F]{3,8}\b/, productionOutsideThemeAndExamples),
  },
  data_testid_attributes: {
    description: 'data-testid in production code',
    count: ({ production }) => matches(/data-testid/, production),
  },
  by_test_id: {
    description: 'ByTestId queries in unit and browser tests',
    count: ({ unitAndBrowserTests }) =>
      matches(/(get|find|query)(All)?ByTestId/, unitAndBrowserTests),
  },
  by_role: {
    description: 'ByRole queries in unit and browser tests',
    count: ({ unitAndBrowserTests }) =>
      matches(/(get|find|query)(All)?ByRole/, unitAndBrowserTests),
  },
  by_label: {
    description: 'ByLabel and ByLabelText queries in unit and browser tests',
    count: ({ unitAndBrowserTests }) =>
      matches(/(get|find|query)(All)?ByLabel(Text)?/, unitAndBrowserTests),
  },
  vi_mock: {
    description: 'vi.mock calls in test files in src, tests and scripts',
    count: ({ testsIn }) =>
      matches(/vi\.mock\(/, testsIn('src', 'tests', 'scripts')),
  },
  any_in_tests: {
    description: 'Uses of the any type in test files in src',
    count: ({ testsIn }) =>
      matches(/: any\b|<any>|as any\b|any\[\]/, testsIn('src')),
  },
  browser_tests: {
    description: 'Lines that start a test in e2e/*.spec.ts',
    count: ({ browserSpecs }) => matchingLines(/^\s*test\(/, browserSpecs),
  },
  browser_specs: {
    description: 'Files that match e2e/*.spec.ts',
    count: ({ browserSpecs }) => browserSpecs.length,
  },
  layer_inversions: {
    description:
      'Imports from a higher layer in src/atoms, src/context and src/utils',
    count: (sets) =>
      layerImports(sets, 'src/atoms', 'molecules|organisms|pages') +
      layerImports(sets, 'src/context', 'atoms|molecules|organisms|pages') +
      layerImports(
        sets,
        'src/utils',
        'atoms|molecules|organisms|pages|context|workers'
      ),
  },
  development_md_lines: {
    description: 'Lines in DEVELOPMENT.md',
    count: ({ file }) => newlines(file('DEVELOPMENT.md')),
  },
  development_md_bytes: {
    description: 'Bytes in DEVELOPMENT.md',
    count: ({ file }) => sum(file('DEVELOPMENT.md'), ({ bytes }) => bytes),
  },
} as const satisfies Record<string, CountDefinition>;

export type Counts = Record<keyof typeof countDefinitions, number>;

export function countPatterns(files: readonly SourceFile[]): Counts {
  const sets = selectFiles(files);
  return Object.fromEntries(
    Object.entries(countDefinitions).map(([name, { count }]) => [
      name,
      count(sets),
    ])
  ) as Counts;
}

export interface UnitTests {
  /** Vitest writes one test suite per test file. */
  files: number;
  tests: number;
  failures: number;
  errors: number;
  skipped: number;
}

export function summarizeUnitTests(xml: string): UnitTests {
  const { suites, tests, failures, errors, skipped } = summarizeJUnit(xml);
  return { files: suites, tests, failures, errors, skipped };
}

/**
 * How the mutation score counts each mutant status, as Stryker computes it in
 * mutation-testing-metrics. A detected mutant failed a test or timed out. An
 * undetected mutant passed every test or ran in none. The score leaves out the
 * other statuses.
 */
export const scoredStatuses = {
  Killed: 'detected',
  Timeout: 'detected',
  Survived: 'undetected',
  NoCoverage: 'undetected',
  CompileError: null,
  RuntimeError: null,
  Ignored: null,
  Pending: null,
} as const;

/** The part of a Stryker JSON report that the score reads. */
interface MutationReport {
  files: Record<string, { mutants: { status: string }[] }>;
}

export interface MutationScore {
  /**
   * Detected mutants as a percentage of detected and undetected ones, to 2
   * decimals. Null when there are neither.
   */
  score: number | null;
  detected: number;
  undetected: number;
}

export interface Mutation extends MutationScore {
  /** Keyed by the mutated file, relative to the repository root. */
  files: Record<string, MutationScore>;
}

function scoreMutants(mutants: readonly { status: string }[]): MutationScore {
  const counted = mutants.map(({ status }) => {
    if (!Object.hasOwn(scoredStatuses, status)) {
      throw new Error(`Unknown mutant status ${status} in the Stryker report`);
    }
    return scoredStatuses[status as keyof typeof scoredStatuses];
  });
  const detected = counted.filter((kind) => kind === 'detected').length;
  const undetected = counted.filter((kind) => kind === 'undetected').length;
  const scored = detected + undetected;
  return {
    score: scored === 0 ? null : Math.round((detected / scored) * 10000) / 100,
    detected,
    undetected,
  };
}

/** Scores the JSON report of `pnpm test:mutation`, in total and per file. */
export function summarizeMutation(json: string): Mutation {
  const { files } = JSON.parse(json) as MutationReport;
  const entries = Object.entries(files);
  return {
    ...scoreMutants(entries.flatMap(([, { mutants }]) => mutants)),
    files: Object.fromEntries(
      entries.map(([path, { mutants }]) => [path, scoreMutants(mutants)])
    ),
  };
}

export interface StageResult {
  name: string;
  /** The median of the samples, which are in round order. */
  milliseconds: number;
  /** A stage that did not run in a round counts 0 in that round. */
  samples: number[];
  /** True when the stage passed in every round. */
  passed: boolean;
}

const median = (values: readonly number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle]
    : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
};

/**
 * Keeps the median time of each stage and of the whole round. Every round
 * runs all stages, so that a slow period on the machine affects all stages
 * alike.
 */
export function summarizeRounds(rounds: readonly ValidationRun[]) {
  const stages: StageResult[] = validationStages.map(({ name }) => {
    const runs = rounds.map(
      (round) => round.stages.find((stage) => stage.name === name)!
    );
    const samples = runs.map((run) =>
      run.result === 'not run' ? 0 : Math.round(run.milliseconds)
    );
    return {
      name,
      milliseconds: median(samples),
      samples,
      passed: runs.every((run) => run.result === 'passed'),
    };
  });
  const totalMilliseconds = median(
    rounds.map((round) => Math.round(round.milliseconds))
  );
  return { stages, totalMilliseconds };
}

export interface Bundle {
  files: number;
  bytes: number;
}

export interface Metrics {
  /** 2 since stages run at the same time and build-ergogen is a stage. */
  schema: 2;
  commit: string;
  /** True when files differ from the commit, so the counts may too. */
  dirty: boolean;
  counts: Counts;
  /** Null unless test:unit passed in every round. */
  unitTests: UnitTests | null;
  /** The files in dist. Null unless build passed in every round. */
  bundle: Bundle | null;
  /** Null unless pnpm test:mutation wrote its report before this run. */
  mutation: Mutation | null;
  stages: StageResult[];
  /** The median time of a round, in which stages run at the same time. */
  totalMilliseconds: number;
  /** What the stage times depend on. */
  machine: {
    node: string;
    platform: string;
    cpus: number;
    /** GitHub-hosted runners of one label differ in CPU, and so in speed. */
    cpuModel: string;
    /** The one-minute load average before the first stage. */
    loadAverage: number;
  };
}

const formatSeconds = (milliseconds: number) =>
  (milliseconds / 1000).toFixed(1);

const formatMutation = ({ score, detected, undetected }: Mutation) =>
  `${score === null ? 'none' : `${score}%`}, ${undetected} of ${detected + undetected} mutants undetected`;

export function renderTable(metrics: Metrics): string {
  const state = metrics.dirty ? ' with uncommitted changes' : '';
  const lines = [
    `## Metrics for ${metrics.commit.slice(0, 12)}${state}`,
    '',
    '| Stage | Seconds | Rounds | Result |',
    '| ----- | ------: | ------ | ------ |',
    ...metrics.stages.map(
      ({ name, milliseconds, samples, passed }) =>
        `| ${name} | ${formatSeconds(milliseconds)} | ${samples.map(formatSeconds).join(', ')} | ${passed ? 'passed' : 'FAILED'} |`
    ),
    `| Total | ${formatSeconds(metrics.totalMilliseconds)} | | |`,
    '',
    '| Measure | Value |',
    '| ------- | ----: |',
    `| Unit tests | ${metrics.unitTests ? `${metrics.unitTests.tests} in ${metrics.unitTests.files} files` : 'not recorded'} |`,
    `| Bundle bytes | ${metrics.bundle ? `${metrics.bundle.bytes} in ${metrics.bundle.files} files` : 'not recorded'} |`,
    `| Mutation score | ${metrics.mutation ? formatMutation(metrics.mutation) : 'not recorded'} |`,
    ...Object.entries(countDefinitions).map(
      ([name, { description }]) =>
        `| ${description} (\`${name}\`) | ${metrics.counts[name as keyof Counts]} |`
    ),
  ];
  return lines.join('\n') + '\n';
}

const git = (...args: string[]) =>
  execFileSync('git', args, { encoding: 'utf8' });

/** Reads tracked and untracked files that Git does not ignore. */
export function readSourceFiles(): SourceFile[] {
  const listed = git(
    'ls-files',
    '-z',
    '--cached',
    '--others',
    '--exclude-standard',
    '--',
    ...scannedPaths
  );
  const paths = [...new Set(listed.split('\0').filter(Boolean))].sort();
  return paths
    .filter((path) => lstatSync(path, { throwIfNoEntry: false })?.isFile())
    .map((path) => {
      const content = readFileSync(path);
      return { path, text: content.toString('utf8'), bytes: content.length };
    });
}

function measureBundle(): Bundle {
  const entries = readdirSync(bundleDirectory, {
    recursive: true,
    withFileTypes: true,
  }).filter((entry) => entry.isFile());
  return {
    files: entries.length,
    bytes: sum(
      entries,
      (entry) => lstatSync(join(entry.parentPath, entry.name)).size
    ),
  };
}

function parseRounds(argv: string[]): number {
  const { values } = parseArgs({
    args: argv,
    options: { repeat: { type: 'string', default: '1' } },
  });
  const rounds = Number(values.repeat);
  if (!Number.isInteger(rounds) || rounds < 1) {
    throw new Error(
      `--repeat must be a positive integer, got ${values.repeat}`
    );
  }
  return rounds;
}

async function main() {
  const rounds = parseRounds(process.argv.slice(2));
  const commit = git('rev-parse', 'HEAD').trim();
  const dirty = git('status', '--porcelain').trim() !== '';
  const counts = countPatterns(readSourceFiles());
  const loadAverage = Number(loadavg()[0].toFixed(2));
  const runs: ValidationRun[] = [];
  for (let round = 1; round <= rounds; round++) {
    process.stderr.write(`\n[metrics] Round ${round} of ${rounds}\n`);
    const run = await runStages(validationStages);
    if (run.stopped) {
      process.exitCode = 1;
      return;
    }
    runs.push(run);
  }
  const { stages, totalMilliseconds } = summarizeRounds(runs);
  const passed = (name: string) =>
    stages.find((stage) => stage.name === name)?.passed === true;
  const metrics: Metrics = {
    schema: 2,
    commit,
    dirty,
    counts,
    unitTests:
      passed('test:unit') && existsSync(unitReportPath)
        ? summarizeUnitTests(readFileSync(unitReportPath, 'utf8'))
        : null,
    bundle: passed('build') ? measureBundle() : null,
    mutation: existsSync(mutationReportPath)
      ? summarizeMutation(readFileSync(mutationReportPath, 'utf8'))
      : null,
    stages,
    totalMilliseconds,
    machine: {
      node: process.version,
      platform: process.platform,
      cpus: availableParallelism(),
      cpuModel: cpus()[0]?.model ?? 'unknown',
      loadAverage,
    },
  };
  mkdirSync(dirname(metricsPath), { recursive: true });
  writeFileSync(`${metricsPath}.tmp`, JSON.stringify(metrics, null, 2) + '\n');
  renameSync(`${metricsPath}.tmp`, metricsPath);
  const table = renderTable(metrics);
  process.stdout.write(`\n${table}\nWrote ${metricsPath}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, table);
  }
  process.exitCode = stages.every((stage) => stage.passed) ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
