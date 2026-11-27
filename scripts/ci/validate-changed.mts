// Runs the stages of `pnpm validate:fast` on the files that differ from
// origin/main, for a faster answer while you work:
//
//   node scripts/ci/validate-changed.mts
//
// The changed files are the files of the working tree that differ from the
// merge base of HEAD and origin/main. They hold the commits since the merge
// base, the staged and unstaged changes, and the untracked files that Git does
// not ignore. A renamed file counts as a deleted file and an added file. The
// command compares with the local origin/main and fails with exit status 2
// when origin/main or the merge base is missing. When no file changed, it says
// so and passes.
//
// scripts/ci/validate.mts runs the stages. They have the names and the order
// of the stages of `pnpm validate:fast`, and each step of `pnpm typecheck` is
// a stage of its own:
//
// - build-ergogen runs as in `pnpm validate:fast`.
// - format:check runs Prettier on the changed files that exist.
// - lint runs ESLint on the changed files that exist, and the other steps of
//   `pnpm lint` on the whole repository.
// - The three steps of `pnpm typecheck` always run in full, because a change
//   in one file can break the types of every file that uses it. They run as
//   three stages at the same time: typecheck checks tsconfig.json, and
//   typecheck:tooling and typecheck:declarations run those scripts.
// - test:unit runs `vitest related` on the changed files, which runs the test
//   files that import them, directly or through other modules.
//
// A stage runs in full when a changed file can change its result for files
// that did not change. `fullRunTriggers` lists these files for each tool,
// from what the tool reads for every file it checks. vitest related follows
// only imports, and a test can also read a file, list the files that Git
// lists, or run a script. So test:unit also runs in full when a file was
// deleted, because no import leads to a file that is gone, and when a changed
// file is neither a TypeScript module in src/ nor a test file.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { matchesGlob } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  passed,
  runStages,
  validationStages,
  type Stage,
} from './validate.mts';

export interface ChangedFile {
  /** From the root of the repository, with forward slashes. */
  path: string;
  status: 'added' | 'modified' | 'deleted';
}

/** origin/main or the merge base is missing, so nothing can be compared. */
export class ComparisonError extends Error {}

