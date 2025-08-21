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
      whiteSpace: "normal",
      wordWrap: "break-word",
      maxWidth: "150px",
      textAlign: "center",
    },
  },
};

const ListAdmin = () => {
  const [role, setRole] = useState(null);
  const [adminData, setAdminData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage] = useState(10); // Fixed at 10 per page
  const [currentPage, setCurrentPage] = useState(1);
  const [pending, setPending] = useState(false);
  const [modalName, setModalName] = useState("Admin")
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

  const fetchAdmin = async (page) => {
    setPending(true);
    try {
      const res = await axios.get(
        `https://admin-backend-rrt2.onrender.com/api/view?page=${page}&limit=${perPage}`
      );
      setAdminData(res.data.data);
      setTotalRows(res.data.total);
    } catch (err) {
      console.error("Error fetching properties", err);
    }
    setPending(false);
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
    fetchAdmin(currentPage);
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
        `https://admin-backend-rrt2.onrender.com/api/${selectedId}`
      );
      fetchAdmin(currentPage);
      closeModal();
    } catch (error) {
      console.error("Delete failed", error);
      closeModal();
    }
  };

  const columns = (onEdit) => [
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      width: "150px",
      wrap: true,
    },
    { name: "Role", selector: (row) => row.role, width: "150px", wrap: true },
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
      width: "70px",
      wrap: true,
    },
  ];

  const filteredAdmin = adminData.filter((admin) =>
    Object.values(admin).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className="p-2 max-w-full md:max-w-[800px] lg:w-[400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <p className="font-bold text-[24px] md:text-[28px] whitespace-nowrap">
          List Admin
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
        data={filteredAdmin}
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
        modalName={modalName}
      />
    </div>
  );
};

export default ListAdmin;
