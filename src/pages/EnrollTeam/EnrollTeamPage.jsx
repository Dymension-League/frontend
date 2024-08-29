import React from "react";
import Header from "../../components/header/Header";
import NewFooter from "../../components/footer/NewFooter";
import { Link } from "react-router-dom";
import EnrollTeam from "../../components/layouts/home-5b/EnrollTeam/EnrollTeam";

const EnrollTeamPage = () => {
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
                  <li>Enroll Team</li>
                </h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <li>Enroll Team</li>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EnrollTeam />
      <NewFooter />
    </div>
  );
};

export default EnrollTeamPage;
