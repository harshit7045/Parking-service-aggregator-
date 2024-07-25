import express from"express";

const userRouter = express.Router();

userRouter.post('/register', (req, res) => {
    res.send('register');
});
export default userRouter;

