import { useState, useEffect } from 'react';
import styles from './NetworkSelector.module.css';
import { useNetwork } from '../hooks/useNetwork';

interface Network {
  id: string;
  name: string;
  rpcUrl: string;
  icon?: string;
  explorerUrl?: string;
  chainId?: number | string;
  isTestnet?: boolean;
  type: 'evm' | 'substrate';
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  description?: string;
}

interface NetworkSelectorProps {
  networks?: Network[];
  selectedNetwork?: Network;
  onNetworkChange: (network: Network) => void;
  showFilters?: boolean;
  showDescription?: boolean;
}

// Default Polkadot Networks
const DEFAULT_POLKADOT_NETWORKS: Network[] = [
  // === RELAY CHAINS ===
  {
    id: 'polkadot',
    name: 'Polkadot',
    rpcUrl: 'wss://rpc.polkadot.io',
    type: 'substrate',
    chainId: '0',
    isTestnet: false,
    icon: '/icons/polkadot.svg',
    explorerUrl: 'https://polkadot.subscan.io',
    nativeCurrency: {
      name: 'Polkadot',
      symbol: 'DOT',
      decimals: 10
    },
    description: 'Polkadot relay chain - the heart of the ecosystem'
  },
  {
    id: 'kusama',
    name: 'Kusama',
    rpcUrl: 'wss://kusama-rpc.polkadot.io',
    type: 'substrate',
    chainId: '2',
    isTestnet: false,
    icon: '/icons/kusama.svg',
    explorerUrl: 'https://kusama.subscan.io',
    nativeCurrency: {
      name: 'Kusama',
      symbol: 'KSM',
      decimals: 12
    },
    description: 'Kusama canary network - fast-moving innovation'
  },

  // === EVM PARACHAINS ===
  {
    id: 'moonbeam',
    name: 'Moonbeam',
    rpcUrl: 'https://rpc.api.moonbeam.network',
    type: 'evm',
    chainId: 1284,
    isTestnet: false,
    icon: '/icons/moonbeam.svg',
    explorerUrl: 'https://moonscan.io',
    nativeCurrency: {
      name: 'Glimmer',
      symbol: 'GLMR',
      decimals: 18
    },
    description: 'Ethereum-compatible smart contract platform on Polkadot'
  },
  {
    id: 'moonriver',
    name: 'Moonriver',
    rpcUrl: 'https://rpc.api.moonriver.moonbeam.network',
    type: 'evm',
    chainId: 1285,
    isTestnet: false,
    icon: '/icons/moonriver.svg',
    explorerUrl: 'https://moonriver.moonscan.io',
    nativeCurrency: {
      name: 'Moonriver',
      symbol: 'MOVR',
      decimals: 18
    },
    description: 'Ethereum-compatible parachain on Kusama'
  },
  {
    id: 'astar',
    name: 'Astar',
    rpcUrl: 'https://evm.astar.network',
    type: 'evm',
    chainId: 592,
    isTestnet: false,
    icon: '/icons/astar.svg',
    explorerUrl: 'https://blockscout.com/astar',
    nativeCurrency: {
      name: 'Astar',
      symbol: 'ASTR',
      decimals: 18
    },
    description: 'Multi-chain dApp hub supporting EVM and WASM'
  },

  // === DEFI PARACHAINS ===
  {
    id: 'acala',
    name: 'Acala',
    rpcUrl: 'wss://acala-rpc-0.aca-api.network',
    type: 'substrate',
    chainId: '787',
    isTestnet: false,
    icon: '/icons/acala.svg',
    explorerUrl: 'https://acala.subscan.io',
    nativeCurrency: {
      name: 'Acala',
      symbol: 'ACA',
      decimals: 12
    },
    description: 'DeFi hub and stablecoin platform'
  },
  {
    id: 'hydradx',
    name: 'HydraDX',
    rpcUrl: 'wss://rpc.hydradx.cloud',
    type: 'substrate',
    chainId: '222',
    isTestnet: false,
    icon: '/icons/hydradx.svg',
    explorerUrl: 'https://hydradx.subscan.io',
    nativeCurrency: {
      name: 'HydraDX',
      symbol: 'HDX',
      decimals: 12
    },
    description: 'Cross-chain liquidity protocol'
  },
  {
    id: 'parallel',
    name: 'Parallel',
    rpcUrl: 'wss://rpc.parallel.fi',
    type: 'substrate',
    chainId: '2012',
    isTestnet: false,
    icon: '/icons/parallel.svg',
    explorerUrl: 'https://parallel.subscan.io',
    nativeCurrency: {
      name: 'Parallel',
      symbol: 'PARA',
      decimals: 12
    },
    description: 'Decentralized lending and staking protocol'
  },

  // === TESTNETS ===
  {
    id: 'westend',
    name: 'Westend',
    rpcUrl: 'wss://westend-rpc.polkadot.io',
    type: 'substrate',
    chainId: '42',
    isTestnet: true,
    icon: '/icons/polkadot.svg',
    explorerUrl: 'https://westend.subscan.io',
    nativeCurrency: {
      name: 'Westend',
      symbol: 'WND',
      decimals: 12
    },
    description: 'Polkadot testnet for testing functionality'
  },
  {
    id: 'moonbase',
    name: 'Moonbase Alpha',
    rpcUrl: 'https://rpc.api.moonbase.moonbeam.network',
    type: 'evm',
    chainId: 1287,
    isTestnet: true,
    icon: '/icons/moonbeam.svg',
    explorerUrl: 'https://moonbase.moonscan.io',
    nativeCurrency: {
      name: 'Dev',
      symbol: 'DEV',
      decimals: 18
    },
    description: 'Moonbeam testnet for EVM development'
  },
  {
    id: 'shibuya',
    name: 'Shibuya',
    rpcUrl: 'https://evm.shibuya.astar.network',
    type: 'evm',
    chainId: 81,
    isTestnet: true,
    icon: '/icons/astar.svg',
    explorerUrl: 'https://blockscout.com/shibuya',
    nativeCurrency: {
      name: 'Shibuya',
      symbol: 'SBY',
      decimals: 18
    },
    description: 'Astar testnet for dApp development'
  },
  {
    id: 'rococo',
    name: 'Rococo',
    rpcUrl: 'wss://rococo-rpc.polkadot.io',
    type: 'substrate',
    chainId: '42',
    isTestnet: true,
    icon: '/icons/rococo.svg',
    explorerUrl: 'https://rococo.subscan.io',
    nativeCurrency: {
      name: 'Rococo',
      symbol: 'ROC',
      decimals: 12
    },
    description: 'Parachain testnet environment'
  }
];

