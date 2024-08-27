import { ethers } from "ethers";
import { useWalletStore } from "../../store/useWalletStore";
import { CosmoShips } from "../../artifacts/contracts/contracts";
import tokenData from "../../artifacts/proofs/proofs_0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28.json";
import config from "../../config";
import imageCacheService from "../ImageCacheService";

const cosmoShipsAbi = CosmoShips!.abi;
const IPFS_GATEWAY = config.ipfsGateway;
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000;

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

  let cachedTokenIds: { [address: string]: number[] } = {};

  const getTokenIdsByOwner = async (
    ownerAddress: string,
  ): Promise<number[]> => {
    if (cachedTokenIds[ownerAddress]) {
      console.log(`Returning cached token IDs for account ${ownerAddress}`);
      return cachedTokenIds[ownerAddress];
    }

    const contract = getContract(provider);
    const balance = await contract.balanceOf(ownerAddress);
    const tokenIds = [];
    for (let index = 0; index < Number(balance); index++) {
      const tokenId = await contract.tokenOfOwnerByIndex(ownerAddress, index);
      tokenIds.push(Number(tokenId));
    }

    cachedTokenIds[ownerAddress] = tokenIds;
    return tokenIds;
  };

  const getTokenMetadata = async (tokenId: number): Promise<any> => {
    const contract = getContract(provider);
    try {
      const tokenURI = await contract.tokenURI(tokenId);
      console.log(`Token URI for token ID ${tokenId}: ${tokenURI}`);

      // Check if the tokenURI is a valid URL
      try {
        new URL(tokenURI);
      } catch (e) {
        console.error(`Invalid token URI for token ID ${tokenId}: ${tokenURI}`);
        throw new Error(`Invalid token URI: ${tokenURI}`);
      }

      const response = await fetch(tokenURI);
      const contentType = response.headers.get("content-type");

      console.log(`Response for token ID ${tokenId}:`, {
        status: response.status,
        contentType,
        url: response.url,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch metadata from URI: ${tokenURI}. Status: ${response.status}`,
        );
      }

      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        const text = await response.text();
        console.error(
          `Unexpected content type: ${contentType}. Response:`,
          text,
        );
        throw new Error(`Unexpected content type: ${contentType}`);
      }
    } catch (error) {
      console.error(
        `Error fetching token metadata for token ID ${tokenId}:`,
        error,
      );
      throw error;
    }
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

  // const convertIPFSUrl = (url: string): string => {
  //   if (url.startsWith('https://ipfs.io/ipfs/')) {
  //     return url;
  //   }
  //   const path = url.split('/').slice(-2).join('/');
  //   return `https://ipfs.io/ipfs/${path}`;
  // };

  const convertIPFSUrl = (url: string): string => {
    if (url.startsWith("https://ipfs.io/ipfs/")) {
      return url;
    }
    // Otherwise, parse the URL and format it correctly.
    const path = url.split("/").slice(-2).join("/");
    return `https://ipfs.io/ipfs/${path}`;
  };

  const getIPFSTokenMetadata = async (tokenId: number): Promise<any> => {
    const cacheKey = `metadata-${tokenId}`;
    const cachedMetadata = await imageCacheService.getCachedImage(cacheKey);
    if (cachedMetadata) {
      return JSON.parse(cachedMetadata);
    }

    try {
      const url = `${IPFS_GATEWAY}${tokenId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch metadata for token ID ${tokenId}. Status: ${response.status}`,
        );
      }

      const metadata = await response.json();
      const imgUrl = convertIPFSUrl(metadata.image || "");

      const tokenMetadata = {
        id: tokenId,
        name: metadata.name || `CosmoShip #${tokenId}`,
        img: imgUrl,
        type:
          metadata.attributes.find((attr: any) => attr.trait_type === "Type")
            ?.value || "Unknown",
        model:
          metadata.attributes.find((attr: any) => attr.trait_type === "Model")
            ?.value || "Unknown",
        color:
          metadata.attributes.find((attr: any) => attr.trait_type === "Color")
            ?.value || "Unknown",
        tool:
          metadata.attributes.find((attr: any) => attr.trait_type === "Tool")
            ?.value || "Unknown",
        capacity:
          Number(
            metadata.attributes.find(
              (attr: any) => attr.trait_type === "Capacity",
            )?.value,
          ) || 0,
        attack:
          Number(
            metadata.attributes.find(
              (attr: any) => attr.trait_type === "Attack",
            )?.value,
          ) || 0,
        speed:
          Number(
            metadata.attributes.find((attr: any) => attr.trait_type === "Speed")
              ?.value,
          ) || 0,
        shield:
          Number(
            metadata.attributes.find(
              (attr: any) => attr.trait_type === "Shield",
            )?.value,
          ) || 0,
      };

      // Cache the metadata
      await imageCacheService.setCachedImage(
        cacheKey,
        JSON.stringify(tokenMetadata),
      );

      return tokenMetadata;
    } catch (error) {
      console.error(
        `Error fetching IPFS metadata for token ID ${tokenId}:`,
        error,
      );
      throw error;
    }
  };

  const getIPFSTokenMetadataBatch = async (
    tokenIds: number[],
  ): Promise<any[]> => {
    const metadataPromises = tokenIds.map((tokenId) =>
      getIPFSTokenMetadata(tokenId),
    );
    return Promise.all(metadataPromises);
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
    getTokenMetadata,
    getIPFSTokenMetadata,
    getIPFSTokenMetadataBatch,
    convertIPFSUrl,
  };
};

export default useMintService;
