import mongoose from "mongoose";

const parkingLotOwnerSchema = new mongoose.Schema({
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
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  }
},
{ collection: 'parkingLotOwner' }
);

const parkingLotOwnerModel = mongoose.model('parkingLotOwner', parkingLotOwnerSchema);

export default parkingLotOwnerModel;
