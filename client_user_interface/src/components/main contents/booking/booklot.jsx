import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import MapWithSearch from "./map";
import SimpleAlert from "../homepage/alertbox";
import BasicSelect from "./dropdown";
import img from "../../../assets/images/background.png";
import hp from "../../../assets/images/OIP.jpeg";
import { useRef } from "react";
const alertBarStyle = {
  width: "100%",
  zIndex: 1,
};

const getLatlong = async (pincode) => {
  const url = `https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/${pincode}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "da9f7eefe4mshb03d7d2e86b88dbp1c2559jsn78e61fdfd2ba",
      "x-rapidapi-host":
        "india-pincode-with-latitude-and-longitude.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const { lat, lng } = data[0]; // Assuming data is an array with { lat, lng } objects
    return { lat, lng };
  } catch (error) {
    console.error("Error fetching latitude and longitude:", error);
    return { lat: null, lng: null };
  }
};

function ParkingLot() {
  const [parkingLots, setParkingLots] = useState([]);
  const [model, setModel] = useState("hours");
  const [pincode, setPincode] = useState("");
  const [searchPincode, setSearchPincode] = useState(null);
  const [alertData, setAlertData] = useState({
    show: false,
    message: "",
    severity: "",
  });
const targetRef=useRef(null);
  const handleModelChange = (newModel) => {
    setModel(newModel);
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Perform navigation when the component mounts
    navigate("/booklot");
  }, [navigate]);

  useEffect(() => {
    // Log the model whenever it changes
    console.log(model);
  }, [model]);
  useEffect(() => {
    const token = Cookies.get('token'); // Check if token exists
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    }
  }, [navigate]);
  const handleSearch = async () => {
    try {
      const responseUser = await fetch(
        `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/parking/getlots?pincode=${pincode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: Cookies.get("token"),
          },
        }
      );
      if (!responseUser.ok) {
        setAlertData({
          show: true,
          message: "The backend is offline.",
          severity: "error",
        });
        throw new Error(`HTTP error! Status: ${responseUser.status}`);
      }

      const data = await responseUser.json();
      if (data.length === 0) {
        setAlertData({
          show: true,
          message: "No Parking Lots Found, please try another pin code.",
          severity: "error",
        });
      } else {
        setAlertData({
          show: true,
          message:
            "Parking Lots Found! Scroll to the bottom to look for nearby places.",
          severity: "success",
        });
      }
      setParkingLots(data);
      const { lat, lng } = await getLatlong(pincode);
      setSearchPincode({ lat, lng });
    } catch (error) {
      setAlertData({
        show: true,
        message: "The backend is offline.",
        severity: "error",
      });
      console.error("Error fetching parking lots:", error);
    }
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log("Target element not found");
    }
  };

  const handleBookNow = (lot) => {
    navigate("/booklot/selectvehicle", {
      state: { parkingLotName: lot.name, pincode: lot.pincode, model: model },
    });
  };

  return (
    <>
      {/* Header Image Section */}
      <div
        className="w-full h-[400px] bg-cover bg-center bg-no-repeat flex justify-center items-center"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="flex flex-col justify-center text-center">
          <h1 className="text-white text-5xl font-bold">Reservations</h1>
          <h3 className="text-white mt-2">Home / Reservations</h3>
        </div>
      </div>
      <div className="relative w-full min-w-[98vw] h-auto flex flex-col bg-[#f6f7f8]">
        {/* Form and Map Section */}
        <div className="min-h-[30vh] flex justify-center items-center">
          <div className="top-0 left-0 w-full p-6 bg-[#f6f7f8] flex justify-center">
            <div className="w-full md:w-1/2 lg:w-1/3 p-6 bg-white shadow-md rounded-lg">
              <h1 className="text-2xl font-bold mb-6 text-center">
                Book Parking Lot
              </h1>

              {/* Form Section */}
              <div className="grid grid-cols-1 gap-6">
                {/* Dropdown */}
                <div className="w-full">
                  <BasicSelect
                    className="w-full border rounded-lg p-2"
                    model={model}
                    onModelChange={handleModelChange}
                  />
                </div>

                {/* Pincode Input */}
                <input
                  type="text"
                  placeholder="Enter Pin Code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="w-full bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 transition"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white flex flex-col  mt-[10vh] justify-center">
          {/* Parking Lots Section */}
          <h1 className="text-4xl  font-semibold m-[5rem] mb-4 flex justify-center" ref={targetRef}>
            Available Parking Lots on the given Pincode
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-[5rem] mb-[10vh] mt-[10vh]">
            {parkingLots.map((lot, index) => (
              <div key={index} className="border rounded p-4">
                <p className="font-semibold">{lot.address}</p>
                <p>Name: {lot.name}</p>
                <p>Pincode: {lot.pincode}</p>
                <button
                  className="mt-4 w-full bg-green-500 text-white hover:bg-green-600 py-2 rounded"
                  onClick={() => handleBookNow(lot)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
        <div style={alertBarStyle}>
          <SimpleAlert
            severity={alertData.severity}
            message={alertData.message}
          />
        </div>

        {/* Map and Form Section */}
        <div
          className="relative w-full flex flex-col items-center mb-[-5vh] bg-[#f6f7f8] bg-cover bg-center bg-no-repeat py-10"
          style={{ backgroundImage: `url(${hp})` }}
        >
          <h1 className="text-4xl font-semibold mb-8 text-white">
            Find Parking Near You
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-7xl px-6">
            {/* Map Section */}
            <div className="relative border-2 border-gray-300 rounded-lg shadow-lg h-[60vh] lg:h-[80vh]">
              <MapWithSearch initialLocation={searchPincode} />
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-center text-center bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">
                Secure Parking with Ease
              </h2>
              <p className="text-gray-600 mb-6">
                ParkEase offers seamless online booking, RFID-based entry, and
                secure parking spaces. Find a spot in seconds and ensure a
                hassle-free parking experience.
              </p>
              <button className="bg-green-500 text-white py-3 px-8 rounded-lg hover:bg-green-600 transition" onClick={handleSearch}>
                Enter Pincode above to search on map
              </button>
            </div>
          </div>
        </div>

        {/* Alert Section */}
      </div>
    </>
  );
}

export default ParkingLot;
