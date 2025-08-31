import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      maxlength: 50
    },
    description: { 
      type: String, 
      maxlength: 500 
    },
    image: { 
      type: String 
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


export default mongoose.model<ICategory>("Category", CategorySchema);