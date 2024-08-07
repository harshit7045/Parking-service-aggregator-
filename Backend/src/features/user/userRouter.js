
// user.router.js
import express from 'express';
import UserController from './user.controller.js';
import authMiddleware from '../../middleware/jwtverification.js';
const userRouter = express.Router();

userRouter.post('/register', UserController.userRegister);
userRouter.post('/login', UserController.loginUser);
userRouter.get('/getuser', authMiddleware, UserController.getUser);
export default userRouter;

