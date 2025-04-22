// src/utils/inkContractDeployer.ts
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Abi, ContractPromise } from '@polkadot/api-contract';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { BN, hexToU8a } from '@polkadot/util';
import type { ISubmittableResult } from '@polkadot/types/types';
// Import web3FromAddress only where needed to avoid unused import warning


export interface InkDeploymentOptions {
  wasm: Uint8Array | string;
  abi: any;
  constructorName: string;
  constructorArgs: any[];
  value?: BN;
  gasLimit?: BN;
  storageDepositLimit?: BN | null;
  salt?: Uint8Array | string | null;
  signer: string;
  endpoint: string;
}

export interface InkDeploymentResult {
  address: string;
  blockHash: string;
  txHash: string;
  events: any[];
}

/**
 * Deploy an ink! contract on a Substrate-based chain
 */
export async function deployInkContract({
  wasm,
  abi,
  constructorName,
  constructorArgs,
  value = new BN(0),
  gasLimit,
  storageDepositLimit = null,
  salt = null,
  signer,
  endpoint
}: InkDeploymentOptions): Promise<InkDeploymentResult> {
  const provider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider });

  try {
    // Import here to avoid unused import warning at the top
    const { web3FromAddress } = await import('@polkadot/extension-dapp');
    
    // Parse the ABI
    const contractAbi = new Abi(abi, api.registry.getChainProperties());
    const injector = await web3FromAddress(signer);
    
    // Prepare WASM - convert from hex if needed
    const wasmCode = typeof wasm === 'string' ? hexToU8a(wasm) : wasm;
    
    // Prepare salt - convert to Uint8Array or use empty array if null
    const saltData = salt 
      ? (typeof salt === 'string' ? hexToU8a(salt) : salt) 
      : new Uint8Array(0);

    // Estimate gas if not provided
    if (!gasLimit) {
      // Default to a reasonable value if estimation fails
      gasLimit = new BN('10000000000');
      
      try {
        // Try to estimate gas (implementation depends on chain)
        const estimatedGas = await api.call.contractsApi.instantiateWithCode(
          value,
          gasLimit,
          storageDepositLimit,
          wasmCode,
          contractAbi.findConstructor(constructorName).toU8a(constructorArgs),
          saltData
        );
        
        // Add a buffer to the estimated gas
        gasLimit = new BN(estimatedGas.toString()).muln(1.2);
      } catch (error) {
        console.warn('Gas estimation failed, using default:', error);
      }
    }

    // Deploy the contract
    const tx = api.tx.contracts.instantiateWithCode(
      value,
      gasLimit,
      storageDepositLimit,
      wasmCode,
      contractAbi.findConstructor(constructorName).toU8a(constructorArgs),
      saltData
    );

    // Sign and send the transaction
    return new Promise<InkDeploymentResult>((resolve, reject) => {
      let unsubFn: (() => void) | undefined;
      
      const callback = (result: ISubmittableResult) => {
        if (result.status.isInBlock || result.status.isFinalized) {
          // Find contract instantiation event
          const instantiateEvent = result.events.find(
            (event) => 
              api.events.contracts.Instantiated.is(event.event) ||
              api.events.contracts.InstantiatedTriggered?.is(event.event)
          );

          if (instantiateEvent) {
            const contractAddress = instantiateEvent.event.data[1].toString();
            
            resolve({
              address: contractAddress,
              blockHash: result.status.asInBlock.toString(),
              txHash: tx.hash.toString(),
              events: result.events.map(e => e.event.toHuman())
            });

            // Cleanup subscription
            unsubFn?.();
          }
        }
        
        if (result.status.isDropped || result.status.isFinalityTimeout || result.status.isInvalid || result.status.isUsurped) {
          reject(new Error(`Transaction failed with status: ${result.status.type}`));
          unsubFn?.();
        }
      };

      // The correct way to handle the Promise<() => void> return type
      tx.signAndSend(signer, { signer: injector.signer }, callback)
        .then(unsub => {
          unsubFn = unsub;
        })
        .catch(error => {
          reject(error);
        });
    });
  } catch (error) {
    console.error('Contract deployment failed:', error);
    throw error;
  } finally {
    // Disconnect from the provider
    await provider.disconnect();
  }
}

/**
 * Create a contract instance from an existing address
 */
export async function getInkContract(address: string, abi: any, endpoint: string) {
  const provider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider });
  
  const contractAbi = new Abi(abi, api.registry.getChainProperties());
  return new ContractPromise(api, contractAbi, address);
}

/**
 * Utility function to create a keyring from a seed or mnemonic
 */
export function createSigner(
  seed: string, 
  type: 'sr25519' | 'ed25519' | 'ecdsa' = 'sr25519'
): KeyringPair {
  return new Keyring({ type }).addFromUri(seed);
}