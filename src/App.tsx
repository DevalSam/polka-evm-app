// App.tsx
'use client';

import { useEffect, useState } from 'react';
import { useEvmContract } from './hooks/useEvmContract';
import counterAbi from '../src/contract/Counter.json';
import type { Abi } from 'viem';
import './App.css';

// Import components
import NetworkSelector from './components/NetworkSelector';
import { WalletConnector } from './components/WalletConnector';
import { ContractInteractor } from './components/ContractInteractor';
import { ChainTools } from './components/chaintools/ChainTools';
import { DevTools } from './components/DevTools';

const CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138';

export default function App() {
  const { read, write } = useEvmContract({
    address: CONTRACT_ADDRESS,
    abi: counterAbi as Abi,
  });

  const getCountRead = read('getCount');
  const incrementWrite = write('increment');

  const [count, setCount] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (getCountRead.data) {
      setCount(Number(getCountRead.data));
    }
  }, [getCountRead.data]);

  const handleIncrement = async () => {
    try {
      setIsPending(true);
      setIsSuccess(false);
      setIsError(false);

      await incrementWrite();
      setIsSuccess(true);
      await getCountRead.refetch();
    } catch (error) {
      console.error('Transaction failed:', error);
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="app-container">
      {/* Counter Display Section */}
      <div className="counter-section">
        <div className="counter-display">
          <h1 className="counter-value">{count}</h1>
          <p className="counter-label">Current Count</p>
        </div>
        
        {isPending && <div className="loading-spinner"></div>}
        
        <div className="counter-actions">
          <button 
            className="increment-button" 
            onClick={handleIncrement} 
            disabled={isPending}
          >
            {isPending ? 'Processing...' : 'Increment'}
          </button>
        </div>

        {isSuccess && <div className="success-message">Transaction confirmed!</div>}
        {isError && <div className="error-message">Transaction failed!</div>}
      </div>

      {/* Connection Panel Section */}
      <div className="connection-panel">
        <div className="network-section">
          <NetworkSelector />
          <WalletConnector />
        </div>

        <div className="contract-section">
          <ContractInteractor />
        </div>
      </div>

      {/* Chain Tools Section */}
      <ChainTools />

      {/* Developer Tools Section */}
      <DevTools />
    </div>
  );
}