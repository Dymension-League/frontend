import React from 'react';

interface SpaceshipMetadata {
    id: number;
    name: string;
    img: string;
    type: string;
    model: string;
    color: string;
    tool: string;
    capacity: number;
    attack: number;
    speed: number;
    shield: number;
}

interface BettingCardProps {
    token: SpaceshipMetadata;
    onSelectTeam: () => void;
    selected: boolean;
}

const BettingCard: React.FC<BettingCardProps> = ({ token, onSelectTeam, selected }) => (
    <div className={`fl-item col-xl-3 col-lg-6 col-md-6 ${selected ? "border border-primary" : ""}`} onClick={onSelectTeam}>
        <div className="sc-card-product">
            <div className="card-media">
                <video src={token.img || ''} autoPlay loop controls />
            </div>
            <div className="card-title">
                <h5>{token.name}</h5>
            </div>
            <div className="meta-info">
                <div>
                    <span>Type</span>
                    <h6>{token.type}</h6>
                </div>
                <div>
                    <span>Model</span>
                    <h6>{token.model}</h6>
                </div>
                <div>
                    <span>Color</span>
                    <h6>{token.color}</h6>
                </div>
                <div>
                    <span>Tool</span>
                    <h6>{token.tool}</h6>
                </div>
            </div>
            <div className="card-bottom">
                <div>
                    <span>Capacity</span>
                    <h6>{token.capacity}</h6>
                </div>
                <div>
                    <span>Attack</span>
                    <h6>{token.attack}</h6>
                </div>
                <div>
                    <span>Speed</span>
                    <h6>{token.speed}</h6>
                </div>
                <div>
                    <span>Shield</span>
                    <h6>{token.shield}</h6>
                </div>
            </div>
        </div>
    </div>
);

export default BettingCard;