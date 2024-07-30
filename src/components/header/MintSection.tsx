import React from 'react';
import '../../assets/responsive.css';

interface MintSectionProps {
    tokenId: number;
    setTokenId: (id: number) => void;
    handleMint: () => void;
    isOnCorrectNetwork: boolean;
    account: string | null;
}

const MintSection: React.FC<MintSectionProps> = ({ tokenId, setTokenId, handleMint, isOnCorrectNetwork, account }) => {
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
                                            <span className="token-label">Token ID</span>
                                            <input
                                                type="number"
                                                className="form-control token-input"
                                                value={tokenId}
                                                onChange={(e) => setTokenId(Number(e.target.value))}
                                                placeholder="Enter Token ID"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleMint}
                                disabled={!isOnCorrectNetwork}
                                className={`sc-button loadmore style bag fl-button pri-3 ${!isOnCorrectNetwork ? 'disabled' : ''}`}
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
