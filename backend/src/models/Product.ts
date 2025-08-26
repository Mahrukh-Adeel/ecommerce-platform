import mongoose, { Schema, Document } from "mongoose";

interface Product extends Document{
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<Product>({
    name: {type: String,required: true},
    description: {type: String, required: true},
    image: { type: String },
    categoryId: {type: Schema.Types.ObjectId, ref: 'Category', required: true}
}, {timestamps: true})

export default mongoose.model<Product>("Product", ProductSchema);