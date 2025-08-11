import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "black",
      color: "white",
      fontSize: "16px",
      fontWeight: "bolder",
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

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openModal = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedId(null);
    setModalOpen(false);
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
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "City", selector: (row) => row.city },
    { name: "Area", selector: (row) => row.area },
    { name: "Rating", selector: (row) => row.score },
    { name: "Reviews", selector: (row) => row.reviewCount },
    { name: "Rooms", selector: (row) => row.rooms },
    { name: "Bathrooms", selector: (row) => row.bathrooms },
    { name: "Size (sq ft)", selector: (row) => row.size },
    { name: "Price/Night", selector: (row) => `₦${row.pricePerNight}` },
    {
      name: "Image",
      selector: (row) => (
        <img
          src={row.images[0]}
          alt={row.title}
          className="h-20 w-20 object-cover"
        />
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-1">
          <button
            className="text-[#f2594e] flex w-[50px] cursor-pointer"
            onClick={() => openModal(row._id)}
          >
            <MdDeleteOutline />
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filteredProperties = properties.filter((property) =>
    Object.values(property).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className="p-2 max-w-full md:max-w-[1000px] lg:w-[1200px] mx-auto">
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
        columns={columns(handleEdit, handleConfirmDelete)}
        data={filteredProperties}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        progressPending={pending}
        customStyles={customStyles}
        highlightOnHover
        pointerOnHover
        responsive
        noHeader
      />

      <DeleteConfirmModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ViewProperties;
