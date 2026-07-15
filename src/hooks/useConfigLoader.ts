import { useState, useEffect, useRef } from 'react';
import { fetchConfigFromUrl } from '../utils/github';
import { mapSeparateToInjectionsArray } from '../utils/ergogenBundleLoader';
import '../utils/codeberg';

interface UseConfigLoaderProps {
  processInjectionsWithConflictResolution: (
    newInjections: string[][],
    config: string
  ) => Promise<void>;
  setError: (error: string) => void;
}

export const useConfigLoader = ({
  processInjectionsWithConflictResolution,
  setError,
}: UseConfigLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const loadInitialConfig = async () => {
      // Check for GitHub/Codeberg URL parameter
      const queryParameters = new URLSearchParams(window.location.search);
      const githubUrl = queryParameters.get('github');
      const codebergUrl = queryParameters.get('codeberg');

      let remoteUrl = githubUrl || codebergUrl;

      if (remoteUrl) {
        if (codebergUrl && !codebergUrl.includes('codeberg.org')) {
          remoteUrl = `https://codeberg.org/${codebergUrl}`;
        } else if (githubUrl && !githubUrl.includes('github.com')) {
          remoteUrl = `https://github.com/${githubUrl}`;
        }

        setIsLoading(true);
        console.log('[useConfigLoader] Loading from URL parameter:', remoteUrl);

        try {
          const result = await fetchConfigFromUrl(remoteUrl);
          console.log('[useConfigLoader] Fetch result:', {
            configLength: result.config.length,
            footprintsCount: result.footprints.length,
            outlinesCount: result.outlines.length,
            configPath: result.configPath,
            rateLimitWarning: result.rateLimitWarning,
          });

          // Show rate limit warning if present
          if (result.rateLimitWarning) {
            setError(result.rateLimitWarning);
          }

          // Convert footprints, outlines, and templates to injection array format
          const newInjections = mapSeparateToInjectionsArray(
            result.footprints,
            result.outlines,
            result.templates
          );

          // Process injections with conflict resolution
          await processInjectionsWithConflictResolution(
            newInjections,
            result.config
          );
        } catch (e) {
          console.error(
            '[useConfigLoader] Failed to load from remote repository:',
            e
          );
          setError(
            `Failed to load from remote repository: ${e instanceof Error ? e.message : String(e)}`
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadInitialConfig();
    }
  }, [processInjectionsWithConflictResolution, setError]); // Run once on mount

  return { isLoading };
};
