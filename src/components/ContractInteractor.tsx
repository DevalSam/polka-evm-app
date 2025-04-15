import { useState } from 'react';
import { useContract } from '../hooks/useContract';
import styles from './ContractInteractor.module.css';

interface ContractInput {
  name: string;
  type: string;
}

interface ContractFunction {
  name: string;
  inputs: ContractInput[];
  stateMutability: string;
}

export function ContractInteractor() {
  const [abi, setAbi] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const { functions, callFunction } = useContract(contractAddress, abi);
  const [inputValues, setInputValues] = useState<Record<string, string[]>>({});

  const handleInputChange = (funcName: string, index: number, value: string) => {
    setInputValues((prev) => {
      const current = prev[funcName] || [];
      const updated = [...current];
      updated[index] = value;
      return { ...prev, [funcName]: updated };
    });
  };

  const handleFunctionCall = (func: ContractFunction) => {
    const params = inputValues[func.name] || [];
    callFunction(func.name, params);
  };

  return (
    <div className={styles.abiContent}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>📄</span>
        Contract ABI
      </h3>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>Contract Address:</label>
        <input 
          className={styles.inputField}
          placeholder="0x..." 
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </div>
      
      <div className={styles.inputGroup}>
        <label className={styles.label}>ABI JSON:</label>
        <textarea 
          className={styles.textAreaField}
          placeholder="Paste ABI JSON here..." 
          value={abi}
          onChange={(e) => setAbi(e.target.value)}
        />
      </div>

      <div className={styles.uploadArea}>
        <div className={styles.uploadIcon}>📂</div>
        <div className={styles.uploadText}>Drop ABI file here or click to browse</div>
      </div>

      {functions.length > 0 && (
        <div className={styles.functionList}>
          <h4>Contract Functions</h4>
          {functions.map((func: ContractFunction) => (
            <div key={func.name} className={styles.functionCard}>
              <div className={styles.functionName}>{func.name}</div>
              {func.inputs.map((input: ContractInput, index: number) => (
                <input 
                  key={index}
                  className={styles.inputField}
                  placeholder={`${input.name || 'param'} (${input.type})`}
                  value={inputValues[func.name]?.[index] || ''}
                  onChange={(e) => handleInputChange(func.name, index, e.target.value)}
                />
              ))}
              <button 
                className={styles.actionButton}
                onClick={() => handleFunctionCall(func)}
              >
                {func.stateMutability === 'view' ? 'Call' : 'Send Transaction'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
