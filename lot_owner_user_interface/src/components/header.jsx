import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "@fontsource/poppins"; // Import Poppins font

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get("ownertoken");
    const menuRef = useRef(null);

    const handleButtonClick = () => {
        if (token) {
            navigate("/profile");
        } else {
            navigate("/login");
        }
        setIsMenuOpen(false); // Close menu on navigation
    };

    const handleBookNow = () => {
        if (token) {
            navigate("/booklot");
        } else {
            navigate("/login");
        }
        setIsMenuOpen(false); // Close menu on navigation
    };

    const homepage = () => {
        navigate("/");
        setIsMenuOpen(false); // Close menu on navigation
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="relative min-h-[8vh] w-full shadow-xl px-4 bg-[#15202a] md:px-8 flex items-center justify-between">
            <div
                onClick={homepage}
                className="text-[#ffffff] font-poppins text-[40px] font-bold cursor-pointer"
            >
                ParkEase Business
            </div>

            {/* Hamburger Menu */}
            <div className="md:hidden flex items-center">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className=" text-2xl focus:outline-none text-[#16d044] "
                >
                    ☰
                </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex ml-auto items-center  space-x-4">
                <div
                    className="text-[#ffffff] mr-[10vw] font-sans text-[28px] font-normal cursor-pointer"
                    onClick={handleBookNow}
                >
                    View Your Lots
                </div>
                <div
                    className="font-poppins text-[#ffffff] border-solid border-2 bg-[#1690d3] border-[#030303] shadow-xl px-8 py-2 flex justify-center items-center cursor-pointer font-medium text-[20px]"
                    onClick={handleButtonClick}
                >
                    {token ? "Profile" : "Login"}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div 
                    ref={menuRef}
                    className="fixed top-0 right-0 w-[70vw] h-screen bg-white shadow-lg border border-gray-300 z-50 flex flex-col items-center py-8 space-y-4"
                >
                    <div
                        className="w-full text-center text-[#030303] font-sans text-[24px] font-normal cursor-pointer py-4 border-b border-gray-200 hover:bg-gray-100 transition-colors"
                        onClick={handleBookNow}
                    >
                        View Your Lots
                    </div>
                    <div
                        className="w-full text-center text-[#030303] font-poppins text-[24px] font-medium cursor-pointer py-4 border-b border-gray-200 hover:bg-gray-100 transition-colors"
                        onClick={handleButtonClick}
                    >
                        {token ? "Profile" : "Login"}
                    </div>
                </div>
            )}
        </header>
    );
}
