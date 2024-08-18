import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaTelegramPlane, FaYoutube, FaTiktok, FaDiscord, FaRocket } from 'react-icons/fa';
import logodark from '../../assets/images/logo/logo_dark.png';
import logofooter from '../../assets/images/logo/logo2.png';

const NewFooter = () => {
    const menus = [
        { name: 'Mint', links: '/mint-ships' },
        { name: 'Create Team', links: '/create-team' },
        { name: 'Enroll Team', links: '/enroll-team' },
        { name: 'Governance Simulator', links: '/governance-simulator' },
        { name: 'Bet', links: '/bet' },
        { name: 'Leaderboard', links: '/leaderboard' },
    ];

    const quickLinks = [
        { name: 'Privacy Policy', links: '/privacy-policy' },
        { name: 'Terms of Service', links: '/terms-of-service' },
        { name: 'Support', links: '/support' },
        { name: 'FAQ', links: '/faq' },
    ];

    const companyList = [
        { title: "Explore", link: "/explore-01" },
        { title: "Contact Us", link: "/contact-01" },
        { title: "Our Blog", link: "/blog" },
        { title: "FAQ", link: "/faq" },
    ];

    const socialList = [
        { icon: <FaTwitter />, link: "#" },
        { icon: <FaFacebook />, link: "#" },
        { icon: <FaTelegramPlane />, link: "#" },
        { icon: <FaYoutube />, link: "#" },
        { icon: <FaTiktok />, link: "#" },
        { icon: <FaDiscord />, link: "#" },
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
                                    {menus.map((item, index) => (
                                        <li key={index}><Link to={item.links}>{item.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-5 col-5">
                            <div className="widget widget-menu fl-st-3">
                                <h5 className="title-widget">Company</h5>
                                <ul>
                                    {companyList.map((item, index) => (
                                        <li key={index}><Link to={item.link}>{item.title}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-5 col-5">
                            <div className="widget widget-menu style-1">
                                <h5 className="title-widget">Quick Links</h5>
                                <ul>
                                    {quickLinks.map((item, index) => (
                                        <li key={index}><Link to={item.links}>{item.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-7 col-12">
                            <div className="widget widget-subscribe">
                                <h5 className="title-widget">Subscribe Us</h5>
                                <div className="form-subscribe">
                                    <form id="subscribe-form" action="#" method="GET" acceptCharset="utf-8" className="form-submit">
                                        <input name="email" className="email" type="email" placeholder="info@yourgmail.com" required />
                                        <button id="submit" name="submit" type="submit"><i className="icon-fl-send"></i></button>
                                    </form>
                                </div>
                                <div className="widget-social style-1 mg-t32">
                                    <ul>
                                        {socialList.map((item, index) => (
                                            <li key={index}><Link to={item.link}>{item.icon}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {isVisible && <Link onClick={scrollToTop} to='#' id="scroll-top"></Link>}
        </div>
    );
}

export default NewFooter;
