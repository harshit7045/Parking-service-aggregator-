import React, { useState, useEffect } from "react";
import "@fontsource/poppins"; // Import Poppins font
import { BasicDateRangePicker, dateData } from "./datepicker";
import { StaticTimePickerLandscape, startTime } from "./HoursPicker";
import { EndStaticTimePickerLandscape, endTime } from "./endHourSPicekr";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import CarImgMediaCard from "./booklotVehiclecard";
import Cookies from 'js-cookie';
import {BasicDatePicker, hoursdate} from "./singledatePicker";
import { useLocation } from 'react-router-dom';
import SimpleAlert from "../homepage/alertbox";
const textStyle = {
  color: '#030303',
  fontSize: '30px',
  fontWeight: 700,
  fontFamily: 'Poppins',
  textAlign: 'left',
  padding: '2vh 2vw',
  zIndex: 1,
  position: 'relative',
};

const UserProfile = ({ dat }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userProfile = await getUserProfile();
        if (userProfile) {
          setVehicles(userProfile.vehicle || []);
        } else {
          setError('Failed to fetch user profile.');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      }
      setLoading(false);
    }
    fetchData();
  }, [dat]); // Ensure useEffect is triggered when `dat` changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="vehicle-list">
      <div className="ml-9" style={textStyle}>Your Vehicles</div>
      <div className="flex-row flex flex-wrap">
        {vehicles.map(vehicle => (
          <CarImgMediaCard 
            key={vehicle.uniqueIdentification}
            title={vehicle.uniqueIdentification} 
            description={vehicle.category} 
            image="https://plus.unsplash.com/premium_photo-1661956487605-1544bcd9b29e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FyJTIwaW4lMjBwYXJraW5nfGVufDB8fDB8fHww" 
            data={dat} // Pass the updated `dat`
          />
        ))}
      </div>
    </div>
  );
};

export default function Bookingform() {
  const location = useLocation();
  const { parkingLotName, pincode } = location.state || {};
  const [bookingType, setBookingType] = useState("date"); // 'date' or 'time'
  const [dialogOpen, setDialogOpen] = useState(false);

  const [dat, setDat] = useState({
    name: parkingLotName,
    pincode: pincode,
    vehicleUid: "",
    bookingModel: { model: "date", date: dateData }
  });

  useEffect(() => {
    setDat(prevDat => ({
      ...prevDat,
      bookingModel: bookingType === "date" 
        ? { model: "date", date: dateData } 
        : { model: "hours", time: { startTime, endTime }, date: hoursdate }
    }));
  }, [bookingType, startTime, endTime,hoursdate,dateData]);

  const handleBookingTypeChange = (type) => {
    setBookingType(type);
  };

  const handleOkayClick = () => {
    setDialogOpen(true);
    console.log("Booking Details:");
    console.log(dat.bookingModel);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <div className="bg-[#ffffff]  m-[2.5vw]  card">
        <div className="border-dotted border-[5px] border-[#b16163] rounded-[10px] m-[5vh]">
        <h6 style={textStyle}>Parking Lot Name: {parkingLotName}</h6>
        <h6 style={textStyle}>Pincode: {pincode}</h6>
        </div>
        <div className=" bg-[#e0e0e0] p-[5vh] rounded-2xl border-solid border-[#b16163]">
        <div className="booking-options flex place-content-evenly m-[6vw]  ">
          <Button variant="contained" onClick={() => handleBookingTypeChange("date")} sx={{ backgroundColor: '#b16163' }}>Book Date-wise </Button>
          <Button variant="contained" onClick={() => handleBookingTypeChange("time")}sx={{ backgroundColor: '#b16163' }}>Book Hour-wise</Button>
        </div>
        {bookingType === "date" ? (
          <div className="" >
          <BasicDateRangePicker  />
          </div>
        ) : (
          <>
          <div className="flex flex-row justify-between flex-wrap w-[100vw]  m-0 p-[2vw]">
            
            <BasicDatePicker />
          </div>
          <div className="flex flex-row justify-between flex-wrap m-[10vw] mt-0 ">

            <StaticTimePickerLandscape label="Start Time"  />
            <EndStaticTimePickerLandscape label="End Time" />
          </div>
          </>
        )}
        <Button variant="contained" onClick={handleOkayClick} sx={{ backgroundColor: '#b16163' }}>Click here to finalize booking Timings</Button>
      </div>
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          <Typography>Start Time: {startTime ? startTime.toString() : "N/A"}</Typography>
          <Typography>End Time: {endTime ? endTime.toString() : "N/A"}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ backgroundColor: '#b16163' }}>Close</Button>
        </DialogActions>
      </Dialog>
      <UserProfile dat={dat} /> {}
    </>
  );
}

async function getUserProfile() {
  let user = {
    vehicle: [],
    userDetails: {}
  };

  try {
    const responseVehicles = await fetch("http://localhost:8000/api/vehicles/getvehicles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": Cookies.get("token"),
      },
    });

    if (!responseVehicles.ok) {
      throw new Error(`HTTP error! status: ${responseVehicles.status}`);
    }

    const vehicleData = await responseVehicles.json();
    user.vehicle = vehicleData;
  } catch (error) {
    console.log('Error fetching vehicles:', error);
    return null;
  }

  try {
    const responseUser = await fetch("http://localhost:8000/api/users/getuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": Cookies.get("token"),
      },
    });

    if (!responseUser.ok) {
      throw new Error(`HTTP error! status: ${responseUser.status}`);
    }

    const userData = await responseUser.json();
    user.userDetails = userData.user;
  } catch (error) {
    console.log('Error fetching user profile:', error);
    return null;
  }

  return user;
}
