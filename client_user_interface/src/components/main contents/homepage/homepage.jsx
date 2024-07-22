import React from "react";
import "@fontsource/poppins";
import Features from "./features";
import AvilableLots from "./avilablelots";
import Services from "./services";
const backgroundImageStyle = {
  position: 'relative',
  width: '100vw',
  minHeight: '60vh',  // Corrected min-height to minHeight
  overflow: 'hidden',
};

const blurredBackgroundStyle = {
  content: '""',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(https://i.pinimg.com/736x/df/51/6e/df516e1c0076e42afa5d2d1f7002ef30.jpg)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'blur(0.2rem)',
  zIndex: -1,
};

const textStyle = {
  color: '#030303',
  fontSize: '60px',
  fontWeight: 700,
  fontFamily: 'Poppins',
  textAlign: 'center',
  padding: '5vh 5vw',
  zIndex: 1,
  position: 'relative',
};

const inputContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '2rem',
  zIndex: 1,
  position: 'relative',
};

const inputStyle = {
  padding: '1rem',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginRight: '1rem',
};

const buttonStyle = {
  padding: '1rem 2rem',
  fontSize: '16px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#D9534F',
  color: 'white',
  cursor: 'pointer',
};

const subtitleStyle = {
  color: '#030303',
  fontSize: '20px',
  fontFamily: 'Poppins',
  textAlign: 'center',
  marginTop: '2rem',
  zIndex: 1,
  position: 'relative',
};

export default function Homepage() {
  return (
    <>
      <div style={backgroundImageStyle}>
        <div style={blurredBackgroundStyle}></div>
        <div style={textStyle}>
          Discover convenient parking solutions for<br /> your everyday journeys.
        </div>
        <div style={inputContainerStyle}>
          <input
            type="text"
            placeholder="Enter pin code and email"
            style={inputStyle}
            className="w-[50vw]"
          />
          <button style={buttonStyle}>Join</button>
        </div>
        <div style={subtitleStyle}>
          Book parking spaces hassle-free at the best rates available.
        </div>
      </div>
      <Features />
      <AvilableLots />
      <Services />
    </>
  );
}
