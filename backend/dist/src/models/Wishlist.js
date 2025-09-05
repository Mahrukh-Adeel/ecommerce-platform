import mongoose, { Schema, Document } from "mongoose";
const wishlistSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Wishlist", wishlistSchema);
//# sourceMappingURL=Wishlist.js.map