import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../../assets/images/background.png";
import ImgMedia from "./carCard";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import Cookies from "js-cookie";
async function getUserProfile() {
  let user = {
    vehicle: [],
    userDetails: {},
  };

  try {
    const responseVehicles = await fetch(
      `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/parkinglotowner/getlots`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: Cookies.get("ownertoken"),
        },
      }
    );
   // console.log("aaaa"+Cookies.get("ownertoken"));
    if (!responseVehicles.ok) {
      console.log(responseVehicles);
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
      `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/parkinglotowner/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: Cookies.get("ownertoken"),
        },
      }
    );

    if (!responseUser.ok) {
      throw new Error(`HTTP error! status: ${responseUser.status}`);
    }
    //console.log( "aaa"+responseUser);
    const userData = await responseUser.json();

    user.userDetails = userData.user;
  } catch (error) {
    console.log("Error fetching user profile:", error);
    return null;
  }

  //console.log(user.userDetails);
  return user;
}

let balance = 0;
const ProfileCard = ({ profile }) => (
  <div className="flex flex-col items-center  p-6 sm:p-8 mx-auto w-full max-w-lg rounded-lg shadow-md mt-[-7vh]">
    {/* Profile Image */}
    <img
      src="https://th.bing.com/th/id/OIP.bTaXpIA91aRjknCY9tPfAgHaHa?w=202&h=202&c=7&r=0&o=5&pid=1.7" // Replace with your image link
      alt="Profile"
      className="w-24 h-24 mb-4 rounded-full"
    />

    {/* Title */}
    <div className="text-xl font-bold mb-6">Profile Details of {profile.name}</div>

    {/* User Information Table */}
    <div className="w-full">
      <table className="table-auto w-full border-collapse border border-gray-200">
        <tbody>
          <tr className="border-b border-gray-200">
            <td className="px-4 py-2 text-xl font-bold text-gray-700">Phone Number</td>
            <td className="px-4 py-2 text-gray-600">{profile.phoneNumber}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="px-4 py-2 text-xl font-bold text-gray-700">Email</td>
            <td className="px-4 py-2 text-gray-600">{profile.email}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="px-4 py-2 text-xl font-bold text-gray-700">Owner Name</td>
            <td className="px-4 py-2 text-gray-600">
              {profile.name }
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);



const VehicleCard = ({ vehicle }) => (
  <div
    style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
  >
    <ImgMedia
      title={vehicle.name}
      description={vehicle.pincode}
      image="https://th.bing.com/th/id/OIP.YiNIgrXTJuSFgVFhfGXHQgHaE8?rs=1&pid=ImgDetMain"
    />
  </div>
);

const BookingCard = ({ booking }) => (
  <Card style={{ marginBottom: "20px" }}>
    <CardContent>
      <Typography>Booking ID: {booking.id}</Typography>
      <Typography>Date: {booking.date}</Typography>
      <Typography>Status: {booking.status}</Typography>
    </CardContent>
  </Card>
);



const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const navigate = useNavigate(); // Correct use of useNavigate
  useEffect(() => {
    const token = Cookies.get('ownertoken'); // Check if token exists
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    }
  }, [navigate]); 
  useEffect(() => {
    async function fetchData() {
      const userProfile = await getUserProfile();
      //console.log("Fetched profile:", userProfile);
      if (userProfile) {
        setProfile(userProfile.userDetails);
        setVehicles(userProfile.vehicle || []);
      } else {
        setError("Failed to fetch user profile.");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handlePayment = () => {
    console.log("Amount:", amount);
    //alert(`Adding $${amount} to wallet via ${paymentMethod}`);
    navigate("/checkout", { state: { amount: parseInt(amount) } }); // Navigate to checkout
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!profile) {
    return <Typography>No profile data available.</Typography>;
  }

  return (
    <div style={{}}>
      <div
        className="h-[20vh] bg-cover bg-center bg-no-repeat z-10 "
        style={{ backgroundImage: `url(${img})` }}
      ></div>
      <ProfileCard profile={profile} />
      <div className="bg-[#f6f7f9] pt-[1rem]">
      <Typography
        variant="h3"
        style={{ margin: "5rem", display: "flex", justifyContent: "center" }}
      >
        Your Parking Lots
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center ">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle, index) => (
            <Grid item key={index}>
              <VehicleCard vehicle={vehicle} />
            </Grid>
          ))
        ) : (
          <Typography>No vehicles available.</Typography>
        )}
      </Grid>
      </div>
      <Typography
        variant="h6"
        style={{ marginBottom: "10px", marginTop: "20px" }}
      ></Typography>
      <Grid container spacing={2}>
        {(profile.bookings || []).map((booking, index) => (
          <Grid item xs={12} key={index}>
            <BookingCard booking={booking} />
          </Grid>
        ))}
      </Grid>
      
    </div>
  );
};

export default UserProfile;
