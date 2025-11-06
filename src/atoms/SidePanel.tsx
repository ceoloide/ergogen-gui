import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useConfigContext } from "../context/ConfigContext";
import { theme } from "../theme/theme";
import DiscordIcon from "./DiscordIcon";
import GithubIcon from "./GithubIcon";

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const SidePanelContainer = styled.div<{ isClosing: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: ${theme.colors.background};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: ${({ isClosing }) => (isClosing ? slideOut : slideIn)} 0.3s ease-in-out;

  @media (min-width: 640px) {
    width: 300px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const LogoImage = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 6px;
`;

const AppName = styled.div`
  font-size: ${theme.fontSizes.base};
  font-weight: ${theme.fontWeights.semiBold};
  color: ${theme.colors.white};
`;

const VersionText = styled.a`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.accent};
  text-decoration: none;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.white};
  cursor: pointer;
  font-size: ${theme.fontSizes.iconMedium};
`;

const Footer = styled.div`
  margin-top: auto;
  padding: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const StyledLinkButton = styled.a`
  background-color: transparent;
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
    margin-right: 6px;
    font-size: ${theme.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${theme.colors.buttonHover};
  }
`;

const DocsButton = styled(StyledLinkButton)`
  .material-symbols-outlined {
    margin-right: 0;
  }

  span:not(.material-symbols-outlined) {
    display: none;
  }

  @media (min-width: 640px) {
    span:not(.material-symbols-outlined) {
      display: inline;
    }
  }
`;

const SidePanel = () => {
  const configContext = useConfigContext();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
  };

  const onAnimationEnd = () => {
    if (isClosing) {
      configContext?.setShowSidePanel(false);
    }
  };

  return (
    <SidePanelContainer
      isClosing={isClosing}
      onAnimationEnd={onAnimationEnd}
    >
      <Header>
        <LogoContainer onClick={handleClose}>
          <LogoImage
            src={`${process.env.PUBLIC_URL}/ergogen.png`}
            alt="Ergogen logo"
          />
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
        </LogoContainer>
        <CloseButton onClick={handleClose}>
          <span className="material-symbols-outlined">close</span>
        </CloseButton>
      </Header>
      <Footer>
        <DocsButton
          href="https://docs.ergogen.xyz/"
          target="_blank"
          rel="noreferrer"
          aria-label="Open documentation"
          data-testid="docs-button"
        >
          <span className="material-symbols-outlined">description</span>
          <span>Docs</span>
        </DocsButton>
        <StyledLinkButton
          href="https://discord.ergogen.xyz"
          target="_blank"
          rel="noreferrer"
          aria-label="Join the Discord community"
          data-testid="discord-button"
        >
          <DiscordIcon />
        </StyledLinkButton>
        <StyledLinkButton
          href="https://github.com/ergogen"
          target="_blank"
          rel="noreferrer"
          aria-label="View the GitHub repositories"
          data-testid="github-button"
        >
          <GithubIcon />
        </StyledLinkButton>
      </Footer>
    </SidePanelContainer>
  );
};

export default SidePanel;
