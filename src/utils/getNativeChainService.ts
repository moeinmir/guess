// utils/getNativeChainService.ts
import { Web3Provider } from "@ethersproject/providers";
import { utils } from "ethers";
import type { NativeChainServiceInterface } from "../interfaces/NativeChainServiceInterface";

export const getNativeChainService = (
  provider: Web3Provider,
  account?: string | null
): NativeChainServiceInterface => {
  return {
    async getBalance(address: string) {
      const balance = await provider.getBalance(address);
      return utils.formatEther(balance);
    },

    async sendNativeCurrency(to: string, amountEth: string) {
      if (!account) throw new Error("No connected account");

      const signer = provider.getSigner(account);
      const tx = await signer.sendTransaction({
        to,
        value: utils.parseEther(amountEth),
      });
      return tx.hash;
    },

    async getLatestBlockTimestamp() {
      const block = await provider.getBlock("latest");
      return block.timestamp;
    },
  };
};

