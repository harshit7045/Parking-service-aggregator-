import bookingmodel from "./bookingModel.js";
import parkingLotsController from "../parking_lots/prakinglotscontroller.js";
import { MAX, v4 as uuidv4 } from "uuid";
import { sendbookingEmail } from "../../utils/nodeMailer.js";

let bookingNumber;

const bookingController = {
  createBookingIot: async (req, res) => {
    const { name, pincode, vehicleUid } = req.body;
    let bookingNumber = uuidv4();
    console.log("fff" + req.user);

    let data = {
      body: {
        name: name,
        pincode: pincode,
        bookingNumber: bookingNumber,
      },
    };

     let lotNo;
    try {
      lotNo = await parkingLotsController.makeBookingFromIotOnPlace(data, res);
      if (res.headersSent) return; // Exit if a response has already been sent
    } catch (error) {
      console.error("Error in makeBookingFromIotOnPlace:", error);
      if (!res.headersSent) {
        return res.status(500).send("Error during lot booking.");
      }
    }

    try {
      const booking = await bookingmodel
        .create({
          name: name,
          pincode: pincode,
          vehicleUid: vehicleUid,
          model: "iot",
          bookingNumber: bookingNumber,
          vehicleIn: true,
          email: req.user.user,
          Lotno: lotNo,
          ownersPhoneNumber: req.user.phoneNumber,
          iotBooking: {
            status: true,
            startTime: new Date().toISOString(),
          },
        })
        .then((booking) => {
          console.log("Booking created:" + booking);
        });

      if (!booking) {
        if (!res.headersSent) {
          return res
            .status(500)
            .send("An error occurred while creating the booking.");
        }
      }

      if (!res.headersSent) {
        return res.status(200).send(booking);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      console.log("Error creating booking:", error);
      if (!res.headersSent) {
        return res
          .status(500)
          .send("An error occurred while creating the booking.");
      }
    }
  },

  createBooking: async (req, res) => {
    bookingNumber = uuidv4();
    const { name, pincode, vehicleUid, bookingModel } = req.body;
    const { model, time, date } = bookingModel;
    console.log(req.body);

    try {
      let bookingResponse;
      let bookingData;

      if (model === "hours") {
        // Prepare the request body for hour-wise booking
        req.body = {
          bookingNumber: bookingNumber,
          name: name,
          pincode: pincode,
          date: date,
          start: new Date(time.startTime).getHours(),
          end: new Date(time.endTime).getHours(),
        };

        bookingResponse = await parkingLotsController.makeBookingOnlineHourWise(
          req,
          res
        );

        if (!bookingResponse && !res.headersSent) {
          return res
            .status(409)
            .send("No available lots for the specified time.");
        }

        // Prepare booking data for hour-wise booking
        bookingData = {
          bookingNumber: bookingNumber,
          vehicleIn: false,
          email: req.user.user,
          Lotno: bookingResponse,
          name: name,
          pincode: pincode,
          vehicleUid: vehicleUid,
          model: "hours",
          ownersPhoneNumber: req.user.phoneNumber,
          timewiseBooking: {
            status: true,
            startTime: time.startTime,
            endTime: time.endTime,
            date: date,
          },
          datewiseBooking: {},
        };
      } else if (model === "date") {
        // Prepare the request body for date-wise booking
        req.body = {
          bookingNumber: bookingNumber,
          name: name,
          pincode: pincode,
          startDate: date[0], // Assuming `startTime` is the start date
          endDate: date[1], // Assuming `endTime` is the end date
          vehicleUid: vehicleUid,
        };

        bookingResponse = await parkingLotsController.makeBookingOnlineDateWise(
          req,
          res
        );

        if (!bookingResponse && !res.headersSent) {
          return res
            .status(409)
            .send("No available lots for the specified time.");
        }

        // Prepare booking data for date-wise booking
        bookingData = {
          bookingNumber: bookingNumber,
          email: req.user.user,
          Lotno: bookingResponse,
          vehicleIn: false,
          name: name,
          model: "date",
          pincode: pincode,
          vehicleUid: vehicleUid,
          ownersPhoneNumber: req.user.phoneNumber,
          timewiseBooking: {},
          datewiseBooking: {
            status: true,
            startDate: date[0],
            endDate: date[1],
          },
        };
      }

      console.log("Booking Data:", bookingData);
      const booking = new bookingmodel(bookingData);
      const result = await booking.save();

      if (!res.headersSent) {
        return res.status(201).send(result);
      }

      await sendbookingEmail(req.user.user, bookingData.Lotno);
    } catch (error) {
      console.log("Error in createBooking:", error);
      if (!res.headersSent) {
        return res.status(500).send(error);
      }
    }
  },

  findBookingByUidPincode: async (req, res) => {
    const uid = req.body.vehicleUid;
    const pincode = req.body.pincode;

    console.log(
      "Booking request received - UID: " + uid + ", Pincode: " + pincode
    );

    try {
      const booking = await bookingmodel.find({
        vehicleUid: uid,
        pincode: pincode,
      });

      return booking;
    } catch (error) {
      console.error("Error finding booking:", error);
    }
  },

  deleteBooking: async (req, res) => {
    const bookingNumber = req.body.id;
    try {
      const result = await bookingmodel.findOneAndDelete({
        bookingNumber: bookingNumber,
      });

      if (!result && !res.headersSent) {
        return res.status(404).send("Booking not found");
      }
      console.log("Booking deleted successfully");
      if (!res.headersSent) {
        return res.status(200).send("Booking deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      if (!res.headersSent) {
        return res
          .status(500)
          .send("An error occurred while deleting the booking");
      }
    }
  },
  createBillOfBooking: async(req, res) => {
    let booking = req.body;
    let bill = 0;
    let ratePerHour = 1;
    let currentTime = new Date();

    if (booking.model === "iot") {
        bill = (currentTime - new Date(booking.iotBooking.startTime)) / (1000 * 60 * 60) * ratePerHour;
    }

    if (booking.model === "hour") {
        let startTime = new Date(booking.timewiseBooking.startTime);
        let endTime = new Date(booking.timewiseBooking.endTime);
        let bookingDuration = (endTime - startTime) / (1000 * 60 * 60); 

        if (currentTime > endTime) {
            let extraTime = (currentTime - endTime) / (1000 * 60 * 60); 
            let extraTimeCost = extraTime * ratePerHour * 10;
            bill = extraTimeCost + (bookingDuration * ratePerHour);
        } else {
            bill = bookingDuration * ratePerHour;
        }
    }

    if (booking.model === "date") {
        let startDate = new Date(booking.datewiseBooking.startDate);
        let endDate = new Date(booking.datewiseBooking.endDate);
        let bookingDuration = (endDate - startDate) / (1000 * 60 * 60); 

        if (currentTime > endDate) {
            let extraTime = (currentTime - endDate) / (1000 * 60 * 60); 
            let extraTimeCost = extraTime * ratePerHour * 10;
            bill = extraTimeCost + (bookingDuration * ratePerHour);
        } else {
            bill = bookingDuration * ratePerHour;
        }
    }

  
    res.json({ bill: bill, booking: booking });
}
}
;

export default bookingController;
