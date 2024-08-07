import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Cookies from 'js-cookie';

const buttonStyle = {
  padding: '1rem 2rem',
  fontSize: '16px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#D9534F',
  color: 'white',
  cursor: 'pointer',
};

const textStyle = {
  color: '#030303',
  fontSize: '16px',
  fontWeight: 500,
  textAlign: 'start',
};

const headingStyle = {
  color: '#030303',
  fontSize: '12px',
  fontWeight: 700,
  textAlign: 'start',
};

export default function CarImgMediaCard({ title, description, image, data }) {
  const handleBooking = () => {
    data.vehicleUid = title; // Update vehicleUid based on the card's title
    booking(data);
  };

  return (
    <Card sx={{ minWidth: 250, maxWidth: 250, backgroundColor: '#d3d3d3', margin: '5vh', fontFamily: 'Poppins' }}>
      <CardMedia 
        component="img"
        alt={title}
        height="140"
        image={image} 
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={textStyle}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={headingStyle}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" sx={buttonStyle} onClick={handleBooking}>Book</Button>
      </CardActions>
    </Card>
  );
}

async function booking(data) {
  console.log("Booking Data:", data); // Check the structure of data
  try {
    const response = await fetch("http://localhost:8000/api/bookings/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": Cookies.get("token"),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Booking successful:", responseData);
  } catch (error) {
    console.log('Error booking:', error);
  }
}
