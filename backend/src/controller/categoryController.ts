import type { Request, Response } from "express";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

// Get all categories (for product forms and display)
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find()
      .select('name description image')
      .sort({ name: 1 });

    // For each category, count products in Product collection
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({ categoryId: category._id });
        return {
          ...category.toObject(),
          count,
          countDisplay: count > 0 ? `${count}+ items` : '0 items'
        };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCount,
      message: "Categories retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get categories",
      error
    });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId } = req.params;
    
    const products = await Product.find({ categoryId: categoryId })
      .populate('categoryId', 'name image')
      .lean();
    
    res.status(200).json({
      success: true,
      data: products,
      message: "Products retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error
    });
  }
};