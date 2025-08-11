import React, { useState } from "react";
import { PiBuildingApartmentLight } from "react-icons/pi";
import toast from "react-hot-toast";

const AddProperties = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    city: "",
    area: "",
    score: "",
    reviewCount: "",
    rooms: "",
    bathrooms: "",
    size: "",
    pricePerNight: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const isValid = selectedFiles.every((file) =>
      validTypes.includes(file.type)
    );

    if (!isValid) {
      toast.error("Only image files (jpg, jpeg, png, webp) are allowed");
      e.target.value = ""; // Clear the file input
      return;
    }

    setImages(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    const data = new FormData();
    for (let key in formValues) {
      data.append(key, formValues[key]);
    }
    for (let i = 0; i < images.length; i++) {
      data.append("images", images[i]);
    }

    try {
      const res = await fetch(
        "https://admin-backend-rrt2.onrender.com/api/property/create",
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        alert("Upload failed: " + (errData.error || "Unknown error"));
        return;
      }
      toast.success("Property Uploaded Successfully!", { duration: 5000 });
      setFormValues({
        title: "",
        city: "",
        area: "",
        score: "",
        reviewCount: "",
        rooms: "",
        bathrooms: "",
        size: "",
        pricePerNight: "",
      });
      setImages([]);
      document.querySelector(".images").value = "";
    } catch (error) {
      toast.error("Something went wrong: " + error.message, { duration: 5000 });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="max-w-full md:max-w-[1000px] mx-auto px-4 md:px-6 bg-[#edeeecf2]">
      <div className="flex flex-col md:flex-row gap-3 items-center pb-5">
        <PiBuildingApartmentLight className="text-[40px] md:text-[50px] text-[#0c36c2]" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Add New Property</h2>
      </div>

      <form
        className="bg-white shadow-md rounded-lg p-4 md:p-6 space-y-6"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              placeholder="e.g. Villa Family Resort"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formValues.city}
              onChange={handleChange}
              placeholder="e.g. Bandung"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area
            </label>
            <input
              type="text"
              name="area"
              value={formValues.area}
              onChange={handleChange}
              placeholder="e.g. Dago Pakar"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <input
              type="number"
              step="0.1"
              name="score"
              value={formValues.score}
              onChange={handleChange}
              placeholder="e.g. 4.8"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Review Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Count
            </label>
            <input
              type="number"
              name="reviewCount"
              value={formValues.reviewCount}
              onChange={handleChange}
              placeholder="e.g. 21"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rooms
            </label>
            <input
              type="number"
              name="rooms"
              value={formValues.rooms}
              onChange={handleChange}
              placeholder="e.g. 4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formValues.bathrooms}
              onChange={handleChange}
              placeholder="e.g. 2"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size (m²)
            </label>
            <input
              type="number"
              name="size"
              value={formValues.size}
              onChange={handleChange}
              placeholder="e.g. 42.0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Night (#)
            </label>
            <input
              type="number"
              name="pricePerNight"
              value={formValues.pricePerNight}
              onChange={handleChange}
              placeholder="e.g. 152"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images
            </label>
            <input
              type="file"
              name="images"
              onChange={handleImageChange}
              multiple
              className="images w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[#0c36c2] file:rounded-md file:text-white file:cursor-pointer hover:file:bg-[#0c36c2]/90"
              required
            />
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-[#0c36c2] text-white px-6 py-2 rounded-md hover:bg-[#0c36c2]/90 transition-all cursor-pointer"
            disabled={isSubmit}
          >
            {isSubmit ? "Submitting..." : "Add Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperties;
