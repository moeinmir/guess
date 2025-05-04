// contexts/BetsContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import useContractWithABI from 'hooks/useContractWithABIAndAddress';
import GuessABI from '../abis/GuessABI.json';
import { GuessContractInterface, Bet } from 'interfaces/GuessContractInterface';
import { useToast } from './ToastContext';
import { formatChainError } from 'utils/formatters';

const pageSize = 5

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
  reversePageNumber: Number;
  lastBetId: Number;
  callSetReversePageNumber: (page: number) => void
  isLastPage: boolean

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
  settleBet:async() =>{},
  reversePageNumber: 0,
  lastBetId: 0,
  callSetReversePageNumber: () => {},
  isLastPage: false
  
});

export const BetsProvider = ({ children }: { children: React.ReactNode }) => {
  const { account } = useWeb3React();
  const { showToast } = useToast();
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

  const [lastBetId,setLastBetId] = useState(0)
  const [reversePageNumber,setReversePageNumber]= useState<number>(0)
  const [isLastPage,setIsLastPage] = useState<boolean>(false)

  

  const guessContract = useContractWithABI<GuessContractInterface>(
    process.env.REACT_APP_GUESS_CONTRACT_ADDRESS,
    GuessABI
  );

  useEffect(()=>{
    const fetchLastBetId = async () => {
      let lastBetId = await guessContract?.getNextBetId();
      setLastBetId(Number(lastBetId))
    }
    fetchLastBetId()
  },[guessContract])
  
  useEffect(()=>{},[

  ])

  useEffect(()=>{
    const checkIsLastPage = () =>{
      if ((reversePageNumber+1)*pageSize>lastBetId){
        setIsLastPage(true)
      }
      else{
        setIsLastPage(false)
      }
    }
    checkIsLastPage()
  },[reversePageNumber,lastBetId])


  const callSetReversePageNumber = (reversePageNumber: number) => {
    setReversePageNumber(reversePageNumber);
  }


  const fetchBets = async () => {
    if (!guessContract || !account) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      let lastBetId = await guessContract.getNextBetId();
      const bets: Bet[] = [];
      
      

      
      let startIndex = (Number(lastBetId) - (reversePageNumber+1)*pageSize)<0 ? 0 : Number(lastBetId) - (reversePageNumber+1)*pageSize
      let endIndex = (Number(lastBetId) - (reversePageNumber)*pageSize)> lastBetId ? lastBetId : Number(lastBetId) - (reversePageNumber)*pageSize

      for (let i = startIndex; i < endIndex; i++) {
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
      showToast(formatChainError(error))
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
      showToast(formatChainError(error))
    }
  };

  const claimReward = async (betId: bigint) => {
    if (!guessContract || !account) return;
    
    try {
      const tx = await guessContract.claimReward(betId);
      await tx.wait();
      await fetchBets();
    } catch (error) {
      showToast(formatChainError(error))
    }
  };

  const settleBet = async (betId: bigint) => {
    if (!guessContract || !account) return;
    
    try {
      const tx = await guessContract.claimReward(betId);
      await tx.wait();
      await fetchBets();
    } catch (error) {
      showToast(formatChainError(error))
    }
  };
  

  useEffect(() => {
    fetchBets();
  }, [account, guessContract,reversePageNumber]);

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
      settleBet,
      reversePageNumber:reversePageNumber,
      lastBetId:lastBetId,
      callSetReversePageNumber,
      isLastPage:isLastPage
    }}>
      {children}
    </BetsContext.Provider>
  );
};

export const useBets = () => useContext(BetsContext);