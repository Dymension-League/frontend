import { InterfaceAbi } from "ethers";

interface ContractABI {
  abi: InterfaceAbi;
  bytecode: string;
}

let GameLeague: ContractABI | null = require("./GameLeague.json");
let CosmoShips: ContractABI | null = require("./CosmoShips.json");

if (process.env.REACT_APP_LOCAL_GAMELEAGUE_ADDRESS) {
  try {
    CosmoShips = require("./LocalCosmoShips.json");
    GameLeague = require("./LocalGameLeague.json");
  } catch (error) {
    console.warn(
      "Failed to load load contract artifacts. Falling back to project defaults.",
      error,
    );
  }
}

console.log(JSON.stringify(GameLeague?.abi, null, 2))
console.log("Loaded contract artifacts:", { CosmoShips, GameLeague });
export { CosmoShips, GameLeague };
