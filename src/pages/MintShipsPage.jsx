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
            await mintTokens();
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className='home-5'>
            <HeaderStyle2/>
            <SliderStyle2 data={heroSliderData}/>
            <section className="flat-title-page style2">
                <div className="overlay"></div>
            </section>
            <Footer/>
        </div>
    );
}

export default MintShipsPage;
