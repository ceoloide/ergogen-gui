// @vitest-environment node
import { execFile } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { afterEach, describe, expect, it } from 'vitest';
import { requiredReports } from '../scripts/ci/contract.mts';
import {
  collectEvidence,
  renderSummary,
  type Evidence,
} from '../scripts/ci/check-reports.mts';
import { checkReport, summarizeJUnit } from '../scripts/ci/junit.mts';

// Reports in tests/ci/reports are real tool output: unit.xml and browser.xml
// come from CI run 43552613099 (unit.xml trimmed to two suites), the others
// from Vitest 2 and Playwright runs of small probe tests. Machine paths and
// host names are replaced.
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const report = (name: string) =>
  readFileSync(join(projectRoot, 'tests/ci/reports', name), 'utf8');
const [unit, browser] = requiredReports;

describe('JUnit reports', () => {
  it('accepts the reports of a real passing CI run', () => {
    // Act
    const unitResult = checkReport(unit, report('unit.xml'));
    const browserResult = checkReport(browser, report('browser.xml'));

    // Assert
    expect(unitResult.problems).toEqual([]);
    expect(unitResult.summary).toMatchObject({
      tests: 11,
      failures: 0,
      errors: 0,
      skipped: 0,
    });
    expect(browserResult.problems).toEqual([]);
    expect(browserResult.summary).toMatchObject({
      tests: 24,
      skipped: 0,
      projects: ['chromium', 'chromium-subpath', 'chromium-subpath-update'],
    });
  });

  it.each([
    ['a missing report', unit, undefined, 'reports/unit.xml is missing'],
    [
      'an empty report (Vitest with --passWithNoTests)',
      unit,
      'unit-empty.xml',
      'reports/unit.xml is empty',
    ],
    [
      'a report without tests (Playwright with --pass-with-no-tests)',
      browser,
      'browser-no-tests.xml',
      'reports/browser.xml contains no tests',
    ],
    [
      'a skipped Vitest test, although Vitest exited 0',
      unit,
      'unit-skipped.xml',
      'reports/unit.xml skipped 1 tests; the contract allows no skipped tests',
    ],
    [
      'a fully skipped Vitest suite',
      unit,
      'unit-all-skipped.xml',
      'reports/unit.xml skipped 1 tests; the contract allows no skipped tests',
    ],
    [
      'a skipped Playwright test, although Playwright exited 0',
      browser,
      'browser-skipped.xml',
      'reports/browser.xml skipped 1 tests; the contract allows no skipped tests',
    ],
    [
      'a failed test',
      unit,
      'unit-failed.xml',
      'reports/unit.xml has 1 failed tests',
    ],
    [
      'a test file that failed to load',
      unit,
      'unit-load-error.xml',
      'reports/unit.xml has 1 failed tests',
    ],
    [
      'a browser report missing a required project',
      browser,
      'browser-skipped.xml',
      'reports/browser.xml has no tests from the chromium-subpath-update project',
    ],
  ])('rejects %s', (_case, required, file, expected) => {
    // Act
    const result = checkReport(required, file && report(file));

    // Assert
    expect(result.problems).toContain(expected);
  });

  it('rejects a truncated report', () => {
    // Arrange: an upload or write cut short.
    const truncated = report('browser.xml').slice(0, 2000);

    // Act
    const result = checkReport(browser, truncated);

    // Assert
    expect(result.problems).toEqual([
      'reports/browser.xml is not well-formed XML',
    ]);
  });

  it('rejects a file that is not a JUnit report', () => {
    // Act
    const result = checkReport(unit, '<html><body>Report</body></html>');

    // Assert
    expect(result.problems).toEqual([
      'reports/unit.xml has root <html>, not <testsuites>',
    ]);
  });

  it('keeps a failure that the root declares but no testcase shows', () => {
    // Arrange
    const xml = report('unit.xml').replace(
      '<testsuites name="vitest tests" tests="11" failures="0"',
      '<testsuites name="vitest tests" tests="11" failures="1"'
    );

    // Act
    const summary = summarizeJUnit(xml);

    // Assert
    expect(summary.failures).toBe(1);
  });

  it('names failed tests for triage', () => {
    // Act
    const summary = summarizeJUnit(report('unit-load-error.xml'));

    // Assert
    expect(summary.failing).toEqual(['broken.test.ts › broken.test.ts']);
  });
});

// Shaped like a real pull_request event payload, reduced to the fields read.
const event = {
  pull_request: {
    number: 238,
    head: { sha: 'f5d30bd0ab85e91863ac259e94b3a7ce853640b9' },
    base: { sha: 'c6eb0718b66629dbf27dd7f1784baeeb9931e2e1' },
  },
};
const ciEnv = {
  GITHUB_REPOSITORY: 'ceoloide/ergogen-gui',
  GITHUB_SHA: '8dbd3992c61ea57d564efe5f18b66d465a200960',
  GITHUB_RUN_ID: '43552613099',
  GITHUB_RUN_ATTEMPT: '1',
  STEP_OUTCOME_VALIDATE: 'success',
  STEP_OUTCOME_BROWSER: 'success',
};
const realReports = (path: string) =>
  ({
    'reports/unit.xml': report('unit.xml'),
    'reports/browser.xml': report('browser.xml'),
  })[path];

