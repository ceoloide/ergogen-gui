// Read-only assessment of a pull request's CI evidence:
//
//   pnpm assess:pr <number> [--repo owner/name] [--json] [--allow-closed]
//
// Run it from a trusted checkout (main), never from the PR branch: the PR can
// change its own workflow and scripts, so everything its run produced is
// checked against the GitHub API here. It only reads, through `gh api`.
// Exit status: 0 when every check passes, 1 when any fails, 2 when the
// assessment could not run.
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import JSZip from 'jszip';
import {
  artifactName,
  evidencePath,
  githubActionsAppId,
  requiredJob,
  requiredReports,
  requiredSteps,
  workflowPath,
} from './contract.mts';
import { checkReport, type JUnitSummary } from './junit.mts';

/** The network boundary: GitHub REST paths in, parsed JSON or bytes out. */
export interface GitHubReader {
  json(path: string): Promise<unknown>;
  bytes(path: string): Promise<Uint8Array>;
}

export interface AssessmentOptions {
  repo: string;
  pullRequest: number;
  /** Assess a closed or merged PR for audit. Never use for a merge decision. */
  allowClosed?: boolean;
}

export interface Assessment {
  passed: boolean;
  repo: string;
  pullRequest: number;
  headSha?: string;
  baseSha?: string;
  testedSha?: string;
  testedBaseSha?: string;
  run?: { id: number; attempt: number; url: string };
  job?: { id: number; url: string };
  artifact?: { id: number; name: string; digest: string };
  reports: { path: string; summary?: JUnitSummary }[];
  problems: string[];
}

/** Artifacts beyond this size are refused rather than downloaded. */
export const maxArtifactBytes = 100 * 1024 * 1024;

// Small typed views of the REST responses. `read` rejects a response whose
// fields have unexpected types, so a changed API fails closed.
type Json = Record<string, unknown>;
class ApiShapeError extends Error {}
const object = (value: unknown, where: string): Json => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new ApiShapeError(`${where} is not an object`);
  }
  return value as Json;
};
const field = <T extends 'string' | 'number' | 'boolean'>(
  source: Json,
  key: string,
  type: T,
  where: string
) => {
  const value = source[key];
  if (typeof value !== type) {
    throw new ApiShapeError(`${where}.${key} is not a ${type}`);
  }
  return value as T extends 'string'
    ? string
    : T extends 'number'
      ? number
      : boolean;
};
const optionalString = (source: Json, key: string) =>
  typeof source[key] === 'string' ? (source[key] as string) : null;
const list = (value: unknown, key: string, where: string) => {
  const items = object(value, where)[key];
  if (!Array.isArray(items)) {
    throw new ApiShapeError(`${where}.${key} is not an array`);
  }
  return items.map((item, index) => object(item, `${where}.${key}[${index}]`));
};

interface PullRequest {
  state: string;
  headSha: string;
  headRepo: string | null;
  baseSha: string;
  baseRef: string;
}
const readPullRequest = (value: unknown): PullRequest => {
  const pr = object(value, 'pull request');
  const head = object(pr.head, 'pull request.head');
  const base = object(pr.base, 'pull request.base');
  const repo = head.repo === null ? null : object(head.repo, 'head.repo');
  return {
    state: field(pr, 'state', 'string', 'pull request'),
    headSha: field(head, 'sha', 'string', 'head'),
    headRepo: repo && field(repo, 'full_name', 'string', 'head.repo'),
    baseSha: field(base, 'sha', 'string', 'base'),
    baseRef: field(base, 'ref', 'string', 'base'),
  };
};

