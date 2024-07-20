import { ethers } from "ethers";
import { useWalletStore } from "../../store/useWalletStore";
import cosmoShipsArtifact from "../../artifacts/contracts/CosmoShips.json";
import tokenData from "../../artifacts/proofs/proofs_0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28.json";
import config from "../../config";

const cosmoShipsAbi = cosmoShipsArtifact.abi;

const useMintService = () => {
  const { signer, account, networkChainId } = useWalletStore();

  const mintTokens = async (tokenId: number) => {
    if (!signer || !account || !networkChainId) {
      alert("Wallet not connected or missing required information");
      return;
    }

    const tokenInfo = tokenData.find((token) => token.tokenId === tokenId);
    if (!tokenInfo) {
      throw new Error("Token data not found");
    }

    const { value, proof } = tokenInfo;

    const contract = new ethers.Contract(
      config.contractAddress,
      cosmoShipsAbi,
      signer
    );

    try {
      const tx = await contract.mint(tokenId, value, proof, {
        value: config.mintPrice,
      });
      await tx.wait();
      alert("Mint successful!");
    } catch (error) {
      console.error(error);
      alert("Mint failed!");
    }
  };

  return { mintTokens };
};

export default useMintService;
