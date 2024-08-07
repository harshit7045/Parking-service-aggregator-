// parking.router.js
import express from 'express';
import bookingController from './bookingController.js';
import authMiddleware from '../../middleware/jwtverification.js';
const bookingRouter = express.Router();

bookingRouter.post('/book',authMiddleware, bookingController.createBooking);
//bookingRouter.post('/login', UserController.loginUser);
//bookingRouter.get('/book', authMiddleware, parkingLotsController.getParkingLots); 
export default bookingRouter;

