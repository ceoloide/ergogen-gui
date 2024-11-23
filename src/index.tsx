import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { createRoot } from 'react-dom/client';
import styled from "styled-components";
import './index.css';

import Ergogen from './Ergogen';
import Header from "./atoms/Header";
import Footer from "./atoms/Footer";
import ConfigContextProvider from "./context/ConfigContext";
import Absolem from "./examples/absolem";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #FFFFFF;
  height: 100%;
  width: 100%;
`;

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
      <>  
        <HelmetProvider>
          <AppContainer>
              <Helmet>
                <title>Ergogen</title>
                <link rel="canonical" href="https://ergogen.ceoloide.com/" />
              </Helmet>
              <Header />
              <ConfigContextProvider initialInput={Absolem.value}>
                <Ergogen />
              </ConfigContextProvider>
              <Footer/>
          </AppContainer>
        </HelmetProvider>
      </>
  </React.StrictMode>
);