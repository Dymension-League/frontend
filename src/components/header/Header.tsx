import NetworkButton from "./NetworkButton";
import WalletButton from "./WalletButton";

const Header = () => {
  return (
    <header>
      <div>
        <NetworkButton />
        <WalletButton />
      </div>
    </header>
  );
};

export default Header;
