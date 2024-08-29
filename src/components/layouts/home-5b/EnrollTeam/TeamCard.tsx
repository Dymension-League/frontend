import React, { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import imageCacheService from "../../../../services/ImageCacheService";
import useMintService from "../../../../services/contracts/cosmoships.service";

interface Ship {
    id: number;
    img: string;
    name: string;
    type: string;
    model: string;
    color: string;
    tool: string;
    capacity: string;
    attack: string;
    speed: string;
    shield: string;
}

interface Team {
    teamId: number;
    teamName: string;
    ships: Ship[];
}

interface TeamCardProps {
    team: Team;
    onEnroll: (teamId: number) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onEnroll }) => {
    const { getIPFSTokenMetadata, convertIPFSUrl } = useMintService();
    const [loadedShips, setLoadedShips] = useState<Ship[]>(team.ships);
    const teamIdString = team.teamId.toString();

    console.log('Team ID:', teamIdString);

    const handleImageLoad = useCallback(async (ship: Ship, mediaElement: HTMLImageElement | HTMLVideoElement) => {
        try {
            const cachedMedia = await imageCacheService.lazyLoadImage(ship.img, mediaElement);
            if (cachedMedia) {
                (mediaElement as HTMLImageElement).src = cachedMedia as string;
            } else {
                mediaElement.src = ship.img;
            }
        } catch (error) {
            console.error('Error loading media:', error);
            mediaElement.src = ship.img;
        }
    }, []);

    useEffect(() => {
        const fetchMetadata = async () => {
            if (loadedShips.every(ship => ship.img === '')) {
                const shipsWithMetadata = await Promise.all(
                    team.ships.map(async (ship) => {
                        const metadata = await getIPFSTokenMetadata(ship.id);
                        return {
                            id: ship.id,
                            img: convertIPFSUrl(metadata.img),
                            name: metadata.name,
                            type: metadata.type,
                            model: metadata.model,
                            color: metadata.color,
                            tool: metadata.tool,
                            capacity: metadata.capacity,
                            attack: metadata.attack,
                            speed: metadata.speed,
                            shield: metadata.shield,
                        };
                    })
                );
                setLoadedShips(shipsWithMetadata);
            }
        };

        fetchMetadata();
    }, [team.ships, getIPFSTokenMetadata, convertIPFSUrl, loadedShips]);

    return (
        <div className="team-card-container">
            <h3>{team.teamName} - Team ID: {teamIdString}</h3>
            <div className="team-content">
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
                    className="team-swiper"
                >
                    {loadedShips.map((ship, index) => (
                        <SwiperSlide key={index}>
                            <div className="sc-card-product">
                                <div className="card-media">
                                    <video
                                        ref={el => el && handleImageLoad(ship, el)}
                                        src={ship.img}
                                        autoPlay loop muted
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
                <button className="enroll-button" onClick={() => onEnroll(team.teamId)}>Enroll to League</button>
            </div>
        </div>
    );
};

export default TeamCard;