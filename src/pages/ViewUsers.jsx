import React, { useEffect, useState } from 'react'
import DataTable from "react-data-table-component";
import axios from "axios";

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

const ViewUsers = () => {
  const [userData, setUserData] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [totalRows, setTotalRows] = useState(0);
    const [perPage] = useState(10); // Fixed at 10 per page
    const [currentPage, setCurrentPage] = useState(1);
    const [pending, setPending] = useState(false);
  
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
  
  
    const fetchUsers = async (page) => {
      setPending(true);
      try {
        const res = await axios.get(
          `https://tidoy-backend-2-l1cj.onrender.com/api/auth/listUsers?page=${page}&limit=${perPage}`
        );
        setUserData(res.data.data);
        setTotalRows(res.data.total);
      } catch (err) {
        console.error("Error fetching properties", err);
      }
      setPending(false);
    };
  
    useEffect(() => {
      fetchUsers(currentPage);
    }, [currentPage]);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  

  
    const columns = (onEdit) => [
      { name: "Username", 
        selector: (row) => row.name, 
        sortable: true,
        width: "150px",
        wrap:true,
      },
      { name: "Email", 
        selector: (row) => row.email,
        width: "150px",
        wrap:true
      },
      { name: "Telephone", 
        selector: (row) => row.number,
        width: "150px",
        wrap:true
      },
      { name: "Created_at", 
        selector: (row) => row.createdAt,
        width: "150px",
        wrap:true
      },
      
    ];
  
    const filteredUser = userData.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  return (
    <div className="p-2 max-w-full md:max-w-[1000px] lg:w-[600px] mx-auto">
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
        columns={columns()}
        data={filteredUser}
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
    </div>
  )
}

export default ViewUsers
