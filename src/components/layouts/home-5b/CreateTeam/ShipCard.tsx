import { SpaceshipMetadata } from "./CreateTeamPage";

const ShipCard = ({
                    token,
                    selectedTokenIds,
                    handleSelectToken,
                    swiperRef,
                    handleImageLoad,
                  }: {
  token: SpaceshipMetadata;
  selectedTokenIds: Array<number>;
  swiperRef: React.MutableRefObject<{
    update: () => void;
  }>;
  handleSelectToken: (id: number) => void;
  handleImageLoad: (
      token: SpaceshipMetadata,
      mediaElement: HTMLImageElement | HTMLVideoElement,
  ) => void;
}) => {
  return (
      <div className="fl-item col-xl-3 col-lg-4 col-md-6 col-sm-6">
        <div
            className={`sc-card-product ${selectedTokenIds.includes(token.id) ? "selected-card" : ""}`}
            onClick={() => handleSelectToken(token.id)}
        >
          <div className="card-media">
            <video
                ref={(el) => el && handleImageLoad(token, el)}
                src={token.img}
                onLoad={() => {
                  if (swiperRef.current) {
                    swiperRef.current.update()
                  }
                }}
                autoPlay loop muted
            />
          </div>
          <div className="card-title">
            <h5>{token.name}</h5>
          </div>
          <div className="meta-info">
            <div className="author">
              <div className="info">
                <span>Type</span>
                <h6>{token.type}</h6>
              </div>
            </div>
            <div className="author">
              <div className="info">
                <span>Model</span>
                <h6>{token.model}</h6>
              </div>
            </div>
          </div>
          <div className="card-bottom style-explode">
            <div className="attribute-item">
              <span>Color</span>
              <h6>{token.color}</h6>
            </div>
            <div className="attribute-item">
              <span>Tool</span>
              <h6>{token.tool}</h6>
            </div>
          </div>
          <div className="card-bottom style-explode">
            <div className="attribute-item">
              <span>Capacity</span>
              <h6>{token.capacity}</h6>
            </div>
            <div className="attribute-item">
              <span>Attack</span>
              <h6>{token.attack}</h6>
            </div>
            <div className="attribute-item">
              <span>Speed</span>
              <h6>{token.speed}</h6>
            </div>
            <div className="attribute-item">
              <span>Shield</span>
              <h6>{token.shield}</h6>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ShipCard;