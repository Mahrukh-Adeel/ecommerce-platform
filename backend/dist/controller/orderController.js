"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrderStatus = exports.createOrder = exports.getOrderById = exports.getOrdersByUser = exports.getAllOrders = void 0;
const Order_js_1 = __importDefault(require("../models/Order.js"));
const Product_js_1 = __importDefault(require("../models/Product.js"));
const User_js_1 = __importDefault(require("../models/User.js"));
//For Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order_js_1.default.find()
            .populate('userId', 'name email')
            .populate('products.productId', 'name price images')
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            data: orders,
            message: "Orders retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error
        });
    }
};
exports.getAllOrders = getAllOrders;
const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order_js_1.default.find({ userId })
            .populate('products.productId', 'name price images')
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            data: orders,
            message: "User orders retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user orders",
            error
        });
    }
};
exports.getOrdersByUser = getOrdersByUser;
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order_js_1.default.findById(id)
            .populate('userId', 'name email')
            .populate('products.productId', 'name price images')
            .lean();
        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: order,
            message: "Order retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching order",
            error
        });
    }
};
exports.getOrderById = getOrderById;
const createOrder = async (req, res) => {
    try {
        const { products, address, paymentMethod } = req.body;
        const userId = req.user?._id;
        if (!userId || !products || !address || !paymentMethod) {
            res.status(400).json({
                success: false,
                message: "User ID, products, address, and payment method are required"
            });
            return;
        }
        if (!Array.isArray(products) || products.length === 0) {
            res.status(400).json({
                success: false,
                message: "Products must be a non-empty array"
            });
            return;
        }
        const user = await User_js_1.default.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        let total = 0;
        for (const item of products) {
            const product = await Product_js_1.default.findById(item.productId);
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.productId} not found`
                });
                return;
            }
            total += product.price * item.quantity;
        }
        const newOrder = new Order_js_1.default({
            userId,
            products,
            total,
            address,
            paymentMethod
        });
        await newOrder.save();
        await newOrder.populate('userId', 'name email');
        await newOrder.populate('products.productId', 'name price images');
        res.status(201).json({
            success: true,
            data: newOrder,
            message: "Order created successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error
        });
    }
};
exports.createOrder = createOrder;
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ["placed", "processing", "shipped", "delivered", "cancelled"];
        if (!status || !validStatuses.includes(status)) {
            res.status(400).json({
                success: false,
                message: "Valid status is required",
                validStatuses
            });
            return;
        }
        const order = await Order_js_1.default.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
            .populate('userId', 'name email')
            .populate('products.productId', 'name price images');
        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: order,
            message: "Order status updated successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating order status",
            error
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order_js_1.default.findById(id);
        if (!order) {
            res.status(404).json({
                success: false,
                message: "Order not found"
            });
            return;
        }
        if (order.status === "shipped" || order.status === "delivered") {
            res.status(400).json({
                success: false,
                message: "Cannot cancel shipped or delivered orders"
            });
            return;
        }
        await Order_js_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Order cancelled successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error cancelling order",
            error
        });
    }
};
exports.deleteOrder = deleteOrder;
//# sourceMappingURL=orderController.js.map