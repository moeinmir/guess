import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import type { Provider } from "@ethersproject/providers";
import type { Signer } from "ethers";
import { getContract } from "../utils/getContract"; 

const useContractWithABI = <T>(
  address: string | undefined,
  abi: any
): T | null => {
  const { provider, account } = useWeb3React();

  return useMemo(() => {
    if (!address || !abi || !provider) return null;

    try {
      const signerOrProvider: Signer | Provider =
        account && provider.getSigner ? provider.getSigner(account) : provider;

      return getContract<T>(address, abi, signerOrProvider);
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, abi, provider, account]);
};

export default useContractWithABI;
