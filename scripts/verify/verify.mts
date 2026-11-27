// Proves that features of Ergogen Web UI work, the way a user reaches them:
//
//   pnpm verify [<feature>...]
//   pnpm verify --list
//   pnpm verify --doctor
//   pnpm verify --help
//
// A feature has a journey: a file e2e/journeys/<feature>.journey.ts with one
// Playwright test that drives one user path through the feature. Without a
// feature, the script runs every journey.
//
// The script removes the old proof of the features that it runs, then runs
// Playwright with scripts/verify/playwright.config.mts. Playwright builds the
// app with a new build ID into a new folder in the temporary folder of the
// system, serves the build on a free loopback port, checks that the server
// answers with that build ID, runs the journeys in Chromium one at a time,
// and stops the server. The script then removes the build.
//
// Each journey writes its proof to reports/verify/<feature>/: a screenshot
// and an ARIA snapshot after each step, a screenshot and an ARIA snapshot of
// the page when the journey fails, and result.json (see proof.mts).
// When a journey writes no result, such as when the build fails, the script
// writes a failed result.json for it. reports/verify/playwright.log holds the
// output of Playwright, and reports/verify/traces/ the trace of each failed
// journey. The script keeps all proof after it stops.
//
// --list prints the features. --doctor checks, without a change, that this
// checkout can run the journeys: the Node.js version, the Chromium of
// Playwright, and the journeys.
//
// Exit status: 0 when every journey passed, 1 when a journey failed or did
// not run, or with --doctor when a check failed, 2 when the arguments are
// wrong.
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';
import {
  gitState,
  JOURNEY_SUFFIX,
  PROOF_PATH,
  readResult,
  writeResult,
  type JourneyResult,
} from './proof.mts';

const USAGE = `Usage: pnpm verify [<feature>...]
       pnpm verify --list
       pnpm verify --doctor`;

/** The folder of the journeys, from the root of the repository. */
const JOURNEYS_PATH = join('e2e', 'journeys');

/** Runs Playwright with the variables and returns its exit status. */
export type RunPlaywright = (options: {
  root: string;
  env: Record<string, string>;
  log: string;
}) => Promise<number>;

export interface Context {
  root: string;
  runPlaywright: RunPlaywright;
  print: (line: string) => void;
}

/** The features that have a journey, in alphabetical order. */
export function features(root: string): string[] {
  const folder = join(root, JOURNEYS_PATH);
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .filter((file) => file.endsWith(JOURNEY_SUFFIX))
    .map((file) => file.slice(0, -JOURNEY_SUFFIX.length))
    .sort();
}

// Runs Playwright, prints its output, and copies the output to the log.
const runPlaywright: RunPlaywright = ({ root, env, log }) =>
  new Promise((resolve, reject) => {
    const output = createWriteStream(log);
    const child = spawn(
      'pnpm',
      [
        'exec',
        'playwright',
        'test',
        '--config',
        join('scripts', 'verify', 'playwright.config.mts'),
      ],
      { cwd: root, env: { ...process.env, ...env } }
    );
    child.stdout.on('data', (chunk) => {
      process.stdout.write(chunk);
      output.write(chunk);
    });
    child.stderr.on('data', (chunk) => {
      process.stderr.write(chunk);
      output.write(chunk);
    });
    // A Ctrl+C in the terminal reaches Playwright too, and Playwright stops
    // its server. Pass on a termination so that Playwright stops it too.
    const ignoreInterrupt = () => {};
    const passTermination = () => child.kill('SIGTERM');
    process.on('SIGINT', ignoreInterrupt);
    process.on('SIGTERM', passTermination);
    child.on('error', reject);
    child.on('close', (code, signal) => {
      process.off('SIGINT', ignoreInterrupt);
      process.off('SIGTERM', passTermination);
      output.end(() => resolve(code ?? (signal ? 1 : 0)));
    });
  });

// The result of a journey that wrote none.
function missingResult(
  feature: string,
  status: number,
  context: Context,
  buildId: string,
  log: string
): JourneyResult {
  const now = new Date().toISOString();
  return {
    feature,
    journey: '',
    status: 'failed',
    error:
      `The journey wrote no result. Playwright exited with status ${status}.` +
      ` Read ${relative(context.root, log)}, which can show a failed build.`,
    ...gitState(context.root),
    buildId,
    baseURL: '',
    startedAt: now,
    finishedAt: now,
    steps: [],
    observed: {},
    pageErrors: [],
    readiness: '',
  };
}

