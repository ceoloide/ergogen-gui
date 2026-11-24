// Adds an issue to the queue, or creates the milestone of a new release:
//
//   pnpm queue:add <item.json> [--dry-run]
//
// The queue is the Project "Ergogen GUI 2027", Project 3 of the user
// ceoloide, and holds issues of ceoloide/ergogen-gui. The item file holds
// one JSON object. An issue item names an issue that exists and gives every
// value that the queue records for it:
//
//   {
//     "issue": 400,
//     "type": "Bug",             Task, Bug, or Feature
//     "release": "v0.20",        the title of an open milestone
//     "track": "verification",   queue, verification, checks, architecture,
//                                toolchain, automation, or docs
//     "size": "S",               S, M, or L
//     "mode": "auto",            auto, review, or owner
//     "priority": "P1",          P0 to P4, required for a Bug or a Feature
//     "evidence": "...",
//     "change": "...",
//     "exitCondition": "...",
//     "dependsOn": [274, 273]    the issues that block this one, or []
//   }
//
// The script sets the issue type, the milestone, and the track, size, mode,
// and priority labels, and removes the other labels of those four kinds. It
// writes the release table and the Evidence, Change, Exit condition, and
// Depends on sections into the body, and keeps the text that the body had
// before the first run under the heading Report. It makes the issue blocked
// by exactly the issues in dependsOn. A new item enters the Project with the
// status Proposed for a Feature and Todo for any other type. The script never
// changes the status of an item that has one.
//
// A release item creates a milestone, with an optional due date:
//
//   { "type": "Release", "title": "v0.20.1", "description": "...",
//     "dueOn": "2027-02-15" }
//
// The script reads GitHub and checks the whole item before its first write,
// so a rejected item changes nothing. It rejects an item when a value is
// missing or invalid, when the issue, the milestone, a label, or a dependency
// does not exist, and when the dependencies form a cycle. A second run of the
// same item writes nothing. After a failed write, run the item again. The
// script compares the item with GitHub and writes only what still differs.
//
// --dry-run prints the changes and the body that a run would write, and
// writes nothing. The script uses the login of the GitHub CLI, `gh`.
// Exit status: 0 when GitHub holds the item, 2 when the item is rejected or
// the arguments are wrong, 1 when a read or a write fails.
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { parseArgs, promisify } from 'node:util';

const REPOSITORY = { owner: 'ceoloide', name: 'ergogen-gui' };
const REPOSITORY_NAME = `${REPOSITORY.owner}/${REPOSITORY.name}`;
const PROJECT = { owner: 'ceoloide', number: 3 };

const ISSUE_TYPES = ['Task', 'Bug', 'Feature'] as const;
/** The name of each track in the release table of an issue body. */
const TRACKS = {
  queue: 'Queue and trust',
  verification: 'Verification',
  checks: 'Checks',
  architecture: 'Architecture',
  toolchain: 'Toolchain and speed',
  automation: 'Automation',
  docs: 'Docs',
} as const;
/** The description of each size in the release table of an issue body. */
const SIZES = {
  S: 'Small, one pull request',
  M: 'Medium, about two pull requests',
  L: 'Large, about four dependent pull requests',
} as const;
const MODES = ['auto', 'review', 'owner'] as const;
const PRIORITIES = ['P0', 'P1', 'P2', 'P3', 'P4'] as const;
const QUEUE_LABEL = /^(track|size|mode|priority):/;

type IssueType = (typeof ISSUE_TYPES)[number];
type Track = keyof typeof TRACKS;
type Size = keyof typeof SIZES;
type Mode = (typeof MODES)[number];
type Priority = (typeof PRIORITIES)[number];
type Status = 'Proposed' | 'Todo';

type IssueItem = {
  issue: number;
  release: string;
  track: Track;
  size: Size;
  mode: Mode;
  evidence: string;
  change: string;
  exitCondition: string;
  dependsOn: number[];
} & (
  | { type: 'Task'; priority?: Priority }
  | { type: 'Bug' | 'Feature'; priority: Priority }
);

