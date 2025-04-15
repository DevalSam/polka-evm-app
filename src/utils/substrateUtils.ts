// utils/substrateUtils.ts

import { ApiPromise, WsProvider } from '@polkadot/api';

/**
 * Connects to a Substrate node via WebSocket and returns the initialized API.
 * @param endpoint WebSocket endpoint of the Substrate node
 */
export async function connectToSubstrate(endpoint: string): Promise<ApiPromise> {
  const provider = new WsProvider(endpoint);
  const api = await ApiPromise.create({ provider });
  await api.isReady;
  return api;
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
