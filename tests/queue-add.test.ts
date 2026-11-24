// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  addToQueue,
  Rejected,
  type Change,
  type GitHub,
  type IssueState,
  type Repository,
} from '../scripts/queue/add.mts';

interface FakeIssue {
  title: string;
  closed?: boolean;
  body?: string;
  type?: string;
  release?: string;
  labels?: string[];
  blockedBy?: number[];
  project?: { status?: string };
}

const queueLabels = [
  ...[
    'queue',
    'verification',
    'checks',
    'architecture',
    'toolchain',
    'automation',
    'docs',
  ].map((track) => `track:${track}`),
  ...['S', 'M', 'L'].map((size) => `size:${size}`),
  ...['auto', 'review', 'owner'].map((mode) => `mode:${mode}`),
  ...['P0', 'P1', 'P2', 'P3', 'P4'].map((priority) => `priority:${priority}`),
];

/**
 * GitHub in memory. `state` is what GitHub holds after the writes, and
 * `writes` lists them. With `failAt`, the write of that kind throws once.
 */
function fakeGitHub(
  issues: Record<number, FakeIssue>,
  { failAt }: { failAt?: Change['kind'] } = {}
) {
  const state = {
    labels: new Set(['bug', 'enhancement', ...queueLabels]),
    milestones: new Map([
      [
        'v0.20',
        {
          description: 'Baseline and limits.',
          dueOn: '2027-01-31',
          closed: false,
        },
      ],
      ['v0.19', { description: 'An earlier release.', closed: true }],
      ['Backlog', { description: 'Issues for after v1.0.', closed: false }],
    ]),
    issues: new Map(
      Object.entries(issues).map(([number, issue]) => [
        Number(number),
        {
          closed: false,
          body: '',
          labels: [] as string[],
          blockedBy: [] as number[],
          ...issue,
        },
      ])
    ),
  };
  const writes: Change[] = [];
  let failure = failAt;
  const issue = (number: number) => {
    const found = state.issues.get(number);
    if (!found) throw new Error(`The script read or wrote #${number}.`);
    return found;
  };
  const github: GitHub = {
    async readRepository(): Promise<Repository> {
      return {
        milestones: new Map(state.milestones),
        labels: new Set(state.labels),
        issueTypes: new Set(['Task', 'Bug', 'Feature']),
        statuses: new Set(['Proposed', 'Todo', 'In progress', 'Done']),
        projectTitle: 'Ergogen GUI 2027',
        issues: new Map(
          [...state.issues].map(([number, { title, closed, blockedBy }]) => [
            number,
            { title, closed, blockedBy: [...blockedBy] },
          ])
        ),
      };
    },
    async readIssue(number): Promise<IssueState> {
      const { body, type, release, labels, project } = issue(number);
      return {
        body,
        type,
        release,
        labels: [...labels],
        project: project && { ...project },
      };
    },
    async write(change) {
      if (change.kind === failure) {
        failure = undefined;
        throw new Error('The connection to GitHub dropped.');
      }
      writes.push(change);
      if (change.kind === 'createRelease') {
        const { title, description, dueOn } = change;
        state.milestones.set(title, { description, dueOn, closed: false });
        return;
      }
      const target = issue(change.issue);
      switch (change.kind) {
        case 'setType':
          target.type = change.type;
          return;
        case 'setRelease':
          target.release = change.release;
          return;
        case 'addLabels':
          target.labels.push(...change.labels);
          return;
        case 'removeLabels':
          target.labels = target.labels.filter(
            (label) => !change.labels.includes(label)
          );
          return;
        case 'setBody':
          target.body = change.body;
          return;
        case 'addDependency':
          target.blockedBy.push(change.blocker);
          return;
        case 'removeDependency':
          target.blockedBy = target.blockedBy.filter(
            (blocker) => blocker !== change.blocker
          );
          return;
        case 'addToProject':
        case 'setStatus':
          target.project = { status: change.status };
          return;
      }
    },
  };
  return { github, state, writes };
}

async function add(github: GitHub, input: unknown, dryRun = false) {
  const lines: string[] = [];
  await addToQueue(input, github, {
    dryRun,
    print: (line) => lines.push(line),
  });
  return lines;
}

async function problemsOf(github: GitHub, input: unknown) {
  const error = await add(github, input).then(
    () => undefined,
    (thrown: unknown) => thrown
  );
  expect(error).toBeInstanceOf(Rejected);
  return (error as Rejected).problems;
}

