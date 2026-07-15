import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import Button from '../atoms/Button';

/**
 * Props for the ConflictResolutionDialog component.
 */
type ConflictResolutionDialogProps = {
  injectionName: string;
  injectionType: string;
  onResolve: (
    action: 'skip' | 'overwrite' | 'keep-both',
    applyToAll: boolean
  ) => void;
  onCancel: () => void;
  'data-testid'?: string;
};

/**
 * Capitalizes the first letter of a string.
 */
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * A dialog component that prompts the user to resolve injection name conflicts.
 * Provides options to skip, overwrite, or keep both injections.
 */
const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  injectionName,
  injectionType,
  onResolve,
  onCancel,
  'data-testid': dataTestId,
}) => {
  const [applyToAll, setApplyToAll] = useState(false);
  const typeLabel = capitalize(injectionType);

  return (
    <Overlay data-testid={dataTestId}>
      <DialogBox data-testid={dataTestId && `${dataTestId}-box`}>
        <Title>{typeLabel} Conflict</Title>
        <Message>
          A {injectionType} with the name <strong>{injectionName}</strong>{' '}
          already exists.
          <br />
          How would you like to resolve this conflict?
        </Message>

        <ToggleContainer>
          <HiddenCheckbox
            type="checkbox"
            id="apply-to-all"
            checked={applyToAll}
            onChange={(e) => setApplyToAll(e.target.checked)}
            data-testid={dataTestId && `${dataTestId}-apply-to-all`}
            aria-label="Apply this choice to all conflicts"
          />
          <Switch
            $checked={applyToAll}
            onClick={() => setApplyToAll(!applyToAll)}
            role="checkbox"
            aria-checked={applyToAll}
          />
          <label htmlFor="apply-to-all">Apply to all conflicts</label>
        </ToggleContainer>

        <ButtonGroup>
          <Button
            onClick={() => onResolve('skip', applyToAll)}
            size="medium"
            data-testid={dataTestId && `${dataTestId}-skip`}
            aria-label={`Skip this ${injectionType}`}
          >
            Skip
          </Button>
          <Button
            onClick={() => onResolve('overwrite', applyToAll)}
            size="medium"
            data-testid={dataTestId && `${dataTestId}-overwrite`}
            aria-label={`Overwrite existing ${injectionType}`}
          >
            Overwrite
          </Button>
          <Button
            onClick={() => onResolve('keep-both', applyToAll)}
            size="medium"
            data-testid={dataTestId && `${dataTestId}-keep-both`}
            aria-label={`Keep both ${injectionType}s`}
          >
            Keep Both
          </Button>
        </ButtonGroup>
        <CancelButton
          onClick={onCancel}
          size="small"
          data-testid={dataTestId && `${dataTestId}-cancel`}
          aria-label="Cancel loading"
        >
          Cancel
        </CancelButton>
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
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: ${theme.fontSizes.h3};
  color: ${theme.colors.text};
`;

const Message = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${theme.colors.accent};
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.75rem;

  label {
    cursor: pointer;
    font-size: ${theme.fontSizes.base};
    color: ${theme.colors.textDark};
    user-select: none;
  }
`;

const HiddenCheckbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const Switch = styled.div<{ $checked: boolean }>`
  position: relative;
  width: 44px;
  height: 22px;
  background-color: ${(props) =>
    props.$checked ? theme.colors.accent : theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 11px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$checked ? '24px' : '2px')};
    width: 16px;
    height: 16px;
    background-color: ${theme.colors.text};
    border-radius: 50%;
    transition: left 0.2s ease-in-out;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CancelButton = styled(Button)`
  width: 100%;
  background-color: ${theme.colors.backgroundLighter};
  color: ${theme.colors.textDark};

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }
`;

export default ConflictResolutionDialog;
