import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useConfigContext } from '../context/ConfigContext';
import DiscordIcon from './DiscordIcon';
import GithubIcon from './GithubIcon';
import { AccentButton, OutlineButton } from './Buttons';

const HeaderContainer = styled.header`
  width: 100%;
  height: 3em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: #222222;
  flex-shrink: 0;

  @media (max-width: 639px) {
    padding: 0 0.5rem;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ErgogenLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const AppName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const VersionText = styled.a`
  font-size: 0.75rem;
  color: #28a745;
  text-decoration: none;
  align-items: center;
`;

const DocsButton = styled(OutlineButton)`
  @media (max-width: 639px) {
    .material-symbols-outlined {
      margin-right: 0;
    }
    span:not(.material-symbols-outlined) {
      display: none;
    }
  }
`;

const LogoButton = styled(Link)`
  display: block;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`;

const Header = (): JSX.Element => {
  const configContext = useConfigContext();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSettings = () => {
    configContext?.setShowSettings(!configContext?.showSettings);
  };

  const handleNewClick = () => {
    navigate('/new');
  };

  return (
    <HeaderContainer>
      <LeftContainer>
        <ErgogenLogo>
          <LogoButton to="/">
            <LogoImage src={'ergogen.png'} />
          </LogoButton>
          <AppName>Ergogen</AppName>
          <VersionText
            href="https://github.com/ergogen/ergogen"
            target="_blank"
            rel="noreferrer"
          >
            v4.1.0
          </VersionText>
        </ErgogenLogo>
      </LeftContainer>
      <RightContainer>
        {location.pathname === '/' && (
          <AccentButton onClick={handleNewClick}>
            <span className="material-symbols-outlined">add_2</span>
          </AccentButton>
        )}
        <DocsButton
          as="a"
          href="https://docs.ergogen.xyz/"
          target="_blank"
          rel="noreferrer"
        >
          <span className="material-symbols-outlined">description</span>
          <span>Docs</span>
        </DocsButton>
        <OutlineButton
          as="a"
          href="https://discord.gg/nbKcAZB"
          target="_blank"
          rel="noreferrer"
        >
          <DiscordIcon />
        </OutlineButton>
        <OutlineButton
          as="a"
          href="https://github.com/ceoloide/ergogen-gui"
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon />
        </OutlineButton>
        <OutlineButton onClick={toggleSettings}>
          <span className="material-symbols-outlined">
            {configContext?.showSettings ? 'keyboard_alt' : 'settings'}
          </span>
        </OutlineButton>
      </RightContainer>
    </HeaderContainer>
  );
};

export default Header;