interface ReleaseItem {
  type: 'Release';
  title: string;
  description: string;
  /** A date in the form YYYY-MM-DD. */
  dueOn?: string;
}

type Item = IssueItem | ReleaseItem;

/** Thrown for an item that the queue does not take. */
export class Rejected extends Error {
  /** One sentence for each reason. */
  readonly problems: string[];

  constructor(problems: string[]) {
    super(problems.join('\n'));
    this.problems = problems;
  }
}

const ISSUE_KEYS = [
  'type',
  'issue',
  'release',
  'track',
  'size',
  'mode',
  'priority',
  'evidence',
  'change',
  'exitCondition',
  'dependsOn',
];
const RELEASE_KEYS = ['type', 'title', 'description', 'dueOn'];

/** Joins words as in a sentence: "a, b, or c". */
const either = (words: readonly string[]) =>
  words.length < 3
    ? words.join(' or ')
    : `${words.slice(0, -1).join(', ')}, or ${words[words.length - 1]}`;

const isIssueNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

/** A calendar date in the form YYYY-MM-DD, such as 2027-02-15. */
const isDate = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(value).toISOString().startsWith(value);

/**
 * Parses the JSON of an item file. Throws Rejected with every value that is
 * missing or invalid.
 */
function parseItem(input: unknown): Item {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new Rejected(['The item is not a JSON object.']);
  }
  const fields = input as Record<string, unknown>;
  const problems: string[] = [];
  const quoted = (value: unknown) => JSON.stringify(value) ?? String(value);

  function choice<T extends string>(
    key: string,
    allowed: readonly T[]
  ): T | undefined {
    const value = fields[key];
    if (allowed.includes(value as T)) return value as T;
    problems.push(
      value === undefined
        ? `${key} is missing. Give ${either(allowed)}.`
        : `${key} is ${quoted(value)}. Give ${either(allowed)}.`
    );
    return undefined;
  }
  const required = <T extends string>(key: string, allowed: readonly T[]) =>
    choice(key, allowed) ?? allowed[0];
  function text(key: string, hint: string): string {
    const value = fields[key];
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
    problems.push(`${key} is missing. ${hint}`);
    return '';
  }

  const type = choice('type', [...ISSUE_TYPES, 'Release'] as const);
  if (type === undefined) throw new Rejected(problems);
  const known = type === 'Release' ? RELEASE_KEYS : ISSUE_KEYS;
  for (const key of Object.keys(fields)) {
    if (!known.includes(key)) {
      problems.push(`${key} is not a field of a ${type} item.`);
    }
  }

  if (type === 'Release') {
    const title = text('title', 'Give the version, such as v0.20.1.');
    if (title && !/^v\d+\.\d+(\.\d+)?$/.test(title)) {
      problems.push(`title is "${title}". Give a version, such as v0.20.1.`);
    }
    const description = text(
      'description',
      'Write the goal and the exit condition of the release.'
    );
    const dueOn = fields.dueOn;
    if (dueOn !== undefined && !isDate(dueOn)) {
      problems.push(
        `dueOn is ${quoted(dueOn)}. Give a date, such as 2027-02-15.`
      );
    }
    if (problems.length > 0) throw new Rejected(problems);
    return isDate(dueOn)
      ? { type, title, description, dueOn }
      : { type, title, description };
  }

  const issue = fields.issue;
  if (!isIssueNumber(issue)) {
    problems.push(
      issue === undefined
        ? 'issue is missing. Give the number of the issue.'
        : `issue is ${quoted(issue)}. Give the number of the issue.`
    );
  }
  const release = text('release', 'Give the title of a milestone.');
  const track = required('track', Object.keys(TRACKS) as Track[]);
  const size = required('size', Object.keys(SIZES) as Size[]);
  const mode = required('mode', MODES);
  const priority =
    type === 'Task' && fields.priority === undefined
      ? undefined
      : required('priority', PRIORITIES);
  const evidence = text('evidence', 'Write what shows that the item matters.');
  const change = text('change', 'Write what the item changes.');
  const exitCondition = text(
    'exitCondition',
    'Write the check that proves the item is done.'
  );
  const dependsOn = fields.dependsOn;
  if (!Array.isArray(dependsOn) || !dependsOn.every(isIssueNumber)) {
    problems.push(
      dependsOn === undefined
        ? 'dependsOn is missing. Give the numbers of the issues that block this one, or [].'
        : `dependsOn is ${quoted(dependsOn)}. Give a list of issue numbers, or [].`
    );
  }
  if (problems.length > 0 || !isIssueNumber(issue)) {
    throw new Rejected(problems);
  }
  const common = {
    issue,
    release,
    track,
    size,
    mode,
    evidence,
    change,
    exitCondition,
    dependsOn: [...new Set(dependsOn as number[])],
  };
  if (type === 'Task') {
    return priority ? { ...common, type, priority } : { ...common, type };
  }
  return { ...common, type, priority: priority ?? PRIORITIES[0] };
}

