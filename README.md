# EVM Interface Framework for Polkadot (Template)

<div align="center">
  <img src="./src/IMG/cam1.png" alt="EVM Interface Framework Logo" width="800px" />
  
  <p><strong>Seamlessly Connect Polkadot and EVM Applications</strong></p>
  
  <p><em>⚠️ IMPORTANT: This is a template/starter project and not a production-ready library. ⚠️</em></p>
</div>

## What is this template?

This project demonstrates how developers can build interfaces to interact with both Ethereum-style (EVM) smart contracts and Substrate contracts on Polkadot networks. The template includes React components and hooks that showcase blockchain operations like:

- Connecting to multiple wallet types (MetaMask, Polkadot.js)
- Interacting with deployed smart contracts
- Deploying new contracts
- Switching between different Polkadot networks

## How to Use It

### Installation

```bash
# Clone this template
git clone https://github.com/your-username/polka-evm-app.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage Examples

The following examples demonstrate how you could use the components in this template:

#### 1. Connect a Wallet

```tsx
import { WalletConnector } from 'polka-evm-lib';

function App() {
  return (
    <div>
      <h1>My DApp</h1>
      <WalletConnector />
    </div>
  );
}
```

#### 2. Interact with an EVM Contract

```tsx
import { useEvmContract } from 'polka-evm-lib';

function Counter() {
  const { read, write, isLoading } = useEvmContract({
    address: '0xYourContractAddress',
    abi: YourContractABI,
  });

  const [count, setCount] = useState(0);

  // Read from the contract
  useEffect(() => {
    const getCount = async () => {
      const value = await read.getValue();
      setCount(value);
    };
    getCount();
  }, [read]);

  // Write to the contract
  const increment = async () => {
    const tx = await write.increment();
    await tx.wait();
    // Refresh the count
    setCount(await read.getValue());
  };

  return (
    <div>
      <p>Counter Value: {count.toString()}</p>
      <button onClick={increment} disabled={isLoading}>
        Increment
      </button>
    </div>
  );
}
```

#### 3. Deploy an EVM Contract

```tsx
import { ContractDeployer } from 'polka-evm-lib';
import counterABI from './counterABI.json';
import counterBytecode from './counterBytecode.json';

function DeployCounter() {
  const handleSuccess = (contractAddress) => {
    console.log(`Contract deployed at: ${contractAddress}`);
  };

  return (
    <ContractDeployer
      abi={counterABI}
      bytecode={counterBytecode}
      constructorArgs={[]}
      onSuccess={handleSuccess}
    />
  );
}
```

#### 4. Switch Networks

```tsx
import { NetworkSelector } from 'polka-evm-lib';

const networks = [
  {
    id: 'moonbeam',
    name: 'Moonbeam',
    rpcUrl: 'https://rpc.api.moonbeam.network',
    type: 'evm',
    chainId: 1284
  },
  {
    id: 'astar',
    name: 'Astar',
    rpcUrl: 'https://astar.api.onfinality.io/public',
    type: 'evm',
    chainId: 592
  }
];

function NetworkSwitcher() {
  const handleNetworkChange = (network) => {
    console.log(`Switched to ${network.name}`);
  };

  return (
    <NetworkSelector 
      networks={networks}
      onNetworkChange={handleNetworkChange}
    />
  );
}
```

## Potential Use Cases

If fully developed, this template could serve as the foundation for applications such as:

### 1. Cross-Chain DeFi Application

Build a DeFi application that can interact with both EVM-based DEXes on Moonbeam and Substrate-based protocols on other parachains.

### 2. NFT Marketplace

Create an NFT marketplace that supports NFTs minted on both EVM and Substrate chains, providing a unified interface for users.

### 3. DAOs with Cross-Chain Governance

Develop DAO tools that can execute governance decisions across multiple Polkadot ecosystem chains.

### 4. Cross-Chain Game Assets

Build games where assets can move between different Polkadot parachains regardless of whether they use EVM or Substrate.

## Technical Implementation Overview

This template demonstrates approaches for bridging the gap between Polkadot's Substrate ecosystem and EVM compatibility by:

- Using Polkadot.js for Substrate interactions
- Leveraging ethers.js for EVM compatibility
- Providing a unified wallet connection interface
- Supporting contract deployments on both environments
- Handling network switching and chain detection automatically

### Template Components

The template includes these sample components:

- **WalletConnector**: Manages wallet connections for both EVM and Substrate
- **useNetwork**: Hook for managing network state
- **useEvmContract**: Hook for interacting with EVM smart contracts
- **useContract**: Hook for interacting with Substrate contracts
- **ContractDeployer**: Component for deploying EVM contracts
- **InkContractDeployer**: Component for deploying Substrate ink! contracts

## Getting Started with This Template

```bash
# Clone the repository
git clone https://github.com/your-username/polka-evm-app.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Status

⚠️ **Important Note:** This is a development template intended for educational and demonstration purposes. It is not a production-ready library and may contain bugs or incomplete features. Use it as a starting point for your own implementation rather than in production applications.

## Next Steps for Development

If you wish to build this into a full library:

- Complete the implementation of all hooks and components
- Add comprehensive test coverage
- Implement proper error handling
- Create detailed documentation
- Add TypeScript type definitions
- Publish to npm with appropriate versioning

## License

MIT License

---

<div align="center">
  <p>A template project for the Polkadot ecosystem</p>
</div>