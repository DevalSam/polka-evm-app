// src/utils/substrateUtils.ts
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { Abi, ContractPromise } from '@polkadot/api-contract';
import { BN } from '@polkadot/util';

// Interface for Substrate accounts from extension
export interface SubstrateAccount {
  address: string;
  meta: {
    name: string;
    source: string;
  };
}

/**
 * Connect to Polkadot.js extension and get accounts
 */
export async function connectPolkadotExtension(appName: string = 'Polkadot Dapp'): Promise<SubstrateAccount[]> {
  try {
    // Enable the extension
    const extensions = await web3Enable(appName);
    if (extensions.length === 0) {
      throw new Error('No extension found. Please install the Polkadot.js extension.');
    }
    
    // Get all accounts and adapt them to our interface
    const injectedAccounts = await web3Accounts();
    return injectedAccounts.map(account => ({
      address: account.address,
      meta: {
        name: account.meta.name || '', // Convert undefined to empty string
        source: account.meta.source
      }
    }));
  } catch (error) {
    console.error('Failed to connect to Polkadot extension:', error);
    throw error;
  }
}

/**
 * Connect to a Substrate chain using WebSocket endpoint
 */
export async function connectToSubstrateChain(endpoint: string): Promise<ApiPromise> {
  try {
    const provider = new WsProvider(endpoint);
    const api = await ApiPromise.create({ provider });
    
    // Wait for API to be ready
    await api.isReady;
    return api;
  } catch (error) {
    console.error('Failed to connect to Substrate chain:', error);
    throw error;
  }
}

/**
 * Connects to a Substrate node via WebSocket and returns the initialized API.
 * Alias for connectToSubstrateChain for compatibility
 * @param endpoint WebSocket endpoint of the Substrate node
 */
export async function connectToSubstrate(endpoint: string): Promise<ApiPromise> {
  return connectToSubstrateChain(endpoint);
}

/**
 * Fetches metadata from the connected Substrate chain.
 * @param api The connected ApiPromise instance
 */
export function getMetadata(api: ApiPromise): string {
  return JSON.stringify(api.runtimeMetadata.toHuman(), null, 2); // pretty print
}

/**
 * Fetches chain information such as name, version, and properties.
 * @param api The connected ApiPromise instance
 */
export async function getChainInfo(api: ApiPromise) {
  const [chain, nodeName, nodeVersion, properties] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
    api.rpc.system.properties()
  ]);

  return {
    chain: chain.toHuman(),
    nodeName: nodeName.toHuman(),
    nodeVersion: nodeVersion.toHuman(),
    properties: properties.toHuman()
  };
}

/**
 * Parse ink! contract metadata
 */
export function parseInkMetadata(metadataJson: any, api: ApiPromise): Abi {
  return new Abi(metadataJson, api.registry.getChainProperties());
}

/**
 * Create a contract instance for interaction
 */
export function createContractInstance(
  address: string, 
  abi: Abi, 
  api: ApiPromise
): ContractPromise {
  return new ContractPromise(api, abi, address);
}

/**
 * Call a read method (query) on an ink! contract
 */
export async function callContractQuery(
  contract: ContractPromise,
  methodName: string,
  caller: string,
  args: any[] = []
) {
  try {
    // Use maximum gas limit for read operations (will not be charged)
    const gasLimit = -1;
    
    const result = await contract.query[methodName](caller, { gasLimit }, ...args);
    
    if (result.result.isOk) {
      return {
        success: true,
        data: result.output?.toHuman() || null // Handle possibly null output
      };
    } else {
      throw new Error(`Query failed: ${result.result.asErr.toHuman()}`);
    }
  } catch (error) {
    console.error(`Error calling ${methodName}:`, error);
    throw error;
  }
}

/**
 * Execute a write operation (tx) on an ink! contract
 */
export async function executeContractTx(
  contract: ContractPromise,
  methodName: string,
  signer: string,
  args: any[] = [],
  options = { gasLimit: new BN('10000000000') }
) {
  try {
    // Get the injector for the signer
    const { web3FromAddress } = await import('@polkadot/extension-dapp');
    const injector = await web3FromAddress(signer);
    
    // Execute the transaction
    return new Promise((resolve, reject) => {
      let unsubFn: (() => void) | undefined;
      
      contract.tx[methodName](options, ...args)
        .signAndSend(signer, { signer: injector.signer }, (result) => {
          if (result.status.isInBlock || result.status.isFinalized) {
            // Format events for better readability
            const events = result.events.map(e => ({
              name: e.event.method, // Using 'method' instead of 'identifier'
              data: e.event.data.toHuman()
            }));
            
            resolve({
              success: true,
              blockHash: result.status.isInBlock 
                ? result.status.asInBlock.toHex() 
                : result.status.asFinalized.toHex(),
              events
            });
            
            if (unsubFn) unsubFn();
          }
          
          if (result.status.isDropped || result.status.isFinalityTimeout || result.status.isInvalid || result.status.isUsurped) {
            reject(new Error(`Transaction failed with status: ${result.status.type}`));
            if (unsubFn) unsubFn();
          }
        })
        .then(unsub => {
          unsubFn = unsub;
        })
        .catch(error => {
          reject(error);
        });
    });
  } catch (error) {
    console.error(`Error executing ${methodName}:`, error);
    throw error;
  }
}

/**
 * Get a list of available methods from an ink! contract ABI
 */
export function getContractMethods(abi: Abi) {
  const messages = abi.messages;
  return messages.map(message => {
    // Cast to any to access the properties safely
    const msg = message as any;
    return {
      name: msg.identifier,
      args: msg.args.map((arg: any) => ({
        name: arg.name,
        type: arg.type.displayName || arg.type.type
      })),
      returnType: msg.returnType?.displayName || msg.returnType?.type || 'void',
      isMutating: msg.mutates || false, // Default to false if property doesn't exist
      docs: msg.docs
    };
  });
}

/**
 * Extract constructors from ink! contract ABI
 */
export function getContractConstructors(abi: Abi) {
  return abi.constructors.map(constructor => {
    // Cast to any to access the properties safely
    const ctor = constructor as any;
    return {
      name: ctor.identifier,
      args: ctor.args.map((arg: any) => ({
        name: arg.name,
        type: arg.type.displayName || arg.type.type
      })),
      docs: ctor.docs
    };
  });
}