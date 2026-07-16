import { isFeatureEnabled } from './featureFlags';
import { enforceFileSizeLimit } from './ergogenBundleLoader';
import { GIT_BFS_MAX_REQUESTS, GIT_BFS_MAX_DEPTH } from '../context/constants';

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export interface GitInjection {
  name: string;
  content: string;
}

export interface ErgogenWorkspaceBundle {
  config: string;
  footprints: GitInjection[];
  outlines: GitInjection[];
  templates: GitInjection[];
  configPath: string;
  rateLimitWarning?: string;
}

interface GitProvider {
  canHandle(url: string): boolean;
  fetchConfig(url: string): Promise<ErgogenWorkspaceBundle>;
}

export interface GitFileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
}

// Global registry of providers
class GitProviderRegistry {
  private providers: GitProvider[] = [];

  register(provider: GitProvider) {
    this.providers.push(provider);
  }

  resolve(url: string): GitProvider | null {
    const cleanUrl = url.trim();
    for (const provider of this.providers) {
      if (provider.canHandle(cleanUrl)) {
        return provider;
      }
    }
    // Fallback: If it's a simple owner/repo structure (no host), default to the first provider (GitHub)
    if (/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(cleanUrl)) {
      return this.providers[0] || null;
    }
    return null;
  }
}

export const gitProviderRegistry = new GitProviderRegistry();

/**
 * Parses the content of a .gitmodules file and returns the list of submodules.
 */
export const parseGitmodules = (
  content: string
): Array<{ path: string; url: string }> => {
  const submodules: Array<{ path: string; url: string }> = [];
  const lines = content.split('\n');
  let currentSubmodule: { path?: string; url?: string } = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('[submodule')) {
      if (currentSubmodule.path && currentSubmodule.url) {
        submodules.push({
          path: currentSubmodule.path,
          url: currentSubmodule.url,
        });
      }
      currentSubmodule = {};
    } else {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex !== -1) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        if (key === 'path') {
          currentSubmodule.path = value;
        } else if (key === 'url') {
          currentSubmodule.url = value;
        }
      }
    }
  }

  if (currentSubmodule.path && currentSubmodule.url) {
    submodules.push({
      path: currentSubmodule.path,
      url: currentSubmodule.url,
    });
  }

  return submodules;
};

/**
 * Abstract Base Class for Git Providers that centralizes all orchestration logic.
 */
export abstract class BaseGitProvider implements GitProvider {
  abstract canHandle(url: string): boolean;

  // Primitives to be implemented by each concrete provider:
  abstract parseUrl(url: string): {
    owner: string;
    repo: string;
    branch: string;
    filePath?: string;
    isRepoRoot: boolean;
    baseUrl: string;
    host?: string;
  };

  abstract fetchFileContent(
    owner: string,
    repo: string,
    path: string,
    ref: string,
    host?: string
  ): Promise<string>;

  abstract listDirectory(
    owner: string,
    repo: string,
    path: string,
    ref: string,
    host?: string
  ): Promise<GitFileItem[]>;

  // Hook for provider-specific response validation (e.g. rate limit checking)
  protected onResponse?(response: Response, url: string): void;

