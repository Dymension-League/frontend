import React, { useState } from 'react';
import Footer from '../components/footer/Footer';
import heroSliderData from '../assets/fake-data/data-slider';
import { useWalletStore } from "../store/useWalletStore";
import useMintService from "../services/contracts/cosmoships.service";
import Header from "../components/header/Header";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';


const MintPage = () => {
    const [tokenId, setTokenId] = useState(0);
    const { connectWallet, isOnCorrectNetwork, account } = useWalletStore();
    const { mintTokens } = useMintService();

    const handleMint = async () => {
        try {
            if (!account) {
                await connectWallet();
            }
            await mintTokens(tokenId);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className='mint-page'>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Mint your Cosmo Ship</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-section tf-item-details">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-xl-6 col-md-12">
                            <div className="content-left">
                                <Swiper
                                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                                    spaceBetween={30}
                                    breakpoints={{
                                        0: {
                                            slidesPerView: 1,
                                        },
                                        767: {
                                            slidesPerView: 2,
                                        },
                                        991: {
                                            slidesPerView: 3,
                                        },
                                        1300: {
                                            slidesPerView: 4,
                                        },
                                    }}
                                    navigation
                                    pagination={{ clickable: true }}
                                    scrollbar={{ draggable: true }}
                                >
                                    {heroSliderData.map((item, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="slider-item">
                                                <div className="sc-card-product">
                                                    <div className="card-media">
                                                        <img src={item.img} alt="Cosmo Ship" />
                                                    </div>
                                                    <div className="card-title">
                                                        <h5>{item.title_3}</h5>
                                                        {/*<div className="description">{item.description}</div>*/}
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                            <div className="content-right">
                                <div className="sc-item-details">
                                    <div className="client-infor sc-card-product">
                                        <div className="meta-info">
                                            <div className="author">
                                                <div className="info">
                                                    <span>Token ID</span>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={tokenId}
                                                        onChange={(e) => setTokenId(Number(e.target.value))}
                                                        placeholder="Enter Token ID"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleMint}
                                        disabled={!isOnCorrectNetwork}
                                        className="sc-button loadmore style bag fl-button pri-3"
                                    >
                                        <span>{account ? "Mint Now" : "Connect Wallet"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default MintPage;
