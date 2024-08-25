import React, { useState, useEffect, Fragment, useCallback } from "react";
import { useWalletStore } from "../../../../store/useWalletStore";
import useGameLeagueService, {
  League,
  LeagueState,
} from "../../../../services/contracts/gameleague.service";
import "./PlaceBet.css";
import spaceshipsData from "../../../../assets/space-ships/spaceships";
import imageCacheService from "../../../../services/ImageCacheService";

interface Cosmoship {
  id: number;
  name: string;
  type: string;
  model: string;
  color: string;
  tool: string;
  capacity: number;
  attack: number;
  speed: number;
  shield: number;
}
interface TeamInfo {
  id: number;
  name: string;
  cosmoships: Cosmoship[];
  owner: string;
}
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
    endBettingAndStartGame,
  } = useGameLeagueService();

  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [initiated, setInitiated] = useState<boolean>(false);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [league, setLeague] = useState<League | null>(null);
  const [bettingAllowed, setBettingAllowed] = useState<boolean>(false);

  const fetchLeagueAndTeams = useCallback(async () => {
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
          const [teamName, nftIdResults, teamOwner] = await getTeam(teamId);
          const nftIds = [...nftIdResults];
          const filteredSpaceships = spaceshipsData.filter((spaceship, idx) =>
            nftIds.includes(BigInt(idx)),
          );

          const images = filteredSpaceships.map((spaceship) => spaceship.img);
          const cachedImages = await imageCacheService.loadImages(images);
          const filteredSpaceshipsWithImage = filteredSpaceships.map(
            (spaceship) => {
              return {
                ...spaceship,
                image: cachedImages[0],
              };
            },
          );
          return {
            id: teamId,
            name: teamName,
            cosmoships: filteredSpaceshipsWithImage,
            owner: teamOwner,
          };
        }),
      );

      setTeams(teamDetails);
    } catch (error) {
      console.error("Error fetching league or teams:", error);
      notify("Failed to fetch league or team information.", "error");
    } finally {
      setInitiated(true);
    }
  }, [getCurrentLeague, getTeam]);

  useEffect(() => {
    if (account && !initiated) {
      fetchLeagueAndTeams();
    }
  }, [account, fetchLeagueAndTeams, getCurrentLeague, getTeam, initiated]);

  const notify = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleBet = async () => {
    console.log("handling bet");
    console.log(league!.id);
    console.log(selectedTeamId);
    console.log(betAmount);
    if (selectedTeamId === null) {
      notify("Please select a team.", "error");
      return;
    }

    if (betAmount <= 0) {
      notify("Please enter a valid bet amount.", "error");
      return;
    }

    if (!bettingAllowed) {
      notify("Betting is not allowed at this time.", "error");
      return;
    }

    try {
      await placeBet(league!.id, selectedTeamId, betAmount);
      notify("Bet placed successfully!", "success");
    } catch (error) {
      console.error("Error placing bet:", error);
      notify("Failed to place bet. Please try again.", "error");
    }
  };

  const handleInitializeLeague = async () => {
    if (!account) {
      return;
    }
    try {
      const { teamIds } = await getTeamsByOwner(account);

      if (teamIds.length === 0) {
        notify("No teams available for enrollment.", "error");
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
    if (!account) {
      return;
    }
    try {
      await endEnrollmentAndStartBetting();
    } catch (error) {
      console.error("Error initializing league or enrolling teams:", error);
    }
  };

  const renderStatsBar = (label: string, value: number) => (
    <div className="mb-2">
      <label>{label}</label>
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${(value / 10) * 100}%` }}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={10}
        >
          {value}/10
        </div>
      </div>
    </div>
  );

  console.log(bettingAllowed, "bettingAllowed");
  console.log(selectedTeamId, "selectedTeamId");
  console.log(betAmount, "betAmount");
  return (
    <Fragment>
      <section className="tf-section place-bet">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="tf-title pb-20">Place a Bet on a Team</h2>
            </div>
          </div>
          {league && (
            <div className="row">
              <div className="col-md-12 text-center mb-4">
                <h4 className="tf-title pb-20">{`League ${league.id}`}</h4>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-md-12">
              <div
                className="d-flex justify-content-center overflow-auto"
                style={{ whiteSpace: "nowrap" }}
              >
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <div
                      key={team.id}
                      className={`${
                        selectedTeamId === team.id
                          ? "border border-primary"
                          : ""
                      }`}
                    >
                      <div
                        className={`card team-card d-inline-block mx-2`}
                        onClick={() => setSelectedTeamId(team.id)}
                        style={{ width: "300px" }} // Adjust the width of each card
                      >
                        <div className="card-body p-3">
                          <h4 className="card-title text-center mb-5">
                            {team.name}
                          </h4>
                          {team.cosmoships.map((ship, index) => (
                            <div key={ship.id}>
                              <h6 className="text-center mt-2">{ship.name}</h6>
                              <div key={index} className="m-3">
                                {renderStatsBar("Capacity", ship.capacity)}
                                {renderStatsBar("Attack", ship.attack)}
                                {renderStatsBar("Speed", ship.speed)}
                                {renderStatsBar("Shield", ship.shield)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-3">
                    <p>No teams available for betting.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 offset-md-3 text-center mt-5">
              <input
                type="number"
                className="form-control-sm mb-3"
                placeholder="Enter bet amount"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                disabled={!bettingAllowed}
                style={{ width: "60%", display: "inline-block" }} // Smaller input
              />
            </div>
            <div className="col-md-6 offset-md-3 text-center">
              <button
                className={`btn btn-lg btn-primary place-bet-button ${
                  bettingAllowed ? "enabled" : "disabled"
                }`}
                onClick={handleBet}
                disabled={
                  !bettingAllowed || selectedTeamId === null || betAmount <= 0
                }
              >
                Place Bet
              </button>
            </div>
            {notification && (
              <div className="col-md-8 offset-md-2 text-center mt-3">
                <p className={`alert alert-${notification.type}`}>
                  {notification.message}
                </p>
              </div>
            )}
          </div>
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
              <button
                className="btn btn-secondary" // Using a red button for distinction
                onClick={handleEndEnrollment}
              >
                2. End enrollment
              </button>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default PlaceBet;
