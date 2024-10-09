import ParkingLotModel from "./parkingLotsModel.js";
import redis from "../../db/redis.js";
import { emitToSpecificSocket } from "../../socket.js";

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
    const { name, pincode, vehicleUid, startDate, endDate, bookingNumber } =
      req.body;
    console.log(
      `Booking request received for ${name}, ${pincode}, vehicle: ${vehicleUid}, from ${startDate} to ${endDate}`
    );

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
          console.log(
            `Lot ${lot.lotNo} is reserved for IoT bookings. Skipping.`
          );
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
          bookingNumber: bookingNumber,
        });
        lot.occupied = true;

        lotFound = true;
        bookedLotNo = lot.lotNo;
        console.log(`Booking successful for lot ${lot.lotNo}.`);
        break;
      }

      if (!lotFound) {
        console.log("No available lots found.");
        return res
          .status(409)
          .send("No available lots for the specified time.");
      }

      data.markModified("lots");
      await data.save();

      console.log("Data successfully saved.");
      res.status(200).send({
        message: "Booking successful",
        lotNo: bookedLotNo,
      });
      let changeReq = {
        user: {
          ownerId: data.ownerId,
          user: data.ownerEmail,
        },
        body: {
          lotValueToUpdate: "onlineBookingLotsAndOccupied",
          value: 1,
        },
      };
      console.log("dsddd");
      await parkingLotsController.hadelLotDataCashe(changeReq, res);

      return bookedLotNo;
    } catch (error) {
      console.error("Error during booking:", error);
      res.status(500).send("Server error");
    }
  },

  makeBookingOnlineHourWise: async (req, res) => {
    console.log(req.body);
    const { name, pincode, date, start, end, bookingNumber } = req.body;
    console.log(
      `Hour-wise booking request received for ${name}, ${pincode}, date: ${date}, from ${start}:00 to ${end}:00`
    );

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
          console.log(
            `Lot ${lot.lotNo} is reserved for IoT bookings. Skipping.`
          );
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
          console.log("hourwiseBookingFlag: ", hourwiseBookingFlag);
          let time = Array(24).fill(false);
          for (let z = start; z <= end; z++) {
            time[z] = true;
          }
          lot.bookingsHourWise.push({
            date,
            time,
            bookingNumber: bookingNumber,
          });
          lot.occupied = true;
          console.log(
            `No previous hour bookings found for date ${date}. Creating new time slots.`
          );
        } else {
          console.log("hourwiseBookingFlag: ", hourwiseBookingFlag);
          let time = lot.bookingsHourWise[hourwiseBookingFlag].time;
          let conflict = false;

          for (let z = start; z < end; z++) {
            if (time[z] === true) {
              conflict = true;
              break;
            }
          }

          if (conflict) {
            console.log(
              `Hourwise clash detected within the time slots ${start}:00 to ${end}:00 for lot ${lot.lotNo}.`
            );
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
        return res
          .status(409)
          .send("No available lots for the specified time.");
      }

      data.markModified("lots");
      await data.save();

      console.log("Data successfully saved.");
      res.status(200).send({
        message: "Booking successful",
        lotNo: bookedLotNo,
      });
      let changeReq = {
        user: {
          ownerId: data.ownerId,
          user: data.ownerEmail,
        },
        body: {
          lotValueToUpdate: "onlineBookingLotsAndOccupied",
          value: 1,
        },
      };
      console.log("dsddd");
      await parkingLotsController.hadelLotDataCashe(changeReq, res);
      return bookedLotNo;
    } catch (error) {
      console.error("Error during booking:", error);
      res.status(500).send("Server error");
    }
  },
  makeBookingFromIot: async (req, res) => {
    const { name, pincode, bookingNumber } = req.body;

    try {
      const lot = await ParkingLotModel.findOne({ name, pincode });

      if (!lot) {
        console.log("Parking lot not found");
        return res.status(404).send("Parking lot not found");
      }

      let lotFound = false;

      for (let i = 0; i < lot.lots.length; i++) {
        const currentLot = lot.lots[i];

        if (currentLot.iotbooking && !currentLot.occupied) {
          currentLot.occupied = true;
          currentLot.bookings.push({
            bookingNumber: bookingNumber,
            startTime: new Date().toISOString(),
          });
          
          lotFound = true;
          console.log(`IoT booking successful for lot ${currentLot.lotNo}.`);
          break;
        }
      }

      if (!lotFound) {
        console.log(
          "No available IoT lots found or all IoT lots are occupied."
        );
        return res
          .status(409)
          .send("No available IoT lots or all IoT lots are occupied.");
      }
      
      lot.markModified("lots");
      await lot.save();
      return lot.lotNo;
      console.log("IoT booking data successfully saved.");
      res.status(200).send({
        message: "IoT booking successful",
      });
    } catch (error) {
      console.error("Error during IoT booking:", error);
      res.status(500).send("Server error");
    }
  },

  makeBookingFromIotOnPlace: async (req, res) => {
    const { name, pincode, bookingNumber } = req.body;

    try {
      const lot = await ParkingLotModel.findOne({ name, pincode });
      
      if (!lot) {
        console.log("Parking lot not found");
        return res.status(404).send("Parking lot not found");
      }

      let lotNo = 0;

      for (let i = 0; i < lot.lots.length; i++) {
        const currentLot = lot.lots[i];

        if (currentLot.iotbooking && !currentLot.occupied) {
          lotNo = currentLot.lotNo;
          currentLot.occupied = true;
          currentLot.bookings.push({
            bookingNumber: bookingNumber,
            startTime: new Date().toISOString(),
          });

          lot.markModified("lots");

          await lot.save();
          console.log("Data successfully saved.");
          console.log("IoT booking successful, lot number:", lotNo);
          let changeReq = {
            user: {
              ownerId: lot.ownerId,
              user: lot.ownerEmail,
            },
            body: {
              lotValueToUpdate: "iotBookingLotsAndOccupied",
              value: 1,
            },
          };
          console.log("dsddd");
          await parkingLotsController.hadelLotDataCashe(changeReq, res);
          return lotNo;

          return res.status(200).send({
            message: "IoT booking successful",
            lotNo: lotNo,
          });

          break;
        }
      }

      if (lotNo === 0) {
        console.log(
          "No available IoT lots found or all IoT lots are occupied."
        );
        return res
          .status(409)
          .send("No available IoT lots or all IoT lots are occupied.");
      }
    } catch (error) {
      console.error("Error during IoT booking:", error);
      return res.status(500).send("Server error");
    }
  },

  registerParkingLot: async (req, res) => {
    const { phoneNumber, email } = req.body;
    const { ownerId } = req.owner;
    const { lots } = req.body;

    for (let i = 0; i < lots.length; i++) {
      const { name, pincode, maxCapacity } = lots[i];
      console.log(
        `Registering parking lot: ${name}, ${pincode}, max capacity: ${maxCapacity}`
      );

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
        ownerEmail: email,
        name: name,
        maxCapacity: maxCapacity,
        occupancy: 0,
        pincode: pincode,
        lots: space,
        ownerId: ownerId,
      };

      try {
        const parkingLot = new ParkingLotModel(data);
        const result = await parkingLot.save();
        console.log("Parking lot registered successfully:", result);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error registering parking lot:", error);
        if (!res.headersSent) {
          res.status(500).send("Server error");
        }
      }
    }
  },
  removeBookingFromIot: async (req, res) => {
    console.log(req.body);
    const { name, pincode, bookingNumber, Lotno, model } = req.body;

    try {
      const lot = await ParkingLotModel.findOne({ name, pincode });
      if (!lot) {
        console.log("Parking lot not found");
        return res.status(404).send("Parking lot not found");
      }

      console.log(`Removing booking from Lotno: ${Lotno}`);
      let bookedLot = lot.lots.find((lot) => lot.lotNo == Lotno);

      if (!bookedLot) {
        console.log("Lot not found");
        return res.status(404).send("Lot not found");
      }

      let index;
      if (model === "iot") {
        index = bookedLot.bookings.findIndex(
          (booking) => booking.bookingNumber === bookingNumber
        );
        if (index !== -1) {
          bookedLot.bookings.splice(index, 1);
        } else {
          console.log("Booking not found in IoT bookings");
          return res.status(404).send("Booking not found in IoT bookings");
        }
        try {
          let changeReq = {
            user: {
              ownerId: lot.ownerId,
              user: lot.ownerEmail,
            },
            body: {
              lotValueToUpdate: "iotBookingLotsAndNotOccupied",
              value: 1,
            },
          };
          console.log("dsddd");
          await parkingLotsController.hadelLotDataCashe(changeReq, res);
        } catch (error) {
          console.log(error);
        }
      } else if (model === "date") {
        index = bookedLot.bookingsDateWise.findIndex(
          (booking) => booking.bookingNumber === bookingNumber
        );
        if (index !== -1) {
          bookedLot.bookingsDateWise.splice(index, 1);
        } else {
          console.log("Booking not found in datewise bookings");
          return res.status(404).send("Booking not found in datewise bookings");
        }
        try {
          let changeReq = {
            user: {
              ownerId: lot.ownerId,
              user: lot.ownerEmail,
            },
            body: {
              lotValueToUpdate: "onlineBookingLotsAndNotOccupied",
              value: 1,
            },
          };
          console.log("dsddd");
          await parkingLotsController.hadelLotDataCashe(changeReq, res);
        } catch (error) {
          console.log(error);
        }
      } else if (model === "hours") {
        index = bookedLot.bookingsHourWise.findIndex(
          (booking) => booking.bookingNumber === bookingNumber
        );
        if (index !== -1) {
          bookedLot.bookingsHourWise.splice(index, 1);
        } else {
          console.log("Booking not found in hourwise bookings");
          return res.status(404).send("Booking not found in hourwise bookings");
        }
        try {
          let changeReq = {
            user: {
              ownerId: lot.ownerId,
              user: lot.ownerEmail,
            },
            body: {
              lotValueToUpdate: "onlineBookingLotsAndNotOccupied",
              value: 1,
            },
          };
          console.log("dsddd");
          await parkingLotsController.hadelLotDataCashe(changeReq, res);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log(model);
        console.log("Invalid model type");
        return res.status(400).send("Invalid model type");
      }

      if (model === "iot" && bookedLot.bookings.length === 0) {
        bookedLot.occupied = false;
      } else if (
        bookedLot.bookingsDateWise.length === 0 &&
        bookedLot.bookingsHourWise.length === 0
      ) {
        bookedLot.occupied = false;
      }

      lot.markModified("lots");

      await lot.save();
      console.log("Booking removed successfully");
      return res.status(200).send("Booking removed successfully");
    } catch (error) {
      console.error("Error removing booking:", error);
      return res.status(500).send("Server error");
    }
  },
  setLotData: async (req, res) => {
    console.log(req.body);
    try {
      const { user, phoneNumber, ownerId } = req.user;
      const { name } = req.body;
  
      // Await Redis get method and parse the result
      let lotData = await redis.get(ownerId);
      if (lotData) {
        // If lotData is found in Redis, return it immediately
        return JSON.parse(lotData);  // This is fine because lotData is likely a string
      }
  
      lotData = await ParkingLotModel.findOne({
        ownerPhoneNumber: phoneNumber,
        ownerEmail: user,
        name: name,
      });
      console.log(lotData);
      let counts = {
        onlineBookingLotsAndOccupied: 0,
        iotBookingLotsAndOccupied: 0,
        onlineBookingLotsAndNotOccupied: 0,
        iotBookingLotsAndNotOccupied: 0,
      };
  
      if (lotData) {
        counts.onlineBookingLotsAndOccupied = lotData.lots.filter(
          (lot) => lot.occupied === true && lot.iotbooking === false
        ).length;
  
        counts.onlineBookingLotsAndNotOccupied = lotData.lots.filter(
          (lot) => lot.occupied === false && lot.iotbooking === false
        ).length;
  
        counts.iotBookingLotsAndOccupied = lotData.lots.filter(
          (lot) => lot.occupied === true && lot.iotbooking === true
        ).length;
  
        counts.iotBookingLotsAndNotOccupied = lotData.lots.filter(
          (lot) => lot.occupied === false && lot.iotbooking === true
        ).length;
  
        // Set the counts object to Redis
        await redis.set(ownerId, JSON.stringify(counts), "EX", 600);
      }
      console.log("ss" + counts);
      // Return the counts object directly
      return counts;  // No need to use JSON.parse here
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  

  hadelLotDataCashe: async (req, res) => {
    console.log("aa");
    try {
      const { user, phoneNumber, ownerId } = req.user;
      let email = user;

      // Await Redis get method and parse the result
      let lotData = await redis.get(ownerId);
      if (lotData) {
        // Parse the Redis data if it's a string
        lotData = JSON.parse(lotData);
        const { lotValueToUpdate, value } = req.body;

        // Update lotData properties based on the lotValueToUpdate
        if (lotValueToUpdate === "onlineBookingLotsAndOccupied") {
          lotData.onlineBookingLotsAndOccupied =
            (lotData.onlineBookingLotsAndOccupied || 0) + value;
          lotData.onlineBookingLotsAndNotOccupied =
            (lotData.onlineBookingLotsAndNotOccupied || 0) - value;
        } else if (lotValueToUpdate === "iotBookingLotsAndOccupied") {
          lotData.iotBookingLotsAndOccupied =
            (lotData.iotBookingLotsAndOccupied || 0) + value;
          lotData.iotBookingLotsAndNotOccupied =
            (lotData.iotBookingLotsAndNotOccupied || 0) - value;
        } else if (lotValueToUpdate === "onlineBookingLotsAndNotOccupied") {
          lotData.onlineBookingLotsAndNotOccupied =
            (lotData.onlineBookingLotsAndNotOccupied || 0) + value;
          lotData.onlineBookingLotsAndOccupied =
            (lotData.onlineBookingLotsAndOccupied || 0) - value;
        } else if (lotValueToUpdate === "iotBookingLotsAndNotOccupied") {
          lotData.iotBookingLotsAndNotOccupied =
            (lotData.iotBookingLotsAndNotOccupied || 0) + value;
          lotData.iotBookingLotsAndOccupied =
            (lotData.iotBookingLotsAndOccupied || 0) - value;
        }
        
        // Get socket ID and emit updated lotData to the specific socket
        const socketId = await redis.hget(email, "socketId");
        console.log(lotData);
        console.log(socketId + user);
        emitToSpecificSocket(socketId, "lotData", lotData);

        // Set the updated object to Redis and send a response
        await redis.set(ownerId, JSON.stringify(lotData), "EX", 600);
        //return res.status(200).send(lotData);
      } else {
        // If lotData is not found in Redis, set the data
        let newLotData = parkingLotsController.setLotData(req, res);
        const socketId = await redis.hget(user, "socketId");
        console.log(newLotData);
        console.log(socketId + user);
        emitToSpecificSocket(socketId, "lotData", newLotData);

        // Return the new lotData and set it in Redis
        await redis.set(ownerId, JSON.stringify(newLotData), "EX", 600);
        //return res.status(200).send(newLotData);
      }
    } catch (error) {
      console.error("Error in hadelLotDataCashe:", error);
      return res.status(500).send({ error: "Internal server error" });
    }
  },

  makeOneLotIotBooking: async (req, res) => {
    try {
      const { ownerId } = req.user;
      const { name, pincode } = req.body;
      let lotData = await ParkingLotModel.findOne({
        ownerId: ownerId,
        name: name,
        pincode: pincode,
      });

      if (!lotData) {
        return res.status(404).send({ error: "Parking lot not found" });
      }

      let lotUpdated = false;
      for (let i = 0; i < lotData.lots.length; i++) {
        if (
          lotData.lots[i].occupied === false &&
          lotData.lots[i].iotbooking === false
        ) {
          lotData.lots[i].iotbooking = true;
          lotUpdated = true;
          break;
        }
      }

      if (!lotUpdated) {
        return res
          .status(400)
          .send({ error: "No available lot for onspot booking consverion" });
      }

      await lotData.save();

      return res.status(200).send(lotData);
    } catch (error) {
      console.error("Error booking IoT lot:", error);
      return res.status(500).send({ error: "Internal server error" });
    }
  },
  makeOneLotOnlineBooking: async (req, res) => {
    try {
      const { ownerId } = req.user;
      const { name, pincode } = req.body;
      let lotData = await ParkingLotModel.findOne({
        ownerId: ownerId,
        name: name,
        pincode: pincode,
      });
      if (!lotData) {
        return res.status(404).send({ error: "Parking lot not found" });
      }
      let lotUpdated = false;
      for (let i = 0; i < lotData.lots.length; i++) {
        if (
          lotData.lots[i].occupied === false &&
          lotData.lots[i].iotbooking === true
        ) {
          lotData.lots[i].iotbooking = false;
          lotUpdated = true;
          break;
        }
      }
      if (!lotUpdated) {
        return res
          .status(400)
          .send({ error: "No available lot for onspot booking consverion" });
      }
      await lotData.save();
      return res.status(200).send(lotData);
    } catch (error) {
      console.error("Error booking online lot:", error);
      return res.status(500).send({ error: "Internal server error" });
    }
  },
  findParkingLotbyOwnerid: async (req, res) => {
    console.log(req.user);
    console.log("bbb");
    try {
      const { ownerId } = req.user;
      const result = await ParkingLotModel.find({ ownerId: ownerId });
      console.log(result);
      if (!result) {
        return res.status(404).send({ error: "Parking lot not found" });
      }
      return res.status(200).send(result);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  },
};
export default parkingLotsController;
