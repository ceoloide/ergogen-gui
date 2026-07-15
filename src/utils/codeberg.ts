import {
  GitProvider,
  ErgogenWorkspaceBundle,
  GitHubFootprint,
  gitProviderRegistry,
} from './gitProvider';
import { isFeatureEnabled } from './featureFlags';

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
        if (segments.length !== 2) {
          return false;
        }

        const reservedFirstSegments = [
          'explore',
          'issues',
          'pulls',
          'notifications',
          'settings',
          'org',
          'api',
        ];
        if (reservedFirstSegments.includes(segments[0].toLowerCase())) {
          return false;
        }

        return true;
      } catch (_e) {
        return false;
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

      return {
        config,
        footprints,
        outlines,
        templates,
        configPath: filename,
      };
    }

    // Otherwise, fetch config.yaml or config.yml from repository root branches
    const fetchWithBranch = async (
      branch: string
    ): Promise<ErgogenWorkspaceBundle> => {
      console.log(`[Codeberg] Attempting to fetch from branch: ${branch}`);

      // Try fetching config.yaml first
      let configText = '';
      let configPath = 'config.yaml';
      let response = await fetch(
        `https://codeberg.org/${owner}/${repo}/raw/branch/${branch}/config.yaml`
      );

      if (!response.ok) {
        // Fall back to config.yml
        response = await fetch(
          `https://codeberg.org/${owner}/${repo}/raw/branch/${branch}/config.yml`
        );
        configPath = 'config.yml';
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch config.yaml or config.yml from branch: ${branch}`
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
        const apiUrl = `https://codeberg.org/api/v1/repos/${owner}/${repo}/contents/${dirPath}?ref=${branch}`;
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

      return {
        config: configText,
        footprints,
        outlines,
        templates,
        configPath,
      };
    };

    try {
      return await fetchWithBranch('main');
    } catch (_e) {
      return await fetchWithBranch('master');
    }
  }
}

// Register Codeberg provider
gitProviderRegistry.register(new CodebergProvider());
