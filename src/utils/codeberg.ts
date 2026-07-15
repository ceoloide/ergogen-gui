import {
  GitProvider,
  ErgogenWorkspaceBundle,
  GitHubFootprint,
  gitProviderRegistry,
} from './gitProvider';
import { isFeatureEnabled } from './featureFlags';
import { parseGitmodules, fetchFootprintsFromRepo } from './github';

class CodebergProvider implements GitProvider {
  canHandle(url: string): boolean {
    return url.includes('codeberg.org');
  }

  async fetchConfig(url: string): Promise<ErgogenWorkspaceBundle> {
    console.log(`[Codeberg] Starting fetch from URL: ${url}`);
    let newUrl = url.trim();

    if (!newUrl.match(/^(https?:\/\/)/i)) {
      newUrl = `https://${newUrl}`;
    }

    const baseUrl = newUrl.endsWith('/') ? newUrl.slice(0, -1) : newUrl;
    console.log(`[Codeberg] Normalized URL: ${baseUrl}`);

    const urlObject = new URL(baseUrl);
    const pathSegments = urlObject.pathname.split('/').filter(Boolean);
    if (pathSegments.length < 2) {
      throw new Error(
        'Invalid Codeberg URL. Must contain owner and repository name.'
      );
    }

    const owner = pathSegments[0];
    const repo = pathSegments[1];

    const isRepoRoot = (urlStr: string) => {
      try {
        const u = new URL(urlStr);
        if (u.hostname !== 'codeberg.org') {
          return false;
        }

        const segments = u.pathname.split('/').filter(Boolean);
        if (segments.length === 2) {
          return true; // standard owner/repo
        }

        // If it is owner/repo/src/branch/branchName or owner/repo/src/commit/commitHash
        // and does NOT point to a file, then it is also a repository root but at a specific ref
        if (
          segments.length === 5 &&
          segments[2] === 'src' &&
          (segments[3] === 'branch' || segments[3] === 'commit')
        ) {
          return true;
        }

        return false;
      } catch (_e) {
        return false;
      }
    };

    // Helper to process submodules recursively
    const processSubmodules = async (
      dirPath: string,
      branch: string,
      footprintsPath: string,
      outlinesPath: string,
      templatesPath: string,
      footprints: GitHubFootprint[],
      outlines: GitHubFootprint[],
      templates: GitHubFootprint[]
    ) => {
      console.log('[Codeberg] Checking for .gitmodules file');
      try {
        const gitmodulesUrl = `https://codeberg.org/${owner}/${repo}/raw/branch/${branch}/.gitmodules`;
        const gitmodulesResponse = await fetch(gitmodulesUrl);
        if (gitmodulesResponse && gitmodulesResponse.ok) {
          console.log('[Codeberg] .gitmodules found, parsing submodules');
          const gitmodulesContent = await gitmodulesResponse.text();
          const submodules = parseGitmodules(gitmodulesContent);

          for (const submodule of submodules) {
            if (
              submodule.path.startsWith(footprintsPath) ||
              (submodule.path.startsWith(outlinesPath) &&
                isFeatureEnabled('outlines')) ||
              (submodule.path.startsWith(templatesPath) &&
                isFeatureEnabled('templates'))
            ) {
              const isOutline = submodule.path.startsWith(outlinesPath);
              const isTemplate = submodule.path.startsWith(templatesPath);
              const currentPath = isOutline
                ? outlinesPath
                : isTemplate
                  ? templatesPath
                  : footprintsPath;
              const currentCollection = isOutline
                ? outlines
                : isTemplate
                  ? templates
                  : footprints;

              console.log(
                `[Codeberg] Processing submodule: ${submodule.path} -> ${submodule.url}`
              );

              const submoduleMatch = submodule.url.match(
                /(?:github\.com|codeberg\.org)[/:]([^/]+)\/([^/.]+)/
              );
              if (submoduleMatch) {
                const [, subOwner, subRepo] = submoduleMatch;
                const relativePath = submodule.path.substring(
                  currentPath.length + 1
                );
                console.log(
                  `[Codeberg] Submodule relative path: ${relativePath}`
                );

                const isSubmoduleCodeberg =
                  submodule.url.includes('codeberg.org');
                let submoduleFootprints: GitHubFootprint[] = [];

                if (isSubmoduleCodeberg) {
                  const fetchSubmoduleFilesCodeberg = async (
                    subOwnerName: string,
                    subRepoName: string,
                    subBranch: string
                  ): Promise<GitHubFootprint[]> => {
                    const resultFps: GitHubFootprint[] = [];
                    const fetchRec = async (p: string) => {
                      const api = `https://codeberg.org/api/v1/repos/${subOwnerName}/${subRepoName}/contents/${p}?ref=${subBranch}`;
                      const r = await fetch(api);
                      if (!r.ok) return;
                      const items = await r.json();
                      if (Array.isArray(items)) {
                        for (const item of items) {
                          if (item.type === 'file' && item.download_url) {
                            const fileRes = await fetch(item.download_url);
                            if (fileRes.ok) {
                              const content = await fileRes.text();
                              const cleanName = item.path.replace(
                                /\.[^/.]+$/,
                                ''
                              );
                              resultFps.push({ name: cleanName, content });
                            }
                          } else if (item.type === 'dir') {
                            await fetchRec(item.path);
                          }
                        }
                      }
                    };
                    await fetchRec('');
                    return resultFps;
                  };

                  try {
                    submoduleFootprints = await fetchSubmoduleFilesCodeberg(
                      subOwner,
                      subRepo,
                      'main'
                    );
                  } catch (_e) {
                    try {
                      submoduleFootprints = await fetchSubmoduleFilesCodeberg(
                        subOwner,
                        subRepo,
                        'master'
                      );
                    } catch (_e2) {
                      console.warn(
                        `Failed to fetch Codeberg submodule footprints from ${submodule.url}`
                      );
                    }
                  }
                } else {
                  try {
                    submoduleFootprints = await fetchFootprintsFromRepo(
                      subOwner,
                      subRepo,
                      'main',
                      ''
                    );
                  } catch (_e) {
                    try {
                      submoduleFootprints = await fetchFootprintsFromRepo(
                        subOwner,
                        subRepo,
                        'master',
                        ''
                      );
                    } catch (_e2) {
                      console.warn(
                        `Failed to fetch GitHub submodule footprints from ${submodule.url}`
                      );
                    }
                  }
                }

                const prefixedFootprints = submoduleFootprints.map((fp) => ({
                  name: relativePath ? `${relativePath}/${fp.name}` : fp.name,
                  content: fp.content,
                }));
                console.log(
                  `[Codeberg] Added ${prefixedFootprints.length} footprints from submodule ${submodule.path}`
                );
                currentCollection.push(...prefixedFootprints);
              }
            }
          }
        }
      } catch (error) {
        console.warn(
          '[Codeberg] No .gitmodules found or failed to parse:',
          error
        );
      }
    };

    // If it's a direct file URL, download it directly without searching repository root
    if (!isRepoRoot(baseUrl)) {
      const rawUrl = baseUrl
        .replace('/src/branch/', '/raw/branch/')
        .replace('/src/commit/', '/raw/commit/');

      console.log(
        `[Codeberg] Direct file link detected, fetching raw content from: ${rawUrl}`
      );
      const response = await fetch(rawUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch file from Codeberg: ${response.status} ${response.statusText}`
        );
      }

      const config = await response.text();
      // Enforce file size limit of 10MB for config
      if (config.length > 10 * 1024 * 1024) {
        throw new Error('Remote configuration file exceeds the 10MB limit.');
      }

      const filename = pathSegments[pathSegments.length - 1];
      const shouldLoadFootprints =
        filename === 'config.yaml' || filename === 'config.yml';

      if (!shouldLoadFootprints) {
        console.log(
          '[Codeberg] File is not config.yaml or config.yml, skipping footprint loading'
        );
        return {
          config,
          footprints: [],
          outlines: [],
          templates: [],
          configPath: filename,
        };
      }

      // If it is config.yaml/config.yml, load footprints from its containing folder
      const branch = pathSegments[4] || 'main';
      const dirSegments = pathSegments.slice(5, -1);
      const dirPath = dirSegments.join('/');

      const footprintsPath = dirPath ? `${dirPath}/footprints` : 'footprints';
      const outlinesPath = dirPath ? `${dirPath}/outlines` : 'outlines';
      const templatesPath = dirPath ? `${dirPath}/templates` : 'templates';

      const footprints: GitHubFootprint[] = [];
      const outlines: GitHubFootprint[] = [];
      const templates: GitHubFootprint[] = [];

      const fetchFiles = async (
        subDirPath: string,
        targetCollection: GitHubFootprint[],
        allowedExtensions: string[]
      ) => {
        const fullPath = dirPath ? `${dirPath}/${subDirPath}` : subDirPath;
        const apiUrl = `https://codeberg.org/api/v1/repos/${owner}/${repo}/contents/${fullPath}?ref=${branch}`;
        try {
          const res = await fetch(apiUrl);
          if (!res.ok) return;

          const items = await res.json();
          if (Array.isArray(items)) {
            for (const item of items) {
              if (item.type === 'file') {
                const hasAllowedExt = allowedExtensions.some((ext) =>
                  item.name.endsWith(ext)
                );
                if (hasAllowedExt && item.download_url) {
                  const fileRes = await fetch(item.download_url);
                  if (fileRes.ok) {
                    const content = await fileRes.text();
                    const cleanName = item.path
                      .slice(fullPath.length + 1)
                      .replace(/\.[^/.]+$/, '');
                    targetCollection.push({ name: cleanName, content });
                  }
                }
              } else if (item.type === 'dir') {
                await fetchFiles(
                  item.path.slice(dirPath ? dirPath.length + 1 : 0),
                  targetCollection,
                  allowedExtensions
                );
              }
            }
          }
        } catch (e) {
          console.warn(`[Codeberg] Failed to fetch folder ${fullPath}:`, e);
        }
      };

      await fetchFiles('footprints', footprints, ['.js']);
      if (isFeatureEnabled('outlines')) {
        await fetchFiles('outlines', outlines, ['.js', '.svg']);
      }
      if (isFeatureEnabled('templates')) {
        await fetchFiles('templates', templates, ['.js']);
      }

      await processSubmodules(
        dirPath,
        branch,
        footprintsPath,
        outlinesPath,
        templatesPath,
        footprints,
        outlines,
        templates
      );

      return {
        config,
        footprints,
        outlines,
        templates,
        configPath: filename,
      };
    }

    // Otherwise, fetch config.yaml or config.yml from repository root branches
    // Extract custom branch if present in repository URL
    let branch = 'main';
    const segments = urlObject.pathname.split('/').filter(Boolean);
    if (
      segments.length === 5 &&
      segments[2] === 'src' &&
      (segments[3] === 'branch' || segments[3] === 'commit')
    ) {
      branch = segments[4];
    }

    const fetchWithBranch = async (
      targetBranch: string
    ): Promise<ErgogenWorkspaceBundle> => {
      console.log(
        `[Codeberg] Attempting to fetch from branch: ${targetBranch}`
      );

      // Try fetching config.yaml first
      let configText = '';
      let configPath = 'config.yaml';
      let response = await fetch(
        `https://codeberg.org/${owner}/${repo}/raw/branch/${targetBranch}/config.yaml`
      );

      if (!response.ok) {
        // Fall back to config.yml
        response = await fetch(
          `https://codeberg.org/${owner}/${repo}/raw/branch/${targetBranch}/config.yml`
        );
        configPath = 'config.yml';
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch config.yaml or config.yml from branch: ${targetBranch}`
        );
      }

      configText = await response.text();

      // Enforce file size limit of 10MB for config
      if (configText.length > 10 * 1024 * 1024) {
        throw new Error('Remote configuration file exceeds the 10MB limit.');
      }

      const footprints: GitHubFootprint[] = [];
      const outlines: GitHubFootprint[] = [];
      const templates: GitHubFootprint[] = [];

      // Helper to fetch files recursively from Codeberg repository
      const fetchFiles = async (
        dirPath: string,
        targetCollection: GitHubFootprint[],
        allowedExtensions: string[]
      ) => {
        const apiUrl = `https://codeberg.org/api/v1/repos/${owner}/${repo}/contents/${dirPath}?ref=${targetBranch}`;
        try {
          const res = await fetch(apiUrl);
          if (!res.ok) return;

          const items = await res.json();
          if (Array.isArray(items)) {
            for (const item of items) {
              if (item.type === 'file') {
                const hasAllowedExt = allowedExtensions.some((ext) =>
                  item.name.endsWith(ext)
                );
                if (hasAllowedExt && item.download_url) {
                  const fileRes = await fetch(item.download_url);
                  if (fileRes.ok) {
                    const content = await fileRes.text();
                    const cleanName = item.path
                      .slice(dirPath.length + 1)
                      .replace(/\.[^/.]+$/, '');
                    targetCollection.push({ name: cleanName, content });
                  }
                }
              } else if (item.type === 'dir') {
                await fetchFiles(
                  item.path,
                  targetCollection,
                  allowedExtensions
                );
              }
            }
          }
        } catch (e) {
          console.warn(`[Codeberg] Failed to fetch folder ${dirPath}:`, e);
        }
      };

      // Load injections conditionally based on active feature flags
      await fetchFiles('footprints', footprints, ['.js']);
      if (isFeatureEnabled('outlines')) {
        await fetchFiles('outlines', outlines, ['.js', '.svg']);
      }
      if (isFeatureEnabled('templates')) {
        await fetchFiles('templates', templates, ['.js']);
      }

      await processSubmodules(
        '',
        targetBranch,
        'footprints',
        'outlines',
        'templates',
        footprints,
        outlines,
        templates
      );

      return {
        config: configText,
        footprints,
        outlines,
        templates,
        configPath,
      };
    };

    // If branch is custom, fetch directly from that branch.
    // Otherwise fallback main -> master
    if (branch !== 'main') {
      return await fetchWithBranch(branch);
    }

    try {
      return await fetchWithBranch('main');
    } catch (_e) {
      return await fetchWithBranch('master');
    }
  }
}

// Register Codeberg provider
gitProviderRegistry.register(new CodebergProvider());
