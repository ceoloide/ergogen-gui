// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { main, nextTask } from '../scripts/queue/next.mts';

interface FakeIssue {
  title?: string;
  closed?: boolean;
  /** The title of its milestone. Undefined for an issue in no milestone. */
  release?: string;
  /** The status in the Project. Undefined for an issue outside the Project. */
  status?: string;
  labels?: string[];
  /** The issues that block this one, as keys of the fake. */
  blockedBy?: string[];
}

/**
 * The GitHub API in memory. `issues` holds the issues of ceoloide/ergogen-gui
 * by number and the issues of other repositories by `owner/name#number`. A
 * query for open issues returns the open issues of ceoloide/ergogen-gui, at
 * most 100 per page. `calls` lists every call of the API.
 */
function fakeApi(issues: Record<string, FakeIssue>) {
  const calls: { args: string[]; query: string }[] = [];
  const open = Object.keys(issues).filter(
    (key) => /^\d+$/.test(key) && !issues[key].closed
  );
  const issueNode = (key: string) => {
    const issue = issues[key];
    return {
      number: Number(key),
      title: issue.title ?? `Issue ${key}`,
      url: `https://github.com/ceoloide/ergogen-gui/issues/${key}`,
      milestone: issue.release ? { title: issue.release } : null,
      labels: { nodes: (issue.labels ?? []).map((name) => ({ name })) },
      blockedBy: {
        nodes: (issue.blockedBy ?? []).map((blocker) => ({
          closed: issues[blocker].closed ?? false,
        })),
      },
      projectItems: {
        nodes:
          issue.status === undefined
            ? []
            : [
                {
                  project: { number: 3, owner: { login: 'ceoloide' } },
                  fieldValueByName: { name: issue.status },
                },
              ],
      },
    };
  };
  const api = async (args: string[], body: unknown) => {
    const { query, variables } = body as {
      query: string;
      variables: { after: string | null };
    };
    calls.push({ args, query });
    const from = Number(variables.after ?? 0);
    return {
      data: {
        repository: {
          issues: {
            pageInfo: {
              hasNextPage: from + 100 < open.length,
              endCursor: String(from + 100),
            },
            nodes: open.slice(from, from + 100).map(issueNode),
          },
        },
      },
    };
  };
  return { api, calls };
}

/** An issue that is ready, in v0.20, with the given fields changed. */
const ready = (fields: FakeIssue = {}): FakeIssue => ({
  release: 'v0.20',
  status: 'Todo',
  labels: ['size:S', 'mode:auto'],
  ...fields,
});

/** The number of the issue that `pnpm queue:next` prints, or null. */
async function next(issues: Record<string, FakeIssue>) {
  return (await nextTask(fakeApi(issues).api))?.issue ?? null;
}

