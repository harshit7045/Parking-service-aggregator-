import Header from "./components/header";
import Footer from "./components/footer";
import Homepage from "./components/main contents/homepage/homepage";
import LoginWithGoogleButton from "./components/main contents/login/register/loginform";
import RegistrationForm from "./components/main contents/login/register/registerform";
import ParkingLot from "./components/main contents/booking/booklot";
import UserProfile from "./components/main contents/profile/profile";
export default function App() {
  return (
    <>
      <Header />

    <UserProfile />
      <Footer />
    </>
  );
}
