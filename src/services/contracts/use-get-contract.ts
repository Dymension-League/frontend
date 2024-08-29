import { useCallback } from "react";
import { BrowserProvider, ethers, Signer } from "ethers";
import { useWalletStore } from "../../store/useWalletStore";

const useGetContract = (address: string, abi: ethers.InterfaceAbi) => {
  const { signer, provider } = useWalletStore();

  const getContract = useCallback(
    (signerOrProvider: Signer | BrowserProvider | null = null) => {
      let contractSigner;

      if (signerOrProvider) {
        contractSigner = signerOrProvider;
      } else if (signer) {
        contractSigner = signer;
      } else if (provider) {
        contractSigner = provider;
      } else {
        throw new Error(
          "Wallet not connected: No signer or provider available",
        );
      }

      return new ethers.Contract(address, abi, contractSigner);
    },
    [signer, provider, address, abi], // Dependencies for the callback
  );

  return { getContract };
};

export default useGetContract;
