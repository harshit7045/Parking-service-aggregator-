import express from 'express';
import vehicleController from './vehicleController.js';
import authMiddleware from '../../middleware/jwtverification.js';

const vehicleRouter = express.Router();

vehicleRouter.post('/createvehicle', authMiddleware, vehicleController.createVehicle);
vehicleRouter.get('/getvehicles', authMiddleware, vehicleController.getAllVehicles);

export default vehicleRouter;
