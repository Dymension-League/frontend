import React from 'react';
import PropTypes from 'prop-types';
import './styles/CreateTeam.css';

const SpaceshipSelector = ({ data, selectedShips, onShipSelect }) => {
    return (
        <div className="row spaceship-selector">
            {data.map((item) => {
                const isSelected = selectedShips.includes(item.id);
                return (
                    <div key={item.id} className="fl-item col-xl-3 col-lg-4 col-md-6 col-12">
                        <div
                            className={`sc-card-product spaceship-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => onShipSelect(item.id)}
                        >
                            <div className="card-media">
                                <video width="100%" height="auto" autoPlay loop muted playsInline>
                                    <source src={item.img} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div className="card-title">
                                <h5>{item.name}</h5>
                            </div>
                            <div className="meta-info">
                                <div className="author">
                                    <div className="info">
                                        <span>Type</span>
                                        <h6>{item.type}</h6>
                                    </div>
                                </div>
                                <div className="price">
                                    <span>Model</span>
                                    <h5>{item.model}</h5>
                                </div>
                            </div>
                            <div className="card-bottom style-explode">
                                <div className="attribute-item">
                                    <span>Capacity: {item.capacity}</span>
                                </div>
                                <div className="attribute-item">
                                    <span>Attack: {item.attack}</span>
                                </div>
                                <div className="attribute-item">
                                    <span>Speed: {item.speed}</span>
                                </div>
                                <div className="attribute-item">
                                    <span>Shield: {item.shield}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

SpaceshipSelector.propTypes = {
    data: PropTypes.array.isRequired,
    selectedShips: PropTypes.array.isRequired,
    onShipSelect: PropTypes.func.isRequired,
};

export default SpaceshipSelector;
