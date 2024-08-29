import React from "react";
import Header from "../../components/header/Header";
import NewFooter from "../../components/footer/NewFooter";
import SliderShips from "../../components/layouts/home-5b/MintShip/SliderShips";

const HomePage = () => {
  return (
    <div className="home-5">
      <Header />
      <SliderShips />
      <NewFooter />
    </div>
  );
};

export default HomePage;
