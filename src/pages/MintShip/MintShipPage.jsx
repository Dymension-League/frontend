import React from 'react';
import HeaderLeague from "../../components/header/HeaderLeague";
import NewFooter from "../../components/footer/NewFooter";
import MintShip from "../../components/layouts/home-5b/MintShip/MintShip";

const MintShipPage = () => {
    return (
        <div className='home-5'>
            <HeaderLeague />
            <MintShip />
            <NewFooter />
        </div>
    );
}

export default MintShipPage;