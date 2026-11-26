// Runs the stages of validation, the independent ones at the same time:
//
//   node scripts/ci/validate.mts [stage...]
//
// Without arguments it runs every stage, as `pnpm validate` does. With stage
// names it runs those stages and the stages they wait for. Each stage runs
// `pnpm run <stage>`. The runner keeps the output of each stage and prints it
// whole when the stage ends, so the output of two stages never mixes. Then it
// prints a table of start times, durations and results. The exit status is 0
// only when every stage passed and nothing stopped the run. A stage that a
// signal ends has failed, and a stage that waits for a stage that did not pass
// does not run.
//
// Stages run at the same time only when no stage writes a file that another
// stage reads or writes. strace showed these files for each stage:
//
// - build-ergogen replaces node_modules/.ergogen-engine and deletes
//   node_modules/.vite when the engine is out of date. test:unit and build
//   load the engine, and lint reads its package.json, so the three wait for
//   build-ergogen. test:unit and build also run build-ergogen first, as
//   pretest:unit and prebuild, and then find the engine up to date, so two
//   copies never replace the folder at once.
// - test:unit writes reports/unit.xml and node_modules/.vite/vitest, build
//   writes dist, and lint writes node_modules/.cache/jiti. No other stage
//   reads them.
// - Vite and Vitest load their configuration through a temporary file next to
//   it, named *.timestamp-<time>-<random>.mjs. Prettier and ESLint skip those
//   files without opening them, and the TypeScript projects do not include
//   them.
// - Every stage writes pnpm's lock files and Node's compile cache. Both are
//   made for processes that run at the same time.
//
// Each stage runs in its own process group. When a stage's process exits, the
// runner sends SIGTERM to that group, so nothing the stage started keeps
// running or keeps the stage's output open.
// When the runner gets SIGINT or SIGTERM, it sends SIGTERM to the group of
// every running stage, waits for each stage to end and fails.
import { spawn, type ChildProcess } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export interface Stage {
  name: string;
  /** The program and its arguments. */
  command: readonly string[];
  /** Stages that must pass before this one starts. Each comes earlier. */
  after: readonly string[];
}

const pnpmRun = (name: string, after: readonly string[] = []): Stage => ({
  name,
  command: ['pnpm', 'run', name],
  after,
});

/** The stages of `pnpm validate`. */
export const validationStages: readonly Stage[] = [
  pnpmRun('build-ergogen'),
  pnpmRun('format:check'),
  pnpmRun('lint', ['build-ergogen']),
  pnpmRun('typecheck'),
  pnpmRun('test:unit', ['build-ergogen']),
  pnpmRun('build', ['build-ergogen']),
];

interface Timing {
  /** From the start of the run. */
  startMilliseconds: number;
  milliseconds: number;
}

export type StageRun = { name: string } & (
  | ({ result: 'passed' } & Timing)
  | ({ result: 'failed'; reason: string } & Timing)
  | { result: 'not run'; reason: string }
);

export interface ValidationRun {
  /** In the order of the stages. */
  stages: StageRun[];
  /** From the start of the run to the end of the last stage. */
  milliseconds: number;
  /** True when a signal or the stop option ended the run early. */
  stopped: boolean;
}

export const passed = (run: ValidationRun) =>
  !run.stopped && run.stages.every((stage) => stage.result === 'passed');

/** The named stages and the stages they wait for, in their order. */
export function selectStages(
  stages: readonly Stage[],
  names: readonly string[]
): Stage[] {
  if (names.length === 0) return [...stages];
  const byName = new Map(stages.map((stage) => [stage.name, stage]));
  const selected = new Set<string>();
  const select = (name: string) => {
    const stage = byName.get(name);
    if (!stage) {
      throw new Error(
        `Unknown stage "${name}". The stages are ${[...byName.keys()].join(', ')}.`
      );
    }
    if (selected.has(name)) return;
    selected.add(name);
    stage.after.forEach(select);
  };
  names.forEach(select);
  return stages.filter((stage) => selected.has(stage.name));
}

const seconds = (milliseconds: number) => (milliseconds / 1000).toFixed(1);

const describe = (stage: StageRun) => {
  switch (stage.result) {
    case 'passed':
      return 'passed';
    case 'failed':
      return `FAILED, ${stage.reason}`;
    case 'not run':
      return `NOT RUN, ${stage.reason}`;
  }
};

export function renderTable(run: ValidationRun): string {
  const rows = run.stages.map((stage) =>
    stage.result === 'not run'
      ? `| ${stage.name} | | | ${describe(stage)} |`
      : `| ${stage.name} | ${seconds(stage.startMilliseconds)} | ${seconds(stage.milliseconds)} | ${describe(stage)} |`
  );
  const result = passed(run) ? 'passed' : 'FAILED';
  return [
    '| Stage | Start | Seconds | Result |',
    '| ----- | ----: | ------: | ------ |',
    ...rows,
    `| Total | | ${seconds(run.milliseconds)} | ${result} |`,
  ]
    .map((line) => `${line}\n`)
    .join('');
}

