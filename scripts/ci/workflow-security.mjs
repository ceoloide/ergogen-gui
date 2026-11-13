/**
 * Security invariants for the GitHub Actions workflows in `.github/workflows`.
 *
 * Each `find*Violations` helper returns a list of human-readable problems
 * (empty when the workflow is safe) so tests can assert on both the real
 * workflows and deliberately broken copies of them.
 */
import { posix } from 'node:path';
import { evaluateCondition, evaluateValue } from './workflow-expressions.mjs';

export const PRODUCTION_BRANCH_REF = 'refs/heads/main';
export const PRODUCTION_CONCURRENCY_GROUP = 'pages';
export const DEPLOY_EVENTS = [
  'push',
  'workflow_dispatch',
  'repository_dispatch',
];

/** Events that can run with code or context controlled by a pull request author. */
export const PULL_REQUEST_EVENTS = [
  'pull_request',
  'pull_request_target',
  'workflow_run',
];

/** The only actions a job holding a write-scoped token may run. */
export const WRITE_JOB_ALLOWED_ACTIONS = [
  'actions/download-artifact',
  'peaceiris/actions-gh-pages',
];

const PUBLISH_ACTION = 'peaceiris/actions-gh-pages';
const CHECKOUT_ACTION = 'actions/checkout';
const UPLOAD_ARTIFACT_ACTION = 'actions/upload-artifact';
const DOWNLOAD_ARTIFACT_ACTION = 'actions/download-artifact';

const normalizeDirectory = (directory) =>
  typeof directory === 'string'
    ? posix.normalize(directory).replace(/\/+$/, '') || '/'
    : undefined;

/** `owner/repo@ref` -> `owner/repo` */
export const actionName = (step) => step.uses?.split('@')[0];

export const triggerEvents = (workflow) => {
  const on = workflow.on;
  if (typeof on === 'string') return { [on]: null };
  if (Array.isArray(on))
    return Object.fromEntries(on.map((event) => [event, null]));
  return on ?? {};
};

/**
 * Resolves the token permissions a job runs with. `explicit` is false when
 * neither the job nor the workflow declares permissions, in which case the job
 * silently inherits the repository default (which may be write-all).
 */
export const effectivePermissions = (workflow, job) => {
  const declared = job.permissions ?? workflow.permissions;
  if (declared == null) return { explicit: false, scopes: {} };
  if (declared === 'read-all')
    return { explicit: true, scopes: { '*': 'read' } };
  if (declared === 'write-all')
    return { explicit: true, scopes: { '*': 'write' } };
  return { explicit: true, scopes: declared ?? {} };
};

export const writeScopes = ({ scopes }) =>
  Object.entries(scopes)
    .filter(([, access]) => access === 'write')
    .map(([scope]) => scope);

/**
 * - every job must declare (or inherit from the workflow) explicit permissions;
 * - only `contents` may ever be granted write access;
 * - a write-scoped job may not run shell commands or any action outside the
 *   publish allowlist (so no install/build/checkout with write credentials);
 * - write-scoped jobs may not exist in workflows a pull request can trigger.
 */
export const findPermissionViolations = (workflow) => {
  const violations = [];
  const events = Object.keys(triggerEvents(workflow));
  const pullRequestEvents = events.filter((event) =>
    PULL_REQUEST_EVENTS.includes(event)
  );

  for (const [jobId, job] of Object.entries(workflow.jobs ?? {})) {
    const permissions = effectivePermissions(workflow, job);
    if (!permissions.explicit) {
      violations.push(
        `job "${jobId}" inherits the repository default token permissions`
      );
      continue;
    }

    const writes = writeScopes(permissions);
    for (const scope of writes.filter((scope) => scope !== 'contents')) {
      violations.push(`job "${jobId}" requests ${scope}: write`);
    }
    if (writes.length === 0) continue;

    for (const [index, step] of (job.steps ?? []).entries()) {
      const label = step.name ?? `#${index}`;
      if (step.run !== undefined) {
        violations.push(
          `write-scoped job "${jobId}" runs a shell command in step "${label}"`
        );
      }
      if (
        step.uses !== undefined &&
        !WRITE_JOB_ALLOWED_ACTIONS.includes(actionName(step))
      ) {
        violations.push(
          `write-scoped job "${jobId}" uses non-allowlisted action ${step.uses}`
        );
      }
    }
    if (job.uses !== undefined) {
      violations.push(
        `write-scoped job "${jobId}" calls reusable workflow ${job.uses}`
      );
    }
    for (const event of pullRequestEvents) {
      violations.push(
        `write-scoped job "${jobId}" can be triggered by ${event}`
      );
    }
  }
  return violations;
};

/** Checkouts must not leave the job token in `.git/config` for later steps. */
export const findCheckoutViolations = (workflow) => {
  const violations = [];
  for (const [jobId, job] of Object.entries(workflow.jobs ?? {})) {
    for (const step of job.steps ?? []) {
      if (
        actionName(step) === CHECKOUT_ACTION &&
        step.with?.['persist-credentials'] !== false
      ) {
        violations.push(`job "${jobId}" checks out with persisted credentials`);
      }
    }
  }
  return violations;
};

