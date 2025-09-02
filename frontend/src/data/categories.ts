import {type Category} from '../models/Category';
import { fetchCategories } from '../api/categoryApi';

export const getCategories = async (): Promise<Category[]> => {
    try {
      const categories = await fetchCategories();
      
      if (!Array.isArray(categories)) {
        console.error('Categories is not an array:', categories);
        return [];
      }

      return categories;
    } catch (error) {
      console.error('Error fetching categories', error);
      return [];
    }
};