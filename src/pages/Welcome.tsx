import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useConfigContext } from '../context/ConfigContext';
import { exampleOptions } from '../examples';
import EmptyYAML from '../examples/empty_yaml';
import { fetchConfigFromUrl, GitHubFootprint } from '../utils/github';
import { loadLocalFile } from '../utils/localFiles';
import Button from '../atoms/Button';
import ConflictResolutionDialog from '../molecules/ConflictResolutionDialog';
import { trackEvent } from '../utils/analytics';
import { useInjectionConflictResolution } from '../hooks/useInjectionConflictResolution';
import { getNextDefaultName } from '../utils/naming';

const WelcomePageWrapper = styled.div<{ $isDragging?: boolean }>`
  background-color: ${theme.colors.background}; color: ${theme.colors.white}; flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column; position: relative;
  ${props => props.$isDragging && `border: 3px dashed ${theme.colors.accent}; border-radius: 8px;`}
`;
const DropOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: ${props => (props.$isVisible ? 'flex' : 'none')};
  align-items: center; justify-content: center; z-index: 999; pointer-events: none;
`;
const DropMessage = styled.div`
  background-color: ${theme.colors.backgroundLight}; padding: 2rem 4rem; border-radius: 12px; font-size: ${theme.fontSizes.h3};
  color: ${theme.colors.accent}; border: 2px solid ${theme.colors.accent}; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;
const WelcomeContainer = styled.div` max-width: 1000px; margin: 0 auto; padding: 4rem 2rem; display: flex; flex-direction: column; align-items: center; `;
const Header = styled.h1` font-size: ${theme.fontSizes.h1}; margin-bottom: 1rem; text-align: center; `;
const SubHeader = styled.p` font-size: ${theme.fontSizes.lg}; color: ${theme.colors.textDark}; margin-bottom: 4rem; text-align: center; line-height: 1.6; `;
const OptionsContainer = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; width: 100%; margin-bottom: 4rem; `;
const OptionBox = styled.div`
  background-color: ${theme.colors.backgroundLight}; border: 1px solid ${theme.colors.border}; border-radius: 12px; padding: 2rem; display: flex; flex-direction: column; align-items: center; text-align: center;
  &:hover { transform: translateY(-5px); border-color: ${theme.colors.accent}; }
  h2 { font-size: ${theme.fontSizes.h3}; margin-bottom: 1rem; }
  p { color: ${theme.colors.textDark}; margin-bottom: 2rem; font-size: ${theme.fontSizes.sm}; }
