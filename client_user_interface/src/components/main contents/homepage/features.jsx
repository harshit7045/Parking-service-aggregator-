import React from "react";
import "@fontsource/poppins";
import car from "../../../assets/images/car-svgrepo-com (1).svg";
import tree from "../../../assets/images/tree-svgrepo-com.svg";
import building from "../../../assets/images/building-flag-svgrepo-com.svg";
import ticket from "../../../assets/images/ticket2-svgrepo-com.svg";
import valet from "../../../assets/images/valet-head-svgrepo-com.svg";
import online from "../../../assets/images/online-test-svgrepo-com.svg";

export default function Features() {
  return (
    <>
      <div className="min-h-[30vh] bg-[#d3d3d3] max-w-[100vw] flex flex-wrap justify-between px-[5vw] py-[5vh]">
      <div className="min-w-[20vw] h-[9vh] bg-[#ffffff] border-dotted border-1 border-[#030303] m-[2.5vw] rounded-[10px] flex flex-wrap">
          <div className="w-[20%] m-[3%] h-[80%]">
            <img
              src={car}
              alt="Car"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="login justify-center flex items-center  w-[70%] p-[1vw] ">
            Indoor
          </div>
        </div>
        <div className="min-w-[20vw] h-[9vh] bg-[#ffffff] border-dotted border-1 border-[#030303] m-[2.5vw] rounded-[10px] flex flex-wrap">
          <div className="w-[20%] m-[3%] h-[80%]">
            <img
              src={building}
              alt="Car"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="login justify-center flex items-center  w-[70%] p-[1vw] ">
            Outdoor
          </div>
        </div>
        <div className="min-w-[20vw] h-[9vh] bg-[#ffffff] border-dotted border-1 border-[#030303] m-[2.5vw] rounded-[10px] flex flex-wrap">
          <div className="w-[20%] m-[3%] h-[80%]">
            <img
              src={online}
              alt="Car"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="login justify-center flex items-center  w-[70%] p-[1vw] ">
            Online Booking
          </div>
        </div>
        <div className="min-w-[20vw] h-[9vh] bg-[#ffffff] border-dotted border-1 border-[#030303] m-[2.5vw] rounded-[10px] flex flex-wrap">
          <div className="w-[20%] m-[3%] h-[80%]">
            <img
              src={tree}
              alt="Car"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="login justify-center flex items-center  w-[70%] p-[1vw] ">
            Street
          </div>
        </div>
        <div className="min-w-[20vw] h-[9vh] bg-[#ffffff] border-dotted border-1 border-[#030303] m-[2.5vw] rounded-[10px] flex flex-wrap">
          <div className="w-[20%] m-[3%] h-[80%]">
            <img
              src={valet}
              alt="Car"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="login justify-center flex items-center  w-[70%] p-[1vw] ">
            Valet
          </div>
        </div>
        <div className="min-w-[20vw] h-[9vh] bg-[#ffffff] border-dotted border-1 border-[#030303] m-[2.5vw] rounded-[10px] flex flex-wrap">
          <div className="w-[20%] m-[3%] h-[80%]">
            <img
              src={ticket}
              alt="Car"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="login justify-center flex items-center  w-[70%] p-[1vw] ">
            Reserved
          </div>
        </div>
      </div>
      <style jsx>{`
        .login {
          color: #030303;
          font-size: 24px;
          font-weight: 700;
          font-family: Poppins;
          font-variant: no-common-ligatures;
          font-kerning: auto;
          font-optical-sizing: auto;
          font-stretch: 100%;
          font-variation-settings: normal;
          font-feature-settings: normal;
          text-transform: none;
          text-decoration: none solid rgb(3, 3, 3);
          text-align: center;
          text-indent: 0px;
        }
      `}</style>
    </>
  );
}
