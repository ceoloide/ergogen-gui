import { useState, useEffect } from 'react';
import { fetchConfigFromUrl } from '../utils/github';

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

  useEffect(() => {
    const loadInitialConfig = async () => {
      // Check for GitHub URL parameter
      const queryParameters = new URLSearchParams(window.location.search);
      const githubUrl = queryParameters.get('github');

      // Check for hash error (passed via props or context usually, but here we check URL hash if needed,
      // though typically hash parsing happens before this hook runs in the main App)
      // For this hook, we'll assume hash handling is done elsewhere or we can add it if needed.
      // The original code had `hashError` prop. We might need to pass it in if we want to respect it.

      if (githubUrl) {
        setIsLoading(true);
        console.log('[useConfigLoader] Loading from URL parameter:', githubUrl);

        try {
          const result = await fetchConfigFromUrl(githubUrl);
          console.log('[useConfigLoader] Fetch result:', {
            configLength: result.config.length,
            footprintsCount: result.footprints.length,
            configPath: result.configPath,
            rateLimitWarning: result.rateLimitWarning,
          });

          // Show rate limit warning if present
          if (result.rateLimitWarning) {
            setError(result.rateLimitWarning);
          }

          // Convert footprints to injection array format
          const newInjections: string[][] = result.footprints.map((fp) => [
            'footprint',
            fp.name,
            fp.content,
          ]);

          // Process injections with conflict resolution
          await processInjectionsWithConflictResolution(
            newInjections,
            result.config
          );
        } catch (e) {
          console.error('[useConfigLoader] Failed to load from GitHub:', e);
          setError(
            `Failed to load from GitHub: ${e instanceof Error ? e.message : String(e)}`
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadInitialConfig();
  }, [processInjectionsWithConflictResolution, setError]); // Run once on mount

  return { isLoading };
};
