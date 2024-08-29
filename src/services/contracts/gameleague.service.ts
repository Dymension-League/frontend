import { ethers } from "ethers";
import { useWalletStore } from "../../store/useWalletStore";
import { GameLeague } from "../../artifacts/contracts/contracts";
import config from "../../config";
import useGetContract from "./use-get-contract";

const gameLeagueAbi = GameLeague!.abi;

interface TeamInfo {
  teamIds: number[];
  teamNames: string[];
  tokenIndexes: number[][];
}

export interface ILeagueState {
  IDLE: bigint;
  INITIATED: bigint;
  ENROLLMENT_CLOSED: bigint;
  BETS_OPEN: bigint;
  RUNNING: bigint;
  DISTRIBUTION: bigint;
  CONCLUDED: bigint;
}

export const LeagueState: ILeagueState = {
  IDLE: BigInt(0),
  INITIATED: BigInt(1),
  ENROLLMENT_CLOSED: BigInt(2),
  BETS_OPEN: BigInt(3),
  RUNNING: BigInt(4),
  DISTRIBUTION: BigInt(5),
  CONCLUDED: BigInt(6),
};

export interface League {
  id: number;
  enrolledTeams: number[];
  state: ILeagueState;
  prizePool: number;
  totalBetsInLeague: number;
}

const useGameLeagueService = () => {
  const { signer, provider } = useWalletStore();

  const { getContract } = useGetContract(
    config.gameLeagueAddress,
    gameLeagueAbi,
  );

  const createTeam = async (nftIds: number[], teamName: string) => {
    const contract = getContract(signer);
    return contract.createTeam(nftIds, teamName);
  };

  const getCurrentLeague = async () => {
    const contract = getContract();
    return contract.getLeague(await contract.currentLeagueId());
  };

  const getTeamsByOwner = async (owner: string): Promise<TeamInfo> => {
    try {
      const contract = getContract(provider);
      console.log("Calling getTeamsByOwner with owner address:", owner);

      // Ensure the owner is a valid address
      if (!ethers.isAddress(owner)) {
        throw new Error("Invalid owner address");
      }

      const [teamIdResults, teamNamesResult, tokenIndexesResult] =
        await contract.getTeamsByOwner(owner);

      const ownerTeams = {
        teamIds: [...teamIdResults],
        teamNames: [...teamNamesResult],
        tokenIndexes: [...tokenIndexesResult.map((a: unknown[]) => [...a])],
      };
      console.log("getTeamsByOwner result:", ownerTeams);

      return ownerTeams;
    } catch (error) {
      console.error("Error in getTeamsByOwner:", error);
      throw new Error("Failed to fetch teams by owner.");
    }
  };

  const enrollToLeague = async (teamId: number) => {
    const contract = getContract(signer);
    return contract.enrollToLeague(teamId);
  };

  const placeBet = async (leagueId: number, teamId: number, amount: number) => {
    const contract = getContract(signer);
    const leagueIdBigInt = BigInt(leagueId);
    const teamIdBigInt = BigInt(teamId);
    console.log("what the fuck");
    const amountInWei = ethers.parseEther(amount.toString());
    console.log("what the fuck afer");
    try {
      console.log(
        "types",
        typeof leagueIdBigInt,
        typeof teamIdBigInt,
        typeof amountInWei,
      );
      const tx = await contract.placeBet(leagueIdBigInt, teamIdBigInt, {
        value: amountInWei,
      });
      console.log("placeBet transaction sent:", tx);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction mined. Receipt:", receipt);

      return receipt;
    } catch (error: any) {
      console.error("Error in placeBet:", error);
      if (error.reason) {
        console.error("Error reason:", error.reason);
      }
      if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
        console.error(
          "Transaction reverted. Check contract state and parameters.",
        );
      }
      throw error;
    }
  };

  const getTeam = async (teamId: number) => {
    const contract = getContract();
    return contract.getTeam(teamId);
  };

  const initializeLeague = async (value: number) => {
    const contract = getContract(signer);
    return contract.initializeLeague({
      value: ethers.parseEther(value.toString()),
    });
  };

  const getLeague = async (leagueId: number) => {
    const contract = getContract();
    return contract.getLeague(leagueId);
  };

  const isTeamEnrolled = async (teamId: number, leagueId: number) => {
    const contract = getContract();
    return contract.isTeamEnrolled(teamId, leagueId);
  };

  const endEnrollmentAndStartBetting = async () => {
    const contract = getContract(signer);
    return contract.endEnrollmentAndStartBetting();
  };

  const getUserBets = async (leagueId: number, user: string) => {
    const contract = getContract();
    return contract.getUserBets(leagueId, user);
  };

  const endBettingAndStartGame = async (leagueId: number) => {
    const contract = getContract(signer);
    return contract.endBettingAndStartGame(leagueId);
  };

  const setupMatches = async (seed: number) => {
    const contract = getContract(signer);
    return contract.setupMatches(seed);
  };

  const determineMatchOutcome = async (leagueId: number, gameId: number) => {
    const contract = getContract(signer);
    return contract.determineMatchOutcome(leagueId, gameId);
  };

  const runGameLeague = async () => {
    const contract = getContract(signer);
    return contract.runGameLeague();
  };

  const getEnrolledTeams = async () => {
    const contract = getContract();
    return contract.getEnrolledTeams();
  };

  return {
    createTeam,
    getTeamsByOwner,
    enrollToLeague,
    placeBet,
    getTeam,
    initializeLeague,
    getLeague,
    isTeamEnrolled,
    endEnrollmentAndStartBetting,
    getUserBets,
    endBettingAndStartGame,
    setupMatches,
    determineMatchOutcome,
    runGameLeague,
    getEnrolledTeams,
    getCurrentLeague,
  };
};

export default useGameLeagueService;
