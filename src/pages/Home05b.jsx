import React from "react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import SliderStyle2 from "../components/slider/SliderStyle2";
import spaceshipsData from "../assets/space-ships/spaceships";
import LiveAuction from "../components/layouts/home-5b/CreateTeam/LiveAuction";
import CreateTeam from "../components/layouts/home-5b/CreateTeam/CreateTeam";
import NewFooter from "../components/footer/NewFooter";

const Home05 = () => {
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
