import { DevToolCard } from './DevToolCard';
import styles from './DeveloperTools.module.css';

export function DeveloperTools() {
  // Sample functions for demonstration
  const handleGenerateABI = () => {
    console.log('Generate ABI clicked');
  };
  
  const handleVerifyContract = () => {
    console.log('Verify Contract clicked');
  };
  
  const handleDecodeTx = () => {
    console.log('Decode Transaction clicked');
  };
  
  const handleEncode = () => {
    console.log('Encode clicked');
  };
  
  const handleDecode = () => {
    console.log('Decode clicked');
  };
  
  return (
    <div className={styles.devToolsContainer}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🛠️</span>
        <h2 className={styles.sectionTitle}>Developer Tools</h2>
      </div>
      
      <div className={styles.toolsGrid}>
        <DevToolCard 
          title="Contract Tools" 
          tag="ABI"
          buttons={[
            { label: 'Generate ABI', onClick: handleGenerateABI, isPrimary: true, icon: '📝' },
            { label: 'Verify', onClick: handleVerifyContract, isPrimary: false }
          ]}
        >
          <div className={styles.inputGroup}>
            <label className={styles.label}>Contract Address:</label>
            <input className={styles.inputField} placeholder="0x..." />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Network:</label>
            <select className={styles.inputField}>
              <option>Ethereum</option>
              <option>Polygon</option>
              <option>Moonbeam</option>
            </select>
          </div>
        </DevToolCard>
        
        <DevToolCard 
          title="Transaction Decoder" 
          tag="Tx"
          buttons={[
            { label: 'Decode Transaction', onClick: handleDecodeTx, isPrimary: true, icon: '🔍' }
          ]}
        >
          <div className={styles.inputGroup}>
            <label className={styles.label}>Transaction Hash:</label>
            <input className={styles.inputField} placeholder="0x..." />
          </div>
          <div className={styles.codeDisplay}>
            Transaction details will appear here after decoding.
          </div>
        </DevToolCard>
        
        <DevToolCard 
          title="ABI Encoder/Decoder" 
          tag="Utils"
          buttons={[
            { label: 'Encode', onClick: handleEncode, isPrimary: true },
            { label: 'Decode', onClick: handleDecode, isPrimary: false }
          ]}
        >
          <div className={styles.inputGroup}>
            <label className={styles.label}>Input Data:</label>
            <textarea className={styles.textareaField} placeholder="Enter data to encode/decode..." />
          </div>
        </DevToolCard>
        
        <DevToolCard 
          title="Gas Estimator" 
          tag="Fee"
          buttons={[
            { label: 'Estimate Gas', onClick: () => {}, isPrimary: true, icon: '⛽' },
            { label: 'Reset', onClick: () => {}, isPrimary: false }
          ]}
        >
          <div className={styles.inputGroup}>
            <label className={styles.label}>Transaction Type:</label>
            <select className={styles.inputField}>
              <option>Transfer</option>
              <option>Contract Deployment</option>
              <option>Contract Interaction</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Network:</label>
            <select className={styles.inputField}>
              <option>Ethereum</option>
              <option>Polygon</option>
              <option>Moonbeam</option>
            </select>
          </div>
        </DevToolCard>
        
        <DevToolCard 
          title="Event Log Parser" 
          tag="Logs"
          buttons={[
            { label: 'Parse Logs', onClick: () => {}, isPrimary: true },
            { label: 'Clear', onClick: () => {}, isPrimary: false }
          ]}
        >
          <div className={styles.inputGroup}>
            <label className={styles.label}>Event Signature:</label>
            <input className={styles.inputField} placeholder="e.g., Transfer(address,address,uint256)" />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Log Data:</label>
            <textarea className={styles.textareaField} placeholder="Paste raw log data here..." rows={3} />
          </div>
        </DevToolCard>
        
        <DevToolCard 
          title="Hash Generator" 
          tag="Crypto"
          buttons={[
            { label: 'Generate Hash', onClick: () => {}, isPrimary: true, icon: '#️⃣' }
          ]}
        >
          <div className={styles.inputGroup}>
            <label className={styles.label}>Hash Type:</label>
            <select className={styles.inputField}>
              <option>keccak256</option>
              <option>sha256</option>
              <option>ripemd160</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Input Text:</label>
            <textarea className={styles.textareaField} placeholder="Enter text to hash..." rows={3} />
          </div>
        </DevToolCard>
      </div>
    </div>
  );
}