interface Milestone {
  description: string;
  /** A date in the form YYYY-MM-DD. */
  dueOn?: string;
  closed: boolean;
}

/** An issue of the repository, in the graph of blocked-by relations. */
interface GraphIssue {
  title: string;
  closed: boolean;
  /** The issues of the same repository that block this one. */
  blockedBy: readonly number[];
}

/** What the plan reads from the repository and the Project. */
export interface Repository {
  /** Milestones by title. */
  milestones: ReadonlyMap<string, Milestone>;
  labels: ReadonlySet<string>;
  issueTypes: ReadonlySet<string>;
  /** The options of the Status field of the Project. */
  statuses: ReadonlySet<string>;
  projectTitle: string;
  /** Every issue of the repository by number, without pull requests. */
  issues: ReadonlyMap<number, GraphIssue>;
}

/** What the plan reads from the issue that an item adds. */
export interface IssueState {
  body: string;
  type?: string;
  /** The title of its milestone. */
  release?: string;
  labels: readonly string[];
  /** Undefined while the issue is not in the Project. */
  project?: { status?: string };
}

/** One write to GitHub. */
export type Change =
  | {
      kind: 'createRelease';
      title: string;
      description: string;
      dueOn?: string;
    }
  | { kind: 'setType'; issue: number; type: IssueType }
  | { kind: 'setRelease'; issue: number; release: string }
  | { kind: 'addLabels'; issue: number; labels: string[] }
  | { kind: 'removeLabels'; issue: number; labels: string[] }
  | { kind: 'setBody'; issue: number; body: string }
  | { kind: 'removeDependency'; issue: number; blocker: number }
  | { kind: 'addDependency'; issue: number; blocker: number }
  | { kind: 'addToProject'; issue: number; status: Status }
  | { kind: 'setStatus'; issue: number; status: Status };

/** Every read and write of GitHub goes through this interface. */
export interface GitHub {
  readRepository(): Promise<Repository>;
  /** Reads an issue that `readRepository` listed. */
  readIssue(issue: number): Promise<IssueState>;
  write(change: Change): Promise<void>;
}

/**
 * Finds a path of blocked-by relations from `issue` back to itself, once the
 * blockers of `issue` are `dependsOn`. The blockers of every other issue come
 * from `issues`. Returns undefined when there is no cycle.
 */
