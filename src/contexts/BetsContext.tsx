// contexts/BetsContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import useContractWithABI from 'hooks/useContractWithABIAndAddress';
import GuessABI from '../abis/GuessABI.json';
import { GuessContractInterface, Bet } from 'interfaces/GuessContractInterface';

interface BetsContextType {
  activeBets: Bet[];
  closedBets: Bet[];
  settledBets: Bet[];
  winningBets: Bet[];
  settledWinningBets: Bet[];
  loading: boolean;
  fetchBets: () => Promise<void>;
  placeBet: (betId: bigint, guess: bigint) => Promise<void>;
  claimReward: (betId: bigint) => Promise<void>;
  settleBet: (betId: bigint) => Promise<void>;
}

const BetsContext = createContext<BetsContextType>({
  activeBets: [],
  closedBets: [],
  settledBets: [],
  winningBets:[],
  settledWinningBets:[],
  loading: false,
  fetchBets: async () => {},
  placeBet: async () => {},
  claimReward: async () => {},
  settleBet:async() =>{}
});

export const BetsProvider = ({ children }: { children: React.ReactNode }) => {
  const { account } = useWeb3React();
  const [state, setState] = useState<{
    activeBets: Bet[];
    closedBets: Bet[];
    settledBets: Bet[];
    winningBets: Bet[];
    settledWinningBets: Bet[];
    loading: boolean;
    lastBetId: bigint | null;
  }>({
    activeBets: [],
    closedBets: [],
    settledBets: [],
    winningBets:[],
    settledWinningBets:[],
    loading: false,
    lastBetId: null,
  });

  const guessContract = useContractWithABI<GuessContractInterface>(
    process.env.REACT_APP_GUESS_CONTRACT_ADDRESS,
    GuessABI
  );


  const fetchBets = async () => {
    if (!guessContract || !account) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {

      const lastBetId = await guessContract.getNextBetId();
      
      const bets: Bet[] = [];
      
      for (let i = 1; i < lastBetId; i++) {
        const bet = await guessContract.getBetInformation(BigInt(i));
        bets.push(bet);
      }
      
      const activeBets = bets.filter(bet => bet.isActive && !bet.isClosed );
      const closedBets = bets.filter(bet => bet.isClosed && !bet.isSettled);
      const settledBets = bets.filter(bet => bet.isSettled);
      const winningBets = bets.filter(bet => bet.isClosed && (bet.closestGuessAddress == account) && !bet.isSettled);
      const settledWinningBets = bets.filter(bet => bet.isSettled && bet.closestGuessAddress == account);
      setState({
        activeBets,
        closedBets,
        settledBets,
        winningBets,
        settledWinningBets,
        loading: false,
        lastBetId,
      });
    } catch (error) {
      console.error("Error fetching bets:", error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const placeBet = async (betId: bigint, guess: bigint) => {
    if (!guessContract || !account) return;
    
    try {
      const tx = await guessContract.betOn(betId, guess);
      await tx.wait();
      await fetchBets();
    } catch (error) {
      console.error("Error placing bet:", error);
      throw error;
    }
  };

  const claimReward = async (betId: bigint) => {
    if (!guessContract || !account) return;
    
    try {
      const tx = await guessContract.claimReward(betId);
      await tx.wait();
      await fetchBets();
    } catch (error) {
      console.error("Error claiming reward:", error);
      throw error;
    }
  };

  const settleBet = async (betId: bigint) => {
    if (!guessContract || !account) return;
    
    try {
      const tx = await guessContract.claimReward(betId);
      await tx.wait();
       // Refresh the list after claiming
      await fetchBets(); // Refresh other bet lists
    } catch (error) {
      console.error("Error settling bet:", error);
      throw error;
    }
  };
  

  useEffect(() => {
    fetchBets();
  }, [account, guessContract]);

  return (
    <BetsContext.Provider value={{
      activeBets: state.activeBets,
      closedBets: state.closedBets,
      settledBets: state.settledBets,
      winningBets: state.winningBets,
      settledWinningBets: state.settledWinningBets,
      loading: state.loading,
      fetchBets,
      placeBet,
      claimReward,
      settleBet
    }}>
      {children}
    </BetsContext.Provider>
  );
};

export const useBets = () => useContext(BetsContext);