// Prints the next task of the queue, the item that a new session takes:
//
//   pnpm queue:next [--json]
//   pnpm queue:next --help
//
// The queue is the Project "Ergogen GUI 2027", Project 3 of the user
// ceoloide. An open issue of ceoloide/ergogen-gui is ready when:
//
// - its milestone is a release, a version such as v0.20 or v0.20.1. An issue
//   in the milestone Backlog or in no milestone is not in the queue;
// - its status in the Project is Todo. An item that is Proposed, In progress,
//   or Done is not ready, and neither is an issue outside the Project;
// - it has neither the label mode:owner nor the label decision;
// - every issue that blocks it is closed, also an issue of another
//   repository.
//
// The next task is the first ready item in this order:
//
// 1. An item with the priority P0 or P1 comes first. An item with the
//    priority P3 or P4 comes last, so it is the next task only when no other
//    item is ready. An item without a priority counts as P2.
// 2. Then the lowest release. Releases compare as versions: v0.9 comes before
//    v0.20, and v0.20.1 comes after v0.20 and before v0.21.
// 3. Then the priority, P0 before P1 and P3 before P4.
// 4. Then the roadmap id at the start of the title, such as R20-03, compared
//    as numbers. An item without one comes after the items with one.
// 5. Then the issue number.
//
// The script only reads GitHub, with the login of the GitHub CLI, `gh`. It
// prints the issue and its title, then its release, priority, size, and mode,
// then its URL. When no item is ready, it prints "No item is ready." With
// --json it prints {"next": {...}}, or {"next": null} when no item is ready.
// Exit status: 0 when the script read the queue, also when no item is ready,
// 2 when the arguments are wrong, 1 when a read fails.
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { type Api, ghApi, PROJECT, REPOSITORY } from './github.mts';

const PRIORITIES = ['P0', 'P1', 'P2', 'P3', 'P4'] as const;
type Priority = (typeof PRIORITIES)[number];

/** The tier of each priority. A lower tier comes first. */
const TIER: Record<Priority, number> = { P0: 0, P1: 0, P2: 1, P3: 2, P4: 2 };

/** The next task, as `--json` prints it. */
export interface Task {
  issue: number;
  title: string;
  url: string;
  release: string;
  priority: Priority | null;
  size: string | null;
  mode: string | null;
}

const OPEN_ISSUES = `query ($owner: String!, $name: String!, $after: String) {
  repository(owner: $owner, name: $name) {
    issues(first: 100, after: $after, states: [OPEN]) {
      pageInfo { hasNextPage endCursor }
      nodes {
        number
        title
        url
        milestone { title }
        labels(first: 100) { nodes { name } }
        blockedBy(first: 100) { nodes { closed } }
        projectItems(first: 50) {
          nodes {
            project { number owner { ... on User { login } } }
            fieldValueByName(name: "Status") { ... on ProjectV2ItemFieldSingleSelectValue { name } }
          }
        }
      }
    }
  }
}`;

interface IssueNode {
  number: number;
  title: string;
  url: string;
  milestone: { title: string } | null;
  labels: { nodes: { name: string }[] };
  blockedBy: { nodes: { closed: boolean }[] };
  projectItems: {
    nodes: {
      project: { number: number; owner: { login?: string } };
      fieldValueByName: { name: string } | null;
    }[];
  };
}

interface OpenIssuesReply {
  data: {
    repository: {
      issues: {
        pageInfo: { hasNextPage: boolean; endCursor: string };
        nodes: IssueNode[];
      };
    };
  };
}

/** The parts of a release such as v0.20.1, or undefined for another title. */
function versionOf(title: string): [number, number, number] | undefined {
  const match = /^v(\d+)\.(\d+)(?:\.(\d+))?$/.exec(title);
  if (!match) return undefined;
  return [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)];
}

/**
 * The task of a ready item and the key that orders it, or undefined when the
 * item is not ready. Keys compare place by place, and the lower key comes
 * first.
 */
