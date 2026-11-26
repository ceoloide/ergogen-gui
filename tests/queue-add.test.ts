// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  addToQueue,
  githubCli,
  Rejected,
  type Change,
  type GitHub,
  type IssueRef,
  type IssueState,
  type Repository,
} from '../scripts/queue/add.mts';

/** The login that runs the script, in both fakes. */
const VIEWER = 'maintainer';

interface FakeComment {
  author: string;
  body: string;
}

interface FakeIssue {
  title: string;
  closed?: boolean;
  body?: string;
  type?: string;
  release?: string;
  labels?: string[];
  blockedBy?: IssueRef[];
  comments?: FakeComment[];
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

/** The issue of a key of `issues`: a number, or `owner/name#number`. */
const refOf = (key: string): IssueRef =>
  /^\d+$/.test(key) ? Number(key) : (key as IssueRef);

/** The URL of comment `id` on `issue`. */
const commentUrl = (issue: IssueRef, id: number) =>
  `https://github.com/ceoloide/ergogen-gui/issues/${issue}#issuecomment-${id}`;

/**
 * GitHub in memory. `issues` holds the issues of ceoloide/ergogen-gui by
 * number and the issues of other repositories by `owner/name#number`. The
 * comments get the IDs 1, 2, 3, and so on, in the order of `issues`.
 * `state` is what GitHub holds after the writes, and `writes` lists every
 * write that GitHub saved. With `fail`, the first write of that kind throws:
 * before GitHub saves it, or after, when `saved` is set.
 */
function fakeGitHub(
  issues: Record<string, FakeIssue>,
  { fail }: { fail?: { kind: Change['kind']; saved: boolean } } = {}
) {
  let nextComment = 1;
  const withIds = (comments: FakeComment[] = []) =>
    comments.map((comment) => ({ id: nextComment++, ...comment }));
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
      Object.entries(issues).map(([key, issue]) => [
        refOf(key),
        {
          closed: false,
          body: '',
          labels: [] as string[],
          blockedBy: [] as IssueRef[],
          ...issue,
          comments: withIds(issue.comments),
        },
      ])
    ),
  };
  const writes: Change[] = [];
  let failure = fail;
  const issue = (number: IssueRef) => {
    const found = state.issues.get(number);
    if (!found) throw new Error(`The script read or wrote #${number}.`);
    return found;
  };
  function save(change: Change) {
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
      case 'addComment':
        target.comments.push({
          id: nextComment++,
          author: VIEWER,
          body: change.body,
        });
        return;
      case 'updateComment': {
        const comment = target.comments.find(
          ({ id }) => `comment ${id}` === change.id
        );
        if (!comment) throw new Error(`No comment has the ID ${change.id}.`);
        comment.body = change.body;
        return;
      }
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
      default:
        throw new Error(`The fake has no write ${(change as Change).kind}.`);
    }
  }
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
      const { type, release, labels, comments, project } = issue(number);
      return {
        type,
        release,
        labels: [...labels],
        comments: comments.map(({ id, author, body }) => ({
          id: `comment ${id}`,
          url: commentUrl(number, id),
          body,
          byViewer: author === VIEWER,
        })),
        project: project && { ...project },
      };
    },
    async write(change) {
      const failing = failure?.kind === change.kind ? failure : undefined;
      if (failing) failure = undefined;
      if (failing && !failing.saved) {
        throw new Error('The connection to GitHub dropped.');
      }
      save(change);
      writes.push(change);
      if (failing) throw new Error('The connection to GitHub dropped.');
    },
  };
  return { github, state, writes };
}

/**
 * The GitHub API in memory, for `githubCli`, with `issues` as in
 * `fakeGitHub`. It writes nothing and returns at most 100 comments per page.
 * Someone sets the status of the Project item to `statusAtAdd` after the
 * script reads the issue and before it adds the issue to the Project, and to
 * `statusAfterAdd` right after the add. `calls` lists every call of the API.
 */