`;
const ExamplesGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; width: 100%; `;
const ExampleCard = styled.div`
  background-color: ${theme.colors.backgroundLight}; border: 1px solid ${theme.colors.border}; border-radius: 8px; padding: 1rem; cursor: pointer; display: flex; flex-direction: column; align-items: center;
  &:hover { transform: scale(1.05); border-color: ${theme.colors.accent}; }
`;
const ExampleImage = styled.img` width: 100%; height: 120px; object-fit: contain; margin-bottom: 1rem; border-radius: 4px; `;
const ExampleName = styled.div` font-size: ${theme.fontSizes.sm}; font-weight: ${theme.fontWeights.semiBold}; text-align: center; `;
const GitHubInputContainer = styled.div` display: flex; width: 100%; gap: 0.5rem; `;
const GitHubInput = styled.input` flex-grow: 1; background-color: ${theme.colors.background}; border: 1px solid ${theme.colors.border}; border-radius: 6px; padding: 0.5rem 1rem; color: ${theme.colors.white}; font-size: ${theme.fontSizes.sm}; &:focus { outline: none; border-color: ${theme.colors.accent}; } `;
const HiddenFileInput = styled.input` display: none; `;

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const configContext = useConfigContext();
  const [githubInput, setGithubInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const allExamples = exampleOptions.flatMap((opt) => opt.options || [opt]);

  const {
    currentConflict, processInjectionsWithConflictResolution, handleConflictResolution, handleConflictCancel
  } = useInjectionConflictResolution({
    setInjectionInput: (injections) => configContext?.setInjectionInput(injections),
    setConfigInput: (config) => configContext?.setConfigInput(config),
    generateNow: async (config, injections, options) => { if (configContext) await configContext.generateNow(config, injections, options); },
    getCurrentInjections: () => configContext?.injectionInput || [],
    onComplete: async (config, injections) => {
      localStorage.setItem('ergogen:injection', JSON.stringify(injections));
      navigate('/');
    },
    setError: (error) => configContext?.setError(error),
  });

  const addNewConfig = useCallback((name: string, content: string) => {
    if (!configContext) return '';
    const existingNames = configContext.configs.map(c => c.name);
    const finalName = getNextDefaultName(name, existingNames);
    return configContext.addConfig(finalName, content);
  }, [configContext]);

  const handleSelectExample = async (configValue: string) => {
    if (configContext) {
      const isEmptyConfig = configValue === EmptyYAML.value;
      let exampleName = 'Untitled';
      if (!isEmptyConfig) {
        const foundExample = allExamples.find((ex) => ex.value === configValue);
        if (foundExample) exampleName = foundExample.label;
      }
      addNewConfig(exampleName, configValue);
      navigate('/');
    }
  };

  const processFootprints = async (footprints: GitHubFootprint[], config: string, name: string): Promise<void> => {
    if (!configContext) throw new Error('Context not available');
    addNewConfig(name, config);
    const injections: string[][] = footprints.map((fp) => ['footprint', fp.name, fp.content]);
    await processInjectionsWithConflictResolution(injections, config);
  };

  const handleGitHub = () => {
    if (!githubInput || !configContext) return;
    setIsLoading(true); configContext.setIsGenerating(true); configContext.clearError();
    fetchConfigFromUrl(githubInput).then(async (result) => {
      if (result.rateLimitWarning) configContext.setError(result.rateLimitWarning);
      await processFootprints(result.footprints, result.config, 'Shared');
    }).catch((e) => {
      configContext.setError(`Failed to load from GitHub: ${e.message}`);
      setIsLoading(false); configContext.setIsGenerating(false);
    }).finally(() => setIsLoading(false));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileButtonClick = () => fileInputRef.current?.click();

  const processFile = async (file: File) => {
    if (!configContext) return;
    setIsLoading(true); configContext.setIsGenerating(true); configContext.clearError();
    try {
      const result = await loadLocalFile(file);
      const name = file.name.replace(/\.[^/.]+$/, "");
      await processFootprints(result.footprints, result.config, name || 'Untitled');
    } catch (error) {
      configContext.setError(`Failed to load local file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false); configContext.setIsGenerating(false);
    } finally { setIsLoading(false); }
  };

  const handleLocalFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    await processFile(file);
  };

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) setIsDragging(false);
  };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const acceptedExtensions = ['.yaml', '.yml', '.json', '.zip', '.ekb'];
    const validFile = files.find((file) => {
      const fileName = file.name.toLowerCase();
      return acceptedExtensions.some((ext) => fileName.endsWith(ext));
    });
    if (validFile) await processFile(validFile);
    else if (files.length > 0 && configContext) configContext.setError('Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb');
  };

  return (
    <WelcomePageWrapper $isDragging={isDragging} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} data-testid="welcome-page-wrapper">
      <DropOverlay $isVisible={isDragging}><DropMessage>Drop file here to load configuration</DropMessage></DropOverlay>
      {currentConflict && <ConflictResolutionDialog injectionName={currentConflict.name} injectionType={currentConflict.type} onResolve={handleConflictResolution} onCancel={handleConflictCancel} />}
      <WelcomeContainer>
        <Header>Ergogen Web UI</Header>
        <SubHeader>A web-based interface for Ergogen, the ergonomic keyboard generator.<br />Start a new design below.</SubHeader>
        <OptionsContainer>
          <OptionBox>
            <h2>Start Fresh</h2>
            <p>Begin with a completely blank slate.</p>
            <Button onClick={() => handleSelectExample(EmptyYAML.value)} aria-label="Start with empty configuration" data-testid="empty-config-button">Empty Configuration</Button>
          </OptionBox>
          <OptionBox>
            <h2>From Local File</h2>
            <p>Load a configuration from your computer. Supports *.yaml, *.json, *.zip, and *.ekb files.</p>
            <HiddenFileInput ref={fileInputRef} type="file" accept=".yaml,.yml,.json,.zip,.ekb" onChange={handleLocalFile} disabled={isLoading} />
            <Button onClick={handleFileButtonClick} disabled={isLoading} aria-label="Select local file to load" data-testid="local-file-button">{isLoading ? 'Loading...' : 'Choose File'}</Button>
          </OptionBox>
          <OptionBox>
            <h2>From GitHub</h2>
            <p>Link to a YAML config file on GitHub, or simply a repo like &quot;user/repo&quot;.</p>
            <GitHubInputContainer>
              <GitHubInput placeholder="github.com/ceoloide/corney-island" value={githubInput} onChange={(e) => setGithubInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading && githubInput.trim() !== '') { e.preventDefault(); handleGitHub(); } }} disabled={isLoading} />
              <Button onClick={handleGitHub} disabled={isLoading || !githubInput} aria-label="Load configuration from GitHub" data-testid="github-load-button">{isLoading ? 'Loading...' : 'Load'}</Button>
            </GitHubInputContainer>
          </OptionBox>
        </OptionsContainer>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: theme.fontSizes.h2 }}>Or start from an example</h2>
        <ExamplesGrid>
          {allExamples.map((example) => (
            <ExampleCard key={example.label} onClick={() => handleSelectExample(example.value)} aria-label={`Load ${example.label} example`} data-testid={`example-${example.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <ExampleImage src={`/images/previews/${example.label.toLowerCase().replace(/[\s()]/g, '_')}.svg`} alt={`${example.label} preview`} />
              <ExampleName>{example.label}</ExampleName>
            </ExampleCard>
          ))}
        </ExamplesGrid>
      </WelcomeContainer>
    </WelcomePageWrapper>
  );
};
export default Welcome;
