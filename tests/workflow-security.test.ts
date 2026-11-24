import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
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
  shell?: string;
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
  outputs?: Record<string, string>;
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
const { build, deploy, rollback, smoke } = deployment.jobs;
const writeJobs = ['deploy', 'rollback'];
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
      workflow_dispatch: {
        inputs: {
          rollback_to: {
            description: expect.stringContaining('gh-pages release commit'),
            required: false,
            default: '',
            type: 'string',
          },
        },
      },
      repository_dispatch: null,
    });
    expect(ci.on).toEqual({ pull_request: null });
    expect(Object.keys(deployment.jobs).sort()).toEqual([
      'build',
      'deploy',
      'rollback',
      'smoke',
    ]);
  });

  it('uses read-only defaults and grants write only to publishing', () => {
    // Assert
    for (const workflow of [ci, deployment]) {
      expect(workflow.permissions).toEqual({ contents: 'read' });
      for (const [name, job] of Object.entries(workflow.jobs)) {
        const access =
          workflow === deployment && writeJobs.includes(name)
            ? 'write'
            : 'read';
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
    // tests/metrics.test.ts checks that pnpm metrics runs every step of
    // pnpm validate.
    expect(packageJson.scripts.metrics).toBe('node scripts/ci/metrics.mts');
    for (const command of ['pnpm metrics --repeat 3', 'pnpm test:e2e']) {
      const step = job.steps.find((candidate) => candidate.run === command);
      expect(step).toBeDefined();
      expect(step?.if).toBeUndefined();
      expect(step?.['continue-on-error']).not.toBe(true);
    }
  });

  it('builds with VITE_GTAG_ID as the only analytics tag variable', () => {
    // Arrange: vite.config.mts reads only VITE_GTAG_ID, so GitHub builds must
    // pass only the matching repository variable.
    const validations = [
      ci.jobs['lint-and-test'].steps.find(
        (step) => step.run === 'pnpm metrics --repeat 3'
      ),
      build.steps.find((step) => step.run === 'pnpm validate'),
    ];

    // Assert
    for (const step of validations) {
      expect(step?.env?.VITE_GTAG_ID).toBe('${{ vars.VITE_GTAG_ID }}');
    }
  });

  it('requires the reviewed publish guards and successful build dependency', () => {
    // Assert
    expect(deploy.needs).toBe('build');
    // Deliberately assert the reviewed declarations; actionlint validates their
    // syntax. We do not implement another GitHub expression interpreter.
    expect(deploy.if).toBe(
      "github.ref == 'refs/heads/main' && (github.event_name == 'push' || github.event_name == 'workflow_dispatch' || github.event_name == 'repository_dispatch')"
    );
    expect(build.if).toBe('${{ !inputs.rollback_to }}');
    expect(rollback.needs).toBeUndefined();
    expect(rollback.if).toBe(
      "github.ref == 'refs/heads/main' && github.event_name == 'workflow_dispatch' && inputs.rollback_to"
    );
  });

  it('runs only fixed shell and the artifact download in write-scoped jobs', () => {
    // Assert: no checkout, toolchain, install or repository script can run
    // with the write token, and no step can be skipped or ignored.
    expect(deploy.steps.map((step) => step.uses?.split('@')[0])).toEqual([
      'actions/download-artifact',
      undefined,
    ]);
    expect(rollback.steps.map((step) => step.uses)).toEqual([undefined]);
    for (const name of writeJobs) {
      const job = deployment.jobs[name];
      expect(job['continue-on-error']).not.toBe(true);
      expect(job.concurrency).toBeUndefined();
      for (const step of job.steps) {
        expect(step.if).toBeUndefined();
        expect(step['continue-on-error']).not.toBe(true);
        if (step.run !== undefined) {
          expect(step.shell).toBe('bash');
          expect(step.run).not.toMatch(/\b(?:pnpm|npm|npx|node|\.\/)/);
          expect(step.run).not.toContain('${{');
          // The only push is a fast-forward of gh-pages, never forced.
          expect(step.run.match(/git push.*/g)).toEqual([
            'git push -q "$REMOTE_URL" "$commit:refs/heads/gh-pages" ||',
          ]);
        }
      }
    }
  });

  it('passes the write token only to the publishing steps', () => {
    // Arrange
    const withSecrets = Object.entries(deployment.jobs).flatMap(([name, job]) =>
      job.steps
        .filter((step) => JSON.stringify(step).includes('secrets.'))
        .map((step) => `${name}: ${step.name}`)
    );

    // Assert
    expect(withSecrets).toEqual([
      'deploy: Publish validated site',
      'rollback: Roll back to an earlier release',
    ]);
  });

  it('publishes only the artifact the build job uploaded in this run', () => {
    // Arrange
    const download = action(deploy, 'actions/download-artifact');
    const upload = action(build, 'actions/upload-artifact');
    const publish = deploy.steps.find(
      (step) => step.name === 'Publish validated site'
    );

    // Assert
    // An exact input map also excludes cross-run and repository overrides.
    expect(download?.with).toEqual({
      'artifact-ids': '${{ needs.build.outputs.artifact-id }}',
      path: './site',
      'digest-mismatch': 'error',
    });
    expect(upload?.id).toBe('upload');
    expect(upload?.with).toMatchObject({
      name: 'github-pages-site',
      path: './dist',
      'include-hidden-files': true,
      'if-no-files-found': 'error',
    });
    expect(build.outputs).toEqual({
      tree: '${{ steps.release.outputs.tree }}',
      'build-id': '${{ steps.release.outputs.build-id }}',
      'artifact-id': '${{ steps.upload.outputs.artifact-id }}',
      'artifact-digest': '${{ steps.upload.outputs.artifact-digest }}',
    });
    expect(publish?.env).toEqual({
      SITE_DIR: 'site',
      RELEASE_TREE: '${{ needs.build.outputs.tree }}',
      BUILD_ID: '${{ needs.build.outputs.build-id }}',
      ARTIFACT_ID: '${{ needs.build.outputs.artifact-id }}',
      ARTIFACT_DIGEST: '${{ needs.build.outputs.artifact-digest }}',
      SOURCE_COMMIT: '${{ github.sha }}',
      RUN_URL:
        '${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}/attempts/${{ github.run_attempt }}',
      REMOTE_URL: '${{ github.server_url }}/${{ github.repository }}.git',
      PUBLISH_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
    });
  });

  it('records who requested a rollback and passes it only fixed inputs', () => {
    // Assert
    expect(rollback.steps[0].env).toEqual({
      ROLLBACK_TO: '${{ inputs.rollback_to }}',
      REQUESTED_BY: '${{ github.triggering_actor }}',
      RUN_URL:
        '${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}/attempts/${{ github.run_attempt }}',
      REMOTE_URL: '${{ github.server_url }}/${{ github.repository }}.git',
      PUBLISH_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
    });
  });

  it('builds with a build ID that names the commit, run and attempt', () => {
    // Arrange
    const validate = build.steps.find((step) => step.run === 'pnpm validate');
    const record = build.steps.find(
      (step) => step.name === 'Record release tree'
    );
    const id =
      '${{ github.sha }}.${{ github.run_id }}.${{ github.run_attempt }}';

    // Assert
    expect(validate?.env?.VITE_BUILD_ID).toBe(id);
    expect(record?.id).toBe('release');
    expect(record?.env).toEqual({ SITE_DIR: 'dist', BUILD_ID: id });
  });

  it('smoke tests the public site with a read-only token after each release', () => {
    // Arrange
    const checkouts = smoke.steps.filter((step) =>
      step.uses?.startsWith('actions/checkout@')
    );
    const check = smoke.steps.at(-1);

    // Assert
    expect(smoke.needs).toEqual(['deploy', 'rollback']);
    expect(smoke.if).toBe(
      "${{ !cancelled() && (needs.deploy.outputs.published == 'true' || needs.rollback.outputs.published == 'true') }}"
    );
    expect(checkouts[1]?.with).toEqual({
      ref: '${{ needs.deploy.outputs.commit || needs.rollback.outputs.commit }}',
      path: 'published',
      'persist-credentials': false,
    });
    expect(check?.run).toBe(
      'node scripts/ci/smoke-site.mts --site published --build-id "$BUILD_ID" --owner "$OWNER" --base "$PUBLIC_URL"'
    );
    expect(check?.env).toEqual({
      BUILD_ID:
        '${{ needs.deploy.outputs.build-id || needs.rollback.outputs.build-id }}',
      OWNER: '${{ github.repository_owner }}',
      PUBLIC_URL: '${{ vars.PUBLIC_URL }}',
    });
  });

  it('packages the SPA fallback, custom domain and Jekyll opt-out before recording the tree', () => {
    // Arrange
    const recordIndex = build.steps.findIndex(
      (step) => step.name === 'Record release tree'
    );
    expect(recordIndex).toBeLessThan(
      build.steps.indexOf(action(build, 'actions/upload-artifact')!)
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
    const jekyll = build.steps.find(
      (step) => step.run === 'touch ./dist/.nojekyll'
    );
    expect(jekyll?.if).toBeUndefined();
    for (const step of [fallback, domain, jekyll]) {
      expect(build.steps.indexOf(step!)).toBeLessThan(recordIndex);
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

describe('deployment engine selection', () => {
  const step = (name: string) => build.steps.find((s) => s.name === name);
  const resolved = '${{ steps.engine.outputs.specifier }}';
  const frozenInstall = 'pnpm install --frozen-lockfile';

  /** Runs the install step's script with stub pnpm and node commands. */
  const runInstall = (ergogenVersion: string) => {
    const bin = mkdtempSync(join(tmpdir(), 'deploy-install-'));
    const calls = join(bin, 'calls');
    for (const command of ['pnpm', 'node']) {
      writeFileSync(
        join(bin, command),
        `#!/bin/sh\necho "${command} $*" >> "${calls}"\n`,
        { mode: 0o755 }
      );
    }
    const result = spawnSync(
      'bash',
      ['-e', '-c', step('Install dependencies')!.run!],
      {
        env: {
          PATH: `${bin}:${process.env.PATH}`,
          ERGOGEN_VERSION: ergogenVersion,
        },
        encoding: 'utf8',
      }
    );
    const log = existsSync(calls) ? readFileSync(calls, 'utf8') : '';
    rmSync(bin, { recursive: true, force: true });
    expect(result.status, result.stderr).toBe(0);
    return log.trim().split('\n');
  };

  it('allows Git subdependencies in the workspace, not per command', () => {
    // Arrange
    const workspace = yaml.load(
      readFileSync(resolve(projectRoot, 'pnpm-workspace.yaml'), 'utf8')
    ) as Record<string, unknown>;

    // Assert
    // Ergogen depends on kle-serial from Git. Without this setting, pnpm 11
    // fails with ERR_PNPM_EXOTIC_SUBDEP whenever it resolves dependencies.
    expect(workspace.blockExoticSubdeps).toBe(false);
  });

  it('keeps pull request CI on the canonical frozen install', () => {
    // Assert
    const text = readFileSync(
      resolve(projectRoot, '.github/workflows/ci.yaml'),
      'utf8'
    );
    expect(text).not.toContain('ERGOGEN_VERSION');
    expect(
      ci.jobs['lint-and-test'].steps.find(
        (s) => s.name === 'Install locked dependencies'
      )?.run
    ).toBe(frozenInstall);
  });

  it('reads the repository variable only in the resolve step, through env', () => {
    // Arrange
    const steps = build.steps.filter((s) =>
      JSON.stringify(s).includes('vars.ERGOGEN_VERSION')
    );

    // Assert
    expect(steps).toEqual([step('Resolve engine')]);
    expect(steps[0]?.env?.CONFIGURED_ERGOGEN_VERSION).toBe(
      '${{ vars.ERGOGEN_VERSION }}'
    );
    expect(steps[0]?.run).not.toContain('${{');
  });

  it('installs, verifies and builds with the one resolved specifier', () => {
    // Arrange
    const names = build.steps.map((s) => s.name);
    const validate = build.steps.find((s) => s.run === 'pnpm validate');

    // Assert
    expect(step('Install dependencies')?.env?.ERGOGEN_VERSION).toBe(resolved);
    expect(step('Verify installed engine')?.env?.ERGOGEN_VERSION).toBe(
      resolved
    );
    expect(validate?.env?.ERGOGEN_VERSION).toBe(resolved);
    expect(names.indexOf('Resolve engine')).toBeLessThan(
      names.indexOf('Install dependencies')
    );
    expect(names.indexOf('Install dependencies')).toBeLessThan(
      names.indexOf('Verify installed engine')
    );
    expect(names.indexOf('Verify installed engine')).toBeLessThan(
      build.steps.indexOf(validate!)
    );
  });

  it('installs from the frozen lockfile when no engine is configured', () => {
    // Act
    const calls = runInstall('');

    // Assert
    expect(calls).toEqual(['pnpm install --frozen-lockfile']);
  });

  it('patches the manifest and re-resolves when an engine is configured', () => {
    // Act
    const calls = runInstall(`github:ceoloide/ergogen#${'a'.repeat(40)}`);

    // Assert
    expect(calls).toEqual([
      'node scripts/preinstall.js',
      'pnpm install --no-frozen-lockfile',
    ]);
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
