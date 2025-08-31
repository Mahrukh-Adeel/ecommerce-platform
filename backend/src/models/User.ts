import mongoose, { Schema, Document } from "mongoose";

export interface User extends mongoose.Document {
  _id: mongoose.Types.ObjectId; 
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string; // Make optional for OAuth users
  joinDate?: Date;
  wishlist?: mongoose.Types.ObjectId[]; // Array of Product IDs
  orders?: mongoose.Types.ObjectId[];   // Array of Order IDs
  role?: "user" | "admin";              // User role
  isVerified?: boolean;                 // Email verification status
  isActive?: boolean;                   // Account active status
  
  // OAuth fields
  googleId?: string;
  avatar?: string;
  provider?: "local" | "google";
}

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  password: { type: String }, 
  joinDate: { type: Date, default: Date.now },
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // OAuth fields
  googleId: { type: String, sparse: true },
  avatar: { type: String },
  provider: { type: String, enum: ["local", "google"], default: "local" },
}, { timestamps: true });

export default mongoose.model<User>("User", UserSchema);