export function NetworkSelector({ 
  networks = DEFAULT_POLKADOT_NETWORKS,
  selectedNetwork, 
  onNetworkChange,
  showFilters = true,
  showDescription = false
}: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'testnet' | 'mainnet' | 'evm' | 'substrate'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentNetwork } = useNetwork();
  
  const [selected, setSelected] = useState<Network | undefined>(
    selectedNetwork || (currentNetwork as Network | undefined)
  );

  useEffect(() => {
    // Update selected network when prop changes
    if (selectedNetwork && (!selected || selectedNetwork.id !== selected.id)) {
      setSelected(selectedNetwork);
    }
  }, [selectedNetwork, selected]);

  const handleNetworkSelect = (network: Network) => {
    setSelected(network);
    onNetworkChange(network);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const filteredNetworks = networks.filter(network => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = network.name.toLowerCase().includes(searchLower);
      const matchesSymbol = network.nativeCurrency?.symbol.toLowerCase().includes(searchLower);
      const matchesType = network.type.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesSymbol && !matchesType) return false;
    }

    // Type filter
    if (filter === 'all') return true;
    if (filter === 'testnet') return network.isTestnet === true;
    if (filter === 'mainnet') return network.isTestnet === false;
    if (filter === 'evm') return network.type === 'evm';
    if (filter === 'substrate') return network.type === 'substrate';
    return true;
  });

  const getNetworkTypeIcon = (type: 'evm' | 'substrate') => {
    return type === 'evm' ? '⟠' : '●';
  };

  const renderNetworkItem = (network: Network) => {
    const isSelected = selected && network.id === selected.id;
    
    return (
      <li 
        key={network.id} 
        className={`${styles.networkItem} ${isSelected ? styles.selected : ''}`}
        onClick={() => handleNetworkSelect(network)}
        role="option"
        aria-selected={isSelected}
        title={network.description}
      >
        <div className={styles.networkContent}>
          <div className={styles.networkIconContainer}>
            {network.icon ? (
              <img 
                src={network.icon} 
                alt={network.name} 
                className={styles.networkIcon}
                onError={(e) => {
                  // Fallback to type icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLSpanElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <span 
              className={styles.networkIconFallback}
              style={{ display: network.icon ? 'none' : 'flex' }}
            >
              {getNetworkTypeIcon(network.type)}
            </span>
          </div>
          
          <div className={styles.networkInfo}>
            <div className={styles.networkNameRow}>
              <span className={styles.networkName}>{network.name}</span>
              {network.isTestnet && <span className={styles.testnetBadge}>Testnet</span>}
              <span className={styles.networkTypeBadge} data-type={network.type}>
                {network.type.toUpperCase()}
              </span>
            </div>
            <div className={styles.networkDetails}>
              <span className={styles.networkSymbol}>
                {network.nativeCurrency?.symbol || 'N/A'}
              </span>
              {network.chainId && (
                <span className={styles.chainId}>
                  Chain ID: {network.chainId.toString()}
                </span>
              )}
            </div>
            {showDescription && network.description && (
              <div className={styles.networkDescription}>
                {network.description}
              </div>
            )}
          </div>
        </div>
        
        {isSelected && (
          <svg 
            className={styles.checkIcon} 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
          >
            <path 
              d="M13.5 4.5L6 12L2.5 8.5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </li>
    );
  };

  // Get filter counts
  const allCount = networks.length;
  const mainnetCount = networks.filter(n => !n.isTestnet).length;
  const testnetCount = networks.filter(n => n.isTestnet).length;
  const evmCount = networks.filter(n => n.type === 'evm').length;
  const substrateCount = networks.filter(n => n.type === 'substrate').length;

  // If no networks provided, show a message
  if (!networks || networks.length === 0) {
    return (
      <div className={styles.networkSelector}>
        <button className={styles.selectorButton} disabled>
          <span>No networks available</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.networkSelector}>
      <button 
        className={styles.selectorButton} 
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selected ? (
          <div className={styles.selectedNetwork}>
            <div className={styles.networkIconContainer}>
              {selected.icon ? (
                <img 
                  src={selected.icon} 
                  alt={selected.name} 
                  className={styles.networkIcon}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLSpanElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <span 
                className={styles.networkIconFallback}
                style={{ display: selected.icon ? 'none' : 'flex' }}
              >
                {getNetworkTypeIcon(selected.type)}
              </span>
            </div>
            <div className={styles.selectedInfo}>
              <span className={styles.selectedName}>{selected.name}</span>
              <span className={styles.selectedType}>
                {selected.nativeCurrency?.symbol || selected.type.toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          <span>Select Network</span>
        )}
        <svg 
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`} 
          width="12" 
          height="7" 
          viewBox="0 0 12 7" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search networks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Filter tabs - show if enabled and there are networks to filter */}
          {showFilters && (
            <div className={styles.filterTabs}>
              <button 
                className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({allCount})
              </button>
              <button 
                className={`${styles.filterTab} ${filter === 'mainnet' ? styles.active : ''}`}
                onClick={() => setFilter('mainnet')}
              >
                Mainnet ({mainnetCount})
              </button>
              <button 
                className={`${styles.filterTab} ${filter === 'testnet' ? styles.active : ''}`}
                onClick={() => setFilter('testnet')}
              >
                Testnet ({testnetCount})
              </button>
              <button 
                className={`${styles.filterTab} ${filter === 'evm' ? styles.active : ''}`}
                onClick={() => setFilter('evm')}
              >
                EVM ({evmCount})
              </button>
              <button 
                className={`${styles.filterTab} ${filter === 'substrate' ? styles.active : ''}`}
                onClick={() => setFilter('substrate')}
              >
                Substrate ({substrateCount})
              </button>
            </div>
          )}
          
          {/* Network List */}
          <ul className={styles.networkList} role="listbox">
            {filteredNetworks.length > 0 ? (
              filteredNetworks.map(renderNetworkItem)
            ) : (
              <li className={styles.noNetworks}>
                <span>
                  {searchTerm 
                    ? `No networks match "${searchTerm}"` 
                    : 'No networks match the current filter'
                  }
                </span>
              </li>
            )}
          </ul>

          {/* Quick stats footer */}
          <div className={styles.dropdownFooter}>
            <span className={styles.networkCount}>
              {filteredNetworks.length !== networks.length 
                ? `${filteredNetworks.length} of ${networks.length} networks`
                : `${networks.length} network${networks.length !== 1 ? 's' : ''} available`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Example usage component
export const PolkadotNetworkDemo = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<Network | undefined>();

  const handleNetworkChange = (network: Network) => {
    setSelectedNetwork(network);
    console.log('Selected network:', network);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h3>Polkadot Networks Demo</h3>
      <NetworkSelector 
        onNetworkChange={handleNetworkChange}
        showFilters={true}
        showDescription={false}
      />
      
      {selectedNetwork && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
          <h4>Selected Network:</h4>
          <p><strong>Name:</strong> {selectedNetwork.name}</p>
          <p><strong>Type:</strong> {selectedNetwork.type}</p>
          <p><strong>Symbol:</strong> {selectedNetwork.nativeCurrency?.symbol}</p>
          <p><strong>Chain ID:</strong> {selectedNetwork.chainId}</p>
          <p><strong>Testnet:</strong> {selectedNetwork.isTestnet ? 'Yes' : 'No'}</p>
          {selectedNetwork.description && (
            <p><strong>Description:</strong> {selectedNetwork.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Add default export
export default NetworkSelector;