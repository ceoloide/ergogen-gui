import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useConfigContext } from '../context/ConfigContext';
import { exampleOptions, ConfigOption } from '../examples';
import EmptyYAML from '../examples/empty_yaml';
import { fetchConfigFromUrl, GitHubFootprint } from '../utils/github';
import { ConflictResolutionStrategy } from '../utils/injections';
import { loadLocalFile } from '../utils/localFiles';
import { mapSeparateToInjectionsArray } from '../utils/ergogenBundleLoader';
import Button from '../atoms/Button';
import ConflictResolutionDialog from '../molecules/ConflictResolutionDialog';
import { trackEvent } from '../utils/analytics';
import { useInjectionConflictResolution } from '../hooks/useInjectionConflictResolution';
import GithubIcon from '../atoms/GithubIcon';
import CodebergIcon from '../atoms/CodebergIcon';

const Spinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid ${theme.colors.accent};
  width: 1.2rem;
  height: 1.2rem;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.5rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const WelcomePageWrapper = styled.div<{ $isDragging?: boolean }>`
  background-color: ${theme.colors.background};
  color: ${theme.colors.white};
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: border-color 0.2s ease;

  ${(props) =>
    props.$isDragging &&
    `
    border: 3px dashed ${theme.colors.accent};
    border-radius: 8px;
  `}
`;

const DropOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$isVisible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 999;
  pointer-events: none;
`;

const DropMessage = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border: 3px dashed ${theme.colors.accent};
  border-radius: 8px;
  padding: 2rem;
  font-size: ${theme.fontSizes.h3};
  color: ${theme.colors.text};
  text-align: center;
`;

const WelcomeContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`;

const Header = styled.h1`
  font-size: ${theme.fontSizes.h1};
  text-align: center;
  margin-bottom: 1rem;
`;

const SubHeader = styled.p`
  font-size: ${theme.fontSizes.lg};
  text-align: center;
  margin-bottom: 3rem;
  color: ${theme.colors.textDark};
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const OptionBox = styled.div`
  background-color: ${theme.colors.backgroundLight};
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border};
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 900px) {
    width: 100%;
    padding: 1.5rem 1rem;
  }

  @media (min-width: 901px) {
    max-width: 350px;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  p {
    color: ${theme.colors.textDarker};
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }
`;

const GitHubInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;

  button {
    flex-shrink: 0;
  }
`;

const RepoSelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  padding: 0 0.5rem 0 0.75rem;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    color: ${theme.colors.textDark};
  }
`;

