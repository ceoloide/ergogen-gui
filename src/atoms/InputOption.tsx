import React, {Dispatch, SetStateAction} from "react";
import styled from "styled-components";
import Input from "./Input";

/**
 * Props for the InputOption component.
 * @typedef {object} Props
 * @property {string} optionId - A unique identifier for the input and its label.
 * @property {React.ReactNode} label - The content to be displayed as the label for the input.
 * @property {string | number} value - The value of the input.
 * @property {Dispatch<SetStateAction<string | number>>} setValue - A function to update the value.
 * @property {string} type - The type of the input (e.g. "text", "number").
 */
type Props = {
  optionId: string;
  label: React.ReactNode;
  value: string | number;
  setValue: Dispatch<SetStateAction<any>>;
  type: string;
};

/**
 * A styled span container for the input option.
 * It prevents text wrapping and uses an ellipsis for overflow.
 */
const OptionContainer = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const StyledInput = styled(Input)`
    width: 60px;
    margin-left: 10px;
`

/**
 * A component that renders a labeled input option for settings.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A container with an input and a label.
 */
const InputOption = ({optionId, label, setValue, value, type}: Props): JSX.Element => {
    return (
        <OptionContainer>
            <label htmlFor={optionId}>{label}</label>
            <StyledInput
                type={type}
                id={optionId}
                value={value}
                onChange={(e: any) => setValue(e.target.value)}
            />
        </OptionContainer>
    );
};

export default InputOption;