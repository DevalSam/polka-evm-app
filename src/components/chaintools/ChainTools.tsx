import { SubstrateMetadataViewer } from './SubstrateMetadataViewer';
import styles from './ChainTools.module.css';

export function ChainTools() {
  return (
    <div className={styles.chainToolsContainer}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🔗</span>
        <h2 className={styles.sectionTitle}>Chain Tools</h2>
      </div>
      
      <div className={styles.toolCard}>
        <div className={styles.toolHeader}>
          <h3 className={styles.toolTitle}>Moonbeam Tools</h3>
          <span className={styles.toolTag}>EVM</span>
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Staking Account:</label>
          <input className={styles.inputField} placeholder="Enter account address" />
        </div>
        
        <div className={styles.resultBox}>
          No data available. Connect wallet and enter account to view staking info.
        </div>
        
        <button className={styles.actionButton}>
          <span className={styles.buttonIcon}>📊</span>
          View Staking Dashboard
        </button>
      </div>
      
      <div className={styles.toolCard}>
        <div className={styles.toolHeader}>
          <h3 className={styles.toolTitle}>Governance Tools</h3>
          <span className={styles.toolTag}>Voting</span>
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Proposal ID:</label>
          <input className={styles.inputField} placeholder="Enter proposal ID" />
        </div>
        
        <button className={styles.actionButton}>
          <span className={styles.buttonIcon}>🗳️</span>
          View Proposal Details
        </button>
      </div>
      
      {/* Substrate Metadata section with only one header */}
      <div className={styles.toolCard}>
        <div className={styles.toolHeader}>
          <h3 className={styles.toolTitle}>Substrate Metadata</h3>
          <span className={styles.toolTag}>Runtime</span>
        </div>
        
        <SubstrateMetadataViewer />
        
        <button className={styles.actionButton}>
          <span className={styles.buttonIcon}>🔍</span>
          Fetch Latest Metadata
        </button>
      </div>
    </div>
  );
}
