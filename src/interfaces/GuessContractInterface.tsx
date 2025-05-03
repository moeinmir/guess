import { ContractTransaction } from 'ethers';
export interface Bet {
    id: bigint;
    dueDate: bigint;
    description: string;
    outcome: bigint;
    isActive: boolean;
    isClosed: boolean;
    isSettled: boolean;
    closestGuessAddress: string;
    baseStakeUnit: bigint;
    feePercentage: bigint;
    collectedAmount: bigint;
    winingAmount: bigint;
    feeAmount: bigint;
    maxSecondsBeforeDueForParticipation: bigint
  }
  
  interface Prediction {
    guess: bigint;
    predictorAddress: string;
  }
  
 export interface UserInformation {
    isActive: boolean;
    userName: string;
    userAddress: string;
  }
  
 export interface GuessContractInterface {
    // Functions
    addBet(
      dueDate: bigint,
      description: string,
      baseStakeUnit: bigint,
      feePercentage: bigint,
      maxSecondsBeforeDueForParticipation: bigint,
    ): Promise<ContractTransaction>;
    
    betOn(
      betId: bigint,
      guess: bigint,
    ): Promise<ContractTransaction>;
    
    getNextBetId() : Promise<bigint>

    adminAddress(): Promise<string>;

    ownerAddress(): Promise<string>;

    ownerLastMessage(): Promise<string>;

    usdLockedAmount(): Promise<bigint>;

    getContractUSD(): Promise<bigint>;

    getContractETH(): Promise<bigint>;

    changeAdmin(newAdminAddress: string): Promise<ContractTransaction>; 

    changeOwner(newOwnerAddress: string): Promise<ContractTransaction>;

    cashOutEth(cashOutAmount: bigint): Promise<ContractTransaction>;  

    cashOutUSD(cashOutAmount: bigint): Promise<ContractTransaction>;
    
    changeFeeReceiverAddress(newFeeReceiverAddress: string): Promise<ContractTransaction>;

    
    notifyUsers(message: string): Promise<ContractTransaction>;
    
    claimReward(betId: bigint): Promise<ContractTransaction>;
    
    closeBet(betId: bigint, outcome: bigint): Promise<ContractTransaction>;
    
    register(userName: string): Promise<ContractTransaction>;
    
    // View functions
    betIdToBet(betId: bigint): Promise<Bet>;
    
    betIdToPredictions(arg0: bigint, arg1: bigint): Promise<Prediction>;
    
    getBetInformation(betId: bigint): Promise<Bet>;
    
    getUserInformation(): Promise<UserInformation>;
    
    users(arg0: string): Promise<UserInformation>;
  }