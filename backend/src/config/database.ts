import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI, {
            // Add SSL/TLS options for better compatibility
            ssl: true,
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 30000, // 30 seconds
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
}

export default connectDB;