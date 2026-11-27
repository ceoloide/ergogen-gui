// @vitest-environment node
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { JourneyResult } from '../scripts/verify/proof.mts';
import {
  type Context,
  main,
  type RunPlaywright,
} from '../scripts/verify/verify.mts';

/** A repository with one commit and a journey file for each feature. */
function fakeRepository(features: string[]) {
  const root = mkdtempSync(join(tmpdir(), 'verify-test-'));
  const git = (...args: string[]) =>
    execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  git('init', '--quiet');
  writeFileSync(join(root, '.node-version'), `${process.versions.node}\n`);
  writeFileSync(join(root, '.gitignore'), 'reports/\n');
  mkdirSync(join(root, 'e2e', 'journeys'), { recursive: true });
  writeFileSync(join(root, 'e2e', 'journeys', 'journey.ts'), '');
  for (const feature of features) {
    writeFileSync(join(root, 'e2e', 'journeys', `${feature}.journey.ts`), '');
  }
  git('add', '.');
  git(
    '-c',
    'user.name=Test',
    '-c',
    'user.email=test@example.com',
    'commit',
    '--quiet',
    '-m',
    'journeys'
  );
  return { root, commit: git('rev-parse', 'HEAD') };
}

const proofFolder = (root: string, feature: string) =>
  join(root, 'reports', 'verify', feature);

const readProof = (root: string, feature: string): JourneyResult =>
  JSON.parse(
    readFileSync(join(proofFolder(root, feature), 'result.json'), 'utf8')
  );

/** A result that a journey writes, with only the fields that the tests read. */
function writeJourneyResult(
  root: string,
  feature: string,
  status: 'passed' | 'failed'
) {
  mkdirSync(proofFolder(root, feature), { recursive: true });
  writeFileSync(
    join(proofFolder(root, feature), 'result.json'),
    JSON.stringify({ feature, status })
  );
}

