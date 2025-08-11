import React from "react";


const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Transparent overlay with just blur, no color */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Modal content */}
      <div className="relative z-50 bg-white rounded-md p-6 w-100 shadow-xl text-center">
        <h2 className="text-lg flex items-center justify-center font-semibold mb-4">
            Confirm Deletion 
        </h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete this Property?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded cursor-pointer"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded cursor-pointer"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
