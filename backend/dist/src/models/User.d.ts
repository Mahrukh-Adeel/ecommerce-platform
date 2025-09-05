import mongoose from "mongoose";
export interface User extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    password?: string;
    joinDate?: Date;
    wishlist?: mongoose.Types.ObjectId[];
    orders?: mongoose.Types.ObjectId[];
    role?: "user" | "admin";
    isVerified?: boolean;
    isActive?: boolean;
    googleId?: string;
    avatar?: string;
    provider?: "local" | "google";
}
export type UserDocument = User;
declare const _default: mongoose.Model<User, {}, {}, {}, mongoose.Document<unknown, {}, User, {}, {}> & User & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map