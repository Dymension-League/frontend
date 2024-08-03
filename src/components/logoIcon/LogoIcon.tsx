import React from "react";
import { MdOutlineRocketLaunch } from "react-icons/md";

interface IconProps {
  className: string;
}

const LogoIcon: React.FC<IconProps> = ({ className }) => {
  return <MdOutlineRocketLaunch className={className} />;
};

export const logoheader: React.FC = () => <LogoIcon className="icon-default" />;
export const logoheader2x: React.FC = () => <LogoIcon className="icon-2x" />;
export const logodark: React.FC = () => <LogoIcon className="icon-dark" />;
export const logodark2x: React.FC = () => <LogoIcon className="icon-dark-2x" />;
