import userModel from "../user/user.model.js";
import parkingLotsController from "../parking_lots/prakinglotscontroller.js";
import { v4 as uuidv4 } from "uuid";
import { sendbookingEmail,sendEmail } from "../../utils/nodeMailer.js";
import bookingModel from "../../features/bookings/bookingModel.js";
let x = bookingModel;

const bookingController = {
  createBookingIot: async (req, res) => {
    console.log("createBookingIot:");
    const { name, pincode, vehicleUid } = req.body;
    const bookingNumber = uuidv4();

    const data = {
      body: {
        name: name,
        pincode: pincode,
        bookingNumber: bookingNumber,
      },
    };

    let lotNo;
    try {
      lotNo = await parkingLotsController.makeBookingFromIotOnPlace(data, res);
      if (res.headersSent) return; 
    } catch (error) {
      console.error("Error in makeBookingFromIotOnPlace:", error);
      if (!res.headersSent) {
        return res.status(500).send("Error during lot booking.");
      }
    }

    try {
      const bookingData = {
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
      };
      const booking = new bookingModel(bookingData);
      const result = await booking.save();

      if (!result) {
        console.error("Error creating booking:", error);
        if (!res.headersSent) {
          return res
            .status(500)
            .send("An error occurred while creating the booking.");
        }
      }
     
      //parkingLotsController.hadelLotDataCashe(changeReq,res);
      return res.status(200).send(result);
    } catch (error) {
      console.error("Error creating booking:", error);
      if (!res.headersSent) {
        return res
          .status(500)
          .send("An error occurred while creating the booking.");
      }
    }
  },

  createBooking: async (req, res) => {
    console.log(req.body);
    const bookingNumber = uuidv4();
    const { name, pincode, vehicleUid, bookingModel } = req.body;
    const { model, time, date } = bookingModel;

    try {
      const user = await userModel.findOne({ email: req.user.user });

      const walletBalance = user.walletBalance;
      let bookingCost = 0;
      let bookingResponse;
      let bookingData;

      if (model === "hours") {
        const currentDate = new Date(date).toISOString().split("T")[0]; 
        const startTimeString = `${currentDate}T${
          time.startTime.split(" ")[0]
        }+05:30`;
        const endTimeString = `${currentDate}T${
          time.endTime.split(" ")[0]
        }+05:30`;
        console.log(startTimeString, endTimeString);
        const startTime = new Date(startTimeString);
        const endTime = new Date(endTimeString);
        const hoursDifference = (endTime - startTime) / (1000 * 60 * 60);
        bookingCost = hoursDifference * 100; 
        console.log(
          "1111"+
          time.startTime,
          time.endTime,
          startTime,
          endTime,
          hoursDifference,
          bookingCost
        );
        if (walletBalance < bookingCost) {
          console.log("insufficient balence");
          sendEmail(req.user.user, `Insufficient wallet balance. Available: ${walletBalance}, Required: ${bookingCost}`);
          return res
            .status(400)
            .send(
              `Insufficient wallet balance. Available: ${walletBalance}, Required: ${bookingCost}`
            );
        }

         let a = {
          body: {
            bookingNumber: bookingNumber,
            name: name,
            pincode: pincode,
            date: date,
            start: new Date(`1970-01-01T${time.startTime.split(' ')[0]}Z`).getUTCHours(),
            end: new Date(`1970-01-01T${time.endTime.split(' ')[0]}Z`).getUTCHours(),

          },
          
        };
        console.log(a+"hourwise booking");
        bookingResponse = await parkingLotsController.makeBookingOnlineHourWise(
          a,
          res
        );

        if (!bookingResponse && !res.headersSent) {
          return res
            .status(409)
            .send("No available lots for the specified time.");
        }

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
        const startDate = new Date(date[0]);
        const endDate = new Date(date[1]);
        const bookingDuration = (endDate - startDate) / (1000 * 60 * 60 * 24); 
        bookingCost = bookingDuration * 1000; 
        console.log(date[0], date[1], bookingDuration, bookingCost);
        if (walletBalance < bookingCost) {
          console.log("insufficient balence");
          sendEmail(req.user.user, `Insufficient wallet balance. Available: ${walletBalance}, Required: ${bookingCost}`);
          return res
            .status(400)
            .send(
              {message:"Insufficient wallet balance. Available: "+walletBalance+", Required: "+bookingCost}
            );
        }

        req.body = {
          bookingNumber: bookingNumber,
          name: name,
          pincode: pincode,
          startDate: date[0],
          endDate: date[1],
          vehicleUid: vehicleUid,
        };
        if(!date[0] || !date[1]){
          return res
            .status(400)
            .send({message:"Please enter valid dates"});
        }
        bookingResponse = await parkingLotsController.makeBookingOnlineDateWise(
          req,
          res
        );

        if (!bookingResponse && !res.headersSent) {
          return res
            .status(409)
            .send({message:"No available lots for the specified dates."});
        }

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
      console.log( "bookingData"+bookingData);
      const booking = new x(bookingData);
      const result = await booking.save();
      console.log("Before subtraction:", user.walletBalance, bookingCost);
      user.walletBalance -= bookingCost;
      console.log("After subtraction:", user.walletBalance);
      await user.save();

      await sendbookingEmail(req.user.user, bookingData.Lotno);

      return res.status(201).send(result);
    } catch (error) {
      console.log("Error in createBooking:", error);
      if (!res.headersSent) {
        return res.status(500).send("Error creating booking.");
      }
    }
  },

  deleteBooking: async (req, res) => {
    const bookingNumber = req.body.id;

    try {
      const booking = await bookingModel.findOne({
        bookingNumber: bookingNumber,
      });
      if (!booking) {
        return res.status(404).send("Booking not found");
      }

      const user = await userModel.findOne({ email: booking.email });
      let bill = 0;
      const currentTime = new Date();

      if (booking.model === "iot") {
        bill =
          ((currentTime - new Date(booking.iotBooking.startTime)) /
            (1000 * 60 * 60)) *
          100; 
      } else if (booking.model === "hours") {
        const endTime = new Date(booking.timewiseBooking.endTime);
        if (currentTime > endTime) {
          const extraTime = (currentTime - endTime) / (1000 * 60 * 60);
          bill = extraTime * 100 * 10; 
        }
      } else if (booking.model === "date") {
        const endDate = new Date(booking.datewiseBooking.endDate);
        if (currentTime > endDate) {
          const extraTime = (currentTime - endDate) / (1000 * 60 * 60);
          bill = extraTime * 100 * 10; 
        }
      }

      user.walletBalance -= bill;
      await user.save();
      let dummydata = {
        body: booking,
      };
      await parkingLotsController.removeBookingFromIot(dummydata, res);
      await bookingModel.deleteOne({ bookingNumber: bookingNumber });

      return res.status(200).send("Booking deleted successfully.");
    } catch (error) {
      console.log("Error in deleteBooking:", error);
      if (!res.headersSent) {
        return res.status(500).send("Failed to delete booking.");
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
      const booking = await x.find({
        vehicleUid: uid,
        pincode: pincode,
      });

      return booking;
    } catch (error) {
      console.error("Error finding booking:", error);
    }
  },
};

export default bookingController;
