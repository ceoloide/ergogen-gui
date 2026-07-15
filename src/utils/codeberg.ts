import {
  gitProviderRegistry,
  BaseGitProvider,
  GitFileItem,
} from './gitProvider';

class CodebergProvider extends BaseGitProvider {
  canHandle(url: string): boolean {
    return url.includes('codeberg.org');
  }

  public parseUrl(url: string) {
    const cleanUrl = url.trim();
    let owner = '';
    let repo = '';
    let branch = 'main';
    let filePath: string | undefined;
    let isRepoRoot = true;

    const isSimpleRepo = !cleanUrl.includes('codeberg.org');

    if (isSimpleRepo) {
      const parts = cleanUrl.split('/').filter(Boolean);
      if (parts.length < 2) {
        throw new Error(
          'Invalid Codeberg repository format. Must contain owner and repository.'
        );
      }
      owner = parts[0];
      repo = parts[1];

      isRepoRoot =
        parts.length === 2 ||
        (parts.length === 5 &&
          parts[2] === 'src' &&
          (parts[3] === 'branch' || parts[3] === 'commit'));
      if (!isRepoRoot) {
        if (
          parts.length >= 5 &&
          parts[2] === 'src' &&
          (parts[3] === 'branch' || parts[3] === 'commit')
        ) {
          branch = parts[4];
          filePath = parts.slice(5).join('/');
        } else {
          filePath = parts.slice(2).join('/');
        }
      } else if (parts.length === 5) {
        branch = parts[4];
      }
    } else {
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
          'Invalid Codeberg URL. Must contain owner and repository name.'
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
      baseUrl: isSimpleRepo
        ? `https://codeberg.org/${owner}/${repo}`
        : cleanUrl,
    };
  }

  protected async fetchFileContent(
    owner: string,
    repo: string,
    path: string,
    ref: string
  ): Promise<string> {
    const rawUrl = `https://codeberg.org/api/v1/repos/${owner}/${repo}/raw/${path}?ref=${ref}`;
    const res = await fetch(rawUrl);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch file content from Codeberg API: ${res.status}`
      );
    }
    return await res.text();
  }

  protected async listDirectory(
    owner: string,
    repo: string,
    path: string,
    ref: string
  ): Promise<GitFileItem[]> {
    const pathPart = path ? `/${path}` : '';
    const apiUrl = `https://codeberg.org/api/v1/repos/${owner}/${repo}/contents${pathPart}?ref=${ref}`;
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(
        `Failed to list directory from Codeberg API: ${res.status}`
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

gitProviderRegistry.register(new CodebergProvider());
