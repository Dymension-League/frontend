import { useEffect } from "react";
import { useWalletStore } from "../../store/useWalletStore";

const WalletButton = () => {
  const { isEthereumAvailable, connectWallet, account } = useWalletStore();

  useEffect(() => {
    if (isEthereumAvailable) connectWallet();
  }, [isEthereumAvailable, connectWallet]);

  const formattedAccount = account
    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    : "";

  return (
    <div>
      <button onClick={connectWallet}>
        {account ? formattedAccount : "Connect Wallet"}
      </button>
    </div>
  );
};

export default WalletButton;