const bug = {
  issue: 400,
  type: 'Bug',
  release: 'v0.20',
  track: 'verification',
  size: 'S',
  mode: 'auto',
  priority: 'P1',
  evidence: 'Export to KiCad does nothing in Safari 18.',
  change: 'Save the file with an API that Safari supports.',
  exitCondition: 'An end-to-end test exports a PCB in WebKit.',
  dependsOn: [274],
};

const reported = (): Record<number, FakeIssue> => ({
  274: { title: 'R20-01 Load the queue' },
  376: { title: 'R100-09 Release 1.0' },
  400: {
    title: 'Export fails in Safari',
    body: 'Nothing happens when I click Export in Safari.\r\n',
    labels: ['bug', 'size:M'],
    blockedBy: [376],
  },
});

const bugBody = `| Release | Track | Size | Mode |
|---|---|---|---|
| v0.20 | Verification | Small, one pull request | \`auto\` |

## Evidence

Export to KiCad does nothing in Safari 18.

## Change

Save the file with an API that Safari supports.

## Exit condition

An end-to-end test exports a PCB in WebKit.

## Depends on

- #274 R20-01 Load the queue

## Report

<!-- pnpm queue:add writes the text above this line. The text below is the issue text from before intake. -->

Nothing happens when I click Export in Safari.
`;

describe('pnpm queue:add rejects an incomplete item', () => {
  it.each([
    ['without an exit condition', { ...bug, exitCondition: undefined }],
    ['with an empty exit condition', { ...bug, exitCondition: '' }],
    ['with a blank exit condition', { ...bug, exitCondition: ' \n ' }],
  ])('rejects an item %s and writes nothing', async (_case, item) => {
    // Arrange
    const { github, writes } = fakeGitHub(reported());

    // Act
    const problems = await problemsOf(github, item);

    // Assert
    expect(problems).toEqual([expect.stringMatching(/^exitCondition /)]);
    expect(writes).toEqual([]);
  });

  it('names every missing or invalid value at once', async () => {
    // Arrange
    const { github, writes } = fakeGitHub(reported());
    const item = {
      ...bug,
      issue: '400',
      track: 'ui',
      priority: undefined,
      evidence: ' ',
      dependsOn: 'none',
      exit_condition: 'A typo for exitCondition.',
    };

    // Act
    const problems = await problemsOf(github, item);

    // Assert
    expect(problems.map((problem) => problem.split(' ')[0])).toEqual([
      'exit_condition',
      'issue',
      'track',
      'priority',
      'evidence',
      'dependsOn',
    ]);
    expect(writes).toEqual([]);
  });

  it.each([
    ['a Bug', 'Bug', false],
    ['a Feature', 'Feature', false],
    ['a Task', 'Task', true],
  ])(
    'takes %s without a priority only when it is a Task',
    async (_case, type, accepted) => {
      // Arrange
      const issues = reported();
      issues[400].labels = ['bug', 'priority:P3'];
      const { github, state } = fakeGitHub(issues);
      const item = { ...bug, type, priority: undefined };

      // Act
      const result = await add(github, item).then(
        () => 'accepted',
        (error: unknown) => error
      );

      // Assert
      if (accepted) {
        expect(result).toBe('accepted');
        expect(state.issues.get(400)?.labels).toEqual([
          'bug',
          'track:verification',
          'size:S',
          'mode:auto',
        ]);
      } else {
        expect(result).toBeInstanceOf(Rejected);
      }
    }
  );

  it('rejects what does not exist on GitHub, or is closed, and writes nothing', async () => {
    // Arrange
    const { github, state, writes } = fakeGitHub({
      ...reported(),
      401: { title: 'A closed issue', closed: true },
    });
    state.labels.delete('priority:P1');

    // Act
    const missing = await problemsOf(github, {
      ...bug,
      issue: 999,
      release: 'v0.99',
      dependsOn: [274, 998],
    });
    const closed = await problemsOf(github, {
      ...bug,
      issue: 401,
      release: 'v0.19',
    });

    // Assert
    expect(missing).toEqual([
      '#999 is not an issue of ceoloide/ergogen-gui.',
      'The milestone v0.99 does not exist. Create it with a Release item first.',
      'The label priority:P1 does not exist in ceoloide/ergogen-gui.',
      'dependsOn lists #998, which is not an issue of ceoloide/ergogen-gui.',
    ]);
    expect(closed).toEqual([
      '#401 is closed.',
      'The milestone v0.19 is closed.',
      'The label priority:P1 does not exist in ceoloide/ergogen-gui.',
    ]);
    expect(writes).toEqual([]);
  });
});

