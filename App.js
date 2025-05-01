import React from 'react';
import WalletConnect from './components/WalletConnect';
import DatasetUpload from './components/DatasetUpload';
import DatasetCreator from './components/DatasetCreator';

function App() {
  const handleDatasetReady = ({ title, description, hash }) => {
    console.log('Dataset Ready:', title, description, hash);
    // Later: send this to the backend for smart contract interaction
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>IndiForge.AI MVP</h1>
      <WalletConnect />
      <DatasetCreator onDatasetReady={handleDatasetReady} />
      <DatasetUpload />
    </div>
  );
}

export default App;
