import {
  gitProviderRegistry,
  BaseGitProvider,
  GitFileItem,
} from './gitProvider';

class ForgejoProvider extends BaseGitProvider {
  canHandle(url: string): boolean {
    const cleanUrl = url.trim();
    // Match HTTP/HTTPS URLs that are not GitHub and not Codeberg
    if (cleanUrl.match(/^(https?:\/\/)/i)) {
      return (
        !cleanUrl.includes('github.com') && !cleanUrl.includes('codeberg.org')
      );
    }
    return false;
  }

  public parseUrl(url: string) {
    const cleanUrl = url.trim();
    let owner = '';
    let repo = '';
    let branch = 'main';
    let filePath: string | undefined;
    let isRepoRoot = true;

    let formattedUrl = cleanUrl;
    if (!formattedUrl.match(/^(https?:\/\/)/i)) {
      formattedUrl = `https://${formattedUrl}`;
    }
    const baseUrl = formattedUrl.endsWith('/')
      ? formattedUrl.slice(0, -1)
      : formattedUrl;
    const urlObject = new URL(baseUrl);
    const host = urlObject.origin;
    const pathSegments = urlObject.pathname.split('/').filter(Boolean);

    if (pathSegments.length < 2) {
      throw new Error(
        'Invalid Forgejo/Gitea URL. Must contain owner and repository name.'
      );
    }
    owner = pathSegments[0];
    repo = pathSegments[1];

    isRepoRoot =
      pathSegments.length === 2 ||
      (pathSegments.length === 5 &&
        pathSegments[2] === 'src' &&
        (pathSegments[3] === 'branch' || pathSegments[3] === 'commit'));

    if (!isRepoRoot) {
      if (
        pathSegments.length >= 5 &&
        pathSegments[2] === 'src' &&
        (pathSegments[3] === 'branch' || pathSegments[3] === 'commit')
      ) {
        branch = pathSegments[4];
        filePath = pathSegments.slice(5).join('/');
      } else {
        filePath = pathSegments.slice(2).join('/');
      }
    } else if (pathSegments.length === 5) {
      branch = pathSegments[4];
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
      baseUrl: cleanUrl,
      host,
    };
  }

  public async fetchFileContent(
    owner: string,
    repo: string,
    path: string,
    ref: string,
    host?: string
  ): Promise<string> {
    const resolvedHost = host || 'https://codeberg.org';
    const rawUrl = `${resolvedHost}/api/v1/repos/${owner}/${repo}/raw/${path}?ref=${ref}`;
    const res = await fetch(rawUrl);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch file content from Gitea/Forgejo API: ${res.status}`
      );
    }
    return await res.text();
  }

  public async listDirectory(
    owner: string,
    repo: string,
    path: string,
    ref: string,
    host?: string
  ): Promise<GitFileItem[]> {
    const resolvedHost = host || 'https://codeberg.org';
    const pathPart = path ? `/${path}` : '';
    const apiUrl = `${resolvedHost}/api/v1/repos/${owner}/${repo}/contents${pathPart}?ref=${ref}`;
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(
        `Failed to list directory from Gitea/Forgejo API: ${res.status}`
      );
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
}

const forgejoProvider = new ForgejoProvider();
gitProviderRegistry.register(forgejoProvider);
