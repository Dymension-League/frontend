import React from "react";
import { useWalletStore } from "../../store/useWalletStore";

const WalletButton: React.FC = () => {
    const { connectWallet, account } = useWalletStore();

    const handleClick = () => {
        connectWallet();
    };

    const buttonText = account
        ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
        : "Connect Wallet";

    return (
        <button onClick={handleClick} className="sc-button header-slider style style-1 wallet fl-button pri-1">
            <span>{buttonText}</span>
        </button>
    );
};

export default WalletButton;
