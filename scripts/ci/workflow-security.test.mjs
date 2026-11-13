import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import yaml from 'js-yaml';
import { evaluateCondition, evaluateValue } from './workflow-expressions.mjs';
import {
  actionName,
  effectivePermissions,
  findArtifactHandoffViolations,
  findCheckoutViolations,
  findConcurrencyViolations,
  findDeployGateViolations,
  findDeployTriggerViolations,
  findPermissionViolations,
  findPublishJobs,
  triggerEvents,
  writeScopes,
} from './workflow-security.mjs';

const workflowsDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../.github/workflows'
);

const loadWorkflow = (fileName) =>
  yaml.load(readFileSync(resolve(workflowsDirectory, fileName), 'utf8'));

const deployWorkflow = loadWorkflow('deploy.yaml');
const ciWorkflow = loadWorkflow('ci.yaml');

/** A fresh, mutable copy of the deploy workflow for negative cases. */
const deployCopy = () => JSON.parse(JSON.stringify(deployWorkflow));

const jobRunsCommands = (job) =>
  (job.steps ?? []).some(
    (step) => step.run !== undefined || actionName(step) === 'actions/checkout'
  );

/**
 * The single-job shape this repository used before the deploy pipeline was
 * split: pull_request trigger, workflow-wide write token and the build running
 * in the same job as the publish step. Every checker must reject it.
 */
const legacySingleJobWorkflow = {
  on: {
    push: { branches: ['main'] },
    workflow_dispatch: null,
    pull_request: null,
  },
  permissions: { contents: 'write', pages: 'write', 'id-token': 'write' },
  concurrency: { group: 'pages', 'cancel-in-progress': false },
  jobs: {
    'build-and-deploy': {
      'runs-on': 'ubuntu-latest',
      steps: [
        { uses: 'actions/checkout@v7' },
        { run: 'pnpm install && pnpm run build' },
        {
          uses: 'peaceiris/actions-gh-pages@v4',
          if: "github.ref == 'refs/heads/main' && (github.event_name == 'push' || github.event_name == 'workflow_dispatch' || github.event_name == 'repository_dispatch')",
          with: { publish_dir: './dist' },
        },
      ],
    },
  },
};

describe('workflow expression evaluator', () => {
  const context = {
    github: { ref: 'refs/heads/main', event_name: 'push', run_id: '42' },
    vars: {},
  };

  it('evaluates comparisons and boolean operators like GitHub Actions', () => {
    // Arrange
    const condition =
      "github.ref == 'refs/heads/main' && (github.event_name == 'push' || false)";

    // Act
    const result = evaluateCondition(condition, context);

    // Assert
    expect(result).toBe(true);
  });

  it('returns operand values from && / || and supports format()', () => {
    // Arrange
    const group =
      "${{ github.ref != 'refs/heads/main' && 'pages' || format('other-{0}', github.run_id) }}";

    // Act
    const result = evaluateValue(group, context);

    // Assert
    expect(result).toBe('other-42');
  });

  it('treats plain workflow values as literals', () => {
    // Act
    const result = evaluateValue('pages', context);

    // Assert
    expect(result).toBe('pages');
  });

  it('treats missing variables as falsy', () => {
    // Arrange
    const condition =
      "${{ github.ref == 'refs/heads/main' && vars.CNAME_DOMAIN }}";

    // Act
    const result = evaluateCondition(condition, context);

    // Assert
    expect(result).toBe(false);
  });

  it('rejects syntax it does not understand instead of guessing', () => {
    // Arrange
    const condition = "contains(github.ref, 'main')";

    // Act
    const evaluate = () => evaluateCondition(condition, context);

    // Assert
    expect(evaluate).toThrow(/Unsupported function/);
  });
});

