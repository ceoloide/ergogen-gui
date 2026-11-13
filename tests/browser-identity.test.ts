import { afterEach, describe, expect, it, vi } from 'vitest';
import verifyProductionBuild from '../e2e/global-setup';

const config = {
  metadata: { baseURL: 'http://127.0.0.1:43123', buildId: 'this-build' },
};
afterEach(() => vi.unstubAllGlobals());

describe('production browser acceptance identity', () => {
  it('accepts only the expected successful build response', async () => {
    // Arrange
    const fetchBuild = vi.fn().mockResolvedValue(new Response('this-build\n'));
    vi.stubGlobal('fetch', fetchBuild);
    // Act
    await verifyProductionBuild(config);
    // Assert
    expect(fetchBuild).toHaveBeenCalledWith(
      `${config.metadata.baseURL}/build-id.txt`
    );
  });

  it('rejects a stale server even when it returns HTTP 200', async () => {
    // Arrange
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('other-build'))
    );
    // Act / Assert
    await expect(verifyProductionBuild(config)).rejects.toThrow('wrong build');
  });

  it('rejects an unsuccessful response with matching text', async () => {
    // Arrange
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('this-build', { status: 503 }))
    );
    // Act / Assert
    await expect(verifyProductionBuild(config)).rejects.toThrow('wrong build');
  });
});
