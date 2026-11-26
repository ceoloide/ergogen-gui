// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  passed,
  renderTable,
  runStages,
  selectStages,
  validationStages,
  type Stage,
} from '../scripts/ci/validate.mts';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

let directory: string;

beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), 'validate-test-'));
});

afterEach(() => {
  rmSync(directory, { recursive: true, force: true });
});

const file = (name: string) => join(directory, name);

/**
 * A stage that runs `script` in Node. The script can call `touch(name)`,
 * `print(text)` and `waitFor(name)`, which resolves once the file exists and
 * exits with 3 when it does not appear within 4 seconds.
 */
const stage = (name: string, script: string, after: string[] = []): Stage => ({
  name,
  command: [
    process.execPath,
    '-e',
    `
    const fs = require('node:fs');
    const path = require('node:path');
    const at = (name) => path.join(${JSON.stringify(directory)}, name);
    const touch = (name) => fs.writeFileSync(at(name), '');
    const print = (text) => process.stdout.write(text + '\\n');
    const waitFor = (name) => new Promise((done) => {
      const deadline = Date.now() + 4000;
      const poll = () => {
        if (fs.existsSync(at(name))) done();
        else if (Date.now() > deadline) process.exit(3);
        else setTimeout(poll, 10);
      };
      poll();
    });
    (async () => { ${script} })();
    `,
  ],
  after,
});

/** Runs the stages and keeps what the runner writes. */
async function run(stages: Stage[], stop?: AbortSignal) {
  let output = '';
  const result = await runStages(stages, {
    write: (text) => {
      output += text;
    },
    stop,
  });
  return { result, output };
}

const resultOf = ({ result }: Awaited<ReturnType<typeof run>>, name: string) =>
  result.stages.find((stage) => stage.name === name)?.result;

const isRunning = (pid: number) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

/** Waits until `check` holds, for at most 4 seconds. */
async function eventually(check: () => boolean) {
  const deadline = Date.now() + 4000;
  while (!check() && Date.now() < deadline) {
    await new Promise((done) => setTimeout(done, 20));
  }
  return check();
}

describe('the stages of pnpm validate', () => {
  it('run every check of the old chain with the same command', () => {
    // Arrange: before the runner, pnpm validate ran "pnpm validate:fast &&
    // pnpm build", and pnpm validate:fast ran "pnpm format:check && pnpm lint
    // && pnpm typecheck && pnpm test:unit". test:unit and build ran
    // build-ergogen first, as pretest:unit and prebuild.
    const { scripts } = JSON.parse(
      readFileSync(join(projectRoot, 'package.json'), 'utf8')
    ) as { scripts: Record<string, string> };
    const runner = 'node scripts/ci/validate.mts';
    const stagesOf = (script: string) => {
      expect(scripts[script].startsWith(runner)).toBe(true);
      const names = scripts[script].slice(runner.length).split(' ');
      return selectStages(validationStages, names.filter(Boolean));
    };

    // Act
    const validate = stagesOf('validate');
    const fast = stagesOf('validate:fast');

    // Assert
    expect(validate.map(({ command }) => command.join(' '))).toEqual([
      'pnpm run build-ergogen',
      'pnpm run format:check',
      'pnpm run lint',
      'pnpm run typecheck',
      'pnpm run test:unit',
      'pnpm run build',
    ]);
    expect(fast.map(({ name }) => name)).toEqual([
      'build-ergogen',
      'format:check',
      'lint',
      'typecheck',
      'test:unit',
    ]);
    expect(scripts.precommit).toBe('pnpm validate:fast');
  });

  it('make the stages that read the engine wait for build-ergogen', () => {
    // Act
    const after = Object.fromEntries(
      validationStages.map(({ name, after }) => [name, after])
    );

    // Assert
    expect(after).toEqual({
      'build-ergogen': [],
      'format:check': [],
      lint: ['build-ergogen'],
      typecheck: [],
      'test:unit': ['build-ergogen'],
      build: ['build-ergogen'],
    });
  });

  it('reject a name that is not a stage', () => {
    // Act
    const select = () => selectStages(validationStages, ['lint', 'tests']);

    // Assert
    expect(select).toThrow(/Unknown stage "tests"/);
  });

  it('fail the runner from the command line on an unknown stage', () => {
    // Act
    const result = spawnSync(
      process.execPath,
      [join(projectRoot, 'scripts/ci/validate.mts'), 'tests'],
      { encoding: 'utf8' }
    );

    // Assert
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Unknown stage "tests"');
  });
});

