import { Contract } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Signer } from "ethers";

export function getContract<T = Contract>(
  address: string,
  abi: any,
  providerOrSigner: Provider | Signer
): T {
  return new Contract(address, abi, providerOrSigner) as unknown as T;
}
