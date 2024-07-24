import React from 'react';
import { Card, CardContent, Typography, Grid, Button, TextField, MenuItem } from '@mui/material';

const ProfileCard = ({ profile }) => (
  <Card style={{ marginBottom: '20px' }}>
    <CardContent>
      <Typography variant="h6">Name: {profile.name}</Typography>
      <Typography>Phone Number: {profile.phoneNumber}</Typography>
      <Typography>UID: {profile.uid}</Typography>
      <Typography>Wallet Balance: ${profile.walletBalance.toFixed(2)}</Typography>
    </CardContent>
  </Card>
);

const VehicleCard = ({ vehicle }) => (
  <Card style={{ marginBottom: '20px' }}>
    <CardContent>
      <Typography>Vehicle Number: {vehicle.number}</Typography>
      <Typography>Category: {vehicle.category}</Typography>
    </CardContent>
  </Card>
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
  const [amount, setAmount] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('Credit Card');

  const handlePayment = () => {
    // Handle payment logic here
    alert(`Adding $${amount} to wallet via ${paymentMethod}`);
  };

  const profile = {
    name: 'John Doe',
    phoneNumber: '1234567890',
    uid: 'UID123456',
    walletBalance: 100.00,
    vehicles: [
      { number: 'XYZ 1234', category: 'Premium' },
      { number: 'ABC 5678', category: 'Standard' }
    ],
    bookings: [
      { id: 'B001', date: '2024-07-20', status: 'Completed' },
      { id: 'B002', date: '2024-07-21', status: 'Upcoming' }
    ]
  };

  return (
    <div style={{ padding: '20px' }}>
      <ProfileCard profile={profile} />
      <Typography variant="h6" style={{ marginBottom: '10px' }}>Vehicles</Typography>
      {profile.vehicles.map((vehicle, index) => (
        <VehicleCard key={index} vehicle={vehicle} />
      ))}
      <Typography variant="h6" style={{ marginBottom: '10px' }}>Bookings</Typography>
      {profile.bookings.map((booking, index) => (
        <BookingCard key={index} booking={booking} />
      ))}
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
