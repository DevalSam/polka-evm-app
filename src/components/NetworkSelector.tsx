import React from 'react';
import { useNetwork } from '../hooks/useNetwork';
import styles from './NetworkSelector.module.css';

export default function NetworkSelector() {
  const { networks, currentNetwork, switchNetwork } = useNetwork();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchNetwork(e.target.value);
  };

  return (
    <div className={styles.networkPanel}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>🌐</span>
        Network Connection
      </h3>

      <div className={styles.statusIndicator}>
        <span
          className={`${styles.statusDot} ${
            currentNetwork.isConnected ? styles.statusConnected : styles.statusDisconnected
          }`}
        ></span>
        <span>{currentNetwork.isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>

      {currentNetwork.name && (
        <div className={styles.networkBadge}>
          <span>{currentNetwork.name}</span>
        </div>
      )}

      <div className={styles.inputGroup}>
        <label htmlFor="network-select" className={styles.label}>
          Select Network:
        </label>
        <select
          id="network-select"
          className={styles.selectField}
          value={currentNetwork.name}
          onChange={handleChange}
        >
          {networks.map((network) => (
            <option key={network.name} value={network.name}>
              {network.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
