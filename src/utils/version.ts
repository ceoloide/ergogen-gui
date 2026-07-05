export interface VersionInfo {
  label: string;
  url: string;
}

/**
 * Gets the Ergogen version label and GitHub URL for display in the UI.
 *
 * @param version The version string from the environment variable.
 * @returns An object containing the formatted label and the corresponding URL.
 */
export const getErgogenVersionInfo = (version?: string): VersionInfo => {
  const defaultVersion = 'v4.2.1';
  const defaultUrl = 'https://github.com/ergogen/ergogen';

  if (!version) {
    return { label: defaultVersion, url: defaultUrl };
  }

  // Handle NPM version (e.g., ergogen@4.2.0)
  if (version.includes('@')) {
    return {
      label: version,
      url: version.startsWith('ergogen@')
        ? `${defaultUrl}/releases/tag/v${version.split('@')[1]}`
        : `https://www.npmjs.com/package/${version.split('@')[0]}`,
    };
  }

  // Remove "github:" prefix if present for uniform processing
  const cleanVersion = version.startsWith('github:')
    ? version.slice(7)
    : version;

  // Split into repo and branch
  const [repo, branch] = cleanVersion.split('#');
  const isOfficial = repo === 'ergogen/ergogen';
  const baseUrl = `https://github.com/${repo}`;

  if (isOfficial) {
    if (!branch) {
      return { label: 'latest', url: baseUrl };
    }
    // For official repo, only show the branch/tag
    return { label: branch, url: `${baseUrl}/tree/${branch}` };
  }

  // For custom repos, show the full clean version string (e.g., user/repo or user/repo#branch)
  return {
    label: cleanVersion,
    url: branch ? `${baseUrl}/tree/${branch}` : baseUrl,
  };
};
