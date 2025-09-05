import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
export const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const authenticatedUserId = req.user?._id?.toString();
        if (userId !== authenticatedUserId && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: "Access denied"
            });
            return;
        }
        const cart = await Cart.findOne({ userId })
            .populate('items.productId', 'name price images stock')
            .lean();
        if (!cart) {
            res.status(200).json({
                success: true,
                data: {
                    items: [],
                    total: 0,
                    itemCount: 0
                },
                message: "Cart is empty"
            });
            return;
        }
        const total = cart.items.reduce((sum, item) => {
            if (item.productId) {
                return sum + (item.productId.price * item.quantity);
            }
            return sum;
        }, 0);
        const itemCount = cart.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
        res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                userId: cart.userId,
                items: cart.items,
                total,
                itemCount
            },
            message: "Cart retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching cart",
            error
        });
    }
};
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user?._id?.toString();
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }
        if (!productId) {
            res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
            return;
        }
        if (quantity <= 0) {
            res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
            return;
        }
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            });
            return;
        }
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity }]
            });
        }
        else {
            const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (existingItemIndex > -1) {
                cart.items[existingItemIndex].quantity += quantity;
            }
            else {
                cart.items.push({ productId, quantity });
            }
        }
        await cart.save();
        await cart.populate('items.productId', 'name price images stock');
        // Calculate total and itemCount like in getUserCart
        const total = cart.items.reduce((sum, item) => {
            if (item.productId) {
                return sum + (item.productId.price * item.quantity);
            }
            return sum;
        }, 0);
        const itemCount = cart.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
        res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                userId: cart.userId,
                items: cart.items,
                total,
                itemCount
            },
            message: "Item added to cart successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding item to cart",
            error
        });
    }
};
export const updateCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;
        const authenticatedUserId = req.user?._id?.toString();
        if (userId !== authenticatedUserId && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: "Access denied"
            });
            return;
        }
        if (!quantity || quantity <= 0) {
            res.status(400).json({
                success: false,
                message: "Valid quantity is required"
            });
            return;
        }
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            res.status(404).json({
                success: false,
                message: "Cart not found"
            });
            return;
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
            return;
        }
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.productId', 'name price images stock');
        // Calculate total and itemCount
        const total = cart.items.reduce((sum, item) => {
            if (item.productId) {
                return sum + (item.productId.price * item.quantity);
            }
            return sum;
        }, 0);
        const itemCount = cart.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
        res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                userId: cart.userId,
                items: cart.items,
                total,
                itemCount
            },
            message: "Cart item updated successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating cart item",
            error
        });
    }
};
export const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const authenticatedUserId = req.user?._id?.toString();
        if (userId !== authenticatedUserId && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: "Access denied"
            });
            return;
        }
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            res.status(404).json({
                success: false,
                message: "Cart not found"
            });
            return;
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
            return;
        }
        cart.items.splice(itemIndex, 1);
        await cart.save();
        await cart.populate('items.productId', 'name price images stock');
        // Calculate total and itemCount
        const total = cart.items.reduce((sum, item) => {
            if (item.productId) {
                return sum + (item.productId.price * item.quantity);
            }
            return sum;
        }, 0);
        const itemCount = cart.items.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
        res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                userId: cart.userId,
                items: cart.items,
                total,
                itemCount
            },
            message: "Item removed from cart successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing item from cart",
            error
        });
    }
};
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const authenticatedUserId = req.user?._id?.toString();
        if (userId !== authenticatedUserId && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: "Access denied"
            });
            return;
        }
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            res.status(404).json({
                success: false,
                message: "Cart not found"
            });
            return;
        }
        cart.items = [];
        await cart.save();
        res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error clearing cart",
            error
        });
    }
};
//# sourceMappingURL=cartController.js.map