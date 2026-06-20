import React, { useEffect, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../theme/theme';
import DiscordIcon from '../atoms/DiscordIcon';
import GithubIcon from '../atoms/GithubIcon';
import { useConfigContext } from '../context/ConfigContext';

interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  'data-testid'?: string;
}

const SideNavigation: React.FC<SideNavigationProps> = ({
  isOpen,
  onClose,
  'data-testid': dataTestId,
}) => {
  const configContext = useConfigContext();
  const [isOpening, setIsOpening] = useState(false);
  const [panelWidth, setPanelWidth] = useState(320);
  const [searchFilter, setSearchFilter] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      setSearchFilter('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsOpening(true);
      const timer = setTimeout(() => setIsOpening(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = panelWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const filteredConfigs = useMemo(() => {
    const allConfigs = [...(configContext?.configs || [])];
    if (configContext?.activeConfigId === "temp" && configContext?.configInput !== undefined) {
      allConfigs.unshift({ id: "temp", name: "Shared (Unsaved)", content: configContext.configInput });
    }
    if (allConfigs.length === 0) return [];
    if (!searchFilter.trim()) return allConfigs;
    const searchWords = searchFilter.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    return allConfigs.filter(config => {
      const name = config.name.toLowerCase();
      return searchWords.some(word => name.includes(word));
    });
  }, [configContext?.configs, searchFilter]);

  const handleStartRename = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleFinishRename = () => {
    if (editingId && configContext) {
      configContext.renameConfig(editingId, editName);
    }
    setEditingId(null);
  };

  return (
    <>
      <Overlay data-testid={dataTestId} onClick={onClose} $isOpen={isOpen} $isOpening={isOpening} />
      <Panel data-testid={dataTestId && `${dataTestId}-panel`} $isOpen={isOpen} $isOpening={isOpening} $width={panelWidth} onClick={(e) => e.stopPropagation()}>
        <ResizeHandle onMouseDown={handleResizeStart} />
        <Header>
          <LogoSection>
            <LogoButton to="/" onClick={onClose}>
              <LogoImage src={`${process.env.PUBLIC_URL}/ergogen.png`} alt="Logo" />
            </LogoButton>
            <AppName onClick={onClose}>Ergogen</AppName>
            <VersionText href="https://github.com/ergogen/ergogen" target="_blank">v4.2.1</VersionText>
          </LogoSection>
          <CloseButton onClick={onClose} aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </CloseButton>
        </Header>

        <SearchContainer>
          <SearchInput
            placeholder="Search configurations..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </SearchContainer>

        <Content>
          <ConfigList>
            {filteredConfigs.map(config => (
              <ConfigItem
                key={config.id}
                $isActive={config.id === configContext?.activeConfigId}
                onClick={() => {
                  configContext?.switchConfig(config.id);
                  onClose();
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, overflow: 'hidden' }}>
                  {editingId === config.id ? (
                    <RenameInput
                      value={editName}
                      autoFocus
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={handleFinishRename}
                      onKeyDown={(e) => e.key === 'Enter' && handleFinishRename()}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <ConfigName title={config.name}>{config.name}</ConfigName>
                      {config.id === 'temp' && <UnsavedBadge>Unsaved</UnsavedBadge>}
                    </>
                  )}
                </div>

                <ActionGroup onClick={(e) => e.stopPropagation()}>
                  {deletingId === config.id ? (
                    <>
                      <IconButton onClick={() => { configContext?.deleteConfig(config.id); setDeletingId(null); }} title="Confirm Delete" style={{ color: theme.colors.error }}>
                        <span className="material-symbols-outlined">check</span>
                      </IconButton>
                      <IconButton onClick={() => setDeletingId(null)} title="Cancel">
                        <span className="material-symbols-outlined">close</span>
                      </IconButton>
                    </>
                  ) : (
                    <>
                      {config.id !== 'temp' && (
                        <>
                          <IconButton onClick={() => handleStartRename(config.id, config.name)} title="Rename">
                            <span className="material-symbols-outlined">edit</span>
                          </IconButton>
                          <IconButton onClick={() => configContext?.duplicateConfig(config.id)} title="Duplicate">
                            <span className="material-symbols-outlined">content_copy</span>
                          </IconButton>
                          <IconButton onClick={() => setDeletingId(config.id)} title="Delete">
                            <span className="material-symbols-outlined">delete</span>
                          </IconButton>
                        </>
                      )}
                    </>
                  )}
                </ActionGroup>
              </ConfigItem>
            ))}
          </ConfigList>
        </Content>

        <Footer>
          <ButtonGroup>
<OutlineButton onClick={() => configContext?.exportAll()} disabled={configContext?.isExporting} title="Export all configurations as ZIP">
              <span className="material-symbols-outlined">{configContext?.isExporting ? 'sync' : 'download_for_offline'}</span>
              <span>{configContext?.isExporting ? 'Exporting...' : 'Export All'}</span>
            </OutlineButton>
            <OutlineButton onClick={() => window.open('https://docs.ergogen.xyz/', '_blank')}>
              <span className="material-symbols-outlined">description</span>
              <span>Docs</span>
            </OutlineButton>
            <OutlineButton onClick={() => window.open('https://discord.ergogen.xyz', '_blank')}>
              <DiscordIcon />
            </OutlineButton>
            <OutlineButton onClick={() => window.open('https://github.com/ergogen', '_blank')}>
              <GithubIcon />
            </OutlineButton>
          </ButtonGroup>
        </Footer>
      </Panel>
    </>
  );
};

const Overlay = styled.div<{ $isOpen: boolean; $isOpening: boolean }>`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); z-index: 999;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: opacity ${props => (props.$isOpening ? '0.2s' : '0.1s')} ease-in-out;
  pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
`;

const Panel = styled.div<{ $isOpen: boolean; $isOpening: boolean; $width: number }>`
  position: fixed; top: 0; left: 0; height: 100%;
  width: ${props => props.$width}px; max-width: min(600px, 90vw);
  background-color: ${theme.colors.backgroundLight}; border-right: 1px solid ${theme.colors.border};
  box-shadow: ${props => props.$isOpen ? '4px 0 20px rgba(0, 0, 0, 0.5)' : 'none'};
  z-index: 1000; display: flex; flex-direction: column;
  transform: translateX(${props => (props.$isOpen ? '0' : '-100%')});
  transition: transform ${props => (props.$isOpening ? '0.2s' : '0.1s')} ease-in-out;
  @media (max-width: 639px) { width: 100%; max-width: 100%; }
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 1rem; height: 3em; flex-shrink: 0;
`;

const LogoSection = styled.div` display: flex; align-items: center; gap: 6px; flex: 1; overflow: hidden; `;
const LogoButton = styled(Link)` display: block; width: 34px; height: 34px; flex-shrink: 0; `;
const LogoImage = styled.img` width: 100%; height: 100%; border-radius: 6px; `;
const AppName = styled.div` font-size: ${theme.fontSizes.base}; font-weight: ${theme.fontWeights.semiBold}; color: ${theme.colors.white}; cursor: pointer; `;
const VersionText = styled.a` font-size: ${theme.fontSizes.sm}; color: ${theme.colors.accent}; text-decoration: none; `;
const CloseButton = styled.button` background: none; border: none; color: ${theme.colors.textDark}; cursor: pointer; padding: 0.5rem; display: flex; `;

const SearchContainer = styled.div` padding: 0 1rem 0.5rem; `;
const SearchInput = styled.input`
  width: 100%; background: ${theme.colors.background}; border: 1px solid ${theme.colors.border};
  border-radius: 4px; color: white; padding: 8px; font-size: ${theme.fontSizes.sm};
  &:focus { outline: none; border-color: ${theme.colors.accent}; }
`;

const Content = styled.div` flex: 1; overflow-y: auto; padding: 0.5rem 1rem; `;
const ConfigList = styled.div` display: flex; flex-direction: column; gap: 4px; `;
const ConfigItem = styled.div<{ $isActive: boolean }>`
  padding: 8px 12px; border-radius: 6px; cursor: pointer;
  background: ${props => props.$isActive ? theme.colors.backgroundLighter : 'transparent'};
  display: flex; align-items: center; justify-content: space-between;
  &:hover { background: ${theme.colors.backgroundLighter}; }
`;


const UnsavedBadge = styled.span`
  background: ${theme.colors.warningDark};
  color: ${theme.colors.background};
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: bold;
  text-transform: uppercase;
`;

const ConfigName = styled.span` font-size: ${theme.fontSizes.sm}; color: ${theme.colors.white}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; `;
const RenameInput = styled.input`
  flex: 1; background: ${theme.colors.background}; border: 1px solid ${theme.colors.accent};
  border-radius: 4px; color: white; padding: 2px 4px; font-size: ${theme.fontSizes.sm};
`;

const ActionGroup = styled.div` display: flex; gap: 4px; opacity: 0.6; &:hover { opacity: 1; } `;
const IconButton = styled.button`
  background: none; border: none; color: white; cursor: pointer; display: flex; padding: 4px; border-radius: 4px;
  &:hover { background: ${theme.colors.buttonHover}; }
  .material-symbols-outlined { font-size: 16px; }
`;

const Footer = styled.div` padding: 1rem; height: 3em; display: flex; justify-content: center; align-items: center; flex-shrink: 0; `;
const ButtonGroup = styled.div` display: flex; gap: 10px; `;
const OutlineButton = styled.button`
  background: transparent; border: 1px solid ${theme.colors.border}; border-radius: 6px;
  color: white; display: flex; align-items: center; padding: 8px 12px; gap: 6px; cursor: pointer;
  &:hover { background: ${theme.colors.buttonHover}; }
`;

const ResizeHandle = styled.div`
  position: absolute; top: 0; right: 0; width: 4px; height: 100%; cursor: col-resize;
  z-index: 1001; &:hover { background: ${theme.colors.accent}; }
`;

export default SideNavigation;
