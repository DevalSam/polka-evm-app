// src/hooks/useNetwork.ts
import { useState, useEffect, useCallback } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ethers } from 'ethers';

export interface Network {
  id: string | number;
  name: string;
  rpcUrl: string;
  wsUrl?: string;
  explorerUrl: string;
  chainId?: string | number;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
  icon: string;
  type: 'evm' | 'substrate';
  isPolkadotEcosystem: boolean;
}

export const networks: Network[] = [
  // EVM Networks
  {
    id: 1,
    name: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    explorerUrl: 'https://etherscan.io',
    chainId: '0x1',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    icon: '/eth.png',
    type: 'evm',
    isPolkadotEcosystem: false
  },
  {
    id: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    chainId: '0x89',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    isTestnet: false,
    icon: '/polygon.png',
    type: 'evm',
    isPolkadotEcosystem: false
  },
  {
    id: 56,
    name: 'BSC',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    explorerUrl: 'https://bscscan.com',
    chainId: '0x38',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    isTestnet: false,
    icon: '/bsc.png',
    type: 'evm',
    isPolkadotEcosystem: false
  },

  // Polkadot Ecosystem Networks
  {
    id: 1287,
    name: 'Moonbase Alpha',
    rpcUrl: 'https://rpc.api.moonbase.moonbeam.network',
    wsUrl: 'wss://wss.api.moonbase.moonbeam.network',
    explorerUrl: 'https://moonbase.moonscan.io',
    chainId: '0x507',
    nativeCurrency: { name: 'DEV', symbol: 'DEV', decimals: 18 },
    isTestnet: true,
    icon: '/moonbeam-logo.svg',
    type: 'evm',
    isPolkadotEcosystem: true
  },
  {
    id: 'westend',
    name: 'Westend Testnet',
    rpcUrl: 'https://westend-rpc.polkadot.io',
    wsUrl: 'wss://westend-rpc.polkadot.io',
    explorerUrl: 'https://westend.subscan.io',
    nativeCurrency: { name: 'WND', symbol: 'WND', decimals: 12 },
    isTestnet: true,
    icon: '/polkadot.png',
    type: 'substrate',
    isPolkadotEcosystem: true
  },
  {
    id: 'rococo',
    name: 'Rococo Testnet',
    rpcUrl: 'https://rococo-rpc.polkadot.io',
    wsUrl: 'wss://rococo-rpc.polkadot.io',
    explorerUrl: 'https://rococo.subscan.io',
    nativeCurrency: { name: 'ROC', symbol: 'ROC', decimals: 12 },
    isTestnet: true,
    icon: '/polkadot.png',
    type: 'substrate',
    isPolkadotEcosystem: true
  },
  {
    id: 81,
    name: 'Shibuya Testnet',
    rpcUrl: 'https://evm.shibuya.astar.network',
    wsUrl: 'wss://rpc.shibuya.astar.network',
    explorerUrl: 'https://shibuya.subscan.io',
    chainId: '0x51',
    nativeCurrency: { name: 'SBY', symbol: 'SBY', decimals: 18 },
    isTestnet: true,
    icon: '/astar.png',
    type: 'evm',
    isPolkadotEcosystem: true
  }
];

export function useNetwork() {
  const [currentNetwork, setCurrentNetwork] = useState<Network | null>(null);
  const [evmProvider, setEvmProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
  const [substrateApi, setSubstrateApi] = useState<ApiPromise | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize network from localStorage or default
  useEffect(() => {
    const savedNetworkId = localStorage.getItem('selectedNetwork');
    const network = savedNetworkId 
      ? networks.find(n => n.id.toString() === savedNetworkId)
      : networks[0];
    
    if (network) {
      setCurrentNetwork(network);
    }
  }, []);

  // Handle network connection when currentNetwork changes
  useEffect(() => {
    if (!currentNetwork) return;

    const connectToNetwork = async () => {
      setIsConnecting(true);
      
      try {
        if (currentNetwork.type === 'evm') {
          const provider = new ethers.providers.JsonRpcProvider(currentNetwork.rpcUrl);
          setEvmProvider(provider);
          setSubstrateApi(null);
        } else {
          const provider = new WsProvider(currentNetwork.wsUrl);
          const api = await ApiPromise.create({ provider });
          await api.isReady;
          setSubstrateApi(api);
          setEvmProvider(null);
        }
      } catch (error) {
        console.error(`Error connecting to ${currentNetwork.name}:`, error);
      } finally {
        setIsConnecting(false);
      }
    };

    connectToNetwork();
  }, [currentNetwork]);

  const switchNetwork = useCallback(async (networkId: string | number) => {
    const network = networks.find(n => n.id.toString() === networkId.toString());
    if (!network) return;

    setCurrentNetwork(network);
    localStorage.setItem('selectedNetwork', networkId.toString());

    // For EVM networks, try to add to wallet
    if (network.type === 'evm' && window.ethereum && network.chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: network.chainId,
            chainName: network.name,
            nativeCurrency: network.nativeCurrency,
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.explorerUrl]
          }]
        });
      } catch (error) {
        console.error('Error adding chain to wallet:', error);
      }
    }
  }, []);

  // Network filtering helpers
  const getEvmNetworks = useCallback(() => {
    return networks.filter(n => n.type === 'evm');
  }, []);

  const getSubstrateNetworks = useCallback(() => {
    return networks.filter(n => n.type === 'substrate');
  }, []);

  const getPolkadotNetworks = useCallback(() => {
    return networks.filter(n => n.isPolkadotEcosystem);
  }, []);

  return {
    networks,
    currentNetwork,
    evmProvider,
    substrateApi,
    isConnecting,
    switchNetwork,
    getEvmNetworks,
    getSubstrateNetworks,
    getPolkadotNetworks
  };
}