import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Cookies from 'js-cookie';
import SimpleAlert from '../homepage/alertbox';


const cardsStyle = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const alertBarStyle = {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  zIndex: 1,
};
const buttonStyle = {
  padding: '1rem 2rem',
  fontSize: '16px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#16d445',
  color: 'white',
  cursor: 'pointer',
};

const textStyle = {
  color: '#030303',
  fontSize: '20px',
  fontWeight: 500,
  fontStyle: 'normal',
  textTransform: 'none',
  textDecoration: 'none solid rgb(3, 3, 3)',
  textAlign: 'start',
};

const headingStyle = {
  color: '#030303',
  fontSize: '16px',
  fontWeight: 700,
  fontStyle: 'normal',
  textTransform: 'none',
  textDecoration: 'none solid rgb(3, 3, 3)',
  textAlign: 'start',
};

export default function CarImgMediaCard({ title, description, image, data }) {
  const [alertData, setAlertData] = useState({ show: false, message: '', severity: '' });

  const handleBooking = () => {
    data.vehicleUid = title; 
    booking(data);
  };

  async function booking(data) {
    //console.log("Booking Data:", data); 
    let message;
    try {
      const response = await fetch(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/bookings/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": Cookies.get("token"),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        message=await response.json();
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      //console.log("Booking successful:", responseData);
      
     
      setAlertData({
        show: true,
        message: responseData.message,
        severity: "success", 
      });
    } catch (error) {
      //console.log('Error booking:', error);
      //console.log(message);
      const outputMessage = message?.message || "Please select the date and time properly";
      setAlertData({
        show: true,
        
        message: outputMessage,
        severity: "error",
      });
    }
  }

  return (
    <div style={{ margin: 'rem'}} >
      <div style={cardsStyle}>
        <Card sx={{  }}>
          <CardMedia 
            component="img"
            alt={title}
            height="140"
            image={image} 
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" sx={textStyle}>
             Vehicle Uid: {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={headingStyle}>
              Category: {description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" sx={buttonStyle} onClick={handleBooking}>Book</Button>
          </CardActions>
        </Card>
      </div>
      {alertData.show && 
        <div >
          <SimpleAlert severity={alertData.severity} message={alertData.message} />
        </div>
      }
    </div>
  );
}
