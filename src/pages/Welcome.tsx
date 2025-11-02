import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useConfigContext } from '../context/ConfigContext';
import { exampleOptions, ConfigOption } from '../examples';
import EmptyYAML from '../examples/empty_yaml';
import { fetchConfigFromUrl, GitHubFootprint } from '../utils/github';
import {
  checkForConflict,
  mergeInjections,
  ConflictResolution,
} from '../utils/injections';
import { loadLocalConfigFile } from '../utils/localFileLoader';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import ConflictResolutionDialog from '../molecules/ConflictResolutionDialog';

// Styled Components
const WelcomePageWrapper = styled.div`
  background-color: ${theme.colors.background};
  color: ${theme.colors.white};
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const OptionBox = styled.div`
  background-color: ${theme.colors.backgroundLight};
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
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
  max-width: 400px;
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
  const [currentConflict, setCurrentConflict] = useState<string | null>(null);
  const [pendingConfig, setPendingConfig] = useState<string | null>(null);
  const [injectionsAtConflict, setInjectionsAtConflict] = useState<
    string[][] | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Navigate to home when config has been set
  useEffect(() => {
    if (shouldNavigate && configContext?.configInput) {
      navigate('/');
      setShouldNavigate(false);
    }
  }, [shouldNavigate, configContext?.configInput, navigate]);

  const handleSelectExample = async (configValue: string) => {
    if (configContext) {
      configContext.setConfigInput(configValue);
      await configContext.generateNow(
        configValue,
        configContext.injectionInput,
        { pointsonly: false }
      );
      setShouldNavigate(true);
    }
  };

  const processFootprints = async (
    footprints: GitHubFootprint[],
    config: string,
    resolution: ConflictResolution | null = null,
    currentInjections?: string[][]
  ): Promise<void> => {
    if (!configContext) {
      throw new Error('Configuration context not available');
    }

    // Use provided injections or fall back to context
    const injectionsToUse = currentInjections || configContext.injectionInput;

    if (footprints.length === 0) {
      // No footprints to process, just load the config
      configContext.setInjectionInput(injectionsToUse);
      configContext.setConfigInput(config);
      await configContext.generateNow(config, injectionsToUse, {
        pointsonly: false,
      });
      setShouldNavigate(true);
      return;
    }

    const currentFootprint = footprints[0];
    const remainingFootprints = footprints.slice(1);

    // Check for conflict using the current injections state
    const conflictCheck = checkForConflict(
      currentFootprint.name,
      injectionsToUse
    );

    if (conflictCheck.hasConflict && !resolution) {
      // Show dialog and pause processing
      setCurrentConflict(currentFootprint.name);
      setPendingFootprints(footprints);
      setPendingConfig(config);
      setInjectionsAtConflict(injectionsToUse ?? null);
      return;
    }

    // Determine resolution to use
    const resolutionToUse = resolution || 'skip';

    // Merge this footprint with the current injections state
    const mergedInjections = mergeInjections(
      [currentFootprint],
      injectionsToUse,
      resolutionToUse
    );

    // Process remaining footprints with the updated injections
    if (remainingFootprints.length > 0) {
      await processFootprints(
        remainingFootprints,
        config,
        resolution,
        mergedInjections
      );
    } else {
      // All footprints processed, update context and load the config
      configContext.setInjectionInput(mergedInjections);
      configContext.setConfigInput(config);
      await configContext.generateNow(config, mergedInjections, {
        pointsonly: false,
      });
      setShouldNavigate(true);
    }
  };

  const handleConflictResolution = async (
    action: ConflictResolution,
    applyToAllConflicts: boolean
  ) => {
    if (!configContext || !pendingFootprints || !pendingConfig) return;

    setCurrentConflict(null);

    // Process the current footprint with the chosen action
    const currentFootprint = pendingFootprints[0];
    const remainingFootprints = pendingFootprints.slice(1);

    // Merge with current injections state
    const mergedInjections = mergeInjections(
      [currentFootprint],
      injectionsAtConflict || configContext.injectionInput,
      action
    );

    // Resume processing remaining footprints with the updated injections
    if (remainingFootprints.length > 0) {
      await processFootprints(
        remainingFootprints,
        pendingConfig,
        applyToAllConflicts ? action : null,
        mergedInjections
      );
    } else {
      // All footprints processed, update context and load the config
      configContext.setInjectionInput(mergedInjections);
      configContext.setConfigInput(pendingConfig);
      await configContext.generateNow(pendingConfig, mergedInjections, {
        pointsonly: false,
      });
      setShouldNavigate(true);

      // Clean up state only after all footprints are processed
      setPendingFootprints([]);
      setPendingConfig(null);
      setInjectionsAtConflict(null);
    }
  };

  const handleConflictCancel = () => {
    setCurrentConflict(null);
    setPendingFootprints([]);
    setPendingConfig(null);
    setInjectionsAtConflict(null);
    setIsLoading(false);
    // Show error message that loading was cancelled
    if (configContext) {
      configContext.setError('Loading cancelled by user');
    }
  };

  const handleGitHub = () => {
    if (!githubInput || !configContext) return;
    const { setError, clearError, setIsGenerating } = configContext;
    setIsLoading(true);
    setIsGenerating(true); // Show progress bar during GitHub loading
    clearError();

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

  const handleLocalFileButtonClick = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const handleLocalFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!configContext) return;

    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const { clearError, setError, setIsGenerating } = configContext;
    setIsLoading(true);
    setIsGenerating(true);
    clearError();

    setCurrentConflict(null);
    setPendingFootprints([]);
    setPendingConfig(null);
    setInjectionsAtConflict(null);

    try {
      const result = await loadLocalConfigFile(file);
      await processFootprints(result.footprints, result.config);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to load local file: ${message}`);
      setIsGenerating(false);
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  return (
    <WelcomePageWrapper>
      {currentConflict && (
        <ConflictResolutionDialog
          footprintName={currentConflict}
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
            <h2>From GitHub</h2>
            <p>
              Link to a YAML config file on GitHub, or simply a repo like
              &quot;user/repo&quot;.
            </p>
            <GitHubInputContainer>
              <Input
                placeholder="github.com/ceoloide/corney-island"
                value={githubInput}
                onChange={(e) => setGithubInput(e.target.value)}
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
          <OptionBox>
            <h2>From a File</h2>
            <p>Upload a configuration from your computer.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".yaml,.yml,.json,.zip,.ekb"
              onChange={handleLocalFileChange}
              style={{ display: 'none' }}
              data-testid="local-file-input"
            />
            <Button
              onClick={handleLocalFileButtonClick}
              disabled={isLoading}
              aria-label="Load configuration from local file"
              data-testid="local-file-load-button"
            >
              {isLoading ? 'Loading...' : 'Load File'}
            </Button>
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
