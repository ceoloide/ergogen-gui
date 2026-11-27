// @vitest-environment node
import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import vitestConfig from '../vitest.config.mts';
import {
  ComparisonError,
  listChanges,
  planStages,
  testFilePatterns,
  type ChangedFile,
} from '../scripts/ci/validate-changed.mts';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(projectRoot, 'scripts/ci/validate-changed.mts');
const { scripts } = JSON.parse(
  readFileSync(join(projectRoot, 'package.json'), 'utf8')
) as { scripts: Record<string, string> };

let repository: string;
let environment: NodeJS.ProcessEnv;

beforeEach(() => {
  repository = mkdtempSync(join(tmpdir(), 'validate-changed-'));
  const home = mkdtempSync(join(tmpdir(), 'validate-changed-home-'));
  environment = {
    PATH: process.env.PATH,
    HOME: home,
    LANG: 'C',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: join(home, '.gitconfig'),
    GIT_AUTHOR_NAME: 'Test',
    GIT_AUTHOR_EMAIL: 'test@example.com',
    GIT_COMMITTER_NAME: 'Test',
    GIT_COMMITTER_EMAIL: 'test@example.com',
  };
  git('init', '-q', '-b', 'work');
});

afterEach(() => {
  rmSync(repository, { recursive: true, force: true });
  rmSync(environment.HOME!, { recursive: true, force: true });
});

