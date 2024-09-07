import React, { useState } from 'react';
import Cookies from 'js-cookie'; 
import { useNavigate } from 'react-router-dom';
import MapWithSearch from './map';
import SimpleAlert from '../homepage/alertbox';


// Define getLatlong function outside the component
const alertBarStyle = {
 
  width: '100%',
  zIndex: 1,
};
const getLatlong = async (pincode) => {
  const url = `https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/${pincode}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'da9f7eefe4mshb03d7d2e86b88dbp1c2559jsn78e61fdfd2ba',
      'x-rapidapi-host': 'india-pincode-with-latitude-and-longitude.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    //console.log('Lat/Long data:', data);
    // Adjust the data extraction based on actual API response
    const { lat, lng } = data[0]; 
    //console.log(lat, lng)// Assuming data is an array with { lat, lng } objects
    return { lat, lng };
  } catch (error) {
    console.error('Error fetching latitude and longitude:', error);
    return { lat: null, lng: null };
  }
};

function ParkingLot() {
  const [parkingLots, setParkingLots] = useState([]);
  const [pincode, setPincode] = useState("");
  const [searchPincode, setSearchPincode] = useState(null);
  const [alertData, setAlertData] = useState({ show: false, message: '', severity: '' }); // To control when the map reloads
  const navigate = useNavigate(); 

  const handleSearch = async () => {
    try {
      const responseUser = await fetch(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/parking/getlots?pincode=${pincode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": Cookies.get("token"),
        },
      });
      console.log(process.env.REACT_APP_BACKEND_IP+":"+process.env.REACT_APP_BACKEND_PORT+"/api/parking/getlots?pincode="+pincode);
      if (!responseUser.ok) {
        throw new Error(`HTTP error! Status: ${responseUser.status}`);
      }
     
      const data = await responseUser.json();
      console.log("Parking Lots:", data.length);
      if(data.length === 0){
        setAlertData({
          show: true, 
          message: "No Parking Lots Found please take any other pin code",
          severity: "error",
        });
      }else{
        setAlertData({
          show: true, 
          message: "Parking Lots Found Scroll to botto      m for booking",
          severity: "success",
        });
      }
      setParkingLots(data);
      const { lat, lng } = await getLatlong(pincode);
      setSearchPincode({ lat, lng });

    } catch (error) {
      console.log(process.env.REACT_APP_BACKEND_IP+":"+process.env.REACT_APP_BACKEND_PORT+"/api/parking/getlots?pincode="+pincode);
      console.error('Error fetching parking lots:', error);
    }
  };

  const handleBookNow = (lot) => {
    navigate('/booklot/selectvehicle', { state: { parkingLotName: lot.name, pincode: lot.pincode } });
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
         <div style={alertBarStyle}>
          <SimpleAlert severity={alertData.severity} message={alertData.message} />
        </div>
        <button onClick={handleSearch} className="border rounded px-4 py-2 bg-gray-200">Search</button>
      </div>
      <div className="mb-4 flex justify-center align-middle">
        <MapWithSearch initialLocation={searchPincode} />
      </div>
      <h2 className="text-xl font-semibold">Available Parking Lots</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-[40vh]">
        {parkingLots.map((lot, index) => (
          <div key={index} className="border rounded p-4">
            <p className="font-semibold">{lot.address}</p>
            <p>Name: {lot.name}</p>
            <p>Pincode: {lot.pincode}</p>
            <button
              className="mt-4 w-full bg-red-500 text-white py-2 rounded"
              onClick={() => handleBookNow(lot)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkingLot;
