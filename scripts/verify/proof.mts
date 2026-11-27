// The proof that `pnpm verify` keeps for each journey. The script
// scripts/verify/verify.mts and its Playwright configuration import this
// module. The journey fixture e2e/journeys/journey.ts writes the same
// result.json, but imports only the types: Playwright loads the journeys as
// CommonJS, which cannot load this ES module.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** The folder of all proof, from the root of the repository. */
export const PROOF_PATH = join('reports', 'verify');

/** A journey file is e2e/journeys/<feature>.journey.ts. */
export const JOURNEY_SUFFIX = '.journey.ts';

export interface StepProof {
  /** The user action and its check, as the journey names the step. */
  name: string;
  /** `failed` also when the journey ended during the step, by a timeout. */
  status: 'passed' | 'failed';
  durationMs: number;
  /** The screenshot of the page after the step, in the folder of the feature. */
  screenshot?: string;
  /** The ARIA snapshot of the page after the step, in the same folder. */
  aria?: string;
}

/** The content of reports/verify/<feature>/result.json. */
export interface JourneyResult {
  feature: string;
  /** The title of the test in the journey file. Empty when it did not run. */
  journey: string;
  status: 'passed' | 'failed';
  /** Why the journey failed, or null when it passed. */
  error: string | null;
  commit: string;
  /** True when the working tree differed from the commit. */
  dirty: boolean;
  buildId: string;
  baseURL: string;
  startedAt: string;
  finishedAt: string;
  steps: StepProof[];
  /** Values that the journey read from the page, by name. */
  observed: Record<string, unknown>;
  /** Uncaught errors of the page. */
  pageErrors: string[];
  /** The summary from e2e/utils/readiness.ts: worker milestones and CPU use. */
  readiness: string;
  /** The screenshot and ARIA snapshot of the page when the journey failed. */
  failure?: { screenshot?: string; aria?: string; captureError?: string };
}

export interface GitState {
  commit: string;
  dirty: boolean;
}

/** The commit of HEAD, and whether the working tree differs from it. */
export function gitState(cwd: string): GitState {
  const git = (...args: string[]) =>
    execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  return {
    commit: git('rev-parse', 'HEAD'),
    dirty: git('status', '--porcelain') !== '',
  };
}

export const resultFile = (featureDirectory: string) =>
  join(featureDirectory, 'result.json');

export function writeResult(featureDirectory: string, result: JourneyResult) {
  mkdirSync(featureDirectory, { recursive: true });
  writeFileSync(
    resultFile(featureDirectory),
    `${JSON.stringify(result, null, 2)}\n`
  );
}

/** The result in the folder, or null when the folder has none. */
export function readResult(featureDirectory: string): JourneyResult | null {
  const file = resultFile(featureDirectory);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, 'utf8')) as JourneyResult;
}
