import React from 'react';
import HeaderLeague from "../../components/header/HeaderLeague";
import NewFooter from "../../components/footer/NewFooter";
import SliderShips from "../../components/layouts/home-5b/MintShip/SliderShips";
import SpaceshipAuctions from "../SpaceshipsAuctions";
import spaceshipsData from "../../assets/space-ships/spaceships";

const HomePage = () => {
    return (
        <div className='home-5'>
            <HeaderLeague />
            <SliderShips />
            <SpaceshipAuctions data={spaceshipsData} />
            <NewFooter />
        </div>
    );
}

export default HomePage;