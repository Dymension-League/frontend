import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket } from 'react-icons/fa';

const Footer = () => {
    const menus = [
        { name: 'Mint', links: '/mint-ships' },
        { name: 'Create Team', links: '/create-team' },
        { name: 'Enroll Team', links: '/enroll-team' },
        { name: 'Governance Simulator', links: '/governance-simulator' },
        { name: 'Bet', links: '/bet' },
        { name: 'Leaderboard', links: '/leaderboard' },
    ];

    const socialList = [
        { icon: "fab fa-twitter", link: "#" },
        { icon: "fab fa-facebook", link: "#" },
        { icon: "fab fa-telegram-plane", link: "#" },
        { icon: "fab fa-youtube", link: "#" },
        { icon: "icon-fl-tik-tok-2", link: "#" },
        { icon: "icon-fl-vt", link: "#" },
    ];

    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div>
            <footer id="footer" className="footer-light-style clearfix bg-style">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-lg-3 col-md-12 col-12">
                            <div className="widget widget-logo">
                                <div className="logo-footer" id="logo-footer">
                                    <Link to="/">
                                        <FaRocket size={30} />
                                        <span className='logo-text' style={{ color: '#fff', marginLeft: '10px' }}>Dymension League</span>
                                    </Link>
                                </div>
                                <p className="sub-widget-logo">Embark on epic space adventures, form powerful alliances, and dominate the cosmos in Dymension League!</p>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-5 col-5">
                            <div className="widget widget-menu style-1">
                                <h5 className="title-widget">Menu</h5>
                                <ul>
                                    {
                                        menus.map((item, index) => (
                                            <li key={index}><Link to={item.links}>{item.name}</Link></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-7 col-12">
                            <div className="widget widget-social style-1 mg-t32">
                                <ul>
                                    {
                                        socialList.map((item, index) => (
                                            <li key={index}><Link to={item.link}><i className={item.icon}></i></Link></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {
                isVisible &&
                <Link onClick={scrollToTop} to='#' id="scroll-top"></Link>
            }
        </div>
    );
}

export default Footer;
