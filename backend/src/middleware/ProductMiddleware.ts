import type { Request, Response, NextFunction } from "express";
import Product from "../models/Product.js";

export const validateProductId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).select('_id');
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid product ID" });
  }
};

export const validateCreateProduct = (req: Request, res: Response, next: NextFunction) => {
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