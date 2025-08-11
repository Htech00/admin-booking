import React from "react";
import { MdOutlineSignalCellularAlt } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa6";
import { PiBuildingApartmentLight } from "react-icons/pi";

const Dashboard = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-10 items-center lg:justify-between">
      <div className="shadow-2xl">
        <div className="flex flex-col bg-white gap-4 p-5 w-[300px]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-[25px] text-[#fa6328] font-medium">30200</p>
              <p className="text-gray-400">Total Properties</p>
            </div>
            <MdOutlineSignalCellularAlt className="text-[50px] text-gray-500" />
          </div>
        </div>
        <div className="flex justify-between px-5 py-3 items-center bg-gradient-to-r from-[#fa6328] to-[#ffc2a6] text-white">
          <p>% change</p>
          <FaArrowTrendUp />
        </div>
      </div>

      <div className="shadow-2xl">
        <div className="flex flex-col bg-white gap-4 p-5 w-[300px]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-[25px] text-[#17ed50] font-medium">2200</p>
              <p className="text-gray-500">Total Users</p>
            </div>
            <FaUsers className="text-[50px] text-gray-500" />
          </div>
        </div>
        <div className="flex justify-between px-5 py-3 items-center bg-gradient-to-r from-[#8aeda4] to-[#c4f3d1] text-white">
          <p>% change</p>
          <FaArrowTrendUp />
        </div>
      </div>

      <div className="shadow-2xl">
        <div className="flex flex-col bg-white gap-4 p-5 w-[300px]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-[25px] text-[#f55b98] font-medium">5000</p>
              <p className="text-gray-500">Booked Properties</p>
            </div>
            <PiBuildingApartmentLight className="text-[50px] text-gray-500" />
          </div>
        </div>
        <div className="flex justify-between px-5 py-3 items-center bg-gradient-to-r from-[#f55b98] to-[#fcb3cf] text-white">
          <p>% change</p>
          <FaArrowTrendUp />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
