import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import DiscordIcon from '../atoms/DiscordIcon';
import GithubIcon from '../atoms/GithubIcon';

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
  const [isOpening, setIsOpening] = useState(false);

  // Track whether we're opening or closing for animation speed
  useEffect(() => {
    if (isOpen) {
      setIsOpening(true);
    } else {
      setIsOpening(false);
    }
  }, [isOpen]);

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
        onClick={(e) => e.stopPropagation()}
      >
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
              href="https://github.com/ergogen/ergogen"
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              aria-label="View Ergogen v4.2.1 on GitHub"
              data-testid="side-nav-version-link"
            >
              v4.2.1
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
          {/* Content area - can be expanded in the future */}
        </Content>
        <Footer>
          <ButtonGroup>
            <OutlineButton
              onClick={() => {
                window.open('https://docs.ergogen.xyz/', '_blank', 'noopener,noreferrer');
              }}
              aria-label="Open documentation"
              data-testid="side-nav-docs-button"
            >
              <span className="material-symbols-outlined">description</span>
              <span>Docs</span>
            </OutlineButton>
            <OutlineButton
              onClick={() => {
                window.open('https://discord.ergogen.xyz', '_blank', 'noopener,noreferrer');
              }}
              aria-label="Join the Discord community"
              data-testid="side-nav-discord-button"
            >
              <DiscordIcon />
            </OutlineButton>
            <OutlineButton
              onClick={() => {
                window.open('https://github.com/ergogen', '_blank', 'noopener,noreferrer');
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
  transition: opacity ${(props) => (props.$isOpening ? '0.2s' : '0.1s')} ease-in-out;
  pointer-events: ${(props) => (props.$isOpen ? 'auto' : 'none')};
`;

const Panel = styled.div<{ $isOpen: boolean; $isOpening: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 320px;
  max-width: 90vw;
  background-color: ${theme.colors.backgroundLight};
  border-right: 1px solid ${theme.colors.border};
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(${(props) => (props.$isOpen ? '0' : '-100%')});
  transition: transform ${(props) => (props.$isOpening ? '0.2s' : '0.1s')} ease-in-out;

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
`;

const Footer = styled.div`
  padding: 1rem;
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
  transition: color 0.15s ease-in-out,
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

export default SideNavigation;
