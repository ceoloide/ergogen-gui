import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import Button from './Button';

type Props = {
  isAvailable: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  onInstall: () => void;
};

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const OptionLabel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  user-select: none;
  text-align: left;
`;

const OptionTitle = styled.span`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semiBold};
`;

const OptionDescription = styled.span`
  color: ${theme.colors.textDarker};
  font-size: ${theme.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`;

const WarningDescription = styled(OptionDescription)`
  color: ${theme.colors.warningDark};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`;

const OfflineOption = ({
  isAvailable,
  isInstalled,
  isInstalling,
  onInstall,
}: Props): JSX.Element => {
  let descriptionNode: React.ReactNode;
  let buttonNode: React.ReactNode;

  if (isInstalled) {
    descriptionNode = (
      <OptionDescription>
        The application is installed and available offline.
      </OptionDescription>
    );
    buttonNode = (
      <Button size="sm" disabled data-testid="pwa-installed-button">
        Installed
      </Button>
    );
  } else if (isAvailable) {
    descriptionNode = (
      <OptionDescription>
        Install the app locally to access it offline without network
        connectivity.
      </OptionDescription>
    );
    if (isInstalling) {
      buttonNode = (
        <Button size="sm" disabled data-testid="pwa-installing-button">
          Installing...
        </Button>
      );
    } else {
      buttonNode = (
        <Button size="sm" onClick={onInstall} data-testid="pwa-install-button">
          Install App
        </Button>
      );
    }
  } else {
    descriptionNode = (
      <WarningDescription>
        PWA installation is not supported by your browser or environment.
      </WarningDescription>
    );
    buttonNode = (
      <Button size="sm" disabled data-testid="pwa-unavailable-button">
        Unavailable
      </Button>
    );
  }

  return (
    <OptionContainer>
      <OptionLabel>
        <OptionTitle>Offline App</OptionTitle>
        {descriptionNode}
      </OptionLabel>
      <ButtonWrapper>{buttonNode}</ButtonWrapper>
    </OptionContainer>
  );
};

export default OfflineOption;