function fakeApi(
  issues: Record<string, FakeIssue>,
  {
    statusAtAdd,
    statusAfterAdd,
  }: { statusAtAdd?: string; statusAfterAdd?: string } = {}
) {
  let itemStatus = statusAtAdd;
  const calls: {
    args: string[];
    query: string;
    variables: Record<string, unknown>;
  }[] = [];
  const refs = Object.keys(issues).map(refOf);
  const nodeOf = (ref: IssueRef) => {
    const [repository, number] =
      typeof ref === 'number'
        ? ['ceoloide/ergogen-gui', String(ref)]
        : ref.split('#');
    return {
      id: `node ${ref}`,
      number: Number(number),
      repository: { nameWithOwner: repository },
    };
  };
  const issueNode = (ref: IssueRef) => {
    const { title, closed = false, blockedBy = [] } = issues[ref];
    return {
      ...nodeOf(ref),
      title,
      closed,
      blockedBy: { nodes: blockedBy.map(nodeOf) },
    };
  };
  const named = (kind: string, names: string[]) =>
    names.map((name) => ({ id: `${kind} ${name}`, name }));
  const status = (name?: string) => (name ? { name } : null);

  function reply(query: string, variables: Record<string, unknown>) {
    if (query.includes('addProjectV2ItemById')) {
      const added = {
        addProjectV2ItemById: {
          item: { id: 'item', fieldValueByName: status(itemStatus) },
        },
      };
      itemStatus = statusAfterAdd ?? itemStatus;
      return added;
    }
    if (query.startsWith('mutation')) return {};
    if (query.includes('node(id')) {
      return { node: { fieldValueByName: status(itemStatus) } };
    }
    if (query.includes('issueTypes')) {
      return {
        repository: {
          issueTypes: { nodes: named('type', ['Task', 'Bug', 'Feature']) },
          milestones: {
            nodes: [
              {
                id: 'milestone v0.20',
                title: 'v0.20',
                description: 'Baseline and limits.',
                dueOn: null,
                closed: false,
              },
            ],
          },
          labels: { nodes: named('label', ['bug', ...queueLabels]) },
        },
        user: {
          projectV2: {
            id: 'project',
            title: 'Ergogen GUI 2027',
            field: {
              id: 'status',
              options: named('status', ['Proposed', 'Todo', 'In progress']),
            },
          },
        },
      };
    }
    if (query.includes('nodes(ids')) {
      const ids = variables.ids as string[];
      return {
        nodes: refs
          .filter((ref) => ids.includes(nodeOf(ref).id))
          .map(issueNode),
      };
    }
    if (query.includes('issues(first')) {
      return {
        repository: {
          issues: {
            pageInfo: { hasNextPage: false, endCursor: '' },
            nodes: refs.filter((ref) => typeof ref === 'number').map(issueNode),
          },
        },
      };
    }
    const number = variables.number as number;
    const issue = issues[number];
    const comments = (issue.comments ?? []).map(({ author, body }, index) => ({
      id: `comment ${index + 1}`,
      url: commentUrl(number, index + 1),
      body,
      viewerDidAuthor: author === VIEWER,
    }));
    const from = Number(variables.after ?? 0);
    return {
      repository: {
        issue: {
          issueType: issue.type ? { name: issue.type } : null,
          milestone: issue.release ? { title: issue.release } : null,
          labels: { nodes: (issue.labels ?? []).map((name) => ({ name })) },
          projectItems: {
            nodes: issue.project
              ? [
                  {
                    id: 'item',
                    project: { id: 'project' },
                    fieldValueByName: status(issue.project.status),
                  },
                ]
              : [],
          },
          comments: {
            pageInfo: {
              hasNextPage: from + 100 < comments.length,
              endCursor: String(from + 100),
            },
            nodes: comments.slice(from, from + 100),
          },
        },
      },
    };
  }

  const api = async (args: string[], body: unknown) => {
    const { query, variables } = body as (typeof calls)[number];
    calls.push({ args, query, variables });
    return { data: reply(query, variables) };
  };
  /** Whether the script sent a request that names `field`. */
  const sent = (field: string) =>
    calls.some(({ query }) => query.includes(field));
  /**
   * Each GraphQL mutation that the script sent, as its name and the fields of
   * its input, such as `updateIssue(id, milestoneId)`.
   */
  const mutations = () =>
    calls
      .filter(({ query }) => query.startsWith('mutation'))
      .map(({ query }) => {
        const [, name, input] = /(\w+)\(input: \{([^}]*)\}/.exec(query) ?? [];
        const fields = [...input.matchAll(/(\w+):/g)].map(([, field]) => field);
        return `${name}(${fields.join(', ')})`;
      });
  return { api, calls, sent, mutations };
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

const report = 'Nothing happens when I click Export in Safari.\r\n';
const reply = { author: 'reporter', body: 'Same on iPadOS 18.' };

const reported = (): Record<string, FakeIssue> => ({
  274: { title: 'R20-01 Load the queue' },
  376: { title: 'R100-09 Release 1.0' },
  400: {
    title: 'Export fails in Safari',
    body: report,
    labels: ['bug', 'size:M'],
    blockedBy: [376],
    comments: [reply],
  },
});

/** The comment that the script writes on #400 for `bug`. */
const bugComment = `<!-- pnpm queue:add #400 sha256:249526a2eb0d22988a35e3bf132da4902ae9d402b2f4b7825ddc12236bb4cfba -->

| Release | Track | Size | Mode |
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

_\`pnpm queue:add\` wrote this comment. To change it, run the script again with a changed item. The script refuses to update a comment that someone edited by hand._`;

/** The comments on `issue` that start with the marker of the script. */
const markedComments = (issue?: { comments: FakeComment[] }) =>
  (issue?.comments ?? []).filter(({ body }) =>
    body.startsWith('<!-- pnpm queue:add')
  );

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

  it('rejects an issue of another repository in dependsOn and says how to add one', async () => {
    // Arrange
    const { github, writes } = fakeGitHub(reported());

    // Act
    const problems = await problemsOf(github, {
      ...bug,
      dependsOn: ['ergogen/ergogen#12'],
    });

    // Assert
    expect(problems).toEqual([
      'dependsOn is ["ergogen/ergogen#12"]. Give the numbers of issues in ceoloide/ergogen-gui, or []. Add a dependency on an issue of another repository on GitHub, and pnpm queue:add keeps it.',
    ]);
    expect(writes).toEqual([]);
  });
});

