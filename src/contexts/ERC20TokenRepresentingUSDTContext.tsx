import { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import useContractWithABI from 'hooks/useContractWithABIAndAddress';
import Erc20TokenABI from "../abis/ERC20TokenABI.json"
import { ERC20TokenContractInterface } from 'interfaces/ERC20TokenContractInterface';
import { useToast } from './ToastContext';
import { formatChainError } from 'utils/formatters';
interface ERC20ContextType {
  balance: bigint;
  allowance: bigint;
  refresh: () => Promise<void>;
  approveToken: (amount: bigint) => Promise<void>;
}

const ERC20Context = createContext<ERC20ContextType>({
  balance: BigInt(0),
  allowance: BigInt(0),
  refresh: async () => {},
  approveToken: async () => {},
});

export const ERC20Provider = ({ children }: { children: React.ReactNode }) => {
  const { account } = useWeb3React();
  const {showToast} = useToast();
  const [state, setState] = useState<{
    balance: bigint;
    allowance: bigint;
  }>({
    balance: BigInt(0),
    allowance: BigInt(0),
  });

  const erc20Contract = useContractWithABI<ERC20TokenContractInterface>(
    process.env.REACT_APP_ERC20_TOKEN_REPRESENTING_USD_STABLE_COIN_CONTRACT_ADDRESS,
    Erc20TokenABI,
  );

  const refresh = async () => {
    if (!account || !erc20Contract) return;
    
    const [balance, allowance] = await Promise.all([
      erc20Contract.balanceOf(account),
      erc20Contract.allowance(account, process.env.REACT_APP_GUESS_CONTRACT_ADDRESS!) 
    ]);
    
    setState({ balance, allowance });
  };

  const approveToken = async (amount: bigint) => {
    if (!account || !erc20Contract) {
      throw new Error("Wallet not connected or contract not initialized");
    }

    try {
      const tx = await erc20Contract.approve(
        process.env.REACT_APP_GUESS_CONTRACT_ADDRESS!,
        amount // Convert bigint to string for compatibility
      );
      
      await tx.wait();
      await refresh(); // Refresh allowance after approval
      
    } catch (error) {
      showToast(formatChainError(error))
    }
  };


  useEffect(() => {
    refresh();
  }, [account, erc20Contract]);

  return (
    <ERC20Context.Provider value={{
      balance: state.balance,
      allowance: state.allowance,
      refresh,
      approveToken,
    }}>
      {children}
    </ERC20Context.Provider>
  );
};

export const useERC20TokenRepresentingUSDT = () => useContext(ERC20Context);