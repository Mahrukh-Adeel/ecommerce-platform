"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryById = exports.getProductsByCategory = exports.getCategories = void 0;
const Category_js_1 = __importDefault(require("../models/Category.js"));
const Product_js_1 = __importDefault(require("../models/Product.js"));
// Get all categories (for product forms and display)
const getCategories = async (req, res) => {
    try {
        const categories = await Category_js_1.default.find()
            .select('name description image')
            .sort({ name: 1 });
        const categoriesWithCount = await Promise.all(categories.map(async (category) => {
            const count = await Product_js_1.default.countDocuments({ categoryId: category._id });
            return {
                ...category.toObject(),
                count,
                countDisplay: count > 0 ? `${count}+ items` : '0 items'
            };
        }));
        res.status(200).json({
            success: true,
            data: categoriesWithCount,
            message: "Categories retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get categories",
            error
        });
    }
};
exports.getCategories = getCategories;
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product_js_1.default.find({ categoryId: categoryId })
            .populate('categoryId', 'name image')
            .lean();
        res.status(200).json({
            success: true,
            data: products,
            message: "Products retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error
        });
    }
};
exports.getProductsByCategory = getProductsByCategory;
const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category_js_1.default.findById(categoryId)
            .select('name description image')
            .lean();
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found"
            });
            return;
        }
        const count = await Product_js_1.default.countDocuments({ categoryId: categoryId });
        const categoryWithCount = {
            ...category,
            count,
            countDisplay: count > 0 ? `${count} items` : '0 items'
        };
        res.status(200).json({
            success: true,
            data: categoryWithCount,
            message: "Category retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching category",
            error
        });
    }
};
exports.getCategoryById = getCategoryById;
//# sourceMappingURL=categoryController.js.map