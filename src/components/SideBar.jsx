import React, { useState } from "react";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { CiHome } from "react-icons/ci";
import { TfiViewListAlt } from "react-icons/tfi";
import { FaUsers } from "react-icons/fa6";
import { RiAdminLine } from "react-icons/ri";

const SideBar = ({ activeNav, setActiveNav, show }) => {
  const navigation = [
    {
      name: "Dashboard",
      icon: <CiHome className="text-[18px]" />,
    },

    {
      name: "Add Property",
      icon: <HiOutlineSquaresPlus className="text-[18px]" />,
    },

    {
      name: "View All Properties",
      icon: <TfiViewListAlt className="text-[18px]" />,
    },

    {
      name: "View All Users",
      icon: <FaUsers className="text-[18px]" />,
    },

    {
      name: "Add Admin",
      icon: <RiAdminLine className="text-[18px]" />,
    },
  ];

  return (
    <div
      className={`fixed  h-full w-[250px] bg-[#3d4457] text-white mt-15 z-1 transition-transform duration-300 ease-in-out ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-col p-5">
        <p className="text-[#9b9494] font-medium">Navigation</p>

        <div className="flex flex-col gap-7 py-7">
          {navigation.map(({ name, icon }) => (
            <a 
            className={`flex py-3 pl-1 hover:text-white gap-5 text-white/70 cursor-pointer key={name} ${activeNav === name ? 'border-l-[#fa6328] border-l-4 rounded-md bg-[#3d4457]/20 text-white/80': ''}`}
            key={name}
            onClick={() => {setActiveNav(name)}}
            >
              {icon}
              {name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
