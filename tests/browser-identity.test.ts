import { afterEach, describe, expect, it, vi } from 'vitest';
import verifyProductionBuild from '../e2e/global-setup';

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
