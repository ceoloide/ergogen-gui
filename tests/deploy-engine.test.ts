// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  lsRemote,
  parseEngineRequest,
  resolveEngine,
  verifyEngine,
} from '../scripts/ci/deploy-engine.mts';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(projectRoot, 'scripts', 'ci', 'deploy-engine.mts');
const canonical = (
  JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8')) as {
    dependencies: Record<string, string>;
  }
).dependencies.ergogen;
const lockedCommit = 'a'.repeat(40);
const freshCommit = 'b'.repeat(40);

/** The root importer of a pnpm lockfile with one ergogen entry. */
const lockfile = (specifier: string, version: string) =>
  [
    "lockfileVersion: '9.0'",
    '',
    'importers:',
    '',
    '  .:',
    '    dependencies:',
    '      ergogen:',
    `        specifier: ${specifier}`,
    `        version: ${version}`,
    '',
  ].join('\n');
const tarball = (commit: string, source = 'ceoloide/ergogen') =>
  `https://codeload.github.com/${source}/tar.gz/${commit}`;

describe('parseEngineRequest', () => {
  it.each([
    'github:ceoloide/ergogen#v4.3.0',
    'github:ergogen/ergogen#feature/new-outlines',
    'github:ergogen/ergogen#_staging',
    'github:ergogen/ergogen#engine+preview',
    `github:ceoloide/ergogen#${lockedCommit}`,
  ])('accepts %s', (value) => {
    // Act and assert
    expect(() => parseEngineRequest(value)).not.toThrow();
  });

  it.each([
    'ergogen@4.2.0',
    '4.2.0',
    'ceoloide/ergogen#v4.3.0',
    'github:ceoloide/ergogen',
    'github:ceoloide/ergogen#',
    'github:ceoloide/ergogen#main..dev',
    'github:ceoloide/ergogen#preview*',
    'github:ceoloide/ergogen#main\n::warning::x',
    'github:../ergogen#main',
    'github:ceoloide/..#main',
    'git+https://example.com/ergogen.git#main',
  ])('rejects %j', (value) => {
    // Act and assert
    expect(() => parseEngineRequest(value)).toThrow(
      'github:<owner>/<repo>#<branch, tag or full commit SHA>'
    );
  });
});

describe('resolveEngine', () => {
  it('keeps the canonical install when nothing is configured', () => {
    // Arrange
    const readRefs = vi.fn();

    // Act
    const result = resolveEngine('  ', readRefs);

    // Assert
    expect(result.specifier).toBe('');
    expect(readRefs).not.toHaveBeenCalled();
  });

  it.each([freshCommit, freshCommit.toUpperCase()])(
    'normalizes the commit %s without a lookup',
    (commit) => {
      // Arrange
      const readRefs = vi.fn();
      const value = `github:ceoloide/ergogen#${commit}`;

      // Act
      const result = resolveEngine(value, readRefs);

      // Assert
      expect(result.specifier).toBe(`github:ceoloide/ergogen#${freshCommit}`);
      expect(readRefs).not.toHaveBeenCalled();
    }
  );

  it('resolves the manifest branch afresh instead of reusing its locked commit', () => {
    // Arrange: the lockfile pins lockedCommit; the branch has moved since.
    const readRefs = vi.fn(
      () => `${freshCommit}\trefs/heads/${canonical.split('#')[1]}\n`
    );

    // Act
    const result = resolveEngine(canonical, readRefs);

    // Assert
    expect(readRefs).toHaveBeenCalledWith(
      `https://github.com/${canonical.slice('github:'.length).split('#')[0]}.git`,
      canonical.split('#')[1]
    );
    expect(result.specifier).toBe(`${canonical.split('#')[0]}#${freshCommit}`);
    expect(result.summary).toContain(freshCommit);
  });
});

