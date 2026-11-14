import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import yaml from 'js-yaml';
import {
  artifactName,
  githubActionsAppId,
  requiredJob,
  requiredSteps,
} from '../scripts/ci/contract.mts';

interface Step {
  name?: string;
  id?: string;
  uses?: string;
  run?: string;
  if?: string | boolean;
  'continue-on-error'?: boolean;
  with?: Record<string, string | number | boolean>;
  env?: Record<string, string>;
}

interface Job {
  'runs-on': string;
  permissions?: Record<string, string>;
  needs?: string | string[];
  if?: string;
  concurrency?: unknown;
  'continue-on-error'?: boolean;
  steps: Step[];
}

interface Workflow {
  on: Record<string, unknown>;
  permissions: Record<string, string>;
  concurrency?: { group: string; 'cancel-in-progress': boolean };
  jobs: Record<string, Job>;
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(
  readFileSync(resolve(projectRoot, 'package.json'), 'utf8')
) as { scripts: Record<string, string> };

const readWorkflow = (name: string) =>
  yaml.load(
    readFileSync(resolve(projectRoot, '.github/workflows', name), 'utf8')
  ) as Workflow;
const ci = readWorkflow('ci.yaml');
const deployment = readWorkflow('deploy.yaml');
const { build, deploy } = deployment.jobs;
const action = (job: Job, name: string) =>
  job.steps.find((step) => step.uses?.startsWith(name + '@'));

describe('workflow validation tools', () => {
  it('runs actionlint from the shared lint command', () => {
    // Assert
    expect(packageJson.scripts['lint:workflows']).toBe(
      'actionlint -shellcheck=shellcheck -pyflakes='
    );
    expect(packageJson.scripts['lint:security']).toBe(
      'zizmor --offline .github'
    );
    expect(packageJson.scripts.lint).toContain('pnpm lint:workflows');
    expect(packageJson.scripts.lint).toContain('pnpm lint:security');
  });
});

describe('HC-013a deployment policy', () => {
  it('pins a runner supported by the locked browser toolchain', () => {
    // Assert: ubuntu-latest advanced to an unsupported OS in real CI.
    for (const workflow of [ci, deployment]) {
      for (const job of Object.values(workflow.jobs)) {
        expect(job['runs-on']).toBe('ubuntu-26.04');
      }
    }
  });
  it('requires policy review when a new workflow is introduced', () => {
    // Assert
    expect(
      readdirSync(resolve(projectRoot, '.github/workflows')).sort()
    ).toEqual(['ci.yaml', 'deploy.yaml']);
  });
  it('keeps deployment off PR events while retaining PR validation', () => {
    // Assert
    expect(deployment.on).toEqual({
      push: { branches: ['main'] },
      workflow_dispatch: null,
      repository_dispatch: null,
    });
    expect(ci.on).toEqual({ pull_request: { branches: ['main'] } });
    expect(Object.keys(deployment.jobs).sort()).toEqual(['build', 'deploy']);
  });

  it('uses read-only defaults and grants write only to publishing', () => {
    // Assert
    for (const workflow of [ci, deployment]) {
      expect(workflow.permissions).toEqual({ contents: 'read' });
      for (const [name, job] of Object.entries(workflow.jobs)) {
        const access =
          workflow === deployment && name === 'deploy' ? 'write' : 'read';
        expect(job.permissions ?? workflow.permissions).toEqual({
          contents: access,
        });
      }
    }
  });

  it('does not leave checkout credentials available to repository code', () => {
    // Assert
    for (const workflow of [ci, deployment]) {
      for (const job of Object.values(workflow.jobs)) {
        for (const step of job.steps) {
          if (step.uses?.startsWith('actions/checkout@')) {
            expect(step.with?.['persist-credentials']).toBe(false);
          }
        }
      }
    }
  });

  it('requires shared PR validation without conditional skips', () => {
    // Arrange
    const job = ci.jobs['lint-and-test'];

    // Assert
    expect(job.if).toBeUndefined();
    expect(job['continue-on-error']).not.toBe(true);
    for (const command of ['pnpm validate', 'pnpm test:e2e']) {
      const step = job.steps.find((candidate) => candidate.run === command);
      expect(step).toBeDefined();
      expect(step?.if).toBeUndefined();
      expect(step?.['continue-on-error']).not.toBe(true);
    }
  });

  it('requires the reviewed publish guard and successful build dependency', () => {
    // Assert
    expect(deploy.needs).toBe('build');
    // Deliberately assert the reviewed declaration; actionlint validates its
    // syntax. We do not implement another GitHub expression interpreter.
    expect(deploy.if).toBe(
      "github.ref == 'refs/heads/main' && (github.event_name == 'push' || github.event_name == 'workflow_dispatch' || github.event_name == 'repository_dispatch')"
    );
  });

  it('allows only artifact download and the publisher in the write-scoped job', () => {
    // Assert
    expect(deploy.steps.map((step) => step.uses?.split('@')[0])).toEqual([
      'actions/download-artifact',
      'peaceiris/actions-gh-pages',
    ]);
    expect(deploy.steps.every((step) => step.run === undefined)).toBe(true);
    expect(deploy.steps.every((step) => step.if === undefined)).toBe(true);
    expect(deploy['continue-on-error']).not.toBe(true);
    expect(deploy.concurrency).toBeUndefined();
    expect(
      deploy.steps.every((step) => step['continue-on-error'] !== true)
    ).toBe(true);
  });

  it('publishes the explicitly named artifact from this run', () => {
    // Arrange
    const download = action(deploy, 'actions/download-artifact');
    const upload = action(build, 'actions/upload-artifact');
    const publish = action(deploy, 'peaceiris/actions-gh-pages');

    // Assert
    // An exact input map also excludes cross-run and repository overrides.
    expect(download?.with).toEqual({
      name: 'github-pages-site',
      path: './dist',
    });
    expect(upload?.with).toMatchObject({
      name: 'github-pages-site',
      path: './dist',
      'if-no-files-found': 'error',
    });
    expect(publish?.with).toEqual({
      github_token: '${{ secrets.GITHUB_TOKEN }}',
      publish_dir: './dist',
      allow_empty_commit: true,
      full_commit_message: '${{ github.event.head_commit.message }}',
      force_orphan: true,
    });
  });

  it('packages the SPA fallback and custom domain before upload', () => {
    // Arrange
    const uploadIndex = build.steps.indexOf(
      action(build, 'actions/upload-artifact')!
    );

    // Assert
    const fallback = build.steps.find(
      (step) => step.run === 'cp ./dist/index.html ./dist/404.html'
    );
    const domain = build.steps.find(
      (step) => step.run === 'echo "$CNAME_DOMAIN" > ./dist/CNAME'
    );
    expect(fallback).toBeDefined();
    expect(fallback?.if).toBeUndefined();
    expect(domain).toBeDefined();
    expect(domain?.if).toBe(
      "${{ github.ref == 'refs/heads/main' && vars.CNAME_DOMAIN }}"
    );
    expect(domain?.env).toEqual({ CNAME_DOMAIN: '${{ vars.CNAME_DOMAIN }}' });
    for (const step of [fallback, domain]) {
      expect(build.steps.indexOf(step!)).toBeLessThan(uploadIndex);
      expect(step?.['continue-on-error']).not.toBe(true);
    }
  });

  it('keeps PRs and non-main builds outside production serialization', () => {
    // Assert
    expect(ci.concurrency).toBeUndefined();
    for (const job of Object.values(ci.jobs)) {
      expect(job.concurrency).toBeUndefined();
    }
    // Keep this reviewed policy declaration explicit rather than simulating
    // GitHub's concurrency evaluator locally.
    expect(deployment.concurrency).toEqual({
      group:
        "${{ github.ref == 'refs/heads/main' && 'pages' || format('pages-build-only-{0}', github.run_id) }}",
      'cancel-in-progress': false,
    });
  });
});

describe('HC-014 validation evidence contract', () => {
  const job = ci.jobs[requiredJob];
  const step = (name: string) => job.steps.find((s) => s.name === name);

  it('runs pull request validation as the one required job', () => {
    // Assert: the job id is the check name that branch rules require.
    expect(Object.keys(ci.jobs)).toEqual([requiredJob]);
  });

  it('runs every required step in order and unconditionally where needed', () => {
    // Arrange
    const names = job.steps.map((s) => s.name);
    const positions = requiredSteps.map((name) => names.indexOf(name));

    // Assert
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    for (const name of requiredSteps) {
      expect(step(name)?.['continue-on-error']).not.toBe(true);
    }
    expect(step('Validate')?.id).toBe('validate');
    expect(step('Browser acceptance')?.id).toBe('browser');
  });

  it('checks reports after failures too and passes the real step outcomes', () => {
    // Arrange
    const check = step('Check test reports');

    // Assert
    expect(check?.if).toBe('${{ !cancelled() }}');
    expect(check?.run).toBe('pnpm test:reports');
    expect(packageJson.scripts['test:reports']).toBe(
      'node scripts/ci/check-reports.mts'
    );
    expect(check?.env).toEqual({
      STEP_OUTCOME_VALIDATE: '${{ steps.validate.outcome }}',
      STEP_OUTCOME_BROWSER: '${{ steps.browser.outcome }}',
    });
  });

  it('names the reports artifact after the PR head and the attempt', () => {
    // Arrange
    const upload = step('Upload validation reports');

    // Assert: github.sha would be the temporary merge commit instead.
    expect(upload?.uses?.startsWith('actions/upload-artifact@')).toBe(true);
    expect(upload?.if).toBe('${{ !cancelled() }}');
    expect(upload?.with?.name).toBe(
      artifactName(
        '${{ github.event.pull_request.head.sha }}',
        '${{ github.run_attempt }}'
      )
    );
    expect(String(upload?.with?.path).split('\n')).toContain('reports/');
  });
});

describe('HC-015 branch ruleset proposal', () => {
  const proposal = JSON.parse(
    readFileSync(
      resolve(projectRoot, 'scripts/ci/ruleset-proposal.json'),
      'utf8'
    )
  ) as {
    enforcement: string;
    bypass_actors: unknown[];
    conditions: { ref_name: { include: string[] } };
    rules: { type: string; parameters?: Record<string, unknown> }[];
  };
  const rule = (type: string) =>
    proposal.rules.find((candidate) => candidate.type === type)?.parameters;

  it('requires the contract check from the GitHub Actions app only', () => {
    // Assert
    expect(rule('required_status_checks')).toEqual({
      strict_required_status_checks_policy: true,
      do_not_enforce_on_create: false,
      required_status_checks: [
        { context: requiredJob, integration_id: githubActionsAppId },
      ],
    });
  });

  it('never needs an approval the sole owner cannot give on their own PR', () => {
    // Assert
    expect(rule('pull_request')).toMatchObject({
      required_approving_review_count: 0,
      require_code_owner_review: false,
      require_last_push_approval: false,
    });
  });

  it('protects the default branch with no bypass', () => {
    // Assert
    expect(proposal.enforcement).toBe('active');
    expect(proposal.bypass_actors).toEqual([]);
    expect(proposal.conditions.ref_name.include).toEqual(['~DEFAULT_BRANCH']);
    expect(proposal.rules.map((candidate) => candidate.type).sort()).toEqual([
      'deletion',
      'non_fast_forward',
      'pull_request',
      'required_status_checks',
    ]);
  });
});
