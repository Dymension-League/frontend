import PlaceBetPage from "../../components/layouts/home-5b/Bet/PlaceBetPage";
import HeaderLeague from "../../components/header/HeaderLeague";
import NewFooter from "../../components/footer/NewFooter";
import {Link} from "react-router-dom";
import React from "react";

const CreateTeamPage = () => {
  return (
      <div className="home-5">
          <HeaderLeague/>
          <section className="flat-title-page inner">
              <div className="overlay"></div>
              <div className="themesflat-container">
                  <div className="row">
                      <div className="col-md-12">
                          <div className="page-title-heading mg-bt-12">
                              <h1 className="heading text-center">
                                  <li>Bet</li>
                              </h1>
                          </div>
                          <div className="breadcrumbs style2">
                              <ul>
                                  <li><Link to="/">Home</Link></li>
                                  <li>
                                      <li>Bet</li>
                                  </li>
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
          <PlaceBetPage/>
          <NewFooter/>
      </div>
  );
};

export default CreateTeamPage;