describe('validation evidence', () => {
  it('records the PR head and the tested merge commit separately', () => {
    // Act
    const evidence = collectEvidence(ciEnv, event, realReports);

    // Assert
    expect(evidence).toMatchObject({
      pullRequest: 238,
      headSha: 'f5d30bd0ab85e91863ac259e94b3a7ce853640b9',
      baseSha: 'c6eb0718b66629dbf27dd7f1784baeeb9931e2e1',
      testedSha: '8dbd3992c61ea57d564efe5f18b66d465a200960',
      runId: 43552613099,
      runAttempt: 1,
      steps: { validate: 'success', browser: 'success' },
      problems: [],
      passed: true,
    });
  });

  it('fails when a validation step did not succeed', () => {
    // Arrange: Validate failed, so the browser step never ran.
    const env = {
      ...ciEnv,
      STEP_OUTCOME_VALIDATE: 'failure',
      STEP_OUTCOME_BROWSER: 'skipped',
    };

    // Act
    const evidence = collectEvidence(env, event, () => undefined);

    // Assert
    expect(evidence.passed).toBe(false);
    expect(evidence.problems).toEqual([
      'step validate ended with failure',
      'step browser ended with skipped',
      'reports/unit.xml is missing',
      'reports/browser.xml is missing',
    ]);
  });

  it('summarizes identities, counts, problems and failed tests', () => {
    // Arrange
    const evidence: Evidence = collectEvidence(ciEnv, event, (path) =>
      path === 'reports/unit.xml' ? report('unit-load-error.xml') : undefined
    );

    // Act
    const summary = renderSummary(evidence);

    // Assert
    expect(summary).toContain('## Validation evidence: FAILED');
    expect(summary).toContain(
      '- PR head: f5d30bd0ab85e91863ac259e94b3a7ce853640b9'
    );
    expect(summary).toContain(
      '- Tested commit (PR merged into base): 8dbd3992c61ea57d564efe5f18b66d465a200960'
    );
    expect(summary).toContain('| reports/unit.xml | 2 | 1 | 0 | 0 |');
    expect(summary).toContain('- reports/browser.xml is missing');
    expect(summary).toContain('- broken.test.ts › broken.test.ts');
  });
});

// These tests start Node and import jsdom or Playwright, which can take
// several seconds on a loaded machine.
const processTimeout = 30_000;

describe('pnpm test:reports', { timeout: processTimeout }, () => {
  const execFileAsync = promisify(execFile);
  let workspace: string;
  afterEach(() => rmSync(workspace, { recursive: true, force: true }));

  const runCheck = async (reports: Record<string, string>) => {
    workspace = mkdtempSync(join(tmpdir(), 'check-reports-'));
    mkdirSync(join(workspace, 'reports'));
    for (const [path, content] of Object.entries(reports)) {
      writeFileSync(join(workspace, path), content);
    }
    const eventPath = join(workspace, 'event.json');
    const summaryPath = join(workspace, 'summary.md');
    writeFileSync(eventPath, JSON.stringify(event));
    writeFileSync(summaryPath, '');
    const script = join(projectRoot, 'scripts/ci/check-reports.mts');
    const { exitCode, stderr } = await execFileAsync(
      process.execPath,
      [script],
      {
        cwd: workspace,
        env: {
          PATH: process.env.PATH,
          ...ciEnv,
          GITHUB_EVENT_PATH: eventPath,
          GITHUB_STEP_SUMMARY: summaryPath,
        },
      }
    ).then(
      ({ stderr }) => ({ exitCode: 0, stderr }),
      (error: { code: number; stderr: string }) => ({
        exitCode: error.code,
        stderr: error.stderr,
      })
    );
    return {
      exitCode,
      stderr,
      summary: readFileSync(summaryPath, 'utf8'),
      evidence: JSON.parse(
        readFileSync(join(workspace, 'reports/evidence.json'), 'utf8')
      ) as Evidence,
    };
  };

  it('runs under Node, passes real reports and writes the evidence', async () => {
    // Act
    const result = await runCheck({
      'reports/unit.xml': report('unit.xml'),
      'reports/browser.xml': report('browser.xml'),
    });

    // Assert
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.evidence.passed).toBe(true);
    expect(result.summary).toContain('## Validation evidence: passed');
  });

  it('exits nonzero for a skipped test even though the runner exited 0', async () => {
    // Act
    const result = await runCheck({
      'reports/unit.xml': report('unit-skipped.xml'),
      'reports/browser.xml': report('browser.xml'),
    });

    // Assert
    expect(result.exitCode).toBe(1);
    expect(result.evidence.problems).toEqual([
      'reports/unit.xml skipped 1 tests; the contract allows no skipped tests',
    ]);
    expect(result.summary).toContain('## Validation evidence: FAILED');
  });
});

describe('browser report contract', { timeout: processTimeout }, () => {
  it('requires exactly the Playwright projects that the config defines', async () => {
    // Arrange
    const config = (await import('../playwright.config.mts')).default;

    // Assert
    expect(config.projects?.map((project) => project.name).sort()).toEqual(
      [...browser.projects].sort()
    );
  });
});
