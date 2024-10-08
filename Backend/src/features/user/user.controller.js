import userModel from "./user.model.js";
import vehicleModel from "../vehicle/vehicleModel.js";
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import cookieParser from 'cookie-parser';

const userController = {
  userRegister: async (req, res) => {
    try {
      console.log(req.body);
      const { email, password, phoneNumber, walletBalance, vehicles } = req.body;
      const user = new userModel({ email, password, phoneNumber, walletBalance });
      const result = await user.save();

      const savedVehicles = [];
      for (let i = 0; i < vehicles.length; i++) {
        const newVehicle = new vehicleModel(vehicles[i]);
        const savedVehicle = await newVehicle.save();
        savedVehicles.push(savedVehicle);
      }

      res.status(201).send({ user: result, vehicles: savedVehicles });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error", error });
    }
  },
  loginUser : async (req,res)=>{
    const {email,password} = req.body;
    const user = await userModel.findOne({email:email});
    if(!user){
      return res.status(404).send({message:"User not found"});
    }else{
      if(user.password == password){
        const token = sign({user:user.email, phoneNumber:user.phoneNumber},process.env.SECRET_KEY ,{expiresIn:"7d"});
        return res.cookie('tokenjwt', token, { httpOnly: false, secure: false, sameSite:'none' }).status(200).send({message:"Login Success",user:user, token:token})
      }else{
        return res.status(404).send({message:"Invalid credentials"});
      }
    }
  },
  getUser: async (req,res)=>{
    const email=req.user.user;
    const user = await userModel.findOne({email:email});
    if(!user){
      return res.status(404).send({message:"User not found"});
    }else{
      return res.status(200).send({user:user});
    }
  },
  getUserByVehicleUid: async (req, res) => {
    const { uid } = req.body;
    const user = await userModel.findOne({ uniqueIdentification: uid });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    } else {
      return res.status(200).send({ user: user });
    }
  },
  addWalletBalance: async (req, res) => {
    try {
      console.log("aaaa");
      console.log(req.body);
      const { amount } = req.body;
      const email=req.user.user;
      const phoneNumber=req.user.phoneNumber;
      const user = await userModel.findOne({ email: email, phoneNumber: phoneNumber });
      console.log(req.body);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      } 
      user.walletBalance += parseInt(amount)/200;
      await user.save();
      return res.status(200).send({ user: user.walletBalance });
      
      
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error", error });
    }
  },
  deductWalletBalance: async (req, res) => {
    try {
      const { email, phoneNumber, amount } = req.body;
      const user = await userModel.findOne({ email: email, phoneNumber: phoneNumber });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      user.walletBalance -= amount;
      await user.save();

      return res.status(200).send({ user: user });
      
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error", error });
    }
  },
};

export default userController;