describe('the cycle rule', () => {
  // #10 is blocked by #11 and #13, and #11 is blocked by #13. #12 is free.
  const graph = (): Record<number, FakeIssue> => ({
    10: { title: 'Ten', blockedBy: [11, 13] },
    11: { title: 'Eleven', blockedBy: [13] },
    12: { title: 'Twelve' },
    13: { title: 'Thirteen' },
  });
  const task = { ...bug, type: 'Task', priority: undefined, issue: 13 };

  it('rejects dependencies that close a cycle through existing relations, and writes nothing', async () => {
    // Arrange
    const { github, writes } = fakeGitHub(graph());

    // Act
    const problems = await problemsOf(github, { ...task, dependsOn: [12, 10] });

    // Assert
    expect(problems).toEqual([
      'dependsOn forms a cycle: #13 is blocked by #10, #10 is blocked by #11, and #11 is blocked by #13.',
    ]);
    expect(writes).toEqual([]);
  });

  it('rejects an issue that depends on itself', async () => {
    // Arrange
    const { github, writes } = fakeGitHub(graph());

    // Act
    const problems = await problemsOf(github, { ...task, dependsOn: [13] });

    // Assert
    expect(problems).toEqual([
      'dependsOn forms a cycle: #13 is blocked by #13.',
    ]);
    expect(writes).toEqual([]);
  });

  it('accepts dependencies that share blockers without a cycle', async () => {
    // Arrange
    const { github, state } = fakeGitHub(graph());

    // Act
    await add(github, { ...task, issue: 12, dependsOn: [10, 11, 13] });

    // Assert
    expect(state.issues.get(12)?.blockedBy).toEqual([10, 11, 13]);
  });
});

describe('adding an issue', () => {
  it('writes the type, milestone, labels, body, dependencies, and status', async () => {
    // Arrange
    const { github, state } = fakeGitHub(reported());

    // Act
    const lines = await add(github, bug);

    // Assert
    const issue = state.issues.get(400);
    expect(issue).toMatchObject({
      type: 'Bug',
      release: 'v0.20',
      body: bugBody,
      blockedBy: [274],
      project: { status: 'Todo' },
    });
    expect([...(issue?.labels ?? [])].sort()).toEqual([
      'bug',
      'mode:auto',
      'priority:P1',
      'size:S',
      'track:verification',
    ]);
    expect(lines).toEqual([
      '#400 Export fails in Safari',
      '  set the type to Bug',
      '  set the milestone to v0.20',
      '  add the labels track:verification, size:S, mode:auto, priority:P1',
      '  remove the labels size:M',
      '  write the release table and the sections into the body',
      '  remove the dependency #376 R100-09 Release 1.0',
      '  add the dependency #274 R20-01 Load the queue',
      '  add the issue to the Project "Ergogen GUI 2027" with the status Todo',
      'Made 8 changes.',
    ]);
  });

  it('writes nothing on a second run and says so', async () => {
    // Arrange
    const { github, writes } = fakeGitHub(reported());
    await add(github, bug);
    const firstRun = writes.length;

    // Act
    const lines = await add(github, bug);

    // Assert
    expect(writes).toHaveLength(firstRun);
    expect(lines).toEqual([
      '#400 Export fails in Safari',
      'Nothing to change. GitHub already holds these values.',
    ]);
  });

  it('finishes the item when a run after a failed write repeats it', async () => {
    // Arrange
    const once = fakeGitHub(reported());
    await add(once.github, bug);
    const { github, state } = fakeGitHub(reported(), {
      failAt: 'addDependency',
    });
    await expect(add(github, bug)).rejects.toThrow('dropped');

    // Act
    await add(github, bug);

    // Assert
    expect(state.issues.get(400)).toEqual(once.state.issues.get(400));
  });

  it('puts a Feature in the Project as Proposed', async () => {
    // Arrange
    const { github, state } = fakeGitHub(reported());

    // Act
    await add(github, { ...bug, type: 'Feature', mode: 'review' });

    // Assert
    expect(state.issues.get(400)?.project).toEqual({ status: 'Proposed' });
  });

  it.each([
    [
      'keeps the status of an item that has one',
      { status: 'In progress' },
      'In progress',
    ],
    ['sets the status of an item that has none', {}, 'Todo'],
  ])('%s', async (_case, project, status) => {
    // Arrange
    const issues = reported();
    issues[400] = { ...issues[400], project };
    const { github, state } = fakeGitHub(issues);

    // Act
    await add(github, bug);

    // Assert
    expect(state.issues.get(400)?.project).toEqual({ status });
  });

  it('prints the changes and the body on a dry run, and writes nothing', async () => {
    // Arrange
    const { github, writes } = fakeGitHub(reported());

    // Act
    const lines = await add(github, bug, true);

    // Assert
    expect(writes).toEqual([]);
    const body = bugBody.trimEnd().replace(/^(?=.)/gm, '    ');
    expect(lines).toContain(body);
    expect(lines.indexOf(body)).toBe(
      lines.indexOf(
        '  write the release table and the sections into the body'
      ) + 1
    );
    expect(lines.at(-1)).toBe(
      'Dry run. Nothing was written. A run without --dry-run makes 8 changes.'
    );
  });
});

