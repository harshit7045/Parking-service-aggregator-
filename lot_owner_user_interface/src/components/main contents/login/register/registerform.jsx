import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import { useNavigate } from "react-router-dom";
const RegistrationForm = () => {
  const navigate = useNavigate();
    const handelRegister = () => {
      navigate("/login");
    };
    
  const [numVehicles, setNumVehicles] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    vehicles: [],
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{10}$/;
    return regex.test(phoneNumber);
  };

  const validateVehicles = () => {
    if (numVehicles === 0) {
      return true; // No vehicles required if the user selects 0
    }
    // Ensure each vehicle has a UID, vehicle number, and category
    return formData.vehicles.length === numVehicles && formData.vehicles.every(
      (vehicle) =>
        vehicle.uid?.trim() !== "" &&
        vehicle.vehicleNumber?.trim() !== "" &&
        vehicle.category?.trim() !== ""
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVehicleChange = (index, e) => {
    const { name, value } = e.target;
    const newVehicles = [...formData.vehicles];
    newVehicles[index] = { ...newVehicles[index], [name]: value };
    setFormData({ ...formData, vehicles: newVehicles });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and contain letters, numbers, and special characters.";
    }
    if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits long.";
    }
    if (!validateVehicles()) {
      newErrors.vehicles = "Each vehicle must have a UID, vehicle number, and category.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  let register;
  const registerUser = async () => {
    
    if (!validateForm()) {
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      vehicles: formData.vehicles.map((vehicle) => ({
        uniqueIdentification: vehicle.uid,
        vehicleNumber: vehicle.vehicleNumber,
        category: vehicle.category,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      })),
    };

    try {
      const response = await fetch(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        handelRegister();
      } else {
        console.error("Registration failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4 max-w-md min-h-[60vh] mx-auto mb-[-5vh] sm:max-w-lg sm:mx-auto sm:p-8 lg:max-w-full lg:mx-0 lg:p-8">
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
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
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
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
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
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
        <div className="mb-4 w-full">
          <label className="block text-gray-700">Number of Parking Lots</label>
          <select
            value={numVehicles}
            onChange={(e) => setNumVehicles(Number(e.target.value))}
            className="w-full p-2 border border-gray-300"
          >
            <option value="0">Select Number of Parking Lots</option>
            <option value="1">1</option>
           
          </select>
          {errors.vehicles && (
            <p className="text-red-500 text-sm mt-1">{errors.vehicles}</p>
          )}
        </div>
        {[...Array(numVehicles)].map((_, index) => (
          <div key={index}>
            <div className="mb-4 w-full">
              <label className="block text-gray-700">
                Pincode of Parking Lot {index + 1}
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
                Max Capacity of Parking Lot {index + 1}
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
                Name of Parking Lot {index + 1}
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
        <div className="flex  text-center justify-center w-full">
          <button
            type="button"
            onClick={registerUser}
            className="px-4 py-2 h-[5vh] min-w-[20vw] bg-[#16d044] text-white flex justify-center items-center font-bold rounded"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
