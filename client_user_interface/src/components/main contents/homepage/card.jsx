import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
    fontStyle: 'normal',
    fontVariant: 'no-common-ligatures',
    fontKerning: 'auto',
    fontOpticalSizing: 'auto',
    fontStretch: '100%',
    fontVariationSettings: 'normal',
    fontFeatureSettings: 'normal',
    textTransform: 'none',
    textDecoration: 'none solid rgb(3, 3, 3)',
    textAlign: 'start',
    textIndent: '0px',
  };
  const headingStyle = {
    color: '#030303',
    fontSize: '12px',
    fontWeight: 700,
    fontStyle: 'normal',
    fontVariant: 'no-common-ligatures',
    fontKerning: 'auto',
    fontOpticalSizing: 'auto',
    fontStretch: '100%',
    fontVariationSettings: 'normal',
    fontFeatureSettings: 'normal',
    textTransform: 'none',
    textDecoration: 'none solid rgb(3, 3, 3)',
    textAlign: 'start',
    textIndent: '0px',
  };

export default function ImgMediaCard({ title, description, image }) {
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
        <Button size="small" sx={buttonStyle}>Book</Button>
      </CardActions>
    </Card>
  );
}
