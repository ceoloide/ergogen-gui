/**
 * Formats the Ergogen version string for display in the UI.
 *
 * @param version The version string from the environment variable.
 * @returns A formatted version string.
 */
export const formatErgogenVersion = (version?: string): string => {
  if (!version) {
    return 'v4.2.1';
  }

  // Handle "latest" for the main repository
  if (version === 'ergogen/ergogen' || version === 'github:ergogen/ergogen') {
    return 'latest';
  }

  // Extract branch or tag from "user/repo#branch" or "github:user/repo#branch"
  const parts = version.split('#');
  if (parts.length > 1) {
    return parts[1];
  }

  // Extract repo name if no branch is specified (e.g., "user/repo")
  const repoParts = parts[0].split('/');
  if (repoParts.length > 1) {
    return repoParts[1];
  }

  // Return the version as is (e.g., "ergogen@4.2.0")
  return version;
};
