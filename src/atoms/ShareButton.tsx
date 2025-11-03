import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { useConfigContext } from '../context/ConfigContext';
import { compressToEncodedURIComponent } from 'lz-string';

const StyledButton = styled.button`
  background-color: ${theme.colors.background};
  border: none;
  border-radius: 6px;
  color: ${theme.colors.white};
  display: flex;
  align-items: center;
  padding: 4px 6px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${theme.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;

  .material-symbols-outlined {
    font-size: ${theme.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }
`;

const ShareButton = () => {
  const [showCopied, setShowCopied] = useState(false);
  const configContext = useConfigContext();

  const handleShare = () => {
    if (configContext) {
      const configToShare = {
        config: configContext.configInput,
        injections: [],
      };
      const compressedConfig = compressToEncodedURIComponent(
        JSON.stringify(configToShare)
      );
      const url = `${window.location.origin}#${compressedConfig}`;
      navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <StyledButton onClick={handleShare}>
      {showCopied ? (
        'Copied!'
      ) : (
        <>
          <span className="material-symbols-outlined">share</span>
        </>
      )}
    </StyledButton>
  );
};

export default ShareButton;
