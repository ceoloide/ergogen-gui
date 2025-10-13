// src/utils/github.ts

type Injection = [string, string];

type GithubFile = {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url: string;
};

const GITHUB_API_URL = 'https://api.github.com';

const getRepoAndPathFromUrl = (url: string) => {
  const urlObject = new URL(url);
  const pathParts = urlObject.pathname.split('/').filter(Boolean);
  if (pathParts.length < 2) {
    throw new Error('Invalid GitHub URL');
  }
  const repo = pathParts.slice(0, 2).join('/');
  const path = pathParts.slice(3).join('/');
  return { repo, path };
};

const fetchGithubApi = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub API error! status: ${response.status}`);
  }
  return response.json();
};

const getRepoContents = async (
  repo: string,
  path: string = ''
): Promise<GithubFile[]> => {
  const url = `${GITHUB_API_URL}/repos/${repo}/contents/${path}`;
  return fetchGithubApi(url);
};

const getFileContent = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.text();
};

export const fetchConfigFromUrl = async (
  url: string
): Promise<{ config: string; injections: Injection[] }> => {
  let newUrl = url.trim();

  const repoPattern = /^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/;
  if (repoPattern.test(newUrl)) {
    newUrl = `https://github.com/${newUrl}`;
  } else if (!newUrl.match(/^(https?:\/\/)/i)) {
    newUrl = `https://${newUrl}`;
  }

  const urlObject = new URL(newUrl);
  const { repo, path } = getRepoAndPathFromUrl(newUrl);

  if (path.endsWith('.yaml') || path.endsWith('.yml')) {
    const downloadUrl = `https://raw.githubusercontent.com/${repo}/HEAD/${path}`;
    const config = await getFileContent(downloadUrl);
    return { config, injections: [] };
  }

  // Breadth-First Search
  const queue: string[] = [path];
  const visited: Set<string> = new Set([path]);
  let yamlFiles: GithubFile[] = [];
  let configYaml: GithubFile | null = null;

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const contents = await getRepoContents(repo, currentPath);

    for (const item of contents) {
      if (item.type === 'dir') {
        if (!visited.has(item.path)) {
          queue.push(item.path);
          visited.add(item.path);
        }
      } else if (item.name.endsWith('.yaml') || item.name.endsWith('.yml')) {
        if (item.name === 'config.yaml' || item.name === 'config.yml') {
          if (!configYaml) {
            configYaml = item;
          }
        }
        yamlFiles.push(item);
      }
    }
  }

  const targetFile = configYaml || yamlFiles[0];

  if (!targetFile) {
    throw new Error('No YAML file found in the repository.');
  }

  const config = await getFileContent(targetFile.download_url);

  const injections: Injection[] = [];
  if (targetFile.name === 'config.yaml' || targetFile.name === 'config.yml') {
    const configFileDir = targetFile.path.substring(
      0,
      targetFile.path.lastIndexOf('/')
    );
    const repoContents = await getRepoContents(repo, configFileDir);
    const footprintsFolder = repoContents.find(
      (item) => item.name === 'footprints' && item.type === 'dir'
    );

    if (footprintsFolder) {
      const processDirectory = async (
        currentRepo: string,
        currentPath: string,
        basePath: string
      ) => {
        const contents = await getRepoContents(currentRepo, currentPath);
        for (const item of contents) {
          if (item.type === 'dir') {
            await processDirectory(currentRepo, item.path, basePath);
          } else if (item.name.endsWith('.js')) {
            const content = await getFileContent(item.download_url);
            const injectionName = item.path
              .substring(basePath.length + 1)
              .replace('.js', '');
            injections.push([injectionName, content]);
          }
        }
      };
      await processDirectory(repo, footprintsFolder.path, footprintsFolder.path);
    }

    // Handle .gitmodules
    try {
      const gitmodulesContent = await getFileContent(
        `https://raw.githubusercontent.com/${repo}/HEAD/.gitmodules`
      );
      const submoduleRegex =
        /\[submodule "([^"]+)"\]\s+path\s*=\s*([^\s]+)\s+url\s*=\s*([^\s]+)/g;
      let match;
      while ((match = submoduleRegex.exec(gitmodulesContent)) !== null) {
        const path = match[2];
        const url = match[3];

        if (footprintsFolder && path.startsWith(footprintsFolder.path)) {
          const submoduleRepo = new URL(url).pathname.substring(1).replace('.git', '');
          await processDirectory(submoduleRepo, '', path);
        }
      }
    } catch (e) {
      // .gitmodules not found or parsing failed, ignore
    }
  }

  return { config, injections };
};