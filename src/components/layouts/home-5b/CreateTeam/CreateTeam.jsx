import React, { useState, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import CardModal from '../../CardModal';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import spaceshipsData from "../../../../assets/space-ships/spaceships";
import imageCacheService from "../../../../services/ImageCacheService";
import '../styles/Home05b.css';

const CreateTeam = () => {
    const [loadedImages, setLoadedImages] = useState([]);
    const [selectedSpaceships, setSelectedSpaceships] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [notification, setNotification] = useState('');
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        const loadImages = async () => {
            const urls = spaceshipsData.map((spaceship) => spaceship.img);
            const cachedImages = await imageCacheService.loadImages(urls);
            setLoadedImages(cachedImages);
        };

        loadImages();
    }, []);

    const handleSelectSpaceship = (spaceship) => {
        if (selectedSpaceships.includes(spaceship)) {
            setSelectedSpaceships(selectedSpaceships.filter(item => item !== spaceship));
        } else {
            setSelectedSpaceships([...selectedSpaceships, spaceship]);
        }
    };

    const isCreateTeamEnabled = teamName.trim() !== '' && selectedSpaceships.length >= 3;

    const handleCreateTeam = () => {
        if (!teamName.trim()) {
            setNotification('Please enter a team name.');
        } else if (selectedSpaceships.length < 3) {
            setNotification('Please select at least 3 spaceships.');
        } else {
            setNotification('Team created successfully!');
            console.log('Team Created:', { teamName, selectedSpaceships: selectedSpaceships.map(item => item.name) });
            setTeamName('');
            setSelectedSpaceships([]);
            setTimeout(() => setNotification(''), 3000);
        }
    };

    return (
        <Fragment>
            <section className="tf-section live-auctions">
                {/* OVERLAY & BREADCRUMB */}
                {/*<div className="overlay"></div>*/}
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-title-heading mg-bt-12">
                            <h1 className="heading text-center">Create your Team</h1>
                        </div>
                        <div className="breadcrumbs style2">
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/mint-ships">Mint</Link></li>
                                <li>Create your Team</li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* MAIN PART CREATE TEAM*/}
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="heading-live-auctions">
                                <h2 className="tf-title pb-20">Create your Team</h2>
                                <input
                                    type="text"
                                    placeholder="Enter team name"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <Swiper
                                modules={[Navigation, Pagination, Scrollbar, A11y]}
                                spaceBetween={30}
                                breakpoints={{
                                    0: {slidesPerView: 1},
                                    767: {slidesPerView: 2},
                                    991: {slidesPerView: 3},
                                }}
                                navigation
                                pagination={{clickable: true}}
                                scrollbar={{draggable: true}}
                            >
                                {spaceshipsData.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="swiper-container show-shadow carousel auctions">
                                            <div className="swiper-wrapper">
                                                <div
                                                    className={`swiper-slide ${selectedSpaceships.includes(item) ? 'selected-card' : ''}`}
                                                    onClick={() => handleSelectSpaceship(item)}
                                                >
                                                    <div className="slider-item">
                                                        <div className="sc-card-product">
                                                            <div className="card-media">
                                                                <Link to="#">
                                                                    <video src={item.img} autoPlay loop muted/>
                                                                </Link>
                                                                <Link to="/login" className="wishlist-button heart">
                                                                    <span className="number-like">{item.wishlist}</span>
                                                                </Link>
                                                            </div>
                                                            <div className="card-title">
                                                                <h5><Link to="#">{item.name}</Link></h5>
                                                                <div className="tags">{item.type}</div>
                                                            </div>
                                                            <div className="meta-info">
                                                                <div className="author">
                                                                    <div className="info">
                                                                        <span>Model</span>
                                                                        <h6>{item.model}</h6>
                                                                    </div>
                                                                </div>
                                                                <div className="price">
                                                                    <span>Capacity</span>
                                                                    <h5>{item.capacity}</h5>
                                                                </div>
                                                            </div>
                                                            <div className="meta-info">
                                                                <div className="price">
                                                                    <span>Attack</span>
                                                                    <h5>{item.attack}</h5>
                                                                </div>
                                                                <div className="price">
                                                                    <span>Speed</span>
                                                                    <h5>{item.speed}</h5>
                                                                </div>
                                                                <div className="price">
                                                                    <span>Shield</span>
                                                                    <h5>{item.shield}</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        {notification && <p className="notification">{notification}</p>}
                        <div className="col-md-12">
                            <button
                                className={`create-team-button ${isCreateTeamEnabled ? 'enabled' : 'disabled'}`}
                                onClick={handleCreateTeam}
                                disabled={!isCreateTeamEnabled}
                            >
                                Create Team
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <CardModal show={modalShow} onHide={() => setModalShow(false)}/>
        </Fragment>
    );
}

export default CreateTeam;