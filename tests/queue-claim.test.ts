// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { claim, main, NotTodo, Refused } from '../scripts/queue/claim.mts';

/** The login of `gh` in the fake. */
const VIEWER = { id: 'U_viewer', login: 'maintainer' };
/** The queue, Project 3 of ceoloide, and another Project. */
const QUEUE = 'PVT_queue';
const OTHER_PROJECT = 'PVT_other';
const STATUS_FIELD = 'PVTSSF_status';
const STATUSES = ['Proposed', 'Todo', 'In progress', 'Done'];

interface FakeIssue {
  title?: string;
  closed?: boolean;
  assignees?: string[];
  /**
   * The status of its item in the queue: undefined for an issue outside the
   * queue, and null for an item without a status.
   */
  status?: string | null;
  /** The status of its item in another Project, if it has one. */
  otherStatus?: string;
}

/**
 * GitHub in memory, for the queries and mutations of `pnpm queue:claim`.
 * `issues` holds the issues of ceoloide/ergogen-gui by number, and is what
 * GitHub holds after the writes. `writes` lists every mutation that GitHub
 * received. A read of a number that is not in `issues` fails as `gh api`
 * fails. With `assigns: false`, GitHub drops the assignment without an error.
 * With `failStatus`, the first status write fails before GitHub saves it.
 */
function fakeGitHub(
  issues: Record<number, FakeIssue>,
  {
    assigns = true,
    failStatus = false,
  }: { assigns?: boolean; failStatus?: boolean } = {}
) {
  const calls: { args: string[]; query: string }[] = [];
  const writes: { query: string; variables: Record<string, unknown> }[] = [];
  let statusFailure = failStatus;
  const numberOf = (id: unknown) => Number(String(id).replace(/^\D+/, ''));
  const issueNode = (number: number) => {
    const issue = issues[number];
    const item = (project: string, status: string | null) => ({
      id: `${project === QUEUE ? 'PVTI_' : 'OTHER_'}${number}`,
      project: { id: project },
      fieldValueByName: status === null ? null : { name: status },
    });
    return {
      id: `I_${number}`,
      number,
      title: issue.title ?? `Issue ${number}`,
      url: `https://github.com/ceoloide/ergogen-gui/issues/${number}`,
      closed: issue.closed ?? false,
      projectItems: {
        nodes: [
          ...(issue.otherStatus === undefined
            ? []
            : [item(OTHER_PROJECT, issue.otherStatus)]),
          ...(issue.status === undefined ? [] : [item(QUEUE, issue.status)]),
        ],
      },
    };
  };
  const api = async (args: string[], body: unknown) => {
    const { query, variables } = body as {
      query: string;
      variables: Record<string, unknown>;
    };
    calls.push({ args, query });
    if (/^query\b/.test(query)) {
      const number = variables.number as number;
      if (!issues[number]) {
        throw Object.assign(new Error('Command failed: gh api graphql'), {
          stderr: `gh: Could not resolve to an Issue with the number of ${number}.\n`,
        });
      }
      return {
        data: {
          viewer: VIEWER,
          repository: { issue: issueNode(number) },
          user: {
            projectV2: {
              id: QUEUE,
              title: 'Ergogen GUI 2027',
              field: {
                id: STATUS_FIELD,
                options: STATUSES.map((name) => ({ id: `opt ${name}`, name })),
              },
            },
          },
        },
      };
    }
    writes.push({ query, variables });
    if (query.includes('addAssigneesToAssignable')) {
      const issue = issues[numberOf(variables.issue)];
      const assignees = (issue.assignees ??= []);
      if (assigns && variables.viewer === VIEWER.id) {
        if (!assignees.includes(VIEWER.login)) assignees.push(VIEWER.login);
      }
      return {
        data: {
          addAssigneesToAssignable: {
            assignable: {
              assignees: { nodes: assignees.map((login) => ({ login })) },
            },
          },
        },
      };
    }
    if (query.includes('updateProjectV2ItemFieldValue')) {
      if (statusFailure) {
        statusFailure = false;
        throw new Error('The connection to GitHub dropped.');
      }
      const item = String(variables.item);
      if (
        variables.project !== QUEUE ||
        variables.field !== STATUS_FIELD ||
        !item.startsWith('PVTI_')
      ) {
        throw new Error(
          `The fake has no item ${item} in ${variables.project}.`
        );
      }
      issues[numberOf(item)].status = String(variables.option).slice(4);
      return { data: { updateProjectV2ItemFieldValue: {} } };
    }
    throw new Error(`The fake has no call ${query}`);
  };
  return { api, calls, writes };
}

