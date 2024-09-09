import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  ownerEmail: {

    type: String,
    required: true

    
  },
  ownerId:{
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
