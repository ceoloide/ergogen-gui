import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import { getErgogenVersionInfo } from '../utils/version';
import DiscordIcon from '../atoms/DiscordIcon';
import GithubIcon from '../atoms/GithubIcon';
import { useConfigContext } from '../context/ConfigContext';
import { trackEvent } from '../utils/analytics';

/**
 * Props for the SideNavigation component.
 */
type SideNavigationProps = {
  isOpen: boolean;
  onClose: () => void;
  'data-testid'?: string;
};

/**
 * A side navigation panel that slides in from the left.
 * On mobile, it covers 100% of the screen.
 */
const SideNavigation: React.FC<SideNavigationProps> = ({
  isOpen,
  onClose,
  'data-testid': dataTestId,
}) => {
  const prevIsOpenRef = useRef(isOpen);
  const [isOpening, setIsOpening] = useState(isOpen);
  const [panelWidth, setPanelWidth] = useState(320);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(320);

  const configContext = useConfigContext();
  const navigate = useNavigate();

  const {
    configs,
    activeConfigId,
    selectConfig,
    renameConfig,
    duplicateConfig,
    deleteConfig,
    setIsBulkDownloadOpen,
  } = configContext || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const filteredConfigs = useMemo(() => {
    if (!configs) return [];

    let result = configs;
    if (searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      if (terms.length > 0) {
        result = configs.filter((cfg) => {
          const nameLower = cfg.name.toLowerCase();
          return terms.some((term) => nameLower.includes(term));
        });
      }
    }

    return [...result].sort((a, b) => {
      const timeAMod = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeBMod = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      if (timeAMod !== timeBMod) {
        return timeBMod - timeAMod;
      }

      const timeACre = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeBCre = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeACre !== timeBCre) {
        return timeBCre - timeACre;
      }

      return a.name.localeCompare(b.name);
    });
  }, [configs, searchQuery]);

  const handleNewConfig = () => {
    if (selectConfig) {
      selectConfig(null);
    }
    navigate('/new');
    onClose();
  };

  const handleDownloadAll = () => {
    trackEvent('bulk_download_dialog_opened', {
      stored_configs_count: configs?.length || 0,
    });
    if (setIsBulkDownloadOpen) {
      setIsBulkDownloadOpen(true);
    }
    onClose();
  };

  const handleSelectConfig = (id: string) => {
    if (selectConfig) {
      selectConfig(id);
      navigate('/');
      onClose();
    }
  };

  const handleStartRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenameValue(currentName);
  };

  const handleRenameSubmit = (id: string) => {
    if (renameConfig && renameValue.trim()) {
      const success = renameConfig(id, renameValue.trim());
      if (!success) {
        return;
      }
    }
    setRenamingId(null);
  };

  const handleDuplicateConfig = (id: string) => {
    if (duplicateConfig) {
      duplicateConfig(id);
    }
  };

  const handleDeleteConfig = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      if (deleteConfig) {
        deleteConfig(id);
        const isDeletingActive = activeConfigId === id;
        const isLastConfig = configs && configs.length <= 1;
        if (isDeletingActive || isLastConfig) {
          navigate('/new');
          onClose();
        }
      }
    }
  };

  // Track whether we're opening or closing for animation speed
  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    if (isOpen && !wasOpen) {
      // Opening: was closed, now open
      setIsOpening(true);
    } else if (!isOpen && wasOpen) {
      // Closing: was open, now closed
      setIsOpening(false);
    }
    if (!isOpen) {
      setRenamingId(null);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  // Track search queries
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => {
      trackEvent('search_performed', {
        query_length: searchQuery.trim().length,
      });
    }, 1000); // 1-second debounce to avoid firing on every keystroke
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      const deltaX = e.clientX - startXRef.current;
      const newWidth = startWidthRef.current + deltaX;
      const maxWidth = Math.min(600, window.innerWidth * 0.9);
      const constrainedWidth = Math.max(320, Math.min(newWidth, maxWidth));
      setPanelWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isResizingRef.current) return;
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - startXRef.current;
      const newWidth = startWidthRef.current + deltaX;
      const maxWidth = Math.min(600, window.innerWidth * 0.9);
      const constrainedWidth = Math.max(320, Math.min(newWidth, maxWidth));
      setPanelWidth(constrainedWidth);
    };

    const handleTouchEnd = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    startWidthRef.current = panelWidth;

    if ('touches' in e) {
      startXRef.current = e.touches[0].clientX;
    } else {
      startXRef.current = e.clientX;
    }

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // Handle Esc key press
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const versionInfo = useMemo(
    () => getErgogenVersionInfo(process.env.REACT_APP_ERGOGEN_VERSION),
    []
  );

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <Overlay
        data-testid={dataTestId}
        onClick={onClose}
        $isOpen={isOpen}
        $isOpening={isOpening}
      />
      <Panel
        data-testid={dataTestId && `${dataTestId}-panel`}
        $isOpen={isOpen}
        $isOpening={isOpening}
        $width={panelWidth}
        onClick={(e) => e.stopPropagation()}
      >
        <ResizeHandle
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
          data-testid={dataTestId && `${dataTestId}-resize-handle`}
        />
        <Header>
          <LogoSection>
            <LogoButton
              to="/"
              onClick={onClose}
              aria-label="Go to home page"
              data-testid="side-nav-logo-button"
            >
              <LogoImage
                src={`${process.env.PUBLIC_URL}/ergogen.png`}
                alt="Ergogen logo"
              />
            </LogoButton>
            <AppName onClick={onClose}>Ergogen</AppName>
            <VersionText
              href={versionInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              aria-label={`View Ergogen ${versionInfo.label} on GitHub`}
              data-testid="side-nav-version-link"
            >
              {versionInfo.label}
            </VersionText>
          </LogoSection>
          <CloseButton
            onClick={onClose}
            data-testid={dataTestId && `${dataTestId}-close`}
            aria-label="Close navigation panel"
          >
            <span className="material-symbols-outlined">close</span>
          </CloseButton>
        </Header>
        <Content>
          <ActionBar>
            <NewConfigButton
              onClick={handleNewConfig}
              aria-label="New"
              data-testid="side-nav-new-config-button"
            >
              <span className="material-symbols-outlined">add</span>
              <span>New</span>
            </NewConfigButton>
            {configs && configs.length > 0 && (
              <DownloadAllButton
                onClick={handleDownloadAll}
                aria-label="Download All"
                data-testid="side-nav-download-all-button"
              >
                <span className="material-symbols-outlined">download</span>
                <span>Download All</span>
              </DownloadAllButton>
            )}
          </ActionBar>

          <SearchWrapper>
            <span className="material-symbols-outlined search-icon">
              search
            </span>
            <SearchInput
              type="text"
              placeholder="Search configurations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search configurations"
            />
            {searchQuery && (
              <ClearSearchButton onClick={() => setSearchQuery('')}>
                <span className="material-symbols-outlined">close</span>
              </ClearSearchButton>
            )}
          </SearchWrapper>

          <ConfigListHeader>
            <span>Saved Configurations</span>
            <Badge>{filteredConfigs.length}</Badge>
          </ConfigListHeader>

          <ConfigList>
            {filteredConfigs.map((cfg) => {
              const isActive = cfg.id === activeConfigId;
              const isRenaming = renamingId === cfg.id;

              return (
                <ConfigItem
                  key={cfg.id}
                  $isActive={isActive}
                  data-testid={`config-item-${cfg.id}`}
                >
                  {isRenaming ? (
                    <RenameForm
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleRenameSubmit(cfg.id);
                      }}
                    >
                      <RenameInput
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        // eslint-disable-next-line
                        autoFocus
                        aria-label="Rename input"
                      />
                      <RenameActionBtn type="submit" aria-label="Save name">
                        <span className="material-symbols-outlined">check</span>
                      </RenameActionBtn>
                      <RenameActionBtn
                        type="button"
                        onClick={() => setRenamingId(null)}
                        aria-label="Cancel rename"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </RenameActionBtn>
                    </RenameForm>
                  ) : (
                    <>
                      <ConfigNameButton
                        onClick={() => handleSelectConfig(cfg.id)}
                        $isActive={isActive}
                        title={cfg.name}
                      >
                        <span className="material-symbols-outlined">
                          description
                        </span>
                        <span className="config-title-text">{cfg.name}</span>
                      </ConfigNameButton>
                      <ItemActions $isActive={isActive}>
                        <ActionIconBtn
                          onClick={() => handleStartRename(cfg.id, cfg.name)}
                          aria-label={`Rename configuration ${cfg.name}`}
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </ActionIconBtn>
                        <ActionIconBtn
                          onClick={() => handleDuplicateConfig(cfg.id)}
                          aria-label={`Duplicate configuration ${cfg.name}`}
                        >
                          <span className="material-symbols-outlined">
                            content_copy
                          </span>
                        </ActionIconBtn>
                        <ActionIconBtn
                          onClick={() => handleDeleteConfig(cfg.id, cfg.name)}
                          aria-label={`Delete configuration ${cfg.name}`}
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </ActionIconBtn>
                      </ItemActions>
                    </>
                  )}
                </ConfigItem>
              );
            })}
            {filteredConfigs.length === 0 && (
              <EmptyState>No configurations found</EmptyState>
            )}
          </ConfigList>
        </Content>
        <Footer>
          <ButtonGroup>
            <OutlineButton
              onClick={() => {
                window.open(
                  'https://docs.ergogen.xyz/',
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
              aria-label="Open documentation"
              data-testid="side-nav-docs-button"
            >
              <span className="material-symbols-outlined">description</span>
              <span>Docs</span>
            </OutlineButton>
            <OutlineButton
              onClick={() => {
                window.open(
                  'https://discord.ergogen.xyz',
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
              aria-label="Join the Discord community"
              data-testid="side-nav-discord-button"
            >
              <DiscordIcon />
            </OutlineButton>
            <OutlineButton
              onClick={() => {
                window.open(
                  'https://github.com/ergogen',
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
              aria-label="View the GitHub repositories"
              data-testid="side-nav-github-button"
            >
              <GithubIcon />
            </OutlineButton>
          </ButtonGroup>
        </Footer>
      </Panel>
    </>
  );
};

const Overlay = styled.div<{ $isOpen: boolean; $isOpening: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transition: opacity ${(props) => (props.$isOpening ? '0.2s' : '0.1s')}
    ease-in-out;
  pointer-events: ${(props) => (props.$isOpen ? 'auto' : 'none')};
`;

const Panel = styled.div<{
  $isOpen: boolean;
  $isOpening: boolean;
  $width: number;
}>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: ${(props) => props.$width}px;
  max-width: min(600px, 90vw);
  background-color: ${theme.colors.backgroundLight};
  border-right: 1px solid ${theme.colors.border};
  box-shadow: ${(props) =>
    props.$isOpen ? '4px 0 20px rgba(0, 0, 0, 0.5)' : 'none'};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(${(props) => (props.$isOpen ? '0' : '-100%')});
  transition:
    transform ${(props) => (props.$isOpening ? '0.2s' : '0.1s')} ease-in-out,
    box-shadow ${(props) => (props.$isOpening ? '0.2s' : '0.1s')} ease-in-out;

  @media (max-width: 639px) {
    width: 100%;
    max-width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3em;
  flex-shrink: 0;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

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

const AppName = styled.div`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.white};
  cursor: pointer;
`;

const VersionText = styled.a`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.accent};
  text-decoration: none;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textDark};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
  flex-shrink: 0;

  .material-symbols-outlined {
    font-size: ${theme.fontSizes.iconLarge};
  }

  &:hover {
    background-color: ${theme.colors.buttonHover};
    color: ${theme.colors.text};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`;

const NewConfigButton = styled.button`
  flex: 1;
  background-color: ${theme.colors.accent};
  color: ${theme.colors.white};
  border: none;
  border-radius: 6px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${theme.fontWeights.regular};
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  padding: 0 6px;

  .material-symbols-outlined {
    font-size: 20px;
  }

  &:hover {
    background-color: ${theme.colors.accentDark};
  }
`;

const DownloadAllButton = styled.button`
  flex: 1;
  background-color: transparent;
  color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${theme.fontWeights.regular};
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  padding: 0 6px;

  .material-symbols-outlined {
    font-size: 20px;
  }

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  .search-icon {
    position: absolute;
    left: 8px;
    color: ${theme.colors.textDark};
    pointer-events: none;
    font-size: 18px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  background-color: ${theme.colors.backgroundLighter};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  height: 36px;
  padding: 0 34px;
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.bodySmall};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: ${theme.colors.textDark};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  .material-symbols-outlined {
    font-size: 16px;
  }

  &:hover {
    color: ${theme.colors.white};
  }
`;

const ConfigListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: ${theme.fontSizes.bodySmall};
  color: ${theme.colors.textDark};
  font-weight: ${theme.fontWeights.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
`;

const Badge = styled.span`
  background-color: ${theme.colors.border};
  color: ${theme.colors.white};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${theme.fontWeights.semiBold};
`;

const ConfigList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
`;

const ConfigItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid
    ${(props) => (props.$isActive ? theme.colors.accent : 'transparent')};
  padding: 2px 6px;
  height: 38px;
  min-width: 0;
  flex-shrink: 0;

  &:hover {
    background-color: ${theme.colors.buttonHover};

    /* Show action buttons on hover */
    .item-actions-hover {
      opacity: 1;
    }
  }
`;

const ConfigNameButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) =>
    props.$isActive ? theme.colors.white : theme.colors.textDark};
  font-weight: ${(props) =>
    props.$isActive ? theme.fontWeights.semiBold : theme.fontWeights.regular};
  font-size: ${theme.fontSizes.bodySmall};
  text-align: left;
  cursor: pointer;
  min-width: 0;
  padding: 0;
  height: 100%;

  .material-symbols-outlined {
    font-size: 18px;
    color: ${(props) =>
      props.$isActive ? theme.colors.accent : theme.colors.textDark};
  }

  .config-title-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    color: ${theme.colors.white};
  }
`;

const ItemActions = styled.div.attrs({ className: 'item-actions-hover' })<{
  $isActive?: boolean;
}>`
  display: flex;
  gap: 4px;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  transition: opacity 0.15s ease-in-out;

  @media (max-width: 1023px) {
    opacity: 1;
  }
`;

const ActionIconBtn = styled.button`
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
    font-size: 16px;
  }

  &:hover {
    background-color: ${theme.colors.border};
    color: ${theme.colors.white};
  }
`;

const RenameForm = styled.form`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`;

const RenameInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  height: 100%;
  padding: 0;
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.bodySmall};
  font-weight: ${theme.fontWeights.semiBold};

  &:focus {
    outline: none;
  }
`;

const RenameActionBtn = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.textDark};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  .material-symbols-outlined {
    font-size: 18px;
  }

  &:hover {
    color: ${theme.colors.white};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${theme.colors.textDark};
  font-size: ${theme.fontSizes.bodySmall};
  margin-top: 2rem;
  font-style: italic;
`;

const Footer = styled.div`
  padding: 0 1rem;
  height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const OutlineButton = styled.button`
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

const ResizeHandle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  cursor: col-resize;
  z-index: 1001;
  background-color: transparent;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${theme.colors.accent};
  }

  @media (max-width: 639px) {
    display: none;
  }
`;

export default SideNavigation;
