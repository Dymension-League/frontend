import { ethers } from "ethers";
import { useWalletStore } from "../../store/useWalletStore";
import GameLeagueArtifact from "../../artifacts/contracts/GameLeague.json";
import config from "../../config";

const gameLeagueAbi = GameLeagueArtifact.abi;

interface TeamInfo {
    teamIds: number[];
    teamNames: string[];
    tokenIndexes: number[][];
}

const useGameLeagueService = () => {
    const { signer, account, provider } = useWalletStore();

    const getContract = (signerOrProvider?: ethers.Signer | ethers.Provider | null) => {
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
            config.gameLeagueAddress,
            gameLeagueAbi,
            contractSigner
        );
    };

    const createTeam = async (nftIds: number[], teamName: string) => {
        const contract = getContract(signer);
        return contract.createTeam(nftIds, teamName);
    };

    const getTokensByID = async (tokenId: number): Promise<string> => {
        return "token";
    }

    const getTeamsByOwner = async (owner: string): Promise<TeamInfo> => {
        try {
            const contract = getContract(provider);
            console.log("Calling getTeamsByOwner with owner address:", owner);

            // Ensure the owner is a valid address
            if (!ethers.isAddress(owner)) {
                throw new Error("Invalid owner address");
            }

            const [teamIds, teamNames, tokenIndexes] = await contract.getTeamsByOwner(owner);

            console.log("getTeamsByOwner result:", {
                teamIds,
                teamNames,
                tokenIndexes,
            });

            return { teamIds, teamNames, tokenIndexes };
        } catch (error) {
            console.error("Error in getTeamsByOwner:", error);
            throw new Error("Failed to fetch teams by owner.");
        }
    };



    const enrollToLeague = async (teamId: number) => {
        const contract = getContract(signer);
        return contract.enrollToLeague(teamId);
    };

    const placeBet = async (leagueId: number, teamId: number, amount: ethers.BigNumberish) => {
        const contract = getContract(signer);
        return contract.placeBet(leagueId, teamId, amount);
    };

    const getTeam = async (teamId: number) => {
        const contract = getContract();
        return contract.getTeam(teamId);
    };

    const initializeLeague = async (value: number) => {
        const contract = getContract(signer);
        return contract.initializeLeague({ value: ethers.parseEther(value.toString()) });
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
    };
};

export default useGameLeagueService;