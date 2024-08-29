import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  email: {
    type: String,
    required: true

  },
  bookingNumber: {
    type: String,
    required: true

  },
  model: {
    type: String,
    required: true

  },
  Lotno: {
    type: String,
    required: true

  },
  vehicleIn: {
    type: Boolean,
    required: true

  },
  name: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  vehicleUid: {
    type: String,
    required: true
  },
  ownersPhoneNumber: {
    type: String,
    required: true
  },
  timewiseBooking: {
    status: {
      type: Boolean,
      default: false
    },
    startTime: {
      type: String,
      
    },
    endTime: {
      type: String,
      
    },
    date: {
      type: Date,
      
    }
  },
  datewiseBooking: {
    status: {
      type: Boolean,
      default: false
      
    },
    startDate: {
      type: Date,
      
    },
    endDate: {
      type: Date,
      
    }
  },
  iotBooking: {
    startTime: {
      type: String,
      
    }
  }
}, {
  timestamps: true 
});

const bookingModel = mongoose.model('Booking', bookingSchema);
export default bookingModel;
