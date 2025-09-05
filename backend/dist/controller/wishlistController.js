"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const Wishlist_js_1 = __importDefault(require("../models/Wishlist.js"));
const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const wishlist = await Wishlist_js_1.default.find({ userId })
            .populate("productId", "name description price image")
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            data: wishlist,
            message: "Wishlist retrieved successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching wishlist",
            error,
        });
    }
};
exports.getWishlist = getWishlist;
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        if (!productId) {
            res.status(400).json({ success: false, message: "productId is required" });
            return;
        }
        const existing = await Wishlist_js_1.default.findOne({ userId, productId });
        if (existing) {
            res.status(400).json({ success: false, message: "Product already in wishlist" });
            return;
        }
        const newWishlistItem = new Wishlist_js_1.default({ userId, productId });
        await newWishlistItem.save();
        await newWishlistItem.populate("productId", "name description price image");
        res.status(201).json({
            success: true,
            message: "Product added to wishlist",
            data: newWishlistItem,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding to wishlist",
            error,
        });
    }
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const item = await Wishlist_js_1.default.findOneAndDelete({ userId, productId });
        if (!item) {
            res.status(404).json({
                success: false,
                message: "Wishlist item not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing from wishlist",
            error,
        });
    }
};
exports.removeFromWishlist = removeFromWishlist;
//# sourceMappingURL=wishlistController.js.map