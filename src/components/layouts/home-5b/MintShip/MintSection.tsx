import React, { useEffect } from "react";

const MAX_SHIPS_MINT = 3;

interface MintSectionProps {
  numberOfShips: number;
  setNumberOfShips: (id: number) => void;
  handleMint: () => void;
  disabled: boolean;
  children: React.ReactNode;
}

const MintSection = ({
  numberOfShips,
  setNumberOfShips,
  disabled,
  children,
  handleMint,
}: MintSectionProps) => {
  useEffect(() => {
    if (numberOfShips === 0) {
      setNumberOfShips(3);
    }
  }, []);

  const handleShipSelection = (ships: number) => {
    setNumberOfShips(ships);
  };

  return (
    <div className="mint-section">
      <h2>Mint your Cosmo Ship</h2>
      <p>Select the number of ships you want to mint:</p>

      <div className="ship-selection">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            className={`ship-button ${numberOfShips === num ? 'selected' : ''}`}
            onClick={() => handleShipSelection(num)}
          >
            {num} {num === 1 ? 'ship' : 'ships'}
          </button>
        ))}
      </div>

      <button
        className={`mint-button ${!disabled ? 'enabled' : 'disabled'}`}
        onClick={handleMint}
        disabled={disabled}
      >
        Mint Now
      </button>
      {children}
    </div>
  );
};

export default MintSection;
