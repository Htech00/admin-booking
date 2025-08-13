import React, { useState } from "react";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { CiHome } from "react-icons/ci";
import { TfiViewListAlt } from "react-icons/tfi";
import { FaUsers } from "react-icons/fa6";
import { RiAdminLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";

const SideBar = ({ activeNav, setActiveNav, show }) => {
  const {username} = useAuth();
  const navigation = [
    {
      name: "Dashboard",
      icon: <CiHome className="sm:text-[18px] text-[40px]" />,
    },

    {
      name: "Add Property",
      icon: <HiOutlineSquaresPlus className="sm:text-[18px] text-[40px]" />,
    },

    {
      name: "View All Properties",
      icon: <TfiViewListAlt className="sm:text-[18px] text-[40px]" />,
    },

    {
      name: "View All Users",
      icon: <FaUsers className="sm:text-[18px] text-[40px]" />,
    },

    {
      
      name: "Add Admin",
      icon: <RiAdminLine className="sm:text-[18px] text-[40px]" />,
      role:"super_admin"
    },
  ];

  // Only show items without a role OR items where the user has the required role
  const filteredNavigation = navigation.filter(
    (item) => !item.role || username?.role === item.role
  );

  return (
    <div
      className={`fixed  h-full sm:w-[250px] w-[100px] bg-[#3d4457] text-white mt-15 z-1 transition-transform duration-300 ease-in-out ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-col p-5">
        <p className="text-[#9b9494] font-medium">Navigation</p>

        <div className="flex flex-col gap-7 py-7">
          {filteredNavigation.map(({ name, icon }) => (
            <a 
            className={`flex py-3 pl-1 hover:text-white gap-5 text-white/70 cursor-pointer key={name} ${activeNav === name ? 'border-l-[#fa6328] border-l-4 rounded-md bg-[#3d4457]/20 text-white/80': ''}`}
            key={name}
            onClick={() => {setActiveNav(name)}}
            >
              {icon}
              <span className="hidden sm:block">
                {name}
              </span>
              
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
