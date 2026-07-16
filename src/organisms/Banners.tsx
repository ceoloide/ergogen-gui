import React from 'react';
import styled from 'styled-components';
import { useConfigContext } from '../context/ConfigContext';
import { theme } from '../theme/theme';

const bannerColors = {
  info: {
    background: theme.colors.info,
    text: theme.colors.infoDark,
  },
  warning: {
    background: theme.colors.warning,
    text: theme.colors.warningDark,
  },
  error: {
    background: theme.colors.error,
    text: theme.colors.errorDark,
  },
  success: {
    background: theme.colors.success,
    text: theme.colors.successDark,
  },
};

const BannerIcon = styled.span.attrs({
  className: 'material-symbols-outlined',
})`
  font-size: ${theme.fontSizes.iconLarge};
  margin-right: 1rem;
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
`;

const BannerText = styled.p`
  margin: 0;
`;

const Banner = styled.div<{ type: 'info' | 'warning' | 'error' | 'success' }>`
  padding: 1rem 1.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${({ type }) => bannerColors[type].text};
  background-color: ${({ type }) => bannerColors[type].background};
  border: 1px solid ${({ type }) => bannerColors[type].text};

  .material-symbols-outlined {
    color: ${({ type }) => bannerColors[type].text};
  }
`;

const BannersContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 800px;
  padding: 0 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: ${theme.fontSizes.h3};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: auto;
  padding-left: 1rem;
`;

const Banners = () => {
  const configContext = useConfigContext();

  if (!configContext) {
    return null;
  }

  const {
    error,
    deprecationWarning,
    skippedWarning,
    info,
    clearError,
    clearWarning,
    clearSkippedWarning,
    clearInfo,
  } = configContext;

  return (
    <BannersContainer data-testid="banners-container">
      {info && (
        <Banner type="info" data-testid="info-banner">
          <BannerContent>
            <BannerIcon>info</BannerIcon>
            <BannerText>{info}</BannerText>
          </BannerContent>
          <CloseButton
            onClick={clearInfo}
            aria-label="Close info message"
            data-testid="close-info-banner"
          >
            &times;
          </CloseButton>
        </Banner>
      )}
      {deprecationWarning && (
        <Banner type="warning" data-testid="warning-banner">
          <BannerContent>
            <BannerIcon>warning</BannerIcon>
            <BannerText>{deprecationWarning}</BannerText>
          </BannerContent>
          <CloseButton
            onClick={clearWarning}
            aria-label="Close warning message"
            data-testid="close-warning-banner"
          >
            &times;
          </CloseButton>
        </Banner>
      )}
      {skippedWarning && (
        <Banner type="warning" data-testid="skipped-injections-banner">
          <BannerContent>
            <BannerIcon>warning</BannerIcon>
            <BannerText>{skippedWarning}</BannerText>
          </BannerContent>
          <CloseButton
            onClick={clearSkippedWarning}
            aria-label="Close feature warning message"
            data-testid="close-skipped-banner"
          >
            &times;
          </CloseButton>
        </Banner>
      )}
      {error && (
        <Banner type="error" data-testid="error-banner">
          <BannerContent>
            <BannerIcon>error</BannerIcon>
            <BannerText>{error}</BannerText>
          </BannerContent>
          <CloseButton
            onClick={clearError}
            aria-label="Close error message"
            data-testid="close-error-banner"
          >
            &times;
          </CloseButton>
        </Banner>
      )}
    </BannersContainer>
  );
};

export default Banners;
