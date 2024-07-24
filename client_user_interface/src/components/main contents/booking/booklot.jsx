import React from 'react';

const parkingLots = [
  {
    address: "123 Main St, Springfield",
    price: "$5/hr",
    status: "Available"
  },
  {
    address: "456 Elm St, Springfield",
    price: "$7/hr",
    status: "Available"
  },
  {
    address: "789 Oak St, Springfield",
    price: "$6/hr",
    status: "Booked"
  }
];

function ParkingLot() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Book Parking Lot</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Pin Code"
          className="border rounded px-4 py-2 w-full mb-2"
        />
        <button className="border rounded px-4 py-2 bg-gray-200">Search</button>
      </div>
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-4 py-2 w-full"
        />
      </div>
      <h2 className="text-xl font-semibold mb-4">Available Parking Lots</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {parkingLots.map((lot, index) => (
          <div key={index} className="border rounded p-4">
            <p className="font-semibold">{lot.address}</p>
            <p>Price: {lot.price}</p>
            <p>Status: {lot.status}</p>
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