  /**
   * Main entry point to fetch workspace configuration.
   */
  async fetchConfig(url: string): Promise<ErgogenWorkspaceBundle> {
    const parsed = this.parseUrl(url);
    const { owner, repo, branch, filePath, isRepoRoot } = parsed;
    const host = parsed.host;

    const footprints: GitInjection[] = [];
    const outlines: GitInjection[] = [];
    const templates: GitInjection[] = [];

    // Helper to process submodules recursively
    const processSubmodules = async (
      dirPath: string,
      targetBranch: string,
      footprintsPath: string,
      outlinesPath: string,
      templatesPath: string
    ) => {
      try {
        const gitmodulesContent = await this.fetchFileContent(
          owner,
          repo,
          '.gitmodules',
          targetBranch,
          host
        );
        const submodules = parseGitmodules(gitmodulesContent);

        for (const submodule of submodules) {
          if (
            submodule.path.includes(footprintsPath) ||
            (submodule.path.includes(outlinesPath) &&
              isFeatureEnabled('outlines')) ||
            (submodule.path.includes(templatesPath) &&
              isFeatureEnabled('templates'))
          ) {
            const isOutline = submodule.path.includes(outlinesPath);
            const isTemplate = submodule.path.includes(templatesPath);
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

            const relativePath = submodule.path.substring(
              submodule.path.indexOf(currentPath) + currentPath.length + 1
            );

            // Resolve provider for the submodule URL
            const subProvider = gitProviderRegistry.resolve(submodule.url);
            if (subProvider instanceof BaseGitProvider) {
              const subParsed = subProvider.parseUrl(submodule.url);
              const subHost = subParsed.host;
              let submoduleFootprints: GitInjection[] = [];

              try {
                submoduleFootprints =
                  await subProvider.fetchFootprintsFromDirectory(
                    subParsed.owner,
                    subParsed.repo,
                    '',
                    'main',
                    ['.js'],
                    subHost
                  );
              } catch (_e) {
                if (_e instanceof RateLimitError) throw _e;
                try {
                  submoduleFootprints =
                    await subProvider.fetchFootprintsFromDirectory(
                      subParsed.owner,
                      subParsed.repo,
                      '',
                      'master',
                      ['.js'],
                      subHost
                    );
                } catch (_e2) {
                  if (_e2 instanceof RateLimitError) throw _e2;
                  console.warn(
                    `Failed to fetch submodule footprints from ${submodule.url}`
                  );
                }
              }

              const prefixedFootprints = submoduleFootprints.map((fp) => ({
                name: relativePath ? `${relativePath}/${fp.name}` : fp.name,
                content: fp.content,
              }));
              currentCollection.push(...prefixedFootprints);
            }
          }
        }
      } catch (_error) {
        if (_error instanceof RateLimitError) throw _error;
        // No .gitmodules found or failed to parse (perfectly fine)
      }
    };

    // 1. If it's a direct file URL, load it directly
    if (!isRepoRoot) {
      if (!filePath) {
        throw new Error('Invalid URL. File path not specified.');
      }

      const config = await this.fetchFileContent(
        owner,
        repo,
        filePath,
        branch,
        host
      );
      enforceFileSizeLimit(config.length, false);

      const filename = filePath.split('/').pop() || '';
      const shouldLoadFootprints =
        filename === 'config.yaml' || filename === 'config.yml';

      if (!shouldLoadFootprints) {
        return {
          config,
          footprints: [],
          outlines: [],
          templates: [],
          configPath: filename,
        };
      }

      // If it's a root config.yaml/yml, load subfolder injections
      const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
      const footprintsPath = dirPath ? `${dirPath}/footprints` : 'footprints';
      const outlinesPath = dirPath ? `${dirPath}/outlines` : 'outlines';
      const templatesPath = dirPath ? `${dirPath}/templates` : 'templates';

      try {
        const resolvedFootprints = await this.fetchFootprintsFromDirectory(
          owner,
          repo,
          footprintsPath,
          branch,
          ['.js'],
          host
        );
        footprints.push(...resolvedFootprints);
      } catch (_e) {
        if (_e instanceof RateLimitError) throw _e;
        // Optional folder missing
      }

      if (isFeatureEnabled('outlines')) {
        try {
          const resolvedOutlines = await this.fetchFootprintsFromDirectory(
            owner,
            repo,
            outlinesPath,
            branch,
            ['.js', '.svg'],
            host
          );
          outlines.push(...resolvedOutlines);
        } catch (_e) {
          if (_e instanceof RateLimitError) throw _e;
          // Optional folder missing
        }
      }
      if (isFeatureEnabled('templates')) {
        try {
          const resolvedTemplates = await this.fetchFootprintsFromDirectory(
            owner,
            repo,
            templatesPath,
            branch,
            ['.js'],
            host
          );
          templates.push(...resolvedTemplates);
        } catch (_e) {
          if (_e instanceof RateLimitError) throw _e;
          // Optional folder missing
        }
      }

      await processSubmodules(
        dirPath,
        branch,
        footprintsPath,
        outlinesPath,
        templatesPath
      );

      return {
        config,
        footprints,
        outlines,
        templates,
        configPath: filename,
      };
    }

    // 2. Otherwise, fetch config from repository root using fallbacks & BFS
    const fetchWithBranch = async (
      targetBranch: string
    ): Promise<ErgogenWorkspaceBundle> => {
      let configText = '';
      let configPath = '';
      let shouldLoadFootprints = true;

      // Check heuristics order:
      // a. Try config.yaml in root
      try {
        configText = await this.fetchFileContent(
          owner,
          repo,
          'config.yaml',
          targetBranch,
          host
        );
        configPath = '';
      } catch (e: unknown) {
        const err = e as Error;
        if (
          err.message?.includes('allowance') ||
          err.message?.includes('limit exceeded') ||
          err.message?.includes('rate limit')
        ) {
          throw err;
        }
        // b. Try config.yml in root
        try {
          configText = await this.fetchFileContent(
            owner,
            repo,
            'config.yml',
            targetBranch,
            host
          );
          configPath = '';
        } catch (e2: unknown) {
          const err2 = e2 as Error;
          if (
            err2.message?.includes('allowance') ||
            err2.message?.includes('limit exceeded') ||
            err2.message?.includes('rate limit')
          ) {
            throw err2;
          }
          // c. Try ergogen/config.yaml
          try {
            configText = await this.fetchFileContent(
              owner,
              repo,
              'ergogen/config.yaml',
              targetBranch,
              host
            );
            configPath = 'ergogen';
          } catch (e3: unknown) {
            const err3 = e3 as Error;
            if (
              err3.message?.includes('allowance') ||
              err3.message?.includes('limit exceeded') ||
              err3.message?.includes('rate limit')
            ) {
              throw err3;
            }
            // d. Try ergogen/config.yml
            try {
              configText = await this.fetchFileContent(
                owner,
                repo,
                'ergogen/config.yml',
                targetBranch,
                host
              );
              configPath = 'ergogen';
            } catch (e4: unknown) {
              const err4 = e4 as Error;
              if (
                err4.message?.includes('allowance') ||
                err4.message?.includes('limit exceeded') ||
                err4.message?.includes('rate limit')
              ) {
                throw err4;
              }
              // e. Run Breadth-First Search (BFS)
              const { configYamls, anyYamls } = await this.bfsForYamlFiles(
                owner,
                repo,
                targetBranch,
                host
              );

              if (configYamls.length > 0) {
                const selectedPath = configYamls[0];
                configText = await this.fetchFileContent(
                  owner,
                  repo,
                  selectedPath,
                  targetBranch,
                  host
                );
                configPath = selectedPath.includes('/')
                  ? selectedPath.substring(0, selectedPath.lastIndexOf('/'))
                  : '';
              } else if (anyYamls.length > 0) {
                const selectedPath = anyYamls[0];
                configText = await this.fetchFileContent(
                  owner,
                  repo,
                  selectedPath,
                  targetBranch,
                  host
                );
                configPath = selectedPath.includes('/')
                  ? selectedPath.substring(0, selectedPath.lastIndexOf('/'))
                  : '';
                shouldLoadFootprints = false;
              } else {
                throw new Error(
                  'No YAML configuration files found in repository'
                );
              }
            }
          }
        }
      }

      enforceFileSizeLimit(configText.length, false);

      if (!shouldLoadFootprints) {
        return {
          config: configText,
          footprints: [],
          outlines: [],
          templates: [],
          configPath,
        };
      }

      const footprintsPath = configPath
        ? `${configPath}/footprints`
        : 'footprints';
      const outlinesPath = configPath ? `${configPath}/outlines` : 'outlines';
      const templatesPath = configPath
        ? `${configPath}/templates`
        : 'templates';

      try {
        const resolvedFootprints = await this.fetchFootprintsFromDirectory(
          owner,
          repo,
          footprintsPath,
          targetBranch,
          ['.js']
        );
        footprints.push(...resolvedFootprints);
      } catch (_e) {
        if (_e instanceof RateLimitError) throw _e;
        // Optional folder missing
      }

      if (isFeatureEnabled('outlines')) {
        try {
          const resolvedOutlines = await this.fetchFootprintsFromDirectory(
            owner,
            repo,
            outlinesPath,
            targetBranch,
            ['.js', '.svg']
          );
          outlines.push(...resolvedOutlines);
        } catch (_e) {
          if (_e instanceof RateLimitError) throw _e;
          // Optional folder missing
        }
      }
      if (isFeatureEnabled('templates')) {
        try {
          const resolvedTemplates = await this.fetchFootprintsFromDirectory(
            owner,
            repo,
            templatesPath,
            targetBranch,
            ['.js']
          );
          templates.push(...resolvedTemplates);
        } catch (_e) {
          if (_e instanceof RateLimitError) throw _e;
          // Optional folder missing
        }
      }

      await processSubmodules(
        configPath,
        targetBranch,
        footprintsPath,
        outlinesPath,
        templatesPath
      );

      return {
        config: configText,
        footprints,
        outlines,
        templates,
        configPath,
      };
    };

    // Fallback branch logic: main -> master
    if (branch !== 'main') {
      return await fetchWithBranch(branch);
    }

    try {
      return await fetchWithBranch('main');
    } catch (_e) {
      if (_e instanceof RateLimitError) throw _e;
      return await fetchWithBranch('master');
    }
  }

