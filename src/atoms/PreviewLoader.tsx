import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../theme/theme';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const spinReverse = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.96); }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${theme.colors.background};
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OuterRing = styled.svg`
  position: absolute;
  width: 120px;
  height: 120px;
  animation: ${spin} 8s linear infinite;
`;

const InnerRing = styled.svg`
  position: absolute;
  width: 90px;
  height: 90px;
  animation: ${spinReverse} 6s linear infinite;
`;

const LogoImage = styled.img`
  width: 48px;
  height: 48px;
  filter: grayscale(100%);
  z-index: 2;
  animation: ${pulse} 2s ease-in-out infinite;
  user-select: none;
  -webkit-user-drag: none;
`;

const LoadingText = styled.span`
  color: ${theme.colors.textDarker};
  font-size: ${theme.fontSizes.sm};
  margin-top: 1rem;
  letter-spacing: 0.05em;
  font-weight: 500;
  text-transform: uppercase;
`;

interface Props {
  text?: string;
}

const PreviewLoader = ({ text = 'Loading Preview' }: Props): JSX.Element => {
  return (
    <LoaderContainer data-testid="preview-loader">
      <SpinnerWrapper>
        <OuterRing viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={theme.colors.textDarkest || '#444'}
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
        </OuterRing>
        <InnerRing viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={theme.colors.border || '#3f3f3f'}
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        </InnerRing>
        <LogoImage
          src={`${import.meta.env.BASE_URL}ergogen.png`}
          alt="Loading..."
          draggable="false"
        />
      </SpinnerWrapper>
      {text && <LoadingText>{text}</LoadingText>}
    </LoaderContainer>
  );
};

export default PreviewLoader;
