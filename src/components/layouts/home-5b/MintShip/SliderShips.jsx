import React from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import spaceshipsData from "../../../../assets/space-ships/spaceships";
import { FaDiscord, FaTwitter } from "react-icons/fa";

const SliderShips = () => {
    const subtitle = 'Dymension League Marketplace';
    const title = 'Mint, Trade, and Command Your Fleet of Extraordinary Space Vessels';
    const description = 'Join the Dymension League, where you can mint unique starships, form alliances, and conquer the cosmos. Your adventure starts here!';

    return (
        <section className="flat-title-page home5">
            <div className="overlay"></div>
            <div className="themesflat-container">
                <div className="wrap-heading flat-slider d-flex align-items-center">
                    <div className="content">
                        <h4 className="mg-bt-11"><span className="fill">{subtitle}</span></h4>
                        <h1 className="heading">{title}</h1>
                        <p className="sub-heading mg-t-7 mg-bt-39">{description}</p>
                        <div className="flat-bt-slider style2 flex">
                            <a href="https://x.com/DymensionLeague" target="_blank" rel="noopener noreferrer"
                               className="sc-button header-slider style style-1 rocket fl-button pri-1">
                                <FaTwitter size={20} style={{marginRight: '10px'}}/>
                                <span>Follow on Twitter</span>
                            </a>
                            <a href="https://discord.gg/Cct4eD9Y" target="_blank"
                               rel="noopener noreferrer"
                               className="sc-button header-slider style style-1 note fl-button pri-1">
                                <FaDiscord size={20} style={{marginRight: '10px'}}/>
                                <span>Join Discord</span>
                            </a>
                        </div>
                    </div>

                    <Swiper
                        modules={[Autoplay]}
                        direction={"vertical"}
                        spaceBetween={10}
                        slidesPerView={5}
                        loop
                        autoplay={{
                            delay: 1,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        speed={2000}
                    >
                        {spaceshipsData.map((ship, index) => (
                            <SwiperSlide key={index}>
                                <div>
                                    <video
                                        src={ship.img}
                                        autoPlay
                                        loop
                                        muted
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default SliderShips;