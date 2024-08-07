import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));



export { app };