export async function assessPullRequest(
  github: GitHubReader,
  { repo, pullRequest, allowClosed = false }: AssessmentOptions
): Promise<Assessment> {
  const result: Assessment = {
    passed: false,
    repo,
    pullRequest,
    reports: [],
    problems: [],
  };
  const problem = (text: string) => result.problems.push(text);
  const api = `repos/${repo}`;

  // 1. The PR as it is now.
  const pr = readPullRequest(await github.json(`${api}/pulls/${pullRequest}`));
  const head = pr.headSha;
  result.headSha = head;
  result.baseSha = pr.baseSha;
  if (pr.state !== 'open' && !allowClosed) {
    problem(`PR #${pullRequest} is ${pr.state}, not open`);
  }
  if (pr.baseRef !== 'main') problem(`PR targets ${pr.baseRef}, not main`);

  // 2. The newest run of the CI workflow file for exactly this head.
  const runs = list(
    await github.json(
      `${api}/actions/workflows/${workflowPath.split('/').pop()}/runs` +
        `?head_sha=${head}&event=pull_request&per_page=100`
    ),
    'workflow_runs',
    'runs'
  ).filter(
    (run) =>
      run.path === workflowPath &&
      run.event === 'pull_request' &&
      run.head_sha === head
  );
  if (runs.length === 0) {
    problem(`no ${workflowPath} pull_request run exists for head ${head}`);
    return finish(result);
  }
  const run = runs.reduce((newest, candidate) =>
    field(candidate, 'id', 'number', 'run') >
    field(newest, 'id', 'number', 'run')
      ? candidate
      : newest
  );
  const runId = field(run, 'id', 'number', 'run');
  const attempt = field(run, 'run_attempt', 'number', 'run');
  const runStartedAt = field(run, 'run_started_at', 'string', 'run');
  result.run = {
    id: runId,
    attempt,
    url: field(run, 'html_url', 'string', 'run'),
  };
  const runRepo = object(run.head_repository, 'run.head_repository');
  if (pr.headRepo && runRepo.full_name !== pr.headRepo) {
    problem(
      `run ${runId} built ${String(runRepo.full_name)}, not ${pr.headRepo}`
    );
  }
  const linked = list(run, 'pull_requests', 'run').map((link) => link.number);
  if (linked.length > 0 && !linked.includes(pullRequest)) {
    problem(`run ${runId} belongs to PR #${linked.join(', #')}`);
  }
  const status = field(run, 'status', 'string', 'run');
  if (status !== 'completed') {
    problem(`run ${runId} attempt ${attempt} is still ${status}`);
    return finish(result);
  }
  const conclusion = optionalString(run, 'conclusion');
  if (conclusion !== 'success') {
    problem(`run ${runId} attempt ${attempt} concluded ${conclusion}`);
  }

  // 3. Every job of that attempt, including the required one and its steps.
  const jobs = list(
    await github.json(
      `${api}/actions/runs/${runId}/attempts/${attempt}/jobs?per_page=100`
    ),
    'jobs',
    'jobs'
  );
  for (const job of jobs) {
    const name = field(job, 'name', 'string', 'job');
    if (job.run_attempt !== attempt || job.head_sha !== head) {
      problem(`job ${name} is not from attempt ${attempt} of ${head}`);
    }
    if (job.conclusion !== 'success') {
      problem(`job ${name} concluded ${String(job.conclusion ?? job.status)}`);
    }
  }
  const required = jobs.filter((job) => job.name === requiredJob);
  if (required.length !== 1) {
    problem(`attempt ${attempt} has ${required.length} ${requiredJob} jobs`);
    return finish(result);
  }
  const job = required[0];
  const jobId = field(job, 'id', 'number', 'job');
  result.job = { id: jobId, url: field(job, 'html_url', 'string', 'job') };
  const steps = list(job, 'steps', 'job');
  for (const step of requiredSteps) {
    const found = steps.filter((candidate) => candidate.name === step);
    if (found.length !== 1) {
      problem(`${requiredJob} has ${found.length} "${step}" steps`);
    } else if (found[0].conclusion !== 'success') {
      problem(`step "${step}" concluded ${String(found[0].conclusion)}`);
    }
  }

  // 4. The check run that branch rules would see for this name. A job's id
  // is its check run id, so a same-named check from any other workflow,
  // app or attempt makes the result ambiguous.
  const checks = list(
    await github.json(
      `${api}/commits/${head}/check-runs?check_name=${requiredJob}&filter=latest&per_page=100`
    ),
    'check_runs',
    'check runs'
  );
  for (const check of checks) {
    const app = object(check.app, 'check.app');
    if (check.id !== jobId || app.id !== githubActionsAppId) {
      problem(
        `another ${requiredJob} check exists on ${head}: ${String(check.details_url ?? check.id)}`
      );
    }
  }
  const check = checks.find((candidate) => candidate.id === jobId);
  if (!check) {
    problem(`${requiredJob} job ${jobId} is not the latest check on ${head}`);
  } else if (check.conclusion !== 'success' || check.head_sha !== head) {
    problem(`check ${jobId} concluded ${String(check.conclusion)}`);
  }

  // 5. This attempt's reports artifact, bound by run, head, time and digest.
  const name = artifactName(head, attempt);
  const artifacts = list(
    await github.json(
      `${api}/actions/runs/${runId}/artifacts?name=${name}&per_page=100`
    ),
    'artifacts',
    'artifacts'
  ).filter((artifact) => artifact.name === name);
  if (artifacts.length !== 1) {
    problem(`run ${runId} has ${artifacts.length} artifacts named ${name}`);
    return finish(result);
  }
  const artifact = artifacts[0];
  const artifactId = field(artifact, 'id', 'number', 'artifact');
  const digest = optionalString(artifact, 'digest') ?? '';
  result.artifact = { id: artifactId, name, digest };
  const origin = object(artifact.workflow_run, 'artifact.workflow_run');
  if (origin.id !== runId || origin.head_sha !== head) {
    problem(`artifact ${artifactId} is not from run ${runId} of ${head}`);
  }
  if (field(artifact, 'created_at', 'string', 'artifact') < runStartedAt) {
    problem(`artifact ${artifactId} predates attempt ${attempt}`);
  }
  if (artifact.expired !== false) {
    problem(`artifact ${artifactId} has expired; rerun the workflow`);
    return finish(result);
  }
  if (
    field(artifact, 'size_in_bytes', 'number', 'artifact') > maxArtifactBytes
  ) {
    problem(`artifact ${artifactId} exceeds ${maxArtifactBytes} bytes`);
    return finish(result);
  }
  const zip = await github.bytes(`${api}/actions/artifacts/${artifactId}/zip`);
  const actual = `sha256:${createHash('sha256').update(zip).digest('hex')}`;
  if (actual !== digest) {
    problem(
      `artifact ${artifactId} digest ${actual} does not match ${digest || 'none'}`
    );
    return finish(result);
  }
  const archive = await JSZip.loadAsync(zip);
  const entry = (path: string) => archive.file(path)?.async('string');

  // 6. Reports, checked again with this checkout's code.
  for (const report of requiredReports) {
    const checked = checkReport(report, await entry(report.path));
    result.reports.push({ path: report.path, summary: checked.summary });
    checked.problems.forEach(problem);
  }

  // 7. The tested commit: the run's own record, verified as a merge of this
  // head into the PR's current base.
  const evidenceText = await entry(evidencePath);
  if (evidenceText === undefined) {
    problem(`artifact ${artifactId} has no ${evidencePath}`);
  } else {
    let evidence: Json;
    try {
      evidence = object(JSON.parse(evidenceText), 'evidence');
    } catch {
      evidence = {};
      problem(`${evidencePath} is not a JSON object`);
    }
    if (
      evidence.headSha !== head ||
      evidence.runId !== runId ||
      evidence.runAttempt !== attempt ||
      evidence.pullRequest !== pullRequest
    ) {
      problem(`${evidencePath} describes another PR, head, run or attempt`);
    }
    if (typeof evidence.testedSha === 'string') {
      const tested = object(
        await github.json(`${api}/commits/${evidence.testedSha}`),
        'tested commit'
      );
      const parents = list(tested, 'parents', 'tested commit').map(
        (parent) => parent.sha
      );
      result.testedSha = evidence.testedSha;
      if (parents.length !== 2 || parents[1] !== head) {
        problem(
          `tested commit ${evidence.testedSha} is not a merge of ${head}`
        );
      } else {
        result.testedBaseSha = String(parents[0]);
        if (parents[0] !== pr.baseSha) {
          problem(
            `CI tested against base ${String(parents[0])}, but the PR base is now ${pr.baseSha}; update the branch`
          );
        }
      }
    } else {
      problem(`${evidencePath} does not name the tested commit`);
    }
  }

  // 8. The PR must not have moved while it was assessed.
  const after = readPullRequest(
    await github.json(`${api}/pulls/${pullRequest}`)
  );
  if (after.headSha !== head || after.baseSha !== pr.baseSha) {
    problem(
      `PR #${pullRequest} changed during assessment (head ${after.headSha}, base ${after.baseSha}); assess again`
    );
  }
  return finish(result);
}

