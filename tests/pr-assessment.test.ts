// @vitest-environment node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';
import {
  assessPullRequest,
  renderAssessment,
  type GitHubReader,
} from '../scripts/ci/assess-pr.mts';

// tests/ci/github holds real GitHub REST responses, reduced to the fields the
// assessor reads: PR #238, CI run 43552613099 that tested its final head
// (passed), and CI run 43472356159 from PR #217 (failed installing the
// browser). Reports come from tests/ci/reports.
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) =>
  readFileSync(join(projectRoot, 'tests/ci', path), 'utf8');
const api = <T>(name: string) => JSON.parse(read(`github/${name}.json`)) as T;

// The recorded fields that the tests change, typed for those changes.
interface Pull {
  state: string;
  head: { sha: string };
  base: { sha: string };
}
interface Run {
  id: number;
  path: string;
  status: string;
  conclusion: string | null;
  head_sha: string;
  run_attempt?: number;
  run_started_at: string;
}
interface Step {
  name: string;
  status: string;
  conclusion: string;
  number: number;
}
interface Check {
  id: number;
  details_url: string;
  app: { id: number; slug: string };
}
interface Artifact {
  id: number;
  name: string;
  digest: string;
  expired: boolean;
  workflow_run: { id: number };
}
interface Responses {
  pull: Pull;
  runs: { workflow_runs: Run[] };
  jobs: { jobs: { conclusion: string; steps: Step[] }[] };
  'check-runs': { check_runs: Check[] };
  artifacts: { artifacts: Artifact[] };
  'tested-commit': { parents: { sha: string }[] };
}
const recorded = <K extends keyof Responses>(name: K) =>
  api<Responses[K]>(name);

const repo = 'ceoloide/ergogen-gui';
const head = 'f5d30bd0ab85e91863ac259e94b3a7ce853640b9';
const base = 'c6eb0718b66629dbf27dd7f1784baeeb9931e2e1';
const tested = '8dbd3992c61ea57d564efe5f18b66d465a200960';
const runId = 43552613099;
const jobId = 132318234329;

/**
 * The real responses as they would read for PR #238 just before it merged,
 * under this contract. Only three things differ from the recorded run, all
 * because it predates the contract: the PR is open again, the job has the
 * "Check test reports" step, and the artifact has the contract's name and
 * evidence file.
 */
function scenario() {
  const pull = recorded('pull');
  pull.state = 'open';
  const jobs = recorded('jobs');
  const steps = jobs.jobs[0].steps;
  const upload = steps.findIndex(
    (step) => step.name === 'Upload validation reports'
  );
  steps.splice(upload, 0, {
    name: 'Check test reports',
    status: 'completed',
    conclusion: 'success',
    number: upload + 1,
  });
  const artifacts = recorded('artifacts');
  artifacts.artifacts[0].name = `validation-${head}-attempt-1`;
  const files: Record<string, string> = {
    'reports/unit.xml': read('reports/unit.xml'),
    'reports/browser.xml': read('reports/browser.xml'),
    'reports/evidence.json': JSON.stringify({
      schema: 1,
      pullRequest: 238,
      headSha: head,
      baseSha: base,
      testedSha: tested,
      runId,
      runAttempt: 1,
    }),
  };
  return {
    pull,
    pullAfter: undefined as Pull | undefined,
    runs: recorded('runs'),
    jobs,
    checks: recorded('check-runs'),
    artifacts,
    testedCommit: recorded('tested-commit'),
    files,
    /** Replace the downloaded archive, keeping the published digest. */
    tamper: undefined as ((zip: Uint8Array) => Uint8Array) | undefined,
  };
}
type Scenario = ReturnType<typeof scenario>;

