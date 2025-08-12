import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { LuLogOut } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Nav = ({ sideBarOpen, setSideBarOpen }) => {
  const { username, token, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate()

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    logout(); // Clears context
    localStorage.removeItem("user"); // Clear saved user
    localStorage.removeItem("token"); // Clear saved token
    setDropdownOpen(false);
    navigate("/login")
  };

  return (
    <div className="fixed w-full z-50">
      <div className="flex justify-between items-center bg-[#f0eeee] shadow-2xl">
        
        {/* Left Sidebar Toggle */}
        <div className="flex items-center bg-[#3d4457] h-15 w-[250px] justify-center gap-5 z-10 border-b-1 border-[#1e2f4de7]">
          <p className="text-[18px] font-medium text-white/70 ">
            Admin Dashboard
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

        {/* Right Side Icons */}
        <div className="flex items-center h-15 justify-center gap-10">
          {/* Notifications */}
          <div className="relative cursor-pointer">
            <IoMdNotificationsOutline className="text-[20px]" />
            <div className="absolute top-[-11px] right-[-5px] items-center h-5 w-5 rounded-full bg-[#fa6328]">
              <p className="text-center text-[12px] font-bold">5</p>
            </div>
          </div>

          {/* User Profile */}
          <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={toggleDropdown}
          >
            <FaRegUserCircle />
            <p>Welcome {username?.username || ""}</p>
            <div className="flex items-center">
              <FaChevronDown
                className="text-[12px] mr-3 text-black cursor-pointer"
                onClick={toggleDropdown}
              />
            </div>
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-[10px] mt-[30px] p-4 w-[150px] bg-white shadow-lg rounded-md overflow-hidden top-8 z-10 space-y-4">
              <div className="flex items-center gap-3 cursor-pointer">
                <CiSettings className="text-[20px]" />
                <span className="text-gray-700 text-[16px]">Setting</span>
              </div>

              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={handleLogout}
              >
                <LuLogOut className="text-[15px]" />
                <span className="text-gray-700 text-[16px]">Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;