describe('deploy workflow', () => {
  it('only starts from pushes to main, manual dispatch and repository dispatch', () => {
    // Act
    const violations = findDeployTriggerViolations(deployWorkflow);

    // Assert
    expect(violations).toEqual([]);
    expect(Object.keys(triggerEvents(deployWorkflow)).sort()).toEqual(
      ['push', 'repository_dispatch', 'workflow_dispatch'].sort()
    );
  });

  it('declares explicit least-privilege token permissions for every job', () => {
    // Act
    const violations = findPermissionViolations(deployWorkflow);

    // Assert
    expect(violations).toEqual([]);
  });

  it('runs install, build and checkout with a read-only token', () => {
    // Arrange
    const commandJobs = Object.entries(deployWorkflow.jobs).filter(([, job]) =>
      jobRunsCommands(job)
    );

    // Act
    const permissionsByJob = Object.fromEntries(
      commandJobs.map(([jobId, job]) => [
        jobId,
        effectivePermissions(deployWorkflow, job).scopes,
      ])
    );

    // Assert
    expect(commandJobs.length).toBeGreaterThan(0);
    for (const scopes of Object.values(permissionsByJob)) {
      expect(scopes).toEqual({ contents: 'read' });
    }
  });

  it('grants contents: write only to the publish job', () => {
    // Act
    const writeJobs = Object.entries(deployWorkflow.jobs)
      .filter(
        ([, job]) =>
          writeScopes(effectivePermissions(deployWorkflow, job)).length > 0
      )
      .map(([jobId]) => jobId);

    // Assert
    expect(writeJobs).toEqual(findPublishJobs(deployWorkflow));
    for (const jobId of writeJobs) {
      expect(
        effectivePermissions(deployWorkflow, deployWorkflow.jobs[jobId]).scopes
      ).toEqual({
        contents: 'write',
      });
    }
  });

  it('does not persist checkout credentials', () => {
    // Act
    const violations = findCheckoutViolations(deployWorkflow);

    // Assert
    expect(violations).toEqual([]);
  });

  it('publishes only for trusted events on main', () => {
    // Act
    const violations = findDeployGateViolations(deployWorkflow);

    // Assert
    expect(violations).toEqual([]);
  });

  it('serializes only real deployments in the production concurrency group', () => {
    // Act
    const violations = findConcurrencyViolations(deployWorkflow);

    // Assert
    expect(violations).toEqual([]);
  });

  it('hands the built site to the publish job as a same-run artifact', () => {
    // Act
    const violations = findArtifactHandoffViolations(deployWorkflow);

    // Assert
    expect(violations).toEqual([]);
  });

  it('adds the SPA 404 page and the main-only CNAME before uploading the site', () => {
    // Arrange
    const [publishJobId] = findPublishJobs(deployWorkflow);
    const [buildJobId] = [deployWorkflow.jobs[publishJobId].needs].flat();
    const steps = deployWorkflow.jobs[buildJobId].steps;
    const uploadIndex = steps.findIndex(
      (step) => actionName(step) === 'actions/upload-artifact'
    );
    const notFoundIndex = steps.findIndex((step) =>
      step.run?.includes('dist/404.html')
    );
    const cnameStep = steps.find((step) => step.run?.includes('dist/CNAME'));
    const context = (ref) => ({
      github: { ref, event_name: 'workflow_dispatch' },
      vars: { CNAME_DOMAIN: 'example.com' },
    });

    // Act
    const cnameOnMain = evaluateCondition(
      cnameStep.if,
      context('refs/heads/main')
    );
    const cnameOnBranch = evaluateCondition(
      cnameStep.if,
      context('refs/heads/feature')
    );

    // Assert
    expect(steps[uploadIndex].with.path).toMatch(/^(\.\/)?dist\/?$/);
    expect(notFoundIndex).toBeGreaterThanOrEqual(0);
    expect(notFoundIndex).toBeLessThan(uploadIndex);
    expect(steps.indexOf(cnameStep)).toBeLessThan(uploadIndex);
    expect(cnameOnMain).toBe(true);
    expect(cnameOnBranch).toBe(false);
  });
});

describe('CI workflow', () => {
  it('validates pull requests targeting main', () => {
    // Act
    const triggers = triggerEvents(ciWorkflow);

    // Assert
    expect(triggers.pull_request?.branches).toEqual(['main']);
  });

  it('runs with a read-only token and without persisted checkout credentials', () => {
    // Act
    const violations = [
      ...findPermissionViolations(ciWorkflow),
      ...findCheckoutViolations(ciWorkflow),
    ];

    // Assert
    expect(violations).toEqual([]);
    for (const job of Object.values(ciWorkflow.jobs)) {
      expect(effectivePermissions(ciWorkflow, job).scopes).toEqual({
        contents: 'read',
      });
    }
  });

  it('never joins the production deployment concurrency group', () => {
    // Act
    const violations = findConcurrencyViolations(ciWorkflow);

    // Assert
    expect(violations).toEqual([]);
  });
});

