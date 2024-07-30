import React, {useEffect, useState} from 'react';
import Footer from '../components/footer/Footer';
import heroSliderData from '../assets/fake-data/data-slider';
import { useWalletStore } from "../store/useWalletStore";
import useMintService from "../services/contracts/cosmoships.service";
import Header from "../components/header/Header";
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import SliderStyle2 from '../components/slider/SliderStyle2';


const MintShips = () => {
    const [tokenId, setTokenId] = useState(0);
    const { connectWallet, isOnCorrectNetwork, account } = useWalletStore();
    const { mintTokens } = useMintService();

    useEffect(() => {
        // Make header sticky
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
        <div className='mint-ships'>
            <Header />
            <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: '0 0 50%', overflow: 'hidden' }}>
                    <SliderStyle2 data={heroSliderData} />
                </div>
                <div style={{ flex: '1', overflowY: 'auto' }}>
                    <section className="tf-section tf-item-details">
                        <div className="themesflat-container">
                            <div className="row">
                                <div className="col-xl-6 col-md-12">
                                    <div className="content-left">
                                        <h2 className="tf-title">Mint your Cosmo Ship</h2>
                                        <p>Enter the Token ID of the Cosmo Ship you want to mint</p>
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
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default MintShips;
