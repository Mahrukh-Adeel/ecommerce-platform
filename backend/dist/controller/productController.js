"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProducts = exports.getProductById = exports.getProducts = void 0;
const Product_js_1 = __importDefault(require("../models/Product.js"));
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) {
            query = { categoryId: category };
        }
        const products = await Product_js_1.default.find(query)
            .populate('categoryId', 'name image')
            .select('name description price image categoryId createdAt')
            .sort({ createdAt: -1 })
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
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product_js_1.default.findById(id)
            .populate('categoryId', 'name description image')
            .lean();
        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: product,
            message: "Product retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching product",
            error
        });
    }
};
exports.getProductById = getProductById;
const createProducts = async (req, res) => {
    try {
        const { name, description, price, image, categoryId } = req.body;
        if (!name || !description || !price || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Name, description, price, and categoryId are required"
            });
        }
        if (typeof price !== "number") {
            return res.status(400).json({
                success: false,
                message: "Price must be a number"
            });
        }
        const newProduct = new Product_js_1.default({ name, description, price, image, categoryId });
        await newProduct.save();
        await newProduct.populate('categoryId', 'name image');
        res.status(201).json({
            success: true,
            data: newProduct,
            message: "Product created successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating product",
            error
        });
    }
};
exports.createProducts = createProducts;
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image, categoryId } = req.body;
    try {
        const product = await Product_js_1.default.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.image = image || product.image;
        product.categoryId = categoryId || product.categoryId;
        await product.save();
        res.status(200).json({
            success: true,
            data: product,
            message: "Product updated successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating product",
            error
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product_js_1.default.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error
        });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map