// parking.router.js
import express from 'express';
import parkingLotsController from './prakinglotscontroller.js';
import authMiddleware from '../../middleware/jwtverification.js';
const parkingRouter = express.Router();

parkingRouter.post('/register', parkingLotsController.registerParkingLot);
parkingRouter.post('/makelotbookinghourwise', parkingLotsController.makeBookingOnlineHourWise);
parkingRouter.get('/getlots', authMiddleware, parkingLotsController.getParkingLots); 

export default parkingRouter;

