import mongoose, { Schema, Document } from "mongoose";
const UserSchema = new Schema({
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
export default mongoose.model("User", UserSchema);
//# sourceMappingURL=User.js.map