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

      if (githubUrl) {
        setIsLoading(true);
        console.log('[useConfigLoader] Loading from URL parameter:', githubUrl);

        try {
          const result = await fetchConfigFromUrl(githubUrl);
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

          // Convert footprints and outlines to injection array format
          const newInjections: string[][] = [
            ...result.footprints.map((fp) => [
              'footprint',
              fp.name,
              fp.content,
            ]),
            ...result.outlines.map((ol) => [
              'outline',
              ol.name,
              ol.content,
            ]),
          ];

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
