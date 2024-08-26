import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import { useWalletStore } from '../../../../store/useWalletStore';
import useGameLeagueService from '../../../../services/contracts/gameleague.service';
import imageCacheService from "../../../../services/ImageCacheService";
import useMintService from "../../../../services/contracts/cosmoships.service";
import config from "../../../../config";

const CreateTeam = () => {
    const { account } = useWalletStore();
    const { getTokenIdsByOwner, getIPFSTokenMetadata } = useMintService();
    const [ownedTokens, setOwnedTokens] = useState([]);
    const [selectedTokenIds, setSelectedTokenIds] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);

    const fetchOwnedTokens = useCallback(async () => {
        if (!account) return;
        // setIsLoading(true);

        try {
            const tokenIds = await getTokenIdsByOwner(account);
            const tokensWithMetadata = await Promise.all(
                tokenIds.map(async (tokenId) => {
                    try {
                        return await getIPFSTokenMetadata(tokenId);
                    } catch (error) {
                        console.error(`Error fetching metadata for token ${tokenId}:`, error);
                        return null;
                    }
                })
            );

            setOwnedTokens(tokensWithMetadata.filter((token) => token !== null));
        } catch (error) {
            console.error('Error fetching owned tokens:', error);
        }
    }, [account, getTokenIdsByOwner, getIPFSTokenMetadata]);

    useEffect(() => {
        if (account) {
            fetchOwnedTokens();
        }
    }, [account]);

    const handleSelectToken = (tokenId) => {
        setSelectedTokenIds((prev) => {
            if (prev.includes(tokenId)) {
                return prev.filter(id => id !== tokenId);
            } else if (prev.length < 3) {
                return [...prev, tokenId];
            }
            return prev;
        });
    };

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    return (
        <Fragment>
            <section className="tf-section live-auctions">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="heading-live-auctions">
                                <h2 className="tf-title pb-20">Create your Team</h2>
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
                                        <div className={`swiper-slide ${selectedTokenIds.includes(token.id) ? 'selected-card' : ''}`}
                                             onClick={() => handleSelectToken(token.id)}>
                                            <div className="slider-item">
                                                <div className="sc-card-product">
                                                    <div className="card-media">
                                                        <video
                                                            ref={(el) => el && imageCacheService.lazyLoadImage(token.img, el)}
                                                            src={token.img}
                                                            onLoad={() => { /* No action needed */ }}
                                                        />
                                                    </div>
                                                    <div className="card-title">
                                                        <h5>{token.name}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    );
}

export default CreateTeam;
