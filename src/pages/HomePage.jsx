import React, { useEffect, useState } from "react";
import NavBar from "../components/navBar";
import SideBar from "../components/SideBar";
import Dashboard from "./Dashboard";
import AddProperties from "./AddProperties";
import ViewProperties from "./ViewProperties";
import ViewUsers from "./ViewUsers";
import AddAdmin from "./AddAdmin";

const HomePage = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeOut = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timeOut);
  }, [activeNav]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div
          className="flex mx-auto items-center justify-center mt-12 gap-3"
          style={{
            color: "var(--text-main)",
          }}
        >
          <i className="text-base">Loading...</i>
        </div>
      );
    }

    switch (activeNav) {
      case "Dashboard":
        return <Dashboard />;
      case "Add Property":
        return <AddProperties />;
      case "View All Properties":
        return <ViewProperties />;
      case "View All Users":
        return <ViewUsers />;
      case "Add Admin":
        return <AddAdmin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <NavBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />

      {/* Main layout */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar: show/hide on mobile */}
        <div className={`${sideBarOpen ? "block" : "hidden"} md:block`}>
          <SideBar
            show={sideBarOpen}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
          />
        </div>

        {/* Main content */}
        <div
          className={`flex-1 transition-all duration-300 
            ${sideBarOpen ? "justify-center" : "justify-start px-4"} 
            flex`}
        >
          <div className="w-full max-w-[100%] sm:max-w-[700px] md:max-w-[800px] mt-[100px] px-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
