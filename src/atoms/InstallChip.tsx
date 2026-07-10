import styled, { keyframes } from 'styled-components';
import { theme } from '../theme/theme';

type Props = {
  onClick: () => void;
  'data-testid'?: string;
};

// Ripple expands outward from 0 → 6px and fades out, then resets instantly.
const ripple = keyframes`
  0%   { box-shadow: 0 0 0 0   ${theme.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${theme.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${theme.colors.accent}00; }
`;

const Chip = styled.button`
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
  animation: ${ripple} 2s ease-out infinite;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
  }

  &:hover {
    background-color: ${theme.colors.backgroundLighter};
  }
`;

/**
 * InstallChip
 *
 * A compact chip shown in the Header when the PWA is installable on the device
 * (under development conditions or force_install parameter).
 * A green ripple glow pulses outward to draw attention.
 * Clicking it triggers the native PWA install prompt.
 */
const InstallChip = ({ onClick, 'data-testid': dataTestId }: Props) => (
  <Chip
    onClick={onClick}
    aria-label="Install app"
    data-testid={dataTestId ?? 'install-chip'}
  >
    <span className="material-symbols-outlined" aria-hidden="true">
      system_update_alt
    </span>
    Install App
  </Chip>
);

export default InstallChip;
