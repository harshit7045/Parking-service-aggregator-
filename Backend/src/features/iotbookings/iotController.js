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

            // Mark the `vehicleIn` field as modified and save the document
            booking.markModified("vehicleIn");
            await booking.save();

            break;
          }
        }

        if (booking.model === "hours") {
          const startTime = booking.timewiseBooking.startTime.split(" ")[0]; // '05:00:00'
          const endTime = booking.timewiseBooking.endTime.split(" ")[0]; // '06:00:00'

          let currentDate = booking.timewiseBooking.date; // Ensure this is in 'YYYY-MM-DD' format
          const formattedDate = currentDate.toISOString().split('T')[0]; 
          currentDate=formattedDate;
          const startTimeString = `${currentDate}T${startTime}+05:30`;
          const endTimeString = `${currentDate}T${endTime}+05:30`;
          console.log(startTimeString, endTimeString);
          const bookingDate = new Date(booking.timewiseBooking.date);
          const bookingStartTime = new Date(startTimeString);
          const bookingEndTime = new Date(endTimeString);

          console.log(
            "dddd  " + currentDate,
            bookingEndTime.toTimeString(), bookingStartTime.toTimeString()
          );
          if (
            now.toDateString() === bookingDate.toDateString() &&
            now >= bookingStartTime &&
            now <= bookingEndTime
          ) {
            booking.vehicleIn = true;
            bookingFound = true;

            // Mark the `vehicleIn` field as modified and save the document
            booking.markModified("vehicleIn");
            await booking.save();

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
          return res
            .status(200)
            .send(
              "Vehicle is already checked in the parking lot. It’s an exit scan request."
            );
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
        if (!res.headersSent) {
          return res.status(500).send("Error processing exit scan request.");
        }
      }
    } else if (bookingFound) {
      console.log("Valid booking found, vehicle is now checked in.");
      if (!res.headersSent) {
        return res.status(200).send("Vehicle is now checked in.");
      }
    } else {
      console.log("No valid booking found, creating a new booking request.");
      if (bookings) {
        console.log("Booking found but currently not valid");
      }
      const vehicleReq = {
        body: {
          uid: req.body.message,
        },
      };

      try {
        const vehicleResponse = await vehicleController.getVehicleByUid(
          vehicleReq,
          res
        );
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
