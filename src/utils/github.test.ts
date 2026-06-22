import { fetchConfigFromUrl } from './github';

// Mock fetch globally
global.fetch = jest.fn();

describe('github utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchConfigFromUrl with submodules', () => {
    it('should fetch footprints from submodules when .gitmodules exists', async () => {
      // Arrange
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

      // Mock config.yaml fetch from root (404)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('', { status: 404 }) as unknown as Response
        )
      );

      // Mock config.yaml fetch from ergogen folder (success)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('points: {}', { status: 200 }) as unknown as Response
        )
      );

      // Mock footprints directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );
      // Mock outlines directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );

      // Mock .gitmodules fetch
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response(
            '[submodule "ergogen/footprints/ceoloide"]\n' +
              '\tpath = ergogen/footprints/ceoloide\n' +
              '\turl = https://github.com/ceoloide/ergogen-footprints.git',
            { status: 200 }
          ) as unknown as Response
        )
      );

      // Mock submodule repo contents (main branch)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                type: 'file',
                name: 'test_footprint.js',
                download_url:
                  'https://raw.githubusercontent.com/ceoloide/ergogen-footprints/main/test_footprint.js',
              },
            ]),
            { status: 200 }
          ) as unknown as Response
        )
      );

      // Mock footprint file content
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('module.exports = {}', {
            status: 200,
          }) as unknown as Response
        )
      );

      // Act
      const result = await fetchConfigFromUrl('ceoloide/test-repo');

      // Assert
      expect(result.config).toBe('points: {}');
      expect(result.footprints).toHaveLength(1);
      expect(result.footprints[0].name).toBe('ceoloide/test_footprint');
      expect(result.footprints[0].content).toBe('module.exports = {}');
    });

    it('should handle submodules with nested folders', async () => {
      // Arrange
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

      // Mock config.yaml fetch
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('points: {}', { status: 200 }) as unknown as Response
        )
      );

      // Mock footprints directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );
      // Mock outlines directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );

      // Mock .gitmodules fetch
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response(
            '[submodule "footprints/external"]\n' +
              '\tpath = footprints/external\n' +
              '\turl = https://github.com/test/footprints.git',
            { status: 200 }
          ) as unknown as Response
        )
      );

      // Mock submodule repo root contents
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                type: 'dir',
                name: 'switches',
                url: 'https://api.github.com/repos/test/footprints/contents/switches',
              },
            ]),
            { status: 200 }
          ) as unknown as Response
        )
      );

      // Mock submodule subdirectory contents
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                type: 'file',
                name: 'mx.js',
                download_url:
                  'https://raw.githubusercontent.com/test/footprints/main/switches/mx.js',
              },
            ]),
            { status: 200 }
          ) as unknown as Response
        )
      );

      // Mock footprint file content
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('module.exports = {}', {
            status: 200,
          }) as unknown as Response
        )
      );

      // Act
      const result = await fetchConfigFromUrl('test/repo');

      // Assert
      expect(result.footprints).toHaveLength(1);
      expect(result.footprints[0].name).toBe('external/switches/mx');
    });

    it('should skip submodules that are not in the footprints folder', async () => {
      // Arrange
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

      // Mock config.yaml fetch
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('points: {}', { status: 200 }) as unknown as Response
        )
      );

      // Mock footprints directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );
      // Mock outlines directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );

      // Mock .gitmodules fetch with non-footprint submodule
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response(
            '[submodule "docs"]\n' +
              '\tpath = docs\n' +
              '\turl = https://github.com/test/docs.git',
            { status: 200 }
          ) as unknown as Response
        )
      );

      // Act
      const result = await fetchConfigFromUrl('test/repo');

      // Assert
      expect(result.footprints).toHaveLength(0);
    });

    it('should handle missing .gitmodules gracefully', async () => {
      // Arrange
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

      // Mock config.yaml fetch
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('points: {}', { status: 200 }) as unknown as Response
        )
      );

      // Mock footprints directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );
      // Mock outlines directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );

      // Mock .gitmodules fetch (404)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('', { status: 404 }) as unknown as Response
        )
      );

      // Act
      const result = await fetchConfigFromUrl('test/repo');

      // Assert
      expect(result.footprints).toHaveLength(0);
      expect(result.config).toBe('points: {}');
    });
  });
});