describe('the next task', () => {
  it('is the ready item of the lowest release', async () => {
    // Arrange
    const issues = {
      10: ready({ title: 'R21-01 Later', release: 'v0.21' }),
      11: ready({ title: 'R20-02 Earlier' }),
    };

    // Act
    const task = await nextTask(fakeApi(issues).api);

    // Assert
    expect(task).toEqual({
      issue: 11,
      title: 'R20-02 Earlier',
      url: 'https://github.com/ceoloide/ergogen-gui/issues/11',
      release: 'v0.20',
      priority: null,
      size: 'S',
      mode: 'auto',
    });
  });

  it.each(['P0', 'P1'])(
    'is a %s item of a later release before every item of v0.20',
    async (priority) => {
      // Arrange
      const issues = {
        10: ready({ title: 'R20-01 First of v0.20' }),
        11: ready({
          title: 'R20-02 Second of v0.20',
          labels: ['mode:auto', 'priority:P2'],
        }),
        12: ready({
          title: 'R25-09 Urgent',
          release: 'v0.25',
          labels: ['mode:auto', `priority:${priority}`],
        }),
      };

      // Act
      const issue = await next(issues);

      // Assert
      expect(issue).toBe(12);
    }
  );

  it('is P0 before P1 in one release', async () => {
    // Arrange
    const issues = {
      10: ready({ title: 'R20-01 P1', labels: ['priority:P1'] }),
      11: ready({ title: 'R20-02 P0', labels: ['priority:P0'] }),
    };

    // Act
    const issue = await next(issues);

    // Assert
    expect(issue).toBe(11);
  });

  /** Each reason alone keeps an item from being the next task. */
  const reasons: [string, FakeIssue][] = [
    ['is blocked by an open issue', { blockedBy: ['90'] }],
    ['has the mode owner', { labels: ['mode:owner'] }],
    ['has the label decision', { labels: ['mode:auto', 'decision'] }],
    ['has the status Proposed', { status: 'Proposed' }],
    ['has the status In progress', { status: 'In progress' }],
    ['has the status Done', { status: 'Done' }],
    ['is outside the Project', { status: undefined }],
    ['is in the milestone Backlog', { release: 'Backlog' }],
    ['is in no milestone', { release: undefined }],
  ];

  it.each(reasons)(
    'is never an item that %s, also when it comes first otherwise',
    async (_reason, fields) => {
      // Arrange
      const issues = {
        10: ready({ title: 'R20-01 First', ...fields }),
        11: ready({ title: 'R20-02 Second' }),
        90: { title: 'A blocker', release: 'v0.20' },
      };

      // Act
      const issue = await next(issues);

      // Assert
      expect(issue).toBe(11);
    }
  );

  it.each(['P3', 'P4'])(
    'is a %s item only when no other item is ready',
    async (priority) => {
      // Arrange
      const low = ready({
        title: 'R20-01 Low priority',
        labels: ['mode:auto', `priority:${priority}`],
      });
      const other = ready({ title: 'R25-01 Other', release: 'v0.25' });

      // Act
      const withOther = await next({ 10: low, 11: other });
      const withoutOther = await Promise.all(
        reasons.map(([, fields]) =>
          next({
            10: low,
            11: { ...other, ...fields },
            90: { title: 'A blocker', release: 'v0.20' },
          })
        )
      );

      // Assert
      expect(withOther).toBe(11);
      expect(withoutOther).toEqual(reasons.map(() => 10));
    }
  );

  it.each([
    ['in ceoloide/ergogen-gui', '90'],
    ['in another repository', 'ergogen/ergogen#12'],
  ])(
    'waits for an open blocker %s, and is ready once it is closed',
    async (_where, blocker) => {
      // Arrange
      const issues = (closed: boolean) => ({
        10: ready({ title: 'R20-01 Blocked', blockedBy: [blocker] }),
        11: ready({ title: 'R20-02 Free' }),
        [blocker]: { title: 'The blocker', closed },
      });

      // Act
      const whileOpen = await next(issues(false));
      const onceClosed = await next(issues(true));

      // Assert
      expect(whileOpen).toBe(11);
      expect(onceClosed).toBe(10);
    }
  );

  it('is found on the third page of 250 open issues', async () => {
    // Arrange
    const issues: Record<string, FakeIssue> = {};
    for (let number = 1; number <= 250; number++) {
      issues[number] = ready({
        title: `R21-${number} Later`,
        release: 'v0.21',
      });
    }
    issues[240] = ready({ title: 'R20-01 The answer' });
    const { api, calls } = fakeApi(issues);

    // Act
    const task = await nextTask(api);

    // Assert
    expect(task?.issue).toBe(240);
    expect(calls).toHaveLength(3);
  });

  it.each([
    ['v0.9', 'v0.20'],
    ['v0.20', 'v0.20.1'],
    ['v0.20.1', 'v0.21'],
    ['v0.25', 'v1.0'],
  ])('is in %s before %s, as versions compare', async (earlier, later) => {
    // Arrange
    const issues = {
      10: ready({ title: 'R1-01 Later', release: later }),
      11: ready({ title: 'R2-01 Earlier', release: earlier }),
    };

    // Act
    const issue = await next(issues);

    // Assert
    expect(issue).toBe(11);
  });

  it.each([
    ['the roadmap id as numbers', 'R20-10 Tenth', 'R20-9 Ninth', 11],
    ['the roadmap id before no id', 'Without an id', 'R20-99 With an id', 11],
    [
      'the issue number for one roadmap id',
      'R20-05 Lower',
      'R20-05 Higher',
      10,
    ],
    ['the issue number without an id', 'Lower', 'Higher', 10],
  ])(
    'follows %s inside one release and one priority',
    async (_order, first, second, expected) => {
      // Arrange
      const issues = {
        10: ready({ title: first, labels: ['priority:P2'] }),
        11: ready({ title: second, labels: ['priority:P2'] }),
      };

      // Act
      const issue = await next(issues);

      // Assert
      expect(issue).toBe(expected);
    }
  );

  it('reads the status of the queue, not the status in another Project', async () => {
    // Arrange
    const { api } = fakeApi({ 10: ready({ status: 'Proposed' }) });
    const withOtherProject = async (args: string[], body: unknown) => {
      const reply = (await api(args, body)) as {
        data: {
          repository: {
            issues: {
              nodes: { projectItems: { nodes: unknown[] } }[];
            };
          };
        };
      };
      for (const node of reply.data.repository.issues.nodes) {
        node.projectItems.nodes.unshift(
          {
            project: { number: 3, owner: { login: 'someone-else' } },
            fieldValueByName: { name: 'Todo' },
          },
          {
            project: { number: 4, owner: { login: 'ceoloide' } },
            fieldValueByName: { name: 'Todo' },
          }
        );
      }
      return reply;
    };

    // Act
    const task = await nextTask(withOtherProject);

    // Assert
    expect(task).toBeNull();
  });

  it('is null when no item is ready', async () => {
    // Arrange
    const issues = Object.fromEntries(
      reasons.map(([, fields], index) => [
        String(10 + index),
        ready({ title: `R20-${index} Not ready`, ...fields }),
      ])
    );
    issues[90] = { title: 'A blocker', release: 'v0.20' };

    // Act
    const issue = await next(issues);

    // Assert
    expect(issue).toBeNull();
  });
});

