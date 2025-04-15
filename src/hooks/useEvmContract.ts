import { useContractRead, useWriteContract } from 'wagmi';
import { Abi } from 'viem';

export function useEvmContract(config: {
  address: `0x${string}`;
  abi: Abi;
}) {
  const { address, abi } = config;

  const read = (functionName: string, args?: unknown[]) => {
    return useContractRead({
      address,
      abi,
      functionName,
      args,
    });
  };

  const write = (functionName: string, args?: unknown[]) => {
    const { writeContractAsync } = useWriteContract();
    
    return async () => {
      await writeContractAsync({
        address,
        abi,
        functionName,
        args,
      });
    };
  };

  return { read, write };
}