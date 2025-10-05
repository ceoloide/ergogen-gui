import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useConfigContext } from '../context/ConfigContext';
import { exampleOptions, ConfigOption } from '../examples';
import EmptyYAML from '../examples/empty_yaml';
import { fetchConfigFromUrl } from '../utils/github';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

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

const PlaceholderImage = styled.div`
  width: 100%;
  height: 150px;
  background-color: ${theme.colors.backgroundLighter};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textDarkest};
  font-style: italic;
`;

const ExampleName = styled.div`
  padding: 1rem;
  font-weight: ${theme.fontWeights.semiBold};
  text-align: center;
`;

const ErrorMessage = styled.div`
  background: ${theme.colors.error};
  color: ${theme.colors.errorDark};
  border: 1px solid ${theme.colors.errorDark};
  padding: 1em;
  margin-top: 1em;
  border-radius: 6px;
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

  const handleSelectExample = async (configValue: string) => {
    if (configContext) {
      configContext.setConfigInput(configValue);
      await configContext.generateNow(
        configValue,
        configContext.injectionInput,
        { pointsonly: false }
      );
    }
    navigate('/');
  };

  const handleGitHub = () => {
    if (!githubInput || !configContext) return;
    const { setConfigInput, setError, clearError } = configContext;
    setIsLoading(true);
    clearError();
    fetchConfigFromUrl(githubInput)
      .then(async (data) => {
        if (configContext) {
          configContext.setConfigInput(data);
          await configContext.generateNow(data, configContext.injectionInput, {
            pointsonly: false,
          });
        }
        navigate('/');
      })
      .catch((e) => {
        setError(`Failed to fetch config from GitHub: ${e.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <WelcomePageWrapper>
      <WelcomeContainer>
        <Header>Welcome to Ergogen Web UI</Header>
        <SubHeader>
          A web-based interface for Ergogen, the ergonomic keyboard generator.
          <br />
          Start a new design below.
        </SubHeader>

        <OptionsContainer>
          <OptionBox>
            <h2>Start Fresh</h2>
            <p>Begin with a completely blank slate.</p>
            <Button onClick={() => handleSelectExample(EmptyYAML.value)}>
              Empty Configuration
            </Button>
          </OptionBox>
          <OptionBox>
            <h2>From GitHub</h2>
            <p>
              Link to a YAML config file on GitHub, or simply a repo like
              "user/repo".
            </p>
            <GitHubInputContainer>
              <Input
                placeholder="github.com/ceoloide/corney-island"
                value={githubInput}
                onChange={(e) => setGithubInput(e.target.value)}
                disabled={isLoading}
              />
              <Button
                onClick={handleGitHub}
                disabled={isLoading || !githubInput}
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
            >
              <PlaceholderImage>
                <span>Placeholder</span>
              </PlaceholderImage>
              <ExampleName>{example.label}</ExampleName>
            </ExampleCard>
          ))}
        </ExamplesGrid>
      </WelcomeContainer>
    </WelcomePageWrapper>
  );
};

export default Welcome;
