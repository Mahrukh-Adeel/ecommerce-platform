import mongoose, { Schema } from "mongoose";
const CategorySchema = new Schema({
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
export default mongoose.model("Category", CategorySchema);
//# sourceMappingURL=Category.js.map