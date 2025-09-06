import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI, {
            ssl: true,
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
}

export default connectDB;