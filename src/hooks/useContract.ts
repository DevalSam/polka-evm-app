import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface ContractFunction {
  name: string;
  inputs: ethers.utils.ParamType[];
  stateMutability: string;
}

export function useContract(address: string, abi: string) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [functions, setFunctions] = useState<ContractFunction[]>([]);

  useEffect(() => {
    if (address && abi) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractInstance = new ethers.Contract(address, JSON.parse(abi), provider);
      setContract(contractInstance);

      // Get the functions from the ABI
      const contractFunctions = contractInstance.interface.functions;
      const functionList = Object.keys(contractFunctions).map((key) => {
        const func = contractFunctions[key];
        return {
          name: func.name,
          inputs: func.inputs,
          stateMutability: func.stateMutability,
        };
      });
      setFunctions(functionList);
    }
  }, [address, abi]);

  const callFunction = async (functionName: string, params: any[]) => {
    if (!contract) return;
    try {
      const result = await contract[functionName](...params);
      console.log(result);
      return result;
    } catch (err) {
      console.error(`Error calling function ${functionName}:`, err);
      throw err;
    }
  };

  return { functions, callFunction };
}