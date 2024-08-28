import React, {useState, useEffect, useCallback, Fragment} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import { useWalletStore } from '../../../../store/useWalletStore';
import useGameLeagueService from '../../../../services/contracts/gameleague.service';
import imageCacheService from "../../../../services/ImageCacheService";
import '../styles/Home05b.css';
import useMintService from "../../../../services/contracts/cosmoships.service";
import config from "../../../../config";
import { Link } from "react-router-dom";

interface Notification {
    message: string;
    type: 'success' | 'error';
}

interface SpaceshipMetadata {
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

const CreateTeam: React.FC = () => {
    const { account, signer } = useWalletStore();
    const { createTeam } = useGameLeagueService();
    const { getTokenIdsByOwner, setApproveForAll, getIPFSTokenMetadata, convertIPFSUrl } = useMintService();
    const [teamName, setTeamName] = useState<string>('');
    const [ownedTokens, setOwnedTokens] = useState<SpaceshipMetadata[]>([]);
    const [selectedTokenIds, setSelectedTokenIds] = useState<number[]>([]);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [initiated, setInitiated] = useState<boolean>(false);

    const fetchOwnedTokens = useCallback(async () => {
        if (!account) return;

        try {
            const tokenIds = await getTokenIdsByOwner(account);
            const tokensWithMetadata = await Promise.all(
                tokenIds.map(async (tokenId) => {
                    try {
                        return getIPFSTokenMetadata(tokenId);
                    } catch (error) {
                        console.error(`Error fetching metadata for token ${tokenId}:`, error);
                        return null;
                    }
                })
            );

            setOwnedTokens(tokensWithMetadata.filter((token) => token !== null));
            setInitiated(true);
        } catch (error) {
            console.error('Error fetching owned tokens:', error);
        } finally {
            setIsLoading(false);
        }
    }, [account, getTokenIdsByOwner, getIPFSTokenMetadata]);


    useEffect(() => {
        if (!initiated) {
            fetchOwnedTokens();
        }
    }, [fetchOwnedTokens, initiated]);

    useEffect(() => {
        console.log('Rendering component with ownedTokens:', ownedTokens);
    }, [ownedTokens]);

    const handleImageLoad = useCallback(async (token: SpaceshipMetadata, mediaElement: HTMLImageElement | HTMLVideoElement) => {
        const convertedUrl = convertIPFSUrl(token.img);
        console.log('Final URL:', convertedUrl);

        try {
            const cachedMedia = await imageCacheService.lazyLoadImage(convertedUrl, mediaElement);
            if (cachedMedia) {
                mediaElement.src = cachedMedia as string;
            } else {
                mediaElement.src = convertedUrl;
                console.error(`Media not loaded from cache: ${convertedUrl}`);
            }
        } catch (error) {
            console.error('Error loading media:', error);
            mediaElement.src = convertedUrl;
        }
    }, [convertIPFSUrl]);



    const isCreateTeamEnabled = teamName.trim() !== '' && selectedTokenIds.length === 3;

    const notify = useCallback((message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    }, []);

    const handleSelectToken = useCallback((tokenId: number) => {
        setSelectedTokenIds(prev => {
            if (prev.includes(tokenId)) {
                return prev.filter(id => id !== tokenId);
            } else if (prev.length < 3) {
                return [...prev, tokenId];
            }
            return prev;
        });
    }, []);

    const handleCreateTeam = async () => {
        if (selectedTokenIds.length !== 3) {
            notify('Please select exactly 3 spaceships.', 'error');
            return;
        }
        if (!teamName.trim()) {
            notify('Please enter a team name.', 'error');
            return;
        }

        try {
            if (!signer) {
                throw new Error('Signer not available');
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
            setOwnedTokens((prevTokens) =>
                prevTokens.filter((token) => !selectedTokenIds.includes(token.id))
            );

            // Reset form
            setTeamName('');
            setSelectedTokenIds([]);
            notify('Team created successfully!', 'success');
        } catch (error) {
            console.error('Error creating team:', error);
            notify('Failed to create team. Please try again.', 'error');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Fragment>
            <section className="tf-section live-auctions">
            <div className="themesflat-container">
                {/* OVERLAY & BREADCRUMB */}
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-title-heading mg-bt-24"/>
                        <div className="page-title-heading mg-bt-24">
                            <h1 className="heading text-center">Create your Team</h1>
                        </div>
                        <div className="breadcrumbs style2">
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/mint-ship">Mint</Link></li>
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
                                0: { slidesPerView: 1 },
                                767: { slidesPerView: 2 },
                                991: { slidesPerView: 3 },
                            }}
                            navigation
                            pagination={{ clickable: true }}
                            scrollbar={{ draggable: true }}
                        >
                            {ownedTokens.map((token) => (
                                <SwiperSlide key={token.id}>
                                    <div className="swiper-container show-shadow carousel auctions">
                                        <div className="swiper-wrapper">
                                            <div
                                                className={`swiper-slide ${selectedTokenIds.includes(token.id) ? 'selected-card' : ''}`}
                                                onClick={() => handleSelectToken(token.id)}
                                            >
                                                <div className="slider-item">
                                                    <div className="sc-card-product">
                                                        <div className="card-media">
                                                            {/*<video src={token.img} autoPlay loop muted/>*/}
                                                            <video
                                                                ref={(el) => el && handleImageLoad(token, el)}
                                                                src={token.img}
                                                                autoPlay loop muted
                                                            />
                                                        </div>
                                                        <div className="card-title">
                                                            <h5>{token.name}</h5>
                                                        </div>
                                                        {/* Rest of the card content */}
                                                        <div className="meta-info">
                                                            <div className="author">
                                                                <div className="info">
                                                                    <span>Type</span>
                                                                    <h6>{token.type}</h6>
                                                                </div>
                                                            </div>
                                                            <div className="author">
                                                                <div className="info">
                                                                    <span>Model</span>
                                                                    <h6>{token.model}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-bottom style-explode">
                                                            <div className="attribute-item">
                                                                <span>Color</span>
                                                                <h6>{token.color}</h6>
                                                            </div>
                                                            <div className="attribute-item">
                                                                <span>Tool</span>
                                                                <h6>{token.tool}</h6>
                                                            </div>
                                                        </div>
                                                        <div className="card-bottom style-explode">
                                                            <div className="attribute-item">
                                                                <span>Capacity</span>
                                                                <h6>{token.capacity}</h6>
                                                            </div>
                                                            <div className="attribute-item">
                                                                <span>Attack</span>
                                                                <h6>{token.attack}</h6>
                                                            </div>
                                                            <div className="attribute-item">
                                                                <span>Speed</span>
                                                                <h6>{token.speed}</h6>
                                                            </div>
                                                            <div className="attribute-item">
                                                                <span>Shield</span>
                                                                <h6>{token.shield}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    {notification && <p className={`notification ${notification.type}`}>{notification.message}</p>}
                    <div className="col-md-12">
                        <button
                            className={`create-team-button ${isCreateTeamEnabled ? 'enabled' : 'disabled'}`}
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

}

export default CreateTeam;
