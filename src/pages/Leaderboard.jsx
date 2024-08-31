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
                <div
                  className="flex th-title"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "2px solid var(--primary-color4)",
                  }}
                >
                  <div
                    style={{
                      flex: "1",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "var(--primary-color2)",
                    }}
                  >
                    <h3>Rank</h3>
                  </div>
                  <div
                    style={{
                      flex: "1",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "var(--primary-color2)",
                    }}
                  >
                    <h3>Team</h3>
                  </div>
                  <div
                    style={{
                      flex: "1",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "var(--primary-color2)",
                    }}
                  >
                    <h3></h3>
                  </div>
                  <div
                    style={{
                      flex: "1",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "var(--primary-color2)",
                    }}
                  >
                    <h3>Matches Won</h3>
                  </div>
                  <div
                    style={{
                      flex: "1",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "var(--primary-color2)",
                    }}
                  >
                    <h3>Winning Amount</h3>
                  </div>
                  <div
                    style={{
                      flex: "1",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "var(--primary-color2)",
                    }}
                  >
                    <h3>Bet Winning Ratio</h3>
                  </div>
                  <div
                    style={{
                      flex: "1",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "var(--primary-color2)",
                    }}
                  >
                    <h3>Addresses Betting</h3>
                  </div>
                </div>
                {data.slice(0, visible).map((item, index) => (
                  <div
                    key={index}
                    className="fl-item2"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--primary-color4)",
                      backgroundColor: "var(--primary-color)",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        flex: "1",
                        textAlign: "center",
                        fontSize: "22px",
                        color: "var(--primary-color2)",
                      }}
                    >
                      <span>
                        {index + 1}
                        {index < 3 ? ` ${medals[index]}` : ""}
                      </span>
                    </div>
                    <div
                      style={{
                        flex: "2",
                        textAlign: "left",
                        paddingLeft: "10px",
                        display: "flex",
                        alignItems: "center",
                        color: "var(--primary-color2)",
                      }}
                    >
                      <div className="media">
                        <img
                          src={item.img}
                          alt="Team"
                          style={{ maxWidth: "100px", marginRight: "25px" }}
                        />
                      </div>
                      <div className="content-collection pad-t-4">
                        <h5 className="title mb-15">
                          <Link
                            to="/item-detail"
                            style={{
                              color: "var(--primary-color3)",
                              fontSize: "20px",
                            }}
                          >
                            "{item.title}"
                          </Link>
                        </h5>
                        <div
                          className="author flex"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "var(--primary-color4)",
                          }}
                        >
                          <div
                            className="author-avatar"
                            style={{ marginRight: "5px" }}
                          >
                            <img
                              src={item.imgAuthor}
                              alt="Identicon"
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                              }}
                            />
                          </div>
                          <div className="content">
                            <p>Owned By</p>
                            <h6 style={{ color: "var(--primary-color2)" }}>
                              <Link to="/authors-01">{item.nameAuthor}</Link>
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        flex: "1",
                        textAlign: "center",
                        color: "var(--primary-color2)",
                        fontSize: "20px",
                      }}
                    >
                      <span>{item.matchesWon}</span>
                    </div>
                    <div
                      style={{
                        flex: "1",
                        textAlign: "center",
                        color: "var(--primary-color2)",
                        fontSize: "20px",
                      }}
                    >
                      <span>{item.winningAmount}</span>
                    </div>
                    <div
                      style={{
                        flex: "1",
                        textAlign: "center",
                        color: "var(--primary-color2)",
                        fontSize: "20px",
                      }}
                    >
                      <span>{item.betWinningRatio}</span>
                    </div>
                    <div
                      style={{
                        flex: "1",
                        textAlign: "center",
                        color: "var(--primary-color2)",
                        fontSize: "20px",
                      }}
                    >
                      <span>{item.addressesBetting}</span>
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
