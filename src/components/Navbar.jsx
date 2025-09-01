import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaRegUserCircle } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { LuLogOut } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NotificationBox from "./NotificationBox";
import io from "socket.io-client";
import axios from "axios";

// Connect to backend Socket.IO
const socket = io(import.meta.env.VITE_API_BASE || "http://localhost:5000");

const Nav = ({ sideBarOpen, setSideBarOpen }) => {
  const { username, logout } = useAuth();
  const adminId = username?.username; // 🔥 Use logged-in username as adminId

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const bellRef = useRef(null);

  // Sidebar toggle
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleResize = () => {
    if (window.innerWidth < 640) setSideBarOpen(false);
    else setSideBarOpen(true);
  };

  // Close notifications when clicking outside
  useEffect(() => {
    handleResize();
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSideBarOpen]);

  // Socket.IO + Fetch unread notifications
  useEffect(() => {
    if (!adminId) return;

    // Join admin room
    socket.emit("join", adminId);

    // Fetch unread from backend
    const fetchUnread = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE}/chat/admin/notifications/all`
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch unread messages:", err);
      }
    };

    fetchUnread();

    // Listen for real-time messages
    socket.on("receiveMessage", (msg) => {
      if (msg.receiverType === "admin" && msg.receiverId === adminId) {
        setNotifications((prev) => [msg, ...prev]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [adminId]);

  // Navigate to chat + mark messages as read
  const handleNotificationClick = async (notif) => {
    setOpen(false);
    navigate(`/chat/${notif.senderId}`);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE}/chat/read/${notif.senderId}`
      );

      // Remove unread from this sender
      setNotifications((prev) =>
        prev.filter((n) => n.senderId !== notif.senderId)
      );
    } catch (err) {
      console.error("❌ Failed to mark messages as read:", err);
    }
  };

  return (
    <div className="fixed w-full z-50">
      <div className="flex justify-between items-center bg-[#f0eeee] shadow-2xl">
        {/* Left Sidebar Toggle Desktop */}
        <div className="hidden sm:block">
          <div className="flex items-center bg-[#3d4457] h-16 w-[250px] justify-center gap-5 z-10 border-b border-[#1e2f4de7]">
            <p className="text-[18px] font-medium text-white/70">
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
        </div>

        {/* Left Sidebar Toggle Mobile */}
        <div className="block sm:hidden">
          <div className="flex items-center bg-[rgb(61,68,87)] h-16 w-[100px] justify-center gap-5 z-10 border-b border-[#1e2f4de7]">
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
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center h-16 justify-center gap-10">
          {/* Notifications */}
          <div ref={bellRef} className="relative cursor-pointer">
            <button
              onClick={() => setOpen(!open)}
              className="cursor-pointer relative"
            >
              <IoMdNotificationsOutline className="text-[20px]" />
              {notifications.length > 0 && (
                <div className="absolute top-[-8px] right-[-5px] flex items-center justify-center h-5 w-5 rounded-full bg-[#fa6328] text-white text-[12px] font-bold">
                  {notifications.length}
                </div>
              )}
            </button>

            {/* Notification Box */}
            {open && (
              <NotificationBox
                notifications={notifications}
                onClose={() => setOpen(false)}
                onNotificationClick={handleNotificationClick}
              />
            )}
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
