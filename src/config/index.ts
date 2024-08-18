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
  mintAddress: validateAddress(process.env.REACT_APP_COSMOSHIPS_ADDRESS, "Mint contract"),
  gameLeagueAddress: validateAddress(process.env.REACT_APP_GAME_LEAGUE_ADDRESS, "Game League contract"),
  mintPrice: ethers.parseEther(process.env.REACT_APP_MINT_PRICE || "0"),
};
//
// if (process.env.NODE_ENV === "development") {
//   config = {
//     networkId: BigInt(Number(process.env.REACT_APP_NETWORK_ID) || 0),
//     networkName: process.env.REACT_APP_NETWORK_NAME || "",
//     currencyName: process.env.REACT_APP_CURRENCY_NAME || "",
//     currencySymbol: process.env.REACT_APP_CURRENCY_SYMBOL || "",
//     rpcUrl: process.env.REACT_APP_RPC_URL || "",
//     mintAddress: validateAddress(process.env.REACT_APP_COSMOSHIPS_ADDRESS, "Mint contract"),
//     gameLeagueAddress: validateAddress(process.env.REACT_APP_GAME_LEAGUE_ADDRESS, "Game League contract"),
//     mintPrice: ethers.parseEther(process.env.REACT_APP_MINT_PRICE || "0"),};
// }

console.log("Config loaded:", {
  ...config,
  mintAddress: config.mintAddress,
  gameLeagueAddress: config.gameLeagueAddress,
});

export default config;