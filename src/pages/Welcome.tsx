import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useConfigContext } from '../context/ConfigContext';
import {
  exampleOptions,
  ConfigOption,
} from '../examples';
import { fetchConfigFromUrl, GitHubInjection } from '../utils/github';
import { ConflictResolutionStrategy } from '../utils/injections';
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
  min-height: 100vh;
  position: relative;
`;

const WelcomeContainer = styled.div`
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DropOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${(props) => (props.$isVisible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  pointer-events: none;
  border: 4px dashed ${theme.colors.accent};
`;

const DropMessage = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${theme.colors.white};
  background-color: ${theme.colors.background};
  padding: 2rem 4rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

const Header = styled.h1`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: ${theme.colors.white};

  @media (max-width: 640px) {
    font-size: 2.5rem;
  }
`;

const SubHeader = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: ${theme.colors.white}aa;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const OptionBox = styled.div`
  background-color: ${theme.colors.backgroundLight};
  padding: 2rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border: 1px solid ${theme.colors.backgroundLight};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: ${theme.colors.accent}44;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: ${theme.colors.accent};
  }

  p {
    margin: 0;
    color: ${theme.colors.white}cc;
    font-size: 0.95rem;
    line-height: 1.5;
    flex-grow: 1;
  }
`;

const GitHubInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const GitHubInput = styled.input`
  flex-grow: 1;
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.backgroundLight};
  border-radius: 4px;
  padding: 0.75rem;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.code};
  font-size: 0.9rem;

  &:focus {
    outline: 2px solid ${theme.colors.accent};
    border-color: transparent;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ExamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
`;

const ExampleCard = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border: 1px solid transparent;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border-color: ${theme.colors.accent}66;
  }
`;

const ExampleImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  background-color: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.backgroundLight};
`;

const ExampleName = styled.div`
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: ${theme.colors.white};
`;

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const configContext = useConfigContext();
  const [githubInput, setGitHubInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Flatten all examples for the grid
  const allExamples = exampleOptions.reduce((acc, group) => {
    return [...acc, ...group.options];
  }, [] as ConfigOption[]);

  // Memoize callbacks for the conflict resolution hook
  const conflictResolutionCallbacks = React.useMemo(
    () => ({
      setInjectionInput: (injections: string[][]) =>
        configContext?.setInjectionInput(injections),
      setConfigInput: (config: string) => configContext?.setConfigInput(config),
      generateNow: async (
        config: string,
        injections: string[][],
        options?: any
      ) => {
        await configContext?.generateNow(config, injections, options);
      },
      getCurrentInjections: () => configContext?.injectionInput || [],
      setError: (error: string) => configContext?.setError(error),
    }),
    [configContext]
  );

  // Use the injection conflict resolution hook
  const {
    currentConflict,
    processInjectionsWithConflictResolution,
    handleConflictResolution: handleConflictResolutionBase,
    handleConflictCancel: handleConflictCancelBase,
  } = useInjectionConflictResolution(conflictResolutionCallbacks);

  // Auto-redirect if we already have a config (and not loading from URL)
  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const githubUrl = queryParameters.get('github');

    if (!githubUrl && configContext?.configInput && !isLoading) {
      navigate('/');
    }
  }, [configContext, navigate, isLoading]);

  const handleSelectExample = (config: string) => {
    configContext?.setConfigInput(config);
    configContext?.setInjectionInput([]);
    navigate('/');
  };

  /**
   * Processes footprints (or any injections) with conflict resolution.
   * Converts GitHubInjection[] to string[][] and uses the conflict resolution hook.
   */
  const processFootprints = async (
    footprints: GitHubInjection[],
    outlines: GitHubInjection[],
    config: string,
    resolution: ConflictResolutionStrategy | null = null,
    currentInjections?: string[][]
  ): Promise<void> => {
    if (!configContext) {
      throw new Error('Configuration context not available');
    }

    // Convert footprints to injection array format
    const injections: string[][] = [
      ...footprints.map((fp) => ['footprint', fp.name, fp.content]),
      ...outlines.map((ol) => ['outline', ol.name, ol.content]),
    ];

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
    setIsGenerating(true);
    clearError();

    trackEvent('github_loaded', {
      github_url: githubInput,
    });

    fetchConfigFromUrl(githubInput)
      .then(async (result) => {
        if (configContext) {
          if (result.rateLimitWarning) {
            setError(result.rateLimitWarning);
          }

          try {
            await processFootprints(result.footprints, result.outlines, result.config);
          } catch (error) {
            throw new Error(
              `Failed to process footprints: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }
      })
      .catch((e) => {
        setError(`Failed to load from GitHub: ${e.message}`);
        setIsLoading(false);
        setIsGenerating(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = async (file: File) => {
    if (!configContext) return;

    const { setError, clearError, setIsGenerating } = configContext;
    setIsLoading(true);
    setIsGenerating(true);
    clearError();

    trackEvent('local_file_loaded', {
      file_name: file.name,
      file_type: file.type || 'unknown',
      file_size: file.size,
    });

    try {
      const result = await loadLocalFile(file);
      await processFootprints(result.footprints, result.outlines, result.config);
    } catch (error) {
      setError(
        `Failed to load local file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setIsLoading(false);
      setIsGenerating(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocalFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    await processFile(file);
  };

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
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement | null;
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

    const validFile = files.find((file) => {
      const fileName = file.name.toLowerCase();
      return acceptedExtensions.some((ext) => fileName.endsWith(ext));
    });

    if (validFile) {
      await processFile(validFile);
    } else if (files.length > 0) {
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
              onClick={() => {
                const emptyExample = allExamples.find(ex => ex.label === 'Empty');
                handleSelectExample(emptyExample?.value || '');
              }}
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
                onChange={(e) => setGitHubInput(e.target.value)}
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
