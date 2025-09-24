import Button from "./Button";
import styled from "styled-components";
import {useConfigContext} from "../context/ConfigContext";
import DiscordIcon from "./DiscordIcon";

const HeaderContainer = styled.div`
      width: 100%;
      height: 3em;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      background-color: #222222;
`;

const LeftContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
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
    height: 18px;
`;

const AppName = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: white;
    margin-right: 0.5rem;
`;

const VersionText = styled.a`
    font-size: 0.75rem;
    color: #28a745;
    text-decoration: none;
    align-items: center;
`;

const StyledLinkButton = styled.a`
    background-color: transparent;
    border: 1px solid #3f3f3f;
    border-radius: 6px;
    color: white;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    text-decoration: none;
    cursor: pointer;
    font-size: 13px;
    line-height: 16px;
    gap: 6px
    height: 34px;

    .material-symbols-outlined {
        margin-right: 6px;
        font-size: 16px !important;
    }

    &:hover {
        background-color: #3f3f3f;
    }
`;

const OutlineIconButton = styled.button`
    background-color: transparent;
    transition: color .15s ease-in-out,
    background-color .15s ease-in-out,
    border-color .15s ease-in-out,
    box-shadow .15s ease-in-out;
    border: 1px solid #3f3f3f;
    border-radius: 6px;
    color: white;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    text-decoration: none;
    cursor: pointer;
    font-size: 13px;
    line-height: 16px;
    gap: 6px
    height: 34px;

    .material-symbols-outlined {
        font-size: 16px !important;
    }

    &:hover {
        background-color: #3f3f3f;
    }
`;

const LeftPanelButton = styled(OutlineIconButton)`
@media (min-width: 640px) {
    display: none;
}
`;

const AccentIconButton = styled(Button)`
    height: 34px;
    padding: 8px 12px;
    border-radius: 6px;
    .material-symbols-outlined {
        font-size: 16px !important;
    }
`;

const Header = (): JSX.Element => {
    const configContext = useConfigContext();
    const toggleSettings = () => {
      configContext?.setShowSettings(!configContext?.showSettings);
    };
    return (
        <HeaderContainer>
            <LeftContainer>
                {/* <LeftPanelButton onClick={() => window.location.reload()}><span className="material-symbols-outlined">left_panel_open</span></LeftPanelButton> */}
                <ErgogenLogo><AppName>Ergogen</AppName><VersionText href="https://github.com/ergogen/ergogen" target="_blank" rel="noreferrer">v4.1.0</VersionText></ErgogenLogo>
            </LeftContainer>
            <RightContainer>
                <StyledLinkButton href="https://docs.ergogen.xyz/" target="_blank" rel="noreferrer">
                    <span className="material-symbols-outlined">description</span>
                    <span>Docs</span>
                </StyledLinkButton>
                <StyledLinkButton href="https://discord.gg/nbKcAZB" target="_blank" rel="noreferrer" aria-label="discord">
                    <DiscordIcon />
                </StyledLinkButton>
                <AccentIconButton size="small" onClick={toggleSettings}><span className="material-symbols-outlined">
                {configContext?.showSettings ? "keyboard_alt" : "settings"}</span></AccentIconButton>
            </RightContainer>
        </HeaderContainer>
    );
}

export default Header;