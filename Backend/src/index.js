import connectDB from "./db/db.js";
import dotenv from "dotenv";
import httpErrors from "http-errors";
import { app } from "./app.js";
import "./middleware/errorhandlers.js"; // Ensure you import your middleware
import userRouter from "./features/user/userRouter.js";

dotenv.config({ path: "./src/.env" });
const port = process.env.PORT || 7000;

import vehicleRouter from "./features/vehicle/vehicleRouter.js";
import parkingRouter from "./features/parking_lots/parkingRouter.js";
import bookingRouter from "./features/bookings/bookingRouter.js";
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

app.use("/api/users", userRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/parking", parkingRouter);
app.use("/api/bookings",bookingRouter)