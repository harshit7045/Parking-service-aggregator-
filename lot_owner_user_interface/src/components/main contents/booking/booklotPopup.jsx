import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import BasicPie from "./piechart.jsx";
import Cookies from "js-cookie";
import UseNumberInputCompact from "./counter.jsx"; // Assuming you are using this component elsewhere

export default function BooklotPopup() {
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    const ownerToken = Cookies.get("ownertoken");

    if (ownerToken) {
      const socket = io(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_SOCKETPORT}`); // Ensure the correct server URL

      socket.on("connect", () => {
        console.log("Connected to backend, Socket ID:", socket.id);
        console.log("Owner Token:", ownerToken);

        // Emit 'userConnected' event with ownerToken and socketId
        socket.emit("userConnected", { ownerToken, socketId: socket.id });
        console.log("userConnected event emitted");
      });
      socket.on("lotData", (data) => {
        setServerMessage(data);
      });
      return () => {
        socket.disconnect();
      };
    } else {
      console.error("No ownerToken found in cookies");
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-10">
      {/* Main content container */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
        {/* Pie chart container */}
        <div className="bg-white shadow-lg rounded-lg p-6 lg:w-1/2 w-full">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Parking Lots Visualization
          </h2>
          <div className="h-[70vh]">
            <BasicPie serverMessage={serverMessage} />
          </div>
        </div>

        {/* Right-side table and counter container */}
        <div className="w-full lg:w-[30vw] flex flex-col gap-6">
          {/* Table for Lot Data */}
          <div className="bg-white p-6 rounded-lg shadow-lg border hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 hover:bg-green-100">
            <h2 className="text-lg font-semibold text-green-600 text-center mb-4">
              Lot Availability
            </h2>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-green-500 px-4 py-2 bg-green-100 text-left">
                    Category
                  </th>
                  <th className="border border-green-500 px-4 py-2 bg-green-100">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {serverMessage && (
                  <>
                    <tr>
                      <td className="border border-green-500 px-4 py-2 text-left">
                        Online Booking Lots
                      </td>
                      <td className="border border-green-500 px-4 py-2 text-center">
                        <UseNumberInputCompact
                          lotno={
                            serverMessage.onlineBookingLotsAndOccupied +
                            serverMessage.onlineBookingLotsAndNotOccupied
                          }
                          name="Parking Lot A"
                          object="online"
                          serverMessage={serverMessage}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-green-500 px-4 py-2 text-left">
                        IoT Booking Lots 
                      </td>
                      <td className="border border-green-500 px-4 py-2 text-center">
                      <UseNumberInputCompact
                          lotno={
                            serverMessage.iotBookingLotsAndOccupied +
                            serverMessage.iotBookingLotsAndNotOccupied
                          }
                          name="Parking Lot A"
                          object="iot"
                          serverMessage={serverMessage}

                        />
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* General Parking Status Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg border hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 hover:bg-green-100">
            <h2 className="text-lg font-semibold text-green-600 text-center mb-4">
              Parking Lot Status
            </h2>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-green-500 px-4 py-2 bg-green-100 text-left">
                    Category
                  </th>
                  <th className="border border-green-500 px-4 py-2 bg-green-100">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {serverMessage && (
                  <>
                    <tr>
                      <td className="border border-green-500 px-4 py-2 text-left">
                        Online Booking Lots (Occupied)
                      </td>
                      <td className="border border-green-500 px-4 py-2 text-center">
                        {serverMessage.onlineBookingLotsAndOccupied}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-green-500 px-4 py-2 text-left">
                        IoT Booking Lots (Occupied)
                      </td>
                      <td className="border border-green-500 px-4 py-2 text-center">
                        {serverMessage.iotBookingLotsAndOccupied}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-green-500 px-4 py-2 text-left">
                        Online Booking Lots (Not Occupied)
                      </td>
                      <td className="border border-green-500 px-4 py-2 text-center">
                        {serverMessage.onlineBookingLotsAndNotOccupied}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-green-500 px-4 py-2 text-left">
                        IoT Booking Lots (Not Occupied)
                      </td>
                      <td className="border border-green-500 px-4 py-2 text-center">
                        {serverMessage.iotBookingLotsAndNotOccupied}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
