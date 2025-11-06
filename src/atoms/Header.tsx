import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useConfigContext } from '../context/ConfigContext';
import { theme } from '../theme/theme';
import { createZip } from '../utils/zip';

/**
 * A styled container for the entire header.
 */
const HeaderContainer = styled.header`
  width: 100%;
  height: 3em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: ${theme.colors.background};
  flex-shrink: 0;

  @media (max-width: 639px) {
    padding: 0 0.5rem;
  }
`;

/**
 * A styled container for the left section of the header.
 */
const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`;

/**
 * A styled container for the right section of the header.
 */
const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

/**
 * A styled container for the Ergogen logo and name.
 */
const ErgogenLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

/**
 * A styled div for the application name.
 */
const AppName = styled.div`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.white};
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
 * A styled button with an outline style, typically for icons.
 */
const OutlineIconButton = styled.button`
    background-color: transparent;
    transition: color .15s ease-in-out,
    background-color .15s ease-in-out,
    border-color .15s ease-in-out,
    box-shadow .15s ease-in-out;
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
    gap: 6px
    height: 34px;

    .material-symbols-outlined {
        font-size: ${theme.fontSizes.iconMedium} !important;
    }

    &:hover {
        background-color: ${theme.colors.buttonHover};
    }
`;

/**
 * A styled button for toggling the side navigation panel.
 */
const SideNavButton = styled(OutlineIconButton)`
  flex-shrink: 0;
`;

const AccentIconButton = styled(OutlineIconButton)`
  background-color: ${theme.colors.accent};
  border-color: ${theme.colors.accent};

  &:hover {
    background-color: ${theme.colors.accentDark};
    border-color: ${theme.colors.accentDarker};
  }
`;

const ArchiveIconButton = styled(OutlineIconButton)`
  @media (max-width: 639px) {
    display: none;
  }
`;

/**
 * A responsive button that is only visible on smaller screens.
 * Note: This component is defined but not currently used in the Header.
 */
const LogoButton = styled(Link)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`;

/**
 * The main header component for the application.
 * It displays the application logo, name, version, and navigation links.
 * It also includes a button to toggle the settings panel.
 *
 * @returns {JSX.Element} The rendered header component.
 */
const Header = (): JSX.Element => {
  const configContext = useConfigContext();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Toggles the visibility of the settings panel.
   */
  const toggleSettings = () => {
    configContext?.setShowSettings(!configContext?.showSettings);
  };

  const handleNewClick = () => {
    configContext?.setShowSettings(false);
    navigate('/new');
  };

  const handleDownloadArchive = () => {
    if (
      !configContext?.results ||
      !configContext?.configInput ||
      configContext?.isGenerating ||
      configContext?.isJscadConverting
    ) {
      return;
    }
    createZip(
      configContext.results,
      configContext.configInput,
      configContext.injectionInput,
      configContext.debug,
      configContext.stlPreview
    );
  };

  const toggleSideNav = () => {
    configContext?.setShowSideNav(!configContext?.showSideNav);
  };

  return (
    <HeaderContainer>
      <LeftContainer>
        <SideNavButton
          onClick={toggleSideNav}
          aria-label={
            configContext?.showSideNav
              ? 'Hide navigation panel'
              : 'Show navigation panel'
          }
          data-testid="side-nav-toggle-button"
        >
          <span className="material-symbols-outlined">side_navigation</span>
        </SideNavButton>
        <ErgogenLogo>
          <LogoButton
            to="/"
            aria-label="Go to home page"
            data-testid="logo-button"
          >
            <LogoImage
              src={`${process.env.PUBLIC_URL}/ergogen.png`}
              alt="Ergogen logo"
            />
          </LogoButton>
          <AppName>Ergogen</AppName>
          <VersionText
            href="https://github.com/ergogen/ergogen"
            target="_blank"
            rel="noreferrer"
            aria-label="View Ergogen v4.2.1 on GitHub"
            data-testid="version-link"
          >
            v4.2.1
          </VersionText>
        </ErgogenLogo>
      </LeftContainer>
      <RightContainer>
        {location.pathname === '/' && (
          <AccentIconButton
            onClick={handleNewClick}
            aria-label="Start new configuration"
            data-testid="new-config-button"
          >
            <span className="material-symbols-outlined">add_2</span>
            <span>New</span>
          </AccentIconButton>
        )}
        {location.pathname === '/' && (
          <ArchiveIconButton
            onClick={handleDownloadArchive}
            disabled={
              configContext?.isGenerating || configContext?.isJscadConverting
            }
            aria-label="Download archive of all generated files"
            data-testid="header-download-outputs-button"
          >
            <span className="material-symbols-outlined">archive</span>
          </ArchiveIconButton>
        )}
        <OutlineIconButton
          onClick={toggleSettings}
          aria-label={
            configContext?.showSettings
              ? 'Hide settings panel'
              : 'Show settings panel'
          }
          data-testid="settings-button"
        >
          <span className="material-symbols-outlined">
            {configContext?.showSettings ? 'keyboard_alt' : 'settings'}
          </span>
        </OutlineIconButton>
      </RightContainer>
    </HeaderContainer>
  );
};

export default Header;
