import styled, { keyframes } from 'styled-components';
import { theme } from '../theme/theme';

type Props = {
  onClick: () => void;
  'data-testid'?: string;
};

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${theme.colors.accent}66; }
  50%       { box-shadow: 0 0 0 5px ${theme.colors.accent}00; }
`;

const Chip = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 8px;
  height: 28px;
  background-color: ${theme.colors.accent};
  border: none;
  border-radius: 14px;
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: ${theme.fontWeights.semiBold};
  cursor: pointer;
  white-space: nowrap;
  animation: ${pulse} 2s ease-in-out infinite;
  transition: background-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
  }

  &:hover {
    background-color: ${theme.colors.accentDarker};
    animation: none;
  }
`;

/**
 * UpdateChip
 *
 * A compact, pulsing chip shown in the Header when a new service worker
 * version is waiting to activate. Clicking it reloads the page immediately,
 * applying the update.
 */
const UpdateChip = ({ onClick, 'data-testid': dataTestId }: Props) => (
  <Chip
    onClick={onClick}
    aria-label="Update available — click to reload and apply"
    data-testid={dataTestId ?? 'update-chip'}
  >
    <span className="material-symbols-outlined" aria-hidden="true">
      update
    </span>
    Update available
  </Chip>
);

export default UpdateChip;
