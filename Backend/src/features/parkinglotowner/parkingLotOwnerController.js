import parkingLotOwnerModel from "./parkingLotOwnerModel.js";
import { v4 as uuidv4 } from "uuid";
import pkg from 'jsonwebtoken';
const { sign } = pkg;
const parkingLotOwnerController = {
  registerParkingLotOwner: async (req, res, next) => {
    const { email, password, phoneNumber, name } = req.body;
    console.log(email, password, phoneNumber, name);
    const ownerId = uuidv4();
    const newOwner = new parkingLotOwnerModel({
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      name: name,
      ownerId: ownerId,
    });
    try {
      const result = await newOwner.save();
      req.owner=result;
      next();
    } catch (error) {
      res.status(500).send(error);
    }
  },
  loginParkingLotOwner: async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await parkingLotOwnerModel.findOne({
        email: email,
        password: password,
      });
      console.log(result);
      if (result) {
        const token = sign({ user: result.email, phoneNumber: result.phoneNumber, ownerId: result.ownerId }, process.env.SECRET_KEY, {expiresIn:"7d"});
        res.cookie("tokenOwner", token, { httpOnly: false, secure: false, sameSite:'none' }).status(200).send({ message: "Login Success", user: result, token: token }) 
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  getownerprofile: async (req, res) => {
    console.log("dddd");
    
    try {
      let ownerId=req.user.ownerId;
      const result = await parkingLotOwnerModel.findOne({ ownerId: ownerId });
      res.status(200).send({ user: result });
      console.log(result);
      if(!result){
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

export default parkingLotOwnerController;
