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
  return (
    <div className="mint-section">
      <h2>Mint your Cosmo Ship</h2>
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
        className={`mint-button ${!disabled ? "enabled" : "disabled"}`}
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
