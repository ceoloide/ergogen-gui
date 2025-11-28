import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ResizablePanel from '../molecules/ResizablePanel';
import InteractiveCanvas from '../organisms/InteractiveCanvas';
import InteractiveTools from '../organisms/InteractiveTools';
import InteractiveProperties from '../organisms/InteractiveProperties';
import InteractiveStatusBar from '../organisms/InteractiveStatusBar';
import { InteractiveLayoutProvider } from '../context/InteractiveLayoutContext';
import { theme } from '../theme/theme';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  background-color: ${theme.colors.background};
`;

const CanvasContainer = styled.div`
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  background-color: #1e1e1e; /* Dark canvas background */
  cursor: crosshair;
`;

const PanelContent = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  color: ${theme.colors.text};
`;

const InnerLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 639);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleCursorMove = React.useCallback((x: number, y: number) => {
    setCursorPos({ x, y });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 639);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <PageWrapper>
      <ContentWrapper>
        {!isMobile && (
          <ResizablePanel
            initialWidth={60}
            minWidth={50}
            maxWidth="200px"
            side="left"
            resizable={false}
            data-testid="tools-panel"
          >
            <PanelContent style={{ padding: '0.5rem 0' }}>
              <InteractiveTools />
            </PanelContent>
          </ResizablePanel>
        )}

        <CanvasContainer>
          <InteractiveCanvas onCursorMove={handleCursorMove} />
        </CanvasContainer>

        {!isMobile && (
          <ResizablePanel
            initialWidth={300}
            minWidth={200}
            maxWidth="500px"
            side="right"
          >
            <PanelContent>
              <InteractiveProperties />
            </PanelContent>
          </ResizablePanel>
        )}
      </ContentWrapper>
      <InteractiveStatusBar mousePos={cursorPos} />
    </PageWrapper>
  );
};

const InteractiveLayout = () => {
  return (
    <InteractiveLayoutProvider>
      <InnerLayout />
    </InteractiveLayoutProvider>
  );
};

export default InteractiveLayout;
