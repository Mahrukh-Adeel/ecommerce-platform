import mongoose, { Document } from "mongoose";
interface Order extends Document {
    userId: mongoose.Types.ObjectId;
    products: Array<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
    }>;
    total: number;
    status: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
    address: string;
    paymentMethod: string;
}
declare const _default: mongoose.Model<Order, {}, {}, {}, mongoose.Document<unknown, {}, Order, {}, {}> & Order & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Order.d.ts.map