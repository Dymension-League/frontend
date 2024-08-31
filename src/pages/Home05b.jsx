import React, {useEffect, useState} from "react";
import Header from "../components/header/Header";
import SliderStyle2 from "../components/slider/SliderStyle2";
import CreateTeam from "../components/layouts/home-5b/CreateTeam/CreateTeam";
import NewFooter from "../components/footer/NewFooter";

const Home05 = () => {
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
      <div className="home-5">
        <Header />
        <SliderStyle2 data={spaceshipsData} />
        <CreateTeam />
        <NewFooter />
      </div>
   );
};

export default Home05;
