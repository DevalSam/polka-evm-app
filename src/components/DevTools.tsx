import { useState } from 'react';
import { ethers } from 'ethers';
import styles from './devtools/DeveloperTools.module.css';

export function DevTools() {
  const [abiInput, setAbiInput] = useState('');
  const [hexInput, setHexInput] = useState('');
  const [abiResult, setAbiResult] = useState('');
  const [hexResult, setHexResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEncode = () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simple example: Encode a function signature
      const iface = new ethers.utils.Interface([abiInput]);
      const encoded = iface.encodeFunctionData(abiInput.split('(')[0], []);
      setAbiResult(`Encoded data: ${encoded}`);
    } catch (err) {
      setError(`Encoding error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecode = () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Try to decode the input as function data
      const abiCoder = new ethers.utils.AbiCoder();
      const decoded = abiCoder.decode([], hexInput);
      setAbiResult(`Decoded: ${JSON.stringify(decoded, null, 2)}`);
    } catch (err) {
      setError(`Decoding error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHexConvert = (direction: 'to' | 'from') => {
    try {
      if (direction === 'to') {
        setHexResult(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(hexInput)));
      } else {
        setHexResult(ethers.utils.toUtf8String(hexInput));
      }
    } catch (err) {
      setError(`Hex conversion error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className={styles.devToolsContainer}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>🛠</span>
        <h2 className={styles.sectionTitle}>Developer Tools</h2>
      </div>

      {error && (
        <div className={`${styles.resultBox} ${styles.resultError}`}>
          {error}
        </div>
      )}

      <div className={styles.toolsGrid}>
        {/* ABI Encoder/Decoder */}
        <div className={styles.toolCard}>
          <div className={styles.toolHeader}>
            <h3 className={styles.toolTitle}>ABI Encoder/Decoder</h3>
            <span className={styles.toolTag}>ABI</span>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>ABI/Hex Data:</label>
            <textarea
              className={styles.textareaField}
              placeholder="Enter function signature (e.g., 'transfer(address,uint256)') or hex data..."
              value={abiInput}
              onChange={(e) => setAbiInput(e.target.value)}
            />
          </div>

          {(abiResult || isLoading) && (
            <div className={`${styles.resultBox} ${isLoading ? styles.loadingState : ''}`}>
              {isLoading ? (
                <>
                  <div className={styles.loadingSpinner} />
                  Processing...
                </>
              ) : (
                abiResult
              )}
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button 
              className={styles.actionButton} 
              onClick={handleEncode}
              disabled={isLoading || !abiInput}
            >
              Encode
            </button>
            <button 
              className={styles.actionButton} 
              onClick={handleDecode}
              disabled={isLoading || !abiInput}
            >
              Decode
            </button>
          </div>
        </div>

        {/* Hex Converter */}
        <div className={styles.toolCard}>
          <div className={styles.toolHeader}>
            <h3 className={styles.toolTitle}>Hex Converter</h3>
            <span className={styles.toolTag}>HEX</span>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Input:</label>
            <input
              className={styles.inputField}
              placeholder="Enter string or hex..."
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
            />
          </div>

          {hexResult && (
            <div className={styles.resultBox}>
              <pre>{hexResult}</pre>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button 
              className={styles.secondaryButton}
              onClick={() => handleHexConvert('to')}
              disabled={!hexInput}
            >
              String → Hex
            </button>
            <button 
              className={styles.secondaryButton}
              onClick={() => handleHexConvert('from')}
              disabled={!hexInput}
            >
              Hex → String
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}