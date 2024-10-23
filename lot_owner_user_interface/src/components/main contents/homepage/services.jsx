import React from "react";
import x from "../../../assets/images/wOMEN_IN_CAR.jpg"; // Ensure the correct path is used

const WhyChoose = () => {
  return (
    <div className="min-h-[110vh] max-w-[100vw] mt-[5vh] mb-[5vh] bg-white flex flex-col">
      {/* Image and Text Section */}
      <div className="flex flex-col lg:flex-row">
        <div className="flex justify-center w-full lg:w-auto lg:ml-[10vw] lg:mt-[15vh] rounded-xl overflow-hidden">
          <img src={x} alt="Women in car" className="w-[70vw] lg:w-auto h-auto" />
        </div>
        <div className="w-full lg:w-[30vw] lg:mt-[30vh] ml-[5vw] lg:ml-[5vw] mt-[3vh]">
          <div className="text-[#21303E] text-[35px] font-bold mb-2">
            Why Register Your Parking Lot with <br /> ParkEase?
          </div>
          <div className="text-gray-500 text-[16px] w-[80%] font-normal mt-[1vh] lg:mt-[3vh]">
            Join ParkEase to maximize your parking lot’s potential! Registering with us means you can offer seamless online bookings, including flexible date-wise and hour-wise options.
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div
        className="hidden lg:block h-[60vh] w-[65vw] mt-[-30vh] ml-[25vw] bg-aliceblue rounded-xl shadow-xl"
        id="map"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.557993303081!2d76.1877290763702!3d31.481342974231875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391adb198180014f%3A0xbf76347093a3aa9a!2sIndian%20Institute%20of%20Information%20Technology%20(IIIT)%20Una!5e0!3m2!1sen!2sin!4v1726321757381!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="IIIT Una Location"
        ></iframe>
      </div>
    </div>
  );
};

export default WhyChoose;
