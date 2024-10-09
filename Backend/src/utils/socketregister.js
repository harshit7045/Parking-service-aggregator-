import pkg from "jsonwebtoken";
import redis from "../db/redis.js";
import parkingLotsController from "../features/parking_lots/prakinglotscontroller.js";
const { verify } = pkg;

async function socketRegister(socketId, token) {
  if (!token) {
    console.log("No token provided");
    return { error: "No token provided" };
  }


  return new Promise((resolve, reject) => {
    verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.log("Token authentication failed:", err);
        return reject({ error: "Failed to authenticate token" }); // Reject the promise with an error
      }

      console.log("Decoded token:", decoded);

      try {
        await redis.hset(decoded.user, "socketId", socketId);
        console.log(`Stored socketId ${socketId} for user ${decoded.user}`);

        const reply = await redis.hget(decoded.user, "socketId");
        console.log("Value fetched from Redis:", reply);

        const req = {
          user: decoded,
          body: {
            name: "Parking Lot A"
          }
        };
        const res = {};

        let lotData = await parkingLotsController.setLotData(req, res);
        console.log("Parking lot data set successfully:", lotData);

        resolve(lotData); 
      } catch (err) {
        console.error("Error occurred:", err);
        reject(err); 
      }
    });
  });
}

export default socketRegister;
