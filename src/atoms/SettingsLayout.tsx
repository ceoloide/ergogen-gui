import styled from 'styled-components';
import { theme } from '../theme/theme';

export const SettingsGroupTitle = styled.h4`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.textDarker};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.5rem 0.5rem 0.5rem 0.5rem;

  &:first-of-type {
    margin-top: 0.5rem;
  }
`;

/**
 * A container for grouped settings cards.
 */
export const SettingsCard = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 1rem;
  width: 100%;

  & > div {
    border-bottom: 1px solid ${theme.colors.border};
    &:last-child {
      border-bottom: none;
    }
  }
`;
