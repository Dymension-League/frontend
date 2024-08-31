import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

// Import GIFs from the assets/demo folder
import gif1 from '../assets/demo/static-gifs-80x80/group_1.gif';
import gif2 from '../assets/demo/static-gifs-80x80/group_2.gif';
import gif3 from '../assets/demo/static-gifs-80x80/group_3.gif';
import gif4 from '../assets/demo/static-gifs-80x80/group_4.gif';
import gif5 from '../assets/demo/static-gifs-80x80/group_5.gif';
import gif6 from '../assets/demo/static-gifs-80x80/group_6.gif';

// Import Identicons from the assets/demo/identicons folder
import identicon1 from '../assets/demo/identicons/identicon_1.png';
import identicon2 from '../assets/demo/identicons/identicon_2.png';
import identicon3 from '../assets/demo/identicons/identicon_3.png';
import identicon4 from '../assets/demo/identicons/identicon_4.png';
import identicon5 from '../assets/demo/identicons/identicon_5.png';
import identicon6 from '../assets/demo/identicons/identicon_6.png';

const Leaderboard = () => {
  const [data] = useState([
    {
      img: gif1,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: identicon1,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
      assets: '23k',
    },
    {
      img: gif2,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: identicon2,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
      assets: '23k',
    },
    {
      img: gif3,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: identicon3,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
      assets: '23k',
    },
    {
      img: gif4,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: identicon4,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
      assets: '23k',
    },
    {
      img: gif5,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: identicon5,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
      assets: '23k',
    },
    {
      img: gif6,
      title: "Hamlet Contemplates Yorick's Yorick's",
      imgAuthor: identicon6,
      nameAuthor: 'SalvadorDali',
      volume: '12,4353',
      day: '+3456%',
      week: '-564%',
      price: '12,4353 ETH',
      owners: '3.3k',
      assets: '23k',
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
                <h1 className="heading text-center">Ranking</h1>
              </div>
              <div className="breadcrumbs style2">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="#">Pages</Link>
                  </li>
                  <li>Ranking</li>
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
                <div className="flex th-title">
                  <div className="column1">
                    <h3>Collection</h3>
                  </div>
                  <div className="column">
                    <h3>Volume</h3>
                  </div>
                  <div className="column">
                    <h3>24h %</h3>
                  </div>
                  <div className="column">
                    <h3>7d %</h3>
                  </div>
                  <div className="column">
                    <h3>Floor Price</h3>
                  </div>
                  <div className="column">
                    <h3>Owners</h3>
                  </div>
                  <div className="column">
                    <h3>Assets</h3>
                  </div>
                </div>
                {data.slice(0, visible).map((item, index) => (
                  <div key={index} className="fl-item2">
                    <div className="item flex">
                      <div className="infor-item flex column1">
                        <div className="media">
                          <img src={item.img} alt="Axies" />
                        </div>
                        <div className="content-collection pad-t-4">
                          <h5 className="title mb-15">
                            <Link to="/item-detail">"{item.title}"</Link>
                          </h5>
                          <div className="author flex">
                            <div className="author-avatar">
                              <img src={item.imgAuthor} alt="Identicon" />
                              <div className="badge">
                                <i className="ripple"></i>
                              </div>
                            </div>
                            <div className="content">
                              <p>Owned By</p>
                              <h6>
                                <Link to="/authors-01">{item.nameAuthor}</Link>
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <span>{item.volume}</span>
                      </div>
                      <div className="column td2">
                        <span>{item.day}</span>
                      </div>
                      <div className="column td3">
                        <span>{item.week}</span>
                      </div>
                      <div className="column td4">
                        <span>{item.price}</span>
                      </div>
                      <div className="column td5">
                        <span>{item.owners}</span>
                      </div>
                      <div className="column td6">
                        <span>{item.assets}</span>
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
