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
      feePercentage: bigint
    ): Promise<ContractTransaction>;
    
    betOn(
      betId: bigint,
      guess: bigint,
    ): Promise<ContractTransaction>;
    
    getNextBetId() : Promise<bigint>

    adminAddress(): Promise<string>;

    changeAdmin(newAdminAddress: string): Promise<ContractTransaction>;
    
    changeFeeReceiverAddress(newFeeReceiverAddress: string): Promise<ContractTransaction>;
    
    changeOperator(newOperatorAddress: string): Promise<ContractTransaction>;
    
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