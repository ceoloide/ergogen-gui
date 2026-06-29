import { fetchConfigFromUrl, checkRateLimit } from './github';

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
      mockFetch.mockResolvedValueOnce(new Response('', { status: 404 }));

      // Mock config.yaml fetch from ergogen folder (success)
      mockFetch.mockResolvedValueOnce(new Response('points: {}', { status: 200 }));

      // Mock footprints directory (empty)
      mockFetch.mockResolvedValueOnce(new Response('[]', { status: 404 }));

      // Mock .gitmodules fetch
      mockFetch.mockResolvedValueOnce(new Response(
        '[submodule "ergogen/footprints/ceoloide"]\n' +
          '\tpath = ergogen/footprints/ceoloide\n' +
          '\turl = https://github.com/ceoloide/ergogen-footprints.git',
        { status: 200 }
      ));

      // Mock submodule repo contents (main branch)
      mockFetch.mockResolvedValueOnce(new Response(
        JSON.stringify([
          {
            type: 'file',
            name: 'test_footprint.js',
            download_url:
              'https://raw.githubusercontent.com/ceoloide/ergogen-footprints/main/test_footprint.js',
          },
        ]),
        { status: 200 }
      ));

      // Mock footprint file content
      mockFetch.mockResolvedValueOnce(new Response('module.exports = {}', { status: 200 }));

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
      mockFetch.mockResolvedValueOnce(new Response('points: {}', { status: 200 }));

      // Mock footprints directory (empty)
      mockFetch.mockResolvedValueOnce(new Response('[]', { status: 404 }));

      // Mock .gitmodules fetch
      mockFetch.mockResolvedValueOnce(new Response(
        '[submodule "footprints/external"]\n' +
          '\tpath = footprints/external\n' +
          '\turl = https://github.com/test/footprints.git',
        { status: 200 }
      ));

      // Mock submodule repo root contents
      mockFetch.mockResolvedValueOnce(new Response(
        JSON.stringify([
          {
            type: 'dir',
            name: 'switches',
            url: 'https://api.github.com/repos/test/footprints/contents/switches',
          },
        ]),
        { status: 200 }
      ));

      // Mock submodule subdirectory contents
      mockFetch.mockResolvedValueOnce(new Response(
        JSON.stringify([
          {
            type: 'file',
            name: 'mx.js',
            download_url:
              'https://raw.githubusercontent.com/test/footprints/main/switches/mx.js',
          },
        ]),
        { status: 200 }
      ));

      // Mock footprint file content
      mockFetch.mockResolvedValueOnce(new Response('module.exports = {}', { status: 200 }));

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
      mockFetch.mockResolvedValueOnce(new Response('points: {}', { status: 200 }));

      // Mock footprints directory (empty)
      mockFetch.mockResolvedValueOnce(new Response('[]', { status: 404 }));

      // Mock .gitmodules fetch with non-footprint submodule
      mockFetch.mockResolvedValueOnce(new Response(
        '[submodule "docs"]\n' +
          '\tpath = docs\n' +
          '\turl = https://github.com/test/docs.git',
        { status: 200 }
      ));

      // Act
      const result = await fetchConfigFromUrl('test/repo');

      // Assert
      expect(result.footprints).toHaveLength(0);
    });

    it('should handle missing .gitmodules gracefully', async () => {
      // Arrange
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

      // Mock config.yaml fetch
      mockFetch.mockResolvedValueOnce(new Response('points: {}', { status: 200 }));

      // Mock footprints directory (empty)
      mockFetch.mockResolvedValueOnce(new Response('[]', { status: 404 }));

      // Mock .gitmodules fetch (404)
      mockFetch.mockResolvedValueOnce(new Response('', { status: 404 }));

      // Act
      const result = await fetchConfigFromUrl('test/repo');

      // Assert
      expect(result.footprints).toHaveLength(0);
      expect(result.config).toBe('points: {}');
    });
  });

  describe('checkRateLimit', () => {
    const rawUrl = 'https://raw.githubusercontent.com/user/repo/main/config.yaml';
    const apiUrl = 'https://api.github.com/repos/user/repo/contents/config.yaml';

    it('should identify rate limit exceeded for raw content (HTTP 429)', () => {
      const response = new Response(null, { status: 429 });
      const result = checkRateLimit(response, rawUrl);
      expect(result.isLimitExceeded).toBe(true);
      expect(result.error).toContain('30 minutes');
    });

    it('should identify rate limit exceeded for API (HTTP 403 and remaining 0)', () => {
      const response = new Response(null, {
        status: 403,
        headers: {
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Used': '60',
          'X-RateLimit-Reset': '1234567890'
        }
      });
      const result = checkRateLimit(response, apiUrl);
      expect(result.isLimitExceeded).toBe(true);
      expect(result.error).toContain("You've used your hourly request allowance");
    });

    it('should identify approaching rate limit for API (80% used)', () => {
      const response = new Response(null, {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '20',
          'X-RateLimit-Used': '80',
          'X-RateLimit-Reset': '1234567890'
        }
      });
      const result = checkRateLimit(response, apiUrl);
      expect(result.isLimitExceeded).toBe(false);
      expect(result.error).toContain('Loading from GitHub may become unavailable soon');
    });

    it('should handle missing headers gracefully', () => {
      const response = new Response(null, { status: 200 });
      const result = checkRateLimit(response, apiUrl);
      expect(result.isLimitExceeded).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('fetchConfigFromUrl rate limit integration', () => {
    it('should throw error when rate limit is exceeded on all branches', async () => {
      // Arrange
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

      // Mock all fetch calls to fail with 429 (raw content)
      mockFetch.mockResolvedValue(new Response(null, { status: 429 }));

      // Act & Assert
      await expect(fetchConfigFromUrl('test/repo')).rejects.toThrow(/You've reached your hourly request allowance/);
    });

    it('should return rate limit warning when approaching limit', async () => {
      // Arrange
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

      // Default mock for any API call: return 404 with warning headers
      mockFetch.mockResolvedValue(new Response('[]', {
        status: 404,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '20',
          'X-RateLimit-Used': '80',
          'X-RateLimit-Reset': '1234567890'
        }
      }));

      // Specifically return config for the first call (main branch root config, raw URL)
      mockFetch.mockResolvedValueOnce(new Response('points: {}', { status: 200 }));

      // Act
      const result = await fetchConfigFromUrl('test/repo');

      // Assert
      expect(result.config).toBe('points: {}');
      expect(result.rateLimitWarning).toContain('Loading from GitHub may become unavailable soon');
    });
  });
});
