// src/utils/contractDeployer.ts
import { ethers } from 'ethers';
import type { Provider } from 'viem';

export interface DeploymentOptions {
  abi: any[];
  bytecode: string;
  constructorArgs?: any[];
  privateKey: string;
  provider: Provider;
}

export async function deploySolidityContract({
  abi,
  bytecode,
  constructorArgs = [],
  privateKey,
  provider
}: DeploymentOptions) {
  try {
    // Create ethers provider from viem provider
    const ethersProvider = new ethers.JsonRpcProvider(provider.url);
    
    // Create wallet with private key
    const wallet = new ethers.Wallet(privateKey, ethersProvider);
    
    // Create contract factory
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    
    // Deploy the contract
    const contract = await factory.deploy(...constructorArgs);
    
    // Wait for deployment to be mined
    const receipt = await contract.deploymentTransaction().wait(2);
    
    return {
      address: contract.target,
      transactionHash: receipt.hash,
      deployedBytecode: await ethersProvider.getCode(contract.target as string),
      receipt
    };
  } catch (error) {
    console.error('Contract deployment failed:', error);
    throw error;
  }
}