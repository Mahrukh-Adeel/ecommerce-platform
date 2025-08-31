import type {Request, Response} from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find()
      .populate('categoryId', 'name image')
      .select('name description price image categoryId createdAt')
      .sort({ createdAt: -1 })
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

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id)
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error
    });
  }
};

export const createProducts = async (req: Request, res: Response) => {
  try {
    const { name, description, price, image, categoryId } = req.body;

    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({ message: "Name, description, price, and categoryId are required" });
    }

    if (typeof price !== "number") {
      return res.status(400).json({ message: "Price must be a number" });
    }

    const newProduct = new Product({ name, description, price, image, categoryId });
    await newProduct.save();

    await newProduct.populate('categoryId', 'name image');

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, image, categoryId } = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.image = image || product.image;
        product.categoryId = categoryId || product.categoryId;

        await product.save();

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};