describe('runStages', () => {
  it('starts stages that wait for nothing at the same time', async () => {
    // Arrange: each stage passes only if the other is running.
    const stages = [
      stage('a', "touch('a'); await waitFor('b');"),
      stage('b', "touch('b'); await waitFor('a');"),
    ];

    // Act
    const outcome = await run(stages);

    // Assert
    expect(resultOf(outcome, 'a')).toBe('passed');
    expect(resultOf(outcome, 'b')).toBe('passed');
    expect(passed(outcome.result)).toBe(true);
  });

  it('starts a stage after the stages it waits for have passed', async () => {
    // Arrange
    const stages = [
      stage(
        'engine',
        "await new Promise((done) => setTimeout(done, 200)); touch('engine');"
      ),
      stage('unit', "if (!fs.existsSync(at('engine'))) process.exit(1);", [
        'engine',
      ]),
    ];

    // Act
    const outcome = await run(stages);

    // Assert
    expect(resultOf(outcome, 'unit')).toBe('passed');
  });

  it('does not start a stage that waits for a failed stage', async () => {
    // Arrange
    const stages = [
      stage('engine', 'process.exit(1);'),
      stage('unit', "touch('unit');", ['engine']),
      stage('build', "touch('build');", ['unit']),
    ];

    // Act
    const outcome = await run(stages);

    // Assert
    expect(resultOf(outcome, 'engine')).toBe('failed');
    expect(resultOf(outcome, 'unit')).toBe('not run');
    expect(resultOf(outcome, 'build')).toBe('not run');
    expect(existsSync(file('unit'))).toBe(false);
    expect(existsSync(file('build'))).toBe(false);
    expect(passed(outcome.result)).toBe(false);
    expect(outcome.output).toContain(
      '| unit | | | NOT RUN, engine did not pass |'
    );
  });

  it('reports every failed stage, also when a later stage passes', async () => {
    // Arrange
    const stages = [
      stage('format', "print('format error'); process.exit(1);"),
      stage('lint', "print('lint error'); process.exit(2);"),
      stage('build', 'await new Promise((done) => setTimeout(done, 300));'),
    ];

    // Act
    const outcome = await run(stages);

    // Assert
    expect(resultOf(outcome, 'format')).toBe('failed');
    expect(resultOf(outcome, 'lint')).toBe('failed');
    expect(resultOf(outcome, 'build')).toBe('passed');
    expect(passed(outcome.result)).toBe(false);
    expect(outcome.output).toContain('format error');
    expect(outcome.output).toContain('lint error');
    expect(outcome.output).toContain('| format |');
    expect(outcome.output).toMatch(
      /\| lint \| [\d.]+ \| [\d.]+ \| FAILED, exit code 2 \|/
    );
    expect(outcome.output).toContain('| Total | |');
    expect(outcome.output).toMatch(/\| Total \| \| [\d.]+ \| FAILED \|\n$/);
  });

  it('fails a stage that a signal ends', async () => {
    // Arrange
    const stages = [stage('unit', "process.kill(process.pid, 'SIGKILL');")];

    // Act
    const outcome = await run(stages);

    // Assert
    expect(resultOf(outcome, 'unit')).toBe('failed');
    expect(passed(outcome.result)).toBe(false);
    expect(outcome.output).toContain('killed by SIGKILL');
  });

  it('fails a stage whose command cannot start', async () => {
    // Arrange
    const stages: Stage[] = [
      { name: 'lint', command: [file('missing-program')], after: [] },
    ];

    // Act
    const outcome = await run(stages);

    // Assert
    expect(resultOf(outcome, 'lint')).toBe('failed');
    expect(outcome.output).toContain('could not start');
  });

  it('prints the whole output of each stage together', async () => {
    // Arrange: b prints between the two lines of a.
    const stages = [
      stage('a', "print('a1'); touch('a1'); await waitFor('b1'); print('a2');"),
      stage('b', "await waitFor('a1'); print('b1'); touch('b1');"),
    ];

    // Act
    const { output } = await run(stages);

    // Assert
    expect(output).toMatch(/\[validate\] a passed after [\d.]+ s\na1\na2\n/);
    expect(output).toMatch(/\[validate\] b passed after [\d.]+ s\nb1\n/);
  });

  it('ends what a failed stage left running', async () => {
    // Arrange: the stage starts a process that does not hold its output.
    const stages = [
      stage(
        'unit',
        `
        const { spawn } = require('node:child_process');
        const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' });
        fs.writeFileSync(at('pid'), String(child.pid));
        process.exit(1);
        `
      ),
    ];

    // Act
    const outcome = await run(stages);
    const pid = Number(readFileSync(file('pid'), 'utf8'));

    // Assert
    expect(resultOf(outcome, 'unit')).toBe('failed');
    expect(await eventually(() => !isRunning(pid))).toBe(true);
  });

  /**
   * A stage that starts a process that shares its output, writes that
   * process's id to the file pid, and then runs `end`. The process lives 30
   * seconds, longer than a test may take, and then ends by itself.
   */
  const stageThatLeavesItsOutputOpen = (end: string) =>
    stage(
      'unit',
      `
      const { spawn } = require('node:child_process');
      const child = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 30000)'], { stdio: 'inherit' });
      fs.writeFileSync(at('pid'), String(child.pid));
      ${end}
      `
    );

  it('ends a process that a failed stage left holding its output', async () => {
    // Arrange
    const stages = [stageThatLeavesItsOutputOpen('process.exit(1);')];

    // Act
    const outcome = await run(stages);
    const pid = Number(readFileSync(file('pid'), 'utf8'));

    // Assert
    expect(resultOf(outcome, 'unit')).toBe('failed');
    expect(outcome.output).toContain('FAILED, exit code 1');
    expect(await eventually(() => !isRunning(pid))).toBe(true);
  });

  it('ends a process that holds the output of a stage that a signal killed', async () => {
    // Arrange
    const stages = [
      stageThatLeavesItsOutputOpen("process.kill(process.pid, 'SIGKILL');"),
    ];

    // Act
    const outcome = await run(stages);
    const pid = Number(readFileSync(file('pid'), 'utf8'));

    // Assert
    expect(resultOf(outcome, 'unit')).toBe('failed');
    expect(outcome.output).toContain('FAILED, killed by SIGKILL');
    expect(await eventually(() => !isRunning(pid))).toBe(true);
  });

  it('fails a stopped run, also when every stage exits with 0', async () => {
    // Arrange: the stage passes when the runner ends it.
    const stages = [
      stage(
        'unit',
        "process.on('SIGTERM', () => process.exit(0)); touch('ready'); setInterval(() => {}, 1000);"
      ),
    ];
    const stop = new AbortController();

    // Act
    const running = run(stages, stop.signal);
    expect(await eventually(() => existsSync(file('ready')))).toBe(true);
    stop.abort();
    const outcome = await running;

    // Assert
    expect(resultOf(outcome, 'unit')).toBe('passed');
    expect(outcome.result.stopped).toBe(true);
    expect(passed(outcome.result)).toBe(false);
    expect(outcome.output).toMatch(/\| Total \| \| [\d.]+ \| FAILED \|\n$/);
  });

  it('stops every running stage and its processes when the run is stopped', async () => {
    // Arrange
    const stages = [
      stage(
        'unit',
        `
        const { spawn } = require('node:child_process');
        const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'inherit' });
        fs.writeFileSync(at('pid'), String(child.pid));
        setInterval(() => {}, 1000);
        `
      ),
      stage('build', "touch('build');", ['unit']),
    ];
    const stop = new AbortController();

    // Act
    const running = run(stages, stop.signal);
    expect(await eventually(() => existsSync(file('pid')))).toBe(true);
    stop.abort();
    const outcome = await running;
    const pid = Number(readFileSync(file('pid'), 'utf8'));

    // Assert
    expect(outcome.result.stopped).toBe(true);
    expect(resultOf(outcome, 'unit')).toBe('failed');
    expect(resultOf(outcome, 'build')).toBe('not run');
    expect(existsSync(file('build'))).toBe(false);
    expect(await eventually(() => !isRunning(pid))).toBe(true);
  });

  it('rejects a stage that waits for a stage after it', async () => {
    // Arrange
    const stages = [stage('unit', '', ['engine']), stage('engine', '')];

    // Act
    const running = run(stages);

    // Assert
    await expect(running).rejects.toThrow('unit waits for engine');
  });
});

describe('renderTable', () => {
  it('lists each stage with its start, time and result, then the total', () => {
    // Act
    const table = renderTable({
      stages: [
        {
          name: 'lint',
          result: 'passed',
          startMilliseconds: 0,
          milliseconds: 12_340,
        },
        {
          name: 'unit',
          result: 'failed',
          reason: 'exit code 1',
          startMilliseconds: 600,
          milliseconds: 41_000,
        },
        { name: 'build', result: 'not run', reason: 'unit did not pass' },
      ],
      milliseconds: 41_600,
      stopped: false,
    });

    // Assert
    expect(table).toBe(
      [
        '| Stage | Start | Seconds | Result |',
        '| ----- | ----: | ------: | ------ |',
        '| lint | 0.0 | 12.3 | passed |',
        '| unit | 0.6 | 41.0 | FAILED, exit code 1 |',
        '| build | | | NOT RUN, unit did not pass |',
        '| Total | | 41.6 | FAILED |',
        '',
      ].join('\n')
    );
  });
});
