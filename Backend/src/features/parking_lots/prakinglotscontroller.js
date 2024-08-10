import ParkingLotModel from "./parkingLotsModel.js";

function isDateBetween(dateToCheck, startDate, endDate) {
  const date = new Date(dateToCheck);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return date >= start && date <= end;
}

function clash(newStartDate, newEndDate, prevStartDate, prevEndDate) {
  const newStart = new Date(newStartDate);
  const newEnd = new Date(newEndDate);
  const prevStart = new Date(prevStartDate);
  const prevEnd = new Date(prevEndDate);

  return newStart <= prevEnd && newEnd >= prevStart;
}

const parkingLotsController = {
  getParkingLots: async (req, res) => {
    try {
      const pincode = req.query.pincode;

      console.log(`Searching for parking lot: ${pincode}`);
      
      let data = await ParkingLotModel.find({ pincode });
        console.log(data);
      if (!data) {
        console.log("Parking lot not found");
        return res.status(404).send("Parking lot not found");
      }
      res.status(200).send(data);
      
    } catch (error) {
      console.error("Error during fetching parking lots:", error);
      res.status(500).send("Server error");
    }
  },

  makeBookingOnlineDateWise: async (req, res) => {
    const { name, pincode, vehicleUid, startDate, endDate ,bookingNumber} = req.body;
    console.log(`Booking request received for ${name}, ${pincode}, vehicle: ${vehicleUid}, from ${startDate} to ${endDate}`);

    try {
      let data = await ParkingLotModel.findOne({ name, pincode });

      if (!data) {
        console.log("Parking lot not found");
        return res.status(404).send("Parking lot not found");
      }

      let lotFound = false;
      let bookedLotNo = null;

      for (let i = 0; i < data.lots.length; i++) {
        const lot = data.lots[i];

        if (lot.iotbooking) {
          console.log(`Lot ${lot.lotNo} is reserved for IoT bookings. Skipping.`);
          continue;
        }

        let datewiseBookingFlag = false;
        for (let j = 0; j < lot.bookingsDateWise.length; j++) {
          const booking = lot.bookingsDateWise[j];
          if (clash(booking.date, booking.endTime, startDate, endDate)) {
            datewiseBookingFlag = true;
            console.log(`Datewise clash detected for lot ${lot.lotNo}.`);
            break;
          }
        }

        if (datewiseBookingFlag) continue;

        let hourwiseBookingFlag = lot.bookingsHourWise.some(
          (booking) => booking.date === startDate
        );

        if (hourwiseBookingFlag) {
          console.log(`Hourwise clash detected for lot ${lot.lotNo}.`);
          continue;
        }

        lot.bookingsDateWise.push({
          date: startDate,
          vehicleUid,
          endTime: endDate,
          bookingNumber:bookingNumber
        });

        lotFound = true;
        bookedLotNo = lot.lotNo;
        console.log(`Booking successful for lot ${lot.lotNo}.`);
        break;
      }

      if (!lotFound) {
        console.log("No available lots found.");
        return res.status(409).send("No available lots for the specified time.");
      }

      data.markModified("lots");
      await data.save();

      console.log("Data successfully saved.");
      res.status(200).send({
        message: "Booking successful",
        lotNo: bookedLotNo,
      });
      return bookedLotNo;
    } catch (error) {
      console.error("Error during booking:", error);
      res.status(500).send("Server error");
    }
  },

  makeBookingOnlineHourWise: async (req, res) => {
    const { name, pincode, date, start, end, bookingNumber } = req.body;
    console.log(`Hour-wise booking request received for ${name}, ${pincode}, date: ${date}, from ${start}:00 to ${end}:00`);

    try {
      let data = await ParkingLotModel.findOne({ name, pincode });

      if (!data) {
        console.log("Parking lot not found");
        return res.status(404).send("Parking lot not found");
      }

      let lotFound = false;
      let bookedLotNo = null;

      for (let i = 0; i < data.lots.length; i++) {
        const lot = data.lots[i];

        if (lot.iotbooking) {
          console.log(`Lot ${lot.lotNo} is reserved for IoT bookings. Skipping.`);
          continue;
        }

        let datewiseBookingFlag = lot.bookingsDateWise.some((booking) =>
          isDateBetween(date, booking.date, booking.endTime)
        );

        if (datewiseBookingFlag) {
          console.log(`Datewise clash detected for lot ${lot.lotNo}.`);
          continue;
        }

        let hourwiseBookingFlag = lot.bookingsHourWise.findIndex(
          (booking) => booking.date === date
        );

        if (hourwiseBookingFlag === -1) {
          let time = Array(24).fill(false);
          for (let z = start; z <= end; z++) {
            time[z] = true;
          }
          lot.bookingsHourWise.push({ date, time, bookingNumber:bookingNumber });
          console.log(`No previous hour bookings found for date ${date}. Creating new time slots.`);
        } else {
          let time = lot.bookingsHourWise[hourwiseBookingFlag].time;
          let conflict = false;

          for (let z = start; z < end; z++) {
            if (time[z] === true) {
              conflict = true;
              break;
            }
          }

          if (conflict) {
            console.log(`Hourwise clash detected within the time slots ${start}:00 to ${end}:00 for lot ${lot.lotNo}.`);
            continue;
          }

          for (let z = start; z < end; z++) {
            time[z] = true;
          }
          lot.bookingsHourWise[hourwiseBookingFlag].time = time;
        }

        lotFound = true;
        bookedLotNo = lot.lotNo;
        console.log(`Booking successful for lot ${lot.lotNo}.`);
        break;
      }

      if (!lotFound) {
        console.log("No available lots found.");
        return res.status(409).send("No available lots for the specified time.");
      }

      data.markModified("lots");
      await data.save();

      console.log("Data successfully saved.");
      res.status(200).send({
        message: "Booking successful",
        lotNo: bookedLotNo,
      });
      return bookedLotNo;
    } catch (error) {
      console.error("Error during booking:", error);
      res.status(500).send("Server error");
    }
  },

  registerParkingLot: async (req, res) => {
    const { phoneNumber, name, maxCapacity, occupancy, pincode } = req.body;
    console.log(`Registering parking lot: ${name}, ${pincode}, max capacity: ${maxCapacity}`);

    let space = [];
    for (let i = 0; i < maxCapacity; i++) {
      if (i < maxCapacity / 2) {
        space.push({
          lotNo: i + 1,
          occupied: false,
          bookingsDateWise: [],
          bookingsHourWise: [],
          iotbooking: false,
        });
      } else {
        space.push({
          lotNo: i + 1,
          occupied: false,
          bookings: [],
          iotbooking: true,
        });
      }
    }

    let data = {
      ownerPhoneNumber: phoneNumber,
      name: name,
      maxCapacity: maxCapacity,
      occupancy: occupancy,
      pincode: pincode,
      lots: space,
    };

    try {
      const parkingLot = new ParkingLotModel(data);
      const result = await parkingLot.save();
      console.log("Parking lot registered successfully:", result);
      res.status(201).send(result);
    } catch (error) {
      console.error("Error registering parking lot:", error);
      res.status(500).send(error);
    }
  },
};

export default parkingLotsController;
