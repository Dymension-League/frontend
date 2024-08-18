import { InterfaceAbi } from "ethers";

interface ContractABI {
  abi: InterfaceAbi;
  bytecode: string;
}

let GameLeague: ContractABI | null = require("./GameLeague.json");
let CosmoShips: ContractABI | null = require("./CosmoShips.json");

// if (process.env.NODE_ENV === "development") {
//   try {
//     CosmoShips = require("./LocalCosmoShips.json");
//     GameLeague = require("./LocalGameLeague.json");
//   } catch (error) {
//     console.warn(
//       "Failed to load contract artifacts in development mode. Falling back to project defaults.",
//       error,
//     );
//   }
// }

export { CosmoShips, GameLeague };