describe('pnpm verify', () => {
  let root: string;
  let commit: string;
  let printed: string[];
  let runs: Parameters<RunPlaywright>[0][];
  let errors: string[];

  // A context whose Playwright runs `journeys` and exits with `status`.
  const context = (
    status: number,
    journeys: (env: Record<string, string>) => void = () => {}
  ): Context => ({
    root,
    print: (line) => printed.push(line),
    runPlaywright: async (options) => {
      runs.push(options);
      mkdirSync(options.env.VERIFY_BUILD_DIR, { recursive: true });
      journeys(options.env);
      return status;
    },
  });

  beforeEach(() => {
    ({ root, commit } = fakeRepository(['generate', 'share']));
    printed = [];
    runs = [];
    errors = [];
    vi.spyOn(console, 'error').mockImplementation((line: string) => {
      errors.push(line);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(root, { recursive: true, force: true });
  });

  it('lists the features that have a journey', async () => {
    // Act
    const status = await main(['--list'], context(0));

    // Assert
    expect(status).toBe(0);
    expect(printed).toEqual(['generate', 'share']);
    expect(runs).toHaveLength(0);
  });

  it('exits with 2 for a feature without a journey and runs nothing', async () => {
    // Act
    const status = await main(['generate', 'export'], context(0));

    // Assert
    expect(status).toBe(2);
    expect(errors.join('\n')).toContain(
      'No journey for export. The features are: generate, share.'
    );
    expect(runs).toHaveLength(0);
  });

  it('runs the chosen journey with a new build and removes the build after', async () => {
    // Arrange: proof of an earlier run, which the new run must replace
    writeJourneyResult(root, 'generate', 'failed');
    writeFileSync(join(proofFolder(root, 'generate'), 'old.png'), '');
    let oldProofDuringRun = true;

    // Act
    const status = await main(
      ['generate'],
      context(0, () => {
        oldProofDuringRun = existsSync(proofFolder(root, 'generate'));
        writeJourneyResult(root, 'generate', 'passed');
      })
    );

    // Assert
    expect(status).toBe(0);
    expect(oldProofDuringRun).toBe(false);
    const [{ env, log }] = runs;
    expect(env.VERIFY_FEATURES).toBe('generate');
    expect(env.VERIFY_BUILD_DIR).toContain(env.VERIFY_BUILD_ID);
    expect(existsSync(env.VERIFY_BUILD_DIR)).toBe(false);
    expect(log).toBe(join(root, 'reports', 'verify', 'playwright.log'));
    expect(readProof(root, 'generate').status).toBe('passed');
    expect(printed).toEqual([
      'generate: passed. Proof in reports/verify/generate/.',
    ]);
  });

  it('runs every journey without a feature', async () => {
    // Act
    const status = await main(
      [],
      context(0, () => {
        writeJourneyResult(root, 'generate', 'passed');
        writeJourneyResult(root, 'share', 'passed');
      })
    );

    // Assert
    expect(status).toBe(0);
    expect(runs[0].env.VERIFY_FEATURES).toBe('generate,share');
  });

  it('exits with 1 when a journey failed', async () => {
    // Act
    const status = await main(
      [],
      context(1, () => {
        writeJourneyResult(root, 'generate', 'passed');
        writeJourneyResult(root, 'share', 'failed');
      })
    );

    // Assert
    expect(status).toBe(1);
    expect(printed).toEqual([
      'generate: passed. Proof in reports/verify/generate/.',
      'share: failed. Proof in reports/verify/share/.',
    ]);
  });

  it('writes a failed result for a journey that wrote none, as after a failed build', async () => {
    // Act
    const status = await main(['generate'], context(1));

    // Assert
    expect(status).toBe(1);
    const result = readProof(root, 'generate');
    expect(result).toMatchObject({
      feature: 'generate',
      status: 'failed',
      commit,
      dirty: false,
      buildId: runs[0].env.VERIFY_BUILD_ID,
      steps: [],
    });
    expect(result.error).toBe(
      'The journey wrote no result. Playwright exited with status 1. Read reports/verify/playwright.log, which can show a failed build.'
    );
    expect(existsSync(runs[0].env.VERIFY_BUILD_DIR)).toBe(false);
  });

  it('exits with 1 when Playwright failed although every journey passed', async () => {
    // Act
    const status = await main(
      ['generate'],
      context(1, () => writeJourneyResult(root, 'generate', 'passed'))
    );

    // Assert
    expect(status).toBe(1);
    expect(printed.at(-1)).toBe(
      'Every journey passed, but Playwright exited with status 1. Read reports/verify/playwright.log.'
    );
  });

  it('removes the build when Playwright cannot start', async () => {
    // Arrange
    const runPlaywright: RunPlaywright = async (options) => {
      runs.push(options);
      mkdirSync(options.env.VERIFY_BUILD_DIR, { recursive: true });
      throw new Error('spawn pnpm ENOENT');
    };

    // Act
    const run = main(['generate'], { ...context(0), runPlaywright });

    // Assert
    await expect(run).rejects.toThrow('spawn pnpm ENOENT');
    expect(existsSync(runs[0].env.VERIFY_BUILD_DIR)).toBe(false);
  });

  it('fails the doctor when Node.js differs from .node-version', async () => {
    // Arrange
    writeFileSync(join(root, '.node-version'), '0.0.1\n');

    // Act
    const status = await main(['--doctor'], context(0));

    // Assert
    expect(status).toBe(1);
    expect(printed).toContain(
      `fail Node.js ${process.versions.node}, and .node-version pins 0.0.1.`
    );
    expect(printed).toContain('ok   Journeys: generate, share.');
    expect(runs).toHaveLength(0);
  });

  it('exits with 2 for a feature after --list', async () => {
    // Act
    const status = await main(['--list', 'generate'], context(0));

    // Assert
    expect(status).toBe(2);
    expect(runs).toHaveLength(0);
  });
});
