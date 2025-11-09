import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../theme/theme';
import DiscordIcon from '../atoms/DiscordIcon';
import GithubIcon from '../atoms/GithubIcon';
import ErgogenBranding from '../atoms/ErgogenBranding';

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
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

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
            <ErgogenBranding
              onClick={onClose}
              data-testid="side-nav-branding"
            />
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

const Panel = styled.div<{ $isOpen: boolean; $isOpening: boolean; $width: number }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: ${(props) => props.$width}px;
  max-width: min(600px, 90vw);
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
