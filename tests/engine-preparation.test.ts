import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

/**
 * These tests exercise the real engine preparation scripts against small
 * fixture projects. They never touch the network, the user's Git
 * configuration or the shared pnpm store: footprint libraries come from local
 * Git repositories and HOME/GIT_CONFIG_GLOBAL point into a temporary folder.
 */

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const patchScript = join(projectRoot, 'patch', 'patch_ergogen.sh');
const footprintsIndex = join(projectRoot, 'patch', 'footprints_index.js');
const engineRelativePath = join('node_modules', '.ergogen-engine');

const SHA_PATTERN = /^[0-9a-f]{40}$/;
const INSTALLED_SPECIFIER = 'github:ceoloide/ergogen#v9.9.9';

const indexSource = readFileSync(footprintsIndex, 'utf8');
const requiredModules = (prefix: string) =>
  Array.from(
    indexSource.matchAll(
      new RegExp(`require\\('\\./${prefix}/([^']+)'\\)`, 'g')
    )
  ).map((match) => match[1].replace(/\.js$/, '') + '.js');
const builtInFootprints = Array.from(
  indexSource.matchAll(/require\('\.\/([\w-]+)'\)/g)
).map((match) => match[1]);

const footprintStub = (name: string) =>
  `module.exports = { params: {}, body: () => '${name}' };\n`;

let workspace: string;
let gitEnvironment: NodeJS.ProcessEnv;

