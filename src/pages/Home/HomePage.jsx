import React, {useEffect, useState} from "react";
import Header from "../../components/header/Header";
import NewFooter from "../../components/footer/NewFooter";
import SliderShips from "../../components/layouts/home-5b/MintShip/SliderShips";
import SpaceshipAuctions from "../SpaceshipsAuctions";

const HomePage = () => {
    const [spaceshipsData, setSpaceshipsData] = useState([]);

    useEffect(() => {
        const fetchSpaceshipsData = async () => {
            try {
                const response = await fetch("/assets/space-ships/spaceships.json");
                const data = await response.json();
                setSpaceshipsData(data);
            } catch (error) {
                console.error("Error loading spaceships data:", error);
            }
        };

        fetchSpaceshipsData();
    }, []);

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
