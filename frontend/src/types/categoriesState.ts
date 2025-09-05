import type { Category } from '../models/Category';
import type { CategoriesData } from '../models/CategoriesData';

export interface CategoriesState {
  categories: Category[];
  categoriesWithProducts: CategoriesData[];
  currentCategory: Category | null;
  
  searchTerm: string;
  
  loading: boolean;
  error: string | null;
  
  setSearchTerm: (term: string) => void;
  fetchAllCategories: () => Promise<void>;
  fetchCategoriesWithProducts: () => Promise<void>;
  fetchSingleCategory: (categoryId: string) => Promise<void>;
  clearError: () => void;
  clearCurrentCategory: () => void;
}
