import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { LuLogOut } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";

import SideBar from "./SideBar";

const navBar = ({sideBarOpen, setSideBarOpen}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  return (
    <div className="fixed w-full z-50 ">
      <div className="flex justify-between items-center bg-[#f0eeee] shadow-2xl">
        <div className="flex items-center bg-[#3d4457] h-15 w-[250px] justify-center gap-5 z-10 border-b-1 border-[#1e2f4de7]">
          <p className="text-[18px] font-medium text-white/70 ">
            Admin Dashboard{" "}
          </p>
          <button
            className="flex h-3 w-5 rounded-xl border-white/70 border items-center cursor-pointer"
            onClick={() => setSideBarOpen(!sideBarOpen)}
          >
            <div
              className={`h-2 w-2 rounded-full border-white/70 border-2 ${
                sideBarOpen ? "translate-x-2" : ""
              }`}
            ></div>
          </button>
        </div>
        <div className="flex items-center h-15  justify-center gap-10">
          <div className="relative cursor-pointer">
            <IoMdNotificationsOutline className="text-[20px]" />
            <div className="absolute top-[-11px] right-[-5px] items-center h-5 w-5 rounded-full bg-[#fa6328]">
              <p className="text-center text-[12px] font-bold">5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaRegUserCircle />
            <p>John Doe</p>
            {/* View Switch Dropdown */}
              <div className="flex items-center">
                <FaChevronDown 
                className="text-[12px] mr-3 text-black cursor-pointer"
                onClick={toggleDropdown}
                 />
              </div>
                
              
            
          </div>

          {dropdownOpen && (
            <div className="absolute right-[10px] mt-[30px] p-4 w-[150px] bg-white shadow-lg rounded-md overflow-hidden top-8 z-10 cursor-pointer space-y-4">
              <div className="flex items-center gap-3">
                <CiSettings className="text-[20px]" />
                <a className=" text-gray-700 text-[16px]">Setting</a>
              </div>

              <div className="flex items-center gap-3">
                <LuLogOut className="text-[15px]" />
                <a className=" text-gray-700 text-[16px]">Logout</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default navBar;
