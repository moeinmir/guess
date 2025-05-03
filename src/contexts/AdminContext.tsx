// contexts/AdminContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import useContractWithABI from '../hooks/useContractWithABIAndAddress';
import GuessABI from '../abis/GuessABI.json';
import { GuessContractInterface } from 'interfaces/GuessContractInterface';

interface AdminContextType {
  adminAddress: string | null;
  isAdmin: boolean;
  loading: boolean;
  changeAdmin: (newAdmin: string) => Promise<void>;
  changeFeeReceiverAddress: (newFeeReceiverAddress: string) => Promise<void>
  refreshAdmin: () => Promise<void>;
  addBet: (
    dueDate: bigint,
    description: string,
    baseStakeUnit: bigint,
    feePercentage: number
  ) => Promise<void>;

  closeBet: (
    betId: bigint,
    outcome: bigint
   ) => Promise<void>;

}

const AdminContext = createContext<AdminContextType>({
  adminAddress: null,
  isAdmin: false,
  loading: false,
  changeAdmin: async () => {
    throw new Error("AdminContext not initialized");
  },
  changeFeeReceiverAddress:async()=>{
    throw new Error("AdminContext not initialized")
  },
  refreshAdmin: async () => {
    throw new Error("AdminContext not initialized");
  },
    addBet: async () => {
    throw new Error("AdminContext not initialized");
  },
  
  closeBet:async() => {
    throw new Error("AdminContext not initialized")
  }
});

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { account } = useWeb3React();
  const [state, setState] = useState<{
    adminAddress: string | null;
    loading: boolean;
  }>({
    adminAddress: null,
    loading: false,
  });

  const guessContract = useContractWithABI<GuessContractInterface>(
    process.env.REACT_APP_GUESS_CONTRACT_ADDRESS!,
    GuessABI
  );

  const refreshAdmin = async () => {
    if (!guessContract) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      const address = await guessContract.adminAddress();
      console.log("admin address")
      console.log(address)
      setState({
        adminAddress: address,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching admin address:", error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const changeAdmin = async (newAdmin: string) => {
    if (!guessContract || !account) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const tx = await guessContract.changeAdmin(newAdmin);
      await tx.wait();
      await refreshAdmin();
    } catch (error) {
      console.error("Error changing admin:", error);
      throw error;
    }
  };

  const changeFeeReceiverAddress = async (newFeeReceiverAddress: string) => {
    if (!guessContract || !account) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const tx = await guessContract.changeFeeReceiverAddress(newFeeReceiverAddress);
      await tx.wait();
      await refreshAdmin();
    } catch (error) {
      console.error("Error changing admin:", error);
      throw error;
    }
  };

  const addBet = async (
    dueDate: bigint,
    description: string,
    baseStakeUnit: bigint,
    feePercentage: number
  ) => {
    if (!guessContract || !isAdmin) return;
    
    const tx = await guessContract.addBet(
      BigInt(dueDate), // Convert JS timestamp to Unix
      description,
      baseStakeUnit,
      BigInt(feePercentage)
    );
    await tx.wait();
  };
  
  const closeBet = async (
    betId:bigint,
    outcome: bigint
  ) =>{
    if (!guessContract || !isAdmin) return;
    const tx = await guessContract.closeBet(betId,outcome);
    await tx.wait()
  }


  useEffect(() => {
    refreshAdmin();
  }, [guessContract]);

  const isAdmin = !!account && account.toLowerCase() === state.adminAddress?.toLowerCase();

  return (
    <AdminContext.Provider value={{
      adminAddress: state.adminAddress,
      isAdmin,
      loading: state.loading,
      changeAdmin,
      changeFeeReceiverAddress,
      refreshAdmin,
      addBet,
      closeBet
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);