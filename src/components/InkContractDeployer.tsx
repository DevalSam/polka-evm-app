import { useState, useEffect } from 'react';
import { BN } from '@polkadot/util';
import { useNetwork } from '../hooks/useNetwork';
import { deployInkContract } from '../utils/inkContractDeployer';
import { 
  connectPolkadotExtension 
  // Removed unused import: getContractConstructors
} from '../utils/substrateUtils';
import styles from './InkContractDeployer.module.css';

interface Account {
  address: string;
  meta: {
    name: string;
    source: string;
  };
}

// Update the useNetwork hook's return type
export default function InkContractDeployer() {
  // We're directly typing the currentNetwork property to include the needed fields
  const { currentNetwork } = useNetwork() as { 
    currentNetwork: { 
      wsUrl?: string; 
      isSubstrate?: boolean;
      // Add other properties as needed
    } 
  };
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [wasmFile, setWasmFile] = useState<File | null>(null);
  const [abiFile, setAbiFile] = useState<File | null>(null);
  const [parsedAbi, setParsedAbi] = useState<any>(null);
  const [constructorName, setConstructorName] = useState<string>('');
  const [constructors, setConstructors] = useState<string[]>([]);
  const [constructorArgs, setConstructorArgs] = useState<string>('');
  const [gasLimit, setGasLimit] = useState<string>('');
  const [endpointUrl, setEndpointUrl] = useState<string>('');
  const [salt, setSalt] = useState<string>('');
  const [deploymentStatus, setDeploymentStatus] = useState<string>('idle');
  const [deployedContract, setDeployedContract] = useState<any>(null);
  const [error, setError] = useState<string>('');

  // Connect to Polkadot extension on component mount
  useEffect(() => {
    const connectWallet = async () => {
      try {
        const accounts = await connectPolkadotExtension('Polkadot Integration');
        setAccounts(accounts);
        
        // Set the first account as the default if available
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0].address);
        }
      } catch (err: any) {
        setError(`Error connecting wallet: ${err.message}`);
      }
    };

    connectWallet();
  }, []);

  // Set endpoint URL based on selected network
  useEffect(() => {
    // Check if currentNetwork exists and has required properties
    if (currentNetwork?.wsUrl && currentNetwork?.isSubstrate) {
      setEndpointUrl(currentNetwork.wsUrl);
    }
  }, [currentNetwork]);

  // Parse ABI file when selected to extract constructors
  useEffect(() => {
    if (!abiFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const abiJson = JSON.parse(e.target?.result as string);
        setParsedAbi(abiJson);

        // Extract constructor names
        if (abiJson.constructors && Array.isArray(abiJson.constructors)) {
          const ctors = abiJson.constructors.map((ctor: any) => ctor.name || 'new');
          setConstructors(ctors);
          
          // Set default constructor if available
          if (ctors.length > 0) {
            setConstructorName(ctors[0]);
          }
        }
      } catch (err: any) {
        setError(`Invalid ABI file: ${err.message}`);
        setParsedAbi(null);
      }
    };
    reader.readAsText(abiFile);
  }, [abiFile]);

  const handleWasmFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setWasmFile(e.target.files[0]);
    }
  };

  const handleAbiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAbiFile(e.target.files[0]);
    }
  };

  const handleDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccount || !wasmFile || !parsedAbi || !constructorName || !endpointUrl) {
      setError('Missing required fields');
      return;
    }
    
    try {
      setDeploymentStatus('deploying');
      setError('');
      
      // Parse constructor arguments
      let args: any[] = [];
      if (constructorArgs.trim()) {
        try {
          args = JSON.parse(constructorArgs);
          if (!Array.isArray(args)) {
            args = [args]; // Wrap single value in array
          }
        } catch (err) {
          throw new Error('Invalid constructor arguments format. Must be a JSON array.');
        }
      }
      
      // Read WASM file
      const wasmBuffer = await wasmFile.arrayBuffer();
      const wasmUint8Array = new Uint8Array(wasmBuffer);
      
      // Prepare gas limit
      const gasLimitBN = gasLimit ? new BN(gasLimit) : undefined;
      
      // Deploy the contract
      const result = await deployInkContract({
        wasm: wasmUint8Array,
        abi: parsedAbi,
        constructorName,
        constructorArgs: args,
        gasLimit: gasLimitBN,
        salt: salt || undefined,
        signer: selectedAccount,
        endpoint: endpointUrl
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
      <h2>Deploy ink! Contract to Substrate Chain</h2>
      
      <form onSubmit={handleDeployment} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Substrate Network Endpoint</label>
          <input 
            type="text"
            value={endpointUrl}
            onChange={(e) => setEndpointUrl(e.target.value)}
            placeholder="wss://westend-rpc.polkadot.io"
            required
          />
          <small>WebSocket endpoint for the Substrate network (e.g., Westend, Rococo)</small>
        </div>
        
        <div className={styles.formGroup}>
          <label>Select Account</label>
          <select 
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            required
          >
            <option value="">Select an account</option>
            {accounts.map(account => (
              <option key={account.address} value={account.address}>
                {account.meta.name || 'Unnamed'} - {account.address.slice(0, 10)}...
              </option>
            ))}
          </select>
          <small>{accounts.length === 0 && 'No accounts found. Please install the Polkadot.js extension.'}</small>
        </div>
        
        <div className={styles.formGroup}>
          <label>Contract WASM File</label>
          <input 
            type="file"
            accept=".wasm"
            onChange={handleWasmFileChange}
            required
          />
          <small>{wasmFile ? `Selected: ${wasmFile.name}` : 'Upload the compiled contract WASM file'}</small>
        </div>
        
        <div className={styles.formGroup}>
          <label>Contract ABI File</label>
          <input 
            type="file"
            accept=".json"
            onChange={handleAbiFileChange}
            required
          />
          <small>{abiFile ? `Selected: ${abiFile.name}` : 'Upload the contract metadata JSON file'}</small>
        </div>
        
        {constructors.length > 0 && (
          <div className={styles.formGroup}>
            <label>Constructor</label>
            <select 
              value={constructorName}
              onChange={(e) => setConstructorName(e.target.value)}
              required
            >
              {constructors.map(ctor => (
                <option key={ctor} value={ctor}>{ctor}</option>
              ))}
            </select>
          </div>
        )}
        
        <div className={styles.formGroup}>
          <label>Constructor Arguments (JSON array format, optional)</label>
          <textarea 
            value={constructorArgs}
            onChange={(e) => setConstructorArgs(e.target.value)}
            rows={3}
            placeholder='[42, "hello", true]'
          />
          <small>Enter arguments as a JSON array matching the constructor's parameters</small>
        </div>
        
        <div className={styles.formGroup}>
          <label>Gas Limit (optional)</label>
          <input 
            type="text"
            value={gasLimit}
            onChange={(e) => setGasLimit(e.target.value)}
            placeholder="100000000000"
          />
          <small>Leave empty for automatic estimation</small>
        </div>
        
        <div className={styles.formGroup}>
          <label>Salt (optional)</label>
          <input 
            type="text"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            placeholder="0x..."
          />
          <small>Optional salt for deterministic deployment</small>
        </div>
        
        <button 
          type="submit" 
          disabled={deploymentStatus === 'deploying' || !selectedAccount || !wasmFile || !parsedAbi}
          className={styles.deployButton}
        >
          {deploymentStatus === 'deploying' ? 'Deploying...' : 'Deploy ink! Contract'}
        </button>
      </form>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {deployedContract && (
        <div className={styles.deploymentResult}>
          <h3>Deployment Successful!</h3>
          <p><strong>Contract Address:</strong> {deployedContract.address}</p>
          <p><strong>Block Hash:</strong> {deployedContract.blockHash}</p>
          <p><strong>Transaction Hash:</strong> {deployedContract.txHash}</p>
        </div>
      )}
    </div>
  );
}