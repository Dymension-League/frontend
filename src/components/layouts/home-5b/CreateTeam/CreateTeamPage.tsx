import React, { useState, useEffect, Fragment } from 'react';
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

interface Notification {
    message: string;
    type: 'success' | 'error';
}

const CreateTeam: React.FC = () => {
    const { account, provider, signer } = useWalletStore();
    const { createTeam, getTeamsByOwner } = useGameLeagueService();
    const { getTokenIdsByOwner, setApproveForAll } = useMintService();
    const [teamName, setTeamName] = useState<string>('');
    const [ownedTokenIds, setOwnedTokenIds] = useState<number[]>([]);
    const [selectedTokenIds, setSelectedTokenIds] = useState<number[]>([]);
    const [notification, setNotification] = useState<Notification | null>(null);

    useEffect(() => {
        const fetchOwnedTokens = async () => {
            if (account) {
                try {
                    const tokens = await getTokenIdsByOwner(account);
                    setOwnedTokenIds(tokens);
                } catch (error) {
                    console.error('Error fetching owned tokens:', error);
                    notify('Failed to fetch owned spaceships.', 'error');
                }
            }
        };
        fetchOwnedTokens();
    }, [account, getTokenIdsByOwner]);



    const isCreateTeamEnabled = teamName.trim() !== '' && selectedTokenIds.length === 3;

    const notify = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleSelectToken = (tokenId: number) => {
        setSelectedTokenIds(prev => {
            if (prev.includes(tokenId)) {
                return prev.filter(id => id !== tokenId);
            } else if (prev.length < 3) {
                return [...prev, tokenId];
            }
            return prev;
        });
    };

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

            // if (account) {
            //     const teams = await getTeamsByOwner(account);
            //     console.log('Updated teams for the owner:', teams);
            // }

            // Reset form
            setTeamName('');
            setSelectedTokenIds([]);
            notify('Team created successfully!', 'success');
        } catch (error) {
            console.error('Error creating team:', error);
            notify('Failed to create team. Please try again.', 'error');
        }
    };

    return (
        <Fragment>
            <section className="tf-section live-auctions">
                <div className="themesflat-container">
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
                                {ownedTokenIds.map((tokenId) => (
                                    <SwiperSlide key={tokenId}>
                                        <div className="swiper-container show-shadow carousel auctions">
                                            <div className="swiper-wrapper">
                                                <div
                                                    className={`swiper-slide ${selectedTokenIds.includes(tokenId) ? 'selected-card' : ''}`}
                                                    onClick={() => handleSelectToken(tokenId)}
                                                >
                                                    <div className="slider-item">
                                                        <div className="sc-card-product">
                                                            <div className="card-title">
                                                                <h5>Spaceship #{tokenId}</h5>
                                                            </div>
                                                            <div className="meta-info">
                                                                <div className="author">
                                                                    <div className="info">
                                                                        <span>Token ID</span>
                                                                        <h6>{tokenId}</h6>
                                                                    </div>
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