import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@rainbow-me/rainbowkit/styles.css';
import './main.css';
import {
  WagmiProvider,
  createConfig,
  http,
} from 'wagmi';

import {
  RainbowKitProvider,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';

import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { moonbeam } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet,
        rainbowWallet,
        walletConnectWallet,
        metaMaskWallet,
        coinbaseWallet,
      ],
    },
  ],
  {
    appName: 'PolkaEVM',
    projectId,
  }
);

const config = createConfig({
  chains: [moonbeam],
  connectors,
  transports: {
    [moonbeam.id]: http(),
  },
});
  
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}