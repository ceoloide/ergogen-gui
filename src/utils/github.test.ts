import { fetchConfigFromUrl, checkRateLimit, parseGitmodules } from './github';
import { isFeatureEnabled } from './featureFlags';

jest.mock('./featureFlags', () => ({
  isFeatureEnabled: jest.fn(() => true),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('github utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isFeatureEnabled as jest.Mock).mockReturnValue(true);
  });

  describe('fetchConfigFromUrl with submodules', () => {
    it('should fetch footprints from submodules when .gitmodules exists', async () => {
      // Arrange
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

      // Mock config.yaml fetch from root (404)
      mockFetch.mockResolvedValueOnce(new Response('', { status: 404 }));

      // Mock config.yaml fetch from ergogen folder (success)
      mockFetch.mockResolvedValueOnce(
        new Response('points: {}', { status: 200 })
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
      // Mock templates directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );

      // Mock .gitmodules fetch
      mockFetch.mockResolvedValueOnce(
        new Response(
          '[submodule "ergogen/footprints/ceoloide"]\n' +
            '\tpath = ergogen/footprints/ceoloide\n' +
            '\turl = https://github.com/ceoloide/ergogen-footprints.git',
          { status: 200 }
        )
      );

      // Mock submodule repo contents (main branch)
      mockFetch.mockResolvedValueOnce(
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
        )
      );

      // Mock footprint file content
      mockFetch.mockResolvedValueOnce(
        new Response('module.exports = {}', { status: 200 })
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
      mockFetch.mockResolvedValueOnce(
        new Response('points: {}', { status: 200 })
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
      // Mock templates directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );

      // Mock .gitmodules fetch
      mockFetch.mockResolvedValueOnce(
        new Response(
          '[submodule "footprints/external"]\n' +
            '\tpath = footprints/external\n' +
            '\turl = https://github.com/test/footprints.git',
          { status: 200 }
        )
      );

      // Mock submodule repo root contents
      mockFetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              type: 'dir',
              name: 'switches',
              url: 'https://api.github.com/repos/test/footprints/contents/switches',
            },
          ]),
          { status: 200 }
        )
      );

      // Mock submodule subdirectory contents
      mockFetch.mockResolvedValueOnce(
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
        )
      );

      // Mock footprint file content
      mockFetch.mockResolvedValueOnce(
        new Response('module.exports = {}', { status: 200 })
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
      mockFetch.mockResolvedValueOnce(
        new Response('points: {}', { status: 200 })
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
      // Mock templates directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );

      // Mock .gitmodules fetch with non-footprint submodule
      mockFetch.mockResolvedValueOnce(
        new Response(
          '[submodule "docs"]\n' +
            '\tpath = docs\n' +
            '\turl = https://github.com/test/docs.git',
          { status: 200 }
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
      mockFetch.mockResolvedValueOnce(
        new Response('points: {}', { status: 200 })
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
      // Mock templates directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );

      // Mock .gitmodules fetch (404)
      mockFetch.mockResolvedValueOnce(new Response('', { status: 404 }));

      // Act
      const result = await fetchConfigFromUrl('test/repo');

      // Assert
      expect(result.footprints).toHaveLength(0);
      expect(result.config).toBe('points: {}');
    });

    it('should skip outlines and templates when they are disabled by feature flags', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

      // Mock config.yaml fetch
      mockFetch.mockResolvedValueOnce(
        new Response('points: {}', { status: 200 })
      );

      // Mock footprints directory (empty)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve(
          new Response('[]', { status: 404 }) as unknown as Response
        )
      );

      // Disable outlines and templates
      (isFeatureEnabled as jest.Mock).mockImplementation((feature) => {
        if (feature === 'outlines' || feature === 'templates') return false;
        return true;
      });

      // Mock .gitmodules fetch (returns 404)
      mockFetch.mockResolvedValueOnce(new Response('', { status: 404 }));

      // Act
      const result = await fetchConfigFromUrl('test/repo');

      // Assert
      expect(result.config).toBe('points: {}');
      expect(result.footprints).toHaveLength(0);
      expect(result.outlines).toHaveLength(0);
      expect(result.templates).toHaveLength(0);

      // Verify that fetch was not called for outlines or templates paths
      const urls = mockFetch.mock.calls.map((call) => call[0] as string);
      expect(urls.some((url) => url.includes('outlines'))).toBe(false);
      expect(urls.some((url) => url.includes('templates'))).toBe(false);
    });
  });

  describe('checkRateLimit', () => {
    const rawUrl =
      'https://raw.githubusercontent.com/user/repo/main/config.yaml';
    const apiUrl =
      'https://api.github.com/repos/user/repo/contents/config.yaml';

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
          'X-RateLimit-Reset': '1234567890',
        },
      });
      const result = checkRateLimit(response, apiUrl);
      expect(result.isLimitExceeded).toBe(true);
      expect(result.error).toContain(
        "You've used your hourly request allowance"
      );
    });

    it('should identify approaching rate limit for API (80% used)', () => {
      const response = new Response(null, {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '20',
          'X-RateLimit-Used': '80',
          'X-RateLimit-Reset': '1234567890',
        },
      });
      const result = checkRateLimit(response, apiUrl);
      expect(result.isLimitExceeded).toBe(false);
      expect(result.error).toContain(
        'Loading from GitHub may become unavailable soon'
      );
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
      await expect(fetchConfigFromUrl('test/repo')).rejects.toThrow(
        /You've reached your hourly request allowance/
      );
    });

    it('should return rate limit warning when approaching limit', async () => {
      // Arrange
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

      // Default mock for any API call: return 404 with warning headers
      mockFetch.mockResolvedValue(
        new Response('[]', {
          status: 404,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '20',
            'X-RateLimit-Used': '80',
            'X-RateLimit-Reset': '1234567890',
          },
        })
      );

      // Specifically return config for the first call (main branch root config, raw URL)
      mockFetch.mockResolvedValueOnce(
        new Response('points: {}', { status: 200 })
      );

      // Act
      const result = await fetchConfigFromUrl('test/repo');

      // Assert
      expect(result.config).toBe('points: {}');
      expect(result.rateLimitWarning).toContain(
        'Loading from GitHub may become unavailable soon'
      );
    });
  });

  describe('parseGitmodules', () => {
    it('should parse standard .gitmodules with multiple submodules correctly', () => {
      // Arrange
      const content = `
[submodule "ergogen/footprints/ceoloide"]
\tpath = ergogen/footprints/ceoloide
\turl = https://github.com/ceoloide/ergogen-footprints.git
[submodule "ergogen/footprints/infused-kim"]
\tpath = ergogen/footprints/infused-kim
\turl = https://github.com/infused-kim/kb_footprints.git
      `;

      // Act
      const result = parseGitmodules(content);

      // Assert
      expect(result).toEqual([
        {
          path: 'ergogen/footprints/ceoloide',
          url: 'https://github.com/ceoloide/ergogen-footprints.git',
        },
        {
          path: 'ergogen/footprints/infused-kim',
          url: 'https://github.com/infused-kim/kb_footprints.git',
        },
      ]);
    });

    it('should handle empty or whitespace-only content', () => {
      // Arrange
      const content = '   \n  \n\t  ';

      // Act
      const result = parseGitmodules(content);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle content with no submodules', () => {
      // Arrange
      const content = 'some random text\nfoo = bar\nbaz = qux';

      // Act
      const result = parseGitmodules(content);

      // Assert
      expect(result).toEqual([]);
    });

    it('should ignore submodules missing a path or url', () => {
      // Arrange
      const content = `
[submodule "missing-url"]
\tpath = some/path
[submodule "missing-path"]
\turl = https://github.com/some/url.git
[submodule "valid"]
\tpath = valid/path
\turl = https://github.com/valid/url.git
      `;

      // Act
      const result = parseGitmodules(content);

      // Assert
      expect(result).toEqual([
        {
          path: 'valid/path',
          url: 'https://github.com/valid/url.git',
        },
      ]);
    });

    it('should handle variations in whitespace, spacing and newlines', () => {
      // Arrange
      const content = `
[submodule "spaces"]
    path   =   spaced/path
   url=https://github.com/spaced/url.git
[submodule "carriage-returns"]\r
\tpath = cr/path\r
\turl = https://github.com/cr/url.git\r
      `;

      // Act
      const result = parseGitmodules(content);

      // Assert
      expect(result).toEqual([
        {
          path: 'spaced/path',
          url: 'https://github.com/spaced/url.git',
        },
        {
          path: 'cr/path',
          url: 'https://github.com/cr/url.git',
        },
      ]);
    });

    it('should parse the last submodule correctly even if not followed by a newline', () => {
      // Arrange
      const content =
        '[submodule "last"]\n\tpath = last/path\n\turl = https://github.com/last/url.git';

      // Act
      const result = parseGitmodules(content);

      // Assert
      expect(result).toEqual([
        {
          path: 'last/path',
          url: 'https://github.com/last/url.git',
        },
      ]);
    });
  });
});
