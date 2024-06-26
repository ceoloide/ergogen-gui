import React, {createContext, Dispatch, SetStateAction, useState} from "react";
import TabPane from "../molecules/TabPane";
import styled from "styled-components";

type TabPaneProps = {
    label: string,
    content: React.ReactComponentElement<any>,
};

type TabsProps = {
    tabs: Array<TabPaneProps>
}

const TabContainer = styled.div`
    display: flex;
    align-content: space-between;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
    overflow: hidden;
`;

const Tab = styled.div`
    display: flex;
    background: #595959;
    padding: 0.5rem 1rem;
    flex-grow: 1;
    justify-content: center;
    align-content: center;
    cursor: pointer;
    transition: background-color 150ms ease-in-out;

    &:hover {
        background: #525252;
    }

    &:active {
        background: #595959;
    }
`;

type ContextProps = {
    tabIndex: number | undefined,
    setTabIndex: Dispatch<SetStateAction<number>>,
};

export const TabContext = createContext<ContextProps | null>(null);

const Tabs = ({tabs}: TabsProps) => {
    const [tabIndex, setTabIndex] = useState(0);
    const activeTab = tabs[tabIndex];

    return (
        <TabContext.Provider value={{
            tabIndex,
            setTabIndex
        }}>
            <TabContainer>
                {tabs?.map((tab, i) =>
                    <Tab key={i} onClick={() => setTabIndex(i)} >{tab.label}</Tab>
                )}
            </TabContainer>
            <TabPane content={activeTab.content}/>
        </TabContext.Provider>
    );
}

export default Tabs;