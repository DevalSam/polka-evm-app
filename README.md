<div align="center">
  <h1>EVM Interface Framework for Polkadot</h1>
  
  <img src="./src/IMG/cam1.png" alt="EVM Interface Framework Logo" width="1000px" />
  
  <p>
    <strong>Bridging Substrate and Solidity Development in the Polkadot Ecosystem</strong>
  </p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![NPM Version](https://img.shields.io/npm/v/@polkadot/solidity-lib.svg)](https://www.npmjs.com/package/@polkadot/solidity-lib)
  [![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-18.0%2B-61DAFB.svg)](https://reactjs.org/)
</div>

## 🌉 Overview

The EVM Interface Framework is a specialized toolkit designed to eliminate barriers between Substrate-native and Solidity development within the Polkadot ecosystem. This library provides a unified, intuitive interface for interacting with EVM smart contracts deployed on Polkadot's EVM-compatible environments, while maintaining the familiar development experience Substrate developers expect.

### Key Features

- **Unified Contract Interface** - Interact with EVM contracts using consistent, type-safe patterns
- **Multi-Wallet Support** - Seamless integration with both Polkadot.js and MetaMask wallets
- **Cross-Environment Components** - Ready-to-use React components for common blockchain operations
- **Deployment Utilities** - Simplified contract deployment across Polkadot's EVM environments
- **Developer-Focused Design** - Built by developers, for developers, with DX as the priority

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install @polkadot/solidity-lib

# Using yarn
yarn add @polkadot/solidity-lib

# Using pnpm
pnpm add @polkadot/solidity-lib
```

### Basic Usage

```tsx
import { useEvmContract, useWallet } from '@polkadot/solidity-lib';
import { PolkadotProvider } from '@polkadot/solidity-lib/core';
import { ConnectButton } from '@polkadot/solidity-lib/components';

// Set up your application
function App() {
  return (
    <PolkadotProvider>
      <YourDApp />
    </PolkadotProvider>
  );
}

// Use in your components
function YourDApp() {
  // Connect to wallets easily
  const { address, isConnected } = useWallet();
  
  // Interact with contracts
  const { read, write } = useEvmContract({
    address: '0xYourContractAddress',
    abi: YourContractABI,
  });
  
  return (
    <div>
      <ConnectButton />
      
      {isConnected && (
        <div>
          <p>Connected: {address}</p>
          <button 
            onClick={() => write.yourContractMethod()}
          >
            Execute Contract Function
          </button>
        </div>
      )}
    </div>
  );
}
```

## 📚 Documentation

Visit our [documentation site](https://holistic-sing-29c.notion.site/All-You-Need-To-Know-1d81d2de9a9a80d291c4ca8824172ebb?pvs=4) for comprehensive guides, API references, and examples:

- [Getting Started](https://holistic-sing-29c.notion.site/Getting-Started-1d71d2de9a9a80b88324d8b39f7b3a88?pvs=4)
- [Contract Interactions](https://holistic-sing-29c.notion.site/Contract-Interactions-1dd1d2de9a9a80b0bb1bcf188af4c0af)
- [Wallet Integration](https://holistic-sing-29c.notion.site/Wallet-Integration-1dd1d2de9a9a800c986ff05ccd41d852?pvs=4)
- [UI Components](https://holistic-sing-29c.notion.site/UI-Components-1dd1d2de9a9a805f863bf3ba9eccff43?pvs=4)
- [Deployment Utilities](https://holistic-sing-29c.notion.site/Deployment-Utilities-1dd1d2de9a9a80adabc6e4bb41152d70?pvs=4)
- [Network Configuration](https://holistic-sing-29c.notion.site/Deployment-Utilities-1dd1d2de9a9a80adabc6e4bb41152d70?pvs=4)

## 🧩 Core Components

The framework consists of several key modules that work together to create a seamless development experience:

### Contract Interface

```tsx
// Read contract state
const balance = await read.balanceOf(address);

// Write to contract (returns transaction receipt)
const tx = await write.transfer(recipient, amount);
await tx.wait(); // Wait for confirmation

// Listen to events
useContractEvent({
  contract,
  eventName: 'Transfer',
  listener(from, to, amount) {
    console.log(`Transfer: ${from} → ${to}: ${amount}`);
  },
});
```

### Wallet Management

```tsx
const { 
  connect, 
  disconnect, 
  address,
  chainId,
  isConnected,
  switchNetwork
} = useWallet();
```

### UI Components

```tsx
// Easy wallet connection
<ConnectButton 
  supportedWallets={['polkadot-js', 'metamask']} 
/>

// Network selection
<NetworkSelector 
  networks={['moonbeam', 'astar']} 
/>

// Contract interaction forms
<ContractForm 
  contract={contract}
  method="transfer"
/>
```

## 🌐 Supported Networks

The framework supports all EVM-compatible environments in the Polkadot ecosystem:

- Moonbeam
- Moonriver
- Astar
- Shiden
- Acala EVM+
- Any other parachain supporting the Frontier EVM pallet

## 🛠️ Development

### Prerequisites

- Node.js 16+
- yarn or npm
- Basic knowledge of React and TypeScript
- Familiarity with Polkadot and EVM concepts

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/polkadot-js/solidity-lib.git
cd solidity-lib

# Install dependencies
yarn install

# Start development environment
yarn dev
```

### Testing

```bash
# Run unit tests
yarn test

# Run end-to-end tests
yarn test:e2e

# Check test coverage
yarn test:coverage
```

## 🤝 Contributing

We welcome contributions from the community! Please read our [contributing guidelines](https://holistic-sing-29c.notion.site/Contributing-Guidelines-1de1d2de9a9a80bebd96f9474557f145?pvs=4) before submitting pull requests.

### Development Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

This project was made possible through our shared passion for the Web3 space and huge support from the Polkadot ecosystem community.

Special thanks to:
- The Polkadot.js team for their excellent substrate libraries
- The Moonbeam and Astar teams for their EVM implementations
- All the developers who keep providing feedback and contributions

---

<div align="center">
  <p>Built with ❤️ for the Polkadot ecosystem</p>
</div