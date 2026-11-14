// The pull request validation contract. CI's report check, the read-only
// assessor and the proposed ruleset all read it, and
// tests/workflow-security.test.ts checks that ci.yaml, playwright.config.mts
// and the ruleset proposal agree with it. Change them together.

/** The only workflow whose runs count as pull request validation. */
export const workflowPath = '.github/workflows/ci.yaml';

/** The job, and therefore the check run name, that branch rules require. */
export const requiredJob = 'lint-and-test';

/** The GitHub Actions app, which creates the check run for each job. */
export const githubActionsAppId = 15368;

/** Steps of the required job that must each conclude with success. */
export const requiredSteps = [
  'Validate',
  'Browser acceptance',
  'Check test reports',
  'Upload validation reports',
] as const;

/**
 * Names the reports artifact after the PR head that was tested and the run
 * attempt that produced it, so a rerun never reuses an older attempt's files.
 */
export const artifactName = (headSha: string, runAttempt: number | string) =>
  `validation-${headSha}-attempt-${runAttempt}`;

/** Written by scripts/ci/check-reports.mts into the artifact. */
export const evidencePath = 'reports/evidence.json';

export interface RequiredReport {
  name: string;
  path: string;
  /** Playwright projects (JUnit `hostname`) that must each contribute tests. */
  projects: readonly string[];
}

/**
 * Every report must exist, hold at least one test, and have no failures,
 * errors or skipped tests. Counts are deliberately not pinned.
 */
export const requiredReports: readonly RequiredReport[] = [
  { name: 'unit', path: 'reports/unit.xml', projects: [] },
  {
    name: 'browser',
    path: 'reports/browser.xml',
    projects: ['chromium', 'chromium-subpath', 'chromium-subpath-update'],
  },
];