describe('lsRemote and resolveEngine against a real repository', () => {
  let workspace: string;
  let repository: string;
  const env = { ...process.env };
  const git = (...args: string[]) => {
    // A Git hook exports the index of the repository being committed, which
    // would otherwise replace the fixture repository's own index.
    const fixtureEnv = { ...process.env };
    delete fixtureEnv.GIT_INDEX_FILE;
    const result = spawnSync('git', args, {
      cwd: repository,
      encoding: 'utf8',
      env: fixtureEnv,
    });
    if (result.status !== 0) throw new Error(result.stderr);
    return result.stdout.trim();
  };
  const commit = (message: string) => {
    git(
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.invalid',
      'commit',
      '-q',
      '--allow-empty',
      '-m',
      message
    );
    return git('rev-parse', 'HEAD');
  };
  const resolveLocal = (ref: string) =>
    resolveEngine(`github:fixture/ergogen#${ref}`, (_url, name) =>
      lsRemote(repository, name)
    );

  beforeAll(() => {
    workspace = mkdtempSync(join(tmpdir(), 'deploy-engine-'));
    repository = join(workspace, 'ergogen');
    process.env.GIT_CONFIG_GLOBAL = join(workspace, 'gitconfig');
    process.env.GIT_CONFIG_NOSYSTEM = '1';
    spawnSync('git', ['init', '-q', repository]);
  });
  afterAll(() => {
    process.env = env;
    rmSync(workspace, { recursive: true, force: true });
  });

  it('resolves branches, annotated tags and lightweight tags to commits', () => {
    // Arrange
    const tagged = commit('release');
    git(
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.invalid',
      'tag',
      '-a',
      'v1.0.0',
      '-m',
      'release'
    );
    git('tag', 'light');
    const head = commit('later');
    git('branch', 'v4.3.0');
    const unicodeRef = 'feature\u00a0one\u2028two';
    git('branch', unicodeRef);

    // Act and assert
    expect(resolveLocal('v4.3.0').specifier).toBe(
      `github:fixture/ergogen#${head}`
    );
    expect(resolveLocal(unicodeRef).specifier).toBe(
      `github:fixture/ergogen#${head}`
    );
    expect(resolveLocal('v1.0.0').specifier).toBe(
      `github:fixture/ergogen#${tagged}`
    );
    expect(resolveLocal('light').specifier).toBe(
      `github:fixture/ergogen#${tagged}`
    );
  });

  it('rejects a missing ref and one that is both a branch and a tag', () => {
    // Arrange
    git('branch', 'both');
    git('tag', 'both');

    // Act and assert
    expect(() => resolveLocal('missing')).toThrow(
      "No branch or tag named 'missing'"
    );
    expect(() => resolveLocal('both')).toThrow('both a branch and a tag');
  });
});

describe('verifyEngine', () => {
  const pinned = `github:ceoloide/ergogen#${freshCommit}`;

  it('reports the commit pnpm installed for the pinned specifier', () => {
    // Act
    const summary = verifyEngine(
      lockfile(pinned, tarball(freshCommit)),
      pinned,
      '4.3.0'
    );

    // Assert
    expect(summary).toContain(`at commit \`${freshCommit}\``);
  });

  it('reports the locked commit for the canonical specifier', () => {
    // Act
    const summary = verifyEngine(
      lockfile(canonical, tarball(lockedCommit)),
      canonical,
      '4.3.0'
    );

    // Assert
    expect(summary).toContain(lockedCommit);
  });

  it('fails when the canonical lock was reused instead of the pinned commit', () => {
    // Act and assert
    expect(() =>
      verifyEngine(lockfile(canonical, tarball(lockedCommit)), pinned, '4.3.0')
    ).toThrow(`expected '${pinned}'`);
  });

  it('reports a frozen npm install without a GitHub commit', () => {
    expect(
      verifyEngine(lockfile('^4.2.0', '4.2.1'), '^4.2.0', '4.2.1')
    ).toContain('Installed Ergogen 4.2.1');
  });

  it('fails when another commit or repository was installed', () => {
    // Act and assert
    expect(() =>
      verifyEngine(lockfile(pinned, tarball(lockedCommit)), pinned, '4.3.0')
    ).toThrow(`at ${lockedCommit}`);
    expect(() =>
      verifyEngine(
        lockfile(pinned, tarball(freshCommit, 'someone/ergogen')),
        pinned,
        '4.3.0'
      )
    ).toThrow('from someone/ergogen');
  });
});

describe('deploy-engine.mts command', () => {
  const run = (configured: string) => {
    const folder = mkdtempSync(join(tmpdir(), 'deploy-engine-cli-'));
    const output = join(folder, 'output');
    const environment = join(folder, 'environment');
    const summary = join(folder, 'summary');
    writeFileSync(output, '');
    writeFileSync(environment, '');
    writeFileSync(summary, '');
    const result = spawnSync('node', [script, 'resolve'], {
      env: {
        PATH: process.env.PATH,
        CONFIGURED_ERGOGEN_VERSION: configured,
        GITHUB_OUTPUT: output,
        GITHUB_ENV: environment,
        GITHUB_STEP_SUMMARY: summary,
      },
      encoding: 'utf8',
    });
    const files = {
      output: readFileSync(output, 'utf8'),
      environment: readFileSync(environment, 'utf8'),
      summary: readFileSync(summary, 'utf8'),
    };
    rmSync(folder, { recursive: true, force: true });
    return { ...result, ...files };
  };

  it('writes an empty specifier and a summary when nothing is configured', () => {
    // Act
    const result = run('');

    // Assert
    expect(result.status, result.stderr).toBe(0);
    expect(result.output).toBe('specifier=\n');
    expect(result.environment).toBe('');
    expect(result.summary).toContain('canonical');
  });

  it('sets the Vite engine identity to the selected commit', () => {
    const pinned = `github:ceoloide/ergogen#${freshCommit}`;
    const result = run(pinned);
    expect(result.environment).toBe(`VITE_ERGOGEN_VERSION=${pinned}\n`);
  });

  it('fails with one escaped annotation for an invalid value', () => {
    // Act
    const result = run('main\n::warning::injected');

    // Assert
    expect(result.status).toBe(1);
    expect(result.output).toBe('');
    expect(result.stderr.trim().split('\n')).toEqual([
      expect.stringMatching(/^::error::.*"main\\n::warning::injected"\.$/),
    ]);
  });
});
