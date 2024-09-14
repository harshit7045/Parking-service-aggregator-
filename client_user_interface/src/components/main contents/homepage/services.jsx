import React from "react";
import x from "../../../assets/images/wOMEN_IN_CAR.jpg"; // Ensure the correct path is used

const WhyChoose = () => {
  return (
    <div className="min-h-[115vh] max-w-[100vw]  bg-white flex flex-col">
      {/* Image and Text Section */}
      <div className="flex  flex-col sm:flex-col lg:flex-row">
        <div className= " mobile:justify-center mobile:flex w-auto laptop:ml-[10vw] laptop:w-auto laptop:mt-[15vh] laptop:rounded-xl laptop:overflow-hidden">
          <img src={x} alt="Women in car" className="  mobile:w-[70vw] lg:w-auto h-auto" />
        </div>
        <div className="mobile:w-[75vw]  h-[30vh] lg:w-[30vw] lg: mt-[30vh] ml-[10vw] mobile:mt-[3vh] mobile:mr-[10vw] laptop:mt-[20vh] laptop:ml-[5vw]">
          <div className="text-[#21303E] text-[35px] font-bold mb-2">
            Why Choose <br /> ParkEase?
          </div>
          <div className="text-gray-500 text-[16px] font-normal laptop:mt-[3vh] mobile:mt-[1vh]">
            Short Stay and Valet parking options are just a few minutes' walk
            away from the terminal. If you're opting for Long Stay, the car park
            is just 10 minutes away by bus and shuttles run every 10-15 minutes.
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div
        className="hidden lg:block   h-[60vh] w-[65vw] mt-[-30vh] ml-[25vw] bg-aliceblue rounded-xl shadow-xl"
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