function findCycle(
  issues: ReadonlyMap<number, GraphIssue>,
  issue: number,
  dependsOn: readonly number[]
): number[] | undefined {
  const visited = new Set<number>();
  const walk = (path: number[]): number[] | undefined => {
    const last = path[path.length - 1];
    const blockers =
      last === issue ? dependsOn : (issues.get(last)?.blockedBy ?? []);
    for (const blocker of blockers) {
      if (blocker === issue) return [...path, blocker];
      if (visited.has(blocker)) continue;
      visited.add(blocker);
      const cycle = walk([...path, blocker]);
      if (cycle) return cycle;
    }
    return undefined;
  };
  return walk([issue]);
}

const REPORT_MARKER =
  '<!-- pnpm queue:add writes the text above this line. The text below is the issue text from before intake. -->';

/** The text that the body held before `pnpm queue:add` first wrote it. */
function reportOf(body: string): string {
  const marker = body.indexOf(REPORT_MARKER);
  return (marker < 0 ? body : body.slice(marker + REPORT_MARKER.length)).trim();
}

function renderBody(
  item: IssueItem,
  dependencies: { number: number; title: string }[],
  report: string
): string {
  const table = [
    '| Release | Track | Size | Mode |',
    '|---|---|---|---|',
    `| ${item.release} | ${TRACKS[item.track]} | ${SIZES[item.size]} | \`${item.mode}\` |`,
  ].join('\n');
  const dependsOn =
    dependencies.length === 0
      ? 'Nothing.'
      : dependencies
          .map(({ number, title }) => `- #${number} ${title}`)
          .join('\n');
  return (
    [
      table,
      `## Evidence\n\n${item.evidence}`,
      `## Change\n\n${item.change}`,
      `## Exit condition\n\n${item.exitCondition}`,
      `## Depends on\n\n${dependsOn}`,
      ...(report === ''
        ? [REPORT_MARKER]
        : ['## Report', REPORT_MARKER, report]),
    ].join('\n\n') + '\n'
  );
}

function planRelease(item: ReleaseItem, repository: Repository): Change[] {
  const { title, description, dueOn } = item;
  const existing = repository.milestones.get(title);
  if (!existing) {
    return [{ kind: 'createRelease', title, description, dueOn }];
  }
  if (existing.description !== description || existing.dueOn !== dueOn) {
    throw new Rejected([
      `The milestone ${title} already exists with another description or due date. Change it on GitHub.`,
    ]);
  }
  return [];
}

