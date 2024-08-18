import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import headerMenus from "../../pages/HeaderMenu/headerMenus";
import DarkMode from './DarkMode';
import WalletButton from './WalletButton';
import NetworkButton from './NetworkButton';
import { FaRocket } from 'react-icons/fa';
import avt from '../../assets/images/avatar/avt-2.jpg';
import coin from '../../assets/images/logo/coin.svg';

const HeaderLeague = () => {
    const { pathname } = useLocation();

    const headerRef = useRef(null);
    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
            window.removeEventListener('scroll', isSticky);
        };
    });
    const isSticky = (e) => {
        const header = document.querySelector('.js-header');
        const scrollTop = window.scrollY;
        scrollTop >= 300 ? header.classList.add('is-fixed') : header.classList.remove('is-fixed');
        scrollTop >= 400 ? header.classList.add('is-small') : header.classList.remove('is-small');
    };

    const menuLeft = useRef(null);
    const btnToggle = useRef(null);

    const menuToggle = () => {
        menuLeft.current.classList.toggle('active');
        btnToggle.current.classList.toggle('active');
    }

    const [activeIndex, setActiveIndex] = useState(null);
    const handleOnClick = index => {
        setActiveIndex(index);
    };

    return (
        <header id="header_main" className="header_1 header_2 style2 js-header" ref={headerRef}>
            <div className="themesflat-container">
                <div className="row">
                    <div className="col-md-12">
                        <div id="site-header-inner">
                            <div className="wrap-box flex">
                                <div id="site-logo" className="clearfix">
                                    <div id="site-logo-inner">
                                        <Link to="/" rel="home" className="main-logo">
                                            <FaRocket size={30} />
                                            <span className='logo-text' style={{ color: '#fff', marginLeft: '10px' }}>Dymension League</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="mobile-button" ref={btnToggle} onClick={menuToggle}><span></span></div>
                                <nav id="main-nav" className="main-nav" ref={menuLeft} >
                                    <ul id="menu-primary-menu" className="menu">
                                        {
                                            headerMenus.map((data, index) => (
                                                <li key={index} onClick={() => handleOnClick(index)} className={`menu-item ${data.namesub ? 'menu-item-has-children' : ''} ${activeIndex === index ? 'active' : ''}`} >
                                                    <Link to={data.links}>{data.name}</Link>
                                                    {
                                                        data.namesub &&
                                                        <ul className="sub-menu">
                                                            {
                                                                data.namesub.map((submenu) => (
                                                                    <li key={submenu.id} className={
                                                                        pathname === submenu.links
                                                                            ? "menu-item current-item"
                                                                            : "menu-item"
                                                                    }><Link to={submenu.links}>{submenu.sub}</Link></li>
                                                                ))
                                                            }
                                                        </ul>
                                                    }
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </nav>
                                <div className="flat-search-btn flex">
                                    <WalletButton />
                                    {/*<NetworkButton />*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DarkMode />
        </header>
    );
}

export default HeaderLeague;
