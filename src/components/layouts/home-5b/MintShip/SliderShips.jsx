import React, {useCallback, useEffect, useState} from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import spaceshipsData from "../../../../assets/space-ships/spaceships";
import imageCacheService from '../../../../services/ImageCacheService';

const SliderShips = () => {
    const [loadedImages, setLoadedImages] = useState([]);
    const swiperRef = null;

    const handleImageLoad = useCallback((url, videoElement) => {
        imageCacheService.lazyLoadImage(url, videoElement).then((cachedUrl) => {
            videoElement.src = cachedUrl;
        });
    }, []);

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
                            <a href="/create-team" className="sc-button header-slider style style-1 rocket fl-button pri-1">
                                <span>Create Team</span>
                            </a>
                            <a href="/mint-ships" className="sc-button header-slider style style-1 note fl-button pri-1">
                                <span>Mint Ships</span>
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
                        {loadedImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div>
                                    <video
                                        ref={(el) => el && handleImageLoad(image, el)}
                                        autoPlay
                                        loop
                                        muted
                                        onLoadedData={() => {
                                            if (swiperRef.current) {
                                                swiperRef.current.update();
                                            }
                                        }}
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
