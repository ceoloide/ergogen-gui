// @vitest-environment node
import { execFile, spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  referencedFiles,
  siteUrl,
  smokeSite,
} from '../scripts/ci/smoke-site.mts';

/**
 * Runs the deploy workflow's own shell steps (read from deploy.yaml, not
 * copied) against local Git repositories standing in for GitHub, then serves
 * the published gh-pages tree from a loopback server that answers like GitHub
 * Pages and runs the smoke check against it. Nothing here touches the
 * network, the user's Git configuration or a real repository.
 */

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const smokeScript = join(projectRoot, 'scripts/ci/smoke-site.mts');

interface Step {
  name?: string;
  shell?: string;
  run?: string;
  env?: Record<string, string>;
}
const workflow = yaml.load(
  readFileSync(join(projectRoot, '.github/workflows/deploy.yaml'), 'utf8')
) as { jobs: Record<string, { steps: Step[] }> };
const workflowStep = (job: string, name: string) => {
  const step = workflow.jobs[job].steps.find((s) => s.name === name);
  if (!step?.run) throw new Error(`deploy.yaml has no ${job} step ${name}`);
  return step as Step & { run: string; env: Record<string, string> };
};
const recordStep = workflowStep('build', 'Record release tree');
const publishStep = workflowStep('deploy', 'Publish validated site');
const rollbackStep = workflowStep(
  'rollback',
  'Roll back to an earlier release'
);

let workspace: string;
let origin: string;
let gitEnvironment: NodeJS.ProcessEnv;
let steps = 0;

const run = (command: string, args: string[], cwd = workspace) => {
  const result = spawnSync(command, args, {
    cwd,
    env: gitEnvironment,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')}: ${result.stderr}`);
  }
  return result.stdout.trim();
};
const git = (...args: string[]) => run('git', args);
const remoteGit = (...args: string[]) => git('--git-dir', origin, ...args);
const ghPages = () => {
  const result = spawnSync(
    'git',
    ['--git-dir', origin, 'rev-parse', '--verify', '-q', 'refs/heads/gh-pages'],
    { env: gitEnvironment, encoding: 'utf8' }
  );
  return result.status === 0 ? result.stdout.trim() : undefined;
};
const trailer = (commit: string, key: string) =>
  remoteGit(
    'show',
    '-s',
    `--format=%(trailers:key=${key},valueonly,separator=%x2C)`,
    commit
  );

/** Adds a commit to main in the stand-in for the GitHub repository. */
const pushToMain = (label: string) => {
  const parent = spawnSync(
    'git',
    ['--git-dir', origin, 'rev-parse', '--verify', '-q', 'refs/heads/main'],
    { env: gitEnvironment, encoding: 'utf8' }
  ).stdout.trim();
  const tree = remoteGit('mktree');
  const commit = run('git', [
    '--git-dir',
    origin,
    'commit-tree',
    tree,
    ...(parent ? ['-p', parent] : []),
    '-m',
    label,
  ]);
  remoteGit('update-ref', 'refs/heads/main', commit);
  return commit;
};

/** Runs one of the workflow's `run:` steps exactly as GitHub's bash does. */
const runStep = (step: Step & { run: string }, env: Record<string, string>) => {
  // Every variable the step declares must be supplied, and nothing else.
  expect(Object.keys(env).sort()).toEqual(Object.keys(step.env ?? {}).sort());
  expect(step.shell).toBe('bash');
  const temp = join(workspace, `step-${++steps}`);
  mkdirSync(temp);
  const script = join(temp, 'script.sh');
  const outputFile = join(temp, 'output');
  const summary = join(temp, 'summary');
  writeFileSync(script, step.run);
  writeFileSync(outputFile, '');
  writeFileSync(summary, '');
  const result = spawnSync(
    'bash',
    ['--noprofile', '--norc', '-eo', 'pipefail', script],
    {
      cwd: workspace,
      encoding: 'utf8',
      env: {
        ...gitEnvironment,
        ...env,
        RUNNER_TEMP: temp,
        GITHUB_OUTPUT: outputFile,
        GITHUB_STEP_SUMMARY: summary,
      },
    }
  );
  const outputs = Object.fromEntries(
    readFileSync(outputFile, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => [line.split('=')[0], line.slice(line.indexOf('=') + 1)])
  );
  return {
    status: result.status,
    log: result.stdout + result.stderr,
    outputs,
    summary: readFileSync(summary, 'utf8'),
  };
};

/** A small production-like site: index, SPA fallback, hashed asset, Pages files. */
const makeSite = (dir: string, buildId: string, base = '/') => {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, 'assets'), { recursive: true });
  const asset = `assets/index-${buildId.slice(0, 8)}.js`;
  const index = [
    '<!DOCTYPE html><html><head>',
    `<link rel="icon" href="${base}favicon.ico" />`,
    `<link rel="manifest" href="${base}manifest.json" />`,
    '<link rel="stylesheet" href="https://fonts.example/css">',
    `<script type="module" crossorigin src="${base}${asset}"></script>`,
    `<meta name="ergogen-build-id" content="${buildId}">`,
    '</head><body><div id="root"></div></body></html>',
  ].join('\n');
  writeFileSync(join(dir, 'index.html'), index);
  writeFileSync(join(dir, '404.html'), index);
  writeFileSync(join(dir, asset), `console.log(${JSON.stringify(buildId)});\n`);
  writeFileSync(join(dir, 'build-id.txt'), buildId);
  writeFileSync(join(dir, 'favicon.ico'), Buffer.from([0, 1, 2, 255]));
  writeFileSync(join(dir, 'manifest.json'), '{"name":"Ergogen"}\n');
  writeFileSync(join(dir, 'service-worker.js'), `// ${buildId}\n`);
  writeFileSync(join(dir, '.nojekyll'), '');
  return dir;
};

