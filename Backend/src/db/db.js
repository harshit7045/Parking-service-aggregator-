// src/db/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });

const db_name = "ParkEase";

const connectDB = async () => {
    console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;