describe('workflow security checks reject unsafe changes', () => {
  it('flags every problem in the legacy single-job deploy workflow', () => {
    // Act
    const violations = {
      triggers: findDeployTriggerViolations(legacySingleJobWorkflow),
      permissions: findPermissionViolations(legacySingleJobWorkflow),
      checkout: findCheckoutViolations(legacySingleJobWorkflow),
      concurrency: findConcurrencyViolations(legacySingleJobWorkflow),
      artifact: findArtifactHandoffViolations(legacySingleJobWorkflow),
    };

    // Assert
    expect(violations.triggers).toContain(
      'deploy workflow is triggered by pull_request'
    );
    expect(violations.permissions).toEqual(
      expect.arrayContaining([
        'job "build-and-deploy" requests pages: write',
        'job "build-and-deploy" requests id-token: write',
        'write-scoped job "build-and-deploy" runs a shell command in step "#1"',
        'write-scoped job "build-and-deploy" uses non-allowlisted action actions/checkout@v7',
        'write-scoped job "build-and-deploy" can be triggered by pull_request',
      ])
    );
    expect(violations.checkout).toEqual([
      'job "build-and-deploy" checks out with persisted credentials',
    ]);
    expect(violations.concurrency).toContain(
      'workflow_dispatch on refs/heads/feature-branch joins "pages" without deploying'
    );
    expect(violations.artifact).toEqual([
      'job "build-and-deploy" does not download a build artifact',
    ]);
  });

  it.each(['pull_request', 'pull_request_target', 'workflow_run'])(
    'flags a %s trigger on the deploy workflow',
    (event) => {
      // Arrange
      const workflow = deployCopy();
      workflow.on[event] = null;

      // Act
      const violations = [
        ...findDeployTriggerViolations(workflow),
        ...findPermissionViolations(workflow),
      ];

      // Assert
      expect(violations).toContain(`deploy workflow is triggered by ${event}`);
      expect(
        violations.some((violation) =>
          violation.endsWith(`can be triggered by ${event}`)
        )
      ).toBe(true);
    }
  );

  it('flags a deploy workflow that inherits repository default permissions', () => {
    // Arrange
    const workflow = deployCopy();
    delete workflow.permissions;
    for (const job of Object.values(workflow.jobs)) delete job.permissions;

    // Act
    const violations = findPermissionViolations(workflow);

    // Assert
    expect(violations).toHaveLength(Object.keys(workflow.jobs).length);
    expect(
      violations.every((violation) => violation.includes('repository default'))
    ).toBe(true);
  });

  it('flags build commands added to the write-scoped publish job', () => {
    // Arrange
    const workflow = deployCopy();
    const [publishJobId] = findPublishJobs(workflow);
    workflow.jobs[publishJobId].steps.unshift(
      { uses: 'actions/checkout@v7', with: { 'persist-credentials': false } },
      { name: 'Build', run: 'pnpm run build' }
    );

    // Act
    const violations = findPermissionViolations(workflow);

    // Assert
    expect(violations).toEqual([
      `write-scoped job "${publishJobId}" uses non-allowlisted action actions/checkout@v7`,
      `write-scoped job "${publishJobId}" runs a shell command in step "Build"`,
    ]);
  });

  it.each([
    ['pages', 'write'],
    ['id-token', 'write'],
    ['contents', 'write'],
  ])('flags %s: %s on the build job', (scope, access) => {
    // Arrange
    const workflow = deployCopy();
    const [publishJobId] = findPublishJobs(workflow);
    const [buildJobId] = [workflow.jobs[publishJobId].needs].flat();
    workflow.jobs[buildJobId].permissions = {
      contents: 'read',
      [scope]: access,
    };

    // Act
    const violations = [
      ...findPermissionViolations(workflow),
      ...findArtifactHandoffViolations(workflow),
    ];

    // Assert
    expect(
      violations.some((violation) =>
        violation.startsWith(
          `write-scoped job "${buildJobId}" runs a shell command`
        )
      )
    ).toBe(true);
    expect(violations).toContain(
      `artifact producer "${buildJobId}" has write permissions`
    );
  });

  it('flags persisted checkout credentials', () => {
    // Arrange
    const workflow = deployCopy();
    for (const job of Object.values(workflow.jobs)) {
      for (const step of job.steps) {
        if (actionName(step) === 'actions/checkout')
          delete step.with['persist-credentials'];
      }
    }

    // Act
    const violations = findCheckoutViolations(workflow);

    // Assert
    expect(violations.length).toBeGreaterThan(0);
  });

  it('flags a publish job that is no longer restricted to main', () => {
    // Arrange
    const workflow = deployCopy();
    const [publishJobId] = findPublishJobs(workflow);
    delete workflow.jobs[publishJobId].if;

    // Act
    const violations = findDeployGateViolations(workflow);

    // Assert
    expect(violations).toContain(
      `job "${publishJobId}" publishes for pull_request on refs/heads/main`
    );
    expect(violations).toContain(
      `job "${publishJobId}" publishes for push on refs/heads/feature-branch`
    );
  });

  it('flags non-deploying runs that join the production concurrency group', () => {
    // Arrange
    const workflow = deployCopy();
    workflow.concurrency = { group: 'pages', 'cancel-in-progress': false };

    // Act
    const violations = findConcurrencyViolations(workflow);

    // Assert
    expect(violations).toContain(
      'workflow_dispatch on refs/heads/feature-branch joins "pages" without deploying'
    );
  });

  it('flags deployments that may be cancelled while in progress', () => {
    // Arrange
    const workflow = deployCopy();
    const owner = workflow.concurrency
      ? workflow
      : Object.values(workflow.jobs).find((job) => job.concurrency);
    owner.concurrency['cancel-in-progress'] = true;

    // Act
    const violations = findConcurrencyViolations(workflow);

    // Assert
    expect(
      violations.some((violation) =>
        violation.includes('may cancel an in-progress')
      )
    ).toBe(true);
  });

  it('flags a publish job that publishes something other than the downloaded artifact', () => {
    // Arrange
    const workflow = deployCopy();
    const [publishJobId] = findPublishJobs(workflow);
    const publish = workflow.jobs[publishJobId].steps.find(
      (step) => actionName(step) === 'peaceiris/actions-gh-pages'
    );
    publish.with.publish_dir = './somewhere-else';

    // Act
    const violations = findArtifactHandoffViolations(workflow);

    // Assert
    expect(violations).toEqual([
      `job "${publishJobId}" publishes a directory other than the downloaded artifact`,
    ]);
  });
});
