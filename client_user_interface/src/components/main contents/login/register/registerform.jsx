import React, { useState } from "react";
import "tailwindcss/tailwind.css";

const RegistrationForm = () => {
  const [numVehicles, setNumVehicles] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    vehicles: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  async function registerUser() {
    console.log("ffffff");
   // e.preventDefault();
    const userData = {
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      walletBalance: formData.walletBalance,
      vehicles: formData.vehicles.map((vehicle) => ({
        uniqueIdentification: vehicle.uid,
        vehicleNumber: vehicle.vehicleNumber,
        category: vehicle.category,
        phoneNumber: formData.phoneNumber,
      })),
    };
    try {
      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
      } else {
        console.error("Registration failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const handleVehicleChange = (index, e) => {
    const { name, value } = e.target;
    const newVehicles = [...formData.vehicles];
    newVehicles[index] = { ...newVehicles[index], [name]: value };
    setFormData({ ...formData, vehicles: newVehicles });
  };

  return (
    <div className="p-4 max-w-md mx-auto border sm:max-w-lg sm:mx-auto sm:p-8 lg:max-w-full lg:mx-0 lg:p-8">
      <form className="lg:w-full lg:flex lg:flex-col lg:items-center">
        <div className="mb-4 w-full">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300"
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300"
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300"
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block text-gray-700">Number of Vehicles</label>
          <select
            value={numVehicles}
            onChange={(e) => setNumVehicles(Number(e.target.value))}
            className="w-full p-2 border border-gray-300"
          >
            <option value="0">Select Number of Vehicles</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        {[...Array(numVehicles)].map((_, index) => (
          <div key={index}>
            <div className="mb-4 w-full">
              <label className="block text-gray-700">
                Unique Identification for Vehicle {index + 1}
              </label>
              <input
                type="text"
                name="uid"
                value={formData.vehicles[index]?.uid || ""}
                onChange={(e) => handleVehicleChange(index, e)}
                className="w-full p-2 border border-gray-300"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block text-gray-700">
                Vehicle Number for Vehicle {index + 1}
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicles[index]?.vehicleNumber || ""}
                onChange={(e) => handleVehicleChange(index, e)}
                className="w-full p-2 border border-gray-300"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block text-gray-700">
                Category for Vehicle {index + 1}
              </label>
              <input
                type="text"
                name="category"
                value={formData.vehicles[index]?.category || ""}
                onChange={(e) => handleVehicleChange(index, e)}
                className="w-full p-2 border border-gray-300"
              />
            </div>
          </div>
        ))}
        <div className="flex text-center justify-center w-full">
          <button
            type="button"
            onClick={() => registerUser()}
            className="px-4 py-2 bg-[#b16163] text-white font-bold rounded  "
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
