import express from 'express';
import iotController from './iotController.js';
const iotRouter = express.Router();

iotRouter.post('/book',iotController.iotbooking );

export default iotRouter;
