import React from "react";
import Header from "../../components/header/Header";
import NewFooter from "../../components/footer/NewFooter";
import SliderShips from "../../components/layouts/home-5b/MintShip/SliderShips";
import SpaceshipAuctions from "../SpaceshipsAuctions";
import spaceshipsData from "../../assets/space-ships/spaceships";

const HomePage = () => {
    return (
        <div className='home-5'>
            <Header />
            <SliderShips />
            <SpaceshipAuctions data={spaceshipsData} />
            <NewFooter />
        </div>
    );
}

export default HomePage;
