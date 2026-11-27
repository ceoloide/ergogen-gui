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

/** Each changed file that exists is a module that adds nothing global. */
const plan = (...changes: ChangedFile[]) =>
  planStages(changes, scripts, () => 'export const value = 1;\n');
const commandOf = (changes: ChangedFile[], name: string) =>
  plan(...changes).stages.find((stage) => stage.name === name)?.command;
const full = (name: string) => ['pnpm', 'run', name];

describe('planStages', () => {
  it('runs the stages of validate:fast in their order, with each step of typecheck as a stage', () => {
    // Act: a changed declaration file runs the declaration check.
    const { stages } = plan(
      modified('src/utils/object.ts'),
      modified('src/gtag.d.ts')
    );

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

  it('checks a changed module in src/utils with each tool, runs two type checks in full and skips the declaration check', () => {
    // Arrange
    const changes = [modified('src/utils/object.ts')];

    // Act
    const { stages, lines } = plan(...changes);

    // Assert
    expect(commandOf(changes, 'format:check')).toEqual([
      ...['pnpm', 'exec', 'prettier', '--check', '--ignore-unknown'],
      './src/utils/object.ts',
    ]);
    expect(commandOf(changes, 'lint')).toEqual([
      'sh',
      '-c',
      'pnpm exec eslint --max-warnings 0 --no-warn-ignored "$@" && pnpm knip && pnpm lint:budgets',
      'sh',
      './src/utils/object.ts',
    ]);
    expect(
      commandOf(changes, 'typecheck')?.concat(
        commandOf(changes, 'typecheck:tooling')!
      )
    ).toEqual([
      ...['pnpm', 'exec', 'tsc', '--project', 'tsconfig.json'],
      ...full('typecheck:tooling'),
    ]);
    expect(stages.map(({ name }) => name)).not.toContain(
      'typecheck:declarations'
    );
    expect(commandOf(changes, 'test:unit')).toEqual([
      ...['pnpm', 'exec', 'vitest', 'related', '--run', '--passWithNoTests'],
      '--reporter=default',
      './src/utils/object.ts',
    ]);
    expect(lines).toEqual([
      'format:check runs Prettier on 1 changed file.',
      'lint runs ESLint on 1 changed file.',
      'lint runs knip and lint:budgets in full: they read the whole project.',
      'lint skips lint:md, lint:workflows, lint:security and lint:shell: no changed file is one that they read.',
      'typecheck and typecheck:tooling run the first two steps of pnpm typecheck in full: a change in one file can break the types of every file that uses it.',
      'typecheck:declarations does not run: no changed file is a declaration file or one of its inputs, and no changed module adds to the global scope or to a module.',
      'test:unit runs the tests that import 1 changed file.',
    ]);
  });

  it('runs every step of pnpm lint in its order when each has a changed file to read', () => {
    // Arrange: a file name with a space stays one argument.
    const changes = [
      modified('src/utils/a b.ts'),
      added('src/utils/c.ts'),
      modified('README.md'),
      modified('.github/workflows/ci.yaml'),
      modified('scripts/install-ci-tools.sh'),
    ];

    // Act
    const command = commandOf(changes, 'lint')!;

    // Assert
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
      './README.md',
      './.github/workflows/ci.yaml',
      './scripts/install-ci-tools.sh',
    ]);
  });

  it.each([
    ['README.md', ['lint:md']],
    ['.agents/skills/a/SKILL.md', ['lint:md']],
    ['.markdownlint.json', ['lint:md']],
    ['.markdownlintignore', ['lint:md']],
    ['.github/workflows/ci.yaml', ['lint:workflows', 'lint:security']],
    ['.github/actionlint.yaml', ['lint:workflows', 'lint:security']],
    ['zizmor.yml', ['lint:security']],
    [
      'scripts/install-ci-tools.sh',
      ['lint:workflows', 'lint:security', 'lint:shell'],
    ],
    ['patch/patch_ergogen.sh', ['lint:shell']],
    ['.husky/pre-commit', ['lint:shell']],
    ['.shellcheckrc', ['lint:shell']],
  ])('runs the lint steps that read %s and says why', (path, steps) => {
    // Arrange
    const changes = [modified('src/utils/object.ts'), modified(path)];
    const scoped = ['lint:md', 'lint:workflows', 'lint:security', 'lint:shell'];

    // Act
    const { lines } = plan(...changes);

    // Assert
    const script = commandOf(changes, 'lint')![2];
    scoped.forEach((step) =>
      expect(script.includes(`pnpm ${step}`)).toBe(steps.includes(step))
    );
    steps.forEach((step) =>
      expect(
        lines.filter((line) =>
          line.startsWith(`lint runs ${step}: ${path} changed, and `)
        )
      ).toHaveLength(1)
    );
  });

  it.each([
    ['src/gtag.d.ts', 'it is a declaration file'],
    ['scripts/ci/jsdom.d.ts', 'it is a declaration file'],
    ['tsconfig.json', 'the declaration check builds its projects from it'],
    [
      'tsconfig.tooling.json',
      'the declaration check builds its projects from it',
    ],
    ['scripts/ci/check-declarations.mts', 'it is the declaration check'],
    ['package.json', 'it sets the version and the settings of the tools'],
    ['pnpm-lock.yaml', 'pnpm reads it to install the tools'],
    ['.gitignore', 'the declaration check reads it'],
  ])(
    'runs the declaration check in full and says why when %s changes',
    (path, because) => {
      // Arrange
      const changes = [modified('src/utils/object.ts'), modified(path)];

      // Act
      const { lines } = plan(...changes);

      // Assert
      expect(commandOf(changes, 'typecheck:declarations')).toEqual(
        full('typecheck:declarations')
      );
      expect(lines).toContainEqual(
        expect.stringContaining(
          `typecheck:declarations runs in full: ${path} changed, and ${because}`
        )
      );
    }
  );

  it.each([
    [
      'declares a global',
      'declare global {\n  interface Window {\n    gtag?: number;\n  }\n}\nexport {};\n',
    ],
    [
      'adds to a module',
      "export {};\ndeclare module 'react' {\n  interface Attributes {\n    probe?: string;\n  }\n}\n",
    ],
    ['has no import or export', 'interface Window {\n  gtag?: number;\n}\n'],
  ])(
    'runs the declaration check in full when a changed module %s',
    (_, text) => {
      // Arrange: TypeScript can report such a conflict in src/gtag.d.ts,
      // which tsc skips under skipLibCheck.
      const changes = [modified('src/utils/object.ts')];

      // Act
      const { stages, lines } = planStages(changes, scripts, () => text);

      // Assert
      expect(stages.map(({ name }) => name)).toContain(
        'typecheck:declarations'
      );
      expect(lines).toContainEqual(
        expect.stringMatching(
          /^typecheck:declarations runs in full: src\/utils\/object\.ts changed, and .* conflict with a declaration file\.$/
        )
      );
    }
  );

  it('runs the declaration check in full when a module is gone, without reading it', () => {
    // Arrange
    const changes = [deleted('src/utils/gone.ts')];
    const read = (path: string): string => {
      throw new Error(`read ${path}`);
    };

    // Act
    const { lines } = planStages(changes, scripts, read);

    // Assert
    expect(lines).toContain(
      'typecheck:declarations runs in full: src/utils/gone.ts is gone, and it may have declared a global that a declaration file uses.'
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
    // `**` in a pattern also reaches a folder whose name starts with a dot.
    ['.agents/tool/package.json', ['format:check', 'lint', 'test:unit']],
    ['.github/.prettierrc', ['format:check', 'test:unit']],
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

  it('know the files that the scoped steps read', () => {
    // Assert: scopedLintSteps and declarationCheckInputs list these files.
    expect(scripts['lint:md']).toBe('markdownlint "**/*.md" ".agents/**/*.md"');
    expect(scripts['lint:workflows']).toBe(
      'actionlint -shellcheck=shellcheck -pyflakes='
    );
    expect(scripts['lint:security']).toBe('zizmor --offline .github');
    expect(scripts['lint:shell']).toBe(
      'shellcheck scripts/*.sh patch/*.sh .husky/pre-commit'
    );
    expect(scripts['typecheck:declarations']).toBe(
      'node scripts/ci/check-declarations.mts tsconfig.json tsconfig.tooling.json'
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
