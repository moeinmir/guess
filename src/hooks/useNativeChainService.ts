// hooks/useNativeChain.ts
import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { getNativeChainService } from "../utils/getNativeChainService";
import type { NativeChainServiceInterface } from "../interfaces/NativeChainServiceInterface";

const useNativeChainService = (): NativeChainServiceInterface | null => {
  const { provider, account } = useWeb3React();

  return useMemo(() => {
    if (!provider) return null;
    return getNativeChainService(provider, account);
  }, [provider, account]);
};

export default useNativeChainService;
