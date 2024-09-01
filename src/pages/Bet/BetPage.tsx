import PlaceBetPage from "../../components/layouts/home-5b/Bet/PlaceBetPage";
import Header from "../../components/header/Header";
import NewFooter from "../../components/footer/NewFooter";
import { Link } from "react-router-dom";
import React from "react";

const BetPage = () => {
  return (
    <div className="home-5">
      <Header />
      <section className="flat-title-page inner">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">
                  <li>Place a Bet on a Team</li>
                </h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <li>Bet</li>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PlaceBetPage />
      <NewFooter />
    </div>
  );
};

export default BetPage;
