import type { Request, Response } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

//For Admin
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('products.productId', 'name price images')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      message: "Orders retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error
    });
  }
};

export const getOrdersByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ userId })
      .populate('products.productId', 'name price images')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
      message: "User orders retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error
    });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id)
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error
    });
  }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, products, address, paymentMethod } = req.body;

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

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    let total = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
        return;
      }
      total += product.price * item.quantity;
    }

    const newOrder = new Order({
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Valid status is required",
        validStatuses
      });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error
    });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
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

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error
    });
  }
};