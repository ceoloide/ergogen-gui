import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';

/**
 * Props for the OutlineIconButton component.
 * @typedef {object} Props
 * @property {string} [aria-label] - An optional aria-label for the button.
 * @property {string} [data-testid] - An optional data-testid for testing purposes.
 * @property {React.MouseEventHandler<HTMLButtonElement>} [onClick] - Click handler for the button.
 * @property {boolean} [disabled] - Whether the button is disabled.
 * @property {string} [className] - Optional CSS class name.
 */
type Props = {
  'aria-label'?: string;
  'data-testid'?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
};

/**
 * A styled button with an outline, used for secondary actions.
 */
const OutlineIconButton = styled.button<Props>`
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
  padding: 8px 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${theme.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;
  height: 34px;
  font-family: ${theme.fonts.body};

  .material-symbols-outlined {
    font-size: ${theme.fontSizes.iconMedium} !important;
  }

  &:hover,
  &.active {
    background-color: ${theme.colors.buttonHover};
  }
`;

export default OutlineIconButton;
