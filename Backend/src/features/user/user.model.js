import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  walletBalance: {
    type: Number,
    default: 100,
  },
},
{ collection: 'user_data' }
);

const userModel = mongoose.model('User', userSchema);

export default userModel;