/** Removing the deploy PR trigger must not remove PR build/lint/test coverage. */
export const findCiCoverageViolations = (workflow) => {
  const isUnconditional = (item) =>
    item.if === undefined &&
    (item['continue-on-error'] === undefined ||
      item['continue-on-error'] === false);
  const commands = Object.values(workflow.jobs ?? {})
    .filter(isUnconditional)
    .flatMap((job) => job.steps ?? [])
    .filter(isUnconditional)
    .map((step) => step.run?.trim());

  return ['pnpm run build', 'pnpm run lint', 'pnpm run test:unit']
    .filter((command) => !commands.includes(command))
    .map((command) => `CI does not unconditionally require ${command}`);
};

/** The deploy workflow may only start from trusted, maintainer-controlled events. */
export const findDeployTriggerViolations = (workflow) => {
  const violations = [];
  const triggers = triggerEvents(workflow);
  for (const event of Object.keys(triggers)) {
    if (!DEPLOY_EVENTS.includes(event)) {
      violations.push(`deploy workflow is triggered by ${event}`);
    }
  }
  const pushBranches = triggers.push?.branches;
  if (
    'push' in triggers &&
    (JSON.stringify(pushBranches) !== JSON.stringify(['main']) ||
      Object.keys(triggers.push).some((key) => key !== 'branches'))
  ) {
    violations.push(`deploy workflow push trigger is not limited to main`);
  }
  return violations;
};

export const findPublishJobs = (workflow) =>
  Object.entries(workflow.jobs ?? {})
    .filter(([, job]) =>
      (job.steps ?? []).some((step) => actionName(step) === PUBLISH_ACTION)
    )
    .map(([jobId]) => jobId);

/** Whether a job would start, given its own `if:` and those of its `needs`. */
export const jobWouldRun = (workflow, jobId, context) => {
  const job = workflow.jobs[jobId];
  const needs = [job.needs ?? []].flat();
  return (
    needs.every((need) => jobWouldRun(workflow, need, context)) &&
    evaluateCondition(job.if, context)
  );
};

/** Whether a publish job would start and reach its (possibly conditional) publish step. */
export const publishWouldRun = (workflow, jobId, context) =>
  jobWouldRun(workflow, jobId, context) &&
  workflow.jobs[jobId].steps
    .filter((step) => actionName(step) === PUBLISH_ACTION)
    .some((step) => evaluateCondition(step.if, context));

const githubContext = (eventName, ref) => ({
  github: { event_name: eventName, ref, run_id: '123456789' },
  vars: { CNAME_DOMAIN: 'example.com' },
});

const SAMPLE_REFS = [
  PRODUCTION_BRANCH_REF,
  'refs/heads/feature-branch',
  'refs/tags/v1.0.0',
  'refs/pull/1/merge',
];
const SAMPLE_EVENTS = [
  ...DEPLOY_EVENTS,
  ...PULL_REQUEST_EVENTS,
  'schedule',
  'release',
];

/**
 * Independently of the triggers, a publish job's own conditions must only allow
 * the production branch and the trusted deploy events (defence in depth if a
 * trigger is ever added back).
 */
export const findDeployGateViolations = (workflow) => {
  const publishJobs = findPublishJobs(workflow);
  if (publishJobs.length === 0) return ['no job publishes to GitHub Pages'];

  const violations = [];
  for (const jobId of publishJobs) {
    for (const eventName of SAMPLE_EVENTS) {
      for (const ref of SAMPLE_REFS) {
        const shouldDeploy =
          ref === PRODUCTION_BRANCH_REF && DEPLOY_EVENTS.includes(eventName);
        const wouldDeploy = publishWouldRun(
          workflow,
          jobId,
          githubContext(eventName, ref)
        );
        if (wouldDeploy !== shouldDeploy) {
          violations.push(
            `job "${jobId}" ${wouldDeploy ? 'publishes' : 'does not publish'} for ${eventName} on ${ref}`
          );
        }
      }
    }
  }
  return violations;
};

/** Every (event, ref) pair the workflow's triggers can actually produce. */
export const triggerableContexts = (workflow) => {
  const triggers = triggerEvents(workflow);
  return Object.entries(triggers).flatMap(([eventName, filter]) =>
    SAMPLE_REFS.filter((ref) => {
      if (ref.startsWith('refs/pull/'))
        return PULL_REQUEST_EVENTS.includes(eventName);
      if (!filter?.branches) return true;
      return filter.branches.some((branch) => ref === `refs/heads/${branch}`);
    }).map((ref) => ({
      eventName,
      ref,
      context: githubContext(eventName, ref),
    }))
  );
};

const concurrencyGroup = (concurrency, context) => {
  if (concurrency === undefined) return undefined;
  const group =
    typeof concurrency === 'string' ? concurrency : concurrency.group;
  const value = evaluateValue(group, context);
  // GitHub treats concurrency group names as case-insensitive.
  return typeof value === 'string' ? value.toLowerCase() : value;
};

