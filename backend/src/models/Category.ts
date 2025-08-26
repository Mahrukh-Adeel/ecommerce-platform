import mongoose, { Schema, Document } from "mongoose";

interface Category extends Document {
  name: string;
  description: string;
  color?: string;
  image?: string;
}

const CategorySchema = new Schema<Category>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    color: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<Category>("Category", CategorySchema);
