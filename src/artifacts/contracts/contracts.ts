import { InterfaceAbi } from "ethers";

interface ContractABI {
  abi: InterfaceAbi;
  bytecode: string;
}

let GameLeague: ContractABI | null = require("./GameLeague.json");
let CosmoShips: ContractABI | null = require("./CosmoShips.json");

if (process.env.REACT_APP_LOCAL_GAMELEAGUE_ADDRESS) {
  try {
    CosmoShips = require("./CosmoShips.json");
    GameLeague = require("./GameLeague.json");
  } catch (error) {
    console.warn(
      "Failed to load load contract artifacts. Falling back to project defaults.",
      error,
    );
  }
}

export { CosmoShips, GameLeague };
