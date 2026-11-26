// Adds an issue to the queue, or creates the milestone of a new release:
//
//   pnpm queue:add <item.json> [--dry-run]
//   pnpm queue:add --help
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
//     "dependsOn": [274, 273]    the issues of ceoloide/ergogen-gui that block
//                                this one, or []
//   }
//
// The script sets the issue type, the milestone, and the track, size, mode,
// and priority labels, and removes the other labels of those four kinds. It
// makes the issue blocked by exactly the issues in dependsOn, and keeps each
// blocker from another repository. It adds new blockers before it removes old
// ones, so a failed run leaves the issue blocked by more issues, not fewer. A
// new item enters the Project with the status Proposed for a Feature and Todo
// for any other type. The script never changes the status of an item that
// has one.
//
// The script never edits the body of an issue. It writes the release table
// and the Evidence, Change, Exit condition, and Depends on sections into one
// comment that it owns, and updates that comment in place on a later run:
//
//   <!-- pnpm queue:add #400 sha256:<checksum> -->
//
//   | Release | Track | Size | Mode |
//   ...
//   ## Depends on
//
//   - #274 R20-01 Load the queue
//   - ergogen/ergogen#12 Export the outline as SVG
//
// The first line is a hidden marker. It names the issue and holds the SHA-256
// of the text below it, read with LF line endings and without the blank
// space around it, because an edit on GitHub turns every line ending into
// CRLF. Depends on lists every blocker, also one in another repository.
//
// The script owns a comment when the login of `gh` wrote it and the comment
// starts with the marker of the issue and the text that matches its checksum.
// It never edits a comment of another author, whatever that comment holds. It
// refuses the item when a comment of its login starts with
// "<!-- pnpm queue:add" but is not a comment that it owns: a broken marker, a
// marker of another issue, or a comment that someone edited by hand. It also
// refuses the item when it owns two comments on the issue. Without an owned
// comment, it writes a new one.
//
// A release item creates a milestone, with an optional due date. The
// milestone description holds the description and the exit condition:
//
//   { "type": "Release", "title": "v0.20.1", "description": "...",
//     "exitCondition": "...", "dueOn": "2027-02-15" }
//
// The script reads GitHub and checks the whole item before its first write,
// so a rejected item changes nothing. It rejects an item when a value is
// missing or invalid, when the issue, the milestone, a label, or a dependency
// does not exist, when the dependencies form a cycle, and when it refuses the
// comments. A second run of the same item writes nothing. After a failed
// write, run the item again. The script compares the item with GitHub and
// writes only what still differs.
//
// The GitHub API cannot write a value only while it is unchanged, so a change
// that someone saves between the last read of the script and its write can
// be lost:
//
// - The comment is the first write, a moment after the read. An edit of the
//   owned comment that someone saves in that moment is lost.
// - The script reads the status of the Project item again right before it
//   sets the status, and sets it only when the item still has none. A status
//   that someone sets between that read and the write is overwritten.
// - The script reads the blocked-by relations once, before its first write.
//   A relation that someone changes after that read can be overwritten.
//
// --dry-run prints the changes and the comment that a run would write, and
// writes nothing. The script uses the login of the GitHub CLI, `gh`.
// Exit status: 0 when GitHub holds the item, 2 when the item is rejected or
// the arguments are wrong, 1 when a read or a write fails.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import {
  type Api,
  ghApi,
  PROJECT,
  REPOSITORY,
  REPOSITORY_NAME,
} from './github.mts';

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
  exitCondition: string;
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
const RELEASE_KEYS = ['type', 'title', 'description', 'exitCondition', 'dueOn'];

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
    const description = text('description', 'Write the goal of the release.');
    const exitCondition = text(
      'exitCondition',
      'Write the check that proves the release is done.'
    );
    const dueOn = fields.dueOn;
    if (dueOn !== undefined && !isDate(dueOn)) {
      problems.push(
        `dueOn is ${quoted(dueOn)}. Give a date, such as 2027-02-15.`
      );
    }
    if (problems.length > 0) throw new Rejected(problems);
    return isDate(dueOn)
      ? { type, title, description, exitCondition, dueOn }
      : { type, title, description, exitCondition };
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
        ? `dependsOn is missing. Give the numbers of the issues in ${REPOSITORY_NAME} that block this one, or [].`
        : `dependsOn is ${quoted(dependsOn)}. Give the numbers of issues in ${REPOSITORY_NAME}, or []. Add a dependency on an issue of another repository on GitHub, and pnpm queue:add keeps it.`
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

