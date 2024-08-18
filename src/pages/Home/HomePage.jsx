import React from 'react';
import HeaderLeague from "../../components/header/HeaderLeague";
import NewFooter from "../../components/footer/NewFooter";
import SliderShips from "../../components/layouts/home-5b/MintShip/SliderShips";

const HomePage = () => {
    return (
        <div className='home-5'>
            <HeaderLeague />
            <SliderShips />
            <NewFooter />
        </div>
    );
}

export default HomePage;