/** Ends every process in the stage's group, including those it started. */
function stopGroup(child: ChildProcess) {
  if (child.pid === undefined) return;
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error;
  }
}

interface RunOptions {
  /** Receives the output. By default it goes to standard output. */
  write?: (text: string) => void;
  /** Stops the run. By default SIGINT and SIGTERM stop it. */
  stop?: AbortSignal;
}

/**
 * Starts each stage as soon as the stages it waits for have passed, prints
 * each stage's output when it ends and the table at the end, and resolves
 * when every stage has ended.
 */
export async function runStages(
  stages: readonly Stage[],
  { write = (text) => process.stdout.write(text), stop }: RunOptions = {}
): Promise<ValidationRun> {
  stages.forEach(({ name, after }, index) => {
    const earlier = new Set(stages.slice(0, index).map((stage) => stage.name));
    const missing = after.find((prerequisite) => !earlier.has(prerequisite));
    if (missing !== undefined) {
      throw new Error(`${name} waits for ${missing}, which is not before it.`);
    }
  });

  const signals = ['SIGINT', 'SIGTERM'] as const;
  const ownStop = new AbortController();
  const stopOnSignal = () => ownStop.abort();
  if (!stop) signals.forEach((signal) => process.on(signal, stopOnSignal));
  const stopSignal = stop ?? ownStop.signal;

  const runStart = performance.now();
  const elapsed = () => performance.now() - runStart;
  const ended = new Map<string, StageRun>();
  const running = new Map<string, ChildProcess>();
  const stopRunning = () => running.forEach(stopGroup);
  stopSignal.addEventListener('abort', stopRunning);

  try {
    await new Promise<void>((allEnded) => {
      const startReady = () => {
        for (const stage of stages) {
          if (ended.has(stage.name) || running.has(stage.name)) continue;
          const blocker = stage.after.find((name) => {
            const prerequisite = ended.get(name);
            return prerequisite && prerequisite.result !== 'passed';
          });
          const notRun = (reason: string) =>
            ended.set(stage.name, {
              name: stage.name,
              result: 'not run',
              reason,
            });
          if (stopSignal.aborted) notRun('the run was stopped');
          else if (blocker !== undefined) notRun(`${blocker} did not pass`);
          else if (stage.after.every((name) => ended.has(name))) start(stage);
        }
        if (running.size === 0) allEnded();
      };

      const start = (stage: Stage) => {
        const startMilliseconds = elapsed();
        const output: Buffer[] = [];
        const [program, ...args] = stage.command;
        const child = spawn(program, args, {
          detached: true,
          stdio: ['ignore', 'pipe', 'pipe'],
        });
        running.set(stage.name, child);
        write(`[validate] ${stage.name} started\n`);
        child.stdout?.on('data', (chunk: Buffer) => output.push(chunk));
        child.stderr?.on('data', (chunk: Buffer) => output.push(chunk));

        const end = (failure: string | undefined) => {
          if (!running.delete(stage.name)) return;
          const timing = {
            startMilliseconds,
            milliseconds: elapsed() - startMilliseconds,
          };
          const run: StageRun =
            failure === undefined
              ? { name: stage.name, result: 'passed', ...timing }
              : {
                  name: stage.name,
                  result: 'failed',
                  reason: failure,
                  ...timing,
                };
          ended.set(stage.name, run);
          const text = Buffer.concat(output).toString();
          write(
            `\n[validate] ${stage.name} ${describe(run)} after ${seconds(timing.milliseconds)} s\n`
          );
          write(text.endsWith('\n') || text === '' ? text : `${text}\n`);
          startReady();
        };
        child.once('error', (error) =>
          end(`could not start: ${error.message}`)
        );
        // A process that the stage left running can hold its output open, and
        // 'close' waits for every holder, so the group ends on 'exit'.
        child.once('exit', () => stopGroup(child));
        child.once('close', (code, signal) =>
          end(
            signal !== null
              ? `killed by ${signal}`
              : code === 0
                ? undefined
                : `exit code ${code}`
          )
        );
      };

      startReady();
    });
  } finally {
    stopSignal.removeEventListener('abort', stopRunning);
    signals.forEach((signal) => process.off(signal, stopOnSignal));
  }

  const run: ValidationRun = {
    stages: stages.map(({ name }) => ended.get(name)!),
    milliseconds: elapsed(),
    stopped: stopSignal.aborted,
  };
  write(`\n${renderTable(run)}`);
  return run;
}

async function main() {
  const stages = selectStages(validationStages, process.argv.slice(2));
  const run = await runStages(stages);
  process.exitCode = passed(run) ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