function git(...args: string[]) {
  const result = spawnSync('git', args, {
    cwd: repository,
    env: environment,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
  }
  return result.stdout.trim();
}

const write = (path: string, text = `${path}\n`) => {
  mkdirSync(dirname(join(repository, path)), { recursive: true });
  writeFileSync(join(repository, path), text);
};

const commit = (message: string) => {
  git('add', '--all');
  git('commit', '-q', '--allow-empty', '-m', message);
};

/** Commits the files and makes the commit origin/main, as a fetch would. */
const publishMain = (...paths: string[]) => {
  paths.forEach((path) => write(path));
  commit('main');
  git('update-ref', 'refs/remotes/origin/main', 'HEAD');
};

const runCommand = () =>
  spawnSync(process.execPath, [script], {
    cwd: repository,
    env: environment,
    encoding: 'utf8',
  });

describe('listChanges', () => {
  it('holds the commits since the merge base, the staged, unstaged and untracked changes', () => {
    // Arrange
    publishMain(
      'src/committed.ts',
      'src/staged.ts',
      'src/unstaged.ts',
      'src/deleted.ts',
      'src/old name.ts',
      'src/same.ts'
    );
    write('src/committed.ts', 'changed\n');
    commit('work');
    write('src/staged.ts', 'changed\n');
    write('src/new and staged.ts');
    git('add', 'src/staged.ts', 'src/new and staged.ts');
    write('src/unstaged.ts', 'changed\n');
    write('src/untracked.ts');
    unlinkSync(join(repository, 'src/deleted.ts'));
    git('mv', 'src/old name.ts', 'src/new name.ts');
    write('.gitignore', 'ignored.ts\n');
    write('ignored.ts');

    // Act
    const { changes } = listChanges(repository);

    // Assert
    expect(changes).toEqual([
      { path: '.gitignore', status: 'added' },
      { path: 'src/committed.ts', status: 'modified' },
      { path: 'src/deleted.ts', status: 'deleted' },
      { path: 'src/new and staged.ts', status: 'added' },
      { path: 'src/new name.ts', status: 'added' },
      { path: 'src/old name.ts', status: 'deleted' },
      { path: 'src/staged.ts', status: 'modified' },
      { path: 'src/unstaged.ts', status: 'modified' },
      { path: 'src/untracked.ts', status: 'added' },
    ]);
  });

  it('leaves out the commits of origin/main after the merge base', () => {
    // Arrange: origin/main moved on after the work branched from it.
    publishMain('src/base.ts');
    write('src/work.ts');
    commit('work');
    git('checkout', '-q', '-b', 'later', 'origin/main');
    write('src/on main later.ts');
    commit('later main');
    git('update-ref', 'refs/remotes/origin/main', 'HEAD');
    git('checkout', '-q', 'work');

    // Act
    const { changes } = listChanges(repository);

    // Assert
    expect(changes).toEqual([{ path: 'src/work.ts', status: 'added' }]);
  });

  it('counts a file removed from the index but kept on disk as one that exists', () => {
    // Arrange
    publishMain('src/kept.ts');
    git('rm', '-q', '--cached', 'src/kept.ts');

    // Act
    const { changes } = listChanges(repository);

    // Assert
    expect(changes).toEqual([{ path: 'src/kept.ts', status: 'modified' }]);
  });

  it('fails when origin/main does not exist, instead of comparing nothing', () => {
    // Arrange
    write('src/work.ts');
    commit('work');

    // Act
    const list = () => listChanges(repository);

    // Assert
    expect(list).toThrow(ComparisonError);
    expect(list).toThrow('origin/main does not exist');
  });
});

describe('pnpm validate:changed', () => {
  it('says that nothing changed and passes', () => {
    // Arrange
    publishMain('src/base.ts');

    // Act
    const result = runCommand();

    // Assert
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(
      /No file differs from the merge base [0-9a-f]{12} with origin\/main, so there is nothing to check\./
    );
  });

  it('fails with a clear message when origin/main does not exist', () => {
    // Arrange
    write('src/work.ts');
    commit('work');

    // Act
    const result = runCommand();

    // Assert
    expect(result.status).toBe(2);
    expect(result.stderr).toContain(
      'origin/main does not exist in this clone, so there is nothing to compare with.'
    );
    expect(result.stdout).toBe('');
  });
});

const modified = (path: string): ChangedFile => ({ path, status: 'modified' });
const added = (path: string): ChangedFile => ({ path, status: 'added' });
const deleted = (path: string): ChangedFile => ({ path, status: 'deleted' });

const plan = (...changes: ChangedFile[]) => planStages(changes, scripts);
const commandOf = (changes: ChangedFile[], name: string) =>
  plan(...changes).stages.find((stage) => stage.name === name)?.command;
const full = (name: string) => ['pnpm', 'run', name];

describe('planStages', () => {
  it('runs the stages of validate:fast in their order, with each step of typecheck as a stage', () => {
    // Act
    const { stages } = plan(modified('src/utils/object.ts'));

    // Assert
    expect(stages.map(({ name, after }) => ({ name, after }))).toEqual([
      { name: 'build-ergogen', after: [] },
      { name: 'format:check', after: [] },
      { name: 'lint', after: ['build-ergogen'] },
      { name: 'typecheck', after: [] },
      { name: 'typecheck:tooling', after: [] },
      { name: 'typecheck:declarations', after: [] },
      { name: 'test:unit', after: ['build-ergogen'] },
    ]);
  });

  it('checks a changed file in src/utils with each tool and runs the type checks in full', () => {
    // Arrange
    const changes = [modified('src/utils/object.ts')];

    // Act
    const { lines } = plan(...changes);

    // Assert
    expect(commandOf(changes, 'format:check')).toEqual([
      ...['pnpm', 'exec', 'prettier', '--check', '--ignore-unknown'],
      './src/utils/object.ts',
    ]);
    expect(commandOf(changes, 'lint')?.slice(-1)).toEqual([
      './src/utils/object.ts',
    ]);
    expect(
      commandOf(changes, 'typecheck')?.concat(
        commandOf(changes, 'typecheck:tooling')!,
        commandOf(changes, 'typecheck:declarations')!
      )
    ).toEqual([
      ...['pnpm', 'exec', 'tsc', '--project', 'tsconfig.json'],
      ...full('typecheck:tooling'),
      ...full('typecheck:declarations'),
    ]);
    expect(commandOf(changes, 'test:unit')).toEqual([
      ...['pnpm', 'exec', 'vitest', 'related', '--run', '--passWithNoTests'],
      '--reporter=default',
      './src/utils/object.ts',
    ]);
    expect(lines).toEqual([
      'format:check runs Prettier on 1 changed file.',
      'lint runs ESLint on 1 changed file and the other steps of pnpm lint in full.',
      'typecheck, typecheck:tooling and typecheck:declarations run the steps of pnpm typecheck in full: a change in one file can break the types of every file that uses it.',
      'test:unit runs the tests that import 1 changed file.',
    ]);
  });

  it('runs every step of pnpm lint, with ESLint on the changed files only', () => {
    // Arrange: a file name with a space stays one argument.
    const changes = [modified('src/utils/a b.ts'), added('src/utils/c.ts')];

    // Act
    const command = commandOf(changes, 'lint')!;

    // Assert
    const otherSteps = scripts.lint
      .split(' && ')
      .filter((step) => step !== 'pnpm lint:js');
    expect(command).toEqual([
      'sh',
      '-c',
      scripts.lint.replace(
        'pnpm lint:js',
        'pnpm exec eslint --max-warnings 0 --no-warn-ignored "$@"'
      ),
      'sh',
      './src/utils/a b.ts',
      './src/utils/c.ts',
    ]);
    expect(otherSteps.length).toBeGreaterThan(0);
    otherSteps.forEach((step) => expect(command[2]).toContain(step));
  });

  it('passes no deleted file to a tool and runs every test after a deletion or a rename', () => {
    // Arrange: a rename is a deletion and an addition.
    const changes = [
      deleted('src/utils/old.ts'),
      added('src/utils/new.ts'),
      deleted('src/utils/gone.ts'),
    ];

    // Act
    const { stages, lines } = plan(...changes);

    // Assert
    const commands = stages.map(({ command }) => command.join(' '));
    commands.forEach((command) => {
      expect(command).not.toContain('old.ts');
      expect(command).not.toContain('gone.ts');
    });
    expect(commandOf(changes, 'format:check')).toContain('./src/utils/new.ts');
    expect(commandOf(changes, 'lint')).toContain('./src/utils/new.ts');
    expect(commandOf(changes, 'test:unit')).toEqual(full('test:unit'));
    expect(lines).toContain(
      'test:unit runs in full: src/utils/old.ts is gone, and vitest related cannot find the tests that imported it.'
    );
  });

  it('skips Prettier and ESLint when every changed file is gone', () => {
    // Arrange
    const changes = [deleted('src/utils/gone.ts')];

    // Act
    const { stages, lines } = plan(...changes);

    // Assert
    expect(stages.map(({ name }) => name)).not.toContain('format:check');
    expect(commandOf(changes, 'lint')?.[2]).not.toContain('eslint');
    expect(commandOf(changes, 'lint')).toHaveLength(4);
    expect(lines).toContain(
      'format:check does not run: every changed file is gone.'
    );
  });

  it.each([
    ['package.json', ['format:check', 'lint', 'test:unit']],
    ['pnpm-lock.yaml', ['format:check', 'lint', 'test:unit']],
    ['pnpm-workspace.yaml', ['format:check', 'lint', 'test:unit']],
    ['.prettierrc', ['format:check', 'test:unit']],
    ['.prettierignore', ['format:check', 'test:unit']],
    ['.gitignore', ['format:check', 'test:unit']],
    ['src/.editorconfig', ['format:check', 'test:unit']],
    ['eslint.config.mjs', ['lint', 'test:unit']],
    ['vitest.config.mts', ['test:unit']],
    ['vite.config.mts', ['test:unit']],
    ['tsconfig.json', ['test:unit']],
    ['src/setupTests.tsx', ['test:unit']],
  ])(
    'runs a stage in full and says why when %s changes',
    (path, fullStages) => {
      // Arrange
      const changes = [modified('src/utils/object.ts'), modified(path)];

      // Act
      const { stages, lines } = plan(...changes);

      // Assert
      const inFull = stages
        .filter(
          ({ name, command }) =>
            name !== 'build-ergogen' &&
            !name.startsWith('typecheck') &&
            command.join(' ') === full(name).join(' ')
        )
        .map(({ name }) => name);
      expect(inFull).toEqual(fullStages);
      fullStages.forEach((name) =>
        expect(
          lines.filter((line) =>
            line.startsWith(`${name} runs in full: ${path} `)
          )
        ).toHaveLength(1)
      );
    }
  );

  it('runs every test when a changed file is a script that tests may run without importing it', () => {
    // Arrange
    const changes = [modified('scripts/ci/check-budgets.mts')];

    // Act
    const { lines } = plan(...changes);

    // Assert
    expect(commandOf(changes, 'test:unit')).toEqual(full('test:unit'));
    expect(commandOf(changes, 'typecheck:tooling')).toEqual(
      full('typecheck:tooling')
    );
    expect(lines).toContain(
      'test:unit runs in full: scripts/ci/check-budgets.mts is neither a TypeScript module in src/ nor a test file, and a test can read a file or run a script without importing it, which vitest related does not follow.'
    );
  });

  it.each(['src/utils/object.test.ts', 'tests/validate.test.ts'])(
    'runs a changed test file %s through vitest related',
    (path) => {
      // Act
      const command = commandOf([modified(path)], 'test:unit');

      // Assert
      expect(command?.slice(0, 4)).toEqual([
        'pnpm',
        'exec',
        'vitest',
        'related',
      ]);
      expect(command?.at(-1)).toBe(`./${path}`);
    }
  );
});

describe('the commands of validate:changed', () => {
  it('pass the flags of the scripts they stand for', () => {
    // Assert: the scoped commands repeat these flags.
    expect(scripts['format:check']).toBe('prettier --check .');
    expect(scripts['lint:js']).toBe('eslint --max-warnings 0 .');
    expect(scripts['test:unit']).toBe('vitest run');
    expect(scripts.typecheck).toBe(
      'tsc --project tsconfig.json && pnpm typecheck:tooling && pnpm typecheck:declarations'
    );
  });

  it('know the test files and the setup file of vitest.config.mts', async () => {
    // Act
    const config = await vitestConfig({ command: 'serve', mode: 'test' });

    // Assert
    expect(config.test?.include).toEqual(testFilePatterns);
    expect(config.test?.setupFiles).toBe('./src/setupTests.tsx');
  });

  it('pass when vitest related finds no test for the changed files', () => {
    // Arrange: no test imports a declaration file. The run must not see the
    // variables of the Vitest run that holds this test.
    const command = commandOf([modified('src/gtag.d.ts')], 'test:unit')!;
    const outsideVitest = Object.fromEntries(
      Object.entries(process.env).filter(([name]) => !name.startsWith('VITEST'))
    );

    // Act
    const result = spawnSync(command[0], command.slice(1), {
      cwd: projectRoot,
      env: outsideVitest,
      encoding: 'utf8',
      timeout: 120_000,
    });

    // Assert
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(`${result.stdout}${result.stderr}`).toContain(
      'No test files found, exiting with code 0'
    );
  }, 120_000);
});
