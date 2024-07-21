import React from "react";
import "@fontsource/poppins"; // Import Poppins font

export default function Header() {
    return (
        <>
            <div className="min-h-[8vh] w-[100vw] shadow-xl px-[2vw]  flex items-center">
                <div className="text-[#030303] font-poppins text-[40px] font-bold not-italic normal-case no-underline text-left custom-font">
                    ParkEase
                </div>
                <div className="flex ml-[50vw] justify-evenly items-center w-[50vw] h-[100]">
                    <div className="find-parking">
                        Find Parking
                    </div>
                    <div className="  font-poppins login border-solid border-2 border-[#030303] shadow-xl px-8 py-.5  flex justify-center items-center ">
                        Login
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

            `}</style>
        </>
    );
}
