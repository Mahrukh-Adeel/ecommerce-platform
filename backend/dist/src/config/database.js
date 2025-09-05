import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected");
    }
    catch {
        console.log("MongoDB Connection Failed");
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=database.js.map