const finish = (result: Assessment) => ({
  ...result,
  passed: result.problems.length === 0,
});

export function renderAssessment(result: Assessment): string {
  const lines = [
    `PR #${result.pullRequest} in ${result.repo}: ${result.passed ? 'PASSED' : 'FAILED'}`,
    `  PR head:        ${result.headSha ?? '-'}`,
    `  PR base:        ${result.baseSha ?? '-'}`,
    `  Tested merge:   ${result.testedSha ?? '-'} (base ${result.testedBaseSha ?? '-'})`,
    `  Run:            ${result.run ? `${result.run.url} attempt ${result.run.attempt}` : '-'}`,
    `  Job:            ${result.job?.url ?? '-'}`,
    `  Artifact:       ${result.artifact ? `${result.artifact.name} (${result.artifact.id}, ${result.artifact.digest})` : '-'}`,
    ...result.reports.map(
      ({ path, summary }) =>
        `  ${path}: ${summary ? `${summary.tests} tests, ${summary.failures} failed, ${summary.errors} errors, ${summary.skipped} skipped` : 'unreadable'}`
    ),
  ];
  if (result.problems.length > 0) {
    lines.push('Problems:', ...result.problems.map((text) => `  - ${text}`));
  }
  return lines.join('\n') + '\n';
}

