"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateProduct = exports.validateProductId = void 0;
const Product_js_1 = __importDefault(require("../models/Product.js"));
const validateProductId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product_js_1.default.findById(id).select('_id');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        next();
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Invalid product ID" });
    }
};
exports.validateProductId = validateProductId;
const validateCreateProduct = (req, res, next) => {
    const { name, price, categoryId } = req.body;
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ success: false, message: "Product name is required and must be a string" });
    }
    if (price === undefined || typeof price !== 'number') {
        return res.status(400).json({ success: false, message: "Product price is required and must be a number" });
    }
    if (!categoryId || typeof categoryId !== 'string') {
        return res.status(400).json({ success: false, message: "categoryId is required and must be a string" });
    }
    next();
};
exports.validateCreateProduct = validateCreateProduct;
//# sourceMappingURL=ProductMiddleware.js.map