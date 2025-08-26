import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected");
    } catch {
        console.log("MongoDB Connection Failed");
        process.exit(1);
    }
}

export default connectDB;