import connectDB from "./db/db.js";
import dotenv, { parse } from "dotenv";
import paymentRouter from "./features/payments/paymentRouter.js";
import httpErrors from "http-errors";
import { app } from "./app.js";
import "./middleware/errorhandlers.js"; // Ensure you import your middleware
import userRouter from "./features/user/userRouter.js";
import Stripe from 'stripe';
const YOUR_DOMAIN = 'http://localhost:3000';
const stripe = new Stripe('sk_test_51PosA3H35XY8u0JzapupiEC7LHJRgpnoR5nQGAc6OznpLmstr2bqk5ezYsKU0zHx3lmOqDGU68lGgcPL6XonPnsi00vw3Rveja');


dotenv.config({ path: "./src/.env" });
const port = process.env.PORT || 7000;

import vehicleRouter from "./features/vehicle/vehicleRouter.js";
import parkingRouter from "./features/parking_lots/parkingRouter.js";
import bookingRouter from "./features/bookings/bookingRouter.js";
import iotRouter from "./features/iotbookings/iotRouter.js";
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

app.post('/create-checkout-session', async (req, res) => {
  console.log(req.body.amount);
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency:'usd',
          unit_amount: parseInt(req.body.amount),
          product_data: {
            name: 'Adding Money',
            description: 'Adding Money',
          }
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({clientSecret: session.client_secret});
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.use("/api/users", userRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/parking", parkingRouter);
app.use("/api/bookings",bookingRouter);
app.use("/api/iot",iotRouter);
app.use("/api/payment",paymentRouter);