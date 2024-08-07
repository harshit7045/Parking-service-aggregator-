import React, { useState } from 'react';
import Cookies from 'js-cookie'; 

function ParkingLot() {
  const [parkingLots, setParkingLots] = useState([]);
  const [pincode, setPincode] = useState("");
  const [email, setEmail] = useState("");

  const handleSearch = async () => {
    try {
      const responseUser = await fetch(`http://localhost:8000/api/parking/getlots`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": Cookies.get("token"),
        },
      });

      if (!responseUser.ok) {
        throw new Error(`HTTP error! status: ${responseUser.status}`);
      }

      const data = await responseUser.json();
      setParkingLots(data);
    } catch (error) {
      console.log('Error fetching parking lots:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Book Parking Lot</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Pin Code"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="border rounded px-4 py-2 w-full mb-2"
        />
        <button onClick={handleSearch} className="border rounded px-4 py-2 bg-gray-200">Search</button>
      </div>
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
      </div>
      <h2 className="text-xl font-semibold mb-4">Available Parking Lots</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {parkingLots.map((lot, index) => (
          <div key={index} className="border rounded p-4">
            <p className="font-semibold">{lot.address}</p>
            <p>Name: {lot.name}</p>
            <p>Pincode: {lot.pincode}</p>
            <button className="mt-4 w-full bg-red-500 text-white py-2 rounded">
              Book Now
            </button>
          </div>
        ))}
      </div>
      <button className="mt-4 bg-black text-white p-2 rounded">
        <i className="fa fa-info"></i>
      </button>
    </div>
  );
}

export default ParkingLot;