function planIssue(
  item: IssueItem,
  repository: Repository,
  issue: IssueState | undefined
): Change[] {
  const number = item.issue;
  const problems: string[] = [];
  const known = repository.issues.get(number);
  if (!issue || !known) {
    problems.push(`#${number} is not an issue of ${REPOSITORY_NAME}.`);
  } else if (known.closed) {
    problems.push(`#${number} is closed.`);
  }
  const milestone = repository.milestones.get(item.release);
  if (!milestone) {
    problems.push(
      `The milestone ${item.release} does not exist. Create it with a Release item first.`
    );
  } else if (milestone.closed) {
    problems.push(`The milestone ${item.release} is closed.`);
  }
  if (!repository.issueTypes.has(item.type)) {
    problems.push(
      `The issue type ${item.type} does not exist in ${REPOSITORY_NAME}.`
    );
  }
  const status: Status = item.type === 'Feature' ? 'Proposed' : 'Todo';
  if (!repository.statuses.has(status)) {
    problems.push(`The Project has no status ${status}.`);
  }
  const labels = [
    `track:${item.track}`,
    `size:${item.size}`,
    `mode:${item.mode}`,
    ...(item.priority ? [`priority:${item.priority}`] : []),
  ];
  for (const label of labels) {
    if (!repository.labels.has(label)) {
      problems.push(`The label ${label} does not exist in ${REPOSITORY_NAME}.`);
    }
  }
  const dependencies = item.dependsOn.flatMap((blocker) => {
    const found = repository.issues.get(blocker);
    if (!found) {
      problems.push(
        `dependsOn lists #${blocker}, which is not an issue of ${REPOSITORY_NAME}.`
      );
    }
    return found ? [{ number: blocker, title: found.title }] : [];
  });
  const cycle = findCycle(repository.issues, number, item.dependsOn);
  if (cycle) {
    const steps = cycle
      .slice(1)
      .map((blocker, index) => `#${cycle[index]} is blocked by #${blocker}`);
    problems.push(
      `dependsOn forms a cycle: ${steps.length === 1 ? steps[0] : `${steps.slice(0, -1).join(', ')}, and ${steps[steps.length - 1]}`}.`
    );
  }
  if (problems.length > 0 || !issue || !known) throw new Rejected(problems);

  const changes: Change[] = [];
  if (issue.type !== item.type) {
    changes.push({ kind: 'setType', issue: number, type: item.type });
  }
  if (issue.release !== item.release) {
    changes.push({ kind: 'setRelease', issue: number, release: item.release });
  }
  const added = labels.filter((label) => !issue.labels.includes(label));
  if (added.length > 0) {
    changes.push({ kind: 'addLabels', issue: number, labels: added });
  }
  const removed = issue.labels.filter(
    (label) => QUEUE_LABEL.test(label) && !labels.includes(label)
  );
  if (removed.length > 0) {
    changes.push({ kind: 'removeLabels', issue: number, labels: removed });
  }
  const body = renderBody(item, dependencies, reportOf(issue.body));
  if (body !== issue.body) {
    changes.push({ kind: 'setBody', issue: number, body });
  }
  for (const blocker of known.blockedBy) {
    if (!item.dependsOn.includes(blocker)) {
      changes.push({ kind: 'removeDependency', issue: number, blocker });
    }
  }
  for (const blocker of item.dependsOn) {
    if (!known.blockedBy.includes(blocker)) {
      changes.push({ kind: 'addDependency', issue: number, blocker });
    }
  }
  if (!issue.project) {
    changes.push({ kind: 'addToProject', issue: number, status });
  } else if (!issue.project.status) {
    changes.push({ kind: 'setStatus', issue: number, status });
  }
  return changes;
}

function describe(change: Change, repository: Repository): string {
  const issue = (number: number) =>
    `#${number} ${repository.issues.get(number)?.title ?? ''}`.trim();
  switch (change.kind) {
    case 'createRelease':
      return `create the milestone ${change.title}${change.dueOn ? `, due ${change.dueOn}` : ' with no due date'}`;
    case 'setType':
      return `set the type to ${change.type}`;
    case 'setRelease':
      return `set the milestone to ${change.release}`;
    case 'addLabels':
      return `add the labels ${change.labels.join(', ')}`;
    case 'removeLabels':
      return `remove the labels ${change.labels.join(', ')}`;
    case 'setBody':
      return 'write the release table and the sections into the body';
    case 'removeDependency':
      return `remove the dependency ${issue(change.blocker)}`;
    case 'addDependency':
      return `add the dependency ${issue(change.blocker)}`;
    case 'addToProject':
      return `add the issue to the Project "${repository.projectTitle}" with the status ${change.status}`;
    case 'setStatus':
      return `set the status in the Project to ${change.status}`;
  }
}

/**
 * Checks an item against GitHub, then writes each change that GitHub does not
 * hold yet, or only prints the changes when `dryRun` is set. Prints one line
 * per change, after its write. Throws Rejected, before any write, for an item
 * that the queue does not take.
 */
