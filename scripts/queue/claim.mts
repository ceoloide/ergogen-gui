// Claims an issue of the queue for the login of the GitHub CLI, before any
// work on it starts:
//
//   pnpm queue:claim <issue>
//   pnpm queue:claim --help
//
// The queue is the Project "Ergogen GUI 2027", Project 3 of the user
// ceoloide. The script claims an open issue of ceoloide/ergogen-gui whose
// item in the queue has the status Todo. It makes two writes, in this order:
//
// 1. It adds the login of `gh` to the assignees of the issue and keeps the
//    other assignees.
// 2. It sets the status of the item to In progress.
//
// These are its only writes, and they change only the named issue and its
// item in the queue. The status is the claim, because `pnpm queue:next`
// prints only an item with the status Todo. The assignment comes first, so a
// run that fails between the two writes leaves the item Todo, and a second
// run finishes the claim.
//
// The script reads the issue and its item first and writes nothing when it
// refuses the issue: a closed issue, an issue outside the queue, or an item
// whose status is not Todo. For a number that is not an issue of the
// repository, `gh` fails to read the issue, and the script writes nothing.
//
// The GitHub API cannot set the status only while the status is still Todo.
// Two runs that read the item in the same second can both claim it.
//
// Exit status: 0 when the script claimed the issue, 3 when the status of the
// item is not Todo, 2 when the script refuses the issue for another reason or
// the arguments are wrong, 1 when a read or a write fails.
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { type Api, ghApi, PROJECT, REPOSITORY } from './github.mts';

/** The status of an item that a session can claim. */
const READY = 'Todo';
/** The status of a claimed item. */
const CLAIMED = 'In progress';

/** The issue that the script claimed. */
export interface Claim {
  issue: number;
  title: string;
  url: string;
  /** The login of `gh`, now an assignee of the issue. */
  assignee: string;
}

/** Thrown when the script refuses the issue, before any write. */
export class Refused extends Error {}

/** Refused because the status of the item is not Todo. */
export class NotTodo extends Refused {}

const READ = `query ($owner: String!, $name: String!, $number: Int!, $projectOwner: String!, $project: Int!) {
  viewer { id login }
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
      id
      number
      title
      url
      closed
      projectItems(first: 50) {
        nodes {
          id
          project { id }
          fieldValueByName(name: "Status") { ... on ProjectV2ItemFieldSingleSelectValue { name } }
        }
      }
    }
  }
  user(login: $projectOwner) {
    projectV2(number: $project) {
      id
      title
      field(name: "Status") { ... on ProjectV2SingleSelectField { id options { id name } } }
    }
  }
}`;

interface ReadReply {
  viewer: { id: string; login: string };
  repository: {
    issue: {
      id: string;
      number: number;
      title: string;
      url: string;
      closed: boolean;
      projectItems: {
        nodes: {
          id: string;
          project: { id: string };
          fieldValueByName: { name: string } | null;
        }[];
      };
    };
  };
  user: {
    projectV2: {
      id: string;
      title: string;
      field: { id: string; options: { id: string; name: string }[] };
    };
  };
}

const ASSIGN = `mutation ($issue: ID!, $viewer: ID!) {
  addAssigneesToAssignable(input: { assignableId: $issue, assigneeIds: [$viewer] }) {
    assignable { ... on Issue { assignees(first: 100) { nodes { login } } } }
  }
}`;

interface AssignReply {
  addAssigneesToAssignable: {
    assignable: { assignees: { nodes: { login: string }[] } };
  };
}

const SET_STATUS = `mutation ($project: ID!, $item: ID!, $field: ID!, $option: String!) {
  updateProjectV2ItemFieldValue(input: { projectId: $project, itemId: $item, fieldId: $field, value: { singleSelectOptionId: $option } }) { clientMutationId }
}`;

