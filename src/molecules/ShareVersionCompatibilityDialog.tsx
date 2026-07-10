import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import Button from '../atoms/Button';

export interface VersionCompatibilityReport {
  isCompatible: boolean;
  guiWarning?: {
    current: string;
    shared: string;
  };
  ergogenWarning?: {
    current: string;
    shared: string;
  };
  customErgogenWarning?: {
    shared: string;
    url: string;
    label: string;
  };
}

type ShareVersionCompatibilityDialogProps = {
  report: VersionCompatibilityReport;
  onAccept: () => void;
  onCancel: () => void;
  'data-testid'?: string;
};

const ShareVersionCompatibilityDialog: React.FC<
  ShareVersionCompatibilityDialogProps
> = ({ report, onAccept, onCancel, 'data-testid': dataTestId }) => {
  return (
    <Overlay data-testid={dataTestId}>
      <DialogBox data-testid={dataTestId && `${dataTestId}-box`}>
        <Title>Version Compatibility Warning</Title>
        <Subtitle>
          The shared link was created under a different environment. You may
          experience compatibility issues.
        </Subtitle>

        <WarningContainer>
          {report.guiWarning && (
            <WarningBox data-testid={dataTestId && `${dataTestId}-gui-warning`}>
              <WarningLabel>GUI Version Mismatch</WarningLabel>
              <WarningDescription>
                The shared link was created with a newer version of the GUI (
                <strong>v{report.guiWarning.shared}</strong>) than your current
                version (<strong>v{report.guiWarning.current}</strong>). Some
                interface options or features may not function as expected.
              </WarningDescription>
            </WarningBox>
          )}

          {report.ergogenWarning && (
            <WarningBox
              data-testid={dataTestId && `${dataTestId}-ergogen-warning`}
            >
              <WarningLabel>Ergogen Version Mismatch</WarningLabel>
              <WarningDescription>
                The shared link was created with a newer version of Ergogen (
                <strong>{report.ergogenWarning.shared}</strong>) than your
                current version (
                <strong>{report.ergogenWarning.current}</strong>). Some features
                or syntax might not be supported.
              </WarningDescription>
            </WarningBox>
          )}

          {report.customErgogenWarning && (
            <WarningBox
              data-testid={dataTestId && `${dataTestId}-custom-ergogen-warning`}
            >
              <WarningLabel>Custom Ergogen Version Used</WarningLabel>
              <WarningDescription>
                The shared link was created using a custom version of Ergogen:{' '}
                <strong>{report.customErgogenWarning.shared}</strong>.
                <br />
                You can investigate the repository used here:
                <br />
                <RepoLink
                  href={report.customErgogenWarning.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={dataTestId && `${dataTestId}-custom-repo-link`}
                >
                  {report.customErgogenWarning.label}
                </RepoLink>
              </WarningDescription>
            </WarningBox>
          )}
        </WarningContainer>

        <ButtonGroup>
          <CancelButton
            onClick={onCancel}
            size="medium"
            data-testid={dataTestId && `${dataTestId}-cancel`}
            aria-label="Cancel configuration loading"
          >
            Cancel
          </CancelButton>
          <AcceptButton
            onClick={onAccept}
            size="medium"
            data-testid={dataTestId && `${dataTestId}-accept`}
            aria-label="Accept and load configuration"
          >
            Accept and Load
          </AcceptButton>
        </ButtonGroup>
      </DialogBox>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogBox = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: ${theme.fontSizes.h3};
  color: ${theme.colors.error};
`;

const Subtitle = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.textDarker};
  line-height: 1.4;
`;

const WarningContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const WarningBox = styled.div`
  background-color: ${theme.colors.backgroundLighter};
  border-left: 4px solid ${theme.colors.warningDark};
  padding: 1rem;
  border-radius: 4px;
`;

const WarningLabel = styled.div`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.warningDark};
  margin-bottom: 0.25rem;
`;

const WarningDescription = styled.div`
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${theme.colors.text};
  }
`;

const RepoLink = styled.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${theme.colors.accent};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: ${theme.colors.accentSecondary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const AcceptButton = styled(Button)`
  background-color: ${theme.colors.accent};
  color: ${theme.colors.white};

  &:hover {
    background-color: ${theme.colors.accentDark};
  }
`;

const CancelButton = styled(Button)`
  background-color: ${theme.colors.backgroundLighter};
  color: ${theme.colors.textDark};

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }
`;

export default ShareVersionCompatibilityDialog;
