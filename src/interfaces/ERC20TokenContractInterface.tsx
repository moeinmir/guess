import { ContractTransaction } from 'ethers';

export interface ERC20TokenContractInterface {

    
    // Functions
    _mint(account: string, value: bigint): Promise<void>;
    
    approve(spender: string, value: bigint): Promise<ContractTransaction>;
    
    transfer(to: string, value: bigint): Promise<boolean>;
    
    transferFrom(from: string, to: string, value: bigint): Promise<boolean>;
  
    // View functions
    admin(): Promise<string>;
    
    allowance(owner: string, spender: string): Promise<bigint>;
    
    balanceOf(account: string): Promise<bigint>;
    
    decimals(): Promise<number>;
    
    name(): Promise<string>;
    
    symbol(): Promise<string>;
    
    totalSupply(): Promise<bigint>;
  }