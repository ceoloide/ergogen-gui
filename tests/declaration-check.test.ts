import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Runs the declaration check and the real TypeScript compiler against a small
 * temporary Git project. Its node_modules folder holds a synthetic dependency
 * whose declarations have type errors, so the repository's own dependencies
 * are never touched. Git runs with a temporary HOME and without the
 * environment of a surrounding Git hook.
 */

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkScript = join(projectRoot, 'scripts/ci/check-declarations.mts');
const tscScript = join(projectRoot, 'node_modules/typescript/bin/tsc');

// Each test starts Node with the TypeScript compiler several times.
const processTimeout = 60_000;

let workspace: string;
let environment: NodeJS.ProcessEnv;

const run = (command: string, args: string[]) => {
  const result = spawnSync(command, args, {
    cwd: workspace,
    env: environment,
    encoding: 'utf8',
  });
  return { status: result.status, output: result.stdout + result.stderr };
};
const check = () => run(process.execPath, [checkScript, 'tsconfig.json']);
const tsc = (...args: string[]) =>
  run(process.execPath, [tscScript, '--project', 'tsconfig.json', ...args]);

const write = (path: string, content: string) => {
  mkdirSync(dirname(join(workspace, path)), { recursive: true });
  writeFileSync(join(workspace, path), content);
};

beforeEach(() => {
  workspace = mkdtempSync(join(tmpdir(), 'declaration-check-'));
  const home = join(workspace, '.home');
  mkdirSync(home);
  environment = {
    PATH: process.env.PATH,
    HOME: home,
    LANG: 'C',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: join(home, '.gitconfig'),
  };
  expect(run('git', ['init', '-q']).status).toBe(0);
  write(
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: {
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        lib: ['es2022'],
        types: [],
      },
      include: ['types'],
    })
  );
  write(
    'node_modules/fake-dependency/package.json',
    JSON.stringify({ name: 'fake-dependency', types: 'index.d.ts' })
  );
  write(
    'node_modules/fake-dependency/index.d.ts',
    'export declare const version: string = "1.0.0";\n' +
      'export interface Options { level: MissingLevel }\n'
  );
  write(
    'types/own.d.ts',
    "import type { Options } from 'fake-dependency';\n" +
      'export interface Settings { options: Options }\n'
  );
});
afterEach(() => rmSync(workspace, { recursive: true, force: true }));

describe('pnpm typecheck:declarations', { timeout: processTimeout }, () => {
  it('passes valid own declarations and leaves dependency errors to their packages', () => {
    // Arrange: without skipLibCheck, tsc reports the dependency's errors.
    const strict = tsc('--skipLibCheck', 'false');
    expect(strict.status).not.toBe(0);
    expect(strict.output).toContain(
      'node_modules/fake-dependency/index.d.ts(1,40): error TS1039'
    );
    expect(strict.output).toContain("Cannot find name 'MissingLevel'");

    // Act
    const result = check();

    // Assert
    expect(result.output).toBe('tsconfig.json: types/own.d.ts\n');
    expect(result.status).toBe(0);
  });

  it('fails on a semantic error in an own declaration that tsc skips', () => {
    // Arrange: an ambient initializer and a conflicting redeclaration.
    write(
      'types/own.d.ts',
      'declare const engine: string = "4.3.0";\n' +
        'interface Settings { level: string }\n' +
        'interface Settings { level: number }\n'
    );
    expect(tsc()).toEqual({ status: 0, output: '' });

    // Act
    const result = check();

    // Assert
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'types/own.d.ts(1,32): error TS1039: Initializers are not allowed in ambient contexts.'
    );
    expect(result.output).toContain('types/own.d.ts(3,22): error TS2717');
    expect(result.output).not.toContain('fake-dependency');
  });

  it('fails when an own declaration file belongs to no checked project', () => {
    // Arrange: an untracked file outside the project's include.
    write('other/stray.d.ts', 'declare const stray: string;\n');

    // Act
    const result = check();

    // Assert
    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'other/stray.d.ts: not part of any checked project (tsconfig.json)'
    );
  });
});
