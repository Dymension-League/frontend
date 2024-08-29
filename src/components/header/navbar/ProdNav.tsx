import React, { RefObject } from "react";
import { FaFaucet } from "react-icons/fa";

interface ProdNavProps {
  menuLeft: RefObject<HTMLElement>;
}

const ProdNav: React.FC<ProdNavProps> = ({ menuLeft }) => {
  return (
    <nav id="main-nav" className="main-nav" ref={menuLeft}>
      <ul id="menu-primary-menu" className="menu">
        <li className="menu-item">
          <a
            href="https://faucet.dymension-league.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center" }}
          >
            <FaFaucet  size={30} style={{ marginRight: "8px" }} />
            Faucet
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default ProdNav;
