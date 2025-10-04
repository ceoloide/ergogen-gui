import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

/**
 * Props for the GenOption component.
 * @typedef {object} Props
 * @property {string} optionId - A unique identifier for the checkbox input and its label.
 * @property {React.ReactNode} label - The content to be displayed as the label for the checkbox.
 * @property {boolean} checked - The checked state of the checkbox.
 * @property {Dispatch<SetStateAction<boolean>>} setSelected - A function to update the checked state.
 */
type Props = {
  optionId: string;
  label: React.ReactNode;
  checked: boolean;
  setSelected: Dispatch<SetStateAction<boolean>>;
};

/**
 * A styled span container for the generation option.
 * It prevents text wrapping and uses an ellipsis for overflow.
 */
const OptionContainer = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/**
 * A component that renders a checkbox option for generation settings.
 * It includes a label and manages its own checked state through the provided props.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A container with a checkbox and a label.
 */
const GenOption = ({
  optionId,
  label,
  setSelected,
  checked,
}: Props): JSX.Element => {
  return (
    <OptionContainer>
      <input
        type={'checkbox'}
        id={optionId}
        checked={checked}
        onChange={(e) => setSelected(e.target.checked)}
        data-testid={`option-${optionId}`}
      />
      <label htmlFor={optionId}>{label}</label>
    </OptionContainer>
  );
};

export default GenOption;
