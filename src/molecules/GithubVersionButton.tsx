import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import GithubIcon from '../atoms/GithubIcon';

type GithubVersionButtonProps = {
  label: string;
  version: string;
  url: string;
  isCustom?: boolean;
  'data-testid'?: string;
  devBadgeTestId?: string;
};

export const GithubVersionButton: React.FC<GithubVersionButtonProps> = ({
  label,
  version,
  url,
  isCustom = false,
  'data-testid': dataTestId,
  devBadgeTestId,
}) => {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <VersionButton
      onClick={handleClick}
      $hasDevBadge={isCustom}
      aria-label={`View ${label === 'GUI' ? 'Ergogen GUI' : 'Ergogen'} ${version} on GitHub`}
      data-testid={dataTestId}
    >
      <GithubIcon />
      <ButtonContent>
        <ButtonLabel>{label}</ButtonLabel>
        <ButtonVersionText $isCustom={isCustom}>{version}</ButtonVersionText>
      </ButtonContent>
      {isCustom && (
        <DevBadge data-testid={devBadgeTestId}>
          <DevBadgeText>DEV</DevBadgeText>
        </DevBadge>
      )}
    </VersionButton>
  );
};

const VersionButton = styled.button<{ $hasDevBadge?: boolean }>`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  color: ${theme.colors.white};
  display: flex;
  align-items: center;
  padding: 8px ${(props) => (props.$hasDevBadge ? '22px' : '10px')} 8px 10px;
  text-decoration: none;
  cursor: pointer;
  height: 34px;
  position: relative;
  flex: 0 0 auto;
  gap: 6px;

  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1;
  min-width: 0;
`;

const ButtonLabel = styled.span`
  font-size: 10px;
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.white};
  white-space: nowrap;
`;

const ButtonVersionText = styled.span<{ $isCustom?: boolean }>`
  font-size: 8px;
  color: ${(props) =>
    props.$isCustom ? theme.colors.accent : theme.colors.textDark};
  white-space: nowrap;
`;

const DevBadge = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 16px;
  background-color: ${theme.colors.backgroundLighter};
  border-left: 1px solid ${theme.colors.border};
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`;

const DevBadgeText = styled.span`
  font-size: 8px;
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.accent};
  transform: rotate(-90deg);
  white-space: nowrap;
  line-height: 1;
`;
