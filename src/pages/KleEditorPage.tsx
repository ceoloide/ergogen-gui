/**
 * KLE Editor Page
 *
 * A full-page component that wraps the KleEditor component and provides
 * navigation and configuration generation functionality. Users can design
 * their keyboard layout visually and then generate an Ergogen configuration
 * from it.
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useConfigContext } from '../context/ConfigContext';
import KleEditor from '../molecules/KleEditor';
import Button from '../atoms/Button';
import { createErgogenConfigFromKle } from '../utils/kle';
import { trackEvent } from '../utils/analytics';

const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.backgroundLight};
`;

const HeaderTitle = styled.h1`
  font-size: ${theme.fontSizes.h2};
  margin: 0;
  color: ${theme.colors.text};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditorWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const InfoBanner = styled.div`
  padding: 1rem;
  background-color: ${theme.colors.infoDark};
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.sm};
  border-bottom: 1px solid ${theme.colors.border};
`;

const KleEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const configContext = useConfigContext();
  const [kleJson, setKleJson] = useState<string>('');

  const handleKleChange = useCallback((json: string) => {
    setKleJson(json);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!configContext || !kleJson) {
      return;
    }

    try {
      // Validate KLE JSON
      const parsed = JSON.parse(kleJson);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Invalid KLE format');
      }

      // Count keys (subtract metadata object, sum all keys in rows)
      let keyCount = 0;
      for (let i = 1; i < parsed.length; i++) {
        if (Array.isArray(parsed[i])) {
          keyCount += parsed[i].length;
        }
      }

      // Convert KLE to Ergogen config format
      // Ergogen will automatically detect and convert KLE format
      const ergogenConfig = createErgogenConfigFromKle(kleJson);

      // Track the event
      trackEvent('kle_editor_generated', {
        key_count: keyCount,
      });

      // Set the config and generate
      configContext.setConfigInput(ergogenConfig);
      await configContext.generateNow(
        ergogenConfig,
        configContext.injectionInput,
        { pointsonly: false }
      );

      // Navigate to main page
      navigate('/');
    } catch (error) {
      configContext.setError(
        `Failed to generate config: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }, [configContext, kleJson, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/new');
  }, [navigate]);

  if (!configContext) {
    return null;
  }

  return (
    <PageWrapper>
      <Header>
        <HeaderTitle>Visual Keyboard Layout Editor</HeaderTitle>
        <HeaderActions>
          <Button onClick={handleCancel} aria-label="Cancel">
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!kleJson}
            aria-label="Generate Ergogen config"
          >
            Generate Config
          </Button>
        </HeaderActions>
      </Header>
      <InfoBanner>
        Design your keyboard layout visually. Click "Add Key" to place keys on
        the canvas, then drag them to position. When done, click "Generate
        Config" to convert to Ergogen format.
      </InfoBanner>
      <EditorWrapper>
        <KleEditor onConfigChange={handleKleChange} />
      </EditorWrapper>
    </PageWrapper>
  );
};

export default KleEditorPage;