/**
 * An issue in the graph of blocked-by relations: its number for an issue of
 * this repository, or `owner/name#number` for an issue of another one.
 */
export type IssueRef = number | `${string}#${number}`;

/** An issue in the graph of blocked-by relations. */
interface GraphIssue {
  title: string;
  closed: boolean;
  /** The issues that block this one, in any repository. */
  blockedBy: readonly IssueRef[];
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
  /**
   * Every issue of the repository, without pull requests, and every issue of
   * another repository that blocks one of them, directly or through others.
   */
  issues: ReadonlyMap<IssueRef, GraphIssue>;
}

/** A comment on an issue. */
export interface Comment {
  /** The node ID. */
  id: string;
  url: string;
  body: string;
  /** Whether the login that runs the script wrote the comment. */
  byViewer: boolean;
}

/** What the plan reads from the issue that an item adds. */
export interface IssueState {
  type?: string;
  /** The title of its milestone. */
  release?: string;
  labels: readonly string[];
  /** Every comment on the issue, oldest first. */
  comments: readonly Comment[];
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
  | { kind: 'addComment'; issue: number; body: string }
  | {
      kind: 'updateComment';
      issue: number;
      /** The node ID of the comment. */
      id: string;
      url: string;
      body: string;
    }
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
 * blockers of `issue` are `blockers`. The blockers of every other issue come
 * from `issues`. Returns undefined when there is no cycle.
 */
function findCycle(
  issues: ReadonlyMap<IssueRef, GraphIssue>,
  issue: number,
  blockers: readonly IssueRef[]
): IssueRef[] | undefined {
  const visited = new Set<IssueRef>();
  const walk = (path: IssueRef[]): IssueRef[] | undefined => {
    const last = path[path.length - 1];
    const next =
      last === issue ? blockers : (issues.get(last)?.blockedBy ?? []);
    for (const blocker of next) {
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

const nameOf = (ref: IssueRef) => (typeof ref === 'number' ? `#${ref}` : ref);

/** The name and the title of an issue, such as "#274 R20-01 Load the queue". */
const titled = (ref: IssueRef, repository: Repository) =>
  `${nameOf(ref)} ${repository.issues.get(ref)?.title ?? ''}`.trim();

/** The text with which the marker of an owned comment starts. */
const MARKER_OPENING = '<!-- pnpm queue:add';
/** The first line of an owned comment. */
const MARKER = /^<!-- pnpm queue:add #([1-9]\d*) sha256:([0-9a-f]{64}) -->$/;

/**
 * `text` with LF line endings and without the blank space around it, because
 * an edit on GitHub turns every line ending into CRLF.
 */
const normalized = (text: string) => text.replace(/\r\n/g, '\n').trim();

/** The SHA-256 of `content`, in hexadecimal. */
const checksum = (content: string) =>
  createHash('sha256').update(content).digest('hex');

/** The owned comment of `issue` that holds `content`. */
const renderComment = (issue: number, content: string) =>
  `${MARKER_OPENING} #${issue} sha256:${checksum(content)} -->\n\n${content}`;

/** The text below the marker of the owned comment for `item`. */
function renderContent(item: IssueItem, dependencies: string[]): string {
  const table = [
    '| Release | Track | Size | Mode |',
    '|---|---|---|---|',
    `| ${item.release} | ${TRACKS[item.track]} | ${SIZES[item.size]} | \`${item.mode}\` |`,
  ].join('\n');
  const dependsOn =
    dependencies.length === 0
      ? 'Nothing.'
      : dependencies.map((dependency) => `- ${dependency}`).join('\n');
  const sections = [
    table,
    `## Evidence\n\n${item.evidence}`,
    `## Change\n\n${item.change}`,
    `## Exit condition\n\n${item.exitCondition}`,
    `## Depends on\n\n${dependsOn}`,
    '_`pnpm queue:add` wrote this comment. To change it, run the script again with a changed item. The script refuses to update a comment that someone edited by hand._',
  ];
  return normalized(sections.join('\n\n'));
}

/** What the comments of an issue hold of the comment that the script owns. */
type CommentSearch =
  | { kind: 'none' }
  /** `content` is the text below the marker of `comment`. */
  | { kind: 'found'; comment: Comment; content: string }
  | { kind: 'refused'; cause: string };

/**
 * Finds the comment that the script owns on `issue`, or the reason to leave
 * the comments alone. A comment of another author never counts.
 */
function findOwnedComment(
  comments: readonly Comment[],
  issue: number
): CommentSearch {
  const refused = (cause: string): CommentSearch => ({
    kind: 'refused',
    cause,
  });
  const owned: { comment: Comment; content: string }[] = [];
  for (const comment of comments) {
    const text = normalized(comment.body);
    if (!comment.byViewer || !text.startsWith(MARKER_OPENING)) continue;
    const [firstLine] = text.split('\n', 1);
    const marker = MARKER.exec(firstLine);
    if (!marker) {
      return refused(
        `the comment ${comment.url} starts with "${MARKER_OPENING}", but its first line is not a valid marker.`
      );
    }
    if (Number(marker[1]) !== issue) {
      return refused(
        `the marker of the comment ${comment.url} names #${marker[1]}, not #${issue}.`
      );
    }
    const content = text.slice(firstLine.length).trim();
    if (checksum(content) !== marker[2]) {
      return refused(
        `the comment ${comment.url} changed after pnpm queue:add wrote it.`
      );
    }
    owned.push({ comment, content });
  }
  if (owned.length > 1) {
    return refused(
      `${owned.length} comments carry the marker of #${issue}: ${owned.map(({ comment }) => comment.url).join(', ')}.`
    );
  }
  return owned.length === 1 ? { kind: 'found', ...owned[0] } : { kind: 'none' };
}

function planRelease(item: ReleaseItem, repository: Repository): Change[] {
  const { title, dueOn } = item;
  const description = `${item.description}\n\nExit condition: ${item.exitCondition}`;
  const existing = repository.milestones.get(title);
  if (!existing) {
    return [{ kind: 'createRelease', title, description, dueOn }];
  }
  if (existing.description !== description || existing.dueOn !== dueOn) {
    throw new Rejected([
      `The milestone ${title} already exists with another description, exit condition, or due date. Change it on GitHub.`,
    ]);
  }
  return [];
}

function planIssue(
  item: IssueItem,
  repository: Repository,
  issue: IssueState | undefined
): { changes: Change[]; kept: IssueRef[] } {
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
  for (const blocker of item.dependsOn) {
    if (!repository.issues.has(blocker)) {
      problems.push(
        `dependsOn lists #${blocker}, which is not an issue of ${REPOSITORY_NAME}.`
      );
    }
  }
  const kept = (known?.blockedBy ?? []).filter(
    (blocker) => typeof blocker === 'string'
  );
  const cycle = findCycle(repository.issues, number, [
    ...item.dependsOn,
    ...kept,
  ]);
  if (cycle) {
    const steps = cycle
      .slice(1)
      .map(
        (blocker, index) =>
          `${nameOf(cycle[index])} is blocked by ${nameOf(blocker)}`
      );
    problems.push(
      `The dependencies form a cycle: ${steps.length === 1 ? steps[0] : `${steps.slice(0, -1).join(', ')}, and ${steps[steps.length - 1]}`}.`
    );
  }
  const found = issue ? findOwnedComment(issue.comments, number) : undefined;
  if (found?.kind === 'refused') {
    problems.push(
      `pnpm queue:add leaves the comments of #${number} alone, because ${found.cause} On GitHub, remove the first line, a hidden marker, from each comment that pnpm queue:add must not update, or delete that comment. A run then updates the one comment left with the marker, or writes a new one.`
    );
  }
  if (
    problems.length > 0 ||
    !issue ||
    !known ||
    !found ||
    found.kind === 'refused'
  ) {
    throw new Rejected(problems);
  }

  const changes: Change[] = [];
  const content = renderContent(
    item,
    [...item.dependsOn, ...kept].map((blocker) => titled(blocker, repository))
  );
  const body = renderComment(number, content);
  if (found.kind === 'none') {
    changes.push({ kind: 'addComment', issue: number, body });
  } else if (found.content !== content) {
    const { id, url } = found.comment;
    changes.push({ kind: 'updateComment', issue: number, id, url, body });
  }
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
  for (const blocker of item.dependsOn) {
    if (!known.blockedBy.includes(blocker)) {
      changes.push({ kind: 'addDependency', issue: number, blocker });
    }
  }
  for (const blocker of known.blockedBy) {
    if (typeof blocker === 'number' && !item.dependsOn.includes(blocker)) {
      changes.push({ kind: 'removeDependency', issue: number, blocker });
    }
  }
  if (!issue.project) {
    changes.push({ kind: 'addToProject', issue: number, status });
  } else if (!issue.project.status) {
    changes.push({ kind: 'setStatus', issue: number, status });
  }
  return { changes, kept };
}

function describe(change: Change, repository: Repository): string {
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
    case 'addComment':
      return 'write the release table and the sections into a new comment';
    case 'updateComment':
      return `update the release table and the sections in the comment ${change.url}`;
    case 'removeDependency':
      return `remove the dependency ${titled(change.blocker, repository)}`;
    case 'addDependency':
      return `add the dependency ${titled(change.blocker, repository)}`;
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
    const plan = planIssue(item, repository, issue);
    changes = plan.changes;
    print(`#${item.issue} ${repository.issues.get(item.issue)?.title}`);
    for (const blocker of plan.kept) {
      print(
        `  keep the dependency ${titled(blocker, repository)}, which is in another repository`
      );
    }
  }
  if (changes.length === 0) {
    print('Nothing to change. GitHub already holds these values.');
    return;
  }
  for (const change of changes) {
    if (!dryRun) await github.write(change);
    print(`  ${describe(change, repository)}`);
    if (
      dryRun &&
      (change.kind === 'addComment' || change.kind === 'updateComment')
    ) {
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

/** The fields of an issue in the graph of blocked-by relations. */
const GRAPH_ISSUE = `id number title closed repository { nameWithOwner }
  blockedBy(first: 100) { nodes { id number repository { nameWithOwner } } }`;

const ISSUES_QUERY = `query ($owner: String!, $name: String!, $after: String) {
  repository(owner: $owner, name: $name) {
    issues(first: 100, after: $after, states: [OPEN, CLOSED]) {
      pageInfo { hasNextPage endCursor }
      nodes { ${GRAPH_ISSUE} }
    }
  }
}`;

const NODES_QUERY = `query ($ids: [ID!]!) {
  nodes(ids: $ids) { ... on Issue { ${GRAPH_ISSUE} } }
}`;

interface IssueNode {
  id: string;
  number: number;
  repository: { nameWithOwner: string };
}

interface GraphIssueNode extends IssueNode {
  title: string;
  closed: boolean;
  blockedBy: { nodes: IssueNode[] };
}

interface IssuesReply {
  repository: {
    issues: {
      pageInfo: { hasNextPage: boolean; endCursor: string };
      nodes: GraphIssueNode[];
    };
  };
}

const refOf = ({ number, repository }: IssueNode): IssueRef =>
  repository.nameWithOwner === REPOSITORY_NAME
    ? number
    : `${repository.nameWithOwner}#${number}`;

const ISSUE_QUERY = `query ($owner: String!, $name: String!, $number: Int!, $after: String) {
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
      issueType { name }
      milestone { title }
      labels(first: 100) { nodes { name } }
      projectItems(first: 50) {
        nodes {
          project { id }
          fieldValueByName(name: "Status") { ... on ProjectV2ItemFieldSingleSelectValue { name } }
        }
      }
      comments(first: 100, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes { id url body viewerDidAuthor }
      }
    }
  }
}`;

interface IssueReply {
  repository: {
    issue: {
      issueType: { name: string } | null;
      milestone: { title: string } | null;
      labels: { nodes: { name: string }[] };
      projectItems: {
        nodes: {
          project: { id: string };
          fieldValueByName: { name: string } | null;
        }[];
      };
      comments: {
        pageInfo: { hasNextPage: boolean; endCursor: string };
        nodes: {
          id: string;
          url: string;
          body: string;
          viewerDidAuthor: boolean;
        }[];
      };
    };
  };
}

const UPDATE_ISSUE = (field: string) =>
  `mutation ($id: ID!, $value: ID!) {
    updateIssue(input: { id: $id, ${field}: $value }) { clientMutationId }
  }`;
const ADD_COMMENT = `mutation ($id: ID!, $body: String!) {
  addComment(input: { subjectId: $id, body: $body }) { clientMutationId }
}`;
const UPDATE_COMMENT = `mutation ($id: ID!, $body: String!) {
  updateIssueComment(input: { id: $id, body: $body }) { clientMutationId }
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

interface AddToProjectReply {
  addProjectV2ItemById: { item: { id: string } };
}

const ITEM_STATUS = `query ($item: ID!) {
  node(id: $item) {
    ... on ProjectV2Item { fieldValueByName(name: "Status") { ... on ProjectV2ItemFieldSingleSelectValue { name } } }
  }
}`;

interface ItemStatusReply {
  node: { fieldValueByName: { name: string } | null };
}

const SET_STATUS = `mutation ($project: ID!, $item: ID!, $field: ID!, $option: String!) {
  updateProjectV2ItemFieldValue(input: { projectId: $project, itemId: $item, fieldId: $field, value: { singleSelectOptionId: $option } }) { clientMutationId }
}`;

/** GitHub through `api`, by default `gh api` with the login of the GitHub CLI. */
export function githubCli(api: Api = ghApi): GitHub {
  async function graphql<T>(
    query: string,
    variables: Record<string, unknown>
  ): Promise<T> {
    return ((await api(['graphql'], { query, variables })) as { data: T }).data;
  }

  const nodeIds = new Map<string, string>();
  const idOf = (key: string) => {
    const id = nodeIds.get(key);
    if (id === undefined) throw new Error(`No node ID was read for ${key}.`);
    return id;
  };
  const variables = { owner: REPOSITORY.owner, name: REPOSITORY.name };

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

      const issues = new Map<IssueRef, GraphIssue>();
      const addIssue = (node: GraphIssueNode) => {
        for (const issue of [node, ...node.blockedBy.nodes]) {
          nodeIds.set(`issue ${refOf(issue)}`, issue.id);
        }
        issues.set(refOf(node), {
          title: node.title,
          closed: node.closed,
          blockedBy: node.blockedBy.nodes.map(refOf),
        });
      };
      let after: string | null = null;
      do {
        const page: IssuesReply = await graphql<IssuesReply>(ISSUES_QUERY, {
          ...variables,
          after,
        });
        page.repository.issues.nodes.forEach(addIssue);
        const { hasNextPage, endCursor } = page.repository.issues.pageInfo;
        after = hasNextPage ? endCursor : null;
      } while (after);

      const requested = new Set<IssueRef>();
      const unread = () =>
        [...new Set([...issues.values()].flatMap(({ blockedBy }) => blockedBy))]
          .filter((ref) => !issues.has(ref) && !requested.has(ref))
          .slice(0, 100);
      for (let batch = unread(); batch.length > 0; batch = unread()) {
        batch.forEach((ref) => requested.add(ref));
        const reply = await graphql<{ nodes: GraphIssueNode[] }>(NODES_QUERY, {
          ids: batch.map((ref) => idOf(`issue ${ref}`)),
        });
        reply.nodes.forEach(addIssue);
      }

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
      const comments: Comment[] = [];
      let issue: IssueReply['repository']['issue'];
      let after: string | null = null;
      do {
        const page: IssueReply = await graphql<IssueReply>(ISSUE_QUERY, {
          ...variables,
          number,
          after,
        });
        issue = page.repository.issue;
        for (const { id, url, body, viewerDidAuthor } of issue.comments.nodes) {
          comments.push({ id, url, body, byViewer: viewerDidAuthor });
        }
        const { hasNextPage, endCursor } = issue.comments.pageInfo;
        after = hasNextPage ? endCursor : null;
      } while (after);
      const item = issue.projectItems.nodes.find(
        (node) => node.project.id === idOf('project')
      );
      return {
        ...(issue.issueType && { type: issue.issueType.name }),
        ...(issue.milestone && { release: issue.milestone.title }),
        labels: issue.labels.nodes.map(({ name }) => name),
        comments,
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
          await api(
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
        case 'addComment':
          await graphql(ADD_COMMENT, {
            id: idOf(`issue ${change.issue}`),
            body: change.body,
          });
          return;
        case 'updateComment':
          await graphql(UPDATE_COMMENT, { id: change.id, body: change.body });
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
        case 'addToProject':
        case 'setStatus': {
          // For an issue that is in the Project already, GitHub returns the
          // existing item.
          const { item } = (
            await graphql<AddToProjectReply>(ADD_TO_PROJECT, {
              project: idOf('project'),
              id: idOf(`issue ${change.issue}`),
            })
          ).addProjectV2ItemById;
          // Someone can set the status after the script read the issue. A
          // status set between this read and the write below is lost, as
          // the header comment says.
          const { node } = await graphql<ItemStatusReply>(ITEM_STATUS, {
            item: item.id,
          });
          if (node.fieldValueByName) return;
          await graphql(SET_STATUS, {
            project: idOf('project'),
            item: item.id,
            field: idOf('status'),
            option: idOf(`status ${change.status}`),
          });
          return;
        }
      }
    },
  };
}

const USAGE = 'Usage: pnpm queue:add <item.json> [--dry-run]';

const HELP = `${USAGE}

Adds an issue to the Project "Ergogen GUI 2027" with its type, milestone,
labels, and dependencies, or creates the milestone of a release. The header
comment of scripts/queue/add.mts describes the item file. The script checks
the whole item before its first write, so a rejected item changes nothing.

The script never edits the body of an issue. It writes the release table and
the sections into one comment that it owns, and updates that comment on a
later run. The first line of the comment is a hidden marker that names the
issue and holds a checksum of the text below it. The script never edits a
comment of another author. It refuses the item when a comment of its login
has a broken marker, a marker of another issue, or text that someone edited
by hand, and when it owns two comments on the issue.

The GitHub API cannot write a value only while it is unchanged, so a change
that someone saves between the last read of the script and its write can be
lost:
- The comment is the first write, a moment after the read. An edit of the
  owned comment that someone saves in that moment is lost.
- The script reads the status of the Project item again right before it sets
  the status, and sets it only when the item still has none. A status that
  someone sets between that read and the write is overwritten.
- The script reads the blocked-by relations once, before its first write. A
  relation that someone changes after that read can be overwritten.

Options:
  --dry-run  Print the changes and the comment that a run would write, and
             write nothing.
  --help     Print this text.

Exit status: 0 when GitHub holds the item, 2 when the item is rejected or the
arguments are wrong, 1 when a read or a write fails.`;

async function main(args: string[]): Promise<number> {
  let path: string;
  let dryRun: boolean;
  try {
    const { values, positionals } = parseArgs({
      args,
      options: {
        'dry-run': { type: 'boolean', default: false },
        help: { type: 'boolean', default: false },
      },
      allowPositionals: true,
    });
    if (values.help) {
      console.log(HELP);
      return 0;
    }
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
