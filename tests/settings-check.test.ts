// @vitest-environment node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  checkSettings,
  loadProposal,
  renderSettingsCheck,
} from '../scripts/ci/check-settings.mts';

type Json = Record<string, unknown>;
type Responses = Record<string, unknown>;

const repo = 'ceoloide/ergogen-gui';
const base = `repos/${repo}`;
const rulesetId = 1234;
const proposal = loadProposal();

// Real responses for this repository on 2026-11-14, before the proposal was
// applied, reduced to the fields the check reads.
const unapplied = JSON.parse(
  readFileSync(
    resolve(
      dirname(fileURLToPath(import.meta.url)),
      'ci/github/settings-unapplied.json'
    ),
    'utf8'
  )
) as Responses;

// The proposal as GitHub returns it once applied: rules in another order, and
// the defaults and metadata it adds (as in a real ruleset read back from
// another public repository), none of which may affect the result.
function applied(): Responses {
  const rules = structuredClone(proposal.ruleset.rules)
    .reverse()
    .map((rule): Json => ({ ...rule }));
  const pullRequest = rules.find((rule) => rule.type === 'pull_request');
  Object.assign(pullRequest?.parameters as Json, {
    required_reviewers: [],
    dismissal_restriction: { enabled: false, allowed_actors: [] },
    require_extra_approval_for_unattributed_changes: false,
    allowed_merge_methods: ['merge', 'squash', 'rebase'],
  });
  const effective = rules.map((rule) => ({
    ...rule,
    ruleset_source_type: 'Repository',
    ruleset_source: repo,
    ruleset_id: rulesetId,
  }));
  return {
    ...unapplied,
    [`${base}/rulesets?includes_parents=false`]: [
      {
        id: rulesetId,
        name: proposal.ruleset.name,
        target: 'branch',
        enforcement: 'active',
      },
    ],
    [`${base}/rulesets/${rulesetId}`]: {
      ...structuredClone(proposal.ruleset),
      id: rulesetId,
      rules,
      source_type: 'Repository',
      source: repo,
      node_id: 'RRS_example',
      created_at: '2026-11-15T10:00:00.000Z',
      updated_at: '2026-11-15T10:00:00.000Z',
      current_user_can_bypass: 'never',
      _links: { self: { href: `https://api.github.com/${base}/rulesets/1` } },
    },
    [`${base}/rules/branches/main`]: effective,
    [`${base}/actions/permissions/workflow`]: structuredClone(
      proposal.workflowPermissions
    ),
  };
}

const check = (responses: Responses) =>
  checkSettings(
    {
      json: async (path) => {
        if (!(path in responses)) throw new Error(`unexpected GET ${path}`);
        return structuredClone(responses[path]);
      },
      bytes: async (path) => {
        throw new Error(`unexpected download ${path}`);
      },
    },
    repo,
    proposal
  );

const liveRuleset = (responses: Responses) =>
  responses[`${base}/rulesets/${rulesetId}`] as Json & { rules: Json[] };
const liveParameters = (responses: Responses, type: string) =>
  liveRuleset(responses).rules.find((rule) => rule.type === type)
    ?.parameters as Json;

