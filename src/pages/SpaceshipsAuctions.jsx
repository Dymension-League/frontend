import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import CardModal from '../../src/components/layouts/CardModal';

import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';

const SpaceshipAuctions = ({ data }) => {
    const [modalShow, setModalShow] = React.useState(false);

    const auctionData = data || [];

    return (
        <section className="tf-section live-auctions">
            <div className="themesflat-container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="">
                            <h2 className="tf-title">Spaceships</h2>
                            <div className="heading-line"></div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={30}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                },
                                767: {
                                    slidesPerView: 2,
                                },
                                991: {
                                    slidesPerView: 3,
                                },
                                1300: {
                                    slidesPerView: 4,
                                },
                            }}
                            navigation
                            pagination={{ clickable: true }}
                            scrollbar={{ draggable: true }}
                        >
                            {auctionData.slice(0, 7).map((item, index) => (
                                <SwiperSlide key={index}>
                                    <div className="swiper-container show-shadow carousel auctions">
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="slider-item">
                                                    <div className="sc-card-product">
                                                        <div className="card-media">
                                                            <video src={item.img} autoPlay loop controls muted playsInline/>
                                                        </div>
                                                        <div className="card-title">
                                                            <h5>{item.name}</h5>
                                                        </div>
                                                        <div className="meta-info">
                                                            <div className="author">
                                                                <div className="info">
                                                                    <span>Type</span>
                                                                    <h6>{item.type}</h6>
                                                                </div>
                                                            </div>
                                                            <div className="author">
                                                                <div className="info">
                                                                    <span>Model</span>
                                                                    <h6>{item.model}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-bottom style-explode">
                                                            <div className="attribute-item">
                                                                <span>Color</span>
                                                                <h6>{item.color}</h6>
                                                            </div>
                                                            <div className="attribute-item">
                                                                <span>Tool</span>
                                                                <h6>{item.tool}</h6>
                                                            </div>
                                                        </div>
                                                        <div className="card-bottom style-explode">
                                                            <div className="attribute-item">
                                                                <span>Capacity</span>
                                                                <h6>{item.capacity}</h6>
                                                            </div>
                                                            <div className="attribute-item">
                                                                <span>Attack</span>
                                                                <h6>{item.attack}</h6>
                                                            </div>
                                                            <div className="attribute-item">
                                                                <span>Speed</span>
                                                                <h6>{item.speed}</h6>
                                                            </div>
                                                            <div className="attribute-item">
                                                                <span>Shield</span>
                                                                <h6>{item.shield}</h6>
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
                </div>
            </div>
            <CardModal show={modalShow} onHide={() => setModalShow(false)} />
        </section>
    );
};

SpaceshipAuctions.propTypes = {
    data: PropTypes.array.isRequired,
};

export default SpaceshipAuctions;