export async function addToQueue(
  input: unknown,
  github: GitHub,
  { dryRun, print }: { dryRun: boolean; print: (line: string) => void }
): Promise<void> {
  const item = parseItem(input);
  const repository = await github.readRepository();
  let changes: Change[];
  if (item.type === 'Release') {
    changes = planRelease(item, repository);
    print(`Milestone ${item.title}`);
  } else {
    const issue = repository.issues.has(item.issue)
      ? await github.readIssue(item.issue)
      : undefined;
    changes = planIssue(item, repository, issue);
    print(`#${item.issue} ${repository.issues.get(item.issue)?.title}`);
  }
  if (changes.length === 0) {
    print('Nothing to change. GitHub already holds these values.');
    return;
  }
  for (const change of changes) {
    if (!dryRun) await github.write(change);
    print(`  ${describe(change, repository)}`);
    if (dryRun && change.kind === 'setBody') {
      print(change.body.trimEnd().replace(/^(?=.)/gm, '    '));
    }
  }
  const count = `${changes.length} ${changes.length === 1 ? 'change' : 'changes'}`;
  print(
    dryRun
      ? `Dry run. Nothing was written. A run without --dry-run makes ${count}.`
      : `Made ${count}.`
  );
}

const execFileAsync = promisify(execFile);

/** Runs `gh api` with a JSON request body and returns the JSON reply. */
async function ghApi(args: string[], body: unknown): Promise<unknown> {
  const call = execFileAsync('gh', ['api', ...args, '--input', '-'], {
    maxBuffer: 64 * 1024 * 1024,
  });
  call.child.stdin?.end(JSON.stringify(body));
  return JSON.parse((await call).stdout);
}

async function graphql<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  return ((await ghApi(['graphql'], { query, variables })) as { data: T }).data;
}

interface NamedNode {
  id: string;
  name: string;
}

const REPOSITORY_QUERY = `query ($owner: String!, $name: String!, $projectOwner: String!, $project: Int!) {
  repository(owner: $owner, name: $name) {
    issueTypes(first: 20) { nodes { id name } }
    milestones(first: 100, states: [OPEN, CLOSED]) { nodes { id title description dueOn closed } }
    labels(first: 100) { nodes { id name } }
  }
  user(login: $projectOwner) {
    projectV2(number: $project) {
      id
      title
      field(name: "Status") { ... on ProjectV2SingleSelectField { id options { id name } } }
    }
  }
}`;

interface RepositoryReply {
  repository: {
    issueTypes: { nodes: NamedNode[] };
    milestones: {
      nodes: {
        id: string;
        title: string;
        description: string | null;
        dueOn: string | null;
        closed: boolean;
      }[];
    };
    labels: { nodes: NamedNode[] };
  };
  user: {
    projectV2: {
      id: string;
      title: string;
      field: { id: string; options: NamedNode[] };
    };
  };
}

const ISSUES_QUERY = `query ($owner: String!, $name: String!, $after: String) {
  repository(owner: $owner, name: $name) {
    issues(first: 100, after: $after, states: [OPEN, CLOSED]) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        number
        title
        closed
        blockedBy(first: 100) { nodes { number repository { nameWithOwner } } }
      }
    }
  }
}`;

interface IssuesReply {
  repository: {
    issues: {
      pageInfo: { hasNextPage: boolean; endCursor: string };
      nodes: {
        id: string;
        number: number;
        title: string;
        closed: boolean;
        blockedBy: {
          nodes: { number: number; repository: { nameWithOwner: string } }[];
        };
      }[];
    };
  };
}

const ISSUE_QUERY = `query ($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
      body
      issueType { name }
      milestone { title }
      labels(first: 100) { nodes { name } }
      projectItems(first: 50) {
        nodes {
          id
          project { id }
          fieldValueByName(name: "Status") { ... on ProjectV2ItemFieldSingleSelectValue { name } }
        }
      }
    }
  }
}`;

interface IssueReply {
  repository: {
    issue: {
      body: string;
      issueType: { name: string } | null;
      milestone: { title: string } | null;
      labels: { nodes: { name: string }[] };
      projectItems: {
        nodes: {
          id: string;
          project: { id: string };
          fieldValueByName: { name: string } | null;
        }[];
      };
    };
  };
}

const UPDATE_ISSUE = (field: string) =>
  `mutation ($id: ID!, $value: ${field === 'body' ? 'String' : 'ID'}!) {
    updateIssue(input: { id: $id, ${field}: $value }) { clientMutationId }
  }`;
