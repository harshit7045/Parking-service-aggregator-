import bookingController from "../bookings/bookingController.js";
import vehicleController from "../vehicle/vehicleController.js";

const iotController = {
  iotbooking: async (req, res) => {
    console.log("IOT booking request received - Message: " + req.body.message);

    // Prepare request for finding booking
    const newReq = {
      body: {
        vehicleUid: req.body.message, // Assuming message is vehicleUid
        pincode: req.body.pincode,
      },
    };

    // Retrieve bookings
    let bookings;
    try {
      bookings = await bookingController.findBookingByUidPincode(newReq, res);
      if (res.headersSent) return; // Exit if a response has already been sent
    } catch (error) {
      console.error("Error finding booking:", error);
      if (!res.headersSent) {
        return res.status(500).send("Error finding booking.");
      }
    }

    console.log("Bookings found:", bookings);

    let bookingFound = false;
    const now = new Date();
    let alreadyEnteredTheLot = false;
    let bookingData = null;

    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      if (booking.vehicleIn === true) {
        alreadyEnteredTheLot = true;
        bookingData = booking; // Corrected index usage
        break;
      }

      if (booking.vehicleIn === false) {
        if (booking.model === "date") {
          const startDate = new Date(booking.datewiseBooking.startDate);
          const endDate = new Date(booking.datewiseBooking.endDate);

          // Compare only date parts, ignoring time
          if (now >= startDate && now <= endDate) {
            booking.vehicleIn = true;
            bookingFound = true;
            break;
          }
        }

        if (booking.model === "hour") {
          const bookingDate = new Date(booking.timewiseBooking.date);
          const bookingStartTime = new Date(booking.timewiseBooking.startTime);
          const bookingEndTime = new Date(booking.timewiseBooking.endTime);

          if (now.toDateString() === bookingDate.toDateString() &&
              now >= bookingStartTime && now <= bookingEndTime) {
            booking.vehicleIn = true;
            bookingFound = true;
            break;
          }
        }
      }
    }

    if (alreadyEnteredTheLot) {
      const reqDelete = {
        body: {
          id: bookingData.bookingNumber,
        },
      };
      try {
        await bookingController.deleteBooking(reqDelete, res);
        if (!res.headersSent) {
          return res.status(200).send("Vehicle is already checked in the parking lot. It’s an exit scan request.");
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
        if (!res.headersSent) {
          return res.status(500).send("Error processing exit scan request.");
        }
      }
    }

    else if (bookingFound) {
      console.log("Valid booking found, vehicle is now checked in.");
      if (!res.headersSent) {
        return res.status(200).send("Vehicle is now checked in.");
      }
    } else {
      console.log("No valid booking found, creating a new booking request.");
      const vehicleReq = {
        body: {
          uid: req.body.message,
        },
      };

      try {
        const vehicleResponse = await vehicleController.getVehicleByUid(vehicleReq, res);
        if (res.headersSent) return;

        const user = vehicleResponse; // Ensure you get the user data correctly
        console.log("User:", user);
        const data = {
          body: {
            name: req.body.name,
            pincode: req.body.pincode,
            vehicleUid: req.body.message,
            bookingModel: {
              model: "iot",
            },
            name: "ram", // Assuming message is vehicleUid
          },
          user: {
            user: user.email,
            phoneNumber: user.phoneNumber,
          },
        };
        console.log("Data:", data);
        const booking = await bookingController.createBookingIot(data, res);
        if (!res.headersSent) {
          return res.status(200).send("Booking created successfully.");
        }
      } catch (error) {
        console.error("Error creating booking:", error);
        if (!res.headersSent) {
          return res.status(500).send("Error creating booking.");
        }
      }
    }
  },
};

export default iotController;
