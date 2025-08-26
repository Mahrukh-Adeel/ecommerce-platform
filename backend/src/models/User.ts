import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  joinDate?: Date;
  wishlist?: mongoose.Types.ObjectId[]; // Array of Product IDs
  orders?: mongoose.Types.ObjectId[];   // Array of Order IDs
  role?: "user" | "admin";              // User role
  isVerified?: boolean;                 // Email verification status
  isActive?: boolean;                   // Account active status
}

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  password: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<User>("User", UserSchema);