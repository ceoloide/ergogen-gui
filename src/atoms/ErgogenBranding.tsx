import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';

/**
 * Props for the ErgogenBranding component.
 */
type ErgogenBrandingProps = {
  /**
   * Optional click handler that will be called when any part of the branding is clicked.
   * Useful for closing side navigation panels.
   */
  onClick?: () => void;
  /**
   * Optional test ID for the logo button.
   */
  'data-testid'?: string;
};

/**
 * A styled container for the Ergogen logo and name.
 */
const ErgogenLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

/**
 * A styled link for the logo button.
 */
const LogoButton = styled(Link)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`;

/**
 * A styled image for the logo.
 */
const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`;

/**
 * A styled div for the application name.
 */
const AppName = styled.div<{ $clickable?: boolean }>`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.white};
  ${(props) => (props.$clickable ? 'cursor: pointer;' : '')}
  @media (max-width: 420px) {
    display: none;
  }
`;

/**
 * A styled anchor tag for displaying the version number.
 */
const VersionText = styled.a`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.accent};
  text-decoration: none;
  align-items: center;
  @media (max-width: 350px) {
    display: none;
  }
`;

/**
 * A component that displays the Ergogen logo, app name, and version number.
 * This is used in both the main header and the side navigation panel.
 *
 * @param props - The component props
 * @returns The rendered branding component
 */
const ErgogenBranding: React.FC<ErgogenBrandingProps> = ({
  onClick,
  'data-testid': dataTestId,
}) => {
  return (
    <ErgogenLogo>
      <LogoButton
        to="/"
        onClick={onClick}
        aria-label="Go to home page"
        data-testid={dataTestId || 'logo-button'}
      >
        <LogoImage
          src={`${process.env.PUBLIC_URL}/ergogen.png`}
          alt="Ergogen logo"
        />
      </LogoButton>
      <AppName $clickable={!!onClick} onClick={onClick}>
        Ergogen
      </AppName>
      <VersionText
        href="https://github.com/ergogen/ergogen"
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
        aria-label="View Ergogen v4.2.1 on GitHub"
        data-testid={dataTestId ? `${dataTestId}-version-link` : 'version-link'}
      >
        v4.2.1
      </VersionText>
    </ErgogenLogo>
  );
};

export default ErgogenBranding;
