import { fetchCategories } from "../api/categoryApi";
import { fetchProductsByCategory } from "../api/productApi";
import type { CategoriesData } from "../models/CategoriesData";
import type { Category } from "../models/Category";

export const getCategoriesWithProducts = async (): Promise<CategoriesData[]> => {
    try{
        const categories = await fetchCategories();
        
        if (!Array.isArray(categories)) {
            console.error('Categories is not an array:', categories);
            return [];
        }
        
        const categoriesWithProducts = await Promise.all(
            categories.map(async (category: Category) => {
                try {
                    const products = await fetchProductsByCategory(category._id);
                    
                    return {
                        _id: category._id,
                        name: category.name,
                        description: category.description,
                        count: category.count,
                        products: Array.isArray(products) ? products : [],
                    };
                } catch (error) {
                    console.error(`Error fetching products for category ${category.name}:`, error);
                    return {
                        _id: category._id,
                        name: category.name,
                        description: category.description,
                        count: category.count,
                        products: [],
                    };
                }
            })
        );
        
        return categoriesWithProducts;
    } catch (error){
        console.error('Failed to fetch products with categories', error);
        return [];
    }
}