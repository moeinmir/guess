// interfaces/NativeChainInterface.ts
export interface NativeChainServiceInterface {
    getBalance(address: string): Promise<string>; // in ETH
    sendNativeCurrency(to: string, amountEth: string): Promise<string>; // txHash
    getLatestBlockTimestamp(): Promise<number>;
  }
  
