import React, { useState } from "react";
import { useWalletStore } from "../store/useWalletStore";
import useMintService from "../services/contracts/cosmoships.service";
import Header from "../components/header2/Header";

const MintPage: React.FC = () => {
  const [tokenId, setTokenId] = useState<number>(0);
  const { connectWallet, isOnCorrectNetwork } = useWalletStore();
  const { mintTokens } = useMintService();

  const handleMint = async () => {
    try {
      await connectWallet();
      await mintTokens(tokenId);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <Header />
      <h1>Mint Tokens</h1>
      <label htmlFor="token-id">Token ID: </label>
      <input
        id="token-id"
        type="number"
        value={tokenId}
        disabled={!isOnCorrectNetwork}
        onChange={(e) => setTokenId(Number(e.target.value))}
        placeholder="TokenID"
      />
      <button onClick={handleMint} disabled={!isOnCorrectNetwork}>
        Mint
      </button>
    </div>
  );
};

export default MintPage;
