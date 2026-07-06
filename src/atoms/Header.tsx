import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useConfigContext } from '../context/ConfigContext';
import { getErgogenVersionInfo } from '../utils/version';
import { theme } from '../theme/theme';
import { createZip } from '../utils/zip';
import { createShareableUri } from '../utils/share';
import { trackEvent } from '../utils/analytics';
import ShareDialog from '../molecules/ShareDialog';

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
  @media (max-width: 767px) {
    display: none;
  }
`;

/**
 * A styled button with an outline style, typically for icons.
 */
const OutlineIconButton = styled.button`
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

const NewButtonText = styled.span`
  @media (max-width: 375px) {
    display: none;
  }
`;

const ArchiveIconButton = styled(OutlineIconButton)``;

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
  const {
    activeConfigId,
    activeConfigName,
    configs,
    isPreview,
    renameConfig,
    duplicateConfig,
    deleteConfig,
  } = configContext || {};

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = () => {
    if (activeConfigName && activeConfigId) {
      setEditValue(activeConfigName);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = (e?: React.MouseEvent | React.FocusEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (renameConfig && activeConfigId && editValue.trim()) {
      renameConfig(activeConfigId, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (duplicateConfig && activeConfigId) {
      duplicateConfig(activeConfigId);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeConfigId && activeConfigName && deleteConfig) {
      if (
        window.confirm(`Are you sure you want to delete "${activeConfigName}"?`)
      ) {
        deleteConfig(activeConfigId);
        const isLastConfig = configs && configs.length <= 1;
        if (isLastConfig || activeConfigId) {
          navigate('/new');
        }
      }
    }
  };

  /**
   * Toggles the visibility of the settings panel.
   */
  const toggleSettings = () => {
    configContext?.setShowSettings(!configContext?.showSettings);
  };

  const handleNewClick = () => {
    configContext?.setShowSettings(false);
    configContext?.selectConfig(null);
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

  /**
   * Creates a shareable URI with the current configuration and shows a dialog.
   * Only includes footprints that are actually used in the configuration (based on canonical.yaml).
   * Non-footprint injections (templates, etc.) are always included.
   */
  const handleShare = () => {
    if (!configContext?.configInput) {
      return;
    }

    const shareableUri = createShareableUri({
      config: configContext.configInput,
      injections: configContext.injectionInput,
      canonical: configContext.results?.canonical,
    });

    trackEvent('share_button_clicked', {
      has_injections: !!configContext.injectionInput?.length,
      injections_count: configContext.injectionInput?.length || 0,
    });

    setShareLink(shareableUri);
    setShowShareDialog(true);
  };

  const toggleSideNav = () => {
    configContext?.setShowSideNav(!configContext?.showSideNav);
  };

  const versionInfo = useMemo(
    () => getErgogenVersionInfo(process.env.REACT_APP_ERGOGEN_VERSION),
    []
  );

  return (
    <>
      {showShareDialog && (
        <ShareDialog
          shareLink={shareLink}
          onClose={() => setShowShareDialog(false)}
          data-testid="share-dialog"
        />
      )}
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
              href={versionInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View Ergogen ${versionInfo.label} on GitHub`}
              data-testid="version-link"
            >
              {versionInfo.label}
            </VersionText>
          </ErgogenLogo>
          {activeConfigName && (
            <>
              <ConfigDivider>/</ConfigDivider>
              <ActiveConfigNameSection
                data-testid="header-active-config-name"
                $isEditing={isEditing}
                onClick={!isEditing ? handleStartEdit : undefined}
              >
                {isEditing ? (
                  <>
                    <ConfigNameInput
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={handleKeyDown}
                      // eslint-disable-next-line
                      autoFocus
                      data-testid="header-config-name-input"
                      aria-label="Edit configuration name"
                    />
                    <HeaderItemActions className="header-actions-always-visible">
                      <HeaderActionIconBtn
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        onClick={handleSaveEdit}
                        aria-label="Confirm rename"
                        data-testid="header-confirm-rename-btn"
                      >
                        <span className="material-symbols-outlined">check</span>
                      </HeaderActionIconBtn>
                      <HeaderActionIconBtn
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        onClick={handleCancelEdit}
                        aria-label="Cancel rename"
                        data-testid="header-cancel-rename-btn"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </HeaderActionIconBtn>
                    </HeaderItemActions>
                  </>
                ) : (
                  <>
                    <ConfigNameText
                      title="Click to rename"
                      data-testid="header-config-name-text"
                    >
                      {activeConfigName}
                    </ConfigNameText>
                    <HeaderItemActions className="header-actions-hover">
                      <HeaderActionIconBtn
                        onClick={handleStartEdit}
                        aria-label="Rename configuration"
                        data-testid="header-rename-btn"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </HeaderActionIconBtn>
                      <HeaderActionIconBtn
                        onClick={handleDuplicate}
                        aria-label="Duplicate configuration"
                        data-testid="header-duplicate-btn"
                      >
                        <span className="material-symbols-outlined">
                          content_copy
                        </span>
                      </HeaderActionIconBtn>
                      <HeaderActionIconBtn
                        onClick={handleDelete}
                        aria-label="Delete configuration"
                        data-testid="header-delete-btn"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </HeaderActionIconBtn>
                    </HeaderItemActions>
                  </>
                )}
                {isPreview && (
                  <SharedBadge data-testid="header-shared-badge">
                    Shared
                  </SharedBadge>
                )}
              </ActiveConfigNameSection>
            </>
          )}
        </LeftContainer>
        <RightContainer>
          {location.pathname === '/' && (
            <>
              <AccentIconButton
                onClick={handleNewClick}
                aria-label="Start new configuration"
                data-testid="new-config-button"
              >
                <span className="material-symbols-outlined">add_2</span>
                <NewButtonText>New</NewButtonText>
              </AccentIconButton>
              <ArchiveIconButton
                onClick={handleDownloadArchive}
                disabled={
                  configContext?.isGenerating ||
                  configContext?.isJscadConverting
                }
                aria-label="Download archive of all generated files"
                data-testid="header-download-outputs-button"
              >
                <span className="material-symbols-outlined">archive</span>
              </ArchiveIconButton>
              <ArchiveIconButton
                onClick={handleShare}
                disabled={!configContext?.configInput}
                aria-label="Share configuration"
                data-testid="header-share-button"
              >
                <span className="material-symbols-outlined">share</span>
              </ArchiveIconButton>
            </>
          )}
          {location.pathname !== '/new' && (
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
          )}
        </RightContainer>
      </HeaderContainer>
    </>
  );
};

const ActiveConfigNameSection = styled.div<{ $isEditing?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
  height: 34px;
  border-radius: 6px;
  padding: 0 8px;
  transition:
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out;
  cursor: ${(props) => (props.$isEditing ? 'default' : 'pointer')};
  border: 1px solid
    ${(props) => (props.$isEditing ? theme.colors.accent : 'transparent')};
  background-color: ${(props) =>
    props.$isEditing ? theme.colors.backgroundLight : 'transparent'};
  width: 220px;
  box-sizing: border-box;

  &:hover {
    background-color: ${(props) =>
      props.$isEditing
        ? theme.colors.backgroundLight
        : theme.colors.buttonHover};
    .header-actions-hover {
      opacity: 1;
    }
  }

  @media (max-width: 767px) {
    width: 160px;
  }
`;

const HeaderItemActions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
  margin-left: 4px;

  &.header-actions-always-visible {
    opacity: 1;
  }

  @media (max-width: 1023px) {
    opacity: 1;
  }
`;

const HeaderActionIconBtn = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textDark};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  .material-symbols-outlined {
    font-size: 16px !important;
  }

  &:hover {
    background-color: ${theme.colors.buttonHover};
    color: ${theme.colors.white};
  }
`;

const ConfigDivider = styled.span`
  color: ${theme.colors.border};
  font-size: ${theme.fontSizes.sm};
  user-select: none;
`;

const ConfigNameText = styled.span`
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  user-select: none;
`;

const ConfigNameInput = styled.input`
  background: transparent;
  border: none;
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${theme.fontWeights.semiBold};
  padding: 0;
  flex: 1;
  outline: none;
  height: 100%;
  min-width: 0;
`;

const SharedBadge = styled.span`
  background-color: ${theme.colors.accent};
  color: ${theme.colors.white};
  font-size: 10px;
  font-weight: ${theme.fontWeights.semiBold};
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  user-select: none;
  flex-shrink: 0;
`;

export default Header;
