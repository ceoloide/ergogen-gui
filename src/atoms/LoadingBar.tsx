import styled, { keyframes } from 'styled-components';
import { theme } from '../theme/theme';

/**
 * Keyframes for the indeterminate loading animation.
 * Creates a sliding effect from left to right.
 */
const indeterminateAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`;

/**
 * A container for the loading bar that overlays below the header.
 */
const LoadingBarContainer = styled.div`
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
  z-index: 1000;
`;

/**
 * The animated loading bar itself.
 */
const LoadingBarProgress = styled.div`
  height: 100%;
  width: 25%;
  background-color: ${theme.colors.accent};
  animation: ${indeterminateAnimation} 1.5s ease-in-out infinite;
`;

/**
 * Props for the LoadingBar component.
 */
type LoadingBarProps = {
  visible: boolean;
  'data-testid'?: string;
};

/**
 * An indeterminate loading bar component that displays just below the header.
 * Uses the accent color and animates horizontally.
 *
 * @param {LoadingBarProps} props - The component props
 * @returns {JSX.Element | null} The loading bar component, or null if not visible
 */
const LoadingBar = ({ visible, 'data-testid': testId }: LoadingBarProps) => {
  if (!visible) {
    return null;
  }

  return (
    <LoadingBarContainer data-testid={testId}>
      <LoadingBarProgress />
    </LoadingBarContainer>
  );
};

export default LoadingBar;
