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
}

export function NetworkSelector({ 
  networks, 
  selectedNetwork, 
  onNetworkChange 
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
      >
        {network.icon && (
          <img src={network.icon} alt={network.name} className={styles.networkIcon} />
        )}
        <div className={styles.networkInfo}>
          <span className={styles.networkName}>{network.name}</span>
          <span className={styles.networkType}>
            {network.type.charAt(0).toUpperCase() + network.type.slice(1)}
            {network.chainId && ` • Chain ID: ${network.chainId.toString()}`}
          </span>
        </div>
        {network.isTestnet && <span className={styles.testnetBadge}>Testnet</span>}
      </li>
    );
  };

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
            <span>{selected.name}</span>
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
          <div className={styles.filterTabs}>
            <button 
              className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`${styles.filterTab} ${filter === 'mainnet' ? styles.active : ''}`}
              onClick={() => setFilter('mainnet')}
            >
              Mainnet
            </button>
            <button 
              className={`${styles.filterTab} ${filter === 'testnet' ? styles.active : ''}`}
              onClick={() => setFilter('testnet')}
            >
              Testnet
            </button>
          </div>
          
          <ul className={styles.networkList} role="listbox">
            {filteredNetworks.map(renderNetworkItem)}
          </ul>
        </div>
      )}
    </div>
  );
}

// Add default export
export default NetworkSelector;