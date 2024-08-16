import React, { useEffect, useState } from "react";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import spaceshipsData from "../../../../assets/space-ships/spaceships";
import imageCacheService from "../../../../services/ImageCacheService";
import useMintService from "../../../../services/contracts/cosmoships.service";
import "../styles/Home05b.css";
import { useWalletStore } from "../../../../store/useWalletStore";

const MAX_SHIPS_MINT = 3;

const MintShip: React.FC = () => {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [numberOfShips, setNumberOfShips] = useState<number>(1);
  const [notification, setNotification] = useState<string>("");
  const { isOnCorrectNetwork } = useWalletStore();
  const [isMinting, setIsMinting] = useState(false);
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success",
  );
  const { mintTokens } = useMintService();

  useEffect(() => {
    const loadImages = async () => {
      const urls = spaceshipsData.map((spaceship) => spaceship.img);
      const cachedImages = await imageCacheService.loadImages(urls);
      setLoadedImages(cachedImages);
    };

    loadImages();
  }, []);

  const subtitle = "Dymension League Marketplace";
  const title =
    "Mint, Trade, and Command Your Fleet of Extraordinary Space Vessels";
  const description =
    "Join the Dymension League, where you can mint unique starships, form alliances, and conquer the cosmos. Your adventure starts here!";

  const notify = (message: string, type: "success" | "error") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleMintShip = async () => {
    try {
      setIsMinting(true);
      await mintTokens(numberOfShips, notify);
    } catch (error: any) {
      const errorMessage =
        error.message || "Minting failed for an unknown reason.";
      notify(`Mint failed: ${errorMessage}`, "error");
      console.error("Minting error details:", error);
    } finally {
      setIsMinting(false);
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
            <h4 className="mg-bt-11">
              <span className="fill">{description}</span>
            </h4>
            <p />
            <p />
            <p />
            <p />
            <div className="mint-section">
              <h2>Mint your Cosmo Ships</h2>
              <p>Enter the number of ships you want to mint</p>
              <div className="input-mint">
                <label htmlFor="numberOfShips">Number of ships</label>
                <input
                  type="number"
                  className="form-control token-input"
                  value={numberOfShips}
                  max={MAX_SHIPS_MINT}
                  onChange={(e) => setNumberOfShips(Number(e.target.value))}
                  placeholder="Number of ships"
                />
              </div>
              <button
                className={`mint-button ${isOnCorrectNetwork || !isMinting ? "enabled" : "disabled"}`}
                onClick={handleMintShip}
                disabled={!isOnCorrectNetwork || isMinting}
              >
                Mint Now
              </button>
              {notification && (
                <p className={`notification ${notificationType}`}>
                  {notification}
                </p>
              )}
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
            className="slider-ships"
          >
            {loadedImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div>
                  <video src={image} autoPlay loop muted />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default MintShip;