describe('a release item', () => {
  const release = {
    type: 'Release',
    title: 'v0.20.1',
    description: 'Fix #400. Exit condition: #400 is closed.',
    dueOn: '2027-02-15',
  };

  it('creates the milestone once', async () => {
    // Arrange
    const { github, state, writes } = fakeGitHub({});

    // Act
    const first = await add(github, release);
    const second = await add(github, release);

    // Assert
    expect(state.milestones.get('v0.20.1')).toEqual({
      description: release.description,
      dueOn: '2027-02-15',
      closed: false,
    });
    expect(writes).toHaveLength(1);
    expect(first).toEqual([
      'Milestone v0.20.1',
      '  create the milestone v0.20.1, due 2027-02-15',
      'Made 1 change.',
    ]);
    expect(second.at(-1)).toBe(
      'Nothing to change. GitHub already holds these values.'
    );
  });

  it.each([
    ['a title that is not a version', { title: 'v0.20.1-hotfix' }, 'title'],
    ['a due date that does not exist', { dueOn: '2027-02-30' }, 'dueOn'],
    ['a description that is missing', { description: '' }, 'description'],
    ['an existing release with other values', { title: 'v0.20' }, 'The'],
  ])('rejects %s', async (_case, values, word) => {
    // Arrange
    const { github, writes } = fakeGitHub({});

    // Act
    const problems = await problemsOf(github, { ...release, ...values });

    // Assert
    expect(problems).toEqual([expect.stringMatching(new RegExp(`^${word} `))]);
    expect(writes).toEqual([]);
  });
});

describe('the command', () => {
  const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const script = join(projectRoot, 'scripts', 'queue', 'add.mts');

  // Runs the command with no `gh` on the PATH and an empty home folder, so a
  // run that reached GitHub would fail with exit status 1.
  function run(args: (folder: string) => string[]) {
    const home = mkdtempSync(join(tmpdir(), 'queue-add-'));
    const result = spawnSync(process.execPath, [script, ...args(home)], {
      env: { PATH: '', HOME: home },
      encoding: 'utf8',
    });
    rmSync(home, { recursive: true, force: true });
    return result;
  }

  it('rejects an item without an exit condition before it reads GitHub', () => {
    // Act
    const { status, stdout, stderr } = run((folder) => {
      const file = join(folder, 'item.json');
      writeFileSync(
        file,
        JSON.stringify({ ...bug, exitCondition: undefined }, null, 2)
      );
      return [file, '--dry-run'];
    });

    // Assert
    expect(status).toBe(2);
    expect(stdout).toBe('');
    expect(stderr).toBe(
      'pnpm queue:add rejected the item:\n- exitCondition is missing. Write the check that proves the item is done.\n'
    );
  });

  it.each([
    ['no item file', () => []],
    ['an unknown option', () => ['item.json', '--force']],
  ])('prints the usage for %s', (_case, args) => {
    // Act
    const { status, stderr } = run(args);

    // Assert
    expect(status).toBe(2);
    expect(stderr).toContain('Usage: pnpm queue:add <item.json> [--dry-run]');
  });
});