describe('the command', () => {
  const issues = {
    278: ready({
      title: 'R20-05 Run validation through one runner',
      labels: ['size:M', 'mode:auto'],
    }),
    383: ready({
      title: 'R20-18 Make two builds give the same output',
      labels: ['size:S', 'mode:review', 'priority:P3'],
    }),
  };

  async function run(args: string[], api = fakeApi(issues).api) {
    const stdout: string[] = [];
    const stderr: string[] = [];
    const status = await main(args, {
      api,
      stdout: (text) => stdout.push(text),
      stderr: (text) => stderr.push(text),
    });
    return { status, stdout: stdout.join('\n'), stderr: stderr.join('\n') };
  }

  it('prints the next task', async () => {
    // Act
    const { status, stdout } = await run([]);

    // Assert
    expect(status).toBe(0);
    expect(stdout).toBe(
      [
        '#278 R20-05 Run validation through one runner',
        'release v0.20, priority none, size M, mode auto',
        'https://github.com/ceoloide/ergogen-gui/issues/278',
      ].join('\n')
    );
  });

  it('prints the next task as JSON with --json', async () => {
    // Act
    const { status, stdout } = await run(['--json']);

    // Assert
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      next: {
        issue: 278,
        title: 'R20-05 Run validation through one runner',
        url: 'https://github.com/ceoloide/ergogen-gui/issues/278',
        release: 'v0.20',
        priority: null,
        size: 'M',
        mode: 'auto',
      },
    });
  });

  it.each([
    [[], 'No item is ready.'],
    [['--json'], JSON.stringify({ next: null }, null, 2)],
  ])('exits with 0 when no item is ready, with %j', async (args, expected) => {
    // Arrange
    const { api } = fakeApi({ 10: ready({ status: 'In progress' }) });

    // Act
    const { status, stdout } = await run(args, api);

    // Assert
    expect(status).toBe(0);
    expect(stdout).toBe(expected);
  });

  it('exits with 1 and prints the error of gh when a read fails', async () => {
    // Arrange
    const failing = async () => {
      throw Object.assign(new Error('Command failed: gh api graphql'), {
        stderr: 'HTTP 502: Bad Gateway\n',
      });
    };

    // Act
    const { status, stdout, stderr } = await run([], failing);

    // Assert
    expect(status).toBe(1);
    expect(stdout).toBe('');
    expect(stderr).toBe('HTTP 502: Bad Gateway');
  });

  it.each([
    [[], 1],
    [['--json'], 1],
    [['--help'], 0],
    [['--force'], 0],
  ])('sends GitHub only GraphQL queries, with %j', async (args, count) => {
    // Arrange
    const { api, calls } = fakeApi(issues);

    // Act
    await run(args, api);

    // Assert
    expect(calls).toHaveLength(count);
    for (const { args: apiArgs, query } of calls) {
      expect(apiArgs).toEqual(['graphql']);
      expect(query).toMatch(/^query\b/);
      expect(query).not.toMatch(/\bmutation\b/);
    }
  });

  describe('run as a script', () => {
    const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    const script = join(projectRoot, 'scripts', 'queue', 'next.mts');

    // Runs the script with no `gh` on the PATH and an empty home folder, so a
    // run that reached GitHub would fail with exit status 1.
    function spawn(args: string[]) {
      const home = mkdtempSync(join(tmpdir(), 'queue-next-'));
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
      expect(stdout).toContain('Usage: pnpm queue:next [--json]');
      expect(stdout).toContain('The script only reads GitHub');
    });

    it.each([[['--force']], [['278']]])(
      'prints the usage and exits with 2 for %j',
      (args) => {
        // Act
        const { status, stderr } = spawn(args);

        // Assert
        expect(status).toBe(2);
        expect(stderr).toContain('Usage: pnpm queue:next [--json]');
      }
    );

    it('exits with 1 when gh is missing', () => {
      // Act
      const { status, stdout } = spawn([]);

      // Assert
      expect(status).toBe(1);
      expect(stdout).toBe('');
    });
  });
});