const LABELS = (mutation: string) =>
  `mutation ($id: ID!, $labels: [ID!]!) {
    ${mutation}(input: { labelableId: $id, labelIds: $labels }) { clientMutationId }
  }`;
const DEPENDENCY = (mutation: string) =>
  `mutation ($id: ID!, $blocker: ID!) {
    ${mutation}(input: { issueId: $id, blockingIssueId: $blocker }) { clientMutationId }
  }`;
const ADD_TO_PROJECT = `mutation ($project: ID!, $id: ID!) {
  addProjectV2ItemById(input: { projectId: $project, contentId: $id }) { item { id } }
}`;
const SET_STATUS = `mutation ($project: ID!, $item: ID!, $field: ID!, $option: String!) {
  updateProjectV2ItemFieldValue(input: { projectId: $project, itemId: $item, fieldId: $field, value: { singleSelectOptionId: $option } }) { clientMutationId }
}`;

/** GitHub through the login of the GitHub CLI. */
function githubCli(): GitHub {
  const nodeIds = new Map<string, string>();
  const idOf = (key: string) => {
    const id = nodeIds.get(key);
    if (id === undefined) throw new Error(`No node ID was read for ${key}.`);
    return id;
  };
  const variables = { owner: REPOSITORY.owner, name: REPOSITORY.name };

  async function setStatus(item: string, status: Status) {
    await graphql(SET_STATUS, {
      project: idOf('project'),
      item,
      field: idOf('status'),
      option: idOf(`status ${status}`),
    });
  }

  return {
    async readRepository() {
      const reply = await graphql<RepositoryReply>(REPOSITORY_QUERY, {
        ...variables,
        projectOwner: PROJECT.owner,
        project: PROJECT.number,
      });
      const { repository } = reply;
      const project = reply.user.projectV2;
      nodeIds.set('project', project.id);
      nodeIds.set('status', project.field.id);
      for (const { id, name } of repository.issueTypes.nodes) {
        nodeIds.set(`type ${name}`, id);
      }
      for (const { id, title } of repository.milestones.nodes) {
        nodeIds.set(`milestone ${title}`, id);
      }
      for (const { id, name } of repository.labels.nodes) {
        nodeIds.set(`label ${name}`, id);
      }
      for (const { id, name } of project.field.options) {
        nodeIds.set(`status ${name}`, id);
      }

      const issues = new Map<number, GraphIssue>();
      let after: string | null = null;
      do {
        const page: IssuesReply = await graphql<IssuesReply>(ISSUES_QUERY, {
          ...variables,
          after,
        });
        for (const node of page.repository.issues.nodes) {
          nodeIds.set(`issue ${node.number}`, node.id);
          issues.set(node.number, {
            title: node.title,
            closed: node.closed,
            blockedBy: node.blockedBy.nodes
              .filter(
                (blocker) =>
                  blocker.repository.nameWithOwner === REPOSITORY_NAME
              )
              .map((blocker) => blocker.number),
          });
        }
        const { hasNextPage, endCursor } = page.repository.issues.pageInfo;
        after = hasNextPage ? endCursor : null;
      } while (after);

      return {
        milestones: new Map(
          repository.milestones.nodes.map((milestone) => [
            milestone.title,
            {
              description: milestone.description ?? '',
              ...(milestone.dueOn && { dueOn: milestone.dueOn.slice(0, 10) }),
              closed: milestone.closed,
            },
          ])
        ),
        labels: new Set(repository.labels.nodes.map(({ name }) => name)),
        issueTypes: new Set(
          repository.issueTypes.nodes.map(({ name }) => name)
        ),
        statuses: new Set(project.field.options.map(({ name }) => name)),
        projectTitle: project.title,
        issues,
      };
    },

    async readIssue(number) {
      const { issue } = (
        await graphql<IssueReply>(ISSUE_QUERY, { ...variables, number })
      ).repository;
      const item = issue.projectItems.nodes.find(
        (node) => node.project.id === idOf('project')
      );
      if (item) nodeIds.set(`project item ${number}`, item.id);
      return {
        body: issue.body,
        ...(issue.issueType && { type: issue.issueType.name }),
        ...(issue.milestone && { release: issue.milestone.title }),
        labels: issue.labels.nodes.map(({ name }) => name),
        ...(item && {
          project: item.fieldValueByName
            ? { status: item.fieldValueByName.name }
            : {},
        }),
      };
    },

    async write(change) {
      switch (change.kind) {
        case 'createRelease':
          await ghApi(
            [`repos/${REPOSITORY_NAME}/milestones`, '--method', 'POST'],
            {
              title: change.title,
              description: change.description,
              ...(change.dueOn && { due_on: `${change.dueOn}T00:00:00Z` }),
            }
          );
          return;
        case 'setType':
          await graphql(UPDATE_ISSUE('issueTypeId'), {
            id: idOf(`issue ${change.issue}`),
            value: idOf(`type ${change.type}`),
          });
          return;
        case 'setRelease':
          await graphql(UPDATE_ISSUE('milestoneId'), {
            id: idOf(`issue ${change.issue}`),
            value: idOf(`milestone ${change.release}`),
          });
          return;
        case 'addLabels':
        case 'removeLabels':
          await graphql(
            LABELS(
              change.kind === 'addLabels'
                ? 'addLabelsToLabelable'
                : 'removeLabelsFromLabelable'
            ),
            {
              id: idOf(`issue ${change.issue}`),
              labels: change.labels.map((label) => idOf(`label ${label}`)),
            }
          );
          return;
        case 'setBody':
          await graphql(UPDATE_ISSUE('body'), {
            id: idOf(`issue ${change.issue}`),
            value: change.body,
          });
          return;
        case 'addDependency':
        case 'removeDependency':
          await graphql(
            DEPENDENCY(
              change.kind === 'addDependency'
                ? 'addBlockedBy'
                : 'removeBlockedBy'
            ),
            {
              id: idOf(`issue ${change.issue}`),
              blocker: idOf(`issue ${change.blocker}`),
            }
          );
          return;
        case 'addToProject': {
          const reply = await graphql<{
            addProjectV2ItemById: { item: { id: string } };
          }>(ADD_TO_PROJECT, {
            project: idOf('project'),
            id: idOf(`issue ${change.issue}`),
          });
          await setStatus(reply.addProjectV2ItemById.item.id, change.status);
          return;
        }
        case 'setStatus':
          await setStatus(idOf(`project item ${change.issue}`), change.status);
          return;
      }
    },
  };
}

const USAGE = 'Usage: pnpm queue:add <item.json> [--dry-run]';

async function main(args: string[]): Promise<number> {
  let path: string;
  let dryRun: boolean;
  try {
    const { values, positionals } = parseArgs({
      args,
      options: { 'dry-run': { type: 'boolean', default: false } },
      allowPositionals: true,
    });
    if (positionals.length !== 1) throw new Error('Give one item file.');
    [path] = positionals;
    dryRun = values['dry-run'];
  } catch (error) {
    console.error(`${(error as Error).message}\n${USAGE}`);
    return 2;
  }
  let input: unknown;
  try {
    input = JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    console.error(`Cannot read ${path} as JSON. ${(error as Error).message}`);
    return 2;
  }
  try {
    await addToQueue(input, githubCli(), {
      dryRun,
      print: (line) => console.log(line),
    });
    return 0;
  } catch (error) {
    if (error instanceof Rejected) {
      console.error(
        ['pnpm queue:add rejected the item:', ...error.problems].join('\n- ')
      );
      return 2;
    }
    const { stderr } = error as { stderr?: string };
    console.error(stderr?.trim() || (error as Error).message);
    return 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exitCode = await main(process.argv.slice(2));
}
