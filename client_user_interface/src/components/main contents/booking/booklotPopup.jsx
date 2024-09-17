import React, { useState, useEffect } from "react";
import "@fontsource/poppins"; // Import Poppins font
import { BasicDateRangePicker, dateData } from "./datepicker";
import { StaticTimePickerLandscape, startTime } from "./HoursPicker";
import { EndStaticTimePickerLandscape, endTime } from "./endHourSPicekr";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import CarImgMediaCard from "./booklotVehiclecard";
import Cookies from "js-cookie";
import { BasicDatePicker, hoursdate } from "./singledatePicker";
import { useLocation } from "react-router-dom";
import SimpleAlert from "../homepage/alertbox";
import img from "../../../assets/images/background.png";
const textStyle = "text-[#030303] text-[30px] font-bold font-[Poppins] text-left py-[2vh] px-[2vw] relative z-[1] flex justify-center ";

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
          setError("Failed to fetch user profile.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      }
      setLoading(false);
    }
    fetchData();
  }, [dat]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="vehicle-list">
      <div  className={textStyle}>
        Your Vehicles
      </div>
      <div className="flex-row flex flex-wrap justify-center lg:p-[5rem]">
        {vehicles.map((vehicle) => (
          <div className="m-[5vw]">
          <CarImgMediaCard
            key={vehicle.uniqueIdentification}
            title={vehicle.uniqueIdentification}
            description={vehicle.category}
            image="https://plus.unsplash.com/premium_photo-1661956487605-1544bcd9b29e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FyJTIwaW4lMjBwYXJraW5nfGVufDB8fDB8fHww"
            data={dat} // Pass the updated dat
          />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Bookingform() {
  const location = useLocation();
  const { parkingLotName, pincode, model } = location.state || {};
  const [bookingType, setBookingType] = useState(model); // 'date' or 'time'
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get('token'); // Check if token exists
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    }
  }, [navigate]); 
  const [dat, setDat] = useState({
    name: parkingLotName,
    pincode: pincode,
    vehicleUid: "",
    bookingModel: { model: "date", date: dateData },
  });

  useEffect(() => {
    setDat((prevDat) => ({
      ...prevDat,
      bookingModel:
        bookingType === "date"
          ? { model: "date", date: dateData }
          : { model: "hours", time: { startTime, endTime }, date: hoursdate },
    }));
  }, [bookingType, startTime, endTime, hoursdate, dateData]);

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
 console.log(bookingType);
  return (
    <>
    <div
        className="w-full h-[400px] bg-cover bg-center bg-no-repeat flex justify-center items-center"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="flex flex-col justify-center text-center">
          <h1 className="text-white text-5xl font-bold">Reservations</h1>
          <h3 className="text-white mt-2">Home / Reservations</h3>
        </div>
      </div>
      <div className="bg-[#ffffff] m-[2.5vw] card">
      

      <div className="flex flex-col items-center justify-center">
  {/* Parking Lot Information Header */}
 

  {/* Parking Lot Information Card */}
  <div className="w-full max-w-[40vw] flex flex-col items-center mt-[-9vh]">
    {/* Profile Image */}
    <div className="w-24 h-24 mb-4">
      <img
        src="https://www.carscoops.com/wp-content/uploads/2018/10/ee694fa4-classic-recreations-boss-429.jpg"
        alt="Parking Lot"
        className="w-full h-full object-cover rounded-full border border-gray-300"
      />
    </div>
    <div className="text-2xl font-bold mb-6">Parking Lot Details</div>

    {/* Information Table */}
    <table className="table-auto w-full max-w-md border-collapse border border-gray-300">
      <tbody>
        <tr className="border-b  border-gray-300">
          <td className="px-4 py-2 text-lg font-semibold text-gray-700">
            Parking Lot Name
          </td>
          <td className="px-4 py-2 text-gray-600">{parkingLotName}</td>
        </tr>
        <tr className="border-b border-gray-300">
          <td className="px-4 py-2 text-lg font-semibold text-gray-700">
            Pincode
          </td>
          <td className="px-4 py-2 text-gray-600">{pincode}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


        <div className="bg-[#f6f7f9]  rounded-2xl min-h-[40vh] mt-[5vh] border-solid border-[#b16163]">
          <div className="booking-options mb-[5vh] flex justify-evenly w-[100%]">
            
            <Button
              variant="contained"
              onClick={() => handleBookingTypeChange("date")}
              sx={{ backgroundColor:  bookingType === "date" ? ("#16d044"): ( "#a7f3d0"),width:"50%"
               }}
            >
              Book Date-wise{" "}
            </Button>
            <Button
              variant="contained"
              onClick={() => handleBookingTypeChange("hours")}
              sx={{ backgroundColor: bookingType === "hours" ? ("#16d044"): ( "#a7f3d0"),width:"50%", height:"7vh" }}
            >
              Book Hour-wise
            </Button>
          </div>
          {bookingType === "date" ? (
            <div className="lg:m-[5rem]">
              <BasicDateRangePicker />
            </div>
          ) : bookingType === "hours" ? (
            <>
              <div className="flex flex-row justify-between flex-wrap w-[100vw] m-0 p-[2vw]">

                <BasicDatePicker />
              </div>
              <div className="flex flex-row justify-center flex-wrap m-[2rem] mt-0">
                <div className="m-[5vw] flex  flex-col justify-center">
                  <h3 className="text-xl font-bold pl-[30%] pb-[1rem]">Check In Time</h3>
                <StaticTimePickerLandscape label="Start Time"/>
                </div>
                <div className="m-[5vw]">
                <h3 className="text-xl font-bold pl-[30%] pb-[1rem]">Check Out Time</h3>
                <EndStaticTimePickerLandscape label="End Time" />
                </div>
              </div>
            </>
          ) : (
            <div>Not Available</div>
          )}
           {bookingType === "onthego" ? (
           <div></div>
          ) :  (
            <div className="lg:ml-[34vw]">
            <Button
            variant="contained"
            onClick={handleOkayClick}
            sx={{ backgroundColor: "#16d044", margin: "5rem" }}
          >
            Click here to finalize booking Timings
          </Button>
          </div>
              
          ) }
         
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          <Typography>
            Start Time: {startTime ? startTime.toString() : "N/A"}
          </Typography>
          <Typography>
            End Time: {endTime ? endTime.toString() : "N/A"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            sx={{ backgroundColor: "#16d044" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <UserProfile dat={dat} /> {}
    </>
  );
}

async function getUserProfile() {
  let user = {
    vehicle: [],
    userDetails: {},
  };

  try {
    const responseVehicles = await fetch(
      `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/vehicles/getvehicles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: Cookies.get("token"),
        },
      }
    );

    if (!responseVehicles.ok) {
      throw new Error(`HTTP error! status: ${responseVehicles.status}`);
    }

    const vehicleData = await responseVehicles.json();
    user.vehicle = vehicleData;
  } catch (error) {
    console.log("Error fetching vehicles:", error);
    return null;
  }

  try {
    const responseUser = await fetch(
      `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/users/getuser`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: Cookies.get("token"),
        },
      }
    );

    if (!responseUser.ok) {
      throw new Error(`HTTP error! status: ${responseUser.status}`);
    }

    const userData = await responseUser.json();
    user.userDetails = userData.user;
  } catch (error) {
    console.log("Error fetching user profile:", error);
    return null;
  }

  return user;
}
