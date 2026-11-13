import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import yaml from 'js-yaml';

interface Step {
  uses?: string;
  run?: string;
  if?: string | boolean;
  'continue-on-error'?: boolean;
  with?: Record<string, string | number | boolean>;
  env?: Record<string, string>;
}

interface Job {
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
      'zizmor --offline .github/workflows'
    );
    expect(packageJson.scripts.lint).toContain('pnpm lint:workflows');
    expect(packageJson.scripts.lint).toContain('pnpm lint:security');
  });
});

describe('HC-013a deployment policy', () => {
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
