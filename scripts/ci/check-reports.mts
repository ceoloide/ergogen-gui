// Checks the test reports against the validation contract and records what
// this run tested. CI runs it after the tests (`pnpm test:reports`); it also
// works locally after `pnpm validate:extended`.
//
// Its output describes the run it executes in. Pull request code can change
// this script and the workflow, so the evidence is a convenience for triage,
// never proof by itself: scripts/ci/assess-pr.mts verifies it against the
// GitHub API from a trusted checkout.
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { evidencePath, requiredReports } from './contract.mts';
import { checkReport, type ReportResult } from './junit.mts';

export interface Evidence {
  schema: 1;
  repository: string | null;
  pullRequest: number | null;
  /** The PR head commit (github.event.pull_request.head.sha). */
  headSha: string | null;
  /** The base commit the event named; the tested merge may be newer. */
  baseSha: string | null;
  /** What was checked out and tested: the PR merge commit (GITHUB_SHA). */
  testedSha: string | null;
  runId: number | null;
  runAttempt: number | null;
  /** Outcomes of the validation steps, as passed in by the workflow. */
  steps: Record<string, string>;
  reports: ReportResult[];
  problems: string[];
  passed: boolean;
}

interface PullRequestEvent {
  pull_request?: {
    number: number;
    head: { sha: string };
    base: { sha: string };
  };
}

/** Step outcomes arrive as `STEP_OUTCOME_<NAME>` variables. */
const stepPrefix = 'STEP_OUTCOME_';

export function collectEvidence(
  env: Record<string, string | undefined>,
  event: PullRequestEvent | undefined,
  readReport: (path: string) => string | undefined
): Evidence {
  const reports = requiredReports.map((report) =>
    checkReport(report, readReport(report.path))
  );
  const steps: Record<string, string> = {};
  for (const [name, value] of Object.entries(env)) {
    if (name.startsWith(stepPrefix) && value !== undefined) {
      steps[name.slice(stepPrefix.length).toLowerCase()] = value;
    }
  }
  const problems = [
    ...Object.entries(steps)
      .filter(([, outcome]) => outcome !== 'success')
      .map(([step, outcome]) => `step ${step} ended with ${outcome || 'none'}`),
    ...reports.flatMap((report) => report.problems),
  ];
  const pullRequest = event?.pull_request;
  const number = (value: string | undefined) =>
    value === undefined ? null : Number(value);
  return {
    schema: 1,
    repository: env.GITHUB_REPOSITORY ?? null,
    pullRequest: pullRequest?.number ?? null,
    headSha: pullRequest?.head.sha ?? null,
    baseSha: pullRequest?.base.sha ?? null,
    testedSha: env.GITHUB_SHA ?? null,
    runId: number(env.GITHUB_RUN_ID),
    runAttempt: number(env.GITHUB_RUN_ATTEMPT),
    steps,
    reports,
    problems,
    passed: problems.length === 0,
  };
}

const failingLimit = 20;

export function renderSummary(evidence: Evidence): string {
  const lines = [
    `## Validation evidence: ${evidence.passed ? 'passed' : 'FAILED'}`,
    '',
    `- PR head: ${evidence.headSha ?? 'not a pull request'}`,
    `- Tested commit (PR merged into base): ${evidence.testedSha ?? 'unknown'}`,
    `- Run: ${evidence.runId ?? 'local'} attempt ${evidence.runAttempt ?? '-'}`,
    '',
    '| Report | Tests | Failed | Errors | Skipped |',
    '| ------ | ----- | ------ | ------ | ------- |',
    ...evidence.reports.map(({ path, summary }) =>
      summary
        ? `| ${path} | ${summary.tests} | ${summary.failures} | ${summary.errors} | ${summary.skipped} |`
        : `| ${path} | missing or unreadable | | | |`
    ),
  ];
  if (Object.keys(evidence.steps).length > 0) {
    lines.push('', '| Step | Outcome |', '| ---- | ------- |');
    for (const [step, outcome] of Object.entries(evidence.steps)) {
      lines.push(`| ${step} | ${outcome || 'none'} |`);
    }
  }
  if (evidence.problems.length > 0) {
    lines.push('', '### Problems', '');
    lines.push(...evidence.problems.map((problem) => `- ${problem}`));
  }
  const failing = evidence.reports.flatMap(
    (report) => report.summary?.failing ?? []
  );
  if (failing.length > 0) {
    lines.push('', '### Failed tests', '');
    lines.push(
      ...failing.slice(0, failingLimit).map((name) => `- ${name}`),
      ...(failing.length > failingLimit
        ? [`- ...and ${failing.length - failingLimit} more (see the reports)`]
        : [])
    );
  }
  lines.push(
    '',
    'Reports, the Playwright HTML report and failure traces are in this run’s',
    '`validation-<head>-attempt-<n>` artifact. This summary comes from the',
    'pull request’s own workflow; verify it with `pnpm assess:pr <number>`.'
  );
  return lines.join('\n') + '\n';
}

function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const event =
    eventPath && existsSync(eventPath)
      ? (JSON.parse(readFileSync(eventPath, 'utf8')) as PullRequestEvent)
      : undefined;
  const evidence = collectEvidence(process.env, event, (path) =>
    existsSync(path) ? readFileSync(path, 'utf8') : undefined
  );
  const summary = renderSummary(evidence);
  mkdirSync(dirname(evidencePath), { recursive: true });
  writeFileSync(evidencePath, JSON.stringify(evidence, null, 2) + '\n');
  process.stdout.write(summary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  }
  process.exitCode = evidence.passed ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
