// Selects and checks the Ergogen engine a deployment builds with. The deploy
// workflow's build job runs it before and after installing dependencies:
//
//   CONFIGURED_ERGOGEN_VERSION=<value> node scripts/ci/deploy-engine.mts resolve
//   ERGOGEN_VERSION=<resolved> node scripts/ci/deploy-engine.mts verify
//
// `resolve` reads the repository variable. Empty means the canonical engine:
// it prints nothing, and the workflow installs from the frozen lockfile.
// Otherwise the value must be `github:<owner>/<repo>#<ref>`, where <ref> is a
// branch, a tag or a full 40-character commit SHA. A branch or tag is looked
// up now with `git ls-remote`, so the build never reuses a commit that an
// older lockfile recorded for the same name. It prints the specifier to
// install, `github:<owner>/<repo>#<commit>`, and writes it as the `specifier`
// step output.
//
// `verify` reads what pnpm installed and fails unless it is the expected
// specifier and commit: ERGOGEN_VERSION when set, else the package.json
// specifier. Both commands record the engine in the step summary. Only
// Node.js built-ins are used, because `resolve` runs before installation.
import { execFileSync, spawnSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const COMMIT = /^[0-9a-f]{40}$/;
const OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
const REPOSITORY = /^[A-Za-z0-9._-]{1,100}$/;

export interface EngineRequest {
  owner: string;
  repository: string;
  ref: string;
}

/** Parses `github:<owner>/<repo>#<ref>`, rejecting anything else. */
export const parseEngineRequest = (value: string): EngineRequest => {
  const match = /^github:([^/#]+)\/([^/#]+)#(.+)$/s.exec(value);
  const [, owner = '', repository = '', ref = ''] = match ?? [];
  const valid =
    OWNER.test(owner) &&
    REPOSITORY.test(repository) &&
    !/^\.+$/.test(repository) &&
    ref !== '' &&
    !ref.includes('\0') &&
    spawnSync('git', ['check-ref-format', `refs/heads/${ref}`], {
      stdio: 'ignore',
    }).status === 0;
  if (!valid) {
    throw new Error(
      `ERGOGEN_VERSION must be github:<owner>/<repo>#<branch, tag or full commit SHA>, got ${JSON.stringify(value)}.`
    );
  }
  return { owner, repository, ref };
};

/**
 * Picks the commit that `git ls-remote` reports for a branch or tag named
 * `ref`. Annotated tags resolve to the commit they point at.
 */
export const pickCommit = (lsRemote: string, ref: string) => {
  const refs = new Map<string, string>();
  for (const line of lsRemote.split('\n')) {
    const [sha, name] = line.split('\t');
    if (sha && name) refs.set(name, sha);
  }
  const branch = refs.get(`refs/heads/${ref}`);
  const tag = refs.get(`refs/tags/${ref}^{}`) ?? refs.get(`refs/tags/${ref}`);
  if (branch && tag) {
    throw new Error(
      `'${ref}' names both a branch and a tag; use the full commit SHA instead.`
    );
  }
  const commit = branch ?? tag;
  if (!commit || !COMMIT.test(commit)) {
    throw new Error(`No branch or tag named '${ref}' was found.`);
  }
  return { commit, kind: branch ? 'branch' : 'tag' };
};

/** Lists the branch and tag named `ref` in a remote repository. */
export const lsRemote = (url: string, ref: string) =>
  execFileSync(
    'git',
    [
      'ls-remote',
      url,
      `refs/heads/${ref}`,
      `refs/tags/${ref}`,
      `refs/tags/${ref}^{}`,
    ],
    {
      encoding: 'utf8',
      timeout: 60_000,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    }
  );

/** Returns the specifier to install, pinned to a commit, or '' for canonical. */
export const resolveEngine = (
  configured: string,
  readRefs: (url: string, ref: string) => string = lsRemote
) => {
  const value = configured.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, '');
  if (!value) {
    return {
      specifier: '',
      summary:
        'Engine: canonical package.json specifier from the frozen lockfile (ERGOGEN_VERSION is not set).',
    };
  }
  const { owner, repository, ref } = parseEngineRequest(value);
  const source = `github:${owner}/${repository}`;
  if (COMMIT.test(ref.toLowerCase())) {
    return {
      specifier: `${source}#${ref.toLowerCase()}`,
      summary: `Engine: configured \`${value}\` (commit).`,
    };
  }
  const { commit, kind } = pickCommit(
    readRefs(`https://github.com/${owner}/${repository}.git`, ref),
    ref
  );
  return {
    specifier: `${source}#${commit}`,
    summary: `Engine: configured ${kind} resolved to \`${source}#${commit}\`.`,
  };
};

/** Reads the root importer's ergogen entry from a pnpm lockfile. */
export const readInstalledEngine = (lockfile: string) => {
  const match = /^ {6}ergogen:\n {8}specifier: (.+)\n {8}version: (.+)$/m.exec(
    lockfile
  );
  if (!match) throw new Error('The lockfile has no ergogen dependency.');
  const unquote = (text: string) => text.replace(/^(['"])(.*)\1$/, '$2');
  const specifier = unquote(match[1]);
  const version = unquote(match[2]);
  const tarball =
    /^https:\/\/codeload\.github\.com\/([^/]+)\/([^/]+)\/tar\.gz\/([0-9a-f]{40})$/.exec(
      version
    );
  return {
    specifier,
    version,
    github: tarball && {
      source: `${tarball[1]}/${tarball[2]}`,
      commit: tarball[3],
    },
  };
};

/** Fails unless the installed engine is `expected`, pinned to its commit. */
export const verifyEngine = (
  lockfile: string,
  expected: string,
  packageVersion: string
) => {
  const installed = readInstalledEngine(lockfile);
  if (installed.specifier !== expected) {
    throw new Error(
      `Installed ergogen '${installed.specifier}', expected '${expected}'.`
    );
  }
  const { github } = installed;
  const request = /^github:([^/#]+\/[^/#]+)#([0-9a-f]{40})$/.exec(expected);
  if (!github) {
    if (request) {
      throw new Error(
        `ergogen was not installed from a GitHub commit (version '${installed.version}').`
      );
    }
    return `Installed Ergogen ${packageVersion} (specifier \`${expected}\`).`;
  }
  const { source, commit } = github;
  if (
    request &&
    (request[1].toLowerCase() !== source.toLowerCase() || request[2] !== commit)
  ) {
    throw new Error(
      `Installed ergogen from ${source} at ${commit}, expected ${request[1]} at ${request[2]}.`
    );
  }
  return `Installed Ergogen ${packageVersion} from \`github:${source}\` at commit \`${commit}\` (specifier \`${expected}\`).`;
};

const report = (summary: string) => {
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
  }
};

const main = (command: string | undefined) => {
  if (command === 'resolve') {
    const { specifier, summary } = resolveEngine(
      process.env.CONFIGURED_ERGOGEN_VERSION ?? ''
    );
    report(summary);
    if (process.env.GITHUB_OUTPUT) {
      appendFileSync(process.env.GITHUB_OUTPUT, `specifier=${specifier}\n`);
    }
    if (specifier && process.env.GITHUB_ENV) {
      appendFileSync(
        process.env.GITHUB_ENV,
        `VITE_ERGOGEN_VERSION=${specifier}\n`
      );
    }
    return;
  }
  if (command === 'verify') {
    const root = process.cwd();
    const manifest = JSON.parse(
      readFileSync(join(root, 'package.json'), 'utf8')
    ) as { dependencies: Record<string, string> };
    const installedPackage = JSON.parse(
      readFileSync(join(root, 'node_modules/ergogen/package.json'), 'utf8')
    ) as { version: string };
    report(
      verifyEngine(
        readFileSync(join(root, 'node_modules/.pnpm/lock.yaml'), 'utf8'),
        process.env.ERGOGEN_VERSION || manifest.dependencies.ergogen,
        installedPackage.version
      )
    );
    return;
  }
  throw new Error('Usage: node scripts/ci/deploy-engine.mts resolve|verify');
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  try {
    main(process.argv[2]);
  } catch (error) {
    // Escaped as GitHub requires, so a value cannot start another command.
    const message = (error as Error).message
      .replace(/%/g, '%25')
      .replace(/\r/g, '%0D')
      .replace(/\n/g, '%0A');
    console.error(`::error::${message}`);
    process.exit(1);
  }
}