describe('the claim', () => {
  it('assigns the login of gh and sets the status In progress', async () => {
    // Arrange
    const issues = {
      280: { title: 'R20-07 Add a budget file', status: 'Todo' },
    };
    const { api } = fakeGitHub(issues);

    // Act
    const claimed = await claim(280, api);

    // Assert
    expect(claimed).toEqual({
      issue: 280,
      title: 'R20-07 Add a budget file',
      url: 'https://github.com/ceoloide/ergogen-gui/issues/280',
      assignee: 'maintainer',
    });
    expect(issues[280]).toEqual({
      title: 'R20-07 Add a budget file',
      status: 'In progress',
      assignees: ['maintainer'],
    });
  });

  it('changes only the assignees and the status of the named issue', async () => {
    // Arrange
    const issues: Record<number, FakeIssue> = {
      10: { status: 'Todo', assignees: ['owner'], otherStatus: 'Todo' },
      11: { status: 'Todo' },
    };
    const before = structuredClone(issues);
    const { api, writes } = fakeGitHub(issues);

    // Act
    await claim(10, api);

    // Assert
    expect(issues).toEqual({
      10: {
        ...before[10],
        status: 'In progress',
        assignees: ['owner', 'maintainer'],
      },
      11: before[11],
    });
    expect(writes).toHaveLength(2);
  });

  it('assigns before it sets the status, so a failed run leaves the item Todo, and a second run finishes the claim', async () => {
    // Arrange
    const issues = { 10: { status: 'Todo' } };
    const { api } = fakeGitHub(issues, { failStatus: true });

    // Act
    const failed = claim(10, api);
    await expect(failed).rejects.toThrow('The connection to GitHub dropped.');
    const afterFailure = structuredClone(issues);
    await claim(10, api);

    // Assert
    expect(afterFailure[10]).toEqual({
      status: 'Todo',
      assignees: ['maintainer'],
    });
    expect(issues[10]).toEqual({
      status: 'In progress',
      assignees: ['maintainer'],
    });
  });

  it('fails without a status write when GitHub drops the assignment', async () => {
    // Arrange
    const issues = { 10: { status: 'Todo' } };
    const { api, writes } = fakeGitHub(issues, { assigns: false });

    // Act
    const result = claim(10, api);

    // Assert
    await expect(result).rejects.toThrow(/did not assign #10 to maintainer/);
    expect(issues[10]).toEqual({ status: 'Todo', assignees: [] });
    expect(writes).toHaveLength(1);
  });

  it('refuses a second claim of the same item', async () => {
    // Arrange
    const issues = { 10: { status: 'Todo' } };
    const { api } = fakeGitHub(issues);
    await claim(10, api);

    // Act
    const second = claim(10, api);

    // Assert
    await expect(second).rejects.toBeInstanceOf(NotTodo);
  });

  it.each([
    ['is closed', { closed: true, status: 'Todo' }, Refused],
    ['is outside the queue', { status: undefined }, Refused],
    ['is only in another Project', { otherStatus: 'Todo' }, Refused],
    ['has the status In progress', { status: 'In progress' }, NotTodo],
    ['has the status Done', { status: 'Done' }, NotTodo],
    ['has the status Proposed', { status: 'Proposed' }, NotTodo],
    ['has no status', { status: null }, NotTodo],
  ])(
    'refuses an issue that %s and writes nothing',
    async (_reason, fields, type) => {
      // Arrange
      const issues: Record<number, FakeIssue> = { 10: fields };
      const before = structuredClone(issues);
      const { api, writes } = fakeGitHub(issues);

      // Act
      const result = claim(10, api);

      // Assert
      await expect(result).rejects.toBeInstanceOf(type);
      expect(writes).toEqual([]);
      expect(issues).toEqual(before);
    }
  );

  it('writes nothing for an issue that does not exist', async () => {
    // Arrange
    const { api, writes } = fakeGitHub({ 10: { status: 'Todo' } });

    // Act
    const result = claim(99999, api);

    // Assert
    await expect(result).rejects.toThrow('Command failed: gh api graphql');
    expect(writes).toEqual([]);
  });
});

describe('the command', () => {
  async function run(args: string[], api = fakeGitHub({}).api) {
    const stdout: string[] = [];
    const stderr: string[] = [];
    const status = await main(args, {
      api,
      stdout: (text) => stdout.push(text),
      stderr: (text) => stderr.push(text),
    });
    return { status, stdout: stdout.join('\n'), stderr: stderr.join('\n') };
  }

  it('prints the claimed issue and exits with 0', async () => {
    // Arrange
    const { api } = fakeGitHub({
      280: { title: 'R20-07 Add a budget file', status: 'Todo' },
    });

    // Act
    const { status, stdout } = await run(['280'], api);

    // Assert
    expect(status).toBe(0);
    expect(stdout).toBe(
      [
        'Claimed #280 R20-07 Add a budget file',
        'Assigned to maintainer, status In progress.',
        'https://github.com/ceoloide/ergogen-gui/issues/280',
      ].join('\n')
    );
  });

  it.each([
    ['a closed issue', { closed: true, status: 'Todo' }, 2, /#10 is closed/],
    ['an issue outside the queue', {}, 2, /#10 is not in the Project/],
    [
      'an item that is no longer Todo',
      { status: 'In progress' },
      3,
      /#10 has the status In progress, not Todo/,
    ],
  ])('exits with %s', async (_case, fields, expected, message) => {
    // Arrange
    const { api } = fakeGitHub({ 10: fields });

    // Act
    const { status, stdout, stderr } = await run(['10'], api);

    // Assert
    expect(status).toBe(expected);
    expect(stdout).toBe('');
    expect(stderr).toMatch(message);
  });

  it('exits with 1 and prints the error of gh for an issue that does not exist', async () => {
    // Act
    const { status, stderr } = await run(['99999']);

    // Assert
    expect(status).toBe(1);
    expect(stderr).toBe(
      'gh: Could not resolve to an Issue with the number of 99999.'
    );
  });

  it.each([
    [[]],
    [['abc']],
    [['0']],
    [['#280']],
    [['280', '281']],
    [['--force']],
  ])(
    'prints the usage, exits with 2, and calls no API for %j',
    async (args) => {
      // Arrange
      const { api, calls } = fakeGitHub({ 280: { status: 'Todo' } });

      // Act
      const { status, stderr } = await run(args, api);

      // Assert
      expect(status).toBe(2);
      expect(stderr).toContain('Usage: pnpm queue:claim <issue>');
      expect(calls).toEqual([]);
    }
  );

  it('prints the help and calls no API', async () => {
    // Arrange
    const { api, calls } = fakeGitHub({});

    // Act
    const { status, stdout } = await run(['--help'], api);

    // Assert
    expect(status).toBe(0);
    expect(stdout).toContain('Usage: pnpm queue:claim <issue>');
    expect(calls).toEqual([]);
  });

  it('calls only the GraphQL API: one query, then two mutations', async () => {
    // Arrange
    const { api, calls } = fakeGitHub({ 10: { status: 'Todo' } });

    // Act
    await run(['10'], api);

    // Assert
    expect(calls.map(({ args }) => args)).toEqual([
      ['graphql'],
      ['graphql'],
      ['graphql'],
    ]);
    expect(calls.map(({ query }) => query.split(/[\s(]/)[0])).toEqual([
      'query',
      'mutation',
      'mutation',
    ]);
  });

  describe('run as a script', () => {
    const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    const script = join(projectRoot, 'scripts', 'queue', 'claim.mts');

    // Runs the script with no `gh` on the PATH and an empty home folder, so a
    // run that reached GitHub would fail with exit status 1.
    function spawn(args: string[]) {
      const home = mkdtempSync(join(tmpdir(), 'queue-claim-'));
      const result = spawnSync(process.execPath, [script, ...args], {
        env: { PATH: '', HOME: home },
        encoding: 'utf8',
      });
      rmSync(home, { recursive: true, force: true });
      return result;
    }

    it('prints the help without a read', () => {
      // Act
      const { status, stdout } = spawn(['--help']);

      // Assert
      expect(status).toBe(0);
      expect(stdout).toContain('Usage: pnpm queue:claim <issue>');
    });

    it('prints the usage and exits with 2 without an issue', () => {
      // Act
      const { status, stderr } = spawn([]);

      // Assert
      expect(status).toBe(2);
      expect(stderr).toContain('Usage: pnpm queue:claim <issue>');
    });

    it('exits with 1 when gh is missing', () => {
      // Act
      const { status, stdout } = spawn(['280']);

      // Assert
      expect(status).toBe(1);
      expect(stdout).toBe('');
    });
  });
});
