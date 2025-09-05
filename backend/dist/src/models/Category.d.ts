import mongoose, { Document } from "mongoose";
export interface ICategory extends Document {
    name: string;
    description?: string;
    image?: string;
}
declare const _default: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, {}> & ICategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Category.d.ts.map