import mongoose from 'mongoose';
const vehicleSchema = new mongoose.Schema({
  uniqueIdentification: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
 
  
});

const vehicleModel = mongoose.model('Vehicle', vehicleSchema);

 export default vehicleModel;
