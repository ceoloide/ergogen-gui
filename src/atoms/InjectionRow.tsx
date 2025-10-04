import { Button } from './Buttons';
import styled from 'styled-components';

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
 */
type Props = {
  injection: Injection;
  setInjectionToEdit: (injection: Injection) => void;
  deleteInjection: (injection: Injection) => void;
};

/**
 * A styled div for the row layout.
 */
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5em;
`;

/**
 * A styled div for displaying the injection name, with ellipsis for overflow.
 */
const InjectionName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;

/**
 * A styled div to contain the action buttons.
 */
const Buttons = styled.div`
  white-space: nowrap;
`;

/**
 * A styled button with a right margin.
 */
const StyledButton = styled(Button)`
  margin-right: 0.5em;
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
}: Props): JSX.Element => {
  return (
    <Row>
      <InjectionName>{injection.name}</InjectionName>
      <Buttons>
        <StyledButton size={'icon'} onClick={() => deleteInjection(injection)}>
          {/* @ts-ignore */}
          <span className="material-symbols-outlined">delete</span>
        </StyledButton>
        <StyledButton
          size={'icon'}
          onClick={() => setInjectionToEdit(injection)}
        >
          {/* @ts-ignore */}
          <span className="material-symbols-outlined">edit</span>
        </StyledButton>
        <a
          target={'_blank'}
          rel={'noreferrer'}
          download={`${injection.name.split('/').reverse()[0]}.js`}
          href={window.URL.createObjectURL(
            new Blob([injection.content], { type: 'octet/stream' })
          )}
        >
          <Button size={'icon'}>
            {/* @ts-ignore */}
            <span className="material-symbols-outlined">download</span>
          </Button>
        </a>
      </Buttons>
    </Row>
  );
};

export default InjectionRow;
