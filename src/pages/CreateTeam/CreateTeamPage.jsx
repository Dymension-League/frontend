import React from 'react';
// import CreateTeam from "../../components/layouts/home-5b/CreateTeam/CreateTeam";
import CreateTeam from "../../components/layouts/home-5b/CreateTeam/CreateTeamPage";
import HeaderLeague from "../../components/header/HeaderLeague";
import NewFooter from "../../components/footer/NewFooter";

const CreateTeamPage = () => {
    return (
        <div className='home-5'>
            <HeaderLeague />
            {/*<CreateTeam />*/}
            <CreateTeam />
            <NewFooter />
        </div>
    );
}

export default CreateTeamPage;