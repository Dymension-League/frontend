import { ethers } from "ethers";

let config = {
  networkId: BigInt(Number(process.env.REACT_APP_NETWORK_ID)),
  networkName: process.env.REACT_APP_NETWORK_NAME || "",
  currencyName: process.env.REACT_APP_CURRENCY_NAME || "",
  currencySymbol: process.env.REACT_APP_CURRENCY_SYMBOL || "",
  rpcUrl: process.env.REACT_APP_RPC_URL || "",
  contractAddress: process.env.REACT_APP_COSMOSHIPS_ADDRESS || "",
  mintPrice: ethers.parseEther(process.env.REACT_APP_MINT_PRICE || "0"),
};

if (process.env.NODE_ENV === "development") {
  config = {
    networkId: BigInt(Number(31337)),
    networkName: "Anvil",
    currencyName: "Ether",
    currencySymbol: "ETH",
    rpcUrl: "http://127.0.0.1:8545",
    contractAddress: process.env.REACT_APP_LOCAL_CONTRACT_ADDRESS || "",
    mintPrice: ethers.parseEther(process.env.REACT_APP_MINT_PRICE || "0"),
  };
}

export default config;

