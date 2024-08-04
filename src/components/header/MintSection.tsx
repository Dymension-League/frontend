import React from "react";
import "../../assets/responsive.css";

interface MintSectionProps {
  numberOfShips: number;
  setNumberOfShips: (id: number) => void;
  handleMint: () => void;
  isOnCorrectNetwork: boolean;
  account: string | null;
}

const MAX_SHIPS_MINT = 3;

const MintSection: React.FC<MintSectionProps> = ({
  numberOfShips,
  setNumberOfShips,
  handleMint,
  isOnCorrectNetwork,
  account,
}) => {
  return (
    <section>
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12 text-center">
            <div className="sc-item-details">
              <div className="client-infor sc-card-product">
                <div className="meta-info">
                  <div className="author">
                    <div className="info">
                      <span className="token-label">
                        Number of ships to mint
                      </span>
                      <input
                        type="number"
                        className="form-control token-input"
                        value={numberOfShips}
                        max={MAX_SHIPS_MINT}
                        onChange={(e) =>
                          setNumberOfShips(Number(e.target.value))
                        }
                        placeholder="Number of ships"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleMint}
                disabled={!isOnCorrectNetwork}
                className={`sc-button loadmore style bag fl-button pri-3 ${!isOnCorrectNetwork ? "disabled" : ""}`}
              >
                <span>{account ? "Mint Now" : "Connect Wallet"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MintSection;
