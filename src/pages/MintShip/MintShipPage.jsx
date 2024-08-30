import React from "react";
import Header from "../../components/header/Header";
import NewFooter from "../../components/footer/NewFooter";
import MintShip from "../../components/layouts/home-5b/MintShip/MintShip";

const MintShipPage = () => {
  return (
    <div className="home-5">
      <Header />
      <MintShip />
      <NewFooter />
    </div>
  );
};

export default MintShipPage;
