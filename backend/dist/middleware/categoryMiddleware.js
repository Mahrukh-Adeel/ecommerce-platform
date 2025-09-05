"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCategory = void 0;
const Category_js_1 = __importDefault(require("../models/Category.js"));
const validateCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const category = await Category_js_1.default.findById(categoryId).select('_id');
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found"
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid category ID"
        });
    }
};
exports.validateCategory = validateCategory;
//# sourceMappingURL=categoryMiddleware.js.map