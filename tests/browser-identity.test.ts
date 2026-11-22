import { afterEach, describe, expect, it, vi } from 'vitest';
import verifyProductionBuild from '../e2e/global-setup';

vi.mock('@playwright/test', () => ({
  defineConfig: <T>(cfg: T): T => cfg,
  devices: { 'Desktop Chrome': { defaultBrowserType: 'chromium' } },
}));

vi.mock('node:net', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:net')>();
  let port = 43000;
  const createServer = () => {
    const assigned = ++port;
    return {
      on: vi.fn(),
      listen: (_p: number, _host: string, cb: () => void) => cb(),
      address: () => ({
        port: assigned,
        family: 'IPv4',
        address: '127.0.0.1',
      }),
      close: (cb: (err?: Error) => void) => cb(),
    };
  };
  return {
    ...actual,
    createServer,
    default: { ...actual, createServer },
  };
});

const config = {
  projects: [
    {
      metadata: { baseURL: 'http://127.0.0.1:43123', buildId: 'root-build' },
    },
    {
      metadata: {
        baseURL: 'http://127.0.0.1:43124/ergogen-gui/',
        buildId: 'subpath-build',
      },
    },
  ],
};
const responses = (...bodies: Response[]) => {
  const fetchBuild = vi.fn();
  for (const body of bodies) fetchBuild.mockResolvedValueOnce(body);
  vi.stubGlobal('fetch', fetchBuild);
  return fetchBuild;
};
afterEach(() => vi.unstubAllGlobals());

describe('production browser acceptance identity', () => {
  it('accepts only the expected build of every project, below its base', async () => {
    // Arrange
    const fetchBuild = responses(
      new Response('root-build\n'),
      new Response('subpath-build')
    );
    // Act
    await verifyProductionBuild(config);
    // Assert
    expect(fetchBuild.mock.calls).toEqual([
      ['http://127.0.0.1:43123/build-id.txt'],
      ['http://127.0.0.1:43124/ergogen-gui/build-id.txt'],
    ]);
  });

  it('rejects a stale server even when it returns HTTP 200', async () => {
    // Arrange: the root build matches, the subpath server is another build
    responses(new Response('root-build'), new Response('other-build'));
    // Act / Assert
    await expect(verifyProductionBuild(config)).rejects.toThrow(
      'wrong build at http://127.0.0.1:43124/ergogen-gui/build-id.txt'
    );
  });

  it('rejects an unsuccessful response with matching text', async () => {
    // Arrange
    responses(new Response('root-build', { status: 503 }));
    // Act / Assert
    await expect(verifyProductionBuild(config)).rejects.toThrow('wrong build');
  });
});

describe('playwright configuration modes', () => {
  const savedEnv = { ...process.env };

  afterEach(() => {
    vi.resetModules();
    for (const key of Object.keys(process.env)) {
      if (!(key in savedEnv)) {
        delete process.env[key];
      }
    }
    Object.assign(process.env, savedEnv);
  });

  const loadConfig = async (overrides: Record<string, string | undefined>) => {
    vi.resetModules();
    delete process.env.PLAYWRIGHT_ROOT_ONLY;
    delete process.env.PLAYWRIGHT_TEST_PORT;
    delete process.env.PLAYWRIGHT_SUBPATH_PORT;
    delete process.env.PLAYWRIGHT_UPDATE_PORT;
    delete process.env.CI;
    for (const [k, v] of Object.entries(overrides)) {
      if (v === undefined) {
        delete process.env[k];
      } else {
        process.env[k] = v;
      }
    }
    const mod = await import('../playwright.config.mts');
    return mod.default;
  };

  it('builds all three projects and servers by default', async () => {
    const cfg = await loadConfig({});
    expect(cfg.projects?.map((p) => p.name)).toEqual([
      'chromium',
      'chromium-subpath',
      'chromium-subpath-update',
    ]);
    expect(cfg.webServer).toHaveLength(3);
  });

  it('limits to the root chromium project and server when PLAYWRIGHT_ROOT_ONLY=1 locally', async () => {
    const cfg = await loadConfig({ PLAYWRIGHT_ROOT_ONLY: '1' });
    expect(cfg.projects?.map((p) => p.name)).toEqual(['chromium']);
    expect(cfg.webServer).toHaveLength(1);
  });

  it('ignores PLAYWRIGHT_ROOT_ONLY=1 when CI is set', async () => {
    const cfg = await loadConfig({ PLAYWRIGHT_ROOT_ONLY: '1', CI: 'true' });
    expect(cfg.projects?.map((p) => p.name)).toEqual([
      'chromium',
      'chromium-subpath',
      'chromium-subpath-update',
    ]);
    expect(cfg.webServer).toHaveLength(3);
  });
});
