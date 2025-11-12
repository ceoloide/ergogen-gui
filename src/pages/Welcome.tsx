import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useConfigContext } from '../context/ConfigContext';
import { exampleOptions, ConfigOption } from '../examples';
import EmptyYAML from '../examples/empty_yaml';
import { fetchConfigFromUrl, GitHubFootprint } from '../utils/github';
import { ConflictResolution } from '../utils/injections';
import { loadLocalFile } from '../utils/localFiles';
import Button from '../atoms/Button';
import ConflictResolutionDialog from '../molecules/ConflictResolutionDialog';
import { trackEvent } from '../utils/analytics';
import { useInjectionConflictResolution } from '../hooks/useInjectionConflictResolution';

// Styled Components
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

// Flatten examples into a single list, excluding the "Empty" one which has a dedicated button
const allExamples: ConfigOption[] = exampleOptions
  .flatMap((group) => group.options)
  .filter((ex) => ex.label !== 'Empty YAML configuration');

const Welcome = () => {
  const navigate = useNavigate();
  const configContext = useConfigContext();
  const [githubInput, setGithubInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [pendingFootprints, setPendingFootprints] = useState<GitHubFootprint[]>(
    []
  );
  const [pendingConfig, setPendingConfig] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Use the injection conflict resolution hook
  const {
    currentConflict,
    processInjectionsWithConflictResolution,
    handleConflictResolution: handleConflictResolutionBase,
    handleConflictCancel: handleConflictCancelBase,
  } = useInjectionConflictResolution({
    setInjectionInput: (injections) => configContext?.setInjectionInput(injections),
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
      configContext.setConfigInput(configValue);
      await configContext.generateNow(
        configValue,
        configContext.injectionInput,
        { pointsonly: false }
      );
      setShouldNavigate(true);
    }
  };

  /**
   * Processes footprints (or any injections) with conflict resolution.
   * Converts GitHubFootprint[] to string[][] and uses the conflict resolution hook.
   */
  const processFootprints = async (
    footprints: GitHubFootprint[],
    config: string,
    resolution: ConflictResolution | null = null,
    currentInjections?: string[][]
  ): Promise<void> => {
    if (!configContext) {
      throw new Error('Configuration context not available');
    }

    // Convert footprints to injection array format
    const injections: string[][] = footprints.map((fp) => [
      'footprint',
      fp.name,
      fp.content,
    ]);

    // Store footprints and config for conflict resolution handler
    setPendingFootprints(footprints);
    setPendingConfig(config);

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
    action: ConflictResolution,
    applyToAllConflicts: boolean
  ) => {
    // Call the base handler - it handles all remaining injections internally
    await handleConflictResolutionBase(action, applyToAllConflicts);

    // Clean up footprint-specific state after processing completes
    // (The hook manages its own internal state)
    setPendingFootprints([]);
    setPendingConfig(null);
  };

  const handleConflictCancel = () => {
    handleConflictCancelBase();
    setPendingFootprints([]);
    setPendingConfig(null);
    setIsLoading(false);
  };

  const handleGitHub = () => {
    if (!githubInput || !configContext) return;
    const { setError, clearError, setIsGenerating } = configContext;
    setIsLoading(true);
    setIsGenerating(true); // Show progress bar during GitHub loading
    clearError();

    // Track GitHub loading
    trackEvent('github_loaded', {
      github_url: githubInput,
    });

    // Reset any pending conflict resolution state from previous loads
    setCurrentConflict(null);
    setPendingFootprints([]);
    setPendingConfig(null);
    setInjectionsAtConflict(null);

    fetchConfigFromUrl(githubInput)
      .then(async (result) => {
        if (configContext) {
          // Show rate limit warning if present
          if (result.rateLimitWarning) {
            setError(result.rateLimitWarning);
          }

          try {
            // Process footprints with conflict resolution
            await processFootprints(result.footprints, result.config);
          } catch (error) {
            // If footprint processing fails, don't load the config
            throw new Error(
              `Failed to process footprints: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }
      })
      .catch((e) => {
        setError(`Failed to load from GitHub: ${e.message}`);
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
    setCurrentConflict(null);
    setPendingFootprints([]);
    setPendingConfig(null);
    setInjectionsAtConflict(null);

    try {
      const result = await loadLocalFile(file);

      // Process footprints with conflict resolution
      await processFootprints(result.footprints, result.config);
    } catch (error) {
      setError(
        `Failed to load local file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
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
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
          data-testid="conflict-dialog"
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
              {isLoading ? 'Loading...' : 'Choose File'}
            </Button>
          </OptionBox>
          <OptionBox>
            <h2>From GitHub</h2>
            <p>
              Link to a YAML config file on GitHub, or simply a repo like
              &quot;user/repo&quot;.
            </p>
            <GitHubInputContainer>
              <GitHubInput
                placeholder="github.com/ceoloide/corney-island"
                value={githubInput}
                onChange={(e) => setGithubInput(e.target.value)}
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
                aria-label="GitHub repository URL"
                data-testid="github-input"
              />
              <Button
                onClick={handleGitHub}
                disabled={isLoading || !githubInput}
                aria-label="Load configuration from GitHub"
                data-testid="github-load-button"
              >
                {isLoading ? 'Loading...' : 'Load'}
              </Button>
            </GitHubInputContainer>
          </OptionBox>
        </OptionsContainer>

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
