import { ethers } from "ethers";
import { useWalletStore } from "../../store/useWalletStore";
import { CosmoShips } from "../../artifacts/contracts/contracts";
import cosmoShipsArtifact from "../../artifacts/contracts/CosmoShips.json";
import tokenData from "../../artifacts/proofs/proofs_0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28.json";
import config from "../../config";

const cosmoShipsAbi = cosmoShipsArtifact.abi;

const useMintService = () => {
  const { signer, account, networkChainId } = useWalletStore();

  const mintTokens = async (tokenId: number, numberOfShips: number, notify: (message: string, type: 'success' | 'error') => void) => {
    if (!signer || !account || !networkChainId) {
      notify("Wallet not connected or missing required information", 'error');
      return;
    }

    const tokenInfo = tokenData.find((token) => token.tokenId === tokenId);
    if (!tokenInfo) {
      notify("Token data not found", 'error');
      return;
    }

    const { value, proof } = tokenInfo;

    const contract = new ethers.Contract(
        config.contractAddress,
        cosmoShipsAbi,
        signer
    );

    try {
      // TODO: Revert to batch minting
      // const startTokenId = await contract.nextTokenIdToMint();
      // const attributes: number[] = [];
      // const proofs: string[][] = [];
      //
      // for (let i = 0; i < numberOfShips; i++) {
      //   const tokenId = Number(startTokenId) + i;
      //
      //   const tokenInfo = tokenData.find((token) => token.tokenId === tokenId);
      //
      //   if (!tokenInfo) {
      //     throw new Error(
      //         `Token data not found for tokenId: ${tokenId.toString()}`,
      //     );
      //   }
      //
      //   attributes.push(tokenInfo.value);
      //   proofs.push(tokenInfo.proof);
      // }
      //
      // const totalPrice = BigInt(config.mintPrice) * BigInt(numberOfShips);
      //
      // const tx = await contract.batchMint(attributes, proofs, numberOfShips, {
      //   value: totalPrice,
      // });
      const tx = await contract.mint(tokenId, value, proof, {
        value: config.mintPrice,
      });
      await tx.wait();
      notify("Mint successful!", 'success');
    } catch (error) {
      if (error instanceof Error) {
        notify(`Mint failed: ${error.message}`, 'error');
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        notify(`Mint failed: ${(error as { message: string }).message}`, 'error');
      } else {
        notify("Mint failed for an unknown reason", 'error');
      }

      if (typeof error === 'object' && error !== null) {
        console.log("Error details:", JSON.stringify(error, null, 2));
      }
    }
  };

  return { mintTokens };
};

export default useMintService;
