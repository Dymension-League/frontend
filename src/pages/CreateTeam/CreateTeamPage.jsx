import React from 'react';
// import CreateTeam from "../../components/layouts/home-5b/CreateTeam/CreateTeam";
import CreateTeam from "../../components/layouts/home-5b/CreateTeam/CreateTeamPage";
import HeaderLeague from "../../components/header/HeaderLeague";
import NewFooter from "../../components/footer/NewFooter";
import NewTeam from "../../components/layouts/home-5b/CreateTeam/NewTeam";
import { Link } from "react-router-dom";

const CreateTeamPage = () => {
    return (
        <div className='home-5'>
            <HeaderLeague/>
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">
                                    <li>Create your Team</li>
                                </h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li>
                                        <li>Create your Team</li>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <CreateTeam/>
            {/*<NewTeam />*/}
            <NewFooter/>
        </div>
    );
}

export default CreateTeamPage;