  /**
   * Recursively fetches footprint/outline/template files from a directory.
   */
  async fetchFootprintsFromDirectory(
    owner: string,
    repo: string,
    dirPath: string,
    branch: string,
    allowedExtensions: string[],
    host?: string
  ): Promise<GitInjection[]> {
    const result: GitInjection[] = [];
    const fetchRec = async (p: string) => {
      try {
        const items = await this.listDirectory(owner, repo, p, branch, host);
        for (const item of items) {
          const itemPath = item.path.startsWith(p)
            ? item.path
            : p
              ? `${p}/${item.path}`
              : item.path;

          if (item.type === 'file') {
            const hasAllowedExt = allowedExtensions.some((ext) =>
              item.name.endsWith(ext)
            );
            if (hasAllowedExt) {
              try {
                const content = await this.fetchFileContent(
                  owner,
                  repo,
                  itemPath,
                  branch,
                  host
                );
                const cleanName = dirPath
                  ? itemPath.slice(dirPath.length + 1).replace(/\.[^/.]+$/, '')
                  : itemPath.replace(/\.[^/.]+$/, '');
                result.push({ name: cleanName, content });
              } catch (err: unknown) {
                if (err instanceof RateLimitError) throw err;
                const error = err as Error;
                console.warn(
                  `Failed to fetch file content: ${itemPath}`,
                  error.stack || error
                );
              }
            }
          } else if (item.type === 'dir') {
            await fetchRec(itemPath);
          }
        }
      } catch (_e) {
        if (_e instanceof RateLimitError) throw _e;
        // Folder directory does not exist or inaccessible (standard case)
      }
    };
    await fetchRec(dirPath);
    return result;
  }

