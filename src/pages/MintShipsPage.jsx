import React, { useState, useEffect } from 'react';
import HeaderStyle2 from '../components/header/HeaderStyle2';
import Footer from '../components/footer/Footer';
import SliderStyle2 from '../components/slider/SliderStyle2';
import heroSliderData from '../assets/fake-data/data-slider';
import { useWalletStore } from "../store/useWalletStore";
import useMintService from "../services/contracts/cosmoships.service";

const MintShipsPage = () => {
    const [tokenId, setTokenId] = useState(0);
    const { connectWallet, isOnCorrectNetwork, account } = useWalletStore();
    const { mintTokens } = useMintService();

    useEffect(() => {
        const header = document.querySelector('.header_1');
        if (header) {
            header.style.position = 'sticky';
            header.style.top = '0';
            header.style.zIndex = '1000';
        }
    }, []);

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
        <div className='home-5'>
            <HeaderStyle2 />
            <SliderStyle2 data={heroSliderData} />
            <section className="tf-section live-auctions style4 no-pt-mb mobie-style">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="heading-live-auctions">
                                <h2 className="tf-title pb-17 text-left">
                                    Mint your Cosmo Ship
                                </h2>
                                <h5 className="sub-title">Enter the Token ID of the Cosmo Ship you want to mint</h5>
                            </div>
                        </div>
                        <div className="col-md-12">
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
            </section>
            <Footer />
        </div>
    );
}

export default MintShipsPage;