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
  backgroundColor: '#b16163',
  color: 'white',
  cursor: 'pointer',
};

const textStyle = {
  color: '#030303',
  fontSize: '16px',
  fontWeight: 500,
  fontStyle: 'normal',
  textTransform: 'none',
  textDecoration: 'none solid rgb(3, 3, 3)',
  textAlign: 'start',
};

const headingStyle = {
  color: '#030303',
  fontSize: '12px',
  fontWeight: 700,
  fontStyle: 'normal',
  textTransform: 'none',
  textDecoration: 'none solid rgb(3, 3, 3)',
  textAlign: 'start',
};

export default function ImgMediaCard({ title, description, image }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booklot');
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
        <Button size="small" sx={buttonStyle} onClick={handleBookNow}>Book</Button>
      </CardActions>
    </Card>
  );
}
