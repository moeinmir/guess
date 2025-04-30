import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import connectors from "./connectors"
import { Web3ReactProvider } from "@web3-react/core";
import './index.css'
import App from 'App';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
        <Web3ReactProvider connectors={connectors} >
    <App/>
      </Web3ReactProvider>
  </React.StrictMode>
);





