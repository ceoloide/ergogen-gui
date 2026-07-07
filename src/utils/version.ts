import ergogenPkg from 'ergogen/package.json';

export interface VersionInfo {
  label: string;
  url: string;
  displayText: string;
  isCustom: boolean;
  isHash?: boolean;
  isTag?: boolean;
}

/**
 * Gets the Ergogen version label and GitHub URL for display in the UI.
 *
 * @param version The version string from the environment variable.
 * @returns An object containing the formatted label, URL, and metadata.
 */
export const getErgogenVersionInfo = (version?: string): VersionInfo => {
  const defaultVersionLabel = `v${ergogenPkg.version}`;
  const defaultVersion = ergogenPkg.version;

  const repoStr =
    typeof ergogenPkg.repository === 'string'
      ? ergogenPkg.repository
      : typeof ergogenPkg.repository === 'object' &&
          ergogenPkg.repository !== null &&
          'url' in ergogenPkg.repository
        ? (ergogenPkg.repository as { url: string }).url
        : 'https://github.com/ergogen/ergogen';

  const defaultUrl = repoStr.startsWith('github:')
    ? repoStr.replace('github:', 'https://github.com/')
    : repoStr.replace(/^git\+/, '').replace(/\.git$/, '');

  if (!version) {
    return {
      label: defaultVersionLabel,
      url: defaultUrl,
      displayText: defaultVersion,
      isCustom: false,
      isHash: false,
      isTag: false,
    };
  }

  // Handle NPM version (e.g., ergogen@4.2.0)
  if (version.includes('@')) {
    const parts = version.split('@');
    const verPart = parts[1] || version;
    return {
      label: version,
      url: version.startsWith('ergogen@')
        ? `${defaultUrl}/releases/tag/v${verPart}`
        : `https://www.npmjs.com/package/${parts[0]}`,
      displayText: verPart,
      isCustom: true,
      isHash: false,
      isTag: true,
    };
  }

  // Remove "github:" prefix if present for uniform processing
  const cleanVersion = version.startsWith('github:')
    ? version.slice(7)
    : version;

  // Split into repo and branch/ref
  const [repo, branch] = cleanVersion.split('#');
  const isOfficial = repo === 'ergogen/ergogen';
  const baseUrl = `https://github.com/${repo}`;

  if (isOfficial) {
    if (!branch) {
      return {
        label: 'latest',
        url: baseUrl,
        displayText: defaultVersion,
        isCustom: false,
        isHash: false,
        isTag: false,
      };
    }

    const isHash = branch.length === 40 && /^[0-9a-fA-F]{40}$/.test(branch);
    const displayText = isHash ? branch.substring(0, 7) : branch;
    const url = isHash
      ? `${baseUrl}/commit/${branch}`
      : `${baseUrl}/tree/${branch}`;

    return {
      label: branch,
      url,
      displayText,
      isCustom: true,
      isHash,
      isTag: !isHash,
    };
  }

  // For custom repos:
  if (!branch) {
    return {
      label: cleanVersion,
      url: baseUrl,
      displayText: defaultVersion,
      isCustom: true,
      isHash: false,
      isTag: false,
    };
  }

  const isHash = branch.length === 40 && /^[0-9a-fA-F]{40}$/.test(branch);
  const displayText = isHash ? branch.substring(0, 7) : branch;
  const url = isHash
    ? `${baseUrl}/commit/${branch}`
    : `${baseUrl}/tree/${branch}`;

  return {
    label: cleanVersion,
    url,
    displayText,
    isCustom: true,
    isHash,
    isTag: !isHash,
  };
};

/**
 * Resolves the full Ergogen version string in the format github:user/repo#version-tag.
 * If the official ergogen is used, it returns github:ergogen/ergogen#v<version>.
 *
 * @param version The version string from the environment variable (or config).
 * @returns The formatted version string.
 */
export const getFullErgogenVersion = (version?: string): string => {
  if (!version || version === 'undefined' || version === 'null') {
    return `github:ergogen/ergogen#v${ergogenPkg.version}`;
  }

  // Handle NPM version (e.g., ergogen@4.2.0)
  if (version.includes('@')) {
    const parts = version.split('@');
    const verPart = parts[1] || version;
    const pkgName = parts[0];
    const repo = pkgName === 'ergogen' ? 'ergogen/ergogen' : pkgName;
    return `github:${repo}#v${verPart}`;
  }

  // Remove "github:" prefix if present for uniform processing
  const cleanVersion = version.startsWith('github:')
    ? version.slice(7)
    : version;

  // Split into repo and branch/ref
  const [repo, branch] = cleanVersion.split('#');

  if (!branch) {
    return `github:${repo}#v${ergogenPkg.version}`;
  }

  return `github:${repo}#${branch}`;
};