  /**
   * Breadth-First Search (BFS) implementation with depth and request limits.
   */
  async bfsForYamlFiles(
    owner: string,
    repo: string,
    branch: string,
    host?: string
  ): Promise<{
    configYamls: string[];
    anyYamls: string[];
  }> {
    const configYamls: string[] = [];
    const anyYamls: string[] = [];
    const queue: { path: string; depth: number }[] = [{ path: '', depth: 0 }];
    const visited = new Set<string>();
    let requestsCount = 0;

    while (queue.length > 0 && requestsCount < GIT_BFS_MAX_REQUESTS) {
      const { path: currentPath, depth } = queue.shift()!;
      if (visited.has(currentPath)) continue;
      visited.add(currentPath);

      try {
        requestsCount++;
        const items = await this.listDirectory(
          owner,
          repo,
          currentPath,
          branch,
          host
        );
        for (const item of items) {
          if (item.type === 'file') {
            const cleanName = item.name.toLowerCase();
            const isYaml =
              (cleanName.endsWith('.yaml') || cleanName.endsWith('.yml')) &&
              !cleanName.startsWith('.') &&
              cleanName.replace(/\.(yaml|yml)$/, '') !== 'metadata' &&
              cleanName.replace(/\.(yaml|yml)$/, '') !== 'virtual_env';
            if (isYaml) {
              if (item.name === 'config.yaml' || item.name === 'config.yml') {
                configYamls.push(item.path);
              } else {
                anyYamls.push(item.path);
              }
            }
          } else if (item.type === 'dir' && depth < GIT_BFS_MAX_DEPTH) {
            if (!item.name.startsWith('.')) {
              queue.push({ path: item.path, depth: depth + 1 });
            }
          }
        }

        // If we found any config.yaml/yml, we can stop immediately since they are preferred
        if (configYamls.length > 0) {
          break;
        }

        // If we found any yaml files at the current level, and we have no more items
        // in the queue at the same depth, we can stop to avoid unnecessary deep scanning.
        if (
          anyYamls.length > 0 &&
          (queue.length === 0 || queue[0].depth > depth)
        ) {
          break;
        }
      } catch (error: unknown) {
        const err = error as Error;
        if (
          err.message?.includes('allowance') ||
          err.message?.includes('limit exceeded') ||
          err.message?.includes('rate limit')
        ) {
          throw err;
        }
        continue;
      }
    }

    return { configYamls, anyYamls };
  }
}
