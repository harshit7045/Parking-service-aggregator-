import connectDB from "./db/db.js";
import dotenv, { parse } from "dotenv";
import paymentRouter from "./features/payments/paymentRouter.js";
import httpErrors from "http-errors";
import { app } from "./app.js";
import "./middleware/errorhandlers.js"; // Ensure you import your middleware
import userRouter from "./features/user/userRouter.js";
import {socketServer} from "./socket.js";
import parkingLotOwnerRouter from "./features/parkinglotowner/parkingLotOwnerRouter.js";
dotenv.config({ path: "./src/.env" });
const port = process.env.PORT || 7000;

import vehicleRouter from "./features/vehicle/vehicleRouter.js";
import parkingRouter from "./features/parking_lots/parkingRouter.js";
import bookingRouter from "./features/bookings/bookingRouter.js";
import iotRouter from "./features/iotbookings/iotRouter.js";
const portSocket = process.env.SOCKETPORT || 2000;
connectDB()
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error(error);
    connectDB();
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
socketServer.listen(portSocket, () => {
  console.log(`Socket is running on port ${portSocket}`);
});
app.use("/api/users", userRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/parking", parkingRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/iot", iotRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/parkinglotowner", parkingLotOwnerRouter);
