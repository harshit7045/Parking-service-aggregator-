import bookingmodel from "./bookingModel.js";
import parkingLotsController from "../parking_lots/prakinglotscontroller.js";
import { MAX, v4 as uuidv4 } from "uuid";
import { sendbookingEmail } from "../../utils/nodeMailer.js";
import userModel from "../user/user.model.js";
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
   
    const user = await userModel.findOne({ email: req.user.user });
    console.log(user.walletBalance);
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
          startDate: date[0], // Assuming startTime is the start date
          endDate: date[1], // Assuming endTime is the end date
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

      await sendbookingEmail("swati7045@gmail.com", bookingData.Lotno);
    } catch (error) {
      console.log("Error in createBooking:", error);
      if (!res.headersSent) {
        return res.status(500).send(error);
      }
    }
  },

 

  deleteBooking: async (req, res) => {
    const bookingNumber = req.body.id;

    try {
      let billingDetails = {
        body: {
          bookingNumber: bookingNumber,
        },
      };
      const x = {
        body: await bookingmodel.findOne({ bookingNumber: bookingNumber }),
      };
      console.log(x);
      let bill = await bookingController.createBillOfBooking(
        billingDetails,
        res
      );
      await parkingLotsController.removeBookingFromIot(x, res);
      const result = await bookingmodel.findOneAndDelete({
        bookingNumber: bookingNumber,
      });

      if (!result) {
        console.log("Booking not found");
        return res.status(404).send("Booking not found");
      }

      console.log("Booking deleted successfully");
      return res
        .status(200)
        .json({ message: "Booking deleted successfully", bill: bill.bill });
    } catch (error) {
      console.error("Error deleting booking:", error);
      return res
        .status(500)
        .send("An error occurred while deleting the booking");
    }
  },
  createBillOfBooking: async (req, res) => {
    let bookingNo = req.body.bookingNumber;
    let bill = 0;
    let ratePerHour = 1000000000000;
    let currentTime = new Date();
    let booking = await bookingmodel.findOne({
      bookingNumber: bookingNo,
    });
    console.log(booking);
    if (booking.model === "iot") {
      bill =
        ((currentTime - new Date(booking.iotBooking.startTime)) /
          (1000 * 60 * 60)) *
        ratePerHour;
    }

    if (booking.model === "hour") {
      let startTime = new Date(booking.timewiseBooking.startTime);
      let endTime = new Date(booking.timewiseBooking.endTime);
      let bookingDuration = (endTime - startTime) / (1000 * 60 * 60);

      if (currentTime > endTime) {
        let extraTime = (currentTime - endTime) / (1000 * 60 * 60);
        let extraTimeCost = extraTime * ratePerHour * 10;
        bill = extraTimeCost + bookingDuration * ratePerHour;
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
        bill = extraTimeCost + bookingDuration * ratePerHour;
      } else {
        bill = bookingDuration * ratePerHour;
      }
    }

    console.log("Bill: ", bill);
    return bill;
  },
};