describe('repository settings check', () => {
  it('passes when GitHub enforces every proposed setting', async () => {
    // Act
    const result = await check(applied());

    // Assert
    expect(result.problems).toEqual([]);
    expect(result).toMatchObject({ passed: true, rulesetId });
    expect(renderSettingsCheck(result)).toContain(
      `Ruleset: https://github.com/${repo}/rules/${rulesetId}`
    );
  });

  it('fails on the live settings recorded before the cutover', async () => {
    // Act
    const result = await check(unapplied);

    // Assert
    expect(result.passed).toBe(false);
    expect(result.problems).toEqual([
      'no ruleset is named "main: require CI": the proposal is not applied',
      'Actions workflow permissions.default_workflow_permissions is "write", expected "read"',
      'Actions workflow permissions.can_approve_pull_request_reviews is true, expected false',
    ]);
  });

  it.each<[string, (responses: Responses) => void, string]>([
    [
      'a bypass actor',
      (responses) => {
        liveRuleset(responses).bypass_actors = [
          { actor_id: 5, actor_type: 'RepositoryRole', bypass_mode: 'always' },
        ];
      },
      'ruleset.bypass_actors is [{"actor_id":5,"actor_type":"RepositoryRole","bypass_mode":"always"}], expected []',
    ],
    [
      'an owner who can bypass',
      (responses) => {
        liveRuleset(responses).current_user_can_bypass = 'always';
      },
      'you can bypass the ruleset (current_user_can_bypass is "always", expected "never")',
    ],
    [
      'a bypass list hidden from a non-admin reader',
      (responses) => {
        delete liveRuleset(responses).bypass_actors;
      },
      'ruleset.bypass_actors is nothing, expected []',
    ],
    [
      'a disabled ruleset',
      (responses) => {
        liveRuleset(responses).enforcement = 'disabled';
      },
      'ruleset.enforcement is "disabled", expected "active"',
    ],
    [
      'a required check that any app may report',
      (responses) => {
        liveParameters(
          responses,
          'required_status_checks'
        ).required_status_checks = [{ context: 'lint-and-test' }];
      },
      'ruleset required_status_checks rule.required_status_checks[0].integration_id is nothing, expected 15368',
    ],
    [
      'an out-of-date branch allowed',
      (responses) => {
        liveParameters(
          responses,
          'required_status_checks'
        ).strict_required_status_checks_policy = false;
      },
      'ruleset required_status_checks rule.strict_required_status_checks_policy is false, expected true',
    ],
    [
      'an approval the sole owner cannot give',
      (responses) => {
        liveParameters(
          responses,
          'pull_request'
        ).required_approving_review_count = 1;
      },
      'ruleset pull_request rule.required_approving_review_count is 1, expected 0',
    ],
    [
      'unresolved conversations allowed',
      (responses) => {
        liveParameters(
          responses,
          'pull_request'
        ).required_review_thread_resolution = false;
      },
      'ruleset pull_request rule.required_review_thread_resolution is false, expected true',
    ],
    [
      'an extra rule that blocks every merge',
      (responses) => {
        liveRuleset(responses).rules.push({ type: 'update' });
      },
      'ruleset rules are deletion, non_fast_forward, pull_request, required_status_checks, update, expected deletion, non_fast_forward, pull_request, required_status_checks',
    ],
    [
      'a missing rule',
      (responses) => {
        const ruleset = liveRuleset(responses);
        ruleset.rules = ruleset.rules.filter(
          (rule) => rule.type !== 'non_fast_forward'
        );
      },
      'ruleset rules are deletion, pull_request, required_status_checks, expected deletion, non_fast_forward, pull_request, required_status_checks',
    ],
    [
      'a ruleset that does not reach the default branch',
      (responses) => {
        responses[`${base}/rules/branches/main`] = [];
      },
      'the pull_request rule does not apply to main',
    ],
    [
      'a ruleset that also covers the release branch',
      (responses) => {
        liveRuleset(responses).conditions = {
          ref_name: { include: ['~ALL'], exclude: [] },
        };
        responses[`${base}/rules/branches/gh-pages`] = [
          {
            type: 'pull_request',
            ruleset_source_type: 'Repository',
            ruleset_source: repo,
            ruleset_id: rulesetId,
          },
        ];
      },
      `the pull_request rule of ruleset ${rulesetId} (Repository ${repo}) applies to gh-pages, which deploy.yaml pushes releases to`,
    ],
    [
      'another repository ruleset that blocks updates to the default branch',
      (responses) => {
        (responses[`${base}/rules/branches/main`] as Json[]).push({
          type: 'update',
          ruleset_source_type: 'Repository',
          ruleset_source: repo,
          ruleset_id: 999,
        });
      },
      `the update rule of ruleset 999 (Repository ${repo}) also applies to main`,
    ],
    [
      'an organization ruleset that adds a status check to the default branch',
      (responses) => {
        (responses[`${base}/rules/branches/main`] as Json[]).push({
          type: 'required_status_checks',
          parameters: {
            strict_required_status_checks_policy: false,
            required_status_checks: [{ context: 'other' }],
          },
          ruleset_source_type: 'Organization',
          ruleset_source: 'ceoloide',
          ruleset_id: 77,
        });
      },
      'the required_status_checks rule of ruleset 77 (Organization ceoloide) also applies to main',
    ],
    [
      'another repository ruleset that blocks updates to the release branch',
      (responses) => {
        responses[`${base}/rules/branches/gh-pages`] = [
          {
            type: 'update',
            ruleset_source_type: 'Repository',
            ruleset_source: repo,
            ruleset_id: 999,
          },
        ];
      },
      `the update rule of ruleset 999 (Repository ${repo}) applies to gh-pages, which deploy.yaml pushes releases to`,
    ],
    [
      'an organization ruleset that covers the release branch',
      (responses) => {
        responses[`${base}/rules/branches/gh-pages`] = [
          {
            type: 'non_fast_forward',
            ruleset_source_type: 'Organization',
            ruleset_source: 'ceoloide',
            ruleset_id: 77,
          },
        ];
      },
      'the non_fast_forward rule of ruleset 77 (Organization ceoloide) applies to gh-pages, which deploy.yaml pushes releases to',
    ],
    [
      'a rule of the proposal ruleset reported for another source',
      (responses) => {
        const rules = responses[`${base}/rules/branches/main`] as Json[];
        const deletion = rules.find((rule) => rule.type === 'deletion');
        Object.assign(deletion as Json, { ruleset_source: 'someone/else' });
      },
      `the deletion rule of ruleset ${rulesetId} (Repository someone/else) also applies to main`,
    ],
    [
      'two rulesets with the proposal name',
      (responses) => {
        const named = responses[
          `${base}/rulesets?includes_parents=false`
        ] as Json[];
        named.push({ ...named[0], id: rulesetId + 1 });
      },
      '2 rulesets are named "main: require CI"; keep one',
    ],
    [
      'Actions able to approve pull requests',
      (responses) => {
        responses[`${base}/actions/permissions/workflow`] = {
          default_workflow_permissions: 'read',
          can_approve_pull_request_reviews: true,
        };
      },
      'Actions workflow permissions.can_approve_pull_request_reviews is true, expected false',
    ],
  ])('fails with %s', async (_, change, problem) => {
    // Arrange
    const responses = applied();
    change(responses);

    // Act
    const result = await check(responses);

    // Assert
    expect(result.passed).toBe(false);
    expect(result.problems).toContain(problem);
  });

  it('cannot run on a branch rule without a ruleset ID', async () => {
    // Arrange
    const responses = applied();
    delete (responses[`${base}/rules/branches/main`] as Json[])[0].ruleset_id;

    // Act and assert
    await expect(check(responses)).rejects.toThrow(
      'rules for main[].ruleset_id is not a number'
    );
  });

  it('cannot run on a response of an unexpected shape', async () => {
    // Arrange
    const responses = applied();
    responses[`${base}/rulesets?includes_parents=false`] = {
      message: 'Not Found',
    };

    // Act and assert
    await expect(check(responses)).rejects.toThrow(
      'rulesets is not a list of objects'
    );
  });
});
