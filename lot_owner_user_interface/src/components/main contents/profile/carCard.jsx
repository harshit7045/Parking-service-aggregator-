import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

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

export default function ImgMedia({ title, description, image }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booklot');
  };

  return (
    <Card
      sx={{
        minWidth: "18vw",
        maxWidth: 250,
        backgroundColor: '#f3f4f6',
        margin: '5vh',
        fontFamily: 'Poppins',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      }}
    >
      <CardMedia
        sx={{
          
          width: '100%',
          // Media query for tablets and smaller
          '@media (max-width: 768px)': {
            width: 0,
            height: 0,
          },
        }}
        component="img"
        alt={title}
        image={image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={textStyle}>
          Lot Name: {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={headingStyle}>
          Lot Pincode: {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" sx={buttonStyle} onClick={handleBookNow}>
          Manage Lot
        </Button>
      </CardActions>
    </Card>
  );
}
