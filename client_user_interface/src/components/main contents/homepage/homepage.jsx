import React from "react";
import "@fontsource/poppins";
import Features from "./features";
import AvilableLots from "./avilablelots"; // Keeping the typo here
import Services from "./services";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/register');
  }

  return (
    <>
      <div className="relative w-full min-h-[60vh] bg-cover bg-center bg-[url('https://i.pinimg.com/originals/ae/9e/1e/ae9e1e27a5317b7d99da700de61c1e3b.jpg')]">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-white text-2xl md:text-4xl font-bold font-poppins text-center py-10 px-6 md:py-20 md:px-8">
          Discover convenient parking solutions for your everyday journeys.
        </div>
        <div className="relative z-10 flex flex-col laptop:flex-row justify-center items-center mt-8 px-4 laptop:px-8">
          <input
            type="text"
            placeholder="Enter your email to join"
            className="p-4 text-base border rounded-md border-gray-300 mb-4 laptop:mb-0 laptop:mr-4 w-full laptop:w-[50vw]"
          />
          <button onClick={handleJoin} className="p-4 text-base rounded-md bg-[#16d445] text-white cursor-pointer laptop:ml-4">
            Join
          </button>
        </div>
        <div className="relative z-10 text-white text-sm laptop:text-xl font-poppins text-center mt-4 laptop:mt-8">
          Book parking spaces hassle-free at the best rates available.
        </div>
      </div>
      <Features />
      <AvilableLots /> {/* Keeping the typo here */}
     <Services />
    </>
  );
}
