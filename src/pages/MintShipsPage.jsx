import { useEffect } from 'react';
import HeaderStyle2 from '../components/header/HeaderStyle2';
import Footer from '../components/footer/Footer';
import SliderStyle2 from '../components/slider/SliderStyle2';
import heroSliderData from '../assets/fake-data/data-slider';

const MintShipsPage = () => {
    useEffect(() => {
        const header = document.querySelector('.header_1');
        if (header) {
            header.style.position = 'sticky';
            header.style.top = '0';
            header.style.zIndex = '1000';
        }
    }, []);

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
