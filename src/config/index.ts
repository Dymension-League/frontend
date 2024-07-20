import { ethers } from "ethers";

const config = {
  networkId: BigInt(Number(process.env.REACT_APP_NETWORK_ID)),
  networkName: process.env.REACT_APP_NETWORK_NAME || "",
  currencyName: process.env.REACT_APP_CURRENCY_NAME || "",
  currencySymbol: process.env.REACT_APP_CURRENCY_SYMBOL || "",
  rpcUrl: process.env.REACT_APP_RPC_URL || "",
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || "",
  mintPrice: ethers.parseEther(process.env.REACT_APP_MINT_PRICE || "0"),
};

export default config;