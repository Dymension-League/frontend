import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DarkMode from "./DarkMode";
import WalletButton from "./WalletButton";
import NetworkButton from "./NetworkButton";
import { MdOutlineRocketLaunch } from "react-icons/md";
import ProdNav from "./navbar/ProdNav";
import TestNav from "./navbar/TestNav";

const Header: React.FC = () => {
  const isProdEnv = process.env.REACT_APP_PROD_ENV === "true";

  const headerRef = useRef<HTMLElement>(null);
  const menuLeft = useRef<HTMLElement>(null);
  const btnToggle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  }, []);

  const isSticky = () => {
    const header = document.querySelector(".js-header");
    if (header) {
      const scrollTop = window.scrollY;
      scrollTop >= 300
        ? header.classList.add("is-fixed")
        : header.classList.remove("is-fixed");
      scrollTop >= 400
        ? header.classList.add("is-small")
        : header.classList.remove("is-small");
    }
  };

  const menuToggle = () => {
    if (menuLeft.current && btnToggle.current) {
      menuLeft.current.classList.toggle("active");
      btnToggle.current.classList.toggle("active");
    }
  };

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const handleOnClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <header
      id="header_main"
      className="header_1 header_2 style2 js-header"
      ref={headerRef}
    >
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div id="site-header-inner">
              <div className="wrap-box flex">
                <div id="site-logo" className="clearfix">
                  <div id="site-logo-inner">
                    <Link
                      to="/"
                      rel="home"
                      className="main-logo"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <MdOutlineRocketLaunch size={70} color="#fff" />
                      <span
                        className="logo-text"
                        style={{
                          color: "#fff",
                          marginLeft: "10px",
                          fontSize: "32px",
                          lineHeight: "1.2",
                          fontWeight: "bold",
                        }}
                      >
                        Dymension
                        <br />
                        League
                      </span>
                    </Link>
                  </div>
                </div>
                <div
                  className="mobile-button"
                  ref={btnToggle}
                  onClick={menuToggle}
                >
                  <span></span>
                </div>

                {/* Conditional rendering based on environment */}
                {isProdEnv ? (
                  <ProdNav menuLeft={menuLeft} />
                ) : (
                  <TestNav
                    menuLeft={menuLeft}
                    handleOnClick={handleOnClick}
                    activeIndex={activeIndex}
                  />
                )}

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
};

export default Header;
