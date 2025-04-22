// src/components/ContractDeployer.tsx
import { useState } from 'react';
import { useWallets } from '../hooks/useWallets';
import { useNetwork } from '../hooks/useNetwork';
import { deploySolidityContract } from '../utils/contractDeployer';
import styles from './ContractDeployer.module.css';
import { ethers } from 'ethers'; // Import ethers

export default function ContractDeployer() {
  const { currentWallet } = useWallets();
  const { currentNetwork } = useNetwork();
  
  const [abi, setAbi] = useState('');
  const [bytecode, setBytecode] = useState('');
  const [constructorArgs, setConstructorArgs] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [deploymentStatus, setDeploymentStatus] = useState('idle');
  const [deployedContract, setDeployedContract] = useState<any>(null);
  const [error, setError] = useState('');
  
  const handleDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentWallet) {
      setError('Wallet not connected');
      return;
    }
    
    try {
      setDeploymentStatus('deploying');
      setError('');
      
      const parsedAbi = JSON.parse(abi);
      const parsedArgs = constructorArgs ? JSON.parse(constructorArgs) : [];
      
      // Create a provider using ethers.js
      // Note: You might want to use a different method to get the provider
      // depending on your wallet connection method
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      if (!provider) {
        setError('Provider not available');
        setDeploymentStatus('error');
        return;
      }
      
      const result = await deploySolidityContract({
        abi: parsedAbi,
        bytecode,
        constructorArgs: parsedArgs,
        privateKey,
        provider
      });
      
      setDeployedContract(result);
      setDeploymentStatus('success');
    } catch (err: any) {
      setError(err.message || 'Deployment failed');
      setDeploymentStatus('error');
    }
  };
  
  return (
    <div className={styles.container}>
      <h2>Deploy Solidity Contract to {currentNetwork?.name || 'Network'}</h2>
      
      <form onSubmit={handleDeployment} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Contract ABI (JSON format)</label>
          <textarea 
            value={abi}
            onChange={(e) => setAbi(e.target.value)}
            rows={6}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Contract Bytecode</label>
          <textarea 
            value={bytecode}
            onChange={(e) => setBytecode(e.target.value)}
            rows={3}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Constructor Arguments (JSON array format, optional)</label>
          <textarea 
            value={constructorArgs}
            onChange={(e) => setConstructorArgs(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Private Key (for signing deployment transaction)</label>
          <input 
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            required
          />
          <small>Note: Private keys should ideally not be entered directly in the UI. Consider using secure key management.</small>
        </div>
        
        <button 
          type="submit" 
          disabled={deploymentStatus === 'deploying' || !currentWallet}
          className={styles.deployButton}
        >
          {deploymentStatus === 'deploying' ? 'Deploying...' : 'Deploy Contract'}
        </button>
      </form>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {deployedContract && (
        <div className={styles.deploymentResult}>
          <h3>Deployment Successful!</h3>
          <p><strong>Contract Address:</strong> {deployedContract.address}</p>
          <p><strong>Transaction Hash:</strong> {deployedContract.transactionHash}</p>
        </div>
      )}
    </div>
  );
}