/**
 * Claims issue `number` through `api`: assigns the login of `gh` and sets the
 * status In progress. Throws Refused, before any write, when the issue cannot
 * be claimed.
 */
export async function claim(number: number, api: Api): Promise<Claim> {
  async function graphql<T>(
    query: string,
    variables: Record<string, unknown>
  ): Promise<T> {
    return ((await api(['graphql'], { query, variables })) as { data: T }).data;
  }

  const { viewer, repository, user } = await graphql<ReadReply>(READ, {
    ...REPOSITORY,
    number,
    projectOwner: PROJECT.owner,
    project: PROJECT.number,
  });
  const { issue } = repository;
  const project = user.projectV2;
  const item = issue.projectItems.nodes.find(
    (node) => node.project.id === project.id
  );
  if (issue.closed) throw new Refused(`#${number} is closed.`);
  if (!item) {
    throw new Refused(`#${number} is not in the Project "${project.title}".`);
  }
  const status = item.fieldValueByName?.name;
  if (status !== READY) {
    throw new NotTodo(
      `#${number} has the status ${status ?? 'none'}, not ${READY}.`
    );
  }
  const option = project.field.options.find(({ name }) => name === CLAIMED);
  if (!option) {
    throw new Refused(
      `The Project "${project.title}" has no status ${CLAIMED}.`
    );
  }

  const { assignable } = (
    await graphql<AssignReply>(ASSIGN, { issue: issue.id, viewer: viewer.id })
  ).addAssigneesToAssignable;
  if (!assignable.assignees.nodes.some(({ login }) => login === viewer.login)) {
    throw new Error(
      `GitHub did not assign #${number} to ${viewer.login}. The status is still ${READY}.`
    );
  }
  await graphql(SET_STATUS, {
    project: project.id,
    item: item.id,
    field: project.field.id,
    option: option.id,
  });
  return {
    issue: issue.number,
    title: issue.title,
    url: issue.url,
    assignee: viewer.login,
  };
}

const USAGE = 'Usage: pnpm queue:claim <issue>';

const HELP = `${USAGE}

Claims an issue of the Project "Ergogen GUI 2027" before any work on it
starts. The script claims an open issue whose item has the status Todo. It
adds the login of gh to the assignees of the issue, then sets the status of
the item to In progress, and changes nothing else. A run that fails between
the two writes leaves the item Todo, and a second run finishes the claim.

The script writes nothing when it refuses the issue: a closed issue, an issue
outside the Project, or an item whose status is not Todo. Two runs that read
the item in the same second can both claim it.

Options:
  --help  Print this text.

Exit status: 0 when the script claimed the issue, 3 when the status of the
item is not Todo, 2 when the script refuses the issue for another reason or
the arguments are wrong, 1 when a read or a write fails.`;

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
  let number: number;
  try {
    const { values, positionals } = parseArgs({
      args,
      options: { help: { type: 'boolean', default: false } },
      allowPositionals: true,
    });
    if (values.help) {
      stdout(HELP);
      return 0;
    }
    if (positionals.length !== 1 || !/^[1-9]\d*$/.test(positionals[0])) {
      throw new Error('Give one issue number, such as 280.');
    }
    number = Number(positionals[0]);
  } catch (error) {
    stderr(`${(error as Error).message}\n${USAGE}`);
    return 2;
  }
  let claimed: Claim;
  try {
    claimed = await claim(number, api);
  } catch (error) {
    if (error instanceof Refused) {
      stderr(error.message);
      return error instanceof NotTodo ? 3 : 2;
    }
    const { stderr: output } = error as { stderr?: string };
    stderr(output?.trim() || (error as Error).message);
    return 1;
  }
  stdout(
    [
      `Claimed #${claimed.issue} ${claimed.title}`,
      `Assigned to ${claimed.assignee}, status ${CLAIMED}.`,
      claimed.url,
    ].join('\n')
  );
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exitCode = await main(process.argv.slice(2));
}
