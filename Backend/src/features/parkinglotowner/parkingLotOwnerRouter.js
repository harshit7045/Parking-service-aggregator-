import express from 'express';
import parkingLotOwnerController from './parkingLotOwnerController.js';
import parkingLotsController from '../parking_lots/prakinglotscontroller.js';
import authMiddleware from '../../middleware/jwtverification.js';
const parkingLotOwnerRouter = express.Router();

parkingLotOwnerRouter.post('/login', parkingLotOwnerController.loginParkingLotOwner);
parkingLotOwnerRouter.post('/register', parkingLotOwnerController.registerParkingLotOwner,parkingLotsController.registerParkingLot);
parkingLotOwnerRouter.get('/getlots', authMiddleware, parkingLotsController.findParkingLotbyOwnerid);
parkingLotOwnerRouter.get('/profile', authMiddleware, parkingLotOwnerController.getownerprofile);
export default parkingLotOwnerRouter;
