import mongoose from 'mongoose';

// Define the schema for each booking
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  entryTime: {
    type: Date,
    required: true
  },
  exitTime: {
    type: Date
  }
});

// Define the parking lot schema
const parkingLotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  maxCapacity: {
    type: Number,
    required: true
  },
  lots: {
    type: [], 
    required: true
  },
  ownerPhoneNumber: {
    type: String,
    required: true
  },
  currentOccupancy: {
    type: Number,
    default: 0
  }
});

const ParkingLotModel = mongoose.model('ParkingLot', parkingLotSchema);

export default ParkingLotModel;
