import { ethers } from "ethers";
import { useWalletStore } from "../../store/useWalletStore";
import { CosmoShips } from "../../artifacts/contracts/contracts";
import tokenData from "../../artifacts/proofs/proofs_0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28.json";
import config from "../../config";

const cosmoShipsAbi = CosmoShips!.abi;

const useMintService = () => {
  const { signer, account, networkChainId } = useWalletStore();

  const mintTokens = async (numberOfShips: number) => {
    if (!signer || !account || !networkChainId) {
      alert("Wallet not connected or missing required information");
      return;
    }

    const contract = new ethers.Contract(
      config.contractAddress,
      cosmoShipsAbi,
      signer,
    );

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

      await tx.wait();
      alert(`Successfully minted ${numberOfShips} ship(s)!`);
    } catch (error) {
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = (error as { message: string }).message;
      }

      alert(`Failed to mint ships: ${errorMessage}`);
      console.error("Mint error details:", JSON.stringify(error, null, 2));
    }
  };

  return { mintTokens };
};

export default useMintService;