describe('the cycle rule', () => {
  // #10 is blocked by #11 and #13, and #11 is blocked by #13. #12 is free.
  const graph = (): Record<string, FakeIssue> => ({
    10: { title: 'Ten', blockedBy: [11, 13] },
    11: { title: 'Eleven', blockedBy: [13] },
    12: { title: 'Twelve' },
    13: { title: 'Thirteen' },
  });
  const task = { ...bug, type: 'Task', priority: undefined, issue: 13 };

  it.each([
    [
      'of one issue, which depends on itself',
      [13],
      'The dependencies form a cycle: #13 is blocked by #13.',
    ],
    [
      'of two issues',
      [11],
      'The dependencies form a cycle: #13 is blocked by #11, and #11 is blocked by #13.',
    ],
    [
      'of three issues, through existing relations',
      [12, 10],
      'The dependencies form a cycle: #13 is blocked by #10, #10 is blocked by #11, and #11 is blocked by #13.',
    ],
  ])(
    'rejects a cycle %s, and writes nothing',
    async (_case, dependsOn, cycle) => {
      // Arrange
      const { github, writes } = fakeGitHub(graph());

      // Act
      const problems = await problemsOf(github, { ...task, dependsOn });

      // Assert
      expect(problems).toEqual([cycle]);
      expect(writes).toEqual([]);
    }
  );

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
  it('writes the comment, type, milestone, labels, dependencies, and status', async () => {
    // Arrange
    const { github, state } = fakeGitHub(reported());

    // Act
    const lines = await add(github, bug);

    // Assert
    const issue = state.issues.get(400);
    expect(issue).toMatchObject({
      type: 'Bug',
      release: 'v0.20',
      body: report,
      comments: [
        { id: 1, ...reply },
        { id: 2, author: VIEWER, body: bugComment },
      ],
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
      '  write the release table and the sections into a new comment',
      '  set the type to Bug',
      '  set the milestone to v0.20',
      '  add the labels track:verification, size:S, mode:auto, priority:P1',
      '  remove the labels size:M',
      '  add the dependency #274 R20-01 Load the queue',
      '  remove the dependency #376 R100-09 Release 1.0',
      '  add the issue to the Project "Ergogen GUI 2027" with the status Todo',
      'Made 8 changes.',
    ]);
  });

  it('writes nothing on a second run and says so', async () => {
    // Arrange
    const { github, state, writes } = fakeGitHub(reported());
    await add(github, bug);
    const firstRun = writes.length;

    // Act
    const lines = await add(github, bug);

    // Assert
    expect(writes).toHaveLength(firstRun);
    expect(markedComments(state.issues.get(400))).toHaveLength(1);
    expect(lines).toEqual([
      '#400 Export fails in Safari',
      'Nothing to change. GitHub already holds these values.',
    ]);
  });

  it.each(
    (
      [
        'addComment',
        'setType',
        'setRelease',
        'addLabels',
        'removeLabels',
        'addDependency',
        'removeDependency',
        'addToProject',
      ] as const
    ).flatMap((kind) => [
      [kind, 'before GitHub saves it', false],
      [kind, 'after GitHub saved it', true],
    ])
  )(
    'finishes the item when a run after a failed %s, which fails %s, repeats it',
    async (kind, _case, saved) => {
      // Arrange
      const once = fakeGitHub(reported());
      await add(once.github, bug);
      const { github, state } = fakeGitHub(reported(), {
        fail: { kind, saved },
      });
      await expect(add(github, bug)).rejects.toThrow('dropped');

      // Act
      await add(github, bug);

      // Assert
      expect(state.issues.get(400)).toEqual(once.state.issues.get(400));
    }
  );

  it('keeps the old blockers when a new one fails to be written', async () => {
    // Arrange
    const { github, state } = fakeGitHub(reported(), {
      fail: { kind: 'addDependency', saved: false },
    });

    // Act
    await expect(add(github, bug)).rejects.toThrow('dropped');

    // Assert
    expect(state.issues.get(400)?.blockedBy).toEqual([376]);
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

  it('prints the changes and the comment on a dry run, and writes nothing', async () => {
    // Arrange
    const { github, writes } = fakeGitHub(reported());

    // Act
    const lines = await add(github, bug, true);

    // Assert
    expect(writes).toEqual([]);
    const comment = bugComment.replace(/^(?=.)/gm, '    ');
    expect(lines.indexOf(comment)).toBe(
      lines.indexOf(
        '  write the release table and the sections into a new comment'
      ) + 1
    );
    expect(lines.at(-1)).toBe(
      'Dry run. Nothing was written. A run without --dry-run makes 8 changes.'
    );
  });
});

describe('the body of the issue', () => {
  // A body that quotes the marker and has sections named like the comment.
  const lookalike = [
    '| Release | Track | Size | Mode |\r\n|---|---|---|---|\r\n| v0.21 | Docs | S | `auto` |\r\n',
    '## Evidence\r\n\r\nThe script writes `<!-- pnpm queue:add #400 sha256:0 -->` first.\r\n',
    bugComment,
    '## Depends on\n\n- #376\n',
  ].join('\n');

  it('stays byte for byte when it quotes the marker and has sections named like the comment', async () => {
    // Arrange
    const issues = reported();
    issues[400].body = lookalike;
    const { github, state, writes } = fakeGitHub(issues);

    // Act
    await add(github, bug);
    await add(github, { ...bug, evidence: 'Also in Safari 26.' });

    // Assert
    expect(state.issues.get(400)?.body).toBe(lookalike);
    expect(writes.map(({ kind }) => kind)).toEqual([
      'addComment',
      'setType',
      'setRelease',
      'addLabels',
      'removeLabels',
      'addDependency',
      'removeDependency',
      'addToProject',
      'updateComment',
    ]);
  });

  it('gets no write from the script, which sends GitHub only the comment and the queue values', async () => {
    // Arrange
    const issues = reported();
    issues[400].body = lookalike;
    const { api, calls, mutations } = fakeApi(issues);

    // Act
    await add(githubCli(api), bug);

    // Assert
    expect(calls.every(({ args }) => args.join(' ') === 'graphql')).toBe(true);
    expect(mutations()).toEqual([
      'addComment(subjectId, body)',
      'updateIssue(id, issueTypeId)',
      'updateIssue(id, milestoneId)',
      'addLabelsToLabelable(labelableId, labelIds)',
      'removeLabelsFromLabelable(labelableId, labelIds)',
      'addBlockedBy(issueId, blockingIssueId)',
      'removeBlockedBy(issueId, blockingIssueId)',
      'addProjectV2ItemById(projectId, contentId)',
      'updateProjectV2ItemFieldValue(projectId, itemId, fieldId, value, singleSelectOptionId)',
    ]);
    expect(
      calls.find(({ query }) => query.includes('addComment('))?.variables
    ).toEqual({ id: 'node 400', body: bugComment });
  });
});

describe('the comment that the script owns', () => {
  const later = {
    ...bug,
    evidence: 'Export does nothing in Safari 18 and 26.',
  };

  it('is updated in place, and every other comment stays', async () => {
    // Arrange
    const { github, state, writes } = fakeGitHub(reported());
    await add(github, bug);
    const firstRun = writes.length;

    // Act
    await add(github, later);

    // Assert
    expect(writes.slice(firstRun)).toEqual([
      {
        kind: 'updateComment',
        issue: 400,
        id: 'comment 2',
        url: commentUrl(400, 2),
        body: expect.stringContaining(
          '## Evidence\n\nExport does nothing in Safari 18 and 26.\n\n'
        ),
      },
    ]);
    const comments = state.issues.get(400)?.comments;
    expect(comments?.map(({ id }) => id)).toEqual([1, 2]);
    expect(comments?.[0]).toEqual({ id: 1, ...reply });
  });

  it('counts as unchanged after an edit on GitHub turned its line endings into CRLF', async () => {
    // Arrange
    const { github, state, writes } = fakeGitHub(reported());
    await add(github, bug);
    const [, owned] = state.issues.get(400)?.comments ?? [];
    owned.body = `${owned.body.replace(/\n/g, '\r\n')}\r\n`;
    const firstRun = writes.length;

    // Act
    await add(github, bug);
    const unchanged = writes.slice(firstRun);
    await add(github, later);

    // Assert
    expect(unchanged).toEqual([]);
    expect(writes.slice(firstRun).map(({ kind }) => kind)).toEqual([
      'updateComment',
    ]);
  });

  it('is never a comment of another author, also one that carries or quotes the marker', async () => {
    // Arrange
    const others = [
      { author: 'reporter', body: bugComment },
      { author: 'reporter', body: `> ${bugComment.replace(/\n/g, '\n> ')}` },
      {
        author: 'reporter',
        body: `The script writes ${bugComment.split('\n')[0]} first.`,
      },
    ];
    const issues = reported();
    issues[400].comments = others;
    const { github, state, writes } = fakeGitHub(issues);

    // Act
    await add(github, bug);
    await add(github, later);

    // Assert
    expect(state.issues.get(400)?.comments).toEqual([
      ...others.map((comment, index) => ({ id: index + 1, ...comment })),
      {
        id: 4,
        author: VIEWER,
        body: expect.stringContaining('Safari 18 and 26'),
      },
    ]);
    expect(
      writes
        .filter(({ kind }) => kind.endsWith('Comment'))
        .map((change) => ('id' in change ? change.id : change.kind))
    ).toEqual(['addComment', 'comment 4']);
  });

  it.each<[string, FakeComment[], string]>([
    [
      'two comments that both carry the marker',
      [
        { author: VIEWER, body: bugComment },
        { author: VIEWER, body: bugComment },
      ],
      `2 comments carry the marker of #400: ${commentUrl(400, 2)}, ${commentUrl(400, 3)}.`,
    ],
    [
      'a comment that a person edited by hand',
      [
        {
          author: VIEWER,
          body: bugComment.replace('Safari 18.', 'Safari 18. Maybe 17 too.'),
        },
      ],
      `the comment ${commentUrl(400, 2)} changed after pnpm queue:add wrote it.`,
    ],
    [
      'a marker of another issue',
      [
        {
          author: VIEWER,
          body: bugComment.replace('queue:add #400', 'queue:add #401'),
        },
      ],
      `the marker of the comment ${commentUrl(400, 2)} names #401, not #400.`,
    ],
    [
      'a broken marker',
      [
        {
          author: VIEWER,
          body: bugComment.replace(/ sha256:[0-9a-f]+/, ''),
        },
      ],
      `the comment ${commentUrl(400, 2)} starts with "<!-- pnpm queue:add", but its first line is not a valid marker.`,
    ],
  ])(
    'refuses %s, and writes nothing of any kind',
    async (_case, own, cause) => {
      // Arrange
      const issues = reported();
      issues[400].comments = [reply, ...own];
      const { github, state, writes } = fakeGitHub(issues);
      const before = structuredClone(state.issues.get(400));

      // Act
      const problems = await problemsOf(github, later);

      // Assert
      expect(problems).toEqual([
        `pnpm queue:add leaves the comments of #400 alone, because ${cause} On GitHub, remove the first line, a hidden marker, from each comment that pnpm queue:add must not update, or delete that comment. A run then updates the one comment left with the marker, or writes a new one.`,
      ]);
      expect(writes).toEqual([]);
      expect(state.issues.get(400)).toEqual(before);
    }
  );

  /** #400 with 150 comments of another author, and `own` at their places. */
  function crowded(own: Record<number, string>): Record<string, FakeIssue> {
    const issues = reported();
    issues[400].comments = Array.from({ length: 150 }, (_, index) =>
      own[index]
        ? { author: VIEWER, body: own[index] }
        : { author: 'reporter', body: `Comment ${index + 1}.` }
    );
    return issues;
  }

  it('is found again among more than 100 comments', async () => {
    // Arrange
    const { api, calls, mutations } = fakeApi(crowded({ 120: bugComment }));

    // Act
    await add(githubCli(api), later);

    // Assert
    const comments = calls.filter(({ query }) =>
      /addComment\(|updateIssueComment\(/.test(query)
    );
    expect(mutations()).not.toContain('addComment(subjectId, body)');
    expect(comments.map(({ variables }) => variables.id)).toEqual([
      'comment 121',
    ]);
  });

  it('refuses a second comment with the marker beyond the first 100 comments', async () => {
    // Arrange
    const { api, mutations } = fakeApi(
      crowded({ 10: bugComment, 140: bugComment })
    );

    // Act
    const problems = await problemsOf(githubCli(api), later);

    // Assert
    expect(problems).toEqual([
      expect.stringContaining(
        `because 2 comments carry the marker of #400: ${commentUrl(400, 11)}, ${commentUrl(400, 141)}.`
      ),
    ]);
    expect(mutations()).toEqual([]);
  });
});

describe('a blocker in another repository', () => {
  it('stays, and Depends on lists it with the other blockers', async () => {
    // Arrange
    const issues = reported();
    issues[400].blockedBy = [376, 'ergogen/ergogen#12'];
    const { github, state } = fakeGitHub({
      ...issues,
      'ergogen/ergogen#12': { title: 'Export the outline as SVG' },
    });

    // Act
    await add(github, bug);

    // Assert
    const issue = state.issues.get(400);
    expect(issue?.blockedBy).toEqual(['ergogen/ergogen#12', 274]);
    expect(markedComments(issue)[0]?.body).toContain(
      '## Depends on\n\n- #274 R20-01 Load the queue\n- ergogen/ergogen#12 Export the outline as SVG\n\n'
    );
  });

  it('stays, and a dry run shows it as kept', async () => {
    // Arrange
    const issues = reported();
    issues[400].blockedBy = [376, 'ergogen/ergogen#12'];
    const { api } = fakeApi({
      ...issues,
      'ergogen/ergogen#12': { title: 'Export the outline as SVG' },
    });

    // Act
    const lines = await add(githubCli(api), bug, true);

    // Assert
    expect(lines.filter((line) => line.includes('dependency'))).toEqual([
      '  keep the dependency ergogen/ergogen#12 Export the outline as SVG, which is in another repository',
      '  add the dependency #274 R20-01 Load the queue',
      '  remove the dependency #376 R100-09 Release 1.0',
    ]);
  });

  it.each<[string, Record<string, FakeIssue>, number[], string]>([
    [
      'on a path from dependsOn, through two other repositories',
      {
        10: { title: 'Ten', blockedBy: ['ergogen/ergogen#12'] },
        13: { title: 'Thirteen' },
        'ergogen/ergogen#12': {
          title: 'Twelve',
          blockedBy: ['ceoloide/ergogen-footprints#5'],
        },
        'ceoloide/ergogen-footprints#5': { title: 'Five', blockedBy: [13] },
      },
      [10],
      'The dependencies form a cycle: #13 is blocked by #10, #10 is blocked by ergogen/ergogen#12, ergogen/ergogen#12 is blocked by ceoloide/ergogen-footprints#5, and ceoloide/ergogen-footprints#5 is blocked by #13.',
    ],
    [
      'when it blocks the issue already',
      {
        13: { title: 'Thirteen', blockedBy: ['ergogen/ergogen#12'] },
        'ergogen/ergogen#12': { title: 'Twelve', blockedBy: [13] },
      },
      [],
      'The dependencies form a cycle: #13 is blocked by ergogen/ergogen#12, and ergogen/ergogen#12 is blocked by #13.',
    ],
  ])(
    'counts in the cycle rule %s',
    async (_case, issues, dependsOn, problem) => {
      // Arrange
      const { api, sent } = fakeApi(issues);

      // Act
      const problems = await problemsOf(githubCli(api), {
        ...bug,
        type: 'Task',
        priority: undefined,
        issue: 13,
        dependsOn,
      });

      // Assert
      expect(problems).toEqual([problem]);
      expect(sent('mutation')).toBe(false);
    }
  );
});

describe('the status in the Project', () => {
  it.each([
    [
      'before the add, for an issue that was outside the Project',
      undefined,
      { statusAtAdd: 'In progress' },
    ],
    [
      'before the add, for an item that had no status',
      {},
      { statusAtAdd: 'In progress' },
    ],
    [
      'after the add, for an issue that was outside the Project',
      undefined,
      { statusAfterAdd: 'In progress' },
    ],
    [
      'after the add, for an item that had no status',
      {},
      { statusAfterAdd: 'In progress' },
    ],
  ])('stays when someone sets it %s', async (_case, project, race) => {
    // Arrange
    const issues = reported();
    issues[400].project = project;
    const { api, sent } = fakeApi(issues, race);

    // Act
    await add(githubCli(api), bug);

    // Assert
    expect(sent('updateProjectV2ItemFieldValue')).toBe(false);
  });

  it('is read again right before the write, and set when the item still has none', async () => {
    // Arrange
    const { api, calls } = fakeApi(reported());

    // Act
    await add(githubCli(api), bug);

    // Assert
    const project = calls.filter(({ query }) =>
      /addProjectV2ItemById|node\(id|updateProjectV2ItemFieldValue/.test(query)
    );
    expect(
      project.map(({ query }) =>
        query.includes('mutation')
          ? query.split('(input')[0].trim().split(/\s+/).at(-1)
          : 'read'
      )
    ).toEqual([
      'addProjectV2ItemById',
      'read',
      'updateProjectV2ItemFieldValue',
    ]);
    expect(project.at(-1)?.variables.option).toBe('status Todo');
  });
});

describe('a release item', () => {
  const release = {
    type: 'Release',
    title: 'v0.20.1',
    description: 'Fix #400.',
    exitCondition: '#400 is closed.',
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
      description: 'Fix #400.\n\nExit condition: #400 is closed.',
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

  it.each([
    ['without an exit condition', undefined],
    ['with a blank exit condition', ' \n '],
  ])(
    'rejects a release %s and writes nothing',
    async (_case, exitCondition) => {
      // Arrange
      const { github, writes } = fakeGitHub({});

      // Act
      const problems = await problemsOf(github, { ...release, exitCondition });

      // Assert
      expect(problems).toEqual([
        'exitCondition is missing. Write the check that proves the release is done.',
      ]);
      expect(writes).toEqual([]);
    }
  );
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

  it.each([
    ['an issue item', bug],
    [
      'a release item',
      { type: 'Release', title: 'v0.20.1', description: 'Fix #400.' },
    ],
  ])(
    'rejects %s without an exit condition before it reads GitHub',
    (_case, item) => {
      // Act
      const { status, stdout, stderr } = run((folder) => {
        const file = join(folder, 'item.json');
        writeFileSync(
          file,
          JSON.stringify({ ...item, exitCondition: undefined }, null, 2)
        );
        return [file];
      });

      // Assert
      expect(status).toBe(2);
      expect(stdout).toBe('');
      expect(stderr).toMatch(
        /^pnpm queue:add rejected the item:\n- exitCondition is missing\. Write the check that proves the (item|release) is done\.\n$/
      );
    }
  );

  it('prints the help, with the windows in which a change can be lost', () => {
    // Act
    const { status, stdout } = run(() => ['--help']);

    // Assert
    expect(status).toBe(0);
    expect(stdout).toContain('Usage: pnpm queue:add <item.json> [--dry-run]');
    expect(stdout).toContain('The script never edits the body of an issue.');
    expect(stdout).toContain(
      'An edit of the\n  owned comment that someone saves in that moment is lost.'
    );
    expect(stdout).toContain(
      'A status that\n  someone sets between that read and the write is overwritten.'
    );
    expect(stdout).toContain(
      'A\n  relation that someone changes after that read can be overwritten.'
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