/**
 * Only runs that actually publish may join the production concurrency group,
 * and every run that publishes must be serialized in it without cancelling an
 * in-progress deployment.
 */
export const findConcurrencyViolations = (workflow) => {
  const violations = [];
  const publishJobs = findPublishJobs(workflow);

  for (const { eventName, ref, context } of triggerableContexts(workflow)) {
    const deploys = publishJobs.some((jobId) =>
      publishWouldRun(workflow, jobId, context)
    );
    const joinedBy = [];
    if (
      concurrencyGroup(workflow.concurrency, context) ===
      PRODUCTION_CONCURRENCY_GROUP
    ) {
      joinedBy.push({ owner: 'workflow', concurrency: workflow.concurrency });
    }
    for (const [jobId, job] of Object.entries(workflow.jobs ?? {})) {
      if (
        jobWouldRun(workflow, jobId, context) &&
        concurrencyGroup(job.concurrency, context) ===
          PRODUCTION_CONCURRENCY_GROUP
      ) {
        joinedBy.push({
          owner: `job "${jobId}"`,
          concurrency: job.concurrency,
        });
      }
    }

    if (!deploys && joinedBy.length > 0) {
      violations.push(
        `${eventName} on ${ref} joins "${PRODUCTION_CONCURRENCY_GROUP}" without deploying`
      );
    }
    if (deploys && joinedBy.length === 0) {
      violations.push(
        `${eventName} on ${ref} deploys outside "${PRODUCTION_CONCURRENCY_GROUP}"`
      );
    }
    for (const { owner, concurrency } of joinedBy) {
      if (
        typeof concurrency === 'string' ||
        concurrency['cancel-in-progress'] !== false
      ) {
        violations.push(
          `${owner} may cancel an in-progress production deployment`
        );
      }
    }
  }
  return violations;
};

/**
 * The publish job must receive the site through an artifact produced by a
 * read-only job it depends on, and publish exactly what it downloaded.
 */
export const findArtifactHandoffViolations = (workflow) => {
  const violations = [];
  for (const publishJobId of findPublishJobs(workflow)) {
    const publishJob = workflow.jobs[publishJobId];
    const steps = publishJob.steps ?? [];
    const download = steps.find(
      (step) => actionName(step) === DOWNLOAD_ARTIFACT_ACTION
    );
    const publish = steps.find((step) => actionName(step) === PUBLISH_ACTION);
    if (!download) {
      violations.push(
        `job "${publishJobId}" does not download a build artifact`
      );
      continue;
    }
    for (const input of ['name', 'path']) {
      const value = download.with?.[input];
      if (typeof value !== 'string' || value.trim() === '') {
        violations.push(
          `job "${publishJobId}" artifact download needs a non-empty ${input}`
        );
      }
    }
    // Keep the bounded same-run, named-artifact handoff. Explicit selectors or
    // credentials could fetch a different run/repository despite a matching name.
    for (const input of [
      'run-id',
      'repository',
      'github-token',
      'pattern',
      'artifact-ids',
    ]) {
      if (Object.hasOwn(download.with ?? {}, input)) {
        violations.push(
          `job "${publishJobId}" artifact download overrides ${input}`
        );
      }
    }
    if (steps.indexOf(download) > steps.indexOf(publish)) {
      violations.push(
        `job "${publishJobId}" publishes before downloading the artifact`
      );
    }
    const publishDirectory = publish.with?.publish_dir;
    if (
      typeof publishDirectory !== 'string' ||
      publishDirectory.trim() === '' ||
      normalizeDirectory(publishDirectory) !==
        normalizeDirectory(download.with?.path)
    ) {
      violations.push(
        `job "${publishJobId}" publishes a directory other than the downloaded artifact`
      );
    }

    const needs = [publishJob.needs ?? []].flat();
    const producers = needs.filter((jobId) =>
      (workflow.jobs[jobId]?.steps ?? []).some(
        (step) =>
          actionName(step) === UPLOAD_ARTIFACT_ACTION &&
          step.with?.name === download.with?.name
      )
    );
    if (producers.length !== 1) {
      violations.push(
        `job "${publishJobId}" artifact "${download.with?.name}" is not uploaded by exactly one job it needs`
      );
    }
    for (const producerId of producers) {
      const upload = workflow.jobs[producerId].steps.find(
        (step) =>
          actionName(step) === UPLOAD_ARTIFACT_ACTION &&
          step.with?.name === download.with?.name
      );
      if (upload.with?.['if-no-files-found'] !== 'error') {
        violations.push(
          `artifact producer "${producerId}" does not fail on missing site files`
        );
      }
      const producerWrites = writeScopes(
        effectivePermissions(workflow, workflow.jobs[producerId])
      );
      if (producerWrites.length > 0) {
        violations.push(
          `artifact producer "${producerId}" has write permissions`
        );
      }
    }
  }
  return violations;
};
