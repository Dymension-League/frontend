import { ethers } from "ethers";
import { useWalletStore } from "../../store/useWalletStore";
import { CosmoShips } from "../../artifacts/contracts/contracts";
import tokenData from "../../artifacts/proofs/proofs_0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28.json";
import config from "../../config";

const cosmoShipsAbi = CosmoShips!.abi;

const useMintService = () => {
  const { signer, account, networkChainId, provider } = useWalletStore();

  const getContract = (
    signerOrProvider?: ethers.Signer | ethers.Provider | null,
  ) => {
    let contractSigner: ethers.Signer | ethers.Provider;

    if (signerOrProvider) {
      contractSigner = signerOrProvider;
    } else if (signer) {
      contractSigner = signer;
    } else if (provider) {
      contractSigner = provider;
    } else {
      throw new Error("Wallet not connected: No signer or provider available");
    }

    return new ethers.Contract(
      config.mintAddress,
      cosmoShipsAbi,
      contractSigner,
    );
  };

  const isTokenMinted = async (tokenId: number): Promise<boolean> => {
    const contract = getContract(provider);
    try {
      await contract.ownerOf(tokenId);
      return true;
    } catch {
      return false;
    }
  };

  const getContractMintPrice = async (): Promise<bigint> => {
    const contract = getContract(provider);
    return await contract.mintPrice();
  };

  const mintTokens = async (
    numberOfShips: number,
    notify: (message: string, type: "success" | "error") => void,
  ) => {
    if (!signer || !account || !networkChainId) {
      notify("Wallet not connected or missing required information", "error");
      return;
    }
    const contract = getContract(signer);

    try {
      const startTokenId = await contract.nextTokenIdToMint();

      const attributes: number[] = [];
      const proofs: string[][] = [];

      for (let i = 0; i < numberOfShips; i++) {
        const tokenId = Number(startTokenId) + i;

        const tokenInfo = tokenData.find((token) => token.tokenId === tokenId);

        if (!tokenInfo) {
          throw new Error(
            `Token data not found for tokenId: ${tokenId.toString()}`,
          );
        }

        attributes.push(tokenInfo.value);
        proofs.push(tokenInfo.proof);
      }
      const totalPrice = BigInt(config.mintPrice) * BigInt(numberOfShips);

      const tx = await contract.batchMint(attributes, proofs, numberOfShips, {
        value: totalPrice,
      });
      // // Check if token is already minted
      // if (await isTokenMinted(tokenId)) {
      //   notify("This token ID has already been minted.", 'error');
      //   return;
      // }

      // Verify mint price
      // const contractMintPrice = await getContractMintPrice();
      // if (contractMintPrice.toString() !== config.mintPrice.toString()) {
      //   notify(`Incorrect mint price. Expected: ${ethers.formatEther(contractMintPrice)} ETH, Actual: ${ethers.formatEther(config.mintPrice)} ETH`, 'error');
      //   return;
      // }

      // const tx = await contract.mint(tokenId, value, proof, {
      //   value: config.mintPrice,
      // });
      await tx.wait();
      // notify("Mint successful!", 'success');
    } catch (error: any) {
      console.error("Mint error:", error);
      if (error.error && error.error.data && error.error.data.message) {
        notify(`Mint failed: ${error.error.data.message}`, "error");
      } else if (error.reason) {
        notify(`Mint failed: ${error.reason}`, "error");
      } else {
        notify(`Mint failed: ${error.message || "Unknown error"}`, "error");
      }
      console.log("Error details:", JSON.stringify(error, null, 2));
    }
  };

  const getTokenIdsByOwner = async (
    ownerAddress: string,
  ): Promise<number[]> => {
    const contract = getContract(provider);
    const balance = await contract.balanceOf(ownerAddress);
    const tokenIds = [];
    for (let index = 0; index < Number(balance); index++) {
      const tokenId = await contract.tokenOfOwnerByIndex(ownerAddress, index);
      tokenIds.push(Number(tokenId));
    }
    return tokenIds;
  };

  const setApproveForAll = async (
    operator: string,
    approved: boolean,
    notify: (message: string, type: "success" | "error") => void,
  ): Promise<void> => {
    if (!signer) {
      notify("Wallet not connected", "error");
      return;
    }
    const contract = getContract(signer);
    try {
      const tx = await contract.setApprovalForAll(operator, approved);
      await tx.wait();
      notify("Approval set successfully", "success");
    } catch (error) {
      handleError(error, notify);
    }
  };

  const handleError = (
    error: any,
    notify: (message: string, type: "success" | "error") => void,
  ) => {
    if (error instanceof Error) {
      notify(`Operation failed: ${error.message}`, "error");
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      notify(
        `Operation failed: ${(error as { message: string }).message}`,
        "error",
      );
    } else {
      notify("Operation failed for an unknown reason", "error");
    }

    if (typeof error === "object" && error !== null) {
      console.log("Error details:", JSON.stringify(error, null, 2));
    }
  };

  return {
    mintTokens,
    getTokenIdsByOwner,
    setApproveForAll,
    isTokenMinted,
    getContractMintPrice,
  };
};

export default useMintService;
