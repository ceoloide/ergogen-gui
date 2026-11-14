// Read-only check that GitHub enforces the reviewed repository settings:
//
//   pnpm check:settings [--repo owner/name] [--json]
//
// The settings are the branch ruleset in ruleset-proposal.json and the
// Actions token defaults in workflow-permissions-proposal.json; DEVELOPMENT.md
// ("Branch rules") applies and rolls them back. Run it as the repository owner
// from a trusted checkout of main: only an admin can read a ruleset's bypass
// list. It only reads, through `gh api`.
// Exit status: 0 when GitHub enforces every proposed setting, 1 when any is
// missing or different (as before they are applied), 2 when the check could
// not run.
import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { ghReader, type GitHubReader } from './assess-pr.mts';

/** deploy.yaml pushes releases here, so no rule of the ruleset may apply. */
export const publishBranch = 'gh-pages';

interface Rule {
  type: string;
  parameters?: Record<string, unknown>;
}

export interface Proposal {
  ruleset: { name: string; rules: Rule[] } & Record<string, unknown>;
  workflowPermissions: Record<string, unknown>;
}

export interface SettingsCheck {
  passed: boolean;
  repo: string;
  rulesetId?: number;
  problems: string[];
}

const readJson = (name: string) =>
  JSON.parse(readFileSync(new URL(name, import.meta.url), 'utf8')) as unknown;

export const loadProposal = (): Proposal => ({
  ruleset: readJson('./ruleset-proposal.json') as Proposal['ruleset'],
  workflowPermissions: readJson(
    './workflow-permissions-proposal.json'
  ) as Proposal['workflowPermissions'],
});

class ApiShapeError extends Error {}
type Json = Record<string, unknown>;
const isObject = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const object = (value: unknown, where: string): Json => {
  if (!isObject(value)) throw new ApiShapeError(`${where} is not an object`);
  return value;
};
const list = (value: unknown, where: string): Json[] => {
  if (!Array.isArray(value) || !value.every(isObject)) {
    throw new ApiShapeError(`${where} is not a list of objects`);
  }
  return value;
};

const show = (value: unknown) =>
  value === undefined ? 'nothing' : JSON.stringify(value);

/**
 * Lists where `live` differs from `want`. Every key that `want` names must
 * hold the same value, and arrays must match element for element, so an added
 * bypass actor or status check is a difference. Keys that only `live` has are
 * ignored: GitHub fills in defaults for parameters the proposal leaves out.
 */
export function differences(
  live: unknown,
  want: unknown,
  path: string
): string[] {
  const mismatch = [`${path} is ${show(live)}, expected ${show(want)}`];
  if (Array.isArray(want)) {
    if (!Array.isArray(live) || live.length !== want.length) return mismatch;
    return want.flatMap((item, index) =>
      differences(live[index], item, `${path}[${index}]`)
    );
  }
  if (isObject(want)) {
    if (!isObject(live)) return mismatch;
    return Object.entries(want).flatMap(([key, value]) =>
      differences(live[key], value, `${path}.${key}`)
    );
  }
  return live === want ? [] : mismatch;
}

function rulesetProblems(live: Json, want: Proposal['ruleset']): string[] {
  const { rules: wantRules, ...wantFields } = want;
  const liveRules = list(live.rules, 'ruleset.rules');
  const types = (rules: { type?: unknown }[]) =>
    rules.map((rule) => String(rule.type)).sort();
  const problems = differences(live, wantFields, 'ruleset');
  // Rules are compared by type, because their order means nothing. An extra
  // rule is a problem too: `update` alone, for example, would block merges.
  if (types(liveRules).join() !== types(wantRules).join()) {
    problems.push(
      `ruleset rules are ${types(liveRules).join(', ')}, expected ${types(wantRules).join(', ')}`
    );
  }
  for (const rule of wantRules) {
    const match = liveRules.find((candidate) => candidate.type === rule.type);
    if (match && rule.parameters) {
      problems.push(
        ...differences(
          match.parameters,
          rule.parameters,
          `ruleset ${rule.type} rule`
        )
      );
    }
  }
  // An admin who can bypass is not held to the ruleset, whatever its list says.
  if (live.current_user_can_bypass !== 'never') {
    problems.push(
      `you can bypass the ruleset (current_user_can_bypass is ${show(live.current_user_can_bypass)}, expected "never")`
    );
  }
  return problems;
}

