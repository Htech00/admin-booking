import React, { useState, useEffect, useRef } from "react";
import { PiBuildingApartmentLight } from "react-icons/pi";
import toast from "react-hot-toast";

const UpdateProperties = ({ isOpen, onClose, propertyId }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [formValues, setFormValues] = useState({
    title: "",
    propertyType: "",
    city: "",
    area: "",
    score: "",
    reviewCount: "",
    rooms: "",
    bathrooms: "",
    size: "",
    pricePerNight: "",
    amenities: "",
    description: "",
  });

  // Automatically Fetch the Coordinates(longitude, Latitude)
  const fetchCoordinates = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=cec03674be1448e7a95d863efdf90eb4`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setCoordinates({ lat, lng });
      } else {
        setCoordinates(null);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;

      try {
        const res = await fetch(
          `https://admin-backend-rrt2.onrender.com/api/property/${propertyId}/each`
        );
        if (!res.ok) throw new Error("Failed to fetch property");
        const data = await res.json();
        setFormValues({
          title: data.title || "",
          propertyType: data.propertyType || "",
          city: data.city || "",
          area: data.area || "",
          score: data.score || "",
          reviewCount: data.reviewCount || "",
          rooms: data.rooms || "",
          bathrooms: data.bathrooms || "",
          size: data.size || "",
          pricePerNight: data.pricePerNight || "",
          amenities: data.amenities || "",
          description: data.description || "",
        });
      } catch (err) {
        toast.error("Failed to load property data.");
      }
    };

    if (isOpen) {
      fetchProperty();
    }

    const delayDebounce = setTimeout(() => {
      if (city.trim() !== "") {
        fetchCoordinates(city);
      }
    }, 800); // wait 800ms after typing stops

    return () => clearTimeout(delayDebounce); // cleanup
  }, [isOpen, propertyId, city]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!files.every((f) => validTypes.includes(f.type))) {
      toast.error("Only image files (jpg/jpeg/png/webp) are allowed");
      e.target.value = null;
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    const data = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("longitude", coordinates.lng);
    data.append("latitude", coordinates.lat);
    images.forEach((img) => data.append("images", img));

    try {
      const res = await fetch(
        `https://admin-backend-rrt2.onrender.com/api/property/update/${propertyId}`,
        {
          method: "PUT",
          body: data,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert("Upload failed: " + (err.error || "Unknown error"));
      } else {
        toast.success("Property updated successfully!", { duration: 5000 });
        onClose();
        setImages([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
        // Optional: onClose();
      }
    } catch (err) {
      toast.error("Something went wrong: " + err.message, { duration: 5000 });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-auto ${
        isOpen ? "" : "hidden"
      }`}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Modal Box */}
      <div className="mt-40 z-10 bg-[#edeeecf2] max-w-full md:max-w-[1000px] w-full mx-4 md:mx-auto my-10 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-3 items-center p-6">
          <PiBuildingApartmentLight className="text-[40px] md:text-[50px] text-[#0c36c2]" />
          <h2
            id="update-property-title"
            className="text-2xl md:text-3xl font-bold text-[#1f2937]"
          >
            Update Property
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#ffffff] shadow-md rounded-lg p-4 md:p-6 space-y-6"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="e.g. Villa Family Resort"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
                required
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Property Type
              </label>
              <select
                name="propertyType"
                value={formValues.propertyType}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
              >
                <option value="" disabled>
                  -- Select Property Type --
                </option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Hotel">Hotel</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formValues.city}
                onChange={(e) => {
                  handleChange(e);
                  fetchCoordinates(e.target.value);
                }}
                placeholder="e.g. Lagos"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
                required
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Area
              </label>
              <input
                type="text"
                name="area"
                value={formValues.area}
                onChange={handleChange}
                placeholder="e.g. Victoria Island"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
                required
              />
            </div>

            {/* Longitude */}
            {coordinates && (
              <div className="hidden">
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  name="longitude"
                  value={coordinates.lng}
                  disabled
                  placeholder="e.g. 43.4455"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
                  required
                />
              </div>
            )}

            {/* Latitude */}
            {coordinates && (
              <div className="hidden">
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  name="latitude"
                  value={coordinates.lat}
                  disabled
                  placeholder="e.g. 3.4557"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
                  required
                />
              </div>
            )}

            {/* Score */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                name="score"
                value={formValues.score}
                onChange={handleChange}
                placeholder="e.g. 4.8"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
              />
            </div>

            {/* Review Count */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Review Count
              </label>
              <input
                type="number"
                name="reviewCount"
                value={formValues.reviewCount}
                onChange={handleChange}
                placeholder="e.g. 21"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
              />
            </div>

            {/* Rooms */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Rooms
              </label>
              <input
                type="number"
                name="rooms"
                value={formValues.rooms}
                onChange={handleChange}
                placeholder="e.g. 4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
                required
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formValues.bathrooms}
                onChange={handleChange}
                placeholder="e.g. 2"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
                required
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Size (m²)
              </label>
              <input
                type="number"
                name="size"
                value={formValues.size}
                onChange={handleChange}
                placeholder="e.g. 42.0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
                required
              />
            </div>

            {/* Price per Night */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Price per Night (#)
              </label>
              <input
                type="number"
                name="pricePerNight"
                value={formValues.pricePerNight}
                onChange={handleChange}
                placeholder="e.g. 152"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
                required
              />
            </div>

            {/* Amenities & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Amenities
                </label>
                <textarea
                  name="amenities"
                  value={formValues.amenities}
                  onChange={handleChange}
                  placeholder="e.g. Free WiFi, Swimming Pool, Parking..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleChange}
                  placeholder="Write a short description..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-[#0c36c2] focus:outline-none"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="text-center flex pt-4 gap-3 justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                onClose(propertyId);
              }}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmit}
              className="bg-[#0c36c2] text-white px-6 py-2 rounded-md hover:bg-[#0c36c2]/90 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmit ? "Updating..." : "Update Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProperties;