const execFileAsync = promisify(execFile);
const gh = async (args: string[]) =>
  (
    await execFileAsync('gh', args, {
      encoding: 'buffer',
      maxBuffer: maxArtifactBytes + 1024 * 1024,
    })
  ).stdout;

/** Reads through the GitHub CLI and its existing login. GET requests only. */
export const ghReader: GitHubReader = {
  json: async (path) =>
    JSON.parse((await gh(['api', '--method', 'GET', path])).toString('utf8')),
  bytes: async (path) => gh(['api', '--method', 'GET', path]),
};

async function main(argv: string[]) {
  const json = argv.includes('--json');
  const allowClosed = argv.includes('--allow-closed');
  const repoIndex = argv.indexOf('--repo');
  const repo =
    repoIndex >= 0
      ? argv[repoIndex + 1]
      : (
          await gh([
            'repo',
            'view',
            '--json',
            'nameWithOwner',
            '--jq',
            '.nameWithOwner',
          ])
        )
          .toString('utf8')
          .trim();
  const numbers = argv.filter(
    (arg, index) =>
      /^\d+$/.test(arg) && (repoIndex < 0 || index !== repoIndex + 1)
  );
  if (numbers.length !== 1 || !repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    process.stderr.write(
      'Usage: pnpm assess:pr <number> [--repo owner/name] [--json] [--allow-closed]\n'
    );
    return 2;
  }
  const result = await assessPullRequest(ghReader, {
    repo,
    pullRequest: Number(numbers[0]),
    allowClosed,
  });
  process.stdout.write(
    json ? JSON.stringify(result, null, 2) + '\n' : renderAssessment(result)
  );
  return result.passed ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main(process.argv.slice(2)).then(
    (code) => (process.exitCode = code),
    (error: Error) => {
      process.stderr.write(`Assessment could not run: ${error.message}\n`);
      process.exitCode = 2;
    }
  );
}
