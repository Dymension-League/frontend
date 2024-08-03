import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderStyle2 from '../../components/header/HeaderStyle2';
import Footer from '../../components/footer/Footer';
import { useWalletStore } from "../../store/useWalletStore";
import SpaceshipSelector from './SpaceshipSelector';
import './styles/CreateTeam.css';
import Header from "../../components/header/Header";

const CreateTeamPage = () => {
    const [teamName, setTeamName] = useState('');
    const [selectedShips, setSelectedShips] = useState([]);
    const { account } = useWalletStore();

    const spaceships = [
        {
            id: 514,
            name: 'CosmoShip#514',
            img: 'https://ipfs.io/ipfs/bafybeibkgb3oq522k37e4vmekxuiai4nb6iin36n3buxrkbkgjpqbm7amu/514.mp4',
            type: 'Terrestrial',
            model: 'Rigel',
            color: 'Blue',
            tool: 'Builder+Turret',
            capacity: 2,
            attack: 2,
            speed: 4,
            shield: 4
        },
        {
            id: 1242,
            name: 'CosmoShip#1242',
            img: 'https://ipfs.io/ipfs/bafybeibkgb3oq522k37e4vmekxuiai4nb6iin36n3buxrkbkgjpqbm7amu/1242.mp4',
            type: 'Terrestrial',
            model: 'Draco',
            color: 'Gold',
            tool: 'Miner',
            capacity: 2,
            attack: 2,
            speed: 6,
            shield: 4
        },
        {
            id: 515,
            name: 'CosmoShip#515',
            img: 'https://ipfs.io/ipfs/bafybeibkgb3oq522k37e4vmekxuiai4nb6iin36n3buxrkbkgjpqbm7amu/515.mp4',
            type: 'Terrestrial',
            model: 'Draco',
            color: 'Orange',
            tool: 'Turret',
            capacity: 2,
            attack: 6,
            speed: 8,
            shield: 8
        },
        {
            id: 1243,
            name: 'CosmoShip#1243',
            img: 'https://ipfs.io/ipfs/bafybeibkgb3oq522k37e4vmekxuiai4nb6iin36n3buxrkbkgjpqbm7amu/1243.mp4',
            type: 'Terrestrial',
            model: 'Rigel',
            color: 'Green',
            tool: 'Builder',
            capacity: 2,
            attack: 4,
            speed: 6,
            shield: 6
        },
        {
            id: 516,
            name: 'CosmoShip#516',
            img: 'https://ipfs.io/ipfs/bafybeibkgb3oq522k37e4vmekxuiai4nb6iin36n3buxrkbkgjpqbm7amu/516.mp4',
            type: 'Terrestrial',
            model: 'Rigel',
            color: 'Red',
            tool: 'Turret+Builder',
            capacity: 2,
            attack: 4,
            speed: 6,
            shield: 6
        },
        {
            id: 1244,
            name: 'CosmoShip#1244',
            img: 'https://ipfs.io/ipfs/bafybeibkgb3oq522k37e4vmekxuiai4nb6iin36n3buxrkbkgjpqbm7amu/1244.mp4',
            type: 'Terrestrial',
            model: 'Draco',
            color: 'Blue',
            tool: 'Miner+Turret',
            capacity: 2,
            attack: 6,
            speed: 8,
            shield: 8
        },
        {
            id: 517,
            name: 'CosmoShip#517',
            img: 'https://ipfs.io/ipfs/bafybeibkgb3oq522k37e4vmekxuiai4nb6iin36n3buxrkbkgjpqbm7amu/517.mp4',
            type: 'Terrestrial',
            model: 'Draco',
            color: 'Gold',
            tool: 'Builder',
            capacity: 2,
            attack: 4,
            speed: 6,
            shield: 6
        },
        {
            id: 1245,
            name: 'CosmoShip#1245',
            img: 'https://ipfs.io/ipfs/bafybeibkgb3oq522k37e4vmekxuiai4nb6iin36n3buxrkbkgjpqbm7amu/1245.mp4',
            type: 'Terrestrial',
            model: 'Rigel',
            color: 'Orange',
            tool: 'Miner',
            capacity: 2,
            attack: 2,
            speed: 4,
            shield: 4
        },
        {
            id: 518,
            name: 'CosmoShip#518',
            img: 'https://ipfs.io/ipfs/bafybeibkgb3oq522k37e4vmekxuiai4nb6iin36n3buxrkbkgjpqbm7amu/518.mp4',
            type: 'Terrestrial',
            model: 'Draco',
            color: 'Green',
            tool: 'Turret',
            capacity: 2,
            attack: 6,
            speed: 8,
            shield: 8
        },
        {
            id: 1246,
            name: 'CosmoShip#1246',
            img: 'https://ipfs.io/ipfs/bafybeibkgb3oq522k37e4vmekxuiai4nb6iin36n3buxrkbkgjpqbm7amu/1246.mp4',
            type: 'Terrestrial',
            model: 'Rigel',
            color: 'Red',
            tool: 'Builder+Turret',
            capacity: 2,
            attack: 2,
            speed:  4,
            shield: 4
        },
    ];

    const toggleShipSelection = (shipId) => {
        setSelectedShips(prev =>
            prev.includes(shipId)
                ? prev.filter(id => id !== shipId)
                : [...prev, shipId]
        );
    };

    const handleCreateTeam = () => {
        if (teamName.trim() === '' || selectedShips.length < 3) {
            alert('Please enter a team name and select at least three spaceships.');
            return;
        }
        console.log('Creating team:', teamName, 'with ships:', selectedShips);
        // TODO: Interact with contract here
    };

    const isCreateTeamDisabled = !account || teamName.trim() === '' || selectedShips.length < 3;

    useEffect(() => {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle) return;

        const body = document.body;

        const handleDarkModeToggle = () => {
            body.classList.toggle('dark-mode');
        };

        darkModeToggle.addEventListener('click', handleDarkModeToggle);

        return () => {
            darkModeToggle.removeEventListener('click', handleDarkModeToggle);
        };
    }, []);

    return (
        <div className='create-team'>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Create Team</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li>Create Team</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-section create-team">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="heading-live-auctions mg-bt-21">
                                <h2 className="tf-title">
                                    Create your team
                                </h2>
                                <Link to="/explore-03" className="exp style2">EXPLORE MORE</Link>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-create-item">
                                <div className="form-create-item-inner">
                                    <input
                                        type="text"
                                        placeholder="Enter team name"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <h4>Select Spaceships</h4>
                            <SpaceshipSelector
                                data={spaceships}
                                selectedShips={selectedShips}
                                onShipSelect={toggleShipSelection}
                            />
                        </div>
                        <div className="col-md-12 text-center">
                            <button
                                onClick={handleCreateTeam}
                                disabled={isCreateTeamDisabled}
                                className={`sc-button loadmore style bag fl-button pri-3 ${isCreateTeamDisabled ? 'disabled' : ''}`}
                            >
                                <span>Create Team</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default CreateTeamPage;