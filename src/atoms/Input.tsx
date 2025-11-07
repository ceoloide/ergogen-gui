import styled from 'styled-components';
import { theme } from '../theme/theme';

/**
 * Props for the Input component.
 * @typedef {object} Props
 * @property {string} [aria-label] - An optional aria-label for the input.
 * @property {string} [data-testid] - An optional data-testid for testing purposes.
 * @property {string} [$size] - The size for margin and padding.
 */
type Props = {
  'aria-label'?: string;
  'data-testid'?: string;
  $size?: string;
};

/**
 * A styled text input component.
 * It accepts a `$size` prop to control its margin and padding.
 *
 * @param {object} props - The props for the component.
 * @param {string} [props.$size="0.5em"] - The size for margin and padding.
 *
 * @example
 * <Input $size="1em" />
 */
const styledInput = styled.input.attrs<Props>((props) => ({
  // we can define static props
  type: 'text',

  // or we can define dynamic ones
  $size: props.$size || '0.5em',
}))`
  font-size: ${theme.fontSizes.base};
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
  outline: none;
  transition: border-color 0.15s ease-in-out;
  /* here we use the dynamically computed prop */
  margin: ${(props) => props.$size};

  &:focus {
    border-color: ${theme.colors.accent};
  }

  &::selection {
    background-color: ${theme.colors.accent};
    color: ${theme.colors.white};
  }
`;

export default styledInput;
