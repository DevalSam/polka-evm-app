import { useWallets } from '../hooks/useWallets';
import styles from './WalletConnector.module.css';

interface Wallet {
  id: string;
  name: string;
  type: string;
  address?: string;
}

export function WalletConnector() {
  const { wallets, connect, disconnect, currentWallet } = useWallets();

  return (
    <div className={styles.walletConnector}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>👛</span>
        Wallet Connection
      </h3>

      {currentWallet ? (
        <div className={styles.walletInfo}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Connected Wallet:</label>
            <div className={styles.walletType}>{currentWallet.name}</div>
          </div>

          <div className={styles.walletAddressContainer}>
            <div className={styles.walletLabel}>Address:</div>
            <div className={styles.walletAddress}>
              {currentWallet.address}
              <button
                className={styles.copyButton}
                onClick={() =>
                  navigator.clipboard.writeText(currentWallet.address || '')
                }
              >
                📋
              </button>
            </div>
          </div>

          <button className={styles.connectButton} onClick={disconnect}>
            Disconnect
          </button>
        </div>
      ) : (
        <div className={styles.walletSelector}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Select Wallet Provider:</label>
            <select
              className={styles.selectField}
              onChange={(e) => connect(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Choose wallet...
              </option>
              {wallets.map((wallet: Wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className={styles.connectButton}
            onClick={() => connect(wallets[0]?.id || '')}
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
