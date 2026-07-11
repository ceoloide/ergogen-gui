import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { theme } from '../theme/theme';

type Props = {
  onClick: () => void;
  'data-testid'?: string;
};

// Ripple expands outward from 0 → 6px and fades out, then resets instantly.
// Holding transparent from 70%→100% prevents the inward "breathe-back" motion.
const ripple = keyframes`
  0%   { box-shadow: 0 0 0 0   ${theme.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${theme.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${theme.colors.accent}00; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Chip = styled.button<{ $isUpdating?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  height: 28px;
  background-color: ${theme.colors.backgroundLight};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  color: ${theme.colors.white};
  font-size: 11px;
  font-weight: ${theme.fontWeights.semiBold};
  cursor: pointer;
  white-space: nowrap;
  animation: ${ripple} ${(props) => (props.$isUpdating ? '0.6s' : '2s')}
    ease-out infinite;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
    ${(props) =>
      props.$isUpdating &&
      css`
        animation: ${spin} 1s linear infinite;
      `}
  }

  &:hover {
    background-color: ${theme.colors.backgroundLighter};
  }

  &:disabled {
    cursor: default;
    background-color: ${theme.colors.backgroundLight};
    opacity: 0.95;
  }
`;

/**
 * UpdateChip
 *
 * A compact chip shown in the Header when a new service worker version is
 * waiting to activate. A green ripple glow pulses outward to draw attention.
 * Clicking it reloads the page immediately, applying the update.
 */
const UpdateChip = ({ onClick, 'data-testid': dataTestId }: Props) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = () => {
    setIsUpdating(true);
    onClick();
  };

  return (
    <Chip
      onClick={handleClick}
      disabled={isUpdating}
      $isUpdating={isUpdating}
      aria-label={
        isUpdating
          ? 'Updating version...'
          : 'Update available — click to reload and apply'
      }
      data-testid={dataTestId ?? 'update-chip'}
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        {isUpdating ? 'sync' : 'update'}
      </span>
      {isUpdating ? 'Updating version...' : 'Update Available'}
    </Chip>
  );
};

export default UpdateChip;