const listFiles = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((path) => statSync(join(dir, path)).isFile())
    .sort();

/** Writes a gh-pages commit's files to a folder, as GitHub Pages would serve them. */
const checkoutRelease = (commit: string, dir: string) => {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const archive = join(workspace, 'release.tar');
  remoteGit('archive', '--format=tar', '-o', archive, commit);
  run('tar', ['-xf', archive, '-C', dir]);
  return dir;
};

interface Build {
  commit: string;
  buildId: string;
  dist: string;
  tree: string;
}

/** The build job's "Record release tree" step on a freshly built site. */
const build = (commit: string, base = '/'): Build => {
  const buildId = `${commit}.${1000 + steps}.1`;
  const dist = makeSite(join(workspace, `dist-${commit}`), buildId, base);
  const result = runStep(recordStep, {
    SITE_DIR: relative(workspace, dist),
    BUILD_ID: buildId,
  });
  expect(result.status, result.log).toBe(0);
  expect(result.outputs['build-id']).toBe(buildId);
  expect(result.outputs.tree).toMatch(/^[0-9a-f]{40}$/);
  return { commit, buildId, dist, tree: result.outputs.tree };
};

/** The deploy job: the artifact handoff (a copy), then "Publish validated site". */
const deploy = (
  from: Build,
  tamper: (site: string) => void = () => {},
  overrides: Partial<Record<string, string>> = {}
) => {
  const site = join(workspace, 'site');
  rmSync(site, { recursive: true, force: true });
  cpSync(from.dist, site, { recursive: true });
  tamper(site);
  return runStep(publishStep, {
    SITE_DIR: 'site',
    RELEASE_TREE: from.tree,
    BUILD_ID: from.buildId,
    ARTIFACT_ID: '4242',
    ARTIFACT_DIGEST: 'ab'.repeat(32),
    SOURCE_COMMIT: from.commit,
    RUN_URL: 'https://github.test/o/r/actions/runs/1/attempts/1',
    REMOTE_URL: origin,
    PUBLISH_TOKEN: 'test-token',
    ...overrides,
  });
};

const rollback = (to: string) =>
  runStep(rollbackStep, {
    ROLLBACK_TO: to,
    REQUESTED_BY: 'maintainer',
    RUN_URL: 'https://github.test/o/r/actions/runs/2/attempts/1',
    REMOTE_URL: origin,
    PUBLISH_TOKEN: 'test-token',
  });

/** Runs the smoke check's command line in another process. */
const smokeCommand = (...args: string[]) =>
  new Promise<{ status: number | null; stdout: string; stderr: string }>(
    (done) => {
      execFile(
        process.execPath,
        [smokeScript, ...args],
        (error, stdout, stderr) =>
          done({ status: error ? (error.code as number) : 0, stdout, stderr })
      );
    }
  );

