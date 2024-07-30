import React , { useRef , useState , useEffect } from 'react';
import { Link , useLocation } from "react-router-dom";
import menus from "../../pages/menu";
import DarkMode from './DarkMode';
import logoheader from '../../assets/images/logo/logo.png'
import logoheader2x from '../../assets/images/logo/logo@2x.png'
import logodark from '../../assets/images/logo/logo_dark.png'
import logodark2x from '../../assets/images/logo/logo_dark@2x.png'
import NetworkButton from "./NetworkButton";
import WalletButton from "./WalletButton";

const Header = () => {
    const { pathname } = useLocation();

    const headerRef = useRef (null)
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

    const menuLeft = useRef(null)
    const btnToggle = useRef(null)
    const btnSearch = useRef(null)

    const menuToggle = () => {
        menuLeft.current.classList.toggle('active');
        btnToggle.current.classList.toggle('active');
    }

    const searchBtn = () => {
        btnSearch.current.classList.toggle('active');
    }

    const [activeIndex, setActiveIndex] = useState(null);
    const handleOnClick = index => {
        setActiveIndex(index);
    };

    return (
        <header id="header_main" className="header_1 js-header" ref={headerRef}>
            <div className="themesflat-container">
                <div className="row">
                    <div className="col-md-12">
                        <div id="site-header-inner">
                            <div className="wrap-box flex">
                                <div id="site-logo" className="clearfix">
                                    <div id="site-logo-inner">
                                        <Link to="/" rel="home" className="main-logo">
                                            <img className='logo-dark'  id="logo_header" src={logodark} srcSet={`${logodark2x}`} alt="nft-gaming" />
                                            <img className='logo-light'  id="logo_header" src={logoheader} srcSet={`${logoheader2x}`} alt="nft-gaming" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="mobile-button" ref={btnToggle} onClick={menuToggle}><span></span></div>
                                <nav id="main-nav" className="main-nav" ref={menuLeft} >
                                    <ul id="menu-primary-menu" className="menu">
                                        {
                                            menus.map((data,index) => (
                                                <li key={index} onClick={()=> handleOnClick(index)} className={`menu-item ${data.namesub ? 'menu-item-has-children' : '' } ${activeIndex === index ? 'active' : ''} ` }   >
                                                    <Link to={data.links}>{data.name}</Link>
                                                    {
                                                        data.namesub &&
                                                        <ul className="sub-menu" >
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
                                    <NetworkButton className="sc-button header-slider style style-1 wallet fl-button pri-1"/>
                                    <WalletButton className="sc-button header-slider style style-1 wallet fl-button pri-1"/>
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

export default Header;
