import { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import useContractWithABI from 'hooks/useContractWithABIAndAddress';
import GuessABI from "../abis/GuessABI.json"
import { GuessContractInterface } from 'interfaces/GuessContractInterface';
import { UserInformation } from 'interfaces/GuessContractInterface';
import { formatChainError } from 'utils/formatters';
import { useToast } from './ToastContext';


interface UserContextType {
  userInfo: UserInformation | null;
  isRegistered: boolean | null;
  refreshBasicInfo: () => Promise<void>;
  ownerLastMessage: string | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  userInfo: null,
  isRegistered: null,
  refreshBasicInfo: async () => {},
  ownerLastMessage: null,
  loading: false
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { account } = useWeb3React();
  const {showToast} = useToast()
  const [state, setState] = useState<{
    userInfo: UserInformation | null;
    isRegistered: boolean | null;
    ownerLastMessage: string | null;
    loading: boolean;
  }>({
    userInfo: null,
    isRegistered: null,
    ownerLastMessage: null,
    loading: true
  });

  

  const guessContract = useContractWithABI<GuessContractInterface>(
    process.env.REACT_APP_GUESS_CONTRACT_ADDRESS,
    GuessABI
  );

  const refreshBasicInfo = async () => {
    if (!account || !guessContract) {
        setState({
            userInfo: null,
            isRegistered: null,
            ownerLastMessage: null,
            loading: false
          });
          return;
        }        
    setState(prev => ({ ...prev, loading: true }));
    try {
      const info = await guessContract.getUserInformation();
      const ownerLastMessage = await guessContract.ownerLastMessage()
      setState({
        userInfo: info,
        isRegistered: info.isActive,
        loading: false,
        ownerLastMessage: ownerLastMessage
      });

    } catch (error) {
      showToast(formatChainError(error))
      setState({
        userInfo: null,
        isRegistered: false,
        loading: false,
        ownerLastMessage: null
      });
    }
  };

  useEffect(() => {
    refreshBasicInfo();
  }, [account, guessContract]);

  return (
    <UserContext.Provider value={{
      userInfo: state.userInfo,
      isRegistered: state.isRegistered,
      loading: state.loading,
      ownerLastMessage: state.ownerLastMessage,
      refreshBasicInfo,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);