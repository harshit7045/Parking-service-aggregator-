import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });

const db_name = "ParkEase";

const connectDB = async () => {
    const dbURI = `${process.env.MONGODB_URI}${db_name}`;
    console.log(`MongoDB URI: ${dbURI}`);
    try {
        const conn = await mongoose.connect(dbURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            dbName: db_name
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
