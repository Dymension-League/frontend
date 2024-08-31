import React, { useState, useEffect, useCallback } from "react";
import { useWalletStore } from "../../../../store/useWalletStore";
import useGameLeagueService, {
  League,
  LeagueState,
} from "../../../../services/contracts/gameleague.service";
import useMintService from "../../../../services/contracts/cosmoships.service";
import { fetchTokensWithMetadata } from "../CreateTeam/CreateTeamPage";
import TeamCard, { Ship, Team } from "../EnrollTeam/TeamCard";

interface Notification {
  message: string;
  type: "success" | "error";
}

const PlaceBet: React.FC = () => {
  const { account } = useWalletStore();
  const {
    getCurrentLeague,
    initializeLeague,
    placeBet,
    getTeam,
    getTeamsByOwner,
    enrollToLeague,
    endEnrollmentAndStartBetting,
  } = useGameLeagueService();
  const { getIPFSTokenMetadata } = useMintService();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [initiated, setInitiated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [league, setLeague] = useState<League | null>(null);
  const [bettingAllowed, setBettingAllowed] = useState<boolean>(false);

  const fetchLeagueAndTeams = useCallback(async () => {
    setInitiated(true);
    setIsLoading(true);
    try {
      const [id, state, prizePool, enrolledTeamsResult, totalBetsInLeague] =
        await getCurrentLeague();
      const enrolledTeams = [...enrolledTeamsResult];
      const leagueData = {
        id,
        enrolledTeams,
        state,
        prizePool,
        totalBetsInLeague,
      };
      setLeague(leagueData);

      if (leagueData.state === LeagueState.BETS_OPEN) {
        setBettingAllowed(true);
      } else {
        setBettingAllowed(false);
      }

      const teamDetails = await Promise.all(
        leagueData.enrolledTeams.map(async (teamId: number) => {
          const [teamName, nftIdResults] = await getTeam(teamId);
          const nftIds = [...nftIdResults];
          const tokensWithMetadata = await fetchTokensWithMetadata(
            nftIds,
            getIPFSTokenMetadata,
          );

          return {
            teamId: teamId,
            teamName,
            ships: tokensWithMetadata as Ship[],
          };
        }),
      );

      setTeams(teamDetails);
    } catch (error) {
      console.error("Error fetching league or teams:", error);
      notify("Failed to fetch league or team information.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentLeague, getIPFSTokenMetadata, getTeam]);

  useEffect(() => {
    if (account && !initiated) {
      fetchLeagueAndTeams();
    }
  }, [account, fetchLeagueAndTeams, initiated]);

  const notify = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleBet = async () => {
    if (!selectedTeam || betAmount <= 0 || !bettingAllowed) {
      notify("Invalid bet or betting is not allowed at this time.", "error");
      return;
    }

    try {
      await placeBet(league!.id, selectedTeam.teamId, betAmount);
      notify("Bet placed successfully!", "success");
      setBettingAllowed(false); // Disable betting after placing a bet
    } catch (error) {
      console.error("Error placing bet:", error);
      notify("Failed to place bet. Please try again.", "error");
    }
  };

  const handleInitializeLeague = async () => {
    if (!account) return;

    try {
      const { teamIds } = await getTeamsByOwner(account);
      if (teamIds.length === 0 || teamIds.length % 2 !== 0) {
        notify("You need an even number of teams to enroll.", "error");
        return;
      }

      await initializeLeague(0.1);
      notify("League initialized successfully!", "success");

      for (let i = 0; i < teamIds.length; i++) {
        await enrollToLeague(teamIds[i]);
      }
      notify("All teams enrolled successfully!", "success");
    } catch (error) {
      console.error("Error initializing league or enrolling teams:", error);
    }
  };

  const handleEndEnrollment = async () => {
    if (!account) return;

    try {
      await endEnrollmentAndStartBetting();
    } catch (error) {
      console.error("Error ending enrollment and starting betting:", error);
    }
  };

  const onSelectTeam = (teamId: number) => {
    const foundTeam = teams.find((team) => team.teamId === teamId);
    if (foundTeam) {
      setSelectedTeam(foundTeam);
      setBetAmount(0);
    }
  };

  if (isLoading) {
    return <div>Loading league and teams...</div>;
  }

  return (
    <section className="tf-section live-auctions">
      <div className="themesflat-container justify-content-center">
        {league && <h1>{`Place bet for League ${league.id}`}</h1>}
        <div className="row">
          {notification && (
            <div className="col-md-8 offset-md-2 text-center mt-3">
              <p className={`alert alert-${notification.type}`}>
                {notification.message}
              </p>
            </div>
          )}
        </div>
        {teams.length > 0 ? (
          teams.map((team, index) => (
            <div key={index} className="row mb-4 align-items-center">
              <div
                className={`col-md-12 p-4 mb-5 ${selectedTeam && selectedTeam.teamId === team.teamId ? "selected-card" : ""}`}
              >
                <TeamCard
                  containerClassName="col-md-12"
                  productClassName="mb-0"
                  onSelectTeam={onSelectTeam}
                  team={team}
                />
              </div>
              <div className="col-md-4 offset-md-3 d-flex justify-content-between align-items-center">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter bet amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  disabled={
                    (!bettingAllowed ||
                      selectedTeam?.teamId !== team.teamId) === true
                  }
                  style={{ width: "60%" }}
                />
                <button
                  onClick={handleBet}
                  className={`enroll-button ${(!bettingAllowed || betAmount <= 0 || selectedTeam?.teamId !== team.teamId) === true ? "disabled" : "enabled"}`}
                >
                  Place Bet
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-3">
            <p>No teams available for betting.</p>
          </div>
        )}
        <div className="row">
          <div className="col-md-8 offset-md-2 text-center mt-4">
            <button
              className="btn btn-secondary"
              onClick={handleInitializeLeague}
            >
              1. Initialize League TEST
            </button>
          </div>
          <div className="col-md-8 offset-md-2 text-center mt-3">
            <button className="btn btn-secondary" onClick={handleEndEnrollment}>
              2. End enrollment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaceBet;