/** Answers exactly these REST paths, in order for repeated reads. */
function serve(
  responses: Record<string, unknown[]>,
  downloads: Record<string, Uint8Array> = {}
) {
  const requests: string[] = [];
  const github: GitHubReader = {
    json: async (path) => {
      requests.push(path);
      const answers = responses[path];
      if (!answers) throw new Error(`unexpected request ${path}`);
      return structuredClone(answers.length > 1 ? answers.shift() : answers[0]);
    },
    bytes: async (path) => {
      requests.push(path);
      if (!downloads[path]) throw new Error(`unexpected download ${path}`);
      return downloads[path];
    },
  };
  return { github, requests };
}

async function assess(world: Scenario, allowClosed = false) {
  const archive = new JSZip();
  for (const [path, content] of Object.entries(world.files)) {
    archive.file(path, content);
  }
  const zip = await archive.generateAsync({ type: 'uint8array' });
  const artifact = world.artifacts.artifacts[0];
  // The published digest describes the archive as uploaded.
  artifact.digest = `sha256:${createHash('sha256').update(zip).digest('hex')}`;
  const selected = world.runs.workflow_runs.reduce((newest, run) =>
    run.id > newest.id ? run : newest
  );
  const sha = world.pull.head.sha;
  const at = `repos/${repo}`;
  const { github, requests } = serve(
    {
      [`${at}/pulls/238`]: [world.pull, world.pullAfter ?? world.pull],
      [`${at}/actions/workflows/ci.yaml/runs?head_sha=${sha}&event=pull_request&per_page=100`]:
        [world.runs],
      [`${at}/actions/runs/${selected.id}/attempts/${selected.run_attempt}/jobs?per_page=100`]:
        [world.jobs],
      [`${at}/commits/${sha}/check-runs?check_name=lint-and-test&filter=latest&per_page=100`]:
        [world.checks],
      [`${at}/actions/runs/${selected.id}/artifacts?name=validation-${sha}-attempt-${selected.run_attempt}&per_page=100`]:
        [world.artifacts],
      [`${at}/commits/${tested}`]: [world.testedCommit],
    },
    {
      [`${at}/actions/artifacts/${artifact.id}/zip`]: world.tamper
        ? world.tamper(zip)
        : zip,
    }
  );
  const result = await assessPullRequest(github, {
    repo,
    pullRequest: 238,
    allowClosed,
  });
  return { result, requests };
}