function readyTask(node: IssueNode): { task: Task; key: number[] } | undefined {
  const labels = node.labels.nodes.map(({ name }) => name);
  const release = node.milestone?.title ?? '';
  const version = versionOf(release);
  const status = node.projectItems.nodes.find(
    ({ project }) =>
      project.number === PROJECT.number && project.owner.login === PROJECT.owner
  )?.fieldValueByName?.name;
  if (
    !version ||
    status !== 'Todo' ||
    labels.includes('mode:owner') ||
    labels.includes('decision') ||
    node.blockedBy.nodes.some(({ closed }) => !closed)
  ) {
    return undefined;
  }
  const valueOf = (kind: string) =>
    labels
      .find((label) => label.startsWith(`${kind}:`))
      ?.slice(kind.length + 1) ?? null;
  const priority =
    PRIORITIES.find((value) => labels.includes(`priority:${value}`)) ?? null;
  const rank = priority ?? 'P2';
  const roadmapId = /^R(\d+)-(\d+)\b/.exec(node.title);
  return {
    task: {
      issue: node.number,
      title: node.title,
      url: node.url,
      release,
      priority,
      size: valueOf('size'),
      mode: valueOf('mode'),
    },
    key: [
      TIER[rank],
      ...version,
      PRIORITIES.indexOf(rank),
      roadmapId ? Number(roadmapId[1]) : Infinity,
      roadmapId ? Number(roadmapId[2]) : Infinity,
      node.number,
    ],
  };
}

function compareKeys(a: number[], b: number[]): number {
  const place = a.findIndex((value, index) => value !== b[index]);
  return place === -1 ? 0 : a[place] - b[place];
}

/**
 * Reads every open issue through `api`, page by page, and returns the next
 * task, or null when no item is ready. Sends only GraphQL queries.
 */
export async function nextTask(api: Api): Promise<Task | null> {
  const ready: { task: Task; key: number[] }[] = [];
  let after: string | null = null;
  do {
    const reply = (await api(['graphql'], {
      query: OPEN_ISSUES,
      variables: { ...REPOSITORY, after },
    })) as OpenIssuesReply;
    const { nodes, pageInfo } = reply.data.repository.issues;
    for (const node of nodes) {
      const item = readyTask(node);
      if (item) ready.push(item);
    }
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);
  ready.sort((a, b) => compareKeys(a.key, b.key));
  return ready[0]?.task ?? null;
}

function render(task: Task | null): string {
  if (!task) return 'No item is ready.';
  const details = [
    `release ${task.release}`,
    `priority ${task.priority ?? 'none'}`,
    `size ${task.size ?? 'none'}`,
    `mode ${task.mode ?? 'none'}`,
  ];
  return [`#${task.issue} ${task.title}`, details.join(', '), task.url].join(
    '\n'
  );
}

const USAGE = 'Usage: pnpm queue:next [--json]';

const HELP = `${USAGE}

Prints the next task of the Project "Ergogen GUI 2027": the first open issue
whose milestone is a release, whose status is Todo, that has neither the label
mode:owner nor the label decision, and whose blockers are all closed. An item
with the priority P0 or P1 comes first, and an item with the priority P3 or
P4 comes only when no other item is ready. Then the lowest release, the
priority, the roadmap id in the title, and the issue number decide. The header
comment of scripts/queue/next.mts gives the whole rule.

The script only reads GitHub, with the login of the GitHub CLI, gh.

Options:
  --json  Print {"next": {...}}, or {"next": null} when no item is ready.
  --help  Print this text.

Exit status: 0 when the script read the queue, also when no item is ready,
2 when the arguments are wrong, 1 when a read fails.`;

/** Runs the command with `args` and returns its exit status. */
export async function main(
  args: string[],
  {
    api = ghApi,
    stdout = (text: string) => console.log(text),
    stderr = (text: string) => console.error(text),
  }: {
    api?: Api;
    stdout?: (text: string) => void;
    stderr?: (text: string) => void;
  } = {}
): Promise<number> {
  let json: boolean;
  try {
    const { values } = parseArgs({
      args,
      options: {
        json: { type: 'boolean', default: false },
        help: { type: 'boolean', default: false },
      },
    });
    if (values.help) {
      stdout(HELP);
      return 0;
    }
    json = values.json;
  } catch (error) {
    stderr(`${(error as Error).message}\n${USAGE}`);
    return 2;
  }
  let task: Task | null;
  try {
    task = await nextTask(api);
  } catch (error) {
    const { stderr: output } = error as { stderr?: string };
    stderr(output?.trim() || (error as Error).message);
    return 1;
  }
  stdout(json ? JSON.stringify({ next: task }, null, 2) : render(task));
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exitCode = await main(process.argv.slice(2));
}
