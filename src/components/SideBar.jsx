import React, { useState } from "react";
import { RiDashboardFill } from "react-icons/ri";
import { PiBuildingApartmentDuotone } from "react-icons/pi";
import { LuView } from "react-icons/lu";
import { FaUsers } from "react-icons/fa6";
import { RiAdminLine } from "react-icons/ri";
import { SiAdminer } from "react-icons/si";
import { useAuth } from "../context/AuthContext";

const SideBar = ({ activeNav, setActiveNav, show }) => {
  const {username} = useAuth();
  const navigation = [
    {
      name: "Dashboard",
      icon: <RiDashboardFill  className="sm:text-[18px] text-[14px] text-[#fa6328]" />,
    },

    {
      name: "Add Property",
      icon: <PiBuildingApartmentDuotone   className="sm:text-[18px] text-[14px] text-[#85baf2]" />,
    },

    {
      name: "View All Properties",
      icon: <LuView  className="sm:text-[18px] text-[14px] text-[#446f75]" />,
    },

    {
      name: "View All Users",
      icon: <FaUsers className="sm:text-[18px] text-[14px] text-[#707a57]" />,
    },

    {
      
      name: "Add Admin",
      icon: <RiAdminLine className="sm:text-[18px] text-[14px] text-[#826153]" />,
      role:"super_admin"
    },
    {
      name: "View All Admin",
      icon: <SiAdminer className="sm:text-[18px] text-[14px] text-[#2470f2]" />,
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
      <div className="flex flex-col">
        <p className="text-[#9b9494] font-medium p-5">Navigation</p>

        <div className="flex flex-col gap-7 ">
          {filteredNavigation.map(({ name, icon }) => (
            <a 
            className={`flex py-3 px-5  hover:text-white gap-5 text-white/70 cursor-pointer key={name} ${activeNav === name ? 'border-l-[#fa6328] border-l-2 rounded-md bg-[#3d4457]/20 text-white/80': ''}`}
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
