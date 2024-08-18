import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "@fontsource/poppins"; // Import Poppins font

export default function Header() {
    const navigate = useNavigate();
    const token = Cookies.get("token");

    const handleButtonClick = () => {
        if (token) {
            navigate("/profile");
        } else {
            navigate("/login");
        }
    };

    const handleBookNow = () => {
        navigate("/booklot");
    };

    const homepage = () => {
        navigate("/");
    };

    return (
        <>
            <div className="min-h-[8vh] w-[100vw] shadow-xl px-[2vw] flex items-center">
                <div
                    onClick={homepage}
                    className="text-[#030303] font-poppins text-[40px] font-bold not-italic normal-case no-underline text-left custom-font clickable"
                >
                    ParkEase
                </div>
                <div className="flex ml-[50vw] justify-evenly items-center w-[50vw] h-[100]">
                    <div className="find-parking clickable" onClick={handleBookNow}>
                        Find Parking
                    </div>
                    <div
                        className="font-poppins login border-solid border-2 border-[#030303] shadow-xl px-8 py-.5 flex justify-center items-center cursor-pointer clickable"
                        onClick={handleButtonClick}
                    >
                        {token ? "Profile" : "Login"}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .custom-font {
                    font-variant: no-common-ligatures;
                    font-kerning: auto;
                    font-optical-sizing: auto;
                    font-stretch: 100%;
                    font-variation-settings: normal;
                    font-feature-settings: normal;
                }

                .find-parking {
                    color: #030303;
                    font-family: 'Gelion', Helvetica, 'Helvetica Neue', Arial, sans-serif;
                    font-size: 28px;
                    font-weight: 400;
                    font-style: normal;
                    font-variant: no-common-ligatures;
                    font-kerning: auto;
                    font-optical-sizing: auto;
                    font-stretch: 100%;
                    font-variation-settings: normal;
                    font-feature-settings: normal;
                    text-transform: none;
                    text-decoration: none solid rgb(3, 3, 3);
                    text-align: start;
                    text-indent: 0px;
                }

                .login {
                    color: #030303;
                    font-size: 20px;
                    font-weight: 500;
                    font-style: normal;
                    font-variant: no-common-ligatures;
                    font-kerning: auto;
                    font-optical-sizing: auto;
                    font-stretch: 100%;
                    font-variation-settings: normal;
                    font-feature-settings: normal;
                    text-transform: none;
                    text-decoration: none solid rgb(3, 3, 3);
                    text-align: start;
                    text-indent: 0px;
                }

                .clickable {
                    cursor: pointer;
                    transition: transform 0.2s ease-in-out;
                    user-select: none; /* Prevent text selection */
                }

                .clickable:hover {
                    transform: scale(1.05); /* Slightly increase size on hover */
                }
            `}</style>
        </>
    );
}
