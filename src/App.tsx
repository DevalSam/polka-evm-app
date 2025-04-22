'use client';

import { useEffect, useState } from 'react';
import { useEvmContract } from './hooks/useEvmContract';
import counterAbi from '../src/contract/Counter.json';
import type { Abi } from 'viem';
import './App.css';

// Import components
import ContractDeployer from './components/ContractDeployer';
import { ContractInteractor } from './components/ContractInteractor';
import InkContractDeployer from './components/InkContractDeployer';
import { ConnectionGrid } from './components/ConnectionGrid';
import { ChainTools } from './components/chaintools/ChainTools';
import { DeveloperTools } from './components/devtools/DeveloperTools';
// NetworkSelector and WalletConnector are likely used within ConnectionGrid, 
// so we don't need to import them directly

// Import hooks
import { useNetwork } from './hooks/useNetwork';
import { useWallets } from './hooks/useWallets';

// Contract address for Counter example
const CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138';

// Type definitions
type ContractType = 'solidity' | 'ink';
type ActionType = 'deploy' | 'interact';

// Define type for Network with necessary properties
interface Network {
  wsUrl?: string;
  isEvm?: boolean;
  isSubstrate?: boolean;
  // Add other properties as needed
}

export default function App() {
  const { currentNetwork } = useNetwork() as { currentNetwork: Network };
  const { currentWallet } = useWallets(); // Changed from connectedWallet to currentWallet
  const [contractType, setContractType] = useState<ContractType>('solidity');
  const [actionType, setActionType] = useState<ActionType>('deploy');
  
  // Counter example state
  const [count, setCount] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // Network compatibility checks
  const isEvm = currentNetwork?.isEvm;
  const isSubstrate = currentNetwork?.isSubstrate;

  // EVM Contract hooks
  const { read, write } = useEvmContract({
    address: CONTRACT_ADDRESS,
    abi: counterAbi as Abi,
  });

  const getCountRead = read('getCount');
  const incrementWrite = write('increment');

  // Update count when data changes
  useEffect(() => {
    if (getCountRead.data) {
      setCount(Number(getCountRead.data));
    }
  }, [getCountRead.data]);

  // Handle counter increment
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
    <div className="App">
      <header className="App-header">
        <h1>Polkadot Smart Contract Interface</h1>
        <div className="deployment-switcher">
          <button 
            className={`switcher-button ${contractType === 'solidity' ? 'active' : ''}`} 
            onClick={() => setContractType('solidity')}
          >
            Solidity (EVM)
          </button>
          <button 
            className={`switcher-button ${contractType === 'ink' ? 'active' : ''}`} 
            onClick={() => setContractType('ink')}
          >
            ink! (Substrate)
          </button>
        </div>
      </header>

      <main className="App-main">
        {/* Connection Info Section */}
        <ConnectionGrid />

        {/* Network Compatibility Warnings */}
        {contractType === 'solidity' && !isEvm && (
          <div className="warning-box">
            Warning: The currently selected network does not support EVM contracts. 
            Please switch to an EVM-compatible network.
          </div>
        )}
        {contractType === 'ink' && !isSubstrate && (
          <div className="warning-box">
            Warning: The currently selected network is not a Substrate chain. 
            Please switch to a Substrate network.
          </div>
        )}

        {/* Counter Example (for EVM contracts) */}
        {contractType === 'solidity' && isEvm && (
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
        )}

        {/* Action Type Switcher (for ink! contracts) */}
        {contractType === 'ink' && (
          <div className="action-switcher">
            <button 
              className={`action-button ${actionType === 'deploy' ? 'active' : ''}`} 
              onClick={() => setActionType('deploy')}
            >
              Deploy New Contract
            </button>
            <button 
              className={`action-button ${actionType === 'interact' ? 'active' : ''}`} 
              onClick={() => setActionType('interact')}
            >
              Interact with Contract
            </button>
          </div>
        )}

        {/* Contract Section */}
        <div className="contract-section">
          {contractType === 'solidity' && (
            <>
              <ContractDeployer />
              {currentWallet && <ContractInteractor />}
            </>
          )}
          
          {contractType === 'ink' && actionType === 'deploy' && (
            <InkContractDeployer />
          )}
          
          {contractType === 'ink' && actionType === 'interact' && (
            <div className="info-box">
              <h3>Coming Soon: ink! Contract Interaction</h3>
              <p>
                The ability to interact with deployed ink! contracts will be available soon. 
                For now, you can deploy new ink! contracts using the form above.
              </p>
            </div>
          )}
        </div>

        {/* Chain Tools (when EVM is selected) */}
        {contractType === 'solidity' && (
          <ChainTools />
        )}

        {/* Developer Tools */}
        <DeveloperTools />
      </main>
    </div>
  );
}