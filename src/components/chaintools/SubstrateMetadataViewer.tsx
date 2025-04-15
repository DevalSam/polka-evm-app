import styles from './ChainTools.module.css';

export function SubstrateMetadataViewer() {
  return (
    <div className={styles.metadataViewer}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Metadata Version:</label>
        <select className={styles.selectField}>
          <option>Select version</option>
          <option>Latest</option>
          <option>v14</option>
          <option>v13</option>
        </select>
      </div>
      
      <div className={styles.resultBox}>
        No metadata loaded. Select a version to view metadata.
      </div>
      
      <button className={styles.actionButton}>
        <span className={styles.buttonIcon}>🔍</span>
        Fetch Latest Metadata
      </button>
    </div>
  );
}