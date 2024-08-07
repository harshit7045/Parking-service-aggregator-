import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, TextField, MenuItem } from '@mui/material';
import ImgMediaCard from '../homepage/card'; // Ensure this path is correct
import Cookies from 'js-cookie';

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

  console.log(user.userDetails);
  return user;
}

const ProfileCard = ({ profile }) => (
  <Card style={{ marginBottom: '20px' }}>
    <CardContent>
      <Typography variant="h6">Profile Details: {profile.name}</Typography>
      <Typography>Phone Number: {profile.phoneNumber}</Typography>
      <Typography>Email: {profile.email}</Typography>
      <Typography>Wallet Balance: ${profile.walletBalance ? profile.walletBalance.toFixed(2) : '0.00'}</Typography>
    </CardContent>
  </Card>
);

const VehicleCard = ({ vehicle }) => (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <ImgMediaCard
      title={vehicle.uniqueIdentification}
      description={vehicle.category}
      image="https://www.carscoops.com/wp-content/uploads/2018/10/ee694fa4-classic-recreations-boss-429.jpg"
    />
  </div>
);

const BookingCard = ({ booking }) => (
  <Card style={{ marginBottom: '20px' }}>
    <CardContent>
      <Typography>Booking ID: {booking.id}</Typography>
      <Typography>Date: {booking.date}</Typography>
      <Typography>Status: {booking.status}</Typography>
    </CardContent>
  </Card>
);

const AddMoneyForm = ({ amount, setAmount, paymentMethod, setPaymentMethod, handlePayment }) => (
  <Card style={{ marginTop: '20px' }}>
    <CardContent>
      <Typography variant="h6">Add Money to Wallet</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Payment Method"
            select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            fullWidth
          >
            <MenuItem value="Credit Card">Credit Card</MenuItem>
            <MenuItem value="Debit Card">Debit Card</MenuItem>
            <MenuItem value="PayPal">PayPal</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={handlePayment}
      >
        Proceed to Payment
      </Button>
    </CardContent>
  </Card>
);

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  useEffect(() => {
    async function fetchData() {
      const userProfile = await getUserProfile();
      console.log('Fetched profile:', userProfile);
      if (userProfile) {
        setProfile(userProfile.userDetails);
        setVehicles(userProfile.vehicle || []);
      } else {
        setError('Failed to fetch user profile.');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handlePayment = () => {
    // Handle payment logic here
    alert(`Adding $${amount} to wallet via ${paymentMethod}`);
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
    <div style={{ padding: '20px' }}>
      <ProfileCard profile={profile} />
      <Typography variant="h6" style={{ marginBottom: '10px' }}>Vehicles</Typography>
      <Grid container spacing={2}>
        {vehicles.length > 0 ? vehicles.map((vehicle, index) => (
          <Grid item key={index}>
            <VehicleCard vehicle={vehicle} />
          </Grid>
        )) : <Typography>No vehicles available.</Typography>}
      </Grid>
      <Typography variant="h6" style={{ marginBottom: '10px', marginTop: '20px' }}>Bookings</Typography>
      <Grid container spacing={2}>
        {(profile.bookings || []).map((booking, index) => (
          <Grid item xs={12} key={index}>
            <BookingCard booking={booking} />
          </Grid>
        ))}
      </Grid>
      <AddMoneyForm
        amount={amount}
        setAmount={setAmount}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        handlePayment={handlePayment}
      />
    </div>
  );
};

export default UserProfile;
