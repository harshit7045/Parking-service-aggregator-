import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Homepage from "./components/main contents/homepage/homepage";
import LoginWithGoogleButton from "./components/main contents/login/register/loginform";
import RegistrationForm from "./components/main contents/login/register/registerform";
import ParkingLot from "./components/main contents/booking/booklot";
import UserProfile from "./components/main contents/profile/profile";
import Bookingform from "./components/main contents/booking/booklotPopup";

import MapWithSearch from "./components/main contents/booking/map";
const root = ReactDOM.createRoot(document.getElementById("root"));
 

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Homepage />} />
          <Route path="login" element={<LoginWithGoogleButton />} />
          <Route path="register" element={<RegistrationForm />} />
          <Route path="booklot" element={<ParkingLot />} />
          <Route path="profile" element={<UserProfile />} />        
          <Route path="map" element={<MapWithSearch initialLocation={228001} />} />
          <Route
            path="booklot/selectvehicle"
            element={<Bookingform  />}
          />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
