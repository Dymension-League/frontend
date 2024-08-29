import { ethers } from "ethers";

const validateAddress = (address: string | undefined, name: string): string => {
  if (!address) {
    throw new Error(`${name} address is not set in environment variables.`);
  }
  if (!ethers.isAddress(address)) {
    throw new Error(`Invalid ${name} address in configuration: ${address}`);
  }
  return address;
};

let config = {
  networkId: BigInt(Number(process.env.REACT_APP_NETWORK_ID) || 0),
  networkName: process.env.REACT_APP_NETWORK_NAME || "",
  currencyName: process.env.REACT_APP_CURRENCY_NAME || "",
  currencySymbol: process.env.REACT_APP_CURRENCY_SYMBOL || "",
  rpcUrl: process.env.REACT_APP_RPC_URL || "",
  mintAddress: process.env.REACT_APP_COSMOSHIPS_ADDRESS || '',
  gameLeagueAddress: process.env.REACT_APP_GAME_LEAGUE_ADDRESS || '',
  mintPrice: ethers.parseEther(process.env.REACT_APP_MINT_PRICE || "0"),
  ipfsGateway: process.env.REACT_APP_IPFS_GATEWAY || "https://ipfs.io/ipfs/",
};

if (
  process.env.REACT_APP_LOCAL_COSMOSHIPS_ADDRESS &&
  process.env.REACT_APP_LOCAL_GAMELEAGUE_ADDRESS
) {
  config = {
    networkId: BigInt(Number(31337)),
    networkName: "Anvil",
    currencyName: "Ether",
    currencySymbol: "ETH",
    rpcUrl: "http://127.0.0.1:8545",
    mintAddress: process.env.REACT_APP_LOCAL_COSMOSHIPS_ADDRESS || "",
    mintPrice: ethers.parseEther(process.env.REACT_APP_MINT_PRICE || "0"),
    gameLeagueAddress: process.env.REACT_APP_LOCAL_GAMELEAGUE_ADDRESS || "",
    ipfsGateway: process.env.REACT_APP_IPFS_GATEWAY || "https://ipfs.io/ipfs/",
  };
}
console.log("Config loaded:", {
  ...config,
  mintAddress: config.mintAddress,
  gameLeagueAddress: config.gameLeagueAddress,
});

export default config;
