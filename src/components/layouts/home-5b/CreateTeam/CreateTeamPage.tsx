import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Fragment,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import { useWalletStore } from "../../../../store/useWalletStore";
import useGameLeagueService from "../../../../services/contracts/gameleague.service";
import imageCacheService from "../../../../services/ImageCacheService";
import "../styles/Home05b.css";
import useMintService from "../../../../services/contracts/cosmoships.service";
import config from "../../../../config";
import { Link } from 'react-router-dom';
import ShipCard from "./ShipCard";

interface Notification {
  message: string;
  type: "success" | "error";
}

export interface SpaceshipMetadata {
  id: number;
  name: string;
  img: string;
  type: string;
  model: string;
  color: string;
  tool: string;
  capacity: number;
  attack: number;
  speed: number;
  shield: number;
}

export const fetchTokensWithMetadata = async (
    tokenIds: number[],
    fetchTokens: (tokenId: number) => Promise<Partial<SpaceshipMetadata>>,
) =>
    await Promise.all(
        tokenIds.map(async (tokenId) => {
            return fetchTokens(tokenId).catch((error) => {
                console.error(`Error fetching metadata for token ${tokenId}:`, error);
                return {
                    id: tokenId,
                };
            });
        }),
    );

const CreateTeam = () => {
    const { account, signer } = useWalletStore();
    const { createTeam } = useGameLeagueService();
    const {
        getTokenIdsByOwner,
        setApproveForAll,
        getIPFSTokenMetadata,
        convertIPFSUrl,
    } = useMintService();
    const [teamName, setTeamName] = useState<string>('');
    const [ownedTokens, setOwnedTokens] = useState<Partial<SpaceshipMetadata>[]>(
        [],
    );
    const [selectedTokenIds, setSelectedTokenIds] = useState<number[]>([]);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [error, setError] = useState<string | null>(null);
    const swiperRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [initiated, setInitiated] = useState<boolean>(false);
    const [visible, setVisible] = useState(8);

    const fetchOwnedTokens = useCallback(async () => {
        if (!account) return;

    try {
      const tokenIds = await getTokenIdsByOwner(account);
      const tokensWithMetadata = await fetchTokensWithMetadata(
        tokenIds,
        getIPFSTokenMetadata,
      );
      setOwnedTokens(tokensWithMetadata.filter((token) => token !== null));
      setInitiated(true);
    } catch (error) {
      console.error("Error fetching owned tokens:", error);
    } finally {
      setIsLoading(false);
    }
  }, [account, getTokenIdsByOwner, getIPFSTokenMetadata]);

    useEffect(() => {
        if (!initiated) {
            fetchOwnedTokens();
        }
    }, [fetchOwnedTokens, initiated]);

  const handleImageLoad = useCallback(
    async (
      token: SpaceshipMetadata,
      mediaElement: HTMLImageElement | HTMLVideoElement,
    ) => {
      const convertedUrl = convertIPFSUrl(token.img);
      console.log("Final URL:", convertedUrl);

      try {
        const cachedMedia = await imageCacheService.lazyLoadImage(
          convertedUrl,
          mediaElement,
        );
        if (cachedMedia) {
          mediaElement.src = cachedMedia as string;
        } else {
          mediaElement.src = convertedUrl;
          console.error(`Media not loaded from cache: ${convertedUrl}`);
        }
      } catch (error) {
        console.error("Error loading media:", error);
        mediaElement.src = convertedUrl;
      }
    },
    [convertIPFSUrl],
  );

  const isCreateTeamEnabled =
    teamName.trim() !== "" && selectedTokenIds.length === 3;

  const notify = useCallback((message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const handleSelectToken = useCallback((tokenId: number) => {
    setSelectedTokenIds((prev) => {
      if (prev.includes(tokenId)) {
        return prev.filter((id) => id !== tokenId);
      } else if (prev.length < 3) {
        return [...prev, tokenId];
      }
      return prev;
    });
  }, []);

  const handleCreateTeam = async () => {
    if (selectedTokenIds.length !== 3) {
      notify("Please select exactly 3 spaceships.", "error");
      return;
    }
    if (!teamName.trim()) {
      notify("Please enter a team name.", "error");
      return;
    }

    try {
      if (!signer) {
        throw new Error("Signer not available");
      }

      // Set approval for GameLeague contract to manage tokens
      await setApproveForAll(config.gameLeagueAddress, true, notify);

      // Create the team
      await createTeam(selectedTokenIds, teamName);

      // Clear cache for selected tokens and their metadata
      await Promise.all(
          selectedTokenIds.map(async (tokenId) => {
              const token = ownedTokens.find(token => token.id === tokenId);
              if (token) {
                  await imageCacheService.deleteCachedImage(token.img);
                  await imageCacheService.deleteCachedMetadata(tokenId);
              }
          })
      );

      // Update ownedTokens state to remove the selected tokens
      setOwnedTokens(prevTokens =>
          prevTokens.filter(token => {
              if (token.id !== undefined) {
                  return !selectedTokenIds.includes(token.id);
              }
              return true;
          })
      );

      // Reset form
      setTeamName("");
      setSelectedTokenIds([]);
      notify("Team created successfully!", "success");
    } catch (error) {
      console.error("Error creating team:", error);
      notify("Failed to create team. Please try again.", "error");
    }
  };


  const showMoreItems = () => {
      setVisible(prevValue => prevValue + 4);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <section className="tf-section live-auctions">
          <div className="themesflat-container">
              <div className="row">
                  <div className="col-md-12">
                      <div className="page-title-heading mg-bt-24"/>
                      <div className="page-title-heading mg-bt-24">
                          <h1 className="heading text-center">Create your Team</h1>
                      </div>
                      <div className="breadcrumbs style2">
                          <ul>
                              <li><Link to="/">Home</Link></li>
                              <li>Create your Team</li>
                          </ul>
                      </div>
                  </div>
              </div>
              <div className="row">
                  <div className="col-md-12">
                      <div className="heading-live-auctions">
                          <h2 className="tf-title pb-20">Create your Team</h2>
                          <input
                              type="text"
                              placeholder="Enter team name"
                              value={teamName}
                              onChange={(e) => setTeamName(e.target.value)}
                          />
                      </div>
                  </div>
                  <div className="col-md-12">
                      <Swiper
                          modules={[Navigation, Pagination, Scrollbar, A11y]}
                          spaceBetween={30}
                          breakpoints={{
                              0: {slidesPerView: 1},
                              767: {slidesPerView: 2},
                              991: {slidesPerView: 3},
                          }}
                          navigation
                          pagination={{clickable: true}}
                          scrollbar={{draggable: true}}
                      >
                          {ownedTokens.map((token) => {
                              return (
                                  <SwiperSlide key={token.id}>
                                      <ShipCard
                                          token={token as SpaceshipMetadata}
                                          selectedTokenIds={selectedTokenIds}
                                          handleSelectToken={handleSelectToken}
                                          swiperRef={swiperRef}
                                          handleImageLoad={handleImageLoad}
                                      />
                                  </SwiperSlide>
                              );
                          })}
                      </Swiper>
                  </div>
                  {notification && (
                      <p className={`notification ${notification.type}`}>
                          {notification.message}
                      </p>
                  )}
                  <div className="col-md-12">
                      <button
                          className={`create-team-button ${isCreateTeamEnabled ? "enabled" : "disabled"}`}
                          onClick={handleCreateTeam}
                          disabled={!isCreateTeamEnabled}
                      >
                          Create Team
                      </button>
                  </div>
              </div>
          </div>
      </section>
    </Fragment>
  );
};

export default CreateTeam;