// The one boundary between the queue scripts and GitHub: `gh api`, with the
// login of the GitHub CLI. The tests replace it with a fake.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

export const REPOSITORY = { owner: 'ceoloide', name: 'ergogen-gui' };
export const REPOSITORY_NAME = `${REPOSITORY.owner}/${REPOSITORY.name}`;
/** The queue: the Project "Ergogen GUI 2027", Project 3 of the user ceoloide. */
export const PROJECT = { owner: 'ceoloide', number: 3 };

/**
 * Calls the GitHub API with the arguments of `gh api` and a JSON request
 * body, and returns the JSON reply.
 */
export type Api = (args: string[], body: unknown) => Promise<unknown>;

const execFileAsync = promisify(execFile);

/** Runs `gh api` with a JSON request body and returns the JSON reply. */
export async function ghApi(args: string[], body: unknown): Promise<unknown> {
  const call = execFileAsync('gh', ['api', ...args, '--input', '-'], {
    maxBuffer: 64 * 1024 * 1024,
  });
  call.child.stdin?.end(JSON.stringify(body));
  return JSON.parse((await call).stdout);
}
