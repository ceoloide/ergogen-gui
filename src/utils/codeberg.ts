import {
  GitProvider,
  ErgogenWorkspaceBundle,
  GitHubFootprint,
  gitProviderRegistry,
} from './gitProvider';
import { isFeatureEnabled } from './featureFlags';
import { parseGitmodules, fetchFootprintsFromRepo } from './github';
import { enforceFileSizeLimit } from './ergogenBundleLoader';

// Helper to fetch file content CORS-safely using the Gitea raw API endpoint
const fetchFileContentCodeberg = async (
  owner: string,
  repo: string,
  path: string,
  ref: string
): Promise<string> => {
  const apiUrl = `https://codeberg.org/api/v1/repos/${owner}/${repo}/raw/${path}?ref=${ref}`;
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch file content from Codeberg API: ${res.status}`
    );
  }
  return await res.text();
};

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
        const gitmodulesContent = await fetchFileContentCodeberg(
          owner,
          repo,
          '.gitmodules',
          branch
        );
        console.log('[Codeberg] .gitmodules found, parsing submodules');
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
                        if (item.type === 'file') {
                          try {
                            const content = await fetchFileContentCodeberg(
                              subOwnerName,
                              subRepoName,
                              item.path,
                              subBranch
                            );
                            const cleanName = item.path.replace(
                              /\.[^/.]+$/,
                              ''
                            );
                            resultFps.push({ name: cleanName, content });
                          } catch (err) {
                            console.warn(
                              `Failed to fetch file: ${item.path}`,
                              err
                            );
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
      } catch (error) {
        console.warn(
          '[Codeberg] No .gitmodules found or failed to parse:',
          error
        );
      }
    };

    // Helper to perform a breadth-first search for YAML files in Codeberg repository
    const bfsForYamlFilesCodeberg = async (
      targetBranch: string
    ): Promise<{
      configYamls: string[];
      anyYamls: string[];
    }> => {
      const configYamls: string[] = [];
      const anyYamls: string[] = [];
      const queue: string[] = [''];
      const visited = new Set<string>();

      while (queue.length > 0) {
        const currentPath = queue.shift()!;
        if (visited.has(currentPath)) continue;
        visited.add(currentPath);

        const pathPart = currentPath ? `/${currentPath}` : '';
        const apiUrl = `https://codeberg.org/api/v1/repos/${owner}/${repo}/contents${pathPart}?ref=${targetBranch}`;
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) continue;

          const items = await response.json();
          if (Array.isArray(items)) {
            for (const item of items) {
              if (item.type === 'file') {
                const isYaml =
                  item.name.endsWith('.yaml') || item.name.endsWith('.yml');
                if (isYaml) {
                  if (
                    item.name === 'config.yaml' ||
                    item.name === 'config.yml'
                  ) {
                    configYamls.push(item.path);
                  } else {
                    anyYamls.push(item.path);
                  }
                }
              } else if (item.type === 'dir') {
                queue.push(item.path);
              }
            }
          }
        } catch (_error) {
          continue;
        }
      }

      return { configYamls, anyYamls };
    };

    // If it's a direct file URL, download it directly without searching repository root
    if (!isRepoRoot(baseUrl)) {
      const branch = pathSegments[4] || 'main';
      const filePath = pathSegments.slice(5).join('/');
      if (!filePath) {
        throw new Error('Invalid Codeberg file URL. File path not specified.');
      }

      console.log(
        `[Codeberg] Direct file link detected, fetching content via API: ${owner}/${repo}/${filePath} (ref: ${branch})`
      );
      const config = await fetchFileContentCodeberg(
        owner,
        repo,
        filePath,
        branch
      );
      enforceFileSizeLimit(config.length, false);

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
                if (hasAllowedExt) {
                  try {
                    const content = await fetchFileContentCodeberg(
                      owner,
                      repo,
                      item.path,
                      branch
                    );
                    const cleanName = item.path
                      .slice(fullPath.length + 1)
                      .replace(/\.[^/.]+$/, '');
                    targetCollection.push({ name: cleanName, content });
                  } catch (err) {
                    console.warn(`Failed to fetch file ${item.path}:`, err);
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

      let configText = '';
      let configPath = '';
      let shouldLoadFootprints = true;

      // 1. Try config.yaml in root
      try {
        configText = await fetchFileContentCodeberg(
          owner,
          repo,
          'config.yaml',
          targetBranch
        );
        configPath = '';
        console.log('[Codeberg] Config found in root directory (config.yaml)');
      } catch (_e) {
        // 2. Try config.yml in root
        try {
          configText = await fetchFileContentCodeberg(
            owner,
            repo,
            'config.yml',
            targetBranch
          );
          configPath = '';
          console.log('[Codeberg] Config found in root directory (config.yml)');
        } catch (_e2) {
          // 3. Try ergogen/config.yaml
          try {
            configText = await fetchFileContentCodeberg(
              owner,
              repo,
              'ergogen/config.yaml',
              targetBranch
            );
            configPath = 'ergogen';
            console.log(
              '[Codeberg] Config found in ergogen/ directory (config.yaml)'
            );
          } catch (_e3) {
            // 4. Try ergogen/config.yml
            try {
              configText = await fetchFileContentCodeberg(
                owner,
                repo,
                'ergogen/config.yml',
                targetBranch
              );
              configPath = 'ergogen';
              console.log(
                '[Codeberg] Config found in ergogen/ directory (config.yml)'
              );
            } catch (_e4) {
              // 5. BFS for config files
              console.log(
                '[Codeberg] Performing breadth-first search for YAML files'
              );
              const { configYamls, anyYamls } =
                await bfsForYamlFilesCodeberg(targetBranch);

              if (configYamls.length > 0) {
                const selectedPath = configYamls[0];
                configText = await fetchFileContentCodeberg(
                  owner,
                  repo,
                  selectedPath,
                  targetBranch
                );
                configPath = selectedPath.includes('/')
                  ? selectedPath.substring(0, selectedPath.lastIndexOf('/'))
                  : '';
                console.log(`[Codeberg] Found config file at: ${selectedPath}`);
              } else if (anyYamls.length > 0) {
                const selectedPath = anyYamls[0];
                configText = await fetchFileContentCodeberg(
                  owner,
                  repo,
                  selectedPath,
                  targetBranch
                );
                configPath = selectedPath.includes('/')
                  ? selectedPath.substring(0, selectedPath.lastIndexOf('/'))
                  : '';
                shouldLoadFootprints = false;
                console.log(
                  `[Codeberg] No default config file found, using: ${selectedPath}`
                );
              } else {
                throw new Error(
                  'No YAML configuration files found in repository'
                );
              }
            }
          }
        }
      }

      // Enforce file size limit of 10MB for config
      enforceFileSizeLimit(configText.length, false);

      const footprints: GitHubFootprint[] = [];
      const outlines: GitHubFootprint[] = [];
      const templates: GitHubFootprint[] = [];

      if (!shouldLoadFootprints) {
        console.log(
          '[Codeberg] Skipping footprint loading for non-config.yaml/yml file'
        );
        return {
          config: configText,
          footprints,
          outlines,
          templates,
          configPath,
        };
      }

      // Helper to fetch files recursively from Codeberg repository
      const fetchFiles = async (
        dirPathSegment: string,
        targetCollection: GitHubFootprint[],
        allowedExtensions: string[]
      ) => {
        const fullDirPath = configPath
          ? `${configPath}/${dirPathSegment}`
          : dirPathSegment;
        const apiUrl = `https://codeberg.org/api/v1/repos/${owner}/${repo}/contents/${fullDirPath}?ref=${targetBranch}`;
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
                if (hasAllowedExt) {
                  try {
                    const content = await fetchFileContentCodeberg(
                      owner,
                      repo,
                      item.path,
                      targetBranch
                    );
                    const cleanName = item.path
                      .slice(fullDirPath.length + 1)
                      .replace(/\.[^/.]+$/, '');
                    targetCollection.push({ name: cleanName, content });
                  } catch (err) {
                    console.warn(`Failed to fetch file ${item.path}:`, err);
                  }
                }
              } else if (item.type === 'dir') {
                await fetchFiles(
                  item.path.slice(configPath ? configPath.length + 1 : 0),
                  targetCollection,
                  allowedExtensions
                );
              }
            }
          }
        } catch (e) {
          console.warn(`[Codeberg] Failed to fetch folder ${fullDirPath}:`, e);
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
        configPath,
        targetBranch,
        configPath ? `${configPath}/footprints` : 'footprints',
        configPath ? `${configPath}/outlines` : 'outlines',
        configPath ? `${configPath}/templates` : 'templates',
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