const git = (cwd: string, ...args: string[]) => {
  const result = spawnSync('git', args, {
    cwd,
    env: gitEnvironment,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr}`);
  }
  return result.stdout.trim();
};

/** Creates a local Git repository with one commit and returns its SHA. */
const createFootprintRepository = (name: string, files: string[]) => {
  const repository = join(workspace, 'repositories', name);
  mkdirSync(repository, { recursive: true });
  git(repository, 'init', '-q');
  for (const file of files) {
    writeFileSync(join(repository, file), footprintStub(file));
  }
  git(repository, 'add', '.');
  git(
    repository,
    '-c',
    'user.name=Fixture',
    '-c',
    'user.email=fixture@example.invalid',
    'commit',
    '-q',
    '-m',
    'fixture'
  );
  return { url: repository, commit: git(repository, 'rev-parse', 'HEAD') };
};

let ceoloide: { url: string; commit: string };
let infusedKim: { url: string; commit: string };

interface Fixture {
  root: string;
  home: string;
  /** Simulated shared pnpm content-addressable store. */
  store: string;
  /** Simulated pnpm virtual store directory of the installed package. */
  installedPackage: string;
  engine: string;
}

/**
 * Builds a project whose node_modules mirrors pnpm's layout: the installed
 * package is a symlink into a virtual store folder whose files are hard links
 * into a shared store, and whose dependencies are siblings of the package.
 */
const createFixture = (): Fixture => {
  const root = mkdtempSync(join(workspace, 'project-'));
  const home = join(root, 'home');
  const store = join(root, 'shared-store');
  const virtualStore = join(
    root,
    'node_modules',
    '.pnpm',
    'ergogen@9.9.9',
    'node_modules'
  );
  const installedPackage = join(virtualStore, 'ergogen');
  mkdirSync(home);
  mkdirSync(store);
  mkdirSync(join(installedPackage, 'src', 'footprints'), { recursive: true });
  mkdirSync(join(virtualStore, 'fixture-dependency'), { recursive: true });

  const storeFile = (name: string, content: string, target: string) => {
    writeFileSync(join(store, name), content);
    linkSync(join(store, name), target);
  };
  storeFile(
    'package.json',
    JSON.stringify({
      name: 'ergogen',
      version: '9.9.9',
      main: './src/ergogen.js',
    }),
    join(installedPackage, 'package.json')
  );
  storeFile(
    'ergogen.js',
    [
      "const version = require('../package.json').version",
      "const dependency = require('fixture-dependency')",
      "const footprints = require('./footprints')",
      'module.exports = { version, dependency, footprints, process: async () => ({}) }',
      '',
    ].join('\n'),
    join(installedPackage, 'src', 'ergogen.js')
  );
  storeFile(
    'io.js',
    "const package_json = require('../package.json')\nmodule.exports = { package_json }\n",
    join(installedPackage, 'src', 'io.js')
  );
  storeFile(
    'footprints-index.js',
    "module.exports = { mx: require('./mx') }\n",
    join(installedPackage, 'src', 'footprints', 'index.js')
  );
  for (const name of builtInFootprints) {
    writeFileSync(
      join(installedPackage, 'src', 'footprints', `${name}.js`),
      footprintStub(name)
    );
  }
  writeFileSync(
    join(virtualStore, 'fixture-dependency', 'index.js'),
    "module.exports = 'resolved from the virtual store';\n"
  );
  symlinkSync(installedPackage, join(root, 'node_modules', 'ergogen'));
  writeFileSync(
    join(root, 'node_modules', '.pnpm', 'lock.yaml'),
    [
      "lockfileVersion: '9.0'",
      '',
      'importers:',
      '',
      '  .:',
      '    dependencies:',
      '      ergogen:',
      `        specifier: ${INSTALLED_SPECIFIER}`,
      '        version: 9.9.9',
      '',
    ].join('\n')
  );

  return {
    root,
    home,
    store,
    installedPackage,
    engine: join(root, engineRelativePath),
  };
};

const runPatchScript = (
  fixture: Fixture,
  overrides: NodeJS.ProcessEnv = {}
) => {
  const environment: NodeJS.ProcessEnv = {
    PATH: process.env.PATH,
    HOME: fixture.home,
    GIT_CONFIG_GLOBAL: join(fixture.home, '.gitconfig'),
    GIT_CONFIG_NOSYSTEM: '1',
    CEOLOIDE_FOOTPRINTS_URL: ceoloide.url,
    CEOLOIDE_FOOTPRINTS_COMMIT: ceoloide.commit,
    INFUSED_KIM_FOOTPRINTS_URL: infusedKim.url,
    INFUSED_KIM_FOOTPRINTS_COMMIT: infusedKim.commit,
    ...overrides,
  };
  for (const [key, value] of Object.entries(environment)) {
    if (value === undefined) delete environment[key];
  }
  return spawnSync('sh', [patchScript], {
    cwd: fixture.root,
    env: environment,
    encoding: 'utf8',
  });
};

/** Maps every file below a folder to its contents. */
const snapshot = (folder: string): Record<string, string> => {
  const files: Record<string, string> = {};
  const visit = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isSymbolicLink()) files[path.slice(folder.length)] = 'symlink';
      else if (entry.isDirectory()) visit(path);
      else files[path.slice(folder.length)] = readFileSync(path, 'utf8');
    }
  };
  visit(folder);
  return files;
};

beforeAll(() => {
  workspace = mkdtempSync(join(tmpdir(), 'ergogen-engine-test-'));
  gitEnvironment = {
    PATH: process.env.PATH,
    HOME: workspace,
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: join(workspace, 'fixture.gitconfig'),
  };
  ceoloide = createFootprintRepository('ceoloide', requiredModules('ceoloide'));
  infusedKim = createFootprintRepository(
    'infused-kim',
    requiredModules('infused-kim')
  );
});

afterAll(() => {
  rmSync(workspace, { recursive: true, force: true });
});

describe('patch_ergogen.sh policy', () => {
  const script = readFileSync(patchScript, 'utf8');

  it('pins every footprint library to a full commit SHA', () => {
    // Act
    const pins = Array.from(
      script.matchAll(
        /^(\w+)_FOOTPRINTS_COMMIT=\$\{\1_FOOTPRINTS_COMMIT:-(\w+)\}$/gm
      )
    ).map((match) => [match[1], match[2]]);

    // Assert
    expect(Object.fromEntries(pins)).toEqual({
      CEOLOIDE: expect.stringMatching(SHA_PATTERN),
      INFUSED_KIM: expect.stringMatching(SHA_PATTERN),
    });
  });

  it('never installs, builds or reconfigures Git globally', () => {
    // Arrange: ignore comments and quoted text such as help messages.
    const commands = script
      .replace(/^\s*#.*$/gm, '')
      .replace(/'[^']*'/g, "''")
      .replace(/"[^"]*"/g, '""');

    // Assert
    expect(commands).not.toMatch(/\bgit\s+config\b/);
    expect(commands).not.toMatch(/\b(pnpm|npm|yarn|rollup)\b/);
  });
});

describe('patch_ergogen.sh engine preparation', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  it('assembles a checkout-owned engine with the pinned footprint libraries', () => {
    // Act
    const result = runPatchScript(fixture);

    // Assert
    expect(result.status, result.stderr).toBe(0);
    expect(
      readFileSync(
        join(fixture.engine, 'src', 'footprints', 'index.js'),
        'utf8'
      )
    ).toBe(indexSource);
    const engine = createRequire(import.meta.url)(fixture.engine);
    expect(engine.dependency).toBe('resolved from the virtual store');
    expect(Object.keys(engine.footprints)).toEqual(
      expect.arrayContaining(['mx', 'ceoloide/switch_mx', 'infused-kim/choc'])
    );
    expect(engine.footprints['infused-kim/diode']).toBeDefined();
    expect(engine.footprints['infused-kimo/isde']).toBeUndefined();
    expect(
      existsSync(join(fixture.engine, 'src', 'footprints', 'ceoloide', '.git'))
    ).toBe(false);
  });

  it('inlines the package version so bundlers need not resolve package.json', () => {
    // Act
    const result = runPatchScript(fixture);

    // Assert
    expect(result.status, result.stderr).toBe(0);
    expect(
      readFileSync(join(fixture.engine, 'src', 'ergogen.js'), 'utf8')
    ).toContain('const version = "9.9.9"');
    expect(
      readFileSync(join(fixture.engine, 'src', 'io.js'), 'utf8')
    ).toContain('const package_json = {"name":"ergogen"');
  });

  it('leaves the installed package and the shared store untouched', () => {
    // Arrange
    const storeBefore = snapshot(fixture.store);
    const installedBefore = snapshot(fixture.installedPackage);

    // Act
    const result = runPatchScript(fixture);

    // Assert
    expect(result.status, result.stderr).toBe(0);
    expect(snapshot(fixture.store)).toEqual(storeBefore);
    expect(snapshot(fixture.installedPackage)).toEqual(installedBefore);
  });

  it('does not write any Git configuration outside the engine', () => {
    // Act
    const result = runPatchScript(fixture);

    // Assert
    expect(result.status, result.stderr).toBe(0);
    expect(readdirSync(fixture.home)).toEqual([]);
  });

  it('reuses an up-to-date engine without fetching again', () => {
    // Arrange
    expect(runPatchScript(fixture).status).toBe(0);
    const firstBuild = statSync(join(fixture.engine, 'package.json')).ino;

    const failingGit = join(fixture.root, 'failing-bin');
    mkdirSync(failingGit);
    writeFileSync(join(failingGit, 'git'), '#!/bin/sh\nexit 1\n', {
      mode: 0o755,
    });

    // Act
    const result = runPatchScript(fixture, {
      PATH: `${failingGit}:${process.env.PATH}`,
    });

    // Assert
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain('up to date');
    expect(statSync(join(fixture.engine, 'package.json')).ino).toBe(firstBuild);
  });

  it('rebuilds when a footprint pin changes and clears the Vite cache', () => {
    // Arrange
    expect(runPatchScript(fixture).status).toBe(0);
    const viteCache = join(fixture.root, 'node_modules', '.vite');
    mkdirSync(viteCache);
    const updated = createFootprintRepository('ceoloide-updated', [
      ...requiredModules('ceoloide'),
      'new_footprint.js',
    ]);

    // Act
    const result = runPatchScript(fixture, {
      CEOLOIDE_FOOTPRINTS_URL: updated.url,
      CEOLOIDE_FOOTPRINTS_COMMIT: updated.commit,
    });

    // Assert
    expect(result.status, result.stderr).toBe(0);
    expect(
      existsSync(
        join(
          fixture.engine,
          'src',
          'footprints',
          'ceoloide',
          'new_footprint.js'
        )
      )
    ).toBe(true);
    expect(existsSync(viteCache)).toBe(false);
  });

  it('fails fast when Ergogen is not installed', () => {
    // Arrange
    rmSync(join(fixture.root, 'node_modules', 'ergogen'));

    // Act
    const result = runPatchScript(fixture);

    // Assert
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('pnpm install');
    expect(existsSync(fixture.engine)).toBe(false);
  });

  it('fails fast without touching the previous engine when a pin cannot be fetched', () => {
    // Arrange
    expect(runPatchScript(fixture).status).toBe(0);
    const previousEngine = snapshot(fixture.engine);

    // Act
    const result = runPatchScript(fixture, {
      CEOLOIDE_FOOTPRINTS_COMMIT: '0'.repeat(40),
    });

    // Assert
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('0'.repeat(40));
    expect(snapshot(fixture.engine)).toEqual(previousEngine);
    expect(
      readdirSync(join(fixture.root, 'node_modules')).filter((name) =>
        name.startsWith('.ergogen-engine.')
      )
    ).toEqual([]);
  });

  it('rejects a footprint pin that is not a full commit SHA', () => {
    // Act
    const result = runPatchScript(fixture, {
      CEOLOIDE_FOOTPRINTS_COMMIT: 'main',
    });

    // Assert
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('CEOLOIDE_FOOTPRINTS_COMMIT');
    expect(existsSync(fixture.engine)).toBe(false);
  });

  it('fails fast when the footprint index references a missing footprint', () => {
    // Arrange
    const incomplete = createFootprintRepository(
      'ceoloide-incomplete',
      requiredModules('ceoloide').filter((file) => file !== 'switch_mx.js')
    );

    // Act
    const result = runPatchScript(fixture, {
      CEOLOIDE_FOOTPRINTS_URL: incomplete.url,
      CEOLOIDE_FOOTPRINTS_COMMIT: incomplete.commit,
    });

    // Assert
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('ceoloide/switch_mx');
    expect(existsSync(fixture.engine)).toBe(false);
  });

  it('fails fast when ERGOGEN_VERSION was not the installed version', () => {
    // Act
    const result = runPatchScript(fixture, {
      ERGOGEN_VERSION: 'github:someone/ergogen#develop',
    });

    // Assert
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('scripts/preinstall.js');
    expect(existsSync(fixture.engine)).toBe(false);
  });

  it('accepts ERGOGEN_VERSION when it matches the installed specifier', () => {
    // Act
    const result = runPatchScript(fixture, {
      ERGOGEN_VERSION: `ergogen@${INSTALLED_SPECIFIER}`,
    });

    // Assert
    expect(result.status, result.stderr).toBe(0);
  });
});

describe('ERGOGEN_VERSION package.json override', () => {
  const originalManifest =
    JSON.stringify(
      {
        name: 'fixture',
        dependencies: { ergogen: 'github:ceoloide/ergogen#v4.3.0' },
      },
      null,
      2
    ) + '\n';
  let root: string;

  const runLifecycleScript = (name: string, ergogenVersion?: string) => {
    const environment: NodeJS.ProcessEnv = { PATH: process.env.PATH };
    if (ergogenVersion) environment.ERGOGEN_VERSION = ergogenVersion;
    return spawnSync('node', [join(root, 'scripts', `${name}.js`)], {
      cwd: root,
      env: environment,
      encoding: 'utf8',
    });
  };
  const manifest = () =>
    JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      dependencies: Record<string, string>;
    };

  beforeEach(() => {
    root = mkdtempSync(join(workspace, 'lifecycle-'));
    mkdirSync(join(root, 'scripts'));
    for (const name of ['preinstall', 'postinstall']) {
      cpSync(
        join(projectRoot, 'scripts', `${name}.js`),
        join(root, 'scripts', `${name}.js`)
      );
    }
    writeFileSync(join(root, 'package.json'), originalManifest);
  });

  it('accepts the documented ergogen@<specifier> form', () => {
    // Act
    const result = runLifecycleScript('preinstall', 'ergogen@4.2.0');

    // Assert
    expect(result.status, result.stderr).toBe(0);
    expect(manifest().dependencies.ergogen).toBe('4.2.0');
  });

  it('restores package.json after the explicit and lifecycle preinstall runs', () => {
    // Arrange: CI runs preinstall explicitly, then pnpm runs it again.
    runLifecycleScript('preinstall', 'github:someone/ergogen#develop');
    runLifecycleScript('preinstall', 'github:someone/ergogen#develop');

    // Act
    const result = runLifecycleScript('postinstall');

    // Assert
    expect(result.status, result.stderr).toBe(0);
    expect(readFileSync(join(root, 'package.json'), 'utf8')).toBe(
      originalManifest
    );
    expect(existsSync(join(root, 'packages.json.bak'))).toBe(false);
  });
});

describe('generate-previews.js', () => {
  let root: string;

  const runGeneratePreviews = () =>
    spawnSync('node', [join(root, 'scripts', 'generate-previews.js')], {
      cwd: root,
      env: { PATH: process.env.PATH },
      encoding: 'utf8',
    });

  const writeEngine = (body: string) => {
    const engine = join(root, engineRelativePath);
    mkdirSync(join(engine, 'src'), { recursive: true });
    writeFileSync(
      join(engine, 'package.json'),
      JSON.stringify({ name: 'ergogen', main: './src/ergogen.js' })
    );
    writeFileSync(join(engine, 'src', 'ergogen.js'), body);
  };

  beforeEach(() => {
    root = mkdtempSync(join(workspace, 'previews-'));
    mkdirSync(join(root, 'scripts'));
    mkdirSync(join(root, 'src', 'examples'), { recursive: true });
    cpSync(
      join(projectRoot, 'scripts', 'generate-previews.js'),
      join(root, 'scripts', 'generate-previews.js')
    );
    writeFileSync(
      join(root, 'src', 'examples', 'index.ts'),
      "module.exports = { exampleOptions: [{ label: 'Examples', options: [{ label: 'Fixture Board', value: 'points: {}' }] }] };\n"
    );
  });

  it('renders previews with the prepared engine', () => {
    // Arrange
    writeEngine(
      'module.exports = { process: async () => ({ demo: { svg: \'<svg width="1mm" height="1mm" stroke="#000"></svg>\' } }) };\n'
    );

    // Act
    const result = runGeneratePreviews();

    // Assert
    expect(result.status, result.stderr).toBe(0);
    expect(
      readFileSync(
        join(root, 'public', 'images', 'previews', 'fixture_board.svg'),
        'utf8'
      )
    ).toBe(
      '<svg style="background-color: rgb(51,51,51);" width="284px" height="134px" stroke="#AAA"></svg>'
    );
  });

  it('fails fast when the engine has not been prepared', () => {
    // Act
    const result = runGeneratePreviews();

    // Assert
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('build-ergogen');
  });

  it('exits with an error when a preview cannot be generated', () => {
    // Arrange
    writeEngine(
      "module.exports = { process: async () => { throw new Error('broken example'); } };\n"
    );

    // Act
    const result = runGeneratePreviews();

    // Assert
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('broken example');
  });
});
