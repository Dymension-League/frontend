import { useEffect } from "react";
import { useWalletStore } from "../../store/useWalletStore";
import config from "../../config";

const NetworkButton = () => {
  const { networkName, switchNetwork, account, networkChainId } =
    useWalletStore();

  const handleSwitch = () => {
    switchNetwork(config.networkId.toString());
  };

  useEffect(() => {}, [networkName, account, networkChainId]);

  if (!account) {
    return null;
  }

  if (networkChainId !== Number(config.networkId)) {
    return <button onClick={handleSwitch}>Switch Network</button>;
  }

  return <button onClick={handleSwitch}>{networkName}</button>;
};

export default NetworkButton;
