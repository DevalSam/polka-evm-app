// hooks/useWallets.ts
import { useState } from 'react';

interface Wallet {
  id: string;
  name: string;
  type: string;
  address?: string; // Make address optional for now
}

export function useWallets() {
  const [wallets] = useState<Wallet[]>([
    { id: 'metamask', name: 'MetaMask (EVM)', type: 'evm' },
    { id: 'polkadot-js', name: 'Polkadot.js (Substrate)', type: 'substrate' },
  ]);

  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);

  const connect = async (walletId: string) => {
    if (walletId === 'metamask') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentWallet({
        id: walletId,
        name: 'MetaMask (EVM)',
        type: 'evm',
        address: accounts[0],
      });
    } else if (walletId === 'polkadot-js') {
      const { web3Enable } = await import('@polkadot/extension-dapp');
      await web3Enable('My DApp');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentWallet({
        id: walletId,
        name: 'Polkadot.js (Substrate)',
        type: 'substrate',
        address: accounts[0], // or handle Polkadot address fetching here
      });
    }
  };

  const disconnect = () => {
    setCurrentWallet(null); // Reset wallet connection state
  };

  return { wallets, connect, disconnect, currentWallet };
}
