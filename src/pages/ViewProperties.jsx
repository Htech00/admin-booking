import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { BiEditAlt } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import UpdateProperties from "../components/UpdateProperties";

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "white",
      color: "#3e4040",
      fontSize: "14px",
      fontWeight: "bold",
      whiteSpace: "normal",
      wordWrap: "break-word",
      maxWidth: "150px",
      textAlign: "center",
    },
  },
};

const ViewProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage] = useState(10); // Fixed at 10 per page
  const [currentPage, setCurrentPage] = useState(1);
  const [pending, setPending] = useState(false);
  const [modalName, setModalName] = useState("Properties");
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openModal = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedId(null);
    setModalOpen(false);
  };

  const UpdateModal = (id) => {
    setSelectedId(id);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedId(null);
    setUpdateModalOpen(false);
  };

  const fetchProperties = async (page) => {
    setPending(true);
    try {
      const res = await axios.get(
        `https://admin-backend-rrt2.onrender.com/api/property/view?page=${page}&limit=${perPage}`
      );
      setProperties(res.data.data);
      setTotalRows(res.data.total);
    } catch (err) {
      console.error("Error fetching properties", err);
    }
    setPending(false);
  };

  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (row) => {
    alert(`Edit ${row.title}`);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `https://admin-backend-rrt2.onrender.com/api/property/${selectedId}`
      );
      fetchProperties(currentPage);
      closeModal();
    } catch (error) {
      console.error("Delete failed", error);
      closeModal();
    }
  };

  const columns = (onEdit) => [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      width: "150px",
      wrap: true,
    },
    { name: "City", selector: (row) => row.city, width: "150px", wrap: true },
    { name: "Area", selector: (row) => row.area, width: "150px", wrap: true },
    {
      name: "Rating",
      selector: (row) => row.score,
      width: "100px",
      wrap: true,
    },
    {
      name: "Reviews",
      width: "100px",
      wrap: true,
      selector: (row) => row.reviewCount,
    },
    { name: "Rooms", width: "100px", wrap: true, selector: (row) => row.rooms },
    {
      name: "Bath",
      width: "70px",
      wrap: true,
      selector: (row) => row.bathrooms,
    },
    {
      name: "Size",
      width: "70px",
      wrap: true,
      selector: (row) => row.size,
    },
    {
      name: "Amenities",
      width: "100px",
      wrap: true,
      selector: (row) => row.amenities.join(", "),
    },
    {
      name: "Desc",
      width: "100px",
      wrap: true,
      selector: (row) => row.description,
    },
    {
      name: "Price",
      selector: (row) =>
        `${row.pricePerNight.toLocaleString("en-NG", {
          style: "currency",
          currency: "NGN",
        })}`,
      width: "100px",
      wrap: true,
    },

    {
      name: "Image",
      selector: (row) => (
        <div className=" bg-[#ebebeb] items-center justify-center flex rounded-lg  h-[50px] w-[60px] m-1">
          <img
          src={row.images[0]}
          alt={row.title}
          className="h-[40px] w-[50px]  rounded-md object-cover"
        />
        </div>
        
      ),
      width: "100px",
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3">
            <button
              className="text-[#f2594e] text-[20px] h-[35px] flex justify-center items-center w-[40px] rounded-lg bg-[#faf3f0] cursor-pointer hover:bg-[#f2594e] hover:text-[white]"
              onClick={() => UpdateModal(row._id)}
            >
              <BiEditAlt />
            </button>

          <button
            className="text-[#fc6f7b] text-[20px] h-[35px] flex justify-center items-center w-[40px] rounded-lg bg-[#faebec] cursor-pointer hover:bg-[#fc6f7b] hover:text-[white]"
            onClick={() => openModal(row._id)}
          >
            <AiOutlineDelete  />
          </button>
        </div>
      ),
      width: "100px",
      wrap: true,
    },
  ];

  const filteredProperties = properties.filter((property) =>
    Object.values(property).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className="p-2 max-w-full md:max-w-[1000px] lg:w-[1000px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <p className="font-bold text-[24px] md:text-[28px] whitespace-nowrap">
          Property Listings
        </p>
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 border border-gray-400 rounded w-full md:w-1/3"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns(handleConfirmDelete)}
        data={filteredProperties}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        progressPending={pending}
        customStyles={customStyles}
        pointerOnHover
        responsive
        noHeader
      />

      <DeleteConfirmModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        modalName={modalName}
      />

      <UpdateProperties
        isOpen={updateModalOpen}
        onClose={closeUpdateModal}
        propertyId={selectedId}
      />
    </div>
  );
};

export default ViewProperties;
