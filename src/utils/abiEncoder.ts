import { Interface } from 'ethers/lib/utils';

/**
 * Decodes hex data using a given ABI and function name.
 *
 * @param abiString - The ABI JSON string.
 * @param functionName - The name of the function to decode.
 * @param data - The hex-encoded data string.
 * @returns An array of decoded parameters or an error message.
 */
export function decodeWithABI(abiString: string, functionName: string, data: string): any[] {
  try {
    const iface = new Interface(JSON.parse(abiString));
    const decoded = iface.decodeFunctionData(functionName, data);
    return Array.from(decoded); // Converts ethers `Result` type to a plain array
  } catch (error) {
    console.error('ABI decoding error:', error);
    return [`Error: ${(error as Error).message}`];
  }
}