/** The merge base with origin/main and the files that differ from it. */
export function listChanges(directory: string): {
  base: string;
  changes: ChangedFile[];
} {
  const git = (...args: string[]) =>
    execFileSync('git', args, {
      cwd: directory,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  try {
    git('rev-parse', '--verify', '--quiet', 'origin/main^{commit}');
  } catch {
    throw new ComparisonError(
      'origin/main does not exist in this clone, so there is nothing to compare with. Run `git fetch origin main`, or run `pnpm validate:fast`.'
    );
  }
  let base: string;
  try {
    base = git('merge-base', 'HEAD', 'origin/main').trim();
  } catch {
    throw new ComparisonError(
      'HEAD and origin/main have no merge base, so there is nothing to compare with. Run `pnpm validate:fast`.'
    );
  }

  const changes = new Map<string, ChangedFile['status']>();
  // Without a second commit, git diff compares the commit with the working
  // tree, so it holds the commits, the staged and the unstaged changes.
  const diff = git('diff', '--name-status', '--no-renames', '-z', base)
    .split('\0')
    .filter((field) => field !== '');
  for (let index = 0; index < diff.length; index += 2) {
    const [status, path] = [diff[index], diff[index + 1]];
    changes.set(
      path,
      status === 'A' ? 'added' : status === 'D' ? 'deleted' : 'modified'
    );
  }
  const untracked = git('ls-files', '--others', '--exclude-standard', '-z')
    .split('\0')
    .filter((path) => path !== '');
  // A file removed from the index but still on disk is both deleted and
  // untracked. It exists, so the checks read it.
  for (const path of untracked) {
    changes.set(path, changes.has(path) ? 'modified' : 'added');
  }

  return {
    base,
    changes: [...changes]
      .map(([path, status]) => ({ path, status }))
      .sort((a, b) => (a.path < b.path ? -1 : 1)),
  };
}

/** A changed file that makes a stage run in full, and why. */
interface Trigger {
  /** Matched against the path with `path.matchesGlob`. */
  pattern: string;
  because: string;
}

// pnpm reads these files to choose the version of each tool and of every
// package that the tools load. Prettier also reads the "prettier" key of a
// package.json in the folder of a file or above it.
const packageFiles: readonly Trigger[] = [
  {
    pattern: '**/package.json',
    because: 'it sets the version and the settings of the tools',
  },
  ...['pnpm-lock.yaml', 'pnpm-workspace.yaml', '.npmrc'].map((pattern) => ({
    pattern,
    because: 'pnpm reads it to install the tools',
  })),
];

const fullRunTriggers = {
  'format:check': [
    ...packageFiles,
    ...['**/.prettierrc*', '**/prettier.config.*', '**/.editorconfig'].map(
      (pattern) => ({
        pattern,
        because:
          'Prettier reads it for every file in its folder and the folders below',
      })
    ),
    ...['.prettierignore', '.gitignore'].map((pattern) => ({
      pattern,
      because: 'Prettier reads it to choose the files it checks',
    })),
  ],
  // ESLint 9 reads no ignore file. Its ignores are in eslint.config.mjs.
  lint: [
    ...packageFiles,
    {
      pattern: 'eslint.config.*',
      because: 'ESLint reads it for every file',
    },
  ],
  'test:unit': [
    ...packageFiles,
    {
      pattern: 'vitest.config.*',
      because: 'Vitest reads it for every test',
    },
    {
      pattern: 'src/setupTests.tsx',
      because: 'every test runs it first',
    },
  ],
} satisfies Record<string, readonly Trigger[]>;

/** The `include` of vitest.config.mts: the files that Vitest runs. */
export const testFilePatterns = [
  'src/**/*.test.{ts,tsx}',
  'tests/**/*.test.ts',
  'scripts/**/*.test.mjs',
];

export interface Plan {
  /** In the order of `pnpm validate:fast`. */
  stages: Stage[];
  /** What each stage of `pnpm validate:fast` checks in this run, and why. */
  lines: string[];
}

const validationStage = (name: string) =>
  validationStages.find((stage) => stage.name === name)!;

const changedFiles = (count: number) =>
  count === 1 ? '1 changed file' : `${count} changed files`;

/** A path that no tool reads as an option. */
const argument = (path: string) => `./${path}`;

/**
 * The command that runs the steps of `pnpm lint`, with ESLint on the files
 * only. Without a file, ESLint does not run.
 */
function lintCommand(lintScript: string, files: readonly string[]): string[] {
  const steps = lintScript.split(' && ');
  if (!steps.includes('pnpm lint:js')) {
    throw new Error(
      `pnpm lint must run "pnpm lint:js" as one of its steps, not "${lintScript}".`
    );
  }
  // The flags of `pnpm lint:js`. --no-warn-ignored skips a file that ESLint
  // ignores or has no configuration for, as `eslint .` does.
  const eslint = 'pnpm exec eslint --max-warnings 0 --no-warn-ignored "$@"';
  const script = steps
    .flatMap((step) =>
      step !== 'pnpm lint:js' ? [step] : files.length > 0 ? [eslint] : []
    )
    .join(' && ');
  return ['sh', '-c', script, 'sh', ...files.map(argument)];
}

/**
 * The stages that check these changes. The lint stage reads the steps of
 * `pnpm lint` from `scripts`, the scripts of package.json.
 */
export function planStages(
  changes: readonly ChangedFile[],
  scripts: Readonly<Record<string, string>>
): Plan {
  const plan: Plan = { stages: [validationStage('build-ergogen')], lines: [] };
  const runInFull = (name: string, reason: string) => {
    plan.stages.push(validationStage(name));
    plan.lines.push(`${name} runs in full: ${reason}.`);
  };
  const runOnChanges = (name: string, command: string[], line: string) => {
    plan.stages.push({ ...validationStage(name), command });
    plan.lines.push(line);
  };
  const triggered = (triggers: readonly Trigger[]) => {
    for (const { path } of changes) {
      const trigger = triggers.find(({ pattern }) =>
        matchesGlob(path, pattern)
      );
      if (trigger) return `${path} changed, and ${trigger.because}`;
    }
    return undefined;
  };
  const present = changes
    .filter(({ status }) => status !== 'deleted')
    .map(({ path }) => path);

  const format = triggered(fullRunTriggers['format:check']);
  if (format) runInFull('format:check', format);
  else if (present.length === 0) {
    plan.lines.push('format:check does not run: every changed file is gone.');
  } else {
    // The flags of `pnpm format:check`. --ignore-unknown skips a file that
    // Prettier cannot parse, as `prettier --check .` does.
    runOnChanges(
      'format:check',
      [
        ...['pnpm', 'exec', 'prettier', '--check', '--ignore-unknown'],
        ...present.map(argument),
      ],
      `format:check runs Prettier on ${changedFiles(present.length)}.`
    );
  }

  const lint = triggered(fullRunTriggers.lint);
  if (lint) runInFull('lint', lint);
  else {
    runOnChanges(
      'lint',
      lintCommand(scripts.lint, present),
      present.length > 0
        ? `lint runs ESLint on ${changedFiles(present.length)} and the other steps of pnpm lint in full.`
        : 'lint runs the steps of pnpm lint other than ESLint in full: every changed file is gone.'
    );
  }

  // Each step of `pnpm typecheck` takes one core. As one stage, they run one
  // after another and take longer than every other stage.
  plan.stages.push(
    {
      name: 'typecheck',
      command: ['pnpm', 'exec', 'tsc', '--project', 'tsconfig.json'],
      after: [],
    },
    ...['typecheck:tooling', 'typecheck:declarations'].map((name) => ({
      name,
      command: ['pnpm', 'run', name],
      after: [],
    }))
  );
  plan.lines.push(
    'typecheck, typecheck:tooling and typecheck:declarations run the steps of pnpm typecheck in full: a change in one file can break the types of every file that uses it.'
  );

  const deleted = changes.find(({ status }) => status === 'deleted');
  const untraced = present.find(
    (path) =>
      !matchesGlob(path, 'src/**/*.{ts,tsx}') &&
      !testFilePatterns.some((pattern) => matchesGlob(path, pattern))
  );
  const tests = triggered(fullRunTriggers['test:unit']);
  if (tests) runInFull('test:unit', tests);
  else if (deleted) {
    runInFull(
      'test:unit',
      `${deleted.path} is gone, and vitest related cannot find the tests that imported it`
    );
  } else if (untraced) {
    runInFull(
      'test:unit',
      `${untraced} is neither a TypeScript module in src/ nor a test file, and a test can read a file or run a script without importing it, which vitest related does not follow`
    );
  } else {
    // --reporter=default leaves the JUnit report of the last full run in
    // place.
    runOnChanges(
      'test:unit',
      [
        ...['pnpm', 'exec', 'vitest', 'related', '--run', '--passWithNoTests'],
        '--reporter=default',
        ...present.map(argument),
      ],
      `test:unit runs the tests that import ${changedFiles(present.length)}.`
    );
  }

  return plan;
}

async function main() {
  const print = (text: string) =>
    process.stdout.write(`[validate:changed] ${text}\n`);
  let comparison: ReturnType<typeof listChanges>;
  try {
    comparison = listChanges(process.cwd());
  } catch (error) {
    if (!(error instanceof ComparisonError)) throw error;
    process.stderr.write(`[validate:changed] ${error.message}\n`);
    process.exitCode = 2;
    return;
  }
  const { base, changes } = comparison;
  const since = `the merge base ${base.slice(0, 12)} with origin/main`;
  if (changes.length === 0) {
    print(`No file differs from ${since}, so there is nothing to check.`);
    return;
  }

  print(`${changedFiles(changes.length)} since ${since}:`);
  changes.forEach(({ path, status }) => print(`  ${status} ${path}`));
  const { scripts } = JSON.parse(readFileSync('package.json', 'utf8')) as {
    scripts: Record<string, string>;
  };
  const plan = planStages(changes, scripts);
  plan.lines.forEach(print);
  print('A pass here does not replace pnpm precommit before a commit.');
  const run = await runStages(plan.stages);
  process.exitCode = passed(run) ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
