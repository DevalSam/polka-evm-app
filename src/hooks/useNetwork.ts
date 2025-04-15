import { useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

export type Network = {
  name: string;
  rpc: string;
  isConnected: boolean;
  type: 'substrate' | 'evm';
  chainId?: number;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  icon?: string;
};

export function useNetwork() {
  const [networks, setNetworks] = useState<Network[]>([
    {
      name: 'Moonbeam',
      rpc: 'wss://moonbeam.api.onfinality.io/public-ws',
      isConnected: false,
      type: 'substrate',
      icon: 'moonbeam.png',
    },
    {
      name: 'Astar',
      rpc: 'wss://astar.api.onfinality.io/public-ws',
      isConnected: false,
      type: 'substrate',
      icon: 'astar.png',
    },
    {
      name: 'Ethereum',
      rpc: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
      isConnected: false,
      type: 'evm',
      chainId: 1,
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      icon: 'eth.png',
    },
    {
      name: 'Polygon',
      rpc: 'https://polygon-rpc.com',
      isConnected: false,
      type: 'evm',
      chainId: 137,
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      icon: 'polygon.png',
    },
    {
      name: 'BSC',
      rpc: 'https://bsc-dataseed.binance.org/',
      isConnected: false,
      type: 'evm',
      chainId: 56,
      nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      icon: 'bsc.png',
    },
  ]);

  const [currentNetwork, setCurrentNetwork] = useState<Network>(networks[0]);
  const [api, setApi] = useState<ApiPromise | null>(null);

  const switchNetwork = async (networkName: string) => {
    const selected = networks.find(n => n.name === networkName);
    if (!selected) return;

    if (selected.type === 'substrate') {
      try {
        const provider = new WsProvider(selected.rpc);
        const apiInstance = await ApiPromise.create({ provider });
        await apiInstance.isReady;

        const header = await apiInstance.rpc.chain.getHeader();
        console.log(`${selected.name} block height:`, header.number.toNumber());

        const updatedNetworks = networks.map(n =>
          n.name === selected.name
            ? { ...n, isConnected: true }
            : { ...n, isConnected: false }
        );

        setNetworks(updatedNetworks);
        setCurrentNetwork({ ...selected, isConnected: true });
        setApi(apiInstance);
      } catch (err) {
        console.error(`Error connecting to ${selected.name}:`, err);
        setCurrentNetwork({ ...selected, isConnected: false });
      }
    } else {
      // EVM network logic — just set as current (you can integrate with web3/react later)
      const updatedNetworks = networks.map(n =>
        n.name === selected.name
          ? { ...n, isConnected: true }
          : { ...n, isConnected: false }
      );

      setNetworks(updatedNetworks);
      setCurrentNetwork({ ...selected, isConnected: true });
      setApi(null); // no polkadot-js API
    }
  };

  return {
    networks,
    currentNetwork,
    switchNetwork,
    api, // Polkadot API (null for EVM chains)
  };
}
