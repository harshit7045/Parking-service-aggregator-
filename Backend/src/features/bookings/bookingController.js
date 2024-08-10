import bookingmodel from "./bookingModel.js";
import parkingLotsController from "../parking_lots/prakinglotscontroller.js";
import { v4 as uuidv4 } from 'uuid';
import { sendbookingEmail } from "../../utils/nodeMailer.js";
let bookingNumber;
const bookingController = {
  createBooking: async (req, res) => {
    bookingNumber=uuidv4();
    const { name, pincode, vehicleUid, bookingModel } = req.body;
    const { model, time, date } = bookingModel;
    console.log(req.body);

    try {
      let bookingResponse;
      let bookingData;

      if (model === "hours") {
        // Prepare the request body for hour-wise booking
        req.body = {
          bookingNumber:bookingNumber,
          name: name,
          pincode: pincode,
          date: date,
          start: new Date(time.startTime).getHours(),
          end: new Date(time.endTime).getHours(),
        };

        bookingResponse = await parkingLotsController.makeBookingOnlineHourWise(req, res);

        if (!bookingResponse) {
          if (!res.headersSent) {
            return res.status(409).send("No available lots for the specified time.");
          }
        }

        // Prepare booking data for hour-wise booking
        bookingData = {
          bookingNumber:bookingNumber,
          email: req.user.user,
          Lotno: bookingResponse,
          name: name,
          pincode: pincode,
          vehicleUid: vehicleUid,
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
          bookingNumber:bookingNumber,
          name: name,
          pincode: pincode,
          startDate: date[0], // Assuming `startTime` is the start date
          endDate: date[1], // Assuming `endTime` is the end date
          vehicleUid: vehicleUid,
        };

        bookingResponse = await parkingLotsController.makeBookingOnlineDateWise(req, res);

        if (!bookingResponse) {
          if (!res.headersSent) {
            return res.status(409).send("No available lots for the specified time.");
          }
        }

        // Prepare booking data for date-wise booking
        bookingData = {
          bookingNumber:bookingNumber,
          email: req.user.user,
          Lotno: bookingResponse,
          name: name,
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
      //console.error("Error in createBooking:", error);
      console.log("Error in createBooking:", error);
      if (!res.headersSent) {
        return res.status(500).send(error);
      }
    }
  },
};

export default bookingController;
