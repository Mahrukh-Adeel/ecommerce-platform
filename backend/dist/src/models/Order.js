import mongoose, { Schema, Document } from "mongoose";
const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
        default: "placed",
    },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model("Order", OrderSchema);
//# sourceMappingURL=Order.js.map