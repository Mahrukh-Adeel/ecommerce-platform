import mongoose, { Schema, Document } from "mongoose";
const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true // Each user can have only one cart
    },
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
        },
    ],
}, { timestamps: true });
// no duplicate products in the same cart
CartSchema.index({ userId: 1, "items.productId": 1 }, { unique: true });
export default mongoose.model("Cart", CartSchema);
//# sourceMappingURL=Cart.js.map