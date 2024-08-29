import React, { useState, useEffect, Fragment, useCallback, useRef } from "react";
import { useWalletStore } from "../../../../store/useWalletStore";
import useGameLeagueService, { League, LeagueState } from "../../../../services/contracts/gameleague.service";
import useMintService from "../../../../services/contracts/cosmoships.service";
import { fetchTokensWithMetadata, SpaceshipMetadata } from "../CreateTeam/CreateTeamPage";
import imageCacheService from "../../../../services/ImageCacheService";
import ShipCard from "../CreateTeam/ShipCard";

interface TeamInfo {
  id: number;
  name: string;
  cosmoships: Partial<SpaceshipMetadata>[];
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
  } = useGameLeagueService();
  const { getIPFSTokenMetadata, convertIPFSUrl } = useMintService();
  const swiperRef = useRef<any>(null);
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);
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
      const [id, state, prizePool, enrolledTeamsResult, totalBetsInLeague] = await getCurrentLeague();
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
            const tokensWithMetadata = await fetchTokensWithMetadata(nftIds, getIPFSTokenMetadata);

            return {
              id: teamId,
              name: teamName,
              cosmoships: tokensWithMetadata,
              owner: teamOwner,
            };
          })
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
      await placeBet(league!.id, selectedTeam.id, betAmount);
      notify("Bet placed successfully!", "success");
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
    const foundTeam = teams.find((team) => team.id === teamId);
    if (foundTeam) {
      setSelectedTeam(foundTeam);
    }
  };

  const handleImageLoad = useCallback(
      async (token: SpaceshipMetadata, mediaElement: HTMLImageElement | HTMLVideoElement) => {
        let parsedToken;
        if (typeof token === 'string') {
          try {
            parsedToken = JSON.parse(token);
          } catch (error) {
            console.error("Failed to parse token JSON:", error);
            return;
          }
        } else {
          parsedToken = token;
        }
        console.warn("Parsed token before conversion:", parsedToken);

        const convertedUrl = convertIPFSUrl(parsedToken.img);
        if (!convertedUrl) {
          console.error("Failed to load image or video due to invalid URL.");
          return;
        }

        try {
          const cachedMedia = await imageCacheService.lazyLoadImage(convertedUrl, mediaElement);
          if (cachedMedia) {
            mediaElement.src = cachedMedia as string;
          } else {
            mediaElement.src = convertedUrl;
          }
        } catch (error) {
          console.error("Error loading media:", error);
          mediaElement.src = convertedUrl;
        }
      },
      [convertIPFSUrl]
  );

  if (isLoading) {
    return <div>Loading league and teams...</div>;
  }

  return (
      <Fragment>
        <section className="tf-section live-auctions">
          <div className="themesflat-container">
            <div className="row">
              <div className="col-md-12 text-center">
                <div className="col-md-12">
                  <h2 className="tf-title pb-20">Place a Bet on a Team</h2>
                </div>
                {league && <h4>{`League ${league.id}`}</h4>}
              </div>
            </div>
            {/* Content of the Cards */}
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex justify-content-center overflow-auto" style={{ whiteSpace: "nowrap" }}>
                  {teams.length > 0 ? (
                      teams.map((team) => (
                          <div
                              onClick={() => onSelectTeam(team.id)}
                              key={team.id}
                              className={`${selectedTeam?.id === team.id ? "border border-primary" : ""}`}
                          >
                            {team.cosmoships.map((token, index) => (
                                <div key={token.id}>
                                  <ShipCard
                                      token={token as SpaceshipMetadata}
                                      selectedTokenIds={selectedTeam?.cosmoships?.map((t) => t!.id as number) || []}
                                      handleSelectToken={() => {}}
                                      swiperRef={swiperRef}
                                      handleImageLoad={handleImageLoad}
                                  />
                                </div>
                            ))}
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
                    style={{ width: "60%", display: "inline-block" }}
                />
              </div>
              <div className="col-md-6 offset-md-3 text-center">
                <button
                    className={`btn btn-lg btn-primary ${bettingAllowed ? "enabled" : "disabled"}`}
                    onClick={() => handleBet()}
                    disabled={!bettingAllowed || !selectedTeam || betAmount <= 0}
                >
                  Place Bet
                </button>
              </div>
              {notification && (
                  <div className="col-md-8 offset-md-2 text-center mt-3">
                    <p className={`alert alert-${notification.type}`}>{notification.message}</p>
                  </div>
              )}
            </div>
            <div className="row">
              <div className="col-md-8 offset-md-2 text-center mt-4">
                <button className="btn btn-secondary" onClick={handleInitializeLeague}>
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
      </Fragment>
  );
};

export default PlaceBet;