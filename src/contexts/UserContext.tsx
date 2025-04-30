import { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import useContractWithABI from 'hooks/useContractWithABIAndAddress';
import GuessABI from "../abis/GuessABI.json"
import { GuessContractInterface } from 'interfaces/GuessContractInterface';
import { UserInformation } from 'interfaces/GuessContractInterface';



interface UserContextType {
  userInfo: UserInformation | null;
  isRegistered: boolean | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  userInfo: null,
  isRegistered: null,
  loading: false,
  refreshUserData: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { account } = useWeb3React();
  const [state, setState] = useState<{
    userInfo: UserInformation | null;
    isRegistered: boolean | null;
    loading: boolean;
  }>({
    userInfo: null,
    isRegistered: null,
    loading: true,
  });

  const guessContract = useContractWithABI<GuessContractInterface>(
    process.env.REACT_APP_GUESS_CONTRACT_ADDRESS,
    GuessABI
  );

  const refreshUserData = async () => {
    if (!account || !guessContract) {
        setState({
            userInfo: null,
            isRegistered: null,
            loading: false,
          });
          return;
        }        
    setState(prev => ({ ...prev, loading: true }));
    try {
      const info = await guessContract.getUserInformation();
      setState({
        userInfo: info,
        isRegistered: info.isActive,
        loading: false,
      });
    } catch (error) {
      console.error("Error checking registration:", error);
      setState({
        userInfo: null,
        isRegistered: false,
        loading: false,
      });
    }
  };

  useEffect(() => {
    refreshUserData();
  }, [account, guessContract]);

  return (
    <UserContext.Provider value={{
      userInfo: state.userInfo,
      isRegistered: state.isRegistered,
      loading: state.loading,
      refreshUserData,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);