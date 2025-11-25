import styled, { css } from 'styled-components';
import { theme } from '../theme/theme';

/**
 * Interface representing a code injection.
 * @interface Injection
 * @property {number} key - A unique identifier for the injection.
 * @property {string} type - The type of the injection (e.g., 'pcb', 'points').
 * @property {string} name - The name of the injection.
 * @property {string} content - The code content of the injection.
 */
export interface Injection {
  key: number;
  type: string;
  name: string;
  content: string;
}

/**
 * Props for the InjectionRow component.
 * @typedef {object} Props
 * @property {Injection} injection - The injection object to display.
 * @property {(injection: Injection) => void} setInjectionToEdit - Function to set the injection to be edited.
 * @property {(injection: Injection) => void} deleteInjection - Function to delete the injection.
 * @property {string} previewKey - The key of the currently active preview.
 */
type Props = {
  injection: Injection;
  setInjectionToEdit: (injection: Injection) => void;
  deleteInjection: (injection: Injection) => void;
  previewKey: string;
  'data-testid'?: string;
};

/**
 * A styled div for the row layout.
 */
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
`;

/**
 * A styled div for displaying the injection name, with ellipsis for overflow.
 */
const InjectionName = styled.div<{ $active: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${theme.fontSizes.bodySmall};
  cursor: pointer;
  border-bottom: ${(props) =>
    props.$active
      ? `2px solid ${theme.colors.accent}`
      : '2px solid transparent'};
  border-top: 2px solid transparent;
`;

/**
 * A styled div to contain the action buttons.
 */
const Buttons = styled.div`
  white-space: nowrap;
  display: flex;
  gap: 6px;
  align-items: center;
`;

const buttonStyles = css`
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

/**
 * A styled button with a dark background.
 */
const StyledLinkButton = styled.a`
  ${buttonStyles}
`;

/**
 * A styled button for editing on mobile, only visible on screens <=639px.
 */
const MobileEditButton = styled.a`
  ${buttonStyles}

  @media (min-width: 640px) {
    display: none;
  }
`;

/**
 * A component that displays a single injection with buttons to edit, delete, and download.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A row displaying the injection name and action buttons.
 */
const InjectionRow = ({
  injection,
  setInjectionToEdit,
  deleteInjection,
  previewKey,
  'data-testid': dataTestId,
}: Props): JSX.Element => {
  return (
    <Row data-testid={dataTestId}>
      <InjectionName
        data-testid={dataTestId && `${dataTestId}-name`}
        $active={previewKey === injection.name}
        onClick={() => setInjectionToEdit(injection)}
      >
        {injection.name}
      </InjectionName>
      <Buttons>
        <MobileEditButton
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setInjectionToEdit(injection);
          }}
          aria-label={`edit injection ${injection.name}`}
          data-testid={dataTestId && `${dataTestId}-edit`}
        >
          <span className="material-symbols-outlined">edit</span>
        </MobileEditButton>
        <StyledLinkButton
          href="#"
          onClick={(e) => {
            e.preventDefault();
            deleteInjection(injection);
          }}
          aria-label={`delete injection ${injection.name}`}
          data-testid={dataTestId && `${dataTestId}-delete`}
        >
          <span className="material-symbols-outlined">delete</span>
        </StyledLinkButton>
        <StyledLinkButton
          target={'_blank'}
          rel={'noreferrer'}
          download={`${injection.name.split('/').reverse()[0]}.js`}
          href={window.URL.createObjectURL(
            new Blob([injection.content], { type: 'octet/stream' })
          )}
          aria-label={`download injection ${injection.name}`}
          data-testid={dataTestId && `${dataTestId}-download`}
        >
          <span className="material-symbols-outlined">download</span>
        </StyledLinkButton>
      </Buttons>
    </Row>
  );
};

export default InjectionRow;