async function verify(chosen: string[], context: Context): Promise<number> {
  const { root, print } = context;
  const proofDir = join(root, PROOF_PATH);
  for (const feature of chosen) {
    rmSync(join(proofDir, feature), { recursive: true, force: true });
  }
  mkdirSync(proofDir, { recursive: true });
  const log = join(proofDir, 'playwright.log');
  const buildId = randomUUID();
  const buildDir = join(tmpdir(), `ergogen-gui-verify-${buildId}`);

  let status: number;
  try {
    status = await context.runPlaywright({
      root,
      env: {
        VERIFY_BUILD_ID: buildId,
        VERIFY_BUILD_DIR: buildDir,
        VERIFY_FEATURES: chosen.join(','),
      },
      log,
    });
  } finally {
    rmSync(buildDir, { recursive: true, force: true });
  }

  let failed = 0;
  for (const feature of chosen) {
    const folder = join(proofDir, feature);
    let result = readResult(folder);
    if (!result) {
      result = missingResult(feature, status, context, buildId, log);
      writeResult(folder, result);
    }
    if (result.status !== 'passed') failed += 1;
    print(`${feature}: ${result.status}. Proof in ${relative(root, folder)}/.`);
  }
  if (failed > 0) return 1;
  if (status !== 0) {
    print(
      `Every journey passed, but Playwright exited with status ${status}. Read ${relative(root, log)}.`
    );
    return 1;
  }
  return 0;
}

function doctor(context: Context): number {
  const { root, print } = context;
  const checks: [boolean, string][] = [];

  const pinned = readFileSync(join(root, '.node-version'), 'utf8').trim();
  checks.push([
    process.versions.node === pinned,
    `Node.js ${process.versions.node}, and .node-version pins ${pinned}.`,
  ]);
  const browser = chromium.executablePath();
  checks.push([
    existsSync(browser),
    existsSync(browser)
      ? `Chromium for Playwright is at ${browser}.`
      : `Chromium for Playwright is missing. Run pnpm exec playwright install chromium.`,
  ]);
  const found = features(root);
  checks.push([
    found.length > 0,
    found.length > 0
      ? `Journeys: ${found.join(', ')}.`
      : `No journey in ${JOURNEYS_PATH}.`,
  ]);
  const { commit, dirty } = gitState(root);
  checks.push([
    true,
    `Commit ${commit}${dirty ? ', with changes that are not committed' : ''}.`,
  ]);

  for (const [passed, line] of checks) {
    print(`${passed ? 'ok  ' : 'fail'} ${line}`);
  }
  return checks.every(([passed]) => passed) ? 0 : 1;
}

export async function main(
  args: string[],
  context: Context = {
    root: fileURLToPath(new URL('../..', import.meta.url)),
    runPlaywright,
    print: (line) => console.log(line),
  }
): Promise<number> {
  let parsed;
  try {
    parsed = parseArgs({
      args,
      allowPositionals: true,
      options: {
        list: { type: 'boolean' },
        doctor: { type: 'boolean' },
        help: { type: 'boolean', short: 'h' },
      },
    });
  } catch (error) {
    console.error(`${(error as Error).message}\n${USAGE}`);
    return 2;
  }
  const { values, positionals } = parsed;
  const modes = [values.list, values.doctor, values.help].filter(Boolean);
  if (modes.length > 1 || (modes.length === 1 && positionals.length > 0)) {
    console.error(
      `--list, --doctor, and --help take no feature and no other option.\n${USAGE}`
    );
    return 2;
  }
  if (values.help) {
    context.print(USAGE);
    return 0;
  }
  if (values.doctor) return doctor(context);

  const available = features(context.root);
  if (values.list) {
    for (const feature of available) context.print(feature);
    return 0;
  }
  const unknown = positionals.filter((feature) => !available.includes(feature));
  if (unknown.length > 0) {
    console.error(
      `No journey for ${unknown.join(', ')}. The features are: ${available.join(', ')}.\n${USAGE}`
    );
    return 2;
  }
  if (available.length === 0) {
    console.error(`No journey in ${JOURNEYS_PATH}.`);
    return 2;
  }
  const chosen = positionals.length > 0 ? [...new Set(positionals)] : available;
  return verify(chosen, context);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exitCode = await main(process.argv.slice(2));
}
