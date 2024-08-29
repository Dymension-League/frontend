import React, { RefObject } from "react";
import { Link, useLocation } from "react-router-dom";
import headerMenus, { HeaderMenuItem } from "../HeaderMenu/headerMenus";

interface TestNavProps {
  menuLeft: RefObject<HTMLElement>;
  handleOnClick: (index: number) => void;
  activeIndex: number | null;
}

const TestNav: React.FC<TestNavProps> = ({
  menuLeft,
  handleOnClick,
  activeIndex,
}) => {
  const { pathname } = useLocation();

  return (
    <nav id="main-nav" className="main-nav" ref={menuLeft}>
      <ul id="menu-primary-menu" className="menu">
        {headerMenus.map((data: HeaderMenuItem, index: number) => (
          <li
            key={data.id}
            onClick={() => handleOnClick(index)}
            className={`menu-item ${activeIndex === index ? "active" : ""}`}
          >
            <Link to={data.links}>{data.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TestNav;
