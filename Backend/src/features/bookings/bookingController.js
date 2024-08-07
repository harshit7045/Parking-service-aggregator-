import bookingModel from "./bookingModel.js";

const bookingController = {
  createBooking: async (req, res) => {
   console.log(req.body);
    let x = {
      // email: req.user.email,
      parkingLotName: req.body.parkingLotName,
      pincode: req.body.pincode,
      vehicleUid: req.body.vehicleUid,
      ownersPhoneNumber: req.user.phoneNumber,
      timewiseBooking:
        req.body.bookingModel.model == "date"
          ? {}
          : {
              status: true,
              startTime: "2024-08-06T08:00:00Z",
              endTime: "2024-08-06T10:00:00Z",
              date: "2024-08-06",
            },
      datewiseBooking:
        req.body.bookingModel.model == "hour"
          ? {}
          : {
              status: false,
              startDate: req.body.bookingModel.date[0],
              endDate: req.body.bookingModel.date[1],
              
            },
    };

    //console.log(x);
    try {
      const booking = new bookingModel(req.body);
      const result = await booking.save();
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send(error);
      //console.log(error);
    }
  },
};

export default bookingController;
