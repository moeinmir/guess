import { BigNumber, ContractTransaction } from "ethers";

export interface TestNumberStorageContractInterface {
  retrieve: () => Promise<BigNumber>;
  store: (num: BigNumber | number) => Promise<ContractTransaction>;
}