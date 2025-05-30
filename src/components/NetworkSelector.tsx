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
}

interface NetworkSelectorProps {
  networks: Network[];
  selectedNetwork?: Network;
  onNetworkChange: (network: Network) => void;
  showFilters?: boolean; // Optional: to show/hide filter tabs
}

export function NetworkSelector({ 
  networks, 
  selectedNetwork, 
  onNetworkChange,
  showFilters = false // Default to false for better UX
}: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'testnet' | 'mainnet'>('all');
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
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const filteredNetworks = networks ? networks.filter(network => {
    if (filter === 'all') return true;
    if (filter === 'testnet') return network.isTestnet === true;
    if (filter === 'mainnet') return network.isTestnet === false;
    return true;
  }) : [];

  const renderNetworkItem = (network: Network) => {
    const isSelected = selected && network.id === selected.id;
    
    return (
      <li 
        key={network.id} 
        className={`${styles.networkItem} ${isSelected ? styles.selected : ''}`}
        onClick={() => handleNetworkSelect(network)}
        role="option"
        aria-selected={isSelected}
      >
        <div className={styles.networkContent}>
          {network.icon && (
            <img src={network.icon} alt={network.name} className={styles.networkIcon} />
          )}
          <div className={styles.networkInfo}>
            <div className={styles.networkNameRow}>
              <span className={styles.networkName}>{network.name}</span>
              {network.isTestnet && <span className={styles.testnetBadge}>Testnet</span>}
            </div>
            <span className={styles.networkDetails}>
              {network.type.charAt(0).toUpperCase() + network.type.slice(1)}
              {network.chainId && ` • Chain ID: ${network.chainId.toString()}`}
            </span>
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
            {selected.icon && (
              <img src={selected.icon} alt={selected.name} className={styles.networkIcon} />
            )}
            <div className={styles.selectedInfo}>
              <span className={styles.selectedName}>{selected.name}</span>
              <span className={styles.selectedType}>
                {selected.type.charAt(0).toUpperCase() + selected.type.slice(1)}
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
          {/* Optional filter tabs - only show if showFilters is true */}
          {showFilters && networks.some(n => n.isTestnet !== undefined) && (
            <div className={styles.filterTabs}>
              <button 
                className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({networks.length})
              </button>
              <button 
                className={`${styles.filterTab} ${filter === 'mainnet' ? styles.active : ''}`}
                onClick={() => setFilter('mainnet')}
              >
                Mainnet ({networks.filter(n => !n.isTestnet).length})
              </button>
              <button 
                className={`${styles.filterTab} ${filter === 'testnet' ? styles.active : ''}`}
                onClick={() => setFilter('testnet')}
              >
                Testnet ({networks.filter(n => n.isTestnet).length})
              </button>
            </div>
          )}
          
          {/* Network List */}
          <ul className={styles.networkList} role="listbox">
            {filteredNetworks.length > 0 ? (
              filteredNetworks.map(renderNetworkItem)
            ) : (
              <li className={styles.noNetworks}>
                <span>No networks match the current filter</span>
              </li>
            )}
          </ul>

          {/* Quick stats */}
          <div className={styles.dropdownFooter}>
            <span className={styles.networkCount}>
              {showFilters && filter !== 'all' 
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

// Example usage with actual networks
export const ExampleNetworkSelector = () => {
  const exampleNetworks: Network[] = [
    {
      id: 'polkadot',
      name: 'Polkadot',
      rpcUrl: 'wss://rpc.polkadot.io',
      type: 'substrate',
      chainId: '0',
      isTestnet: false,
      icon: '/icons/polkadot.svg'
    },
    {
      id: 'moonbeam',
      name: 'Moonbeam',
      rpcUrl: 'https://rpc.api.moonbeam.network',
      type: 'evm',
      chainId: 1284,
      isTestnet: false,
      icon: '/icons/moonbeam.svg'
    },
    {
      id: 'astar',
      name: 'Astar',
      rpcUrl: 'https://evm.astar.network',
      type: 'evm',
      chainId: 592,
      isTestnet: false,
      icon: '/icons/astar.svg'
    },
    {
      id: 'moonbase',
      name: 'Moonbase Alpha',
      rpcUrl: 'https://rpc.api.moonbase.moonbeam.network',
      type: 'evm',
      chainId: 1287,
      isTestnet: true,
      icon: '/icons/moonbeam.svg'
    },
    {
      id: 'westend',
      name: 'Westend',
      rpcUrl: 'wss://westend-rpc.polkadot.io',
      type: 'substrate',
      chainId: '42',
      isTestnet: true,
      icon: '/icons/polkadot.svg'
    }
  ];

  const handleNetworkChange = (network: Network) => {
    console.log('Selected network:', network);
  };

  return (
    <div>
      <h3>Network Selector (Default - No Filters)</h3>
      <NetworkSelector 
        networks={exampleNetworks}
        onNetworkChange={handleNetworkChange}
      />
      
      <h3>Network Selector (With Filters)</h3>
      <NetworkSelector 
        networks={exampleNetworks}
        onNetworkChange={handleNetworkChange}
        showFilters={true}
      />
    </div>
  );
};

// Add default export
export default NetworkSelector;