const RepoSelect = styled.select`
  background: transparent;
  border: none;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  outline: none;
  cursor: pointer;
  padding: 0.75rem 1.5rem 0.75rem 0.25rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 50%;

  option {
    background-color: ${theme.colors.backgroundLight};
    color: ${theme.colors.text};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const GitHubInput = styled.input`
  flex: 1;
  min-width: 0;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  outline: none;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: ${theme.colors.accent};
  }

  &::selection {
    background-color: ${theme.colors.accent};
    color: ${theme.colors.white};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ExamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ExampleCard = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border-radius: 8px;
  border: 1px solid ${theme.colors.border};
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

const ExampleImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${theme.colors.backgroundLighter};
`;

const ExampleName = styled.div`
  padding: 1rem;
  font-weight: ${theme.fontWeights.semiBold};
  text-align: center;
`;

const ExampleSvgWrapper = styled.div`
  width: 100%;
  height: 150px;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${theme.colors.backgroundLighter};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const FallbackIconContainer = styled.div`
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  background-color: ${theme.colors.backgroundLighter};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textDarker};

  .material-symbols-outlined {
    font-size: 4rem;
  }
`;

// Flatten examples into a single list, excluding the "Empty" one which has a dedicated button
const allExamples: ConfigOption[] = exampleOptions
  .flatMap((group) => group.options)
  .filter((ex) => ex.label !== 'Empty YAML configuration');

const Welcome = () => {
  const navigate = useNavigate();
  const configContext = useConfigContext();
  const [githubInput, setGithubInput] = useState('');
  const [provider, setProvider] = useState<'github' | 'codeberg'>('github');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const handleRepoInputChange = (val: string) => {
    setGithubInput(val);
    if (val.includes('github.com/')) {
      setProvider('github');
    } else if (val.includes('codeberg.org/')) {
      setProvider('codeberg');
    }
  };

  // Use the injection conflict resolution hook
  const {
    currentConflict,
    processInjectionsWithConflictResolution,
    handleConflictResolution: handleConflictResolutionBase,
    handleConflictCancel: handleConflictCancelBase,
  } = useInjectionConflictResolution({
    setInjectionInput: (injections) =>
      configContext?.setInjectionInput(injections),
    setConfigInput: (config) => configContext?.setConfigInput(config),
    generateNow: async (config, injections, options) => {
      if (configContext) {
        await configContext.generateNow(config, injections, options);
      }
    },
    getCurrentInjections: () => configContext?.injectionInput || [],
    onComplete: async () => {
      setShouldNavigate(true);
    },
    setError: (error) => configContext?.setError(error),
  });

  // Navigate to home when config has been set
  useEffect(() => {
    if (shouldNavigate && configContext?.configInput) {
      navigate('/');
      setShouldNavigate(false);
    }
  }, [shouldNavigate, configContext?.configInput, navigate]);

  // Prune deleted configs on mount
  useEffect(() => {
    configContext?.pruneDeletedConfigs?.();
  }, [configContext]);

  const handleSelectExample = async (configValue: string) => {
    if (configContext) {
      // Determine if this is the empty config
      const isEmptyConfig = configValue === EmptyYAML.value;

      // Find the example name by searching through all examples
      let exampleName = 'unknown';
      if (isEmptyConfig) {
        exampleName = 'empty_configuration';
      } else {
        const foundExample = allExamples.find((ex) => ex.value === configValue);
        if (foundExample) {
          exampleName = foundExample.label.toLowerCase().replace(/\s+/g, '_');
        }
      }

      trackEvent('example_loaded', {
        example_name: exampleName,
        is_empty: isEmptyConfig,
      });
      configContext.createNewConfig(configValue);
      await configContext.generateNow(
        configValue,
        configContext.injectionInput,
        { pointsonly: false }
      );
      setShouldNavigate(true);
    }
  };

  const handleSelectSavedConfig = async (id: string) => {
    if (configContext) {
      const cfg = configContext.configs.find((c) => c.id === id);
      if (cfg) {
        configContext.selectConfig(id);
        trackEvent('saved_config_loaded', {
          config_name: cfg.name,
          config_id: cfg.id,
        });
        await configContext.generateNow(
          cfg.config,
          configContext.injectionInput,
          { pointsonly: false }
        );
        setShouldNavigate(true);
      }
    }
  };

  const savedConfigs = configContext?.configs || [];
  const latestConfigs = [...savedConfigs]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 4);

  /**
   * Processes footprints (or any injections) with conflict resolution.
   * Converts GitHubFootprint[] to string[][] and uses the conflict resolution hook.
   */
  const processInjections = async (
    footprints: GitHubFootprint[],
    outlines: GitHubFootprint[],
    templates: GitHubFootprint[],
    config: string,
    resolution: ConflictResolutionStrategy | null = null,
    currentInjections?: string[][]
  ): Promise<void> => {
    if (!configContext) {
      throw new Error('Configuration context not available');
    }

    // Convert footprints, outlines, and templates to injection array format
    const injections = mapSeparateToInjectionsArray(
      footprints,
      outlines,
      templates
    );

    // Use the hook's process function
    await processInjectionsWithConflictResolution(
      injections,
      config,
      resolution,
      currentInjections
    );
  };

  /**
   * Wrapper for handleConflictResolution that cleans up footprint-specific state.
   * The base handler already processes remaining injections internally.
   */
  const handleConflictResolution = async (
    action: ConflictResolutionStrategy,
    applyToAllConflicts: boolean
  ) => {
    // Call the base handler - it handles all remaining injections internally
    await handleConflictResolutionBase(action, applyToAllConflicts);

    // Clean up footprint-specific state after processing completes
    // (The hook manages its own internal state)
  };

  const handleConflictCancel = () => {
    handleConflictCancelBase();
    setIsLoading(false);
    configContext?.setIsGenerating(false);
  };

  const handleGitHub = () => {
    if (!githubInput || !configContext) return;
    const { setError, clearError, setIsGenerating } = configContext;
    setIsLoading(true);
    setIsGenerating(true); // Show progress bar during loading
    clearError();

    // Track loading
    trackEvent('repo_loaded', {
      repo_url: githubInput,
      provider,
    });

    let fetchUrl = githubInput.trim();
    if (
      !fetchUrl.includes('://') &&
      !fetchUrl.includes('github.com') &&
      !fetchUrl.includes('codeberg.org')
    ) {
      if (provider === 'codeberg') {
        fetchUrl = `https://codeberg.org/${fetchUrl}`;
      } else {
        fetchUrl = `https://github.com/${fetchUrl}`;
      }
    }

    fetchConfigFromUrl(fetchUrl)
      .then(async (result) => {
        if (configContext) {
          // Show rate limit warning if present
          if (result.rateLimitWarning) {
            setError(result.rateLimitWarning);
          }

          try {
            configContext.createNewConfig(result.config);

            const footprintCount = result.footprints.length;
            const outlineCount = result.outlines.length;
            const templateCount = result.templates.length;

            if (footprintCount || outlineCount || templateCount) {
              configContext.setInfo(
                `Config loaded successfully from GitHub. Found ${footprintCount} footprints, ${outlineCount} outlines, and ${templateCount} templates.`
              );
            } else {
              configContext.setInfo('Config loaded successfully from GitHub.');
            }

            // Process footprints with conflict resolution
            await processInjections(
              result.footprints,
              result.outlines,
              result.templates || [],
              result.config
            );
          } catch (error) {
            // If footprint processing fails, don't load the config
            throw new Error(
              `Failed to process footprints: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }
      })
      .catch((e) => {
        setError(`Failed to load from remote repository: ${e.message}`);
        configContext?.setInfo(null);
        // Ensure we reset loading state and don't navigate
        setIsLoading(false);
        setIsGenerating(false);
      })
      .finally(() => {
        setIsLoading(false);
        // Note: isGenerating will be reset by generateNow or needs explicit reset on error
      });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Shared function to process a file
  const processFile = async (file: File) => {
    if (!configContext) return;

    const { setError, clearError, setIsGenerating } = configContext;
    setIsLoading(true);
    setIsGenerating(true); // Show progress bar during file loading
    clearError();

    // Track local file loading
    trackEvent('local_file_loaded', {
      file_name: file.name,
      file_type: file.type || 'unknown',
      file_size: file.size,
    });

    // Reset any pending conflict resolution state from previous loads
    // Note: currentConflict is managed by the hook, so we only reset local state

    try {
      const result = await loadLocalFile(file);

      configContext.createNewConfig(result.config);

      const footprintCount = result.footprints.length;
      const outlineCount = result.outlines.length;
      const templateCount = result.templates.length;

      if (footprintCount || outlineCount || templateCount) {
        configContext.setInfo(
          `Config loaded successfully. Found ${footprintCount} footprints, ${outlineCount} outlines, and ${templateCount} templates.`
        );
      } else {
        configContext.setInfo('Config loaded successfully.');
      }

      // Process footprints with conflict resolution
      await processInjections(
        result.footprints,
        result.outlines,
        result.templates || [],
        result.config
      );
    } catch (error) {
      setError(
        `Failed to load local file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      configContext.setInfo(null);
      // Ensure we reset loading state and don't navigate
      setIsLoading(false);
      setIsGenerating(false);
    } finally {
      setIsLoading(false);
      // Note: isGenerating will be reset by generateNow or needs explicit reset on error
    }
  };

  const handleLocalFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the file input so the same file can be selected again
    event.target.value = '';

    await processFile(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    // Check if we're actually leaving the wrapper element
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    // Only hide drag state if we're leaving the wrapper (not moving to a child)
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const acceptedExtensions = ['.yaml', '.yml', '.json', '.zip', '.ekb'];

    // Find the first valid file
    const validFile = files.find((file) => {
      const fileName = file.name.toLowerCase();
      return acceptedExtensions.some((ext) => fileName.endsWith(ext));
    });

    if (validFile) {
      await processFile(validFile);
    } else if (files.length > 0) {
      // Show error if files were dropped but none were valid
      if (configContext) {
        configContext.setError(
          'Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb'
        );
      }
    }
  };

  return (
    <WelcomePageWrapper
      $isDragging={isDragging}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="welcome-page-wrapper"
    >
      <DropOverlay $isVisible={isDragging}>
        <DropMessage>Drop file here to load configuration</DropMessage>
      </DropOverlay>
      {currentConflict && (
        <ConflictResolutionDialog
          injectionName={currentConflict.name}
          injectionType={currentConflict.type}
          onResolve={handleConflictResolution}
          onCancel={handleConflictCancel}
          data-testid="conflict-resolution-dialog"
        />
      )}
      <WelcomeContainer>
        <Header>Ergogen Web UI</Header>
        <SubHeader>
          A web-based interface for Ergogen, the ergonomic keyboard generator.
          <br />
          Start a new design below.
        </SubHeader>

        <OptionsContainer>
          <OptionBox>
            <h2>Start Fresh</h2>
            <p>Begin with a completely blank slate.</p>
            <Button
              onClick={() => handleSelectExample(EmptyYAML.value)}
              aria-label="Start with empty configuration"
              data-testid="empty-config-button"
            >
              Empty Configuration
            </Button>
          </OptionBox>
          <OptionBox>
            <h2>From Local File</h2>
            <p>
              Load a configuration from your computer. Supports *.yaml, *.json,
              *.zip, and *.ekb files.
            </p>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept=".yaml,.yml,.json,.zip,.ekb"
              onChange={handleLocalFile}
              disabled={isLoading}
              aria-label="Select local file to load"
              data-testid="local-file-input"
            />
            <Button
              onClick={handleFileButtonClick}
              disabled={isLoading}
              aria-label="Select local file to load"
              data-testid="local-file-button"
            >
              {isLoading ? (
                <>
                  <Spinner /> Loading...
                </>
              ) : (
                'Choose File'
              )}
            </Button>
          </OptionBox>
          <OptionBox>
            <h2>From Repo</h2>
            <p>
              Link to a YAML config file on GitHub or Codeberg, or simply a
              repository name like &quot;user/repo&quot;.
            </p>
            <GitHubInputContainer>
              <RepoSelectContainer>
                {provider === 'github' ? <GithubIcon /> : <CodebergIcon />}
                <RepoSelect
                  value={provider}
                  onChange={(e) =>
                    setProvider(e.target.value as 'github' | 'codeberg')
                  }
                  disabled={isLoading}
                  aria-label="Repository provider source"
                  data-testid="repo-provider-select"
                >
                  <option value="github">GitHub</option>
                  <option value="codeberg">Codeberg</option>
                </RepoSelect>
              </RepoSelectContainer>
              <GitHubInput
                placeholder={
                  provider === 'github'
                    ? 'github.com/ceoloide/corney-island'
                    : 'codeberg.org/ceoloide/corney-island'
                }
                value={githubInput}
                onChange={(e) => handleRepoInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !isLoading &&
                    githubInput.trim() !== ''
                  ) {
                    e.preventDefault();
                    handleGitHub();
                  }
                }}
                disabled={isLoading}
                aria-label="Repository URL or path"
                data-testid="github-input"
              />
              <Button
                onClick={handleGitHub}
                disabled={isLoading || !githubInput}
                aria-label="Load configuration from repository"
                data-testid="github-load-button"
              >
                {isLoading ? (
                  <>
                    <Spinner /> Loading...
                  </>
                ) : (
                  'Load'
                )}
              </Button>
            </GitHubInputContainer>
          </OptionBox>
        </OptionsContainer>

        {latestConfigs.length > 0 && (
          <>
            <h2
              style={{
                textAlign: 'center',
                marginBottom: '2rem',
                fontSize: theme.fontSizes.h2,
              }}
            >
              Pick up where you left
            </h2>
            <ExamplesGrid style={{ marginBottom: '3rem' }}>
              {latestConfigs.map((cfg) => (
                <ExampleCard
                  key={cfg.id}
                  onClick={() => handleSelectSavedConfig(cfg.id)}
                  aria-label={`Load ${cfg.name} configuration`}
                  data-testid={`saved-config-${cfg.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {cfg.previewSvg ? (
                    <ExampleSvgWrapper
                      dangerouslySetInnerHTML={{ __html: cfg.previewSvg }}
                    />
                  ) : (
                    <FallbackIconContainer>
                      <span className="material-symbols-outlined">
                        keyboard_off
                      </span>
                    </FallbackIconContainer>
                  )}
                  <ExampleName>{cfg.name}</ExampleName>
                </ExampleCard>
              ))}
            </ExamplesGrid>
          </>
        )}

        <h2
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: theme.fontSizes.h2,
          }}
        >
          Or start from an example
        </h2>

        <ExamplesGrid>
          {allExamples.map((example) => (
            <ExampleCard
              key={example.label}
              onClick={() => handleSelectExample(example.value)}
              aria-label={`Load ${example.label} example`}
              data-testid={`example-${example.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <ExampleImage
                src={`/images/previews/${example.label.toLowerCase().replace(/[\s()]/g, '_')}.svg`}
                alt={`${example.label} preview`}
              />
              <ExampleName>{example.label}</ExampleName>
            </ExampleCard>
          ))}
        </ExamplesGrid>
      </WelcomeContainer>
    </WelcomePageWrapper>
  );
};

export default Welcome;
