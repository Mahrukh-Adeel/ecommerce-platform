import type { ProductData } from '../models/CategoriesData';
import type { ProductWithCategory } from '../data/productData';

export interface ProductsState {
  allProducts: ProductData[];
  filteredProducts: ProductData[];
  currentProduct: ProductWithCategory | null;
  
  searchTerm: string;
  sortBy: string;
  
  loading: boolean;
  error: string | null;
  
  setSearchTerm: (term: string) => void;
  setSortBy: (sortBy: string) => void;
  fetchAllProducts: () => Promise<void>;
  fetchProductsByCategory: (categoryId: string) => Promise<ProductData[]>;
  fetchSingleProduct: (productId: string) => Promise<void>;
  filterAndSortProducts: () => void;
  clearError: () => void;
  clearCurrentProduct: () => void;
}