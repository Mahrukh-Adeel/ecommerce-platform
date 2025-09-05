import mongoose, { Document } from "mongoose";
interface Product extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<Product, {}, {}, {}, mongoose.Document<unknown, {}, Product, {}, {}> & Product & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Product.d.ts.map