/** Reads the live settings and lists every way they differ from `proposal`. */
export async function checkSettings(
  reader: GitHubReader,
  repo: string,
  proposal: Proposal
): Promise<SettingsCheck> {
  const problems: string[] = [];
  const defaultBranch = object(
    await reader.json(`repos/${repo}`),
    'repository'
  ).default_branch;
  if (typeof defaultBranch !== 'string') {
    throw new ApiShapeError('repository.default_branch is not a string');
  }

  const named = list(
    await reader.json(`repos/${repo}/rulesets?includes_parents=false`),
    'rulesets'
  ).filter((ruleset) => ruleset.name === proposal.ruleset.name);
  let rulesetId: number | undefined;
  if (named.length === 0) {
    problems.push(
      `no ruleset is named "${proposal.ruleset.name}": the proposal is not applied`
    );
  } else if (named.length > 1) {
    problems.push(
      `${named.length} rulesets are named "${proposal.ruleset.name}"; keep one`
    );
  } else if (typeof named[0].id !== 'number') {
    throw new ApiShapeError('rulesets[].id is not a number');
  } else {
    rulesetId = named[0].id;
    const live = object(
      await reader.json(`repos/${repo}/rulesets/${rulesetId}`),
      'ruleset'
    );
    problems.push(...rulesetProblems(live, proposal.ruleset));

    // What GitHub actually applies to each branch, from every ruleset.
    const appliedTo = async (branch: string) =>
      list(
        await reader.json(
          `repos/${repo}/rules/branches/${encodeURIComponent(branch)}`
        ),
        `rules for ${branch}`
      )
        .filter((rule) => rule.ruleset_id === rulesetId)
        .map((rule) => String(rule.type));
    const onDefault = await appliedTo(defaultBranch);
    for (const rule of proposal.ruleset.rules) {
      if (!onDefault.includes(rule.type)) {
        problems.push(
          `the ${rule.type} rule does not apply to ${defaultBranch}`
        );
      }
    }
    const onPublish = await appliedTo(publishBranch);
    if (onPublish.length > 0) {
      problems.push(
        `rules ${onPublish.join(', ')} apply to ${publishBranch}, which deploy.yaml pushes releases to`
      );
    }
  }

  problems.push(
    ...differences(
      object(
        await reader.json(`repos/${repo}/actions/permissions/workflow`),
        'workflow permissions'
      ),
      proposal.workflowPermissions,
      'Actions workflow permissions'
    )
  );
  return { passed: problems.length === 0, repo, rulesetId, problems };
}

export function renderSettingsCheck(result: SettingsCheck): string {
  const lines = [
    `Settings of ${result.repo}: ${result.passed ? 'ENFORCED' : 'NOT ENFORCED'}`,
  ];
  if (result.rulesetId !== undefined) {
    lines.push(
      `Ruleset: https://github.com/${result.repo}/rules/${result.rulesetId}`
    );
  }
  if (result.problems.length > 0) {
    lines.push('Problems:', ...result.problems.map((text) => `  - ${text}`));
  }
  return lines.join('\n') + '\n';
}

const execFileAsync = promisify(execFile);

async function main(argv: string[]) {
  const json = argv.includes('--json');
  const repoIndex = argv.indexOf('--repo');
  const repo =
    repoIndex >= 0
      ? argv[repoIndex + 1]
      : (
          await execFileAsync('gh', [
            'repo',
            'view',
            '--json',
            'nameWithOwner',
            '--jq',
            '.nameWithOwner',
          ])
        ).stdout.trim();
  const known = new Set(['--json', '--repo', repo]);
  if (
    !repo ||
    !/^[\w.-]+\/[\w.-]+$/.test(repo) ||
    argv.some((arg) => !known.has(arg))
  ) {
    process.stderr.write(
      'Usage: pnpm check:settings [--repo owner/name] [--json]\n'
    );
    return 2;
  }
  const result = await checkSettings(ghReader, repo, loadProposal());
  process.stdout.write(
    json ? JSON.stringify(result, null, 2) + '\n' : renderSettingsCheck(result)
  );
  return result.passed ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main(process.argv.slice(2)).then(
    (code) => (process.exitCode = code),
    (error: Error) => {
      process.stderr.write(`Settings check could not run: ${error.message}\n`);
      process.exitCode = 2;
    }
  );
}
