import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

// Import GIFs from the assets/demo folder
import gif1 from "../assets/demo/static-gifs-80x80/group_1.gif";
import gif2 from "../assets/demo/static-gifs-80x80/group_2.gif";
import gif3 from "../assets/demo/static-gifs-80x80/group_3.gif";
import gif4 from "../assets/demo/static-gifs-80x80/group_4.gif";
import gif5 from "../assets/demo/static-gifs-80x80/group_5.gif";
import gif6 from "../assets/demo/static-gifs-80x80/group_6.gif";

// Import Identicons from the assets/demo/identicons folder
import identicon1 from "../assets/demo/identicons/identicon_1.png";
import identicon2 from "../assets/demo/identicons/identicon_2.png";
import identicon3 from "../assets/demo/identicons/identicon_3.png";
import identicon4 from "../assets/demo/identicons/identicon_4.png";
import identicon5 from "../assets/demo/identicons/identicon_5.png";
import identicon6 from "../assets/demo/identicons/identicon_6.png";

// Medals
const medals = ["🥇", "🥈", "🥉"];
const otherIcon = "⭐"; // Use this icon for rankings beyond the top 3

const Leaderboard = () => {
  const [data] = useState([
    {
      img: gif1,
      title: "Galactic Racers",
      imgAuthor: identicon1,
      nameAuthor: "0x4fe...ca8",
      matchesWon: 15,
      winningAmount: "2500 DYML",
      betWinningRatio: "7.45",
      addressesBetting: 146,
    },
    {
      img: gif2,
      title: "Interstellar Voyagers",
      imgAuthor: identicon2,
      nameAuthor: "0x3af...b17",
      matchesWon: 14,
      winningAmount: "1500 DYML",
      betWinningRatio: "3.98",
      addressesBetting: 292,
    },
    {
      img: gif3,
      title: "Cosmic Marauders",
      imgAuthor: identicon3,
      nameAuthor: "0x1bc...a92",
      matchesWon: 13,
      winningAmount: "500 DYML",
      betWinningRatio: "2.65",
      addressesBetting: 234,
    },
    {
      img: gif4,
      title: "Nebula Pilots",
      imgAuthor: identicon4,
      nameAuthor: "0x6bd...f5a",
      matchesWon: 12,
      winningAmount: "—",
      betWinningRatio: "2.45",
      addressesBetting: 208,
    },
    {
      img: gif5,
      title: "Quantum Navigators",
      imgAuthor: identicon5,
      nameAuthor: "0x7de...e3b",
      matchesWon: 11,
      winningAmount: "—",
      betWinningRatio: "2.30",
      addressesBetting: 181,
    },
    {
      img: gif6,
      title: "Photon Explorers",
      imgAuthor: identicon6,
      nameAuthor: "0x2ab...d18",
      matchesWon: 10,
      winningAmount: "—",
      betWinningRatio: "2.15",
      addressesBetting: 160,
    },
  ]);

  const [visible, setVisible] = useState(6);
  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 3);
  };

  return (
    <div>
      <Header />
      <section className="flat-title-page inner">
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="page-title-heading mg-bt-12">
                <h1 className="heading text-center">Leaderboard</h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/">Leagues</Link>
                  </li>
                  <li>
                    <Link to="#">18</Link>
                  </li>
                  <li>Leaderboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="tf-section tf-rank">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="table-ranking">
                {data.slice(0, visible).map((item, index) => (
                    <div
                      id="correct-card"
                      key={index}
                      className="content-item2 open"
                    >
                      <div className="col-item">
                        <div className="sc-card-product menu_card style-h7">
                          <div className="wrap-media">
                            <div className="card-media">
                              <Link to="/item-details-01">
                                <img src={item.img} alt="Axies" />
                              </Link>
                            </div>
                          </div>
                          <div className="card-title d-flex flex-column">
                            <div
                              style={{
                                width: "100%",
                              }}
                              className="d-flex flex-column"
                            >
                              <div className="d-flex flex-row align-items-center">
                                <div className="d-flex align-items-center">
                                  <span
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "700",
                                      lineHeight: "24px",
                                    }}
                                  >
                                    {index + 1}{" "}
                                    {index < 3
                                      ? ` ${medals[index]}`
                                      : ` ${otherIcon}`}{" "}
                                  </span>
                                </div>
                                <p
                                  className="m-2"
                                  style={{
                                    marginLeft: "8px",
                                    fontSize: "14px",
                                    lineHeight: "24px",
                                    textTransform: "uppercase",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  Team
                                </p>
                              </div>
                              <h4>
                                <Link to="/item-details-01">{item.title}</Link>
                              </h4>
                            </div>
                            <div
                              style={{
                                width: "100%",
                              }}
                              className="author d-flex flex-row align-items-center"
                            >
                              <div
                                className="d-flex justify-content-center align-items-center"
                                style={{
                                  marginRight: "5px",
                                  minHeight: "40px", // Ensures the container is tall enough to align with the text
                                }}
                              >
                                <img
                                  src={item.imgAuthor}
                                  alt="Identicon"
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    alignSelf: "center", // Ensures the image stays centered
                                  }}
                                />
                              </div>
                              <div className="d-flex flex-column justify-content-center">
                                <p
                                  style={{
                                    fontSize: "0.895rem",
                                    lineHeight: "1.5rem",
                                    marginBottom: 0,
                                  }}
                                >
                                  Owned By
                                </p>
                                <h6 style={{ color: "var(--primary-color2)" }}>
                                  <Link to="/authors-01">
                                    {item.nameAuthor}
                                  </Link>
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="meta-info style">
                            <p>Matches won</p>
                            <span style={{
															fontSize: "20px",
														}}>{item.matchesWon}</span>
                          </div>
                          <div className="meta-info style">
                            <p>Winning amount</p>
                            <span style={{
															fontSize: "20px",
														}}>{item.winningAmount}</span>
                          </div>
                          <div className="meta-info style">
                            <p>Bet winning ratio</p>
                            <span style={{
															fontSize: "20px",
														}}>{item.betWinningRatio}</span>
                          </div>
                          <div className="meta-info style">
                            <p>Number of bets</p>
                            <span style={{
															fontSize: "20px",
														}}>{item.addressesBetting}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
                {visible < data.length && (
                  <div className="col-md-12 wrap-inner load-more text-center">
                    <Link
                      to="#"
                      id="load-more"
                      className="sc-button loadmore fl-button pri-3"
                      onClick={showMoreItems}
                      style={{
                        color: "var(--primary-color2)",
                        backgroundColor: "var(--primary-color3)",
                        borderRadius: "30px",
                        padding: "10px 20px",
                      }}
                    >
                      <span>Load More</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Leaderboard;
