import mongoose, { Document } from "mongoose";
export interface Cart extends Document {
    userId: mongoose.Types.ObjectId;
    items: Array<{
        productId: mongoose.Types.ObjectId;
        quantity: number;
    }>;
}
declare const _default: mongoose.Model<Cart, {}, {}, {}, mongoose.Document<unknown, {}, Cart, {}, {}> & Cart & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Cart.d.ts.map