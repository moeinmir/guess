// contexts/AdminContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import useContractWithABI from '../hooks/useContractWithABIAndAddress';
import GuessABI from '../abis/GuessABI.json';
import { GuessContractInterface } from 'interfaces/GuessContractInterface';
import { useToast } from './ToastContext';
import { formatChainError } from 'utils/formatters';
interface AdminContextType {
  adminAddress: string | null;
  ownerAddress: string | null;
  isAdmin: boolean;
  isOwner: boolean;
  loading: boolean;
  contractUSDBalance: bigint | null;
  contractETHBalance: bigint | null;
  cashOutUSD: (cashOutAmount: bigint) => Promise<void>;
  cashOutETH: (cashOutAmount: bigint) => Promise<void>;
  changeAdmin: (newAdmin: string) => Promise<void>;
  changeOwner: (newOwner:string) => Promise<void>;
  changeFeeReceiverAddress: (newFeeReceiverAddress: string) => Promise<void>;
  notifyUsers: (message: string) => Promise<void>
  refreshAdmin: () => Promise<void>;
  addBet: (
    dueDate: bigint,
    description: string,
    baseStakeUnit: bigint,
    feePercentage: number,
    maxSecondsBeforeDueForParticipation: bigint
  ) => Promise<void>;

  closeBet: (
    betId: bigint,
    outcome: bigint
   ) => Promise<void>;

}

const AdminContext = createContext<AdminContextType>({
  adminAddress: null,
  ownerAddress: null,
  isAdmin: false,
  isOwner: false,
  loading: false,
  contractETHBalance: null,
  contractUSDBalance: null,
  changeAdmin: async () => {
    throw new Error("AdminContext not initialized");
  },
  changeOwner: async () => {
    throw new Error("AdminContext not initialized");
  },
  notifyUsers: async () =>{
    throw new Error("AdminContext not initialized")
  },
  cashOutUSD: async () =>{
    throw new Error("AdminContext not initialized")
  },
  cashOutETH: async () =>{
    throw new Error("AdminContext not initialized")
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
  const { showToast } = useToast();
  const [state, setState] = useState<{
    adminAddress: string | null;
    ownerAddress: string | null;
    contractETHBalance: bigint | null;
    contractUSDBalance: bigint | null;
    loading: boolean;
  }>({
    adminAddress: null,
    ownerAddress: null,
    contractETHBalance: null,
    contractUSDBalance: null,
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
      const adminAddress = await guessContract.adminAddress();
      const ownerAddress = await guessContract.ownerAddress();
      const contractETHBalance = await guessContract.getContractETH()
      const contractUSDBalance = await guessContract.getContractUSD()
      setState({
        adminAddress: adminAddress,
        ownerAddress: ownerAddress,
        contractUSDBalance,
        contractETHBalance,
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
      showToast(formatChainError(error))
    }
  };

  
  const changeOwner = async (newOwner: string) => {
    if (!guessContract || !account) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const tx = await guessContract.changeOwner(newOwner);
      await tx.wait();
      await refreshAdmin();
    } catch (error) {
      showToast(formatChainError(error))
    }
  };

  const notifyUsers = async (message: string) => {
    if (!guessContract || !account) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const tx = await guessContract.notifyUsers(message);
      await tx.wait();
      await refreshAdmin();
    } catch (error) {
      showToast(formatChainError(error))
    }
  };

  const cashOutETH = async (cashOutAmount: bigint) => {
    if (!guessContract || !account) {
      throw new Error("Wallet not connected");
    }
    try {
      const tx = await guessContract.cashOutEth(cashOutAmount);
      await tx.wait();
      await refreshAdmin();
    } catch (error) {
      showToast(formatChainError(error))
    }
  }; 
  const cashOutUSD = async (cashOutAmount: bigint) => {
    if (!guessContract || !account) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const tx = await guessContract.cashOutUSD(cashOutAmount);
      await tx.wait();
      await refreshAdmin();
    } catch (error) {
      showToast(formatChainError(error))
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
      showToast(formatChainError(error))
    }
  };

  const addBet = async (
    dueDate: bigint,
    description: string,
    baseStakeUnit: bigint,
    feePercentage: number,
    maxSecondsBeforeDueForParticipation: bigint,
  ) => {
    if (!guessContract || !isAdmin) return;
    
    try{
    const tx = await guessContract.addBet(
      BigInt(dueDate), // Convert JS timestamp to Unix
      description,
      baseStakeUnit,
      BigInt(feePercentage),
      maxSecondsBeforeDueForParticipation
    );
    await tx.wait();
  }
  catch(error:any){
    showToast(formatChainError(error))
}
  };
  
  const closeBet = async (
    betId:bigint,
    outcome: bigint
  ) =>{
    if (!guessContract || !isAdmin) return;
    try{
      const tx = await guessContract.closeBet(betId,outcome);
      await tx.wait()  
    }
    catch(error:any){
        showToast(formatChainError(error))
    }
  }


  useEffect(() => {
    refreshAdmin();
  }, [guessContract]);

  const isAdmin = !!account && account.toLowerCase() === state.adminAddress?.toLowerCase();
  const isOwner = !!account && account.toLowerCase() === state.ownerAddress?.toLowerCase();
  return (
    <AdminContext.Provider value={{
      adminAddress: state.adminAddress,
      ownerAddress: state.ownerAddress,
      contractETHBalance: state.contractETHBalance,
      contractUSDBalance: state.contractUSDBalance,
      isAdmin,
      isOwner,
      loading: state.loading,
      changeAdmin,
      changeOwner,
      notifyUsers,
      changeFeeReceiverAddress,
      cashOutUSD,
      cashOutETH,
      refreshAdmin,
      addBet,
      closeBet
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);