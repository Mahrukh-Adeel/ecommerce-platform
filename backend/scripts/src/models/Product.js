"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Product", ProductSchema);