describe('PR assessment', () => {
  it('passes the verified head with green checks and valid reports', async () => {
    // Act
    const { result, requests } = await assess(scenario());

    // Assert
    expect(result.problems).toEqual([]);
    expect(result).toMatchObject({
      passed: true,
      headSha: head,
      baseSha: base,
      testedSha: tested,
      testedBaseSha: base,
      run: { id: runId, attempt: 1 },
      job: { id: jobId },
      artifact: { id: 14096694474, name: `validation-${head}-attempt-1` },
    });
    expect(result.reports.map((report) => report.summary?.tests)).toEqual([
      11, 24,
    ]);
    // Reads only; the PR is read again last to detect a concurrent push.
    expect(requests.at(0)).toBe(requests.at(-1));
    expect(renderAssessment(result)).toContain(`PR #238 in ${repo}: PASSED`);
  });

  it('reports the original merged PR as merged, not as passing', async () => {
    // Arrange
    const world = scenario();
    world.pull.state = 'closed';

    // Act
    const strict = await assess(world);
    const audit = await assess(scenario(), true);

    // Assert
    expect(strict.result.passed).toBe(false);
    expect(strict.result.problems).toContain('PR #238 is closed, not open');
    expect(audit.result.passed).toBe(true);
  });

  type Case = [string, (world: Scenario) => void, string];
  const cases: Case[] = [
    [
      'a newer head without a CI run (stale evidence)',
      (world) => {
        world.pull.head.sha = 'a'.repeat(40);
        world.runs.workflow_runs[0].head_sha = head;
      },
      `no .github/workflows/ci.yaml pull_request run exists for head ${'a'.repeat(40)}`,
    ],
    [
      'a run of another workflow file named CI',
      (world) => {
        world.runs.workflow_runs[0].path = '.github/workflows/spoof.yaml';
      },
      `no .github/workflows/ci.yaml pull_request run exists for head ${head}`,
    ],
    [
      'a pending run',
      (world) => {
        world.runs.workflow_runs[0].status = 'in_progress';
        world.runs.workflow_runs[0].conclusion = null;
      },
      `run ${runId} attempt 1 is still in_progress`,
    ],
    [
      'a cancelled run',
      (world) => {
        world.runs.workflow_runs[0].conclusion = 'cancelled';
        world.jobs.jobs[0].conclusion = 'cancelled';
      },
      'job lint-and-test concluded cancelled',
    ],
    [
      'a skipped required job in a green run',
      (world) => {
        world.jobs.jobs[0].conclusion = 'skipped';
      },
      'job lint-and-test concluded skipped',
    ],
    [
      'a green job without the browser step',
      (world) => {
        world.jobs.jobs[0].steps = world.jobs.jobs[0].steps.filter(
          (step) => step.name !== 'Browser acceptance'
        );
      },
      'lint-and-test has 0 "Browser acceptance" steps',
    ],
    [
      'a missing required check run',
      (world) => {
        world.checks.check_runs = [];
      },
      `lint-and-test job ${jobId} is not the latest check on ${head}`,
    ],
    [
      'a same-named check from another workflow',
      (world) => {
        world.checks.check_runs.push({
          ...world.checks.check_runs[0],
          id: 999,
          details_url:
            'https://github.com/ceoloide/ergogen-gui/actions/runs/1/job/999',
        });
      },
      `another lint-and-test check exists on ${head}: https://github.com/ceoloide/ergogen-gui/actions/runs/1/job/999`,
    ],
    [
      'a check with the job id from another app',
      (world) => {
        world.checks.check_runs[0].app = { id: 1, slug: 'spoof' };
      },
      `another lint-and-test check exists on ${head}`,
    ],
    [
      'an artifact from another run',
      (world) => {
        world.artifacts.artifacts[0].workflow_run.id = 1;
      },
      `artifact 14096694474 is not from run ${runId} of ${head}`,
    ],
    [
      'an artifact uploaded before the current attempt started',
      (world) => {
        world.runs.workflow_runs[0].run_started_at = '2026-11-14T04:00:00Z';
      },
      'artifact 14096694474 predates attempt 1',
    ],
    [
      'a rerun whose only artifact is from the first attempt',
      (world) => {
        world.runs.workflow_runs[0].run_attempt = 2;
      },
      `run ${runId} has 0 artifacts named validation-${head}-attempt-2`,
    ],
    [
      'jobs listed for another attempt',
      (world) => {
        world.runs.workflow_runs[0].run_attempt = 2;
      },
      `job lint-and-test is not from attempt 2 of ${head}`,
    ],
    [
      'an expired artifact',
      (world) => {
        world.artifacts.artifacts[0].expired = true;
      },
      'artifact 14096694474 has expired; rerun the workflow',
    ],
    [
      'an artifact whose content does not match its digest',
      (world) => {
        world.tamper = (zip) => zip.slice(0, -1);
      },
      'artifact 14096694474 digest',
    ],
    [
      'a missing unit report',
      (world) => {
        delete world.files['reports/unit.xml'];
      },
      'reports/unit.xml is missing',
    ],
    [
      'skipped browser tests in a green job',
      (world) => {
        world.files['reports/browser.xml'] = read(
          'reports/browser-skipped.xml'
        );
      },
      'reports/browser.xml skipped 1 tests; the contract allows no skipped tests',
    ],
    [
      'an empty unit report',
      (world) => {
        world.files['reports/unit.xml'] = read('reports/unit-empty.xml');
      },
      'reports/unit.xml is empty',
    ],
    [
      'evidence written for another attempt',
      (world) => {
        const evidence = JSON.parse(world.files['reports/evidence.json']);
        world.files['reports/evidence.json'] = JSON.stringify({
          ...evidence,
          runAttempt: 2,
        });
      },
      'reports/evidence.json describes another PR, head, run or attempt',
    ],
    [
      'evidence without the tested commit',
      (world) => {
        const evidence = JSON.parse(world.files['reports/evidence.json']);
        delete evidence.testedSha;
        world.files['reports/evidence.json'] = JSON.stringify(evidence);
      },
      'reports/evidence.json does not name the tested commit',
    ],
    [
      'a tested commit that does not merge this head',
      (world) => {
        world.testedCommit.parents[1].sha = 'b'.repeat(40);
      },
      `tested commit ${tested} is not a merge of ${head}`,
    ],
    [
      'a base that moved after CI tested the merge',
      (world) => {
        world.pull.base.sha = 'c'.repeat(40);
      },
      `CI tested against base ${base}, but the PR base is now ${'c'.repeat(40)}; update the branch`,
    ],
    [
      'a push during the assessment',
      (world) => {
        world.pullAfter = structuredClone(world.pull);
        world.pullAfter.head.sha = 'd'.repeat(40);
      },
      `PR #238 changed during assessment (head ${'d'.repeat(40)}`,
    ],
  ];
  it.each(cases)('fails for %s', async (_case, change, expected) => {
    // Arrange
    const world = scenario();
    change(world);

    // Act
    const { result } = await assess(world);

    // Assert
    expect(result.passed).toBe(false);
    expect(result.problems.join('\n')).toContain(expected);
  });

  it('fails for the real failed run of PR #217', async () => {
    // Arrange: run 43472356159 and its responses as recorded, with the PR
    // head it tested.
    const failedHead = '7ee6fd1e77e952c3ad5bca921b9d0d581d8ba45f';
    const failedRun = 43472356159;
    const failedJob = 132047237194;
    const pull = recorded('pull');
    pull.state = 'open';
    pull.head.sha = failedHead;
    const at = `repos/${repo}`;
    const { github } = serve({
      [`${at}/pulls/238`]: [pull],
      [`${at}/actions/workflows/ci.yaml/runs?head_sha=${failedHead}&event=pull_request&per_page=100`]:
        [api<unknown>('failed-runs')],
      [`${at}/actions/runs/${failedRun}/attempts/1/jobs?per_page=100`]: [
        api<unknown>('failed-jobs'),
      ],
      [`${at}/commits/${failedHead}/check-runs?check_name=lint-and-test&filter=latest&per_page=100`]:
        [api<unknown>('failed-check-runs')],
      [`${at}/actions/runs/${failedRun}/artifacts?name=validation-${failedHead}-attempt-1&per_page=100`]:
        [api<unknown>('failed-artifacts')],
    });

    // Act
    const result = await assessPullRequest(github, {
      repo,
      pullRequest: 238,
    });

    // Assert
    expect(result.passed).toBe(false);
    expect(result.problems).toEqual([
      `run ${failedRun} attempt 1 concluded failure`,
      'job lint-and-test concluded failure',
      'step "Browser acceptance" concluded skipped',
      'lint-and-test has 0 "Check test reports" steps',
      `check ${failedJob} concluded failure`,
      `run ${failedRun} has 0 artifacts named validation-${failedHead}-attempt-1`,
    ]);
  });

  it('judges the newest run, not an older green one', async () => {
    // Arrange: a later run of the same head (for example after reopening
    // the PR) failed.
    const world = scenario();
    world.runs.workflow_runs.push({
      ...world.runs.workflow_runs[0],
      id: runId + 1,
      conclusion: 'failure',
    });

    // Act
    const { result } = await assess(world);

    // Assert
    expect(result.passed).toBe(false);
    expect(result.problems.join('\n')).toContain(
      `run ${runId + 1} attempt 1 concluded failure`
    );
  });

  it('refuses a response whose shape changed', async () => {
    // Arrange
    const world = scenario();
    delete world.runs.workflow_runs[0].run_attempt;

    // Act and assert
    await expect(assess(world)).rejects.toThrow(
      'run.run_attempt is not a number'
    );
  });
});