/** Serves files like GitHub Pages: below a base path, 404.html with HTTP 404. */
const servePages = async (root: () => string, base: string) => {
  const server: Server = createServer((request, response) => {
    const path = decodeURIComponent(
      new URL(request.url ?? '/', 'http://pages').pathname
    );
    const inside = path.startsWith(base) ? path.slice(base.length) : undefined;
    const candidates =
      inside === undefined ? [] : [inside, join(inside, 'index.html')];
    const file = candidates
      .map((candidate) => join(root(), candidate))
      .find(
        (candidate) => existsSync(candidate) && statSync(candidate).isFile()
      );
    if (file) {
      response.writeHead(200).end(readFileSync(file));
    } else if (existsSync(join(root(), '404.html'))) {
      response.writeHead(404).end(readFileSync(join(root(), '404.html')));
    } else {
      response.writeHead(404).end('Not Found');
    }
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no port');
  return {
    url: `http://127.0.0.1:${address.port}${base}`,
    close: () =>
      new Promise<void>((done) => {
        server.close(() => done());
        server.closeAllConnections();
      }),
  };
};

beforeEach(() => {
  workspace = mkdtempSync(join(tmpdir(), 'ergogen-release-'));
  const home = join(workspace, 'home');
  mkdirSync(home);
  gitEnvironment = {
    PATH: process.env.PATH,
    HOME: home,
    LANG: 'C',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: join(home, '.gitconfig'),
    GIT_AUTHOR_NAME: 'Test',
    GIT_AUTHOR_EMAIL: 'test@example.invalid',
    GIT_COMMITTER_NAME: 'Test',
    GIT_COMMITTER_EMAIL: 'test@example.invalid',
  };
  origin = join(workspace, 'origin.git');
  git('init', '-q', '--bare', '--initial-branch=main', origin);
  steps = 0;
});
afterEach(() => rmSync(workspace, { recursive: true, force: true }));

describe('release publication (deploy.yaml)', () => {
  it('publishes the validated tree of the head of main, byte for byte, with its provenance', () => {
    // Arrange
    const head = pushToMain('first');
    const validated = build(head);

    // Act
    const result = deploy(validated);

    // Assert
    expect(result.status, result.log).toBe(0);
    const release = ghPages()!;
    expect(result.outputs).toEqual({
      published: 'true',
      commit: release,
      'build-id': validated.buildId,
    });
    expect(remoteGit('rev-parse', `${release}^{tree}`)).toBe(validated.tree);
    expect(trailer(release, 'Source-Commit')).toBe(head);
    expect(trailer(release, 'Build-Id')).toBe(validated.buildId);
    expect(trailer(release, 'Artifact-Id')).toBe('4242');
    expect(trailer(release, 'Artifact-Digest')).toBe(
      `sha256:${'ab'.repeat(32)}`
    );
    expect(trailer(release, 'Workflow-Run')).toMatch(/\/actions\/runs\/1\//);
    // The published bytes are the validated artifact's, including .nojekyll.
    const published = checkoutRelease(release, join(workspace, 'served'));
    expect(listFiles(published)).toEqual(listFiles(validated.dist));
    for (const file of listFiles(validated.dist)) {
      expect(readFileSync(join(published, file))).toEqual(
        readFileSync(join(validated.dist, file))
      );
    }
    expect(listFiles(published)).toContain('.nojekyll');
  });

  it('keeps every release in gh-pages history so it can be restored', () => {
    // Arrange
    const first = build(pushToMain('first'));
    expect(deploy(first).status).toBe(0);
    const firstRelease = ghPages()!;

    // Act
    const second = build(pushToMain('second'));
    const result = deploy(second);

    // Assert
    expect(result.status, result.log).toBe(0);
    expect(remoteGit('rev-parse', `${ghPages()}^`)).toBe(firstRelease);
  });

  it('builds on the existing gh-pages history without forcing it', () => {
    // Arrange: a gh-pages commit from before this workflow (no trailers)
    const legacy = remoteGit(
      'commit-tree',
      remoteGit('mktree'),
      '-m',
      'legacy'
    );
    remoteGit('update-ref', 'refs/heads/gh-pages', legacy);

    // Act
    const result = deploy(build(pushToMain('first')));

    // Assert
    expect(result.status, result.log).toBe(0);
    expect(remoteGit('rev-parse', `${ghPages()}^`)).toBe(legacy);
  });

  it('does not let an obsolete run publish over the newer accepted release', () => {
    // Arrange: A is built, then main moves to B and B is released.
    const older = build(pushToMain('A'));
    const newer = build(pushToMain('B'));
    expect(deploy(newer).status).toBe(0);
    const accepted = ghPages();

    // Act: A's run (queued late, or re-run) reaches its publish step.
    const result = deploy(older);

    // Assert
    expect(result.status, result.log).toBe(0);
    expect(result.outputs).toEqual({ published: 'false' });
    expect(result.log).toContain('Not published: main is at');
    expect(result.summary).toContain('no longer the head of main');
    expect(ghPages()).toBe(accepted);
  });

  it('does not publish a commit that main has moved past, even before the newer release', () => {
    // Arrange
    const older = build(pushToMain('A'));
    pushToMain('B');

    // Act
    const result = deploy(older);

    // Assert
    expect(result.outputs).toEqual({ published: 'false' });
    expect(ghPages()).toBeUndefined();
  });

  it.each([
    [
      'a changed file',
      (site: string) => writeFileSync(join(site, 'index.html'), 'tampered'),
    ],
    ['a missing file', (site: string) => rmSync(join(site, 'manifest.json'))],
    ['an extra file', (site: string) => writeFileSync(join(site, 'x.js'), '')],
    [
      'no files at all',
      (site: string) => rmSync(site, { recursive: true, force: true }),
    ],
  ])('blocks publication of an artifact with %s', (_, tamper) => {
    // Arrange
    const validated = build(pushToMain('first'));
    expect(deploy(validated).status).toBe(0);
    const accepted = ghPages();

    // Act
    const result = deploy(validated, tamper);

    // Assert
    expect(result.status).toBe(1);
    expect(result.log).toContain('Nothing was published.');
    expect(result.outputs).toEqual({});
    expect(ghPages()).toBe(accepted);
  });

  it.each([
    ['no release tree from the build job', { RELEASE_TREE: '' }],
    ['the release tree of another build', { RELEASE_TREE: 'f'.repeat(40) }],
    ['another build ID', { BUILD_ID: 'other.1.1' }],
    ['no build ID', { BUILD_ID: '' }],
  ])('blocks publication with %s', (_, overrides) => {
    // Arrange
    const validated = build(pushToMain('first'));

    // Act
    const result = deploy(validated, () => {}, overrides);

    // Assert
    expect(result.status).toBe(1);
    expect(result.log).toContain('Nothing was published.');
    expect(ghPages()).toBeUndefined();
  });

  it('refuses to overwrite gh-pages if it changes while the release is prepared', () => {
    // Arrange: another writer moves gh-pages after the step read it, just
    // before the remote applies the push (outside Git's hook quarantine).
    const validated = build(pushToMain('first'));
    const intruder = remoteGit(
      'commit-tree',
      remoteGit('mktree'),
      '-m',
      'other'
    );
    writeFileSync(
      join(origin, 'hooks', 'pre-receive'),
      `#!/bin/sh\nenv -u GIT_QUARANTINE_PATH git update-ref refs/heads/gh-pages ${intruder}\n`,
      { mode: 0o755 }
    );

    // Act
    const result = deploy(validated);

    // Assert
    expect(result.status).toBe(1);
    expect(result.log).toContain(
      'gh-pages changed while this release was prepared'
    );
    expect(ghPages()).toBe(intruder);
  });

  it('rejects a site with symbolic links before recording it', () => {
    // Arrange
    const dist = makeSite(join(workspace, 'dist'), 'id');
    run('ln', ['-s', '/etc/passwd', join(dist, 'link')]);

    // Act
    const result = runStep(recordStep, { SITE_DIR: 'dist', BUILD_ID: 'id' });

    // Assert
    expect(result.status).toBe(1);
    expect(result.log).toContain('only regular files and folders');
  });

  it('rejects a build that does not carry its build ID', () => {
    // Arrange
    makeSite(join(workspace, 'dist'), 'other');

    // Act
    const result = runStep(recordStep, { SITE_DIR: 'dist', BUILD_ID: 'id' });

    // Assert
    expect(result.status).toBe(1);
    expect(result.log).toContain('does not name build id');
  });
});

describe('rollback (deploy.yaml)', () => {
  const twoReleases = () => {
    const first = build(pushToMain('A'));
    expect(deploy(first).status).toBe(0);
    const firstRelease = ghPages()!;
    const second = build(pushToMain('B'));
    expect(deploy(second).status).toBe(0);
    return { first, firstRelease, secondRelease: ghPages()! };
  };

  it('serves an earlier release again, recording who asked and from which run', () => {
    // Arrange
    const { first, firstRelease, secondRelease } = twoReleases();

    // Act
    const result = rollback(firstRelease);

    // Assert
    expect(result.status, result.log).toBe(0);
    const restored = ghPages()!;
    expect(result.outputs).toEqual({
      published: 'true',
      commit: restored,
      'build-id': first.buildId,
    });
    expect(remoteGit('rev-parse', `${restored}^`)).toBe(secondRelease);
    expect(remoteGit('rev-parse', `${restored}^{tree}`)).toBe(first.tree);
    expect(trailer(restored, 'Rollback-To')).toBe(firstRelease);
    expect(trailer(restored, 'Source-Commit')).toBe(first.commit);
    expect(trailer(restored, 'Requested-By')).toBe('maintainer');
    expect(result.summary).toContain(`Rolled back to ${firstRelease}`);
  });

  it.each([
    ['a short SHA', () => 'abc1234'],
    ['a commit of main', () => remoteGit('rev-parse', 'refs/heads/main')],
    ['an unknown commit', () => '0'.repeat(40)],
  ])('refuses to roll back to %s', (_, target) => {
    // Arrange
    const { secondRelease } = twoReleases();

    // Act
    const result = rollback(target());

    // Assert
    expect(result.status).toBe(1);
    expect(result.log).toContain('Nothing was published.');
    expect(ghPages()).toBe(secondRelease);
  });

  it('refuses a gh-pages commit that this workflow did not publish', () => {
    // Arrange
    const legacy = remoteGit(
      'commit-tree',
      remoteGit('mktree'),
      '-m',
      'legacy'
    );
    remoteGit('update-ref', 'refs/heads/gh-pages', legacy);
    expect(deploy(build(pushToMain('A'))).status).toBe(0);
    const release = ghPages();

    // Act
    const result = rollback(legacy);

    // Assert
    expect(result.status).toBe(1);
    expect(result.log).toContain('not a release published by this workflow');
    expect(ghPages()).toBe(release);
  });

  it('does nothing when the release is already served', () => {
    // Arrange
    const { secondRelease } = twoReleases();

    // Act
    const result = rollback(secondRelease);

    // Assert
    expect(result.status).toBe(0);
    expect(result.outputs).toEqual({ published: 'false' });
    expect(ghPages()).toBe(secondRelease);
  });

  it('lets the next release of main replace a rollback', () => {
    // Arrange
    const { firstRelease } = twoReleases();
    expect(rollback(firstRelease).status).toBe(0);
    const next = build(pushToMain('C'));

    // Act
    const result = deploy(next);

    // Assert
    expect(result.status).toBe(0);
    expect(remoteGit('rev-parse', `${ghPages()}^{tree}`)).toBe(next.tree);
  });
});

describe('post-publication smoke check', () => {
  it.each(['/', '/ergogen-gui/'])(
    'passes for each release and rollback served at %s, and fails for a stale one',
    async (base) => {
      // Arrange: what GitHub Pages serves is whatever gh-pages holds.
      const served = join(workspace, 'served');
      const pages = await servePages(() => served, base);
      const smoke = (release: string, buildId: string, timeoutMs = 0) =>
        smokeSite({
          site: checkoutRelease(release, join(workspace, 'published')),
          url: pages.url,
          buildId,
          timeoutMs,
          intervalMs: 10,
        });
      const publish = () => checkoutRelease(ghPages()!, served);
      try {
        const first = build(pushToMain('A'), base);
        expect(deploy(first).status).toBe(0);
        const firstRelease = ghPages()!;
        publish();
        expect(await smoke(firstRelease, first.buildId)).toEqual([]);

        const second = build(pushToMain('B'), base);
        expect(deploy(second).status).toBe(0);
        const secondRelease = ghPages()!;
        // Act / Assert: not served yet, so the check keeps failing.
        expect(await smoke(secondRelease, second.buildId, 50)).toEqual([
          expect.stringContaining(`not build ${second.buildId}`),
        ]);
        publish();
        expect(await smoke(secondRelease, second.buildId)).toEqual([]);

        // Act / Assert: the rollback serves the first release's bytes again.
        const restored = rollback(firstRelease);
        expect(restored.status).toBe(0);
        publish();
        expect(
          await smoke(restored.outputs.commit, restored.outputs['build-id'])
        ).toEqual([]);
      } finally {
        await pages.close();
      }
    }
  );

  it('fails when the host has no SPA fallback for client routes', async () => {
    // Arrange
    const site = makeSite(join(workspace, 'published'), 'id');
    const served = join(workspace, 'served');
    cpSync(site, served, { recursive: true });
    rmSync(join(served, '404.html'));
    const pages = await servePages(() => served, '/');

    try {
      // Act
      const problems = await smokeSite({
        site,
        url: pages.url,
        buildId: 'id',
        timeoutMs: 0,
        intervalMs: 10,
      });

      // Assert
      expect(problems).toEqual([
        `${pages.url}new?release=id does not serve the release's 404.html`,
        `${pages.url}404.html?release=id returned HTTP 404`,
      ]);
    } finally {
      await pages.close();
    }
  });

  it('fails when a served file differs from the release', async () => {
    // Arrange
    const site = makeSite(join(workspace, 'published'), 'id');
    const served = join(workspace, 'served');
    cpSync(site, served, { recursive: true });
    writeFileSync(join(served, 'assets', 'index-id.js'), 'stale');
    const pages = await servePages(() => served, '/');

    try {
      // Act
      const problems = await smokeSite({
        site,
        url: pages.url,
        buildId: 'id',
        timeoutMs: 0,
        intervalMs: 10,
      });

      // Assert
      expect(problems).toEqual([
        `${pages.url}assets/index-id.js?release=id does not serve the release's assets/index-id.js`,
      ]);
    } finally {
      await pages.close();
    }
  });

  it('fails before any request when the release is not the expected build', async () => {
    // Arrange
    const site = makeSite(join(workspace, 'published'), 'other');

    // Act
    const problems = await smokeSite({
      site,
      url: 'http://127.0.0.1:9/',
      buildId: 'id',
      timeoutMs: 0,
      intervalMs: 10,
    });

    // Assert
    expect(problems).toEqual([
      'the release is build other, not id',
      "the release's index.html does not name build id",
    ]);
  });

  it('runs from the command line the smoke job uses', async () => {
    // Arrange
    const site = makeSite(join(workspace, 'published'), 'id', '/sub/');
    const pages = await servePages(() => site, '/sub/');

    try {
      // Act: asynchronously, so this process can keep serving the site.
      const pass = await smokeCommand(
        ...['--site', site, '--build-id', 'id', '--url', pages.url]
      );
      const fail = await smokeCommand(
        ...['--site', site, '--build-id', 'other', '--url', pages.url],
        ...['--timeout-seconds', '0']
      );

      // Assert
      expect(pass.status, pass.stderr).toBe(0);
      expect(pass.stdout).toContain(`${pages.url} serves build id.`);
      expect(fail.status).toBe(1);
      expect(fail.stderr).toContain(
        '::error::the release is build id, not other'
      );
    } finally {
      await pages.close();
    }
  });

  it('derives the GitHub Pages address from the custom domain or the owner', () => {
    // Assert
    expect(siteUrl({ cname: 'ergogen.example\n', owner: 'Someone' })).toBe(
      'https://ergogen.example/'
    );
    expect(siteUrl({ owner: 'Someone', base: '/ergogen-gui/' })).toBe(
      'https://someone.github.io/ergogen-gui/'
    );
    expect(() => siteUrl({ owner: 'o', base: 'ergogen-gui' })).toThrow(
      'base path'
    );
  });

  it('finds the local files index.html loads and flags those outside the base', () => {
    // Arrange
    const html = [
      '<link rel="icon" href="/app/favicon.ico" />',
      '<link rel="preconnect" href="https://fonts.example">',
      '<script src="/app/assets/index-1.js?v=1"></script>',
      '<script src="//cdn.example/x.js"></script>',
      '<script src="/assets/elsewhere.js"></script>',
    ].join('\n');

    // Act
    const result = referencedFiles(html, '/app/');

    // Assert
    expect(result).toEqual({
      files: ['assets/index-1.js', 'favicon.ico'],
      problems: ['index.html references /assets/elsewhere.js outside /app/'],
    });
  });
});
