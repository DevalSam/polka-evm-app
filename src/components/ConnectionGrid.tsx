// import React from 'react'; ❌ unnecessary

import NetworkSelector from './NetworkSelector';
import { WalletConnector } from './WalletConnector';
import { ContractInteractor } from './ContractInteractor';
import styles from './ConnectionGrid.module.css';

export function ConnectionGrid() {
  return (
    <div className={styles.connectionGridContainer}>
      <div className={styles.gridLayout}>
        <div className={styles.leftColumn}>
          <NetworkSelector />
          <WalletConnector />
        </div>
        <div className={styles.rightColumn}>
          <ContractInteractor />
        </div>
      </div>
    </div>
  );
}
