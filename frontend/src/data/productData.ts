import { fetchProductById } from "../api/productApi";
import { fetchCategoryById } from "../api/categoryApi";
import type { ProductData } from "../models/ProductData";
import type { Category } from "../models/Category";

export interface ProductWithCategory extends ProductData {
  category?: Category;
}

export const getProductWithCategory = async (productId: string): Promise<ProductWithCategory> => {
  try {
    const product = await fetchProductById(productId);
    console.log('Fetched product:', product);
    
    let category: Category | undefined;
    
    if (product.categoryId) {
      try {
        const categoryIdString = typeof product.categoryId === 'string' 
          ? product.categoryId 
          : product.categoryId._id;
        
        category = await fetchCategoryById(categoryIdString);
      } catch (err) {
        console.warn('Could not fetch category data:', err);
        if (typeof product.categoryId === 'object') {
          category = {
            _id: product.categoryId._id,
            name: product.categoryId.name,
            image: product.categoryId.image,
            count: 0 
          };
        }
      }
    }
    
    return {
      ...product,
      category
    };
  } catch (error) {
    console.error('Error fetching product with category:', error);
    throw error;
  }
};

export const getProductById = async (productId: string): Promise<ProductData> => {
  try {
    const product = await fetchProductById(productId);
    console.log('Fetched product:', product);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};