import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';

/**
 * Props for the GenOption component.
 * @typedef {object} Props
 * @property {string} optionId - A unique identifier for the checkbox input and its label.
 * @property {React.ReactNode} label - The content to be displayed as the label for the checkbox.
 * @property {boolean} checked - The checked state of the checkbox.
 * @property {Dispatch<SetStateAction<boolean>>} setSelected - A function to update the checked state.
 * @property {string} [aria-label] - An optional aria-label for the checkbox.
 */
type Props = {
  optionId: string;
  label: React.ReactNode;
  checked: boolean;
  setSelected: Dispatch<SetStateAction<boolean>>;
  'aria-label'?: string;
};

/**
 * A styled container for the generation option with Material Design switch styling.
 */
const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  gap: 1rem;
`;

/**
 * A styled label for the option text.
 */
const OptionLabel = styled.label`
  flex: 1;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.base};
  cursor: pointer;
  user-select: none;
  text-align: left;
`;

/**
 * A wrapper for the switch to ensure it's aligned to the right.
 */
const SwitchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`;

/**
 * A styled container for the Material Design switch.
 */
const SwitchContainer = styled.label<{ $checked: boolean }>`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`;

/**
 * The hidden checkbox input.
 */
const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

/**
 * The switch track (background).
 */
const SwitchTrack = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) =>
    props.$checked ? theme.colors.accent : theme.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`;

/**
 * The switch thumb (sliding circle).
 */
const SwitchThumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${(props) => (props.$checked ? '18px' : '2px')};
  width: 16px;
  height: 16px;
  background-color: ${theme.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

/**
 * A component that renders a Material Design switch option for generation settings.
 * It includes a label and manages its own checked state through the provided props.
 *
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} A container with a switch and a label.
 */
const GenOption = ({
  optionId,
  label,
  setSelected,
  checked,
  'aria-label': ariaLabel,
}: Props): JSX.Element => {
  return (
    <OptionContainer>
      <OptionLabel htmlFor={optionId}>{label}</OptionLabel>
      <SwitchWrapper>
        <SwitchContainer $checked={checked} htmlFor={optionId}>
          <HiddenInput
            type="checkbox"
            id={optionId}
            checked={checked}
            onChange={(e) => setSelected(e.target.checked)}
            data-testid={`option-${optionId}`}
            aria-label={ariaLabel}
          />
          <SwitchTrack $checked={checked} />
          <SwitchThumb $checked={checked} />
        </SwitchContainer>
      </SwitchWrapper>
    </OptionContainer>
  );
};

export default GenOption;
