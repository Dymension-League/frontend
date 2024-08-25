import React, { useCallback, useEffect } from "react";
import { useWalletStore } from "../../store/useWalletStore";
import config from "../../config";

const NetworkButton: React.FC = () => {
  const { isOnCorrectNetwork, networkName, account, switchNetwork } =
    useWalletStore();

  const handleSwitch = useCallback(async () => {
    if (!isOnCorrectNetwork) {
      try {
        const networkIdString = config.networkId.toString();
        const result = await switchNetwork(networkIdString);
        if (result === undefined) {
          console.warn("Network switch result was undefined");
        }
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    }
  }, [isOnCorrectNetwork, switchNetwork]);

  useEffect(() => {
    if (account && !isOnCorrectNetwork) {
      handleSwitch();
    }
  }, [account, handleSwitch, isOnCorrectNetwork]);

  if (!account) {
    return null;
  }

  return (
    <button
      onClick={handleSwitch}
      className="sc-button header-slider style style-1 wallet fl-button pri-1"
    >
      <span>
        {isOnCorrectNetwork
          ? `${networkName || "Correct Network"}`
          : `Switch to ${config.networkName}`}
      </span>
    </button>
  );
};

export default NetworkButton;
