import React, { useState } from "react";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import img1 from "../../assets/images/box-item/item-h5.1.png";
import img2 from "../../assets/images/box-item/item-h5.2.png";
import img3 from "../../assets/images/box-item/item-h5.3.png";
import useMintService from "../../services/contracts/cosmoships.service";
import { useWalletStore } from "../../store/useWalletStore";
import MintSection from "../header/MintSection";

const SliderStyle2 = () => {
  const subtitle = "NFT MARKETPLACE";
  const title = "Mint, play & earn with your favorite cosmo ships";
  const [numberOfShips, setNumberOfShips] = useState(1);

  const { connectWallet, isOnCorrectNetwork, account } = useWalletStore();
  const { mintTokens } = useMintService();

  const handleMint = async () => {
    try {
      if (!account) {
        await connectWallet();
      }
      await mintTokens(numberOfShips);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <section className="flat-title-page home5">
      <div className="overlay"></div>
      <div className="themesflat-container">
        <div className="wrap-heading flat-slider d-flex align-items-center">
          <div className="content">
            <h4 className="mg-bt-11">
              <span className="fill">{subtitle}</span>
            </h4>
            <h1 className="heading">{title}</h1>
            <p className="sub-heading mg-t-7 mg-bt-39"></p>
            <p />
            <p />
            <p />
            <div className="col-md-12 text-center">
              <h2 className="tf-title">Mint your Cosmo Ship</h2>
              <h5 className="sub-title">
                Enter the Token ID of the Cosmo Ship you want to mint
              </h5>
            </div>
            <MintSection
              numberOfShips={numberOfShips}
              setNumberOfShips={setNumberOfShips}
              handleMint={handleMint}
              isOnCorrectNetwork={isOnCorrectNetwork}
              account={account}
            />
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
            <SwiperSlide>
              <img src={img1} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img2} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img3} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img2} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img3} alt="Axies" />
            </SwiperSlide>
          </Swiper>
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
            speed={2100}
          >
            <SwiperSlide>
              <img src={img2} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img3} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img1} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img3} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img1} alt="Axies" />
            </SwiperSlide>
          </Swiper>
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
            speed={2200}
          >
            <SwiperSlide>
              <img src={img3} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img1} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img2} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img3} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img1} alt="Axies" />
            </SwiperSlide>
          </Swiper>
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
            className="end"
          >
            <SwiperSlide>
              <img src={img3} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img2} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img3} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img1} alt="Axies" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={img2} alt="Axies" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default SliderStyle2;

