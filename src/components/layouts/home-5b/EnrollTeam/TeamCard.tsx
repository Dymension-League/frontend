import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import ResizeObserver from "resize-observer-polyfill";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import imageCacheService from "../../../../services/ImageCacheService";
import useMintService from "../../../../services/contracts/cosmoships.service";

export interface Ship {
  id: number;
  img: string;
  model: string;
  name: string;
  type: string;
  color: string;
  tool: string;
  capacity: string | number;
  attack: string | number;
  speed: string | number;
  shield: string | number;
}

export interface Team {
  teamId: number;
  teamName: string;
  ships: Ship[];
}

interface TeamCardProps {
  team: Team;
  onAction?: (teamId: number) => void;
  buttonText?: string;
  disabled?: boolean;
  onSelectTeam?: (teamId: number) => void;
	productClassName?: string;
	containerClassName?: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  buttonText,
  onAction,
  disabled,
  onSelectTeam,
	productClassName = '',
	containerClassName = ''
}) => {
  const { getIPFSTokenMetadata, convertIPFSUrl } = useMintService();
  const [loadedShips, setLoadedShips] = useState<Ship[]>(team.ships);
  const [swiperContainer, setSwiperContainer] = useState<HTMLDivElement | null>(
    null,
  );

  const teamIdString = team.teamId.toString();

  const handleImageLoad = useCallback(
    async (ship: Ship, mediaElement: HTMLImageElement | HTMLVideoElement) => {
      try {
        const cachedMedia = await imageCacheService.lazyLoadImage(
          ship.img,
          mediaElement,
        );
        if (cachedMedia) {
          (mediaElement as HTMLImageElement).src = cachedMedia as string;
        } else {
          mediaElement.src = ship.img;
        }
      } catch (error) {
        console.error("Error loading media:", error);
        mediaElement.src = ship.img;
      }
    },
    [],
  );

  useEffect(() => {
    const fetchMetadata = async () => {
      if (loadedShips.every((ship) => ship.img === "")) {
        const shipsWithMetadata = await Promise.all(
          team.ships.map(async (ship) => {
            let metadata = await getIPFSTokenMetadata(ship.id);

            if (typeof metadata === "string") {
              metadata = JSON.parse(metadata);
            }
            return {
              id: ship.id,
              img: metadata.img ? convertIPFSUrl(metadata.img) : "",
              name: metadata.name || "Unknown Ship",
              type: metadata.type || "Unknown Type",
              model: metadata.model || "Unknown Model",
              color: metadata.color || "Unknown Color",
              tool: metadata.tool || "Unknown Tool",
              capacity: metadata.capacity ?? 0,
              attack: metadata.attack ?? 0,
              speed: metadata.speed ?? 0,
              shield: metadata.shield ?? 0,
            };
          }),
        );
        setLoadedShips(shipsWithMetadata);
      }
    };

    fetchMetadata();
  }, [team.ships, getIPFSTokenMetadata, convertIPFSUrl, loadedShips]);

  useEffect(() => {
    if (swiperContainer) {
      const observer = new ResizeObserver(() => {
        swiperContainer.dispatchEvent(new Event("resize"));
      });
      observer.observe(swiperContainer);

      return () => {
        observer.disconnect();
      };
    }
  }, [swiperContainer]);

  return (
    <div ref={setSwiperContainer}>
      <div
        className={containerClassName || "col-md-12 mb-5"}
        onClick={() => onSelectTeam?.(team.teamId)}
      >
        <h3 className="mb-4">
          {team.teamName} - Team ID: {teamIdString}
        </h3>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={30}
          breakpoints={{
            0: { slidesPerView: 1 },
            767: { slidesPerView: 2 },
            991: { slidesPerView: 3 },
            1300: { slidesPerView: 4 },
          }}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
        >
          {loadedShips.map((ship, index) => (
            <SwiperSlide key={index}>
              <div className={`sc-card-product ${productClassName}`}>
                <div className="card-media">
                  <video
                    ref={(el) => el && handleImageLoad(ship, el)}
                    src={ship.img}
                    autoPlay
                    loop
                    muted
                    controls
                    playsInline
                  />
                </div>
                <div className="card-title">
                  <h5>{ship.name}</h5>
                </div>
                <div className="card-bottom style-explode">
                  <div className="attribute-item">
                    <span>Color</span>
                    <h6>{ship.color}</h6>
                  </div>
                  <div className="attribute-item">
                    <span>Tool</span>
                    <h6>{ship.tool}</h6>
                  </div>
                </div>
                <div className="card-bottom style-explode">
                  <div className="attribute-item">
                    <span>Capacity</span>
                    <h6>{ship.capacity}</h6>
                  </div>
                  <div className="attribute-item">
                    <span>Attack</span>
                    <h6>{ship.attack}</h6>
                  </div>
                  <div className="attribute-item">
                    <span>Speed</span>
                    <h6>{ship.speed}</h6>
                  </div>
                  <div className="attribute-item">
                    <span>Shield</span>
                    <h6>{ship.shield}</h6>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {onAction && (
          <button
            className={`enroll-button ${disabled === true ? "disabled" : "enabled"}`}
            onClick={() => onAction(team.teamId)}
          >
            {buttonText || "Enroll to League"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
