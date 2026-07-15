import {
  gitProviderRegistry,
  ErgogenWorkspaceBundle,
  BaseGitProvider,
  GitFileItem,
} from './gitProvider';

export type { GitHubFootprint } from './gitProvider';

/**
 * Checks GitHub API rate limit headers and logs usage information.
 * Returns an error object if rate limit is exceeded or threshold is crossed.
 * Also handles raw.githubusercontent.com rate limits (HTTP 429).
 * @param {Response} response - The fetch response object.
 * @param {string} url - The URL being fetched (to determine if it's API or raw content).
 * @returns {{isLimitExceeded: boolean, error: string | null}} Rate limit status.
 */
export const checkRateLimit = (
  response: Response,
  url: string
): { isLimitExceeded: boolean; error: string | null } => {
  if (!response) {
    return { isLimitExceeded: false, error: null };
  }

  const isRawContent = url.includes('raw.githubusercontent.com');

  if (isRawContent) {
    if (response.status === 429) {
      console.warn(
        '[GitHub] Raw content rate limit exceeded (429). Please wait 30 minutes and try again.'
      );
      return {
        isLimitExceeded: true,
        error:
          "You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again.",
      };
    }
    return { isLimitExceeded: false, error: null };
  }

  const limit = response.headers?.get('X-RateLimit-Limit') || 'unknown';
  const remaining = response.headers?.get('X-RateLimit-Remaining') || 'unknown';
  const used = response.headers?.get('X-RateLimit-Used') || 'unknown';
  const reset = response.headers?.get('X-RateLimit-Reset') || 'unknown';

  console.log(
    `[GitHub Rate Limit] Limit: ${limit}, Remaining: ${remaining}, Used: ${used}, Reset: ${reset}`
  );

  if (response.status === 403 && remaining === '0') {
    console.warn(
      '[GitHub] Rate limit exceeded. Please wait and try again in about an hour.'
    );
    return {
      isLimitExceeded: true,
      error:
        "Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again.",
    };
  }

  if (remaining !== 'unknown' && limit !== 'unknown') {
    const limitNum = parseInt(limit);
    const remainingNum = parseInt(remaining);
    const percentUsed = ((limitNum - remainingNum) / limitNum) * 100;

    if (percentUsed >= 80 && remainingNum > 0) {
      console.warn(
        `[GitHub] Approaching rate limit: ${percentUsed.toFixed(1)}% used`
      );
      return {
        isLimitExceeded: false,
        error:
          "Loading from GitHub may become unavailable soon. You've used most of your hourly request allowance. This will reset within an hour.",
      };
    }
  }

  return { isLimitExceeded: false, error: null };
};

class GitHubProvider extends BaseGitProvider {
  private rateLimitWarning: string | null = null;

  canHandle(url: string): boolean {
    const cleanUrl = url.trim();
    return (
      cleanUrl.includes('github.com') ||
      /^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(cleanUrl)
    );
  }

  public parseUrl(url: string) {
    const cleanUrl = url.trim();
    let owner = '';
    let repo = '';
    let branch = 'main';
    let filePath: string | undefined;
    let isRepoRoot = true;

    // Check if it's a simple repo format (e.g., "owner/repo" or "owner/repo/blob/branch/file")
    const isSimpleRepo = !cleanUrl.includes('github.com');

    if (isSimpleRepo) {
      const parts = cleanUrl.split('/').filter(Boolean);
      if (parts.length < 2) {
        throw new Error(
          'Invalid GitHub repository format. Must contain owner and repository.'
        );
      }
      owner = parts[0];
      repo = parts[1];

      isRepoRoot =
        parts.length === 2 || (parts.length === 4 && parts[2] === 'tree');
      if (!isRepoRoot) {
        if (parts[2] === 'blob' || parts[2] === 'tree') {
          branch = parts[3];
          filePath = parts.slice(4).join('/');
        } else {
          filePath = parts.slice(2).join('/');
        }
      } else if (parts.length === 4) {
        branch = parts[3];
      }
    } else {
      // Full URL format
      let formattedUrl = cleanUrl;
      if (!formattedUrl.match(/^(https?:\/\/)/i)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      const baseUrl = formattedUrl.endsWith('/')
        ? formattedUrl.slice(0, -1)
        : formattedUrl;
      const urlObject = new URL(baseUrl);
      const pathSegments = urlObject.pathname.split('/').filter(Boolean);

      if (pathSegments.length < 2) {
        throw new Error(
          'Invalid GitHub URL. Must contain owner and repository.'
        );
      }
      owner = pathSegments[0];
      repo = pathSegments[1];

      isRepoRoot =
        pathSegments.length === 2 ||
        (pathSegments.length === 4 && pathSegments[2] === 'tree');
      if (!isRepoRoot) {
        if (pathSegments[2] === 'blob' || pathSegments[2] === 'tree') {
          branch = pathSegments[3];
          filePath = pathSegments.slice(4).join('/');
        } else {
          filePath = pathSegments.slice(2).join('/');
        }
      } else if (pathSegments.length === 4) {
        branch = pathSegments[3];
      }
    }

    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }

    return {
      owner,
      repo,
      branch,
      filePath,
      isRepoRoot,
      baseUrl: isSimpleRepo ? `https://github.com/${owner}/${repo}` : cleanUrl,
    };
  }

  public async fetchFileContent(
    owner: string,
    repo: string,
    path: string,
    ref: string
  ): Promise<string> {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`;
    const res = await fetch(rawUrl);
    this.checkRateLimits(res, rawUrl);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch file content from GitHub: ${res.status}`
      );
    }
    return await res.text();
  }

  public async listDirectory(
    owner: string,
    repo: string,
    path: string,
    ref: string
  ): Promise<GitFileItem[]> {
    const pathPart = path ? `/${path}` : '';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents${pathPart}?ref=${ref}`;
    const res = await fetch(apiUrl);
    this.checkRateLimits(res, apiUrl);
    if (!res.ok) {
      throw new Error(`Failed to list directory from GitHub: ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Target path is not a directory');
    }
    return data.map((item: { name: string; path?: string; type: string }) => ({
      name: item.name,
      path: item.path || item.name,
      type: item.type as 'file' | 'dir',
    }));
  }

  private checkRateLimits(response: Response, url: string) {
    const result = checkRateLimit(response, url);
    if (result.error && !this.rateLimitWarning) {
      this.rateLimitWarning = result.error;
    }
    if (result.isLimitExceeded) {
      throw new Error(result.error || 'Rate limit exceeded');
    }
  }

  async fetchConfig(url: string): Promise<ErgogenWorkspaceBundle> {
    this.rateLimitWarning = null;
    const bundle = await super.fetchConfig(url);
    if (this.rateLimitWarning) {
      bundle.rateLimitWarning = this.rateLimitWarning;
    }
    return bundle;
  }
}

gitProviderRegistry.register(new GitHubProvider());

export const fetchConfigFromUrl = async (
  url: string
): Promise<ErgogenWorkspaceBundle> => {
  const provider = gitProviderRegistry.resolve(url);
  if (!provider) {
    throw new Error(`Unsupported repository provider URL: ${url}`);
  }
  return provider.fetchConfig(url);
};
