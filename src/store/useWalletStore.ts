import { create } from "zustand";
import { ethers } from "ethers";
import config from "../config";

interface WalletState {
  account: string | null;
  networkName: string;
  networkChainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  error: Error | null;
  isOnCorrectNetwork: boolean;
  isEthereumAvailable: boolean;
  connectWallet: () => Promise<void>;
  switchNetwork: (chainId: string | bigint) => Promise<boolean | undefined>;
  checkConnection: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => {
  const isEthereumAvailable =
      typeof window !== "undefined" && !!window.ethereum;

  const subscribeToWalletEvents = (provider: ethers.BrowserProvider) => {
    if (isEthereumAvailable) {
      window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        await get().connectWallet();
      });

      window.ethereum.on("chainChanged", async (_chainId: string) => {
        await get().connectWallet();
      });
    }
  };

  const connectWallet = async () => {
    if (isEthereumAvailable) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum, "any");
        const accounts = await provider.send("eth_requestAccounts", []);
        subscribeToWalletEvents(provider);
        const network = await provider.getNetwork();
        const signer = await provider.getSigner();
        const networkChainId = Number(network.chainId);
        set({
          provider,
          signer,
          account: accounts[0],
          networkName: network.name,
          networkChainId,
          isOnCorrectNetwork:
              networkChainId === Number(config.networkId) && accounts.length > 0,
          error: null,
        });
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        set({ error: error as Error, isOnCorrectNetwork: false });
      }
    } else {
      alert(
          "Ethereum wallet not found, install MetaMask or other browser wallet."
      );
    }
  };

  const switchNetwork =  async (chainId: string | bigint): Promise<boolean | undefined> => {
    try {
      const formattedChainId = ethers.toQuantity(chainId);
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: formattedChainId }],
      });
      await get().connectWallet();
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          const networkParams = {
            chainId: ethers.toQuantity(config.networkId),
            chainName: config.networkName,
            nativeCurrency: {
              name: config.currencyName,
              symbol: config.currencySymbol,
              decimals: 18,
            },
            rpcUrls: [config.rpcUrl],
          };
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [networkParams],
          });
          await get().connectWallet();
          return true;
        } catch (addError) {
          console.error("Error adding new network:", addError);
          set({ error: addError as Error, isOnCorrectNetwork: false });
        }
      } else {
        console.error("Error switching networks:", error);
        set({ error: error as Error, isOnCorrectNetwork: false });
      }
      return false;
    }
  };

  const checkConnection = async () => {
    if (isEthereumAvailable) {
      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        await connectWallet();
      }
    }
  };

  return {
    account: null,
    networkName: "",
    networkChainId: null,
    provider: null,
    signer: null,
    error: null,
    isOnCorrectNetwork: false,
    isEthereumAvailable,
    connectWallet,
    switchNetwork,